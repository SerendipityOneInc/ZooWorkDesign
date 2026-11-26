import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { AspectRatio } from './aspect-ratio'

describe('AspectRatio', () => {
  it('renders with data-slot="aspect-ratio"', () => {
    const { container } = render(<AspectRatio ratio={16 / 9} />)
    expect(container.querySelector('[data-slot="aspect-ratio"]')).toBeTruthy()
  })

  it('renders children inside', () => {
    const { getByText } = render(
      <AspectRatio ratio={16 / 9}>
        <span>Cover image</span>
      </AspectRatio>,
    )
    expect(getByText('Cover image')).toBeTruthy()
  })

  it('accepts extra className', () => {
    const { container } = render(<AspectRatio ratio={1} className="rounded-lg" />)
    // data-slot element should exist
    expect(container.querySelector('[data-slot="aspect-ratio"]')).toBeTruthy()
  })
})
