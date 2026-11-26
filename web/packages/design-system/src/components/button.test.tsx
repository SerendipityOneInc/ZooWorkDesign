import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { Button } from './button'

describe('Button', () => {
  it('renders its children as a <button> with the data-slot / data-variant / data-size anchors', () => {
    render(<Button>Click me</Button>)
    const btn = screen.getByRole('button', { name: 'Click me' })
    expect(btn.tagName).toBe('BUTTON')
    expect(btn).toHaveAttribute('data-slot', 'button')
    expect(btn).toHaveAttribute('data-variant', 'default')
    expect(btn).toHaveAttribute('data-size', 'default')
  })

  it('keeps non-loading children as direct button content for consumer DOM compatibility', () => {
    render(
      <Button>
        <span data-testid="direct-content">Open</span>
      </Button>,
    )

    const btn = screen.getByRole('button', { name: 'Open' })
    expect(screen.getByTestId('direct-content').parentElement).toBe(btn)
  })

  it('uses the control-sized rounded rectangle instead of the card or pill radius', () => {
    render(<Button>Rounded rectangle</Button>)
    const btn = screen.getByRole('button', { name: 'Rounded rectangle' })

    expect(btn).toHaveClass('rounded-md')
    expect(btn).not.toHaveClass('rounded-lg', 'rounded-full')
  })

  it('applies the neutral secondary variant class', () => {
    render(<Button variant="secondary">Secondary</Button>)
    expect(screen.getByRole('button', { name: 'Secondary' })).toHaveClass('bg-secondary')
  })

  it('keeps `primary` as a deprecated alias of the default neutral action (back-compat)', () => {
    render(<Button variant="primary">Legacy</Button>)
    const btn = screen.getByRole('button', { name: 'Legacy' })
    expect(btn).toHaveClass('bg-primary', 'hover:bg-primary-hover', 'active:bg-primary-active')
    expect(btn).not.toHaveClass('from-cta-from', 'bg-gradient-to-br')
    expect(btn).toHaveAttribute('data-variant', 'primary')
  })

  it('uses the primary foreground token on the neutral action surface', () => {
    render(<Button>Continue</Button>)
    const btn = screen.getByRole('button', { name: 'Continue' })
    expect(btn).toHaveClass('bg-primary', 'text-primary-foreground')
    expect(btn).not.toHaveClass('text-cta-foreground', 'hover:brightness-110')
  })

  it('keeps outline borders visible in dark mode with a button-specific token', () => {
    render(<Button variant="outline">Outline</Button>)
    const btn = screen.getByRole('button', { name: 'Outline' })

    expect(btn).toHaveClass('border-[var(--button-outline-border)]')
    expect(btn).toHaveClass('hover:border-[var(--button-outline-border-hover)]')
    expect(btn).not.toHaveClass('dark:border-input')
  })

  it('uses the dedicated hover surface for neutral variants', () => {
    render(
      <>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
      </>,
    )
    expect(screen.getByRole('button', { name: 'Outline' })).toHaveClass('hover:bg-hover')
    expect(screen.getByRole('button', { name: 'Ghost' })).toHaveClass('hover:bg-hover')
  })

  it('keeps the outline hover surface visible over its dark-mode base fill', () => {
    render(<Button variant="outline">Outline</Button>)

    expect(screen.getByRole('button', { name: 'Outline' })).toHaveClass('dark:hover:bg-hover')
  })

  it('uses the restrained neutral focus halo shared by form controls', () => {
    render(<Button>Continue</Button>)
    const btn = screen.getByRole('button', { name: 'Continue' })

    expect(btn).toHaveClass('focus-visible:ring-ring/35')
    expect(btn).not.toHaveClass('focus-visible:ring-ring/50')
  })

  it('uses the 32 / 36 / 40px product control scale', () => {
    render(
      <>
        <Button size="sm">Small</Button>
        <Button>Default</Button>
        <Button size="lg">Large</Button>
      </>,
    )

    expect(screen.getByRole('button', { name: 'Small' })).toHaveClass('h-8')
    expect(screen.getByRole('button', { name: 'Default' })).toHaveClass('h-9')
    expect(screen.getByRole('button', { name: 'Large' })).toHaveClass('h-10')
  })

  it('renders the destructive variant as a soft-tinted brand-red surface', () => {
    render(<Button variant="destructive">Delete</Button>)
    const btn = screen.getByRole('button', { name: 'Delete' })
    expect(btn).toHaveClass('text-destructive')
    expect(btn).toHaveClass('bg-destructive/10')
  })

  it('renders the link variant as underlined brand-red text', () => {
    render(<Button variant="link">Link</Button>)
    const btn = screen.getByRole('button', { name: 'Link' })
    expect(btn).toHaveClass('text-primary')
    expect(btn).toHaveClass('hover:underline')
  })

  it('renders the icon size as a square button', () => {
    render(
      <Button size="icon" aria-label="Close">
        ×
      </Button>,
    )
    expect(screen.getByRole('button', { name: 'Close' })).toHaveClass('size-9')
  })

  it('supports the chat composer send button shape extracted from chat-ui', () => {
    render(
      <Button variant="composerSend" size="composerIcon" aria-label="Send">
        ↑
      </Button>,
    )
    const btn = screen.getByRole('button', { name: 'Send' })
    expect(btn).toHaveAttribute('data-variant', 'composerSend')
    expect(btn).toHaveAttribute('data-size', 'composerIcon')
    expect(btn).toHaveClass('bg-[color:var(--chat-ui-accent,#111827)]')
    expect(btn).toHaveClass('text-white')
    expect(btn).toHaveClass('hover:opacity-90')
    expect(btn).toHaveClass('size-9')
    expect(btn).toHaveClass('rounded-lg')
  })

  it('exposes composer menu-open state styling from data attributes', () => {
    render(
      <Button variant="ghost" data-menu-open="true">
        Add
      </Button>,
    )
    const btn = screen.getByRole('button', { name: 'Add' })
    expect(btn).toHaveClass('data-[menu-open=true]:bg-selected')
    expect(btn).toHaveClass('data-[menu-open=true]:text-accent-foreground')
  })

  it('supports rounded-rectangle keyboard focus for composer icon triggers', () => {
    render(
      <Button variant="ghost" data-keyboard-focus-shape="rounded-rectangle">
        Add
      </Button>,
    )
    const btn = screen.getByRole('button', { name: 'Add' })
    expect(btn).toHaveClass('data-[keyboard-focus-shape=rounded-rectangle]:focus-visible:bg-hover')
    expect(btn).toHaveClass('data-[keyboard-focus-shape=rounded-rectangle]:focus-visible:ring-0')
  })

  it('renders as the child element (and forwards props) when asChild is set', () => {
    render(
      <Button asChild>
        <a href="/somewhere">Go</a>
      </Button>,
    )
    const link = screen.getByRole('link', { name: 'Go' })
    expect(link.tagName).toBe('A')
    expect(link).toHaveAttribute('href', '/somewhere')
    expect(link).toHaveAttribute('data-slot', 'button')
  })

  it('keeps its visual hierarchy while exposing a busy, non-interactive loading state', () => {
    render(<Button loading>Generate</Button>)

    const btn = screen.getByRole('button', { name: 'Generate' })
    expect(btn).toBeDisabled()
    expect(btn).toHaveAttribute('aria-busy', 'true')
    expect(btn).toHaveAttribute('data-loading', 'true')
    expect(btn).toHaveClass('data-[loading=true]:opacity-100')
    expect(btn.querySelector('[data-slot="button-content"]')).toHaveClass('motion-fast', 'opacity-0')
    expect(btn.querySelector('[data-slot="spinner"]')).toHaveAttribute('aria-hidden', 'true')
  })

  it('uses shared fast motion for restrained press feedback with a reduced-motion fallback', () => {
    render(<Button>Continue</Button>)

    const btn = screen.getByRole('button', { name: 'Continue' })
    expect(btn).toHaveClass('motion-fast')
    expect(btn).toHaveClass('[&:not(:disabled):not([aria-disabled=true]):active]:scale-[0.98]')
    expect(btn).toHaveClass('motion-reduce:transform-none')
  })

  it('exposes loading semantics without leaking native disabled onto an asChild link', () => {
    const onClick = vi.fn()
    render(
      <Button asChild loading onClick={onClick}>
        <a href="/somewhere">Open report</a>
      </Button>,
    )

    const link = screen.getByRole('link', { name: 'Open report' })
    expect(link).toHaveAttribute('aria-busy', 'true')
    expect(link).toHaveAttribute('aria-disabled', 'true')
    expect(link).not.toHaveAttribute('disabled')

    fireEvent.click(link)
    expect(onClick).not.toHaveBeenCalled()
  })

  it('prevents auxiliary activation of an unavailable asChild link', () => {
    const onAuxClick = vi.fn()
    render(
      <Button asChild loading onAuxClick={onAuxClick}>
        <a href="/somewhere">Open report</a>
      </Button>,
    )

    const link = screen.getByRole('link', { name: 'Open report' })
    const auxClick = new MouseEvent('auxclick', { bubbles: true, cancelable: true, button: 1 })

    fireEvent(link, auxClick)

    expect(auxClick.defaultPrevented).toBe(true)
    expect(onAuxClick).not.toHaveBeenCalled()
  })
})
