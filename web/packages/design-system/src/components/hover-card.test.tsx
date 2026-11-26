import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { HoverCard, HoverCardContent, HoverCardTrigger } from './hover-card'

describe('HoverCard', () => {
  it('renders trigger with data-slot="hover-card-trigger"', () => {
    render(
      <HoverCard>
        <HoverCardTrigger data-testid="trigger">@zooclaw</HoverCardTrigger>
        <HoverCardContent>
          <p>ZooClaw AI assistant</p>
        </HoverCardContent>
      </HoverCard>,
    )
    expect(screen.getByTestId('trigger')).toHaveAttribute('data-slot', 'hover-card-trigger')
  })

  it('HoverCardContent renders with the shared opaque overlay surface when open', () => {
    render(
      <HoverCard open>
        <HoverCardContent data-testid="content">Card content</HoverCardContent>
      </HoverCard>,
    )
    const content = document.querySelector('[data-slot="hover-card-content"]')
    expect(content).toBeInTheDocument()
    expect(content).toHaveClass('rounded-lg', 'border-border', 'bg-popover', 'shadow-[var(--elevation-overlay)]')
    expect(content?.className).not.toMatch(/glass|backdrop-blur/)
  })

  it('renders the composer side-panel surface without tooltip or menu semantics', () => {
    render(
      <HoverCard open>
        <HoverCardContent surface="composer" role="note" data-testid="content">
          Model details
        </HoverCardContent>
      </HoverCard>,
    )

    const content = screen.getByTestId('content')
    expect(content).toHaveAttribute('role', 'note')
    expect(content).toHaveClass('w-[213px]')
    expect(content).toHaveClass('rounded-md')
    expect(content).toHaveClass('bg-popover')
    expect(content).toHaveClass('border-border', 'shadow-[var(--elevation-overlay)]')
    expect(content.querySelector('[data-slot="tooltip-arrow"]')).not.toBeInTheDocument()
  })

  it('HoverCard, HoverCardTrigger, HoverCardContent are all functions', () => {
    expect(typeof HoverCard).toBe('function')
    expect(typeof HoverCardTrigger).toBe('function')
    expect(typeof HoverCardContent).toBe('function')
  })
})
