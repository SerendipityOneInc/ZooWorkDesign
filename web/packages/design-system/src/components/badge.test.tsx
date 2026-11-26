import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Badge } from './badge'

describe('Badge', () => {
  it('renders a span with data-slot="badge" and default ink fill', () => {
    render(<Badge>New</Badge>)
    const badge = screen.getByText('New')
    expect(badge).toHaveAttribute('data-slot', 'badge')
    expect(badge).toHaveClass('bg-foreground')
  })

  it('renders destructive variant with muted-red background', () => {
    render(<Badge variant="destructive">Error</Badge>)
    expect(screen.getByText('Error')).toHaveClass('bg-destructive/10')
  })

  it('renders notification badges with a solid red fill and white foreground', () => {
    render(<Badge variant="notification">8</Badge>)
    expect(screen.getByText('8')).toHaveClass('bg-destructive')
    expect(screen.getByText('8')).toHaveClass('text-destructive-foreground')
  })

  it('renders a compact circular notification dot', () => {
    render(<Badge variant="notification" shape="dot" aria-label="Unread messages" />)
    const dot = screen.getByLabelText('Unread messages')

    expect(dot).toHaveAttribute('data-shape', 'dot')
    expect(dot).toHaveClass('size-2.5')
    expect(dot).toHaveClass('rounded-full')
    expect(dot).toHaveClass('p-0')
  })

  it('uses a circular minimum size that expands into a pill for longer counts', () => {
    render(<Badge shape="count">99+</Badge>)
    const count = screen.getByText('99+')

    expect(count).toHaveAttribute('data-shape', 'count')
    expect(count).toHaveClass('min-w-5')
    expect(count).toHaveClass('rounded-full')
    expect(count).toHaveClass('px-1')
    expect(count).toHaveClass('tabular-nums')
  })

  it.each([
    ['success', 'bg-emerald-50'],
    ['warning', 'bg-amber-50'],
    ['danger', 'bg-destructive/10'],
    ['info', 'bg-blue-50'],
  ] as const)('shares the %s semantic color with Tag', (variant, colorClass) => {
    render(<Badge variant={variant}>12</Badge>)
    expect(screen.getByText('12')).toHaveClass(colorClass)
  })

  it('renders secondary variant', () => {
    render(<Badge variant="secondary">Beta</Badge>)
    expect(screen.getByText('Beta')).toHaveClass('bg-secondary')
  })

  it('renders outline variant', () => {
    render(<Badge variant="outline">Draft</Badge>)
    expect(screen.getByText('Draft')).toHaveClass('border-border')
  })

  it('accepts extra className', () => {
    render(<Badge className="my-custom">Tag</Badge>)
    expect(screen.getByText('Tag')).toHaveClass('my-custom')
  })
})
