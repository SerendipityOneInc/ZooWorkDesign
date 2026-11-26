import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { useState } from 'react'
import { expect, it, vi } from 'vitest'
import { AccountCreditsRow } from './account-credits'
import { PrimaryNavAccountMenu } from './primary-nav-account-menu'
import { AccountMenuItem, AccountMenuSurface } from './account-menu-surface'

it('distinguishes floating surfaces from legacy inline positioning and clipping', () => {
  const { rerender } = render(<AccountMenuSurface data-testid="surface">Content</AccountMenuSurface>)
  const surface = screen.getByTestId('surface')
  expect(surface).not.toHaveAttribute('data-floating')
  expect(surface).toHaveClass('absolute', 'bottom-full')
  rerender(<AccountMenuSurface floating data-testid="surface">Content</AccountMenuSurface>)
  expect(surface).toHaveAttribute('data-floating', 'true')
  expect(surface).not.toHaveClass('absolute', 'bottom-full')
  expect(surface).toHaveClass('overflow-y-auto')
})

it('supports route links without button attributes or nested interactive elements', () => {
  render(<><AccountCreditsRow label="Credits" balance="$248.68" href="/billing" />
    <AccountMenuItem asChild><a href="/settings">Settings</a></AccountMenuItem></>)
  expect(screen.getByRole('link', { name: 'Credits $248.68' })).toHaveAttribute('href', '/billing')
  expect(screen.getByRole('link', { name: 'Credits $248.68' })).not.toHaveAttribute('type')
  expect(screen.getByRole('link', { name: 'Settings' })).not.toHaveAttribute('type')
  expect(screen.queryByRole('button')).not.toBeInTheDocument()
})

it('does not submit a surrounding form from either credit action', () => {
  const submit = vi.fn(event => event.preventDefault())
  render(<form onSubmit={submit}><AccountCreditsRow label="Credits" balance="12,000" onNavigate={vi.fn()} onAbout={vi.fn()} /></form>)
  fireEvent.click(screen.getByRole('button', { name: 'Credits 12,000' }))
  fireEvent.click(screen.getByRole('button', { name: 'About credits' }))
  expect(submit).not.toHaveBeenCalled()
})

it('keeps credit information separate from billing navigation', () => {
  const navigate = vi.fn(), about = vi.fn()
  render(<AccountCreditsRow label="Credits" balance="12,000" onNavigate={navigate} onAbout={about} />)
  fireEvent.click(screen.getByRole('button', { name: 'About credits' }))
  expect(about).toHaveBeenCalledOnce()
  expect(navigate).not.toHaveBeenCalled()
  fireEvent.click(screen.getByRole('button', { name: 'Credits 12,000' }))
  expect(navigate).toHaveBeenCalledOnce()
})

it('shows an unavailable balance without exposing a billing action', () => {
  render(<AccountCreditsRow label="Credits" balance="$—" balanceLabel="Balance unavailable" href="/billing" disabled />)
  expect(screen.getByLabelText('Balance unavailable')).toHaveTextContent('$—')
  expect(screen.queryByRole('link')).not.toBeInTheDocument()
  expect(screen.queryByRole('button')).not.toBeInTheDocument()
})

it.each(['Open account menu', 'Open account actions'])('returns Escape focus to %s', async (label) => {
  function Account() {
    const [open, setOpen] = useState(false)
    return <PrimaryNavAccountMenu displayName="Lynn" open={open} onOpenChange={setOpen}><a href="/profile">Profile</a></PrimaryNavAccountMenu>
  }
  render(<Account />)
  const trigger = screen.getByRole('button', { name: label })
  fireEvent.click(trigger)
  const panel = await screen.findByRole('dialog', { name: 'Account menu' })
  expect(trigger).toHaveAttribute('aria-expanded', 'true')
  await waitFor(() => expect(panel.contains(document.activeElement)).toBe(true))
  fireEvent.keyDown(panel, { key: 'Escape' })
  await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
  expect(trigger).toHaveFocus()
})

it('dismisses when focus moves outside and leaves focus on the new target', async () => {
  function Account() {
    const [open, setOpen] = useState(false)
    return <><PrimaryNavAccountMenu displayName="Lynn" open={open} onOpenChange={setOpen}>
      <button>Settings</button>
    </PrimaryNavAccountMenu><button>Outside</button></>
  }
  render(<Account />)
  fireEvent.click(screen.getByRole('button', { name: 'Open account menu' }))
  await screen.findByRole('dialog', { name: 'Account menu' })
  const outside = screen.getByRole('button', { name: 'Outside' })
  act(() => outside.focus())
  await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
  expect(outside).toHaveFocus()
})


it.each(['Open account menu', 'Open account actions'])('allows a focus handoff after %s closes without restoring the old trigger', async (label) => {
  const handedOff = vi.fn()
  function Account() {
    const [open, setOpen] = useState(false)
    return <><PrimaryNavAccountMenu displayName="Lynn" open={open} onOpenChange={setOpen}
      onCloseAutoFocus={(event, trigger) => {
        event.preventDefault()
        handedOff(trigger)
        screen.getByRole('button', { name: 'Destination' }).focus()
      }}><button onClick={() => setOpen(false)}>Continue</button></PrimaryNavAccountMenu>
      <button>Destination</button></>
  }
  render(<Account />)
  const trigger = screen.getByRole('button', { name: label })
  fireEvent.click(trigger)
  fireEvent.click(await screen.findByRole('button', { name: 'Continue' }))
  await waitFor(() => expect(handedOff).toHaveBeenCalledWith(trigger))
  expect(screen.queryByRole('dialog', { name: 'Account menu' })).not.toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'Destination' })).toHaveFocus()
})
