// src/components/textarea.test.tsx
import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { describe, expect, it } from 'vitest'

import { Textarea } from './textarea'

describe('Textarea', () => {
  it('renders a <textarea> with data-slot', () => {
    render(<Textarea placeholder="Message…" />)
    const el = screen.getByPlaceholderText('Message…')
    expect(el.tagName).toBe('TEXTAREA')
    expect(el).toHaveAttribute('data-slot', 'textarea')
  })

  it('merges a custom className', () => {
    render(<Textarea className="w-full" aria-label="y" />)
    expect(screen.getByLabelText('y')).toHaveClass('w-full')
  })

  it('uses the lighter form-control focus halo', () => {
    render(<Textarea aria-label="focusable textarea" />)
    expect(screen.getByLabelText('focusable textarea')).toHaveClass(
      'focus-visible:ring-2',
      'focus-visible:ring-ring/25',
    )
    expect(screen.getByLabelText('focusable textarea')).not.toHaveClass('focus-visible:ring-3')
  })

  it('forwards a ref to the underlying <textarea> (React 19 ref-as-prop)', () => {
    const ref = createRef<HTMLTextAreaElement>()
    render(<Textarea ref={ref} aria-label="r" />)
    expect(ref.current).toBeInstanceOf(HTMLTextAreaElement)
    expect(ref.current).toHaveAttribute('data-slot', 'textarea')
  })
})
