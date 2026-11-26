import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Tag, TagAction, TagMeta, TagText } from './tag'

describe('Tag', () => {
  it('renders a text tag with the compact neutral keyword style', () => {
    render(<Tag>Draft</Tag>)
    const tag = screen.getByText('Draft')
    expect(tag).toHaveAttribute('data-slot', 'tag')
    expect(tag).toHaveAttribute('data-variant', 'default')
    // Short rounded rectangle, explicitly NOT the pill rounded-4xl Badge uses.
    expect(tag).toHaveClass('rounded')
    expect(tag).not.toHaveClass('rounded-4xl')
    expect(tag).toHaveClass('bg-surface-subtle')
    expect(tag).toHaveClass('px-2.5')
    expect(tag).toHaveClass('text-[11px]')
    expect(tag).toHaveClass('font-normal')
  })

  it('renders a small status tag with the same rectangle radius and lighter label weight', () => {
    render(<Tag size="sm">Official</Tag>)
    const tag = screen.getByText('Official')
    expect(tag).toHaveAttribute('data-size', 'sm')
    expect(tag).toHaveClass('rounded')
    expect(tag).toHaveClass('px-2')
    expect(tag).toHaveClass('text-[10px]')
    expect(tag).toHaveClass('font-medium')
    expect(tag).toHaveClass('bg-surface-subtle')
  })

  it('renders success variant with emerald tint', () => {
    render(<Tag variant="success">Hired</Tag>)
    expect(screen.getByText('Hired')).toHaveClass('bg-emerald-50')
  })

  it('renders warning variant with amber tint', () => {
    render(<Tag variant="warning">Pending</Tag>)
    expect(screen.getByText('Pending')).toHaveClass('bg-amber-50')
  })

  it('renders danger variant tied to the brand destructive token', () => {
    render(<Tag variant="danger">Failed</Tag>)
    expect(screen.getByText('Failed')).toHaveClass('bg-destructive/10')
  })

  it('renders info variant with blue tint', () => {
    render(<Tag variant="info">Beta</Tag>)
    expect(screen.getByText('Beta')).toHaveClass('bg-blue-50')
  })

  it('renders outline variant with a hairline border and no fill', () => {
    render(<Tag variant="outline">Label</Tag>)
    const tag = screen.getByText('Label')
    expect(tag).toHaveClass('border-border')
    expect(tag).not.toHaveClass('bg-muted')
  })

  it('keeps icon + text tags aligned with the same compact shape', () => {
    render(
      <Tag variant="success">
        <svg data-testid="icon" />
        Hired
      </Tag>,
    )
    const tag = screen.getByText('Hired')
    expect(tag).toHaveClass('gap-1')
    expect(tag).toHaveClass('rounded')
    expect(tag).toHaveClass('[&>svg]:size-3')
    expect(screen.getByTestId('icon')).toBeInTheDocument()
  })

  it('accepts extra className', () => {
    render(<Tag className="my-custom">X</Tag>)
    expect(screen.getByText('X')).toHaveClass('my-custom')
  })

  it('renders as a child element when asChild is set', () => {
    render(
      <Tag asChild>
        <a href="#status">Status</a>
      </Tag>,
    )
    const link = screen.getByRole('link', { name: 'Status' })
    expect(link).toHaveAttribute('data-slot', 'tag')
  })

  it('supports the composer attachment tag shape from chat-ui', () => {
    render(
      <Tag variant="attachment">
        <TagText>gensmo-1778055162350.png</TagText>
        <TagMeta>50 KB</TagMeta>
        <TagAction aria-label="Remove attachment">×</TagAction>
      </Tag>,
    )

    const tag = screen.getByText('gensmo-1778055162350.png').closest('[data-slot="tag"]')
    expect(tag).toHaveAttribute('data-variant', 'attachment')
    expect(tag).toHaveClass('max-w-full')
    expect(tag).toHaveClass('gap-2')
    expect(tag).toHaveClass('rounded-md')
    expect(tag).toHaveClass('border-[color:var(--chat-ui-border,#d4d4d4)]')
    expect(tag).toHaveClass('bg-[color:var(--chat-ui-muted,#f5f5f5)]')
    expect(tag).toHaveClass('px-2.5')
    expect(tag).toHaveClass('py-1.5')
    expect(screen.getByText('gensmo-1778055162350.png')).toHaveAttribute('data-slot', 'tag-text')
    expect(screen.getByText('50 KB')).toHaveClass('text-[color:var(--chat-ui-muted-foreground,#737373)]')
    expect(screen.getByRole('button', { name: 'Remove attachment' })).toHaveClass(
      'hover:bg-[color:var(--chat-ui-border,#d4d4d4)]',
    )
  })
})
