import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { Toggle } from './toggle'

describe('Toggle', () => {
  it('renders with data-slot="toggle" and initial state off', () => {
    render(<Toggle aria-label="Bold">B</Toggle>)
    const btn = screen.getByRole('button', { name: 'Bold' })
    expect(btn).toHaveAttribute('data-slot', 'toggle')
    expect(btn).toHaveAttribute('data-state', 'off')
  })

  it('toggles to on state when clicked', () => {
    render(<Toggle aria-label="Italic">I</Toggle>)
    const btn = screen.getByRole('button', { name: 'Italic' })
    fireEvent.click(btn)
    expect(btn).toHaveAttribute('data-state', 'on')
  })

  it('fires onPressedChange when toggled', () => {
    const onPressedChange = vi.fn()
    render(
      <Toggle aria-label="Underline" onPressedChange={onPressedChange}>
        U
      </Toggle>,
    )
    fireEvent.click(screen.getByRole('button', { name: 'Underline' }))
    expect(onPressedChange).toHaveBeenCalledWith(true)
  })

  it('applies outline variant class when variant="outline"', () => {
    render(
      <Toggle aria-label="Align" variant="outline">
        Left align
      </Toggle>,
    )
    expect(screen.getByRole('button', { name: 'Align' })).toHaveClass('border')
  })

  it('uses hover color without changing the persistent on-state fill', () => {
    render(<Toggle aria-label="Bold">B</Toggle>)
    const btn = screen.getByRole('button', { name: 'Bold' })
    expect(btn).toHaveClass('hover:bg-hover')
    expect(btn).toHaveClass('data-[state=on]:bg-selected')
  })
})
