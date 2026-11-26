import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './collapsible'

describe('Collapsible', () => {
  it('renders trigger with data-slot="collapsible-trigger"', () => {
    render(
      <Collapsible>
        <CollapsibleTrigger data-testid="trigger">Expand advanced options</CollapsibleTrigger>
        <CollapsibleContent>
          <p>Advanced configuration</p>
        </CollapsibleContent>
      </Collapsible>,
    )
    expect(screen.getByTestId('trigger')).toHaveAttribute('data-slot', 'collapsible-trigger')
  })

  it('toggles content visibility on trigger click', () => {
    render(
      <Collapsible>
        <CollapsibleTrigger data-testid="trigger">Expand</CollapsibleTrigger>
        <CollapsibleContent>Hidden content</CollapsibleContent>
      </Collapsible>,
    )
    // Content is not rendered initially (Radix unmounts when closed in jsdom)
    expect(screen.queryByText('Hidden content')).not.toBeInTheDocument()
    fireEvent.click(screen.getByTestId('trigger'))
    expect(screen.getByText('Hidden content')).toBeInTheDocument()
  })

  it('renders as open when defaultOpen=true', () => {
    render(
      <Collapsible defaultOpen>
        <CollapsibleTrigger>Collapse</CollapsibleTrigger>
        <CollapsibleContent>Expanded content</CollapsibleContent>
      </Collapsible>,
    )
    expect(screen.getByText('Expanded content')).toBeVisible()
  })

  it('all exports are functions', () => {
    expect(typeof Collapsible).toBe('function')
    expect(typeof CollapsibleTrigger).toBe('function')
    expect(typeof CollapsibleContent).toBe('function')
  })
})
