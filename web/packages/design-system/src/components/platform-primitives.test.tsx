import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { Segmented } from './segmented'
import { Splitter } from './splitter'
import { Calendar } from './calendar'
import { Carousel } from './carousel'
import { Statistic, StatisticCountdown } from './statistic'

afterEach(() => { cleanup(); vi.restoreAllMocks(); vi.useRealTimers() })

describe('Segmented', () => {
  const options = [{ value: 'all', label: 'All' }, { value: 'mine', label: 'My agents' },
    { value: 'shared', label: 'Shared with me', disabled: true }]
  it('selects a single value, submits it under name, and ignores disabled options', () => {
    const { container } = render(<form><Segmented options={options} defaultValue="all" name="scope" aria-label="Scope" /></form>)
    fireEvent.click(screen.getByRole('radio', { name: 'My agents' }))
    expect(screen.getByRole('radio', { name: 'My agents' })).toHaveAttribute('aria-checked', 'true')
    expect(screen.getByRole('radio', { name: 'All' })).toHaveAttribute('aria-checked', 'false')
    fireEvent.click(screen.getByRole('radio', { name: 'Shared with me' }))
    expect(new FormData(container.querySelector('form')!).get('scope')).toBe('mine')
  })
  it('notifies a controlled owner without changing the supplied value', () => {
    const change = vi.fn()
    render(<Segmented options={options} value="all" onValueChange={change} />)
    fireEvent.click(screen.getByRole('radio', { name: 'My agents' }))
    expect(change).toHaveBeenCalledWith('mine')
    expect(screen.getByRole('radio', { name: 'All' })).toHaveAttribute('aria-checked', 'true')
  })
  it('moves vertical selection by keyboard and skips unavailable items', async () => {
    render(<Segmented options={options} defaultValue="mine" orientation="vertical" />)
    act(() => screen.getByRole('radio', { name: 'My agents' }).focus())
    fireEvent.keyDown(document.activeElement!, { key: 'ArrowDown' })
    await waitFor(() => expect(screen.getByRole('radio', { name: 'All' })).toHaveFocus())
    expect(screen.getByRole('radio', { name: 'All' })).toHaveAttribute('aria-checked', 'true')
  })
})

describe('Splitter', () => {
  const content = { first: <p>Chat</p>, second: <p>Settings</p> }
  function width(px: number) { vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(px) }
  it('clamps keyboard resizing to both 360px minimums and resets', () => {
    width(1000)
    render(<Splitter {...content} />)
    const handle = screen.getByRole('separator')
    fireEvent.keyDown(handle, { key: 'ArrowRight' })
    expect(handle).toHaveAttribute('aria-valuenow', '52')
    fireEvent.keyDown(handle, { key: 'End' })
    expect(handle).toHaveAttribute('aria-valuenow', '64')
    fireEvent.keyDown(handle, { key: 'Home' })
    expect(handle).toHaveAttribute('aria-valuenow', '36')
    fireEvent.doubleClick(handle)
    expect(handle).toHaveAttribute('aria-valuenow', '50')
  })
  it('scales both minima in a narrow container without overflowing', () => {
    width(500)
    render(<Splitter {...content} defaultValue={90} />)
    const handle = screen.getByRole('separator')
    expect(handle).toHaveAttribute('aria-valuemin', '50')
    expect(handle).toHaveAttribute('aria-valuemax', '50')
    expect(handle).toHaveAttribute('aria-valuenow', '50')
  })
  it('keeps the divider under the pointer inside a scaled canvas', () => {
    width(1000)
    const { container } = render(<Splitter {...content} />)
    const root = container.querySelector<HTMLElement>('[data-slot="splitter"]')!
    vi.spyOn(root, 'getBoundingClientRect').mockReturnValue({ width: 500, height: 280 } as DOMRect)
    const handle = screen.getByRole('separator')
    fireEvent(handle, new MouseEvent('pointerdown', { bubbles: true, button: 0, clientX: 250 }))
    fireEvent(handle, new MouseEvent('pointermove', { bubbles: true, clientX: 300 }))
    expect(handle).toHaveAttribute('aria-valuenow', '60')
  })
  it('supports vertical keyboard resizing and controlled values', () => {
    vi.spyOn(HTMLElement.prototype, 'clientHeight', 'get').mockReturnValue(400)
    const onValueChange = vi.fn()
    const { rerender } = render(<Splitter {...content} orientation="vertical" value={50} minFirst={100} minSecond={100} onValueChange={onValueChange} />)
    const handle = screen.getByRole('separator')
    expect(handle).toHaveAttribute('aria-orientation', 'horizontal')
    fireEvent.keyDown(handle, { key: 'ArrowDown' })
    expect(onValueChange).toHaveBeenCalledWith(56)
    expect(handle).toHaveAttribute('aria-valuenow', '50')
    rerender(<Splitter {...content} disabled onValueChange={onValueChange} />)
    onValueChange.mockClear()
    fireEvent.keyDown(handle, { key: 'ArrowRight' })
    expect(onValueChange).not.toHaveBeenCalled()
  })
  it('resizes while dragging, clamps at the limit, and stops on window blur', () => {
    width(1000)
    const { container } = render(<Splitter {...content} />)
    const handle = screen.getByRole('separator')
    fireEvent(handle, new MouseEvent('pointerdown', { bubbles: true, button: 0, clientX: 500 }))
    fireEvent(handle, new MouseEvent('pointermove', { bubbles: true, clientX: 900 }))
    expect(handle).toHaveAttribute('aria-valuenow', '64')
    fireEvent(window, new Event('blur'))
    fireEvent(handle, new MouseEvent('pointermove', { bubbles: true, clientX: 100 }))
    expect(handle).toHaveAttribute('aria-valuenow', '64')
    expect(container.querySelector('[data-slot="splitter"]')).toHaveAttribute('data-dragging', 'false')
  })
})

