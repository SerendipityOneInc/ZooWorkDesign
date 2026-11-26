import { useState } from 'react'
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, expect, it, vi } from 'vitest'
import { GlobalAlert } from './global-alert'
import { MarketingLayout, MarketingSection } from './marketing-layout'
import { WorkspaceLayout } from './workspace-layout'

afterEach(() => { cleanup(); vi.useRealTimers() })

it('keeps global notices visible until explicitly dismissed without stealing focus', () => {
  vi.useFakeTimers()
  function Harness() {
    const [open, setOpen] = useState(false)
    return <><button onClick={() => setOpen(true)}>Show notice</button><GlobalAlert open={open}
      title="Maintenance" description="Save your work" status="warning" closeLabel="Dismiss maintenance" onClose={() => setOpen(false)} /></>
  }
  const { container } = render(<Harness />)
  const trigger = screen.getByRole('button', { name: 'Show notice' })
  trigger.focus()
  fireEvent.click(trigger)
  const notice = screen.getByRole('status', { name: 'Maintenance' })
  expect(container).not.toContainElement(notice)
  expect(trigger).toHaveFocus()
  expect(notice).toHaveAccessibleDescription('Save your work')
  act(() => vi.advanceTimersByTime(60000))
  expect(notice).toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: 'Dismiss maintenance' }))
  expect(screen.queryByRole('status')).not.toBeInTheDocument()
})

it('contains embedded notices in their supplied canvas and supports error recovery actions', () => {
  const canvas = document.createElement('div')
  document.body.append(canvas)
  const action = vi.fn()
  const { rerender } = render(<GlobalAlert open container={canvas} title="Disconnected" status="danger"
    actions={<button onClick={action}>Reconnect</button>} />)
  const notice = screen.getByRole('alert', { name: 'Disconnected' })
  expect(canvas).toContainElement(notice)
  expect(screen.queryByRole('button', { name: 'Close' })).not.toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: 'Reconnect' }))
  expect(action).toHaveBeenCalledOnce()
  rerender(<GlobalAlert open container={canvas} title="Connected" status="success" />)
  expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  expect(screen.getByRole('status', { name: 'Connected' })).toBeInTheDocument()
  canvas.remove()
})

it('composes website slots in reading order without adding nested main landmarks', () => {
  const { container } = render(<MarketingLayout header={<header>Header</header>} footer={<footer>Footer</footer>}>
    <main><MarketingSection><h1>Welcome</h1></MarketingSection></main>
  </MarketingLayout>)
  expect(screen.getAllByRole('main')).toHaveLength(1)
  const heading = screen.getByRole('heading', { name: 'Welcome' })
  expect(heading.compareDocumentPosition(screen.getByRole('contentinfo')) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  expect(container.querySelector('[data-slot="layout-container"]')).toContainElement(heading)
})

it('replaces desktop navigation with an accessible mobile sheet and restores focus after Escape', async () => {
  const props = { navigation: <a href="#settings">Settings</a>, navigationFooter: <span>Profile</span>,
    navigationLabel: 'App navigation', openNavigationLabel: 'Open navigation', closeNavigationLabel: 'Close navigation', children: <p>Content</p> }
  const { rerender } = render(<WorkspaceLayout {...props} compact={false} />)
  expect(screen.getByRole('navigation', { name: 'App navigation' })).toBeVisible()
  expect(screen.getByText('Profile')).toBeVisible()
  expect(screen.queryByRole('button', { name: 'Open navigation' })).not.toBeInTheDocument()
  rerender(<WorkspaceLayout {...props} compact />)
  expect(screen.queryByRole('navigation')).not.toBeInTheDocument()
  const trigger = screen.getByRole('button', { name: 'Open navigation' })
  trigger.focus()
  fireEvent.click(trigger)
  expect(screen.getByRole('dialog', { name: 'App navigation' })).toBeVisible()
  fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' })
  await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
  await waitFor(() => expect(trigger).toHaveFocus())
})
