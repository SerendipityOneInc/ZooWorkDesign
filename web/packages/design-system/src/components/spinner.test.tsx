import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Spinner } from './spinner'

describe('Spinner', () => {
  it('renders with data-slot="spinner"', () => {
    const { container } = render(<Spinner />)
    expect(container.querySelector('[data-slot="spinner"]')).toBeTruthy()
  })

  it('has animate-spin class', () => {
    const { container } = render(<Spinner />)
    expect(container.querySelector('[data-slot="spinner"]')).toHaveClass('animate-spin')
  })

  it('has role="status" and aria-label', () => {
    const { container } = render(<Spinner />)
    const el = container.querySelector('[data-slot="spinner"]')
    expect(el).toHaveAttribute('role', 'status')
    expect(el).toHaveAttribute('aria-label', 'Loading')
  })

  it('has default size-4 class', () => {
    const { container } = render(<Spinner />)
    expect(container.querySelector('[data-slot="spinner"]')).toHaveClass('size-4')
  })

  it('accepts extra className', () => {
    const { container } = render(<Spinner className="size-6" />)
    expect(container.querySelector('[data-slot="spinner"]')).toHaveClass('size-6')
  })
})
