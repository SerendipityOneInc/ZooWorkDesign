import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'

import {
  DropdownMenu,
  DropdownMenuAction,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from './dropdown-menu'

describe('DropdownMenu', () => {
  it.each(['dot', 'check'] as const)('shows the selected %s indicator without changing single-selection behavior', (indicator) => {
    function Selection() {
      const [selected, setSelected] = useState('first')
      return <DropdownMenu open>
        <DropdownMenuTrigger>Projects</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuRadioGroup value={selected} onValueChange={setSelected}>
            <DropdownMenuRadioItem value="first" indicator={indicator}>First</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="second" indicator={indicator}>Second</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    }
    render(<Selection />)
    const first = screen.getByRole('menuitemradio', { name: 'First' })
    const second = screen.getByRole('menuitemradio', { name: 'Second' })
    expect(first).toHaveAttribute('aria-checked', 'true')
    expect(second).toHaveAttribute('aria-checked', 'false')
    expect(first.querySelector('[data-slot="dropdown-menu-radio-item-indicator"]')).not.toBeEmptyDOMElement()
    if (indicator === 'check') expect(first.querySelector('svg')).toBeInTheDocument()
    else expect(first.querySelector('[data-slot="dropdown-menu-radio-item-indicator"] .block')).toBeInTheDocument()
    fireEvent.click(second)
    expect(first).toHaveAttribute('aria-checked', 'false')
    expect(second).toHaveAttribute('aria-checked', 'true')
  })

  it.each([undefined, 'outline'] as const)('keeps the %s action in keyboard navigation and closes after selection', async (variant) => {
    const create = vi.fn()
    render(<DropdownMenu>
      <DropdownMenuTrigger>Projects</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>Existing project</DropdownMenuItem>
        <DropdownMenuAction variant={variant} onSelect={create}>Create project</DropdownMenuAction>
      </DropdownMenuContent>
    </DropdownMenu>)
    fireEvent.keyDown(screen.getByRole('button', { name: 'Projects' }), { key: 'ArrowDown' })
    const action = screen.getByRole('menuitem', { name: 'Create project' })
    expect(action).toHaveAttribute('data-variant', variant ?? 'default')
    fireEvent.keyDown(screen.getByRole('menu'), { key: 'End' })
    await waitFor(() => expect(action).toHaveFocus())
    fireEvent.keyDown(action, { key: 'Enter' })
    expect(create).toHaveBeenCalledOnce()
    await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument())
  })

  it('does not activate a disabled primary action', () => {
    const create = vi.fn()
    render(<DropdownMenu open>
      <DropdownMenuTrigger>Projects</DropdownMenuTrigger>
      <DropdownMenuContent><DropdownMenuAction disabled onSelect={create}>Create project</DropdownMenuAction></DropdownMenuContent>
    </DropdownMenu>)
    const action = screen.getByRole('menuitem', { name: 'Create project' })
    expect(action).toHaveAttribute('aria-disabled', 'true')
    fireEvent.click(action)
    fireEvent.keyDown(action, { key: 'Enter' })
    expect(create).not.toHaveBeenCalled()
  })
  it('renders trigger with data-slot="dropdown-menu-trigger"', () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger data-testid="trigger">Open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Item A</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    )
    expect(screen.getByTestId('trigger')).toHaveAttribute('data-slot', 'dropdown-menu-trigger')
  })

  it('opens the menu and reveals items on keyboard activation', () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger data-testid="trigger">Open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Item A</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    )
    // closed by default — item not in the document
    expect(screen.queryByText('Item A')).not.toBeInTheDocument()
    // activating the trigger (Enter) opens the menu
    fireEvent.keyDown(screen.getByTestId('trigger'), { key: 'Enter' })
    const item = screen.getByText('Item A')
    expect(item).toBeInTheDocument()
    expect(item).toHaveAttribute('data-slot', 'dropdown-menu-item')
  })

  it('supports the composer popover surface extracted from the unified composer menu', async () => {
    render(
      <DropdownMenu open>
        <DropdownMenuTrigger data-testid="trigger">Open</DropdownMenuTrigger>
        <DropdownMenuContent surface="composer" data-testid="content">
          <DropdownMenuItem>Attach file</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    )

    const content = await screen.findByTestId('content')
    expect(content).toHaveAttribute('data-surface', 'composer')
    expect(content).toHaveClass('w-[213px]')
    expect(content).toHaveClass('border-border', 'bg-popover', 'shadow-[var(--elevation-overlay)]')
    expect(content.className).not.toMatch(/glass|backdrop-blur/)
  })

  it('treats the deprecated glass surface as the same opaque default surface', async () => {
    render(
      <DropdownMenu open>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent surface="glass" data-testid="content">
          <DropdownMenuItem>Attach file</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    )

    const content = await screen.findByTestId('content')
    expect(content).toHaveClass('rounded-md', 'border-border', 'bg-popover')
    expect(content.className).not.toMatch(/bg-glass|backdrop-blur|shadow-glass/)
  })

  it('supports compact composer menu rows', async () => {
    render(
      <DropdownMenu open>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem density="composer">Attach file</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    )

    const item = await screen.findByText('Attach file')
    expect(item).toHaveAttribute('data-density', 'composer')
    expect(item).toHaveClass('h-9')
    expect(item).toHaveClass('rounded-sm')
    expect(item).toHaveClass('text-xs')
    expect(item).toHaveClass('focus:bg-hover')
  })

  it('DropdownMenuLabel renders with data-slot', () => {
    render(<DropdownMenuLabel data-testid="label">Actions</DropdownMenuLabel>)
    expect(screen.getByTestId('label')).toHaveAttribute('data-slot', 'dropdown-menu-label')
  })

  it('DropdownMenuSeparator renders with data-slot', () => {
    render(<DropdownMenuSeparator data-testid="sep" />)
    expect(screen.getByTestId('sep')).toHaveAttribute('data-slot', 'dropdown-menu-separator')
  })

  it('DropdownMenuShortcut renders with data-slot', () => {
    render(<DropdownMenuShortcut data-testid="shortcut">⌘K</DropdownMenuShortcut>)
    expect(screen.getByTestId('shortcut')).toHaveAttribute('data-slot', 'dropdown-menu-shortcut')
  })

  it('structural Portal/Sub/Radio/Group components are valid functions', () => {
    // These require open context or nesting — assert export shape only
    expect(typeof DropdownMenuPortal).toBe('function')
    expect(typeof DropdownMenuGroup).toBe('function')
    expect(typeof DropdownMenuCheckboxItem).toBe('function')
    expect(typeof DropdownMenuRadioGroup).toBe('function')
    expect(typeof DropdownMenuRadioItem).toBe('function')
    expect(typeof DropdownMenuSub).toBe('function')
    expect(typeof DropdownMenuSubTrigger).toBe('function')
    expect(typeof DropdownMenuSubContent).toBe('function')
  })

})
