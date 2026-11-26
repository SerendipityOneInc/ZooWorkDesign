import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { Tabs, TabsList, TabsTrigger } from './tabs'
import { ConnectorToolbar } from '../product-patterns/connector-toolbar'

let secondWidth = 150
beforeEach(() => {
  secondWidth = 150
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (this: HTMLElement) {
    const second = this.textContent === 'Shared with me'
    const isControl = this.getAttribute('role') === 'tab' || this.tagName === 'BUTTON'
    const isLabel = this.dataset.slot === 'selection-label'
    return {
      x: 100,
      y: 40,
      left: (second ? 180 : 100) + (isLabel ? 8 : 0),
      top: 40,
      width: isLabel ? (second ? secondWidth - 16 : 44) : isControl ? (second ? secondWidth : 60) : 400,
      height: 32,
      right: 500,
      bottom: 72,
      toJSON: () => ({}),
    }
  })
})
afterEach(() => vi.restoreAllMocks())

describe('moving selection indicator', () => {
  it('uses layout coordinates when an ancestor scales the rendered controls', () => {
    vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockReturnValue(800)
    vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockReturnValue(64)
    const { container } = render(<Tabs defaultValue="all"><TabsList>
      <TabsTrigger value="all">All</TabsTrigger>
    </TabsList></Tabs>)
    expect(container.querySelector('[data-slot="selection-indicator"]')).toHaveStyle({ width: '120px', height: '64px' })
  })
  it('follows controlled selection and resize without moving label content', async () => {
    const example = (value: string) => (
      <Tabs value={value}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="shared">Shared with me</TabsTrigger>
        </TabsList>
      </Tabs>
    )
    const { container, rerender } = render(example('all'))
    const indicator = () => container.querySelector('[data-slot="selection-indicator"]')
    expect(indicator()).toHaveStyle({ left: '0px', width: '60px' })
    rerender(example('shared'))
    await waitFor(() => expect(indicator()).toHaveStyle({ left: '80px', width: '150px' }))
    expect(screen.getByRole('tab', { name: 'Shared with me' })).toHaveAttribute('aria-selected', 'true')
    secondWidth = 180
    fireEvent(window, new Event('resize'))
    await waitFor(() => expect(indicator()).toHaveStyle({ width: '180px' }))
    expect(container.querySelectorAll('[data-slot="selection-indicator"]')).toHaveLength(1)
  })

  it('draws a new line at the selected label width while keeping other lists independent', async () => {
    const { container } = render(
      <>
        <Tabs defaultValue="all">
          <TabsList variant="line">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="shared">Shared with me</TabsTrigger>
          </TabsList>
        </Tabs>
        <Tabs defaultValue="a">
          <TabsList>
            <TabsTrigger value="a">A</TabsTrigger>
          </TabsList>
        </Tabs>
      </>,
    )
    const firstLine = container.querySelector('[data-variant="line"][data-slot="selection-indicator"]')
    expect(firstLine).toHaveStyle({ left: '8px', width: '44px' })
    fireEvent.mouseDown(screen.getByRole('tab', { name: 'Shared with me' }), { button: 0, ctrlKey: false })
    await waitFor(() =>
      expect(container.querySelector('[data-variant="line"][data-slot="selection-indicator"]')).toHaveStyle({
        left: '88px',
        width: '134px',
        height: '2px',
      }),
    )
    const currentLine = container.querySelector('[data-variant="line"][data-slot="selection-indicator"]')
    expect(currentLine).not.toBe(firstLine)
    secondWidth = 180
    fireEvent(window, new Event('resize'))
    await waitFor(() => expect(currentLine).toHaveStyle({ width: '164px' }))
    expect(container.querySelector('[data-variant="line"][data-slot="selection-indicator"]')).toBe(currentLine)
    expect(container.querySelectorAll('[data-slot="selection-indicator"]')[1]).toHaveStyle({
      left: '0px',
      width: '60px',
    })
  })

  it('tracks connector category changes while preserving its button contract', async () => {
    const onCategoryChange = vi.fn()
    const props = {
      categories: [
        { value: 'all', label: 'All' },
        { value: 'shared', label: 'Shared with me' },
      ],
      query: '',
      onQueryChange: vi.fn(),
      onCategoryChange,
      searchPlaceholder: 'Search',
    }
    const { container, rerender } = render(<ConnectorToolbar {...props} category="all" />)
    fireEvent.click(screen.getByRole('button', { name: 'Shared with me' }))
    expect(onCategoryChange).toHaveBeenCalledWith('shared')
    rerender(<ConnectorToolbar {...props} category="shared" />)
    await waitFor(() =>
      expect(container.querySelector('[data-slot="selection-indicator"]')).toHaveStyle({
        left: '88px',
        width: '134px',
        height: '2px',
      }),
    )
  })
})
