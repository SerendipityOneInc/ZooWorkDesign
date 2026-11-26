// src/components/sonner.test.tsx
import { act, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Toaster, toast } from './sonner'

// window.matchMedia (which sonner calls on mount for theme detection) is
// polyfilled suite-wide in vitest.setup.ts, so no per-test stub is needed here.

describe('Toaster (sonner)', () => {
  it('renders without crashing', () => {
    const { container } = render(<Toaster />)
    expect(container).toBeInTheDocument()
  })

  it('renders the sonner notifications section', () => {
    const { container } = render(<Toaster />)
    // sonner renders a <section aria-label="Notifications ..."> in jsdom (no portal)
    const toasterEl = container.querySelector('section[aria-live]')
    expect(toasterEl).toBeInTheDocument()
  })

  it('accepts a position prop without crashing', () => {
    const { container } = render(<Toaster position="top-right" />)
    expect(container).toBeInTheDocument()
  })

  it('re-exports toast function from sonner', () => {
    expect(typeof toast).toBe('function')
    expect(typeof toast.error).toBe('function')
    expect(typeof toast.success).toBe('function')
  })

  it('renders a toast message in the live region when toast() is called', async () => {
    render(<Toaster />)
    // nothing queued yet
    expect(screen.queryByText('Profile updated')).not.toBeInTheDocument()
    // firing a toast pushes it into sonner's store; the mounted Toaster renders it
    act(() => {
      toast('Profile updated')
    })
    const message = await screen.findByText('Profile updated')
    expect(message).toBeInTheDocument()
    // it lands inside sonner's notifications live region, not loose in the body
    expect(message.closest('section[aria-live]')).toBeInTheDocument()
  })
})
