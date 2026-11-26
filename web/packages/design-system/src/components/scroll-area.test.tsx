import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { ScrollArea, ScrollBar } from './scroll-area'

describe('ScrollArea', () => {
  it('renders root with data-slot="scroll-area"', () => {
    render(
      <ScrollArea data-testid="scroll-area">
        <div>Scrollable content</div>
      </ScrollArea>,
    )
    expect(screen.getByTestId('scroll-area')).toHaveAttribute(
      'data-slot',
      'scroll-area',
    )
  })

  it('renders children inside viewport', () => {
    render(
      <ScrollArea>
        <p>Long list content</p>
      </ScrollArea>,
    )
    expect(screen.getByText('Long list content')).toBeInTheDocument()
  })

  it('exports ScrollBar as a function', () => {
    expect(typeof ScrollBar).toBe('function')
  })

  it('ScrollBar renders inside ScrollArea context', () => {
    const { container } = render(
      <ScrollArea>
        <p>Content</p>
        <ScrollBar orientation="vertical" />
      </ScrollArea>,
    )
    expect(container.querySelector('[data-slot="scroll-area"]')).toBeInTheDocument()
  })
})
