import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Button } from './button'
import { ButtonGroup, ButtonGroupSeparator, ButtonGroupText } from './button-group'

describe('ButtonGroup', () => {
  it('renders with role="group" and data-slot="button-group"', () => {
    render(<ButtonGroup><Button>Action</Button></ButtonGroup>)
    const el = screen.getByRole('group')
    expect(el).toHaveAttribute('data-slot', 'button-group')
  })

  it('applies horizontal variant classes by default', () => {
    render(<ButtonGroup><Button>One</Button></ButtonGroup>)
    const el = screen.getByRole('group')
    expect(el).toHaveAttribute('data-variant', 'segmented')
    expect(el).toHaveClass('flex', 'w-fit', 'gap-1', 'rounded-lg', 'bg-surface-subtle', 'p-1')
    expect(el).toHaveClass('[&>[data-slot=button][aria-pressed=true]]:bg-surface')
  })

  it('keeps the attached button treatment as an explicit compatibility variant', () => {
    render(<ButtonGroup variant="attached"><Button>One</Button><Button>Two</Button></ButtonGroup>)
    const el = screen.getByRole('group')
    expect(el).toHaveAttribute('data-variant', 'attached')
    expect(el).toHaveClass('[&>*:not(:first-child)]:rounded-l-none')
    expect(el).not.toHaveClass('bg-surface-subtle', 'p-1')
  })

  it('applies vertical orientation data attribute', () => {
    render(<ButtonGroup orientation="vertical"><Button>One</Button></ButtonGroup>)
    const el = screen.getByRole('group')
    expect(el).toHaveAttribute('data-orientation', 'vertical')
  })

  it('renders ButtonGroupText', () => {
    render(<ButtonGroupText>Prefix</ButtonGroupText>)
    expect(screen.getByText('Prefix')).toHaveClass(
      'border-[var(--button-outline-border)]',
      'bg-control-background',
      'text-muted-foreground',
    )
  })

  it('renders ButtonGroupSeparator with data-slot', () => {
    const { container } = render(
      <ButtonGroup>
        <Button>One</Button>
        <ButtonGroupSeparator />
        <Button>Two</Button>
      </ButtonGroup>,
    )
    const sep = container.querySelector('[data-slot="button-group-separator"]')
    expect(sep).toBeInTheDocument()
  })
})
