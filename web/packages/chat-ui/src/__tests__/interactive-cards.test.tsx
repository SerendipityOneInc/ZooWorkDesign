// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { InteractiveCards } from '../cards'
import type { InteractiveCardView } from '../types'

afterEach(cleanup)

const buttonsCard: InteractiveCardView = {
  kind: 'buttons',
  text: 'Pick one',
  buttons: [
    { actionId: 'a1', label: 'Yes', style: 'primary' },
    { actionId: 'a2', label: 'No', style: 'default' },
  ],
}

const multiSelectCard: InteractiveCardView = {
  kind: 'multiselect',
  text: 'Choose toppings',
  options: [
    { actionId: 'ms-cheese', label: 'Cheese', checked: true },
    { actionId: 'ms-olives', label: 'Olives', checked: false },
  ],
  submitActionId: 'ms-submit',
  submitLabel: 'Submit choices',
}

describe('InteractiveCards', () => {
  it('renders banner via renderMarkdown and strips attribution', () => {
    render(
      <InteractiveCards
        postId="p1"
        cards={[{ kind: 'banner', text: '✓ **Done** selected by @bill' }]}
        onAction={vi.fn()}
      />,
    )
    const banner = screen.getByTestId('interactive-card-banner')
    expect(banner.textContent).toContain('✓ **Done**')
    expect(banner.textContent).not.toContain('selected by')
  })

  it('dispatches button actions and keeps controls disabled on success', async () => {
    const onAction = vi.fn().mockResolvedValue(undefined)
    render(<InteractiveCards postId="p1" cards={[buttonsCard]} onAction={onAction} />)
    fireEvent.click(screen.getByRole('button', { name: 'Yes' }))
    expect(onAction).toHaveBeenCalledWith('p1', 'a1', undefined)
    await waitFor(() => {
      expect((screen.getByRole('button', { name: 'Yes' }) as HTMLButtonElement).disabled).toBe(true)
      expect((screen.getByRole('button', { name: 'No' }) as HTMLButtonElement).disabled).toBe(true)
    })
  })

  it('reports errors and re-enables controls on failure', async () => {
    const boom = new Error('nope')
    const onAction = vi.fn().mockRejectedValue(boom)
    const onActionError = vi.fn()
    render(<InteractiveCards postId="p1" cards={[buttonsCard]} onAction={onAction} onActionError={onActionError} />)
    fireEvent.click(screen.getByRole('button', { name: 'Yes' }))
    await waitFor(() => expect(onActionError).toHaveBeenCalledWith(boom))
    expect((screen.getByRole('button', { name: 'Yes' }) as HTMLButtonElement).disabled).toBe(false)
  })

  it('disables everything when disabled prop is set', () => {
    render(<InteractiveCards postId="p1" cards={[buttonsCard]} onAction={vi.fn()} disabled disabledReason="Disabled in replay" />)
    const btn = screen.getByRole('button', { name: 'Yes' }) as HTMLButtonElement
    expect(btn.disabled).toBe(true)
    expect(btn.getAttribute('title')).toBe('Disabled in replay')
  })

  it('dispatches select choices', () => {
    const onAction = vi.fn().mockResolvedValue(undefined)
    render(
      <InteractiveCards
        postId="p1"
        cards={[{ kind: 'select', text: '', actionId: 's1', placeholder: 'Choose', options: [{ value: 'v1', label: 'One' }] }]}
        onAction={onAction}
      />,
    )
    fireEvent.change(screen.getByTestId('interactive-card-select'), { target: { value: 'v1' } })
    expect(onAction).toHaveBeenCalledWith('p1', 's1', 'v1')
  })

  it('renders multiselect checkboxes from server state and a submit button', () => {
    render(<InteractiveCards postId="p1" cards={[multiSelectCard]} onAction={vi.fn()} />)

    expect(screen.getByRole('checkbox', { name: 'Cheese' })).toBeChecked()
    expect(screen.getByRole('checkbox', { name: 'Olives' })).not.toBeChecked()
    expect(screen.getByRole('button', { name: 'Submit choices' })).toBeInTheDocument()
  })

  it('dispatches a multiselect toggle action without changing local checked state', () => {
    const onAction = vi.fn().mockResolvedValue(undefined)
    render(<InteractiveCards postId="p1" cards={[multiSelectCard]} onAction={onAction} />)

    const olives = screen.getByRole('checkbox', { name: 'Olives' })
    fireEvent.click(olives)

    expect(onAction).toHaveBeenCalledWith('p1', 'ms-olives', undefined)
    expect(olives).not.toBeChecked()
  })

  it('disables multiselect submit when no options are checked', () => {
    const card = { ...multiSelectCard, options: multiSelectCard.options.map((option) => ({ ...option, checked: false })) }
    render(<InteractiveCards postId="p1" cards={[card]} onAction={vi.fn()} />)

    expect(screen.getByRole('button', { name: 'Submit choices' })).toBeDisabled()
  })

  it('dispatches the multiselect submit action', () => {
    const onAction = vi.fn().mockResolvedValue(undefined)
    render(<InteractiveCards postId="p1" cards={[multiSelectCard]} onAction={onAction} />)

    fireEvent.click(screen.getByRole('button', { name: 'Submit choices' }))

    expect(onAction).toHaveBeenCalledWith('p1', 'ms-submit', undefined)
  })

  it('disables all multiselect controls while an action is pending', () => {
    const onAction = vi.fn(() => new Promise<void>(() => {}))
    render(<InteractiveCards postId="p1" cards={[multiSelectCard]} onAction={onAction} />)

    fireEvent.click(screen.getByRole('checkbox', { name: 'Olives' }))

    expect(screen.getByRole('checkbox', { name: 'Cheese' })).toBeDisabled()
    expect(screen.getByRole('checkbox', { name: 'Olives' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Submit choices' })).toBeDisabled()
  })

  it('clears pending state when edited card content remounts the card', () => {
    const onAction = vi.fn(() => new Promise<void>(() => {}))
    const { rerender } = render(<InteractiveCards postId="p1" cards={[multiSelectCard]} onAction={onAction} />)

    fireEvent.click(screen.getByRole('checkbox', { name: 'Olives' }))
    const editedCard = {
      ...multiSelectCard,
      options: multiSelectCard.options.map((option) =>
        option.actionId === 'ms-olives' ? { ...option, checked: true } : option,
      ),
    }
    rerender(<InteractiveCards postId="p1" cards={[editedCard]} onAction={onAction} />)

    expect(screen.getByRole('checkbox', { name: 'Cheese' })).not.toBeDisabled()
    expect(screen.getByRole('button', { name: 'Submit choices' })).not.toBeDisabled()
  })

  it('renders text for an unknown card kind without crashing', () => {
    const unknownCard = { kind: 'future-kind', text: 'Fallback text' } as unknown as InteractiveCardView
    render(<InteractiveCards postId="p1" cards={[unknownCard]} onAction={vi.fn()} />)

    expect(screen.getByText('Fallback text')).toBeInTheDocument()
  })
})
