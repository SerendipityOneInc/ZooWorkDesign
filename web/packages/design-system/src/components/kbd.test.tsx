import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Kbd, KbdGroup } from './kbd'

describe('Kbd', () => {
  it('renders with data-slot="kbd"', () => {
    render(<Kbd>⌘</Kbd>)
    expect(screen.getByText('⌘')).toHaveAttribute('data-slot', 'kbd')
  })

  it('has bg-muted and text-muted-foreground classes', () => {
    render(<Kbd>K</Kbd>)
    const el = screen.getByText('K')
    expect(el).toHaveClass('bg-muted')
    expect(el).toHaveClass('text-muted-foreground')
  })

  it('renders a multi-character label', () => {
    render(<Kbd>Enter</Kbd>)
    expect(screen.getByText('Enter')).toHaveAttribute('data-slot', 'kbd')
  })

  it('accepts extra className', () => {
    render(<Kbd className="my-custom">⇧</Kbd>)
    expect(screen.getByText('⇧')).toHaveClass('my-custom')
  })
})

describe('KbdGroup', () => {
  it('renders with data-slot="kbd-group"', () => {
    const { container } = render(
      <KbdGroup>
        <Kbd>⌘</Kbd>
        <Kbd>K</Kbd>
      </KbdGroup>,
    )
    expect(container.querySelector('[data-slot="kbd-group"]')).toBeTruthy()
  })
})
