import { createRef } from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { ComposerSendButton, ComposerStopButton } from './composer-action-buttons'
import { MoreIconButton, SettingsPanelToggleButton } from './product-icon-buttons'
import { UpdateActionButton, UpdateAvailableBadge } from './update-controls'

describe('product action controls', () => {
  it('prevents repeat update submissions and keeps a meaningful busy label', () => {
    const update = vi.fn()
    const props = { label: 'Update', loadingLabel: 'Updating', onClick: update }
    const { rerender } = render(<UpdateActionButton {...props} updating={false} />)
    fireEvent.click(screen.getByRole('button', { name: 'Update' }))
    rerender(<UpdateActionButton {...props} updating />)
    const pending = screen.getByRole('button', { name: 'Updating' })
    expect(pending).toBeDisabled()
    expect(pending).toHaveAttribute('aria-busy', 'true')
    fireEvent.click(pending)
    expect(update).toHaveBeenCalledTimes(1)
  })

  it('keeps send as submit and stop as a non-submitting control', () => {
    const submit = vi.fn((event) => event.preventDefault())
    const stop = vi.fn()
    render(
      <form onSubmit={submit}>
        <ComposerSendButton aria-label="Send" />
        <ComposerStopButton aria-label="Stop" onClick={stop} />
      </form>,
    )
    fireEvent.click(screen.getByRole('button', { name: 'Send' }))
    const stopButton = screen.getByRole('button', { name: 'Stop' })
    expect(stopButton.querySelector('svg')).toHaveAttribute('fill', 'currentColor')
    expect(stopButton.querySelector('svg')).not.toHaveAttribute('stroke', 'currentColor')
    fireEvent.click(stopButton)
    expect(submit).toHaveBeenCalledTimes(1)
    expect(stop).toHaveBeenCalledTimes(1)
  })

  it('forwards refs and controlled panel state, and exposes update meaning', () => {
    const ref = createRef<HTMLButtonElement>()
    render(
      <>
        <MoreIconButton ref={ref} aria-label="More" />
        <SettingsPanelToggleButton open aria-label="Hide panel" />
        <UpdateAvailableBadge label="Version update available" />
      </>,
    )
    expect(ref.current).toBe(screen.getByRole('button', { name: 'More' }))
    expect(screen.getByRole('button', { name: 'Hide panel' })).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('img', { name: 'Version update available' })).toBeInTheDocument()
  })
})
