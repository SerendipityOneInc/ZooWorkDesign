import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Separator } from './separator'

describe('Separator', () => {
  it('renders with data-slot="separator"', () => {
    const { container } = render(<Separator />)
    const el = container.querySelector('[data-slot="separator"]')
    expect(el).toBeInTheDocument()
  })

  it('defaults to horizontal orientation', () => {
    const { container } = render(<Separator />)
    const el = container.querySelector('[data-slot="separator"]')
    expect(el).toHaveAttribute('data-orientation', 'horizontal')
  })

  it('accepts vertical orientation', () => {
    const { container } = render(<Separator orientation="vertical" />)
    const el = container.querySelector('[data-slot="separator"]')
    expect(el).toHaveAttribute('data-orientation', 'vertical')
  })

  it('applies bg-border class', () => {
    const { container } = render(<Separator />)
    const el = container.querySelector('[data-slot="separator"]')
    expect(el).toHaveClass('bg-border')
  })

  it('merges extra className', () => {
    const { container } = render(<Separator className="my-custom" />)
    const el = container.querySelector('[data-slot="separator"]')
    expect(el).toHaveClass('my-custom')
  })
})
