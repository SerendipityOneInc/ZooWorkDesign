import { fireEvent, render, screen } from '@testing-library/react'
import { expect, it, vi } from 'vitest'

import { PluginEmptyState } from './plugin-empty-state'

it('preserves the existing plugin API and exposes text without announcing decorative art', () => {
  const { container } = render(<PluginEmptyState title="No results" description="Try another search." data-testid="state" />)
  expect(screen.getByRole('heading', { name: 'No results', level: 3 })).toBeInTheDocument()
  expect(screen.getByText('Try another search.')).toBeInTheDocument()
  expect(screen.getByTestId('state')).toHaveAttribute('data-layout', 'page')
  expect(screen.queryByRole('img')).not.toBeInTheDocument()
  expect(container.querySelector('img')).toHaveAttribute('alt', '')
  expect(container.querySelector('[data-slot="empty-state-actions"]')).not.toBeInTheDocument()
})

it('supports section headings and caller-owned actions without empty description spacing', () => {
  const create = vi.fn()
  const { container, rerender } = render(<PluginEmptyState title="No API keys yet" variant="empty-credentials" layout="section" headingLevel={2}>
    <button onClick={create}>Create first key</button>
  </PluginEmptyState>)
  expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('No API keys yet')
  expect(container.querySelector('p')).not.toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: 'Create first key' }))
  expect(create).toHaveBeenCalledOnce()
  rerender(<PluginEmptyState title="Page not found" variant="not-found" headingLevel={1} layout="section" />)
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Page not found')
})
