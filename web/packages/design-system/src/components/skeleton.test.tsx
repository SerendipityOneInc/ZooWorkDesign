import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Skeleton } from './skeleton'

describe('Skeleton', () => {
  it('renders with data-slot="skeleton"', () => {
    const { container } = render(<Skeleton />)
    expect(container.querySelector('[data-slot="skeleton"]')).toBeTruthy()
  })

  it('has animate-pulse and bg-muted classes', () => {
    const { container } = render(<Skeleton />)
    const el = container.querySelector('[data-slot="skeleton"]')
    expect(el).toHaveClass('animate-pulse')
    expect(el).toHaveClass('bg-muted')
  })

  it('accepts extra className', () => {
    const { container } = render(<Skeleton className="h-4 w-24" />)
    const el = container.querySelector('[data-slot="skeleton"]')
    expect(el).toHaveClass('h-4')
    expect(el).toHaveClass('w-24')
  })

  it('passes through children', () => {
    const { getByText } = render(<Skeleton>Loading</Skeleton>)
    expect(getByText('Loading')).toBeTruthy()
  })
})
