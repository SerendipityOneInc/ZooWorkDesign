// src/components/input.test.tsx
import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { describe, expect, it } from 'vitest'

import { Input } from './input'

describe('Input', () => {
  it('renders an <input> with data-slot and forwards type + placeholder', () => {
    render(<Input type="email" placeholder="name@zooclaw.ai" />)
    const el = screen.getByPlaceholderText('name@zooclaw.ai')
    expect(el.tagName).toBe('INPUT')
    expect(el).toHaveAttribute('type', 'email')
    expect(el).toHaveAttribute('data-slot', 'input')
  })

  it('uses the control-sized rounded rectangle instead of the card or pill radius', () => {
    render(<Input aria-label="rounded rectangle input" />)
    const input = screen.getByLabelText('rounded rectangle input')

    expect(input).toHaveClass('rounded-md')
    expect(input).not.toHaveClass('rounded-lg', 'rounded-full')
  })

  it('merges a custom className', () => {
    render(<Input className="w-40" aria-label="x" />)
    expect(screen.getByLabelText('x')).toHaveClass('w-40')
  })

  it('uses the lighter form-control focus halo', () => {
    render(<Input aria-label="focusable input" />)
    expect(screen.getByLabelText('focusable input')).toHaveClass(
      'focus-visible:ring-2',
      'focus-visible:ring-ring/25',
    )
    expect(screen.getByLabelText('focusable input')).not.toHaveClass('focus-visible:ring-3')
  })

  it('uses the opaque 36px control surface', () => {
    render(<Input aria-label="surface input" />)
    expect(screen.getByLabelText('surface input')).toHaveClass('h-9', 'bg-control-background')
    expect(screen.getByLabelText('surface input')).not.toHaveClass('bg-transparent', 'dark:bg-input/30')
  })

  it('forwards a ref to the underlying <input> (React 19 ref-as-prop)', () => {
    const ref = createRef<HTMLInputElement>()
    render(<Input ref={ref} aria-label="r" />)
    expect(ref.current).toBeInstanceOf(HTMLInputElement)
    expect(ref.current).toHaveAttribute('data-slot', 'input')
  })
})
