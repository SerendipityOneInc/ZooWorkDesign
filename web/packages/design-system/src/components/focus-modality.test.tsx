import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { FocusModalityProvider } from './focus-modality'

describe('FocusModalityProvider', () => {
  it.each([undefined, 'dialog-overlay'])('preserves retained keyboard focus after a cancelled pointer interaction (%s)', (slot) => {
    render(
      <FocusModalityProvider>
        <button type="button">Keyboard action</button>
        <div data-slot={slot} onPointerDown={(event) => event.preventDefault()}>Outside</div>
      </FocusModalityProvider>,
    )
    const button = screen.getByRole('button', { name: 'Keyboard action' })
    fireEvent.keyDown(document, { key: 'Tab' })
    button.focus()

    fireEvent.pointerDown(screen.getByText('Outside'))

    expect(document.documentElement).toHaveAttribute('data-zc-input-modality', 'pointer')
    expect(button).toHaveFocus()
    expect(button).not.toHaveAttribute('data-zc-focus-modality')

    // A later direct interaction with the button should still mark pointer focus.
    fireEvent.pointerDown(button)
    expect(button).toHaveAttribute('data-zc-focus-modality', 'pointer')
  })

  it('keeps pointer focus suppressed when an outside pointer interaction does not move focus', () => {
    render(
      <FocusModalityProvider>
        <button type="button">Restored trigger</button>
        <div onPointerDown={(event) => event.preventDefault()}>Outside</div>
      </FocusModalityProvider>,
    )
    const trigger = screen.getByRole('button', { name: 'Restored trigger' })
    fireEvent.pointerDown(trigger)
    trigger.focus()

    fireEvent.pointerDown(screen.getByText('Outside'))

    expect(trigger).toHaveFocus()
    expect(trigger).toHaveAttribute('data-zc-focus-modality', 'pointer')
  })

  it('removes pointer state when a control truly loses focus', () => {
    render(
      <FocusModalityProvider>
        <button type="button">Action</button>
      </FocusModalityProvider>,
    )
    const button = screen.getByRole('button', { name: 'Action' })
    fireEvent.pointerDown(button)
    button.focus()
    button.blur()

    expect(button).not.toHaveFocus()
    expect(button).not.toHaveAttribute('data-zc-focus-modality')
  })

  it('inherits pointer modality when an overlay programmatically focuses another control', () => {
    render(
      <FocusModalityProvider>
        <button type="button">Open dialog</button>
        <button type="button">Cancel</button>
      </FocusModalityProvider>,
    )

    const trigger = screen.getByRole('button', { name: 'Open dialog' })
    const cancel = screen.getByRole('button', { name: 'Cancel' })

    fireEvent.pointerDown(trigger)
    cancel.focus()

    expect(cancel).toHaveFocus()
    expect(cancel).toHaveAttribute('data-zc-focus-modality', 'pointer')
  })

  it('marks pointer-focused controls and clears the marker for keyboard navigation', () => {
    render(
      <FocusModalityProvider>
        <button type="button">Action</button>
        <div data-slot="dialog-content">
          <button type="button">Overlay action</button>
        </div>
        <div data-slot="dialog-overlay">Backdrop</div>
      </FocusModalityProvider>,
    )

    const button = screen.getByRole('button', { name: 'Action' })
    const overlayButton = screen.getByRole('button', { name: 'Overlay action' })
    const backdrop = screen.getByText('Backdrop')
    fireEvent.pointerDown(button)

    expect(button).toHaveAttribute('data-zc-focus-modality', 'pointer')
    expect(document.documentElement).toHaveAttribute('data-zc-input-modality', 'pointer')

    fireEvent.pointerDown(overlayButton)

    expect(button).toHaveAttribute('data-zc-focus-modality', 'pointer')
    expect(overlayButton).toHaveAttribute('data-zc-focus-modality', 'pointer')

    fireEvent.pointerDown(backdrop)

    expect(button).toHaveAttribute('data-zc-focus-modality', 'pointer')

    fireEvent.keyDown(document, { key: 'Tab' })

    expect(button).not.toHaveAttribute('data-zc-focus-modality')
    expect(overlayButton).not.toHaveAttribute('data-zc-focus-modality')
    expect(document.documentElement).toHaveAttribute('data-zc-input-modality', 'keyboard')
  })
})
