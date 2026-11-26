import { fireEvent, render, screen } from '@testing-library/react'
import { expect, it, vi } from 'vitest'
import { WorkspacePageHeader } from './workspace-page-header'

it('preserves the default section heading, spacing and content slots', () => {
  render(<WorkspacePageHeader title="Agents" description="Manage agents." badge={<span>Beta</span>} />)
  const heading = screen.getByRole('heading', { level: 2, name: 'Agents' })
  expect(heading).toHaveClass('text-base', 'font-semibold')
  expect(heading.closest('header')).toHaveClass('mb-6', 'shrink-0')
  expect(screen.getByText('Manage agents.')).toBeInTheDocument()
  expect(screen.getByText('Beta')).toBeInTheDocument()
})

it('supports a page heading and operable actions while constraining long content', () => {
  const create = vi.fn()
  render(<WorkspacePageHeader size="page" headingLevel={1} id="keys-title" title="API keys"
    description="Manage credentials for the selected project." actions={<button onClick={create}>Create key</button>} />)
  const heading = screen.getByRole('heading', { level: 1, name: 'API keys' })
  expect(heading).toHaveAttribute('id', 'keys-title')
  expect(heading).toHaveClass('text-2xl', 'break-words', 'min-w-0')
  expect(heading.closest('header')).toHaveAttribute('data-size', 'page')
  fireEvent.click(screen.getByRole('button', { name: 'Create key' }))
  expect(create).toHaveBeenCalledOnce()
})
