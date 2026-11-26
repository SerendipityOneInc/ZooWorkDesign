import { act, fireEvent, render, screen, within } from '@testing-library/react'
import { expect, it, vi } from 'vitest'
import { ConnectorExample, ConnectorPatternSection, ProductNavigationSection } from './ProductPatterns'
import { AgentNavigationExample, PrimaryNavigationExample, SettingsNavigationExample } from './NavigationExamples'
import { resolveCatalogLocation } from './catalog-location'

it('combines category and search filters and reports no results', () => {
  render(<ConnectorPatternSection />)
  fireEvent.click(screen.getByRole('button', { name: 'Workspace' }))
  expect(screen.getByRole('heading', { name: 'Google Docs' })).toBeInTheDocument()
  expect(screen.queryByRole('heading', { name: 'Gmail' })).not.toBeInTheDocument()
  fireEvent.change(screen.getByRole('textbox'), { target: { value: 'gmail' } })
  expect(screen.getByRole('status')).toHaveTextContent('No connectors found')
  fireEvent.click(screen.getByRole('button', { name: 'All' }))
  expect(screen.getByRole('heading', { name: 'Gmail' })).toBeInTheDocument()
})

it('isolates provider mutations and supports the complete connection lifecycle', async () => {
  vi.useFakeTimers()
  try {
    render(
      <>
        <ConnectorExample />
        <ConnectorExample name="Slack" />
      </>,
    )
    const gmail = within(screen.getByRole('heading', { name: 'Gmail' }).closest('article')!)
    const slack = within(screen.getByRole('heading', { name: 'Slack' }).closest('article')!)
    fireEvent.click(gmail.getByRole('button', { name: 'Connect' }))
    expect(gmail.getByRole('button', { name: 'Connect' })).toBeDisabled()
    expect(slack.getByRole('button', { name: 'Connect' })).toBeEnabled()
    await act(() => vi.advanceTimersByTimeAsync(900))
    expect(gmail.getByText('Connected')).toBeInTheDocument()
    fireEvent.click(gmail.getByRole('button', { name: 'Disable' }))
    await act(() => vi.advanceTimersByTimeAsync(900))
    expect(gmail.getByText('Disabled')).toBeInTheDocument()
    fireEvent.click(gmail.getByRole('button', { name: 'Enable' }))
    await act(() => vi.advanceTimersByTimeAsync(900))
    fireEvent.click(gmail.getByRole('button', { name: 'Disconnect' }))
    await act(() => vi.advanceTimersByTimeAsync(900))
    expect(gmail.getByRole('button', { name: 'Connect' })).toBeEnabled()
  } finally {
    vi.useRealTimers()
  }
})

it('preserves navigation collapse, agent expansion and account dismissal', () => {
  render(<PrimaryNavigationExample />)
  fireEvent.click(screen.getByRole('button', { name: 'Show More' }))
  expect(screen.getByRole('link', { name: 'Writing Assistant' })).toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: 'Show Less' }))
  expect(screen.queryByRole('link', { name: 'Writing Assistant' })).not.toBeInTheDocument()
  fireEvent.click(screen.getByTestId('sidebar-collapse-button'))
  expect(document.querySelector('[data-app-shell]')).toHaveAttribute('data-nav-collapsed', 'true')
  fireEvent.click(screen.getByTestId('sidebar-expand-button'))
  fireEvent.click(screen.getByTestId('user-card-toggle'))
  expect(screen.getByTestId('user-card-toggle')).toHaveAttribute('aria-expanded', 'true')
  fireEvent.keyDown(document, { key: 'Escape' })
  expect(screen.getByTestId('user-card-toggle')).toHaveAttribute('aria-expanded', 'false')
})

it('shows navigation components without an embedded page or content main', () => {
  const { container } = render(<ProductNavigationSection />)
  expect(screen.getAllByRole('navigation')).toHaveLength(4)
  expect(container.querySelector('iframe, main')).toBeNull()
})

it.each([SettingsNavigationExample, AgentNavigationExample])('keeps global account controls and their divider out of secondary navigation: %s', (Navigation) => {
  const back = vi.fn()
  const { container } = render(<Navigation onBack={back} />)
  expect(screen.queryByTestId('user-card-toggle')).not.toBeInTheDocument()
  expect(container.querySelector('[data-slot="primary-nav-footer"]')).toBeNull()
  const backLink = screen.getByRole(Navigation === AgentNavigationExample ? 'button' : 'link', { name: /Back to/ })
  fireEvent.click(backLink)
  expect(back).toHaveBeenCalledOnce()
})

it('keeps personal settings pages available without a duplicate profile footer', () => {
  render(<SettingsNavigationExample />)
  const personal = within(screen.getByText('Personal').parentElement!)
  fireEvent.click(personal.getByRole('button', { name: 'General' }))
  expect(personal.getByRole('button', { name: 'General' })).toHaveAttribute('aria-current', 'page')
})

it('maps legacy deep links into the integrated catalog and preserves other query parameters', () => {
  expect(resolveCatalogLocation('?showcase=agent&theme=dark', '')).toBe('?theme=dark#product-navigation')
  expect(resolveCatalogLocation('?showcase=workspace', '')).toBe('#connector-pattern')
  expect(resolveCatalogLocation('', '#product-catalog')).toBe('#connector-cards')
  expect(resolveCatalogLocation('?theme=dark', '#segmented')).toBe('?theme=dark#tabs')
  expect(resolveCatalogLocation('', '#brand')).toBeNull()
})
