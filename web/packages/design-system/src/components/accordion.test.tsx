import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './accordion'

describe('Accordion', () => {
  function setup() {
    render(
      <Accordion type="single" collapsible>
        <AccordionItem value="q1">
          <AccordionTrigger>What is Atlas?</AccordionTrigger>
          <AccordionContent>Atlas is a multi-agent system.</AccordionContent>
        </AccordionItem>
        <AccordionItem value="q2">
          <AccordionTrigger>How does it work?</AccordionTrigger>
          <AccordionContent>It routes tasks to specialists.</AccordionContent>
        </AccordionItem>
      </Accordion>,
    )
  }

  it('renders with data-slot attributes on all sub-parts', () => {
    setup()
    expect(document.querySelector('[data-slot="accordion"]')).toBeInTheDocument()
    expect(document.querySelectorAll('[data-slot="accordion-item"]')).toHaveLength(2)
    expect(document.querySelectorAll('[data-slot="accordion-trigger"]')).toHaveLength(2)
    expect(document.querySelectorAll('[data-slot="accordion-content"]')).toHaveLength(2)
  })

  it('content starts closed (data-state=closed on item)', () => {
    setup()
    const items = document.querySelectorAll('[data-slot="accordion-item"]')
    expect(items[0]).toHaveAttribute('data-state', 'closed')
    expect(items[1]).toHaveAttribute('data-state', 'closed')
  })

  it('opens an item when its trigger is clicked', () => {
    setup()
    fireEvent.click(screen.getByText('What is Atlas?'))
    const item = document.querySelectorAll('[data-slot="accordion-item"]')[0]
    expect(item).toHaveAttribute('data-state', 'open')
  })

  it('collapses an open item when trigger is clicked again', () => {
    setup()
    fireEvent.click(screen.getByText('What is Atlas?'))
    fireEvent.click(screen.getByText('What is Atlas?'))
    const item = document.querySelectorAll('[data-slot="accordion-item"]')[0]
    expect(item).toHaveAttribute('data-state', 'closed')
  })

  it('uses the design-system border token for item dividers', () => {
    setup()
    const item = document.querySelector('[data-slot="accordion-item"]')
    expect(item).toHaveClass('border-separator')
    expect(screen.getByText('What is Atlas?')).toHaveClass('min-h-10', 'hover:bg-hover')
    expect(screen.getByText('What is Atlas?')).not.toHaveClass('hover:underline')
  })
})
