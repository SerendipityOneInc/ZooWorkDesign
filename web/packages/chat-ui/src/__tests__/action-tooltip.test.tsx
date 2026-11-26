// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { ActionTooltip } from '../primitives'
import { copyToClipboard } from '../utils'

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

describe('ActionTooltip', () => {
  it('renders trigger and tooltip label', () => {
    render(
      <ActionTooltip label="Copy">
        <button>trigger</button>
      </ActionTooltip>,
    )
    expect(screen.getByRole('button', { name: 'trigger' })).not.toBeNull()
    expect(screen.getByText('Copy')).not.toBeNull()
  })
})

describe('copyToClipboard', () => {
  const originalClipboard = Object.getOwnPropertyDescriptor(navigator, 'clipboard')

  afterEach(() => {
    if (originalClipboard) Object.defineProperty(navigator, 'clipboard', originalClipboard)
    else delete (navigator as { clipboard?: unknown }).clipboard
  })

  it('returns true on success', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true })
    await expect(copyToClipboard('hello')).resolves.toBe(true)
    expect(writeText).toHaveBeenCalledWith('hello')
  })

  it('returns false and warns the supplied logger on failure', async () => {
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: vi.fn().mockRejectedValue(new Error('denied')) },
      configurable: true,
    })
    const warn = vi.fn()
    await expect(copyToClipboard('hello', { warn })).resolves.toBe(false)
    expect(warn).toHaveBeenCalledWith('Failed to copy to clipboard')
  })
})
