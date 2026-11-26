import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs'

describe('Tabs', () => {
  function setup() {
    render(
      <Tabs defaultValue="a">
        <TabsList>
          <TabsTrigger value="a">Panel A</TabsTrigger>
          <TabsTrigger value="b">Panel B</TabsTrigger>
        </TabsList>
        <TabsContent value="a">Content A</TabsContent>
        <TabsContent value="b">Content B</TabsContent>
      </Tabs>,
    )
  }

  it('renders with data-slot attributes on all sub-parts', () => {
    setup()
    expect(document.querySelector('[data-slot="tabs"]')).toBeInTheDocument()
    expect(document.querySelector('[data-slot="tabs-list"]')).toBeInTheDocument()
    expect(document.querySelectorAll('[data-slot="tabs-trigger"]')).toHaveLength(2)
    expect(document.querySelectorAll('[data-slot="tabs-content"]').length).toBeGreaterThanOrEqual(1)
  })

  it('shows the default panel content', () => {
    setup()
    expect(screen.getByText('Content A')).toBeInTheDocument()
  })

  it('default trigger carries data-state=active, other is inactive', () => {
    setup()
    expect(screen.getByRole('tab', { name: 'Panel A' })).toHaveAttribute('data-state', 'active')
    expect(screen.getByRole('tab', { name: 'Panel A' })).toHaveClass('data-active:bg-surface')
    expect(screen.getByRole('tab', { name: 'Panel A' })).not.toHaveClass('data-active:bg-background')
    expect(screen.getByRole('tab', { name: 'Panel B' })).toHaveAttribute('data-state', 'inactive')
  })

  it('keeps keyboard panel navigation and skips disabled tabs', async () => {
    render(<Tabs defaultValue="a"><TabsList>
      <TabsTrigger value="a">Panel A</TabsTrigger>
      <TabsTrigger value="b" disabled>Panel B</TabsTrigger>
      <TabsTrigger value="c">Panel C</TabsTrigger>
    </TabsList><TabsContent value="a">Content A</TabsContent><TabsContent value="c">Content C</TabsContent></Tabs>)
    act(() => screen.getByRole('tab', { name: 'Panel A' }).focus())
    fireEvent.keyDown(document.activeElement!, { key: 'ArrowRight' })
    await waitFor(() => expect(screen.getByRole('tab', { name: 'Panel C' })).toHaveFocus())
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Content C')
    expect(screen.getByRole('tabpanel')).toHaveAttribute('aria-labelledby', screen.getByRole('tab', { name: 'Panel C' }).id)
  })

  it('preserves the selected panel when changing shared appearance properties', () => {
    const example = (variant: 'default' | 'line', size: 'sm' | 'lg') => <Tabs value="b"><TabsList variant={variant} size={size} block shape="round">
      <TabsTrigger value="a">Panel A</TabsTrigger><TabsTrigger value="b">Panel B</TabsTrigger>
    </TabsList><TabsContent value="a">Content A</TabsContent><TabsContent value="b">Content B</TabsContent></Tabs>
    const { rerender } = render(example('default', 'sm'))
    rerender(example('line', 'lg'))
    const tab = screen.getByRole('tab', { name: 'Panel B' })
    expect(tab).toHaveAttribute('aria-selected', 'true')
    expect(document.getElementById(tab.getAttribute('aria-controls')!)).toBe(screen.getByRole('tabpanel'))
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Content B')
  })

  it('controlled value shows correct panel content', () => {
    render(
      <Tabs value="b">
        <TabsList>
          <TabsTrigger value="a">Panel A</TabsTrigger>
          <TabsTrigger value="b">Panel B</TabsTrigger>
        </TabsList>
        <TabsContent value="a">Content A</TabsContent>
        <TabsContent value="b">Content B</TabsContent>
      </Tabs>,
    )
    expect(screen.getByText('Content B')).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'Panel B' })).toHaveAttribute('data-state', 'active')
  })
})
