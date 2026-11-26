import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import { Toaster, clearToasts, useToast } from './toast'

afterEach(() => clearToasts())

// Helper: a button that triggers a toast when clicked.
function ToastTrigger({ title, description }: { title: string; description?: string }) {
  const { toast } = useToast()
  return (
    <button onClick={() => toast({ title, description })}>Show Toast</button>
  )
}

describe('Toast', () => {
  it('renders Toaster without crashing (empty state)', () => {
    render(<Toaster />)
    // No toasts initially — viewport is still in the DOM
    expect(document.querySelector('[data-slot="toast-viewport"]')).toBeInTheDocument()
  })

  it('displays a toast when toast() is called', async () => {
    render(
      <>
        <Toaster />
        <ToastTrigger title="Saved!" description="Your changes were saved." />
      </>,
    )
    await act(async () => {
      fireEvent.click(screen.getByText('Show Toast'))
    })
    expect(screen.getByText('Saved!')).toBeInTheDocument()
    expect(screen.getByText('Your changes were saved.')).toBeInTheDocument()
  })

  it('renders destructive toast with data-slot="toast"', async () => {
    function DestructiveTrigger() {
      const { toast } = useToast()
      return (
        <button onClick={() => toast({ title: 'Error', variant: 'destructive' })}>Fail</button>
      )
    }
    render(
      <>
        <Toaster />
        <DestructiveTrigger />
      </>,
    )
    await act(async () => {
      fireEvent.click(screen.getByText('Fail'))
    })
    expect(document.querySelector('[data-slot="toast"]')).toBeInTheDocument()
    expect(screen.getByText('Error')).toBeInTheDocument()
  })
})
