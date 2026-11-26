import { fireEvent, render, screen } from '@testing-library/react'
import { expect, it, vi } from 'vitest'
import { WorkspaceMonogram, WorkspaceSwitcherTrigger } from './workspace-switcher-trigger'
import { WorkspaceAgentSwitcher } from './workspace-agent-switcher'

it('uses the supplied avatar and full project name with navigation alignment', () => {
  const click = vi.fn()
  const name = 'A very long project name'
  const { rerender } = render(<WorkspaceSwitcherTrigger name={name} avatar={<WorkspaceMonogram name={name} />}
    layout="primary-nav" hideNameOnMobile={false} onClick={click} />)
  const button = screen.getByRole('button', { name })
  expect(screen.getByText(name)).toHaveAttribute('title', name)
  expect(screen.getByText(name)).not.toHaveClass('hidden')
  expect(button.querySelector('[data-slot="workspace-monogram"]')).toHaveTextContent('A')
  expect(button.querySelector('[data-slot="workspace-monogram"]')).toHaveClass('size-5')
  expect(button).toHaveAttribute('data-workspace-switcher-layout', 'primary-nav')
  fireEvent.click(button)
  expect(click).toHaveBeenCalledOnce()
  rerender(<WorkspaceSwitcherTrigger name={name} avatar={<WorkspaceMonogram name={name} />} layout="secondary-nav" />)
  expect(button).toHaveAttribute('data-workspace-switcher-layout', 'secondary-nav')
})

it.each([['  default', 'D'], ['项目', '项'], ['', '—']])('creates a monogram for %s', (name, initial) => {
  render(<WorkspaceMonogram name={name} />)
  expect(screen.getByText(initial)).toHaveAttribute('aria-hidden', 'true')
})

it('preserves the agent switcher default layout, avatar, current item and link destination', () => {
  render(<WorkspaceAgentSwitcher name="Market Brief" avatar={<img src="/avatar.png" alt="Agent" />}
    items={[{ id: 'market', name: 'Market Brief', avatar: null, href: '/agents/market', current: true }]} />)
  const button = screen.getByRole('button', { name: 'Switch agent: Market Brief' })
  expect(button).toHaveAttribute('data-workspace-switcher-layout', 'workspace')
  expect(screen.getByRole('img', { name: 'Agent' })).toHaveAttribute('src', '/avatar.png')
  expect(screen.getByText('Market Brief')).toHaveClass('hidden', 'md:block')
  fireEvent.keyDown(button, { key: 'Enter' })
  const item = screen.getByRole('menuitem', { name: 'Market Brief' })
  expect(item).toHaveAttribute('href', '/agents/market')
  expect(item).toHaveAttribute('aria-current', 'page')
})
