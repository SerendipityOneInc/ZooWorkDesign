import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select'

describe('Select', () => {
  it('renders trigger with data-slot="select-trigger"', () => {
    render(
      <Select>
        <SelectTrigger data-testid="trigger" aria-label="Choose plan">
          <SelectValue placeholder="Select…" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="starter">Starter</SelectItem>
        </SelectContent>
      </Select>,
    )
    expect(screen.getByTestId('trigger')).toHaveAttribute('data-slot', 'select-trigger')
    expect(screen.getByTestId('trigger')).toHaveClass(
      'focus-visible:ring-2',
      'focus-visible:ring-ring/25',
    )
  })

  it('opens the listbox on keyboard activation', () => {
    render(
      <Select>
        <SelectTrigger data-testid="trigger" aria-label="Choose plan">
          <SelectValue placeholder="Select…" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="starter">Starter</SelectItem>
          <SelectItem value="pro">Pro</SelectItem>
        </SelectContent>
      </Select>,
    )
    expect(screen.queryByText('Starter')).not.toBeInTheDocument()
    fireEvent.keyDown(screen.getByTestId('trigger'), { key: 'Enter' })
    expect(screen.getByText('Starter')).toBeInTheDocument()
    expect(screen.getByText('Pro')).toBeInTheDocument()
  })

  it('positions the menu below the trigger by default while preserving item-aligned opt-in', () => {
    const { rerender } = render(
      <Select open>
        <SelectTrigger aria-label="Choose plan">
          <SelectValue placeholder="Select…" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="pro">Pro</SelectItem>
        </SelectContent>
      </Select>,
    )

    expect(document.querySelector('[data-slot="select-content"]')).toHaveAttribute(
      'data-align-trigger',
      'false',
    )
    expect(document.querySelector('[data-slot="select-content"]')).toHaveAttribute(
      'data-placement-policy',
      'below-preferred',
    )
    expect(document.querySelector('[data-position="popper"]')).toBeInTheDocument()

    rerender(
      <Select open>
        <SelectTrigger aria-label="Choose plan">
          <SelectValue placeholder="Select…" />
        </SelectTrigger>
        <SelectContent position="item-aligned">
          <SelectItem value="pro">Pro</SelectItem>
        </SelectContent>
      </Select>,
    )

    expect(document.querySelector('[data-slot="select-content"]')).toHaveAttribute(
      'data-align-trigger',
      'true',
    )
    expect(document.querySelector('[data-slot="select-content"]')).toHaveAttribute(
      'data-placement-policy',
      'adaptive',
    )
    expect(document.querySelector('[data-position="item-aligned"]')).toBeInTheDocument()
  })

  it('uses the shared opaque overlay and hover row contract', () => {
    render(
      <Select open>
        <SelectTrigger aria-label="Choose plan">
          <SelectValue placeholder="Select…" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="pro">Pro</SelectItem>
        </SelectContent>
      </Select>,
    )

    const content = document.querySelector('[data-slot="select-content"]')
    expect(content).toHaveClass('rounded-md', 'border-border', 'bg-popover', 'shadow-[var(--elevation-overlay)]')
    expect(content?.className).not.toMatch(/glass|backdrop-blur/)
    expect(screen.getByText('Pro').closest('[data-slot="select-item"]')).toHaveClass(
      'min-h-9',
      'focus:bg-hover',
      'data-checked:bg-selected',
    )
  })

  it('fires onValueChange and shows the chosen value when an item is selected', () => {
    const onValueChange = vi.fn()
    render(
      <Select onValueChange={onValueChange}>
        <SelectTrigger data-testid="trigger" aria-label="Choose plan">
          <SelectValue placeholder="Select…" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="starter">Starter</SelectItem>
          <SelectItem value="pro">Pro</SelectItem>
        </SelectContent>
      </Select>,
    )
    fireEvent.keyDown(screen.getByTestId('trigger'), { key: 'Enter' })
    fireEvent.click(screen.getByText('Pro'))
    expect(onValueChange).toHaveBeenCalledWith('pro')
    // the trigger now shows the chosen value instead of the placeholder
    expect(screen.getByTestId('trigger')).toHaveTextContent('Pro')
  })
})
