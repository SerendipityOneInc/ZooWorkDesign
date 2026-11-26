import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { ActionsCard } from '../ermp/cards/ActionsCard'
import { FormCard } from '../ermp/cards/FormCard'
import type { ActionsCard as ActionsCardType, FormCard as FormCardType } from '../ermp/types'

const originalClipboard = Object.getOwnPropertyDescriptor(navigator, 'clipboard')

afterEach(() => {
  cleanup()
  if (originalClipboard) Object.defineProperty(navigator, 'clipboard', originalClipboard)
  else delete (navigator as { clipboard?: unknown }).clipboard
})

const actionsCard: ActionsCardType = {
  _card: 'actions',
  _id: 'actions-1',
  buttons: [
    { label: 'Approve', action: 'callback', value: 'approve', style: 'primary' },
    { label: 'Visit', action: 'link', value: 'https://example.com' },
    { label: 'Copy', action: 'copy', value: 'token-123' },
  ],
}

const formCard: FormCardType = {
  _card: 'form',
  _id: 'form-1',
  fields: [
    { name: 'name', label: 'Name', type: 'text', default: 'Alice' },
    { name: 'rating', label: 'Rating', type: 'number', default: 5 },
    { name: 'region', label: 'Region', type: 'select', options: ['US', 'EU'], default: 'US' },
    { name: 'enabled', label: 'Enabled', type: 'toggle', default: true },
    { name: 'notes', label: 'Notes', type: 'textarea', default: 'Ready' },
  ],
  submitLabel: 'Send',
}

describe('ermp/ActionsCard', () => {
  it('submits a callback once and then shows a disabled submitted state', () => {
    const onCallback = vi.fn()
    render(<ActionsCard card={actionsCard} onCallback={onCallback} />)

    fireEvent.click(screen.getByRole('button', { name: 'Approve' }))

    expect(onCallback).toHaveBeenCalledWith('actions-1', 'approve')
    const submitted = screen.getByRole('button', { name: 'Submitted' }) as HTMLButtonElement
    expect(submitted.disabled).toBe(true)
  })

  it('disables callback actions and ignores clicks under readOnly', () => {
    const onCallback = vi.fn()
    render(<ActionsCard card={actionsCard} readOnly onCallback={onCallback} />)

    const callback = screen.getByRole('button', { name: 'Approve' }) as HTMLButtonElement
    expect(callback.disabled).toBe(true)
    fireEvent.click(callback)
    expect(onCallback).not.toHaveBeenCalled()
  })

  it('keeps link and copy actions active under readOnly', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true })
    render(<ActionsCard card={actionsCard} readOnly onCallback={vi.fn()} />)

    const link = screen.getByRole('link', { name: 'Visit' })
    expect(link.getAttribute('href')).toBe('https://example.com')
    const copy = screen.getByRole('button', { name: 'Copy' }) as HTMLButtonElement
    expect(copy.disabled).toBe(false)
    fireEvent.click(copy)
    await screen.findByText('Copied')
    expect(writeText).toHaveBeenCalledWith('token-123')
  })

  it('uses isSubmitted for the initial submitted state', () => {
    render(<ActionsCard card={actionsCard} isSubmitted={() => true} onCallback={vi.fn()} />)

    const submitted = screen.getByRole('button', { name: 'Submitted' }) as HTMLButtonElement
    expect(submitted.disabled).toBe(true)
  })
})

describe('ermp/FormCard', () => {
  it('submits values and disables every field and the submit button', () => {
    const onSubmit = vi.fn()
    const { container } = render(<FormCard card={formCard} onSubmit={onSubmit} />)

    screen.getByRole('option', { name: 'Select an option' })
    fireEvent.click(screen.getByRole('button', { name: 'Send' }))

    expect(onSubmit).toHaveBeenCalledWith('form-1', {
      name: 'Alice',
      rating: 5,
      region: 'US',
      enabled: true,
      notes: 'Ready',
    })
    const controls = container.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | HTMLButtonElement>(
      'input, textarea, select, button',
    )
    expect(Array.from(controls).every((control) => control.disabled)).toBe(true)
    screen.getByRole('button', { name: 'Submitted' })
  })

  it('disables fields and ignores submit under readOnly', () => {
    const onSubmit = vi.fn()
    const { container } = render(<FormCard card={formCard} readOnly onSubmit={onSubmit} />)

    const controls = container.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | HTMLButtonElement>(
      'input, textarea, select, button',
    )
    expect(Array.from(controls).every((control) => control.disabled)).toBe(true)
    fireEvent.click(screen.getByRole('button', { name: 'Send' }))
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('uses isSubmitted for the initial submitted state', () => {
    const { container } = render(<FormCard card={formCard} isSubmitted={() => true} onSubmit={vi.fn()} />)

    const controls = container.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | HTMLButtonElement>(
      'input, textarea, select, button',
    )
    expect(Array.from(controls).every((control) => control.disabled)).toBe(true)
    screen.getByRole('button', { name: 'Submitted' })
  })
})
