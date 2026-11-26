import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { RoughNavMarker } from './RoughNavMarker'

describe('RoughNavMarker', () => {
  it('renders one soft, round-ended brush stroke without adding semantics', () => {
    const { container } = render(<RoughNavMarker />)
    const svg = container.querySelector('svg')
    const brushStroke = container.querySelector('[data-slot="brush-stroke"]')

    expect(svg).toHaveAttribute('aria-hidden', 'true')
    expect(svg).toHaveClass('pv-nav-marker')
    expect(container.querySelectorAll('path')).toHaveLength(1)
    expect(brushStroke).toHaveAttribute('fill', 'none')
    expect(brushStroke).toHaveAttribute('stroke', 'currentColor')
    expect(brushStroke).toHaveAttribute('stroke-linecap', 'round')
  })
})
