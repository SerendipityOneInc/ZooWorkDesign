import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { Checkbox } from './checkbox'

describe('Checkbox', () => {
  it('renders a checkbox with data-slot, unchecked by default', () => {
    render(<Checkbox aria-label="agree" />)
    const cb = screen.getByRole('checkbox', { name: 'agree' })
    expect(cb).toHaveAttribute('data-slot', 'checkbox')
    expect(cb).toHaveAttribute('data-state', 'unchecked')
  })

  it('toggles and fires onCheckedChange when clicked', () => {
    const onCheckedChange = vi.fn()
    render(<Checkbox aria-label="agree" onCheckedChange={onCheckedChange} />)
    fireEvent.click(screen.getByRole('checkbox', { name: 'agree' }))
    expect(onCheckedChange).toHaveBeenCalledWith(true)
    expect(screen.getByRole('checkbox', { name: 'agree' })).toHaveAttribute('data-state', 'checked')
  })

  it('exposes data-state="indeterminate" on the root (drives the minus icon via group)', () => {
    render(<Checkbox aria-label="partial" checked="indeterminate" />)
    const cb = screen.getByRole('checkbox', { name: 'partial' })
    expect(cb).toHaveAttribute('data-state', 'indeterminate')
    // the indicator renders the minus glyph; the check is hidden via
    // group-data-[state=indeterminate]/checkbox on the icons.
    expect(cb.querySelector('[data-slot="checkbox-indicator"]')).toBeInTheDocument()
  })
})
