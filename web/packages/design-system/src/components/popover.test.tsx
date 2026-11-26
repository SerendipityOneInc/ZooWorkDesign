import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import {
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from './popover'

describe('Popover', () => {
  it('renders trigger with data-slot="popover-trigger"', () => {
    render(
      <Popover>
        <PopoverTrigger data-testid="trigger">Open</PopoverTrigger>
        <PopoverContent>
          <PopoverHeader>
            <PopoverTitle>Filter options</PopoverTitle>
            <PopoverDescription>Select a date range</PopoverDescription>
          </PopoverHeader>
        </PopoverContent>
      </Popover>,
    )
    expect(screen.getByTestId('trigger')).toHaveAttribute('data-slot', 'popover-trigger')
  })

  it('PopoverAnchor is exported and is a function', () => {
    expect(typeof PopoverAnchor).toBe('function')
  })

  it('PopoverContent renders with the shared opaque overlay surface when open', () => {
    render(
      <Popover open>
        <PopoverContent data-testid="content">Content</PopoverContent>
      </Popover>,
    )
    const content = document.querySelector('[data-slot="popover-content"]')
    expect(content).toBeInTheDocument()
    expect(content).toHaveClass('rounded-lg', 'border-border', 'bg-popover', 'shadow-[var(--elevation-overlay)]')
    expect(content?.className).not.toMatch(/glass|backdrop-blur/)
  })

  it('PopoverHeader renders with data-slot="popover-header"', () => {
    render(
      <Popover open>
        <PopoverContent>
          <PopoverHeader>Header</PopoverHeader>
        </PopoverContent>
      </Popover>,
    )
    expect(document.querySelector('[data-slot="popover-header"]')).toBeInTheDocument()
  })
})
