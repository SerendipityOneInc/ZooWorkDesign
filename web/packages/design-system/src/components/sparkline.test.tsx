import { act, fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Sparkline } from './sparkline'
import { Statistic } from './statistic'

const labels = { label: 'Daily activity', emptyLabel: 'No data' }
describe('Sparkline', () => {
  it('distinguishes real zero observations from an empty or invalid series', () => {
    const { container, rerender } = render(<Sparkline {...labels} data={[{ label: 'Mon', value: 0 }, { label: 'Tue', value: 0 }]} />)
    expect(container.querySelector('path')).toHaveAttribute('d', 'M4 36 L252 36')
    expect(container.querySelector('linearGradient')).toHaveAttribute('gradientUnits', 'userSpaceOnUse')
    rerender(<Sparkline {...labels} data={[{ label: 'Mon', value: null }, { label: 'Tue', value: NaN }]} />)
    expect(container.querySelector('svg')).toBeNull()
    expect(screen.getByRole('img', { name: 'Daily activity: No data' })).toBeInTheDocument()
  })

  it('keeps missing observations as gaps and gives each chart a separate gradient', () => {
    const data = [{ label: 'Mon', value: 3 }, { label: 'Tue', value: null }, { label: 'Wed', value: 6 }]
    const { container } = render(<><Sparkline {...labels} data={data} /><Sparkline {...labels} data={data} /></>)
    const paths = container.querySelectorAll('path')
    expect(paths[0].getAttribute('d')).toBe('M4 20 M252 4')
    expect(paths[0].getAttribute('stroke')).not.toBe(paths[1].getAttribute('stroke'))
    expect(screen.getAllByRole('img')[0]).toHaveAccessibleName(/Tue: No data/)
  })

  it('lets keyboard users inspect values while skipping missing observations', async () => {
    render(<Sparkline {...labels} data={[{ label: 'Mon', value: 3 }, { label: 'Tue', value: null }, { label: 'Wed', value: 6 }]} />)
    const chart = screen.getByRole('img')
    act(() => chart.focus())
    expect(await screen.findByRole('tooltip')).toHaveTextContent('Wed: 6')
    fireEvent.keyDown(chart, { key: 'ArrowLeft' })
    expect(screen.getByRole('tooltip')).toHaveTextContent('Mon: 3')
    fireEvent.keyDown(chart, { key: 'End' })
    expect(screen.getByRole('tooltip')).toHaveTextContent('Wed: 6')
  })

  it('hides a stale trend while its statistic is loading', () => {
    const trend = <Sparkline {...labels} data={[{ label: 'Mon', value: 3 }]} />
    const { rerender } = render(<Statistic title="Activity" value={3} loading trend={trend} />)
    expect(screen.queryByRole('img')).toBeNull()
    rerender(<Statistic title="Activity" value={3} trend={trend} />)
    expect(screen.getByRole('img')).toHaveAccessibleName(/Mon: 3/)
  })
})
