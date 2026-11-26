import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { ToggleGroup, ToggleGroupItem } from './toggle-group'

describe('ToggleGroup', () => {
  it('renders with data-slot="toggle-group"', () => {
    render(
      <ToggleGroup type="single" data-testid="tg" aria-label="Alignment">
        <ToggleGroupItem value="left">Left</ToggleGroupItem>
        <ToggleGroupItem value="center">Center</ToggleGroupItem>
        <ToggleGroupItem value="right">Right</ToggleGroupItem>
      </ToggleGroup>,
    )
    expect(screen.getByTestId('tg')).toHaveAttribute('data-slot', 'toggle-group')
  })

  it('renders items with data-slot="toggle-group-item"', () => {
    render(
      <ToggleGroup type="single" aria-label="View">
        <ToggleGroupItem value="list">List</ToggleGroupItem>
        <ToggleGroupItem value="grid">Grid</ToggleGroupItem>
      </ToggleGroup>,
    )
    // In single mode Radix uses role="radio" for items
    const items = screen.getAllByRole('radio')
    for (const item of items) {
      expect(item).toHaveAttribute('data-slot', 'toggle-group-item')
    }
  })

  it('selects an item when clicked (single mode)', () => {
    render(
      <ToggleGroup type="single" aria-label="Format">
        <ToggleGroupItem value="bold">Bold</ToggleGroupItem>
        <ToggleGroupItem value="italic">Italic</ToggleGroupItem>
      </ToggleGroup>,
    )
    // In single mode items have role="radio"
    const bold = screen.getByRole('radio', { name: 'Bold' })
    fireEvent.click(bold)
    expect(bold).toHaveAttribute('data-state', 'on')
  })

  it('supports multiple selection in multiple mode', () => {
    render(
      <ToggleGroup type="multiple" aria-label="Style">
        <ToggleGroupItem value="bold">Bold</ToggleGroupItem>
        <ToggleGroupItem value="italic">Italic</ToggleGroupItem>
      </ToggleGroup>,
    )
    // In multiple mode items use role="button" with aria-pressed
    fireEvent.click(screen.getByRole('button', { name: 'Bold' }))
    fireEvent.click(screen.getByRole('button', { name: 'Italic' }))
    expect(screen.getByRole('button', { name: 'Bold' })).toHaveAttribute('data-state', 'on')
    expect(screen.getByRole('button', { name: 'Italic' })).toHaveAttribute('data-state', 'on')
  })
})
