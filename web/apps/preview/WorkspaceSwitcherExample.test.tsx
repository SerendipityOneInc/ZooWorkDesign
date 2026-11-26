import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { expect, it } from 'vitest'
import { WorkspaceSwitcherExample } from './WorkspaceSwitcherExample'
import { PreviewLocaleProvider } from './locale'

it('switches local projects, marks the selection, and creates a local project through the primary action', async () => {
  render(<WorkspaceSwitcherExample />)
  expect(screen.queryByTestId('sidebar-collapse-button')).not.toBeInTheDocument()
  const trigger = screen.getByRole('button', { name: 'Select project' })
  fireEvent.keyDown(trigger, { key: 'Enter' })
  const current = screen.getByRole('menuitemradio', { name: 'Default Project' })
  expect(current).toHaveAttribute('aria-checked', 'true')
  expect(current.querySelector('svg')).toBeInTheDocument()
  fireEvent.click(screen.getByRole('menuitemradio', { name: 'Research' }))
  expect(trigger).toHaveTextContent('Research')
  fireEvent.keyDown(trigger, { key: 'Enter' })
  const create = screen.getByRole('menuitem', { name: 'Create project' })
  expect(create).toHaveAttribute('data-variant', 'default')
  fireEvent.click(create)
  expect(trigger).toHaveTextContent('New project 1')
  expect(screen.getByRole('status')).toHaveTextContent('Selected project: New project 1')
})

it('localizes the project menu and shared account panel', async () => {
  render(<PreviewLocaleProvider initialLocale="zh"><WorkspaceSwitcherExample /></PreviewLocaleProvider>)
  fireEvent.keyDown(screen.getByRole('button', { name: '选择项目' }), { key: 'Enter' })
  expect(screen.getByRole('menuitem', { name: '创建项目' })).toBeInTheDocument()
  fireEvent.keyDown(screen.getByRole('menu'), { key: 'Escape' })
  await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument())
  const trigger = screen.getByRole('button', { name: '打开账户菜单' })
  fireEvent.click(trigger)
  const panel = await screen.findByRole('dialog', { name: '账户菜单' })
  fireEvent.click(within(panel).getByRole('button', { name: '关于积分' }))
  expect(within(panel).getByRole('status')).toHaveTextContent('积分数据由接入应用提供。')
  fireEvent.keyDown(panel, { key: 'Escape' })
  await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
  expect(trigger).toHaveFocus()
})

it('supports an outline create action without changing project selection', () => {
  render(<WorkspaceSwitcherExample />)
  fireEvent.click(screen.getByRole('radio', { name: 'Outline' }))
  fireEvent.keyDown(screen.getByRole('button', { name: 'Select project' }), { key: 'Enter' })
  expect(screen.getByRole('menuitemradio', { name: 'Default Project' })).toHaveAttribute('aria-checked', 'true')
  const create = screen.getByRole('menuitem', { name: 'Create project' })
  expect(create).toHaveAttribute('data-variant', 'outline')
  fireEvent.click(create)
  expect(screen.getByRole('button', { name: 'Select project' })).toHaveTextContent('New project 1')
})
