import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
} from './navigation-menu'

describe('NavigationMenu', () => {
  it('renders root with data-slot="navigation-menu"', () => {
    render(
      <NavigationMenu data-testid="nav-menu">
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink href="/">Home</NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>,
    )
    expect(screen.getByTestId('nav-menu')).toHaveAttribute(
      'data-slot',
      'navigation-menu',
    )
  })

  it('renders list with data-slot="navigation-menu-list"', () => {
    render(
      <NavigationMenu>
        <NavigationMenuList data-testid="list">
          <NavigationMenuItem>
            <NavigationMenuLink href="/products">Products</NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>,
    )
    expect(screen.getByTestId('list')).toHaveAttribute(
      'data-slot',
      'navigation-menu-list',
    )
  })

  it('renders NavigationMenuLink with data-slot', () => {
    render(
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink href="/about" data-testid="link">About</NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>,
    )
    expect(screen.getByTestId('link')).toHaveAttribute('data-slot', 'navigation-menu-link')
  })

  it('navigationMenuTriggerStyle returns a className string', () => {
    const cls = navigationMenuTriggerStyle()
    expect(typeof cls).toBe('string')
    expect(cls.length).toBeGreaterThan(0)
  })

  it('NavigationMenuTrigger renders with data-slot', () => {
    render(
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger data-testid="trigger">Menu</NavigationMenuTrigger>
            <NavigationMenuContent>
              <p>Content</p>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>,
    )
    expect(screen.getByTestId('trigger')).toHaveAttribute('data-slot', 'navigation-menu-trigger')
  })

  it('renders the active item content when controlled open via value', () => {
    render(
      <NavigationMenu value="products" viewport={false}>
        <NavigationMenuList>
          <NavigationMenuItem value="products">
            <NavigationMenuTrigger>Products</NavigationMenuTrigger>
            <NavigationMenuContent>
              <NavigationMenuLink href="/analytics">Analytics</NavigationMenuLink>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>,
    )
    // the controlled `value` matches the item's value, so its content is open
    // and the link inside it is wired through and rendered
    const link = screen.getByText('Analytics')
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('data-slot', 'navigation-menu-link')
    const content = link.closest('[data-slot="navigation-menu-content"]')
    expect(content).toBeInTheDocument()
    expect(content).toHaveClass(
      'group-data-[viewport=false]/navigation-menu:bg-popover',
      'group-data-[viewport=false]/navigation-menu:border-border',
      'group-data-[viewport=false]/navigation-menu:shadow-[var(--elevation-overlay)]',
    )
    expect(content?.className).not.toMatch(/glass|backdrop-blur/)
  })

  it('NavigationMenuIndicator and NavigationMenuViewport are valid components', () => {
    // Render them inside NavigationMenu so they have the required context
    const { container } = render(
      <NavigationMenu viewport={false}>
        <NavigationMenuList>
          <NavigationMenuIndicator data-testid="indicator" />
        </NavigationMenuList>
        <NavigationMenuViewport data-testid="viewport" />
      </NavigationMenu>,
    )
    // They render without throwing; assert the container is not empty
    expect(container.firstChild).toBeInTheDocument()
  })
})