describe('Calendar', () => {
  it('moves from January 31 to leap-day February with PageDown', () => {
    const onValueChange = vi.fn()
    render(<Calendar defaultValue={new Date(2024, 0, 31)} onValueChange={onValueChange} />)
    const date = screen.getByRole('button', { name: 'Wednesday, January 31, 2024' })
    act(() => date.focus())
    fireEvent.keyDown(date, { key: 'PageDown' })
    const leap = screen.getByRole('button', { name: 'Thursday, February 29, 2024' })
    expect(leap).toHaveFocus()
    fireEvent.click(leap)
    expect(onValueChange).toHaveBeenCalledWith(new Date(2024, 1, 29))
    expect(leap.closest('td')).toHaveAttribute('aria-selected', 'true')
  })
  it('skips disabled weekends during keyboard navigation', () => {
    render(<Calendar defaultValue={new Date(2024, 2, 1)} disabled={d => [0, 6].includes(d.getDay())} />)
    const friday = screen.getByRole('button', { name: 'Friday, March 1, 2024' })
    act(() => friday.focus())
    fireEvent.keyDown(friday, { key: 'ArrowRight' })
    expect(screen.getByRole('button', { name: 'Monday, March 4, 2024' })).toHaveFocus()
    expect(screen.getByRole('button', { name: 'Saturday, March 2, 2024' })).toBeDisabled()
  })
  it('enforces min/max and keeps controlled selection unchanged until the parent updates', () => {
    const onValueChange = vi.fn()
    render(<Calendar value={new Date(2024, 1, 15)} minDate={new Date(2024, 1, 10)} maxDate={new Date(2024, 1, 20)} onValueChange={onValueChange} />)
    expect(screen.getByRole('button', { name: 'Previous month' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Next month' })).toBeDisabled()
    fireEvent.click(screen.getByRole('button', { name: 'Friday, February 9, 2024' }))
    expect(onValueChange).not.toHaveBeenCalled()
    fireEvent.click(screen.getByRole('button', { name: 'Friday, February 16, 2024' }))
    expect(onValueChange).toHaveBeenCalledWith(new Date(2024, 1, 16))
    expect(screen.getByRole('button', { name: 'Thursday, February 15, 2024' }).closest('td')).toHaveAttribute('aria-selected', 'true')
  })
  it('keeps a controlled month while requesting the next month', () => {
    const onMonthChange = vi.fn()
    render(<Calendar month={new Date(2026, 11, 1)} onMonthChange={onMonthChange} />)
    fireEvent.click(screen.getByRole('button', { name: 'Next month' }))
    expect(onMonthChange).toHaveBeenCalledWith(new Date(2027, 0, 1))
    expect(screen.getByRole('grid')).toHaveAccessibleName('December 2026')
  })
})

describe('Carousel', () => {
  const slides = [<button key="a">First action</button>, <button key="b">Second action</button>, <button key="c">Third action</button>]
  it('bounds arrow navigation, supports dots, and removes hidden slides from navigation', () => {
    const { container } = render(<Carousel>{slides}</Carousel>)
    expect(screen.getByRole('button', { name: 'Previous slide' })).toBeDisabled()
    expect(screen.queryByRole('button', { name: 'Second action' })).not.toBeInTheDocument()
    expect(container.querySelectorAll('[data-slot="carousel-slide"][inert]')).toHaveLength(2)
    fireEvent.click(screen.getByRole('button', { name: 'Next slide' }))
    expect(screen.getByRole('button', { name: 'Second action' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Slide 3 of 3' }))
    expect(screen.getByRole('button', { name: 'Next slide' })).toBeDisabled()
  })
  it('supports keyboard bounds and preserves controlled selection', () => {
    const onIndexChange = vi.fn()
    const { container } = render(<Carousel index={0} onIndexChange={onIndexChange}>{slides}</Carousel>)
    fireEvent.keyDown(container.querySelector('[data-slot="carousel-viewport"]')!, { key: 'End' })
    expect(onIndexChange).toHaveBeenCalledWith(2)
    expect(screen.getByRole('button', { name: 'First action' })).toBeInTheDocument()
  })
  it('loops explicitly and handles an empty collection', () => {
    const { rerender } = render(<Carousel loop>{slides}</Carousel>)
    fireEvent.click(screen.getByRole('button', { name: 'Previous slide' }))
    expect(screen.getByRole('button', { name: 'Third action' })).toBeInTheDocument()
    rerender(<Carousel>{[]}</Carousel>)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })
  it('swipes without activating slide actions and allows subsequent keyboard activation', () => {
    const action = vi.fn()
    const { container } = render(<Carousel><button>First</button><button onClick={action}>Second</button></Carousel>)
    const viewport = container.querySelector('[data-slot="carousel-viewport"]')!
    const pointer = (type: string, x: number) => {
      const event = new MouseEvent(type, { bubbles: true, clientX: x, clientY: 10 })
      Object.defineProperty(event, 'pointerType', { value: 'touch' })
      fireEvent(viewport, event)
    }
    pointer('pointerdown', 200)
    pointer('pointerup', 80)
    const second = screen.getByRole('button', { name: 'Second' })
    fireEvent.click(second)
    expect(action).not.toHaveBeenCalled()
    fireEvent.keyDown(second, { key: 'Enter' })
    fireEvent.click(second)
    expect(action).toHaveBeenCalledTimes(1)
  })
})

describe('Statistic', () => {
  it('formats precision, separators and units without losing zero', () => {
    const { rerender } = render(<Statistic title="Usage" value={12345.6} precision={2} groupSeparator=" " decimalSeparator="," prefix="$" suffix="USD" />)
    expect(screen.getByText('12 345,60')).toBeInTheDocument()
    rerender(<Statistic title="Usage" value={0} />)
    expect(screen.getByText('0')).toBeInTheDocument()
    rerender(<Statistic title="Usage" value={null} suffix="USD" />)
    expect(screen.getByText('—')).toBeInTheDocument()
    expect(screen.queryByText('USD')).not.toBeInTheDocument()
  })
  it('supports locale, formatter and loading', () => {
    const { rerender } = render(<Statistic title="Count" value={1000.1} locale="de-DE" />)
    expect(screen.getByText('1.000,1')).toBeInTheDocument()
    rerender(<Statistic title="Count" value={1000} formatter={n => String(Number(n) / 1000) + 'k'} />)
    expect(screen.getByText('1k')).toBeInTheDocument()
    rerender(<Statistic title="Count" value={1000} loading />)
    expect(screen.getByRole('status', { name: 'Loading' })).toBeInTheDocument()
    expect(screen.queryByText('1,000')).not.toBeInTheDocument()
  })
  it('counts down from wall time, finishes once and cleans up its timer', () => {
    vi.useFakeTimers()
    vi.setSystemTime(1000000)
    const finish = vi.fn()
    const { unmount } = render(<StatisticCountdown title="Remaining" target={1005000} onFinish={finish} />)
    expect(screen.getByText('00:00:05')).toBeInTheDocument()
    act(() => { vi.advanceTimersByTime(5500) })
    expect(screen.getByText('00:00:00')).toBeInTheDocument()
    expect(finish).toHaveBeenCalledTimes(1)
    act(() => { vi.advanceTimersByTime(5000) })
    expect(finish).toHaveBeenCalledTimes(1)
    unmount()
    expect(vi.getTimerCount()).toBe(0)
  })
})
