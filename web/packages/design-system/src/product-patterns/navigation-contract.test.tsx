import { fireEvent, render, screen } from '@testing-library/react'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { PrimaryNavLogo } from './primary-nav-logo'
import { PrimaryNavItem } from './primary-nav-item'
import { PrimaryNavigation } from './primary-navigation'
import { PrimaryNavAgentSection } from './primary-nav-agent-section'
import { SecondaryNavigationLayout } from './secondary-navigation-layout'
import { ConnectorProviderCard } from './connector-provider-card'
import type { ConnectorAction } from './connector-types'
import { PrimaryNavFooter } from './primary-nav-footer'

it('shows the expanded logo without collapse controls when onToggle is omitted', () => {
  render(<PrimaryNavLogo isCollapsed={false} isMobile={false} lightLogoSrc="/light.png" darkLogoSrc="/dark.png" collapsedLogoSrc="/mark.png" />)
  expect(screen.getByTestId('sidebar-logo-expanded')).not.toHaveAttribute('inert')
  expect(screen.queryByTestId('sidebar-collapse-button')).not.toBeInTheDocument()
  expect(screen.queryByTestId('sidebar-expand-button')).not.toBeInTheDocument()
})

it('uses a light asset with a dark-mode filter only when a dedicated dark logo is missing', () => {
  const { rerender } = render(<PrimaryNavLogo isCollapsed={false} isMobile={false} lightLogoSrc="/light.svg" collapsedLogoSrc="/mark.svg" />)
  const dark = screen.getByTestId('sidebar-logo-dark')
  expect(dark).toHaveAttribute('src', '/light.svg')
  expect(dark).toHaveClass('dark:brightness-0', 'dark:invert')
  rerender(<PrimaryNavLogo isCollapsed={false} isMobile={false} lightLogoSrc="/light.svg" darkLogoSrc="/dark.svg" collapsedLogoSrc="/mark.svg" />)
  expect(dark).toHaveAttribute('src', '/dark.svg')
  expect(dark).not.toHaveClass('dark:brightness-0')
  expect(dark).not.toHaveClass('dark:invert')
})

it('provides the shared account footer surface without owning account state', () => {
  render(<PrimaryNavFooter aria-label="Account area"><button>Profile</button></PrimaryNavFooter>)
  const footer = screen.getByLabelText('Account area')
  expect(footer).toHaveAttribute('data-slot', 'primary-nav-footer')
  expect(footer).toHaveClass('in-data-[brand-theme=paper-focus]:border-t')
  expect(screen.getByRole('button', { name: 'Profile' }).parentElement).toBe(footer)
})

it('hands keyboard focus between collapse and expand without exposing hidden logo links', () => {
  function Header() {
    const [collapsed, setCollapsed] = useState(false)
    return (
      <PrimaryNavLogo
        isCollapsed={collapsed}
        isMobile={false}
        onToggle={() => setCollapsed((value) => !value)}
        lightLogoSrc="/light.png"
        darkLogoSrc="/dark.png"
        collapsedLogoSrc="/mark.png"
      />
    )
  }
  render(<Header />)
  fireEvent.click(screen.getByTestId('sidebar-collapse-button'), { detail: 0 })
  expect(screen.getByTestId('sidebar-expand-button')).toHaveFocus()
  expect(screen.getByTestId('sidebar-logo-expanded')).toHaveAttribute('inert')
  fireEvent.click(screen.getByTestId('sidebar-expand-button'), { detail: 0 })
  expect(screen.getByTestId('sidebar-collapse-button')).toHaveFocus()
  expect(screen.getByTestId('sidebar-logo-collapsed')).toHaveAttribute('inert')
})

it('preserves link selection and mobile dismissal without making disabled rows actionable', () => {
  const onNavigate = vi.fn(),
    onMobileMenuClose = vi.fn()
  const props = {
    item: { key: 'connector', href: '#connectors', label: 'Connector', icon: null },
    isActive: true,
    isCollapsed: false,
    isMobile: true,
    onNavigate,
    onMobileMenuClose,
  }
  const { rerender } = render(<PrimaryNavItem {...props} />)
  fireEvent.click(screen.getByRole('link', { name: 'Connector' }))
  expect(screen.getByRole('link')).toHaveAttribute('aria-current', 'page')
  expect(onNavigate).toHaveBeenCalledOnce()
  expect(onMobileMenuClose).toHaveBeenCalledOnce()
  rerender(<PrimaryNavItem {...props} item={{ ...props.item, disabled: true }} />)
  expect(screen.queryByRole('link')).not.toBeInTheDocument()
  fireEvent.click(screen.getByText('Connector', { exact: false }))
  expect(onNavigate).toHaveBeenCalledOnce()
})

