import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Slider } from './slider'

describe('Slider', () => {
  it('keeps the slider accessible while allowing decorative range and thumb content', () => {
    const { container } = render(<Slider value={[75]} thumbProps={{ 'aria-label': 'Thinking effort', 'aria-valuetext': 'High', children: <span aria-hidden="true">spark</span> }}
      rangeProps={{ children: <span data-testid="track-effect" aria-hidden="true" /> }} />)
    expect(screen.getByRole('slider', { name: 'Thinking effort' })).toHaveAttribute('aria-valuetext', 'High')
    expect(container.querySelector('[data-slot="slider-range"]')).toContainElement(screen.getByTestId('track-effect'))
    expect(screen.getByRole('slider')).toHaveTextContent('spark')
  })
  it('renders with data-slot="slider"', () => {
    render(<Slider data-testid="sl" defaultValue={[30]} aria-label="Volume" />)
    expect(screen.getByTestId('sl')).toHaveAttribute('data-slot', 'slider')
  })

  it('renders a slider thumb with correct role and data-slot', () => {
    render(<Slider defaultValue={[50]} aria-label="Brightness" />)
    // Radix Slider renders thumb elements with role="slider"
    const thumbs = screen.getAllByRole('slider')
    expect(thumbs).toHaveLength(1)
    expect(thumbs[0]).toHaveAttribute('data-slot', 'slider-thumb')
  })

  it('renders two thumbs for a range slider', () => {
    render(<Slider defaultValue={[20, 80]} aria-label="Price range" />)
    const thumbs = screen.getAllByRole('slider')
    expect(thumbs).toHaveLength(2)
  })

  it('slider-range carries data-slot="slider-range"', () => {
    const { container } = render(<Slider defaultValue={[40]} aria-label="Progress" />)
    expect(container.querySelector('[data-slot="slider-range"]')).toBeInTheDocument()
  })
})
