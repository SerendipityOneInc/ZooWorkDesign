// src/components/switch.test.tsx
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { Switch } from './switch'

describe('Switch', () => {
  it('renders a switch with data-slot, off by default', () => {
    render(<Switch aria-label="wifi" />)
    const sw = screen.getByRole('switch', { name: 'wifi' })
    expect(sw).toHaveAttribute('data-slot', 'switch')
    expect(sw).toHaveAttribute('data-state', 'unchecked')
  })

  it('toggles and fires onCheckedChange when clicked', () => {
    const onCheckedChange = vi.fn()
    render(<Switch aria-label="wifi" onCheckedChange={onCheckedChange} />)
    fireEvent.click(screen.getByRole('switch', { name: 'wifi' }))
    expect(onCheckedChange).toHaveBeenCalledWith(true)
    expect(screen.getByRole('switch', { name: 'wifi' })).toHaveAttribute('data-state', 'checked')
  })

  it('uses semantic neutral colors in both modes', () => {
    render(<Switch aria-label="wifi" />)
    const sw = screen.getByRole('switch', { name: 'wifi' })
    const thumb = sw.querySelector('[data-slot="switch-thumb"]')

    expect(sw).toHaveClass('data-unchecked:bg-selected')
    expect(sw).toHaveClass('data-checked:bg-primary')
    expect(sw).toHaveClass('data-disabled:bg-[var(--switch-track-disabled)]')
    expect(thumb).toHaveClass('bg-[var(--switch-thumb-off)]')
    expect(thumb).toHaveClass('group-data-checked/switch:bg-[var(--switch-thumb-on)]')
    expect(thumb).toHaveClass('group-data-disabled/switch:bg-[var(--switch-thumb-disabled)]')
  })
})
