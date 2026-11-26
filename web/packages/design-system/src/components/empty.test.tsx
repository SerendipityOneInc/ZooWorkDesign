import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from './empty'

describe('Empty', () => {
  it('renders with data-slot="empty" and border-dashed', () => {
    const { container } = render(<Empty />)
    const el = container.querySelector('[data-slot="empty"]')
    expect(el).toBeInTheDocument()
    expect(el).toHaveClass('border-dashed')
  })

  it('EmptyTitle renders with font-medium and tracking-tight', () => {
    render(<EmptyTitle>No data</EmptyTitle>)
    const el = screen.getByText('No data')
    expect(el).toHaveClass('font-medium')
    expect(el).toHaveClass('tracking-tight')
  })

  it('EmptyDescription renders with muted-foreground', () => {
    render(<EmptyDescription>Add some content to get started</EmptyDescription>)
    expect(screen.getByText('Add some content to get started')).toHaveClass('text-muted-foreground')
  })

  it('EmptyMedia default variant has bg-transparent', () => {
    const { container } = render(<EmptyMedia />)
    const el = container.querySelector('[data-slot="empty-icon"]')
    expect(el).toHaveClass('bg-transparent')
    expect(el).toHaveAttribute('data-variant', 'default')
  })

  it('EmptyMedia icon variant applies the subtle opaque surface', () => {
    const { container } = render(<EmptyMedia variant="icon" />)
    const el = container.querySelector('[data-slot="empty-icon"]')
    expect(el).toHaveClass('bg-surface-subtle')
  })

  it('renders full empty composite', () => {
    render(
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon" />
          <EmptyTitle>No results found</EmptyTitle>
          <EmptyDescription>Try adjusting your search</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <button>Create new</button>
        </EmptyContent>
      </Empty>,
    )
    expect(screen.getByText('No results found')).toBeInTheDocument()
    expect(screen.getByText('Try adjusting your search')).toBeInTheDocument()
    expect(screen.getByText('Create new')).toBeInTheDocument()
  })
})