it('removes the closed mobile drawer from focus navigation and dismisses the open backdrop', () => {
  const close = vi.fn()
  const { rerender } = render(
    <PrimaryNavigation
      isCollapsed={false}
      isMobile
      isMobileMenuOpen={false}
      onMobileMenuClose={close}
      logo={null}
      footer={null}
    >
      <button>Home</button>
    </PrimaryNavigation>,
  )
  expect(screen.getByTestId('side-nav')).toHaveAttribute('inert')
  rerender(
    <PrimaryNavigation
      isCollapsed={false}
      isMobile
      isMobileMenuOpen
      onMobileMenuClose={close}
      logo={null}
      footer={null}
    >
      <button>Home</button>
    </PrimaryNavigation>,
  )
  expect(screen.getByTestId('side-nav')).not.toHaveAttribute('inert')
  fireEvent.click(screen.getByRole('button', { name: 'Close navigation' }))
  expect(close).toHaveBeenCalledOnce()
})

it('closes the settings disclosure after changing the active section', () => {
  function Settings() {
    const [active, setActive] = useState('general')
    return (
      <SecondaryNavigationLayout
        title="Settings"
        activeTab={active}
        onTabChange={setActive}
        sections={[
          {
            id: 'profile',
            label: 'Personal',
            items: [
              { id: 'general', label: 'General', icon: null },
              { id: 'usage', label: 'Usage', icon: null },
            ],
          },
        ]}
      >
        <p>Content</p>
      </SecondaryNavigationLayout>
    )
  }
  render(<Settings />)
  const disclosure = screen.getByRole('button', { name: 'Settings General' })
  fireEvent.click(disclosure)
  expect(disclosure).toHaveAttribute('aria-expanded', 'true')
  fireEvent.click(screen.getByRole('button', { name: 'Usage' }))
  expect(screen.getByRole('button', { name: 'Usage' })).toHaveAttribute('aria-current', 'page')
  expect(disclosure).toHaveAttribute('aria-expanded', 'false')
  expect(disclosure).toHaveTextContent('Usage')
})

it('keeps retry available and prevents repeated list pagination while fetching', () => {
  const retry = vi.fn(),
    more = vi.fn()
  const { rerender } = render(<PrimaryNavAgentSection expanded createAction={null} failed onRetry={retry} />)
  fireEvent.click(screen.getByRole('button', { name: 'Retry' }))
  expect(retry).toHaveBeenCalledOnce()
  rerender(<PrimaryNavAgentSection expanded createAction={null} hasMore loadingMore onShowMore={more} />)
  fireEvent.click(screen.getByRole('button', { name: 'Show More' }))
  expect(more).not.toHaveBeenCalled()
})

describe('provider callback and pending-state contract', () => {
  const callbacks = () => ({ onConnect: vi.fn(), onEnable: vi.fn(), onDisable: vi.fn(), onDisconnect: vi.fn() })
  it.each(['connect', 'enable', 'disable', 'disconnect'] as const)('disables actions while %s is pending', (action) => {
    const handlers = callbacks()
    render(
      <ConnectorProviderCard
        name="GitHub"
        description="Repositories"
        logo={null}
        state={{ status: action === 'connect' ? 'disconnected' : 'connected', enabled: action !== 'enable' }}
        pendingAction={action as ConnectorAction}
        {...handlers}
      />,
    )
    for (const button of screen.getAllByRole('button')) {
      expect(button).toBeDisabled()
      fireEvent.click(button)
    }
    expect(screen.getByRole('button', { name: new RegExp(`^${action}$`, 'i') })).toHaveAttribute('aria-busy', 'true')
    Object.values(handlers).forEach((callback) => expect(callback).not.toHaveBeenCalled())
  })
  it('routes enable/disable and disconnect to their own handlers', () => {
    const handlers = callbacks()
    const { rerender } = render(
      <ConnectorProviderCard
        name="Gmail"
        description="Email"
        logo={null}
        state={{ status: 'connected', enabled: true }}
        pendingAction={null}
        {...handlers}
      />,
    )
    fireEvent.click(screen.getByRole('button', { name: 'Disable' }))
    expect(handlers.onDisable).toHaveBeenCalledOnce()
    rerender(
      <ConnectorProviderCard
        name="Gmail"
        description="Email"
        logo={null}
        state={{ status: 'connected', enabled: false }}
        pendingAction={null}
        {...handlers}
      />,
    )
    expect(screen.getByText('Disabled')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Enable' }))
    fireEvent.click(screen.getByRole('button', { name: 'Disconnect' }))
    expect(handlers.onEnable).toHaveBeenCalledOnce()
    expect(handlers.onDisconnect).toHaveBeenCalledOnce()
  })
  it('offers no action for an unavailable provider', () => {
    render(
      <ConnectorProviderCard
        name="Upcoming"
        description="Soon"
        logo={null}
        state={{ status: 'unavailable', enabled: false }}
        pendingAction={null}
        {...callbacks()}
      />,
    )
    expect(screen.getByText('Coming soon')).toBeInTheDocument()
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })
})
