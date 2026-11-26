import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuPortal,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from './context-menu'

describe('ContextMenu', () => {
  it('renders trigger with data-slot="context-menu-trigger"', () => {
    render(
      <ContextMenu>
        <ContextMenuTrigger data-testid="trigger">Right-click area</ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem>Copy</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>,
    )
    expect(screen.getByTestId('trigger')).toHaveAttribute(
      'data-slot',
      'context-menu-trigger',
    )
  })

  it('ContextMenuShortcut renders standalone with data-slot', () => {
    render(<ContextMenuShortcut data-testid="shortcut">⌘V</ContextMenuShortcut>)
    expect(screen.getByTestId('shortcut')).toHaveAttribute(
      'data-slot',
      'context-menu-shortcut',
    )
  })

  it('ContextMenuLabel renders with data-slot', () => {
    render(<ContextMenuLabel data-testid="label">Actions</ContextMenuLabel>)
    expect(screen.getByTestId('label')).toHaveAttribute('data-slot', 'context-menu-label')
  })

  it('ContextMenuSeparator renders with data-slot', () => {
    render(<ContextMenuSeparator data-testid="sep" />)
    expect(screen.getByTestId('sep')).toHaveAttribute('data-slot', 'context-menu-separator')
  })

  it('opens on right-click and reveals its items', () => {
    render(
      <ContextMenu>
        <ContextMenuTrigger data-testid="trigger">Right-click area</ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem>Copy</ContextMenuItem>
          <ContextMenuItem>Paste</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>,
    )
    // closed by default — items are not rendered
    expect(screen.queryByText('Copy')).not.toBeInTheDocument()
    // a contextmenu (right-click) on the trigger opens the menu
    fireEvent.contextMenu(screen.getByTestId('trigger'))
    expect(screen.getByText('Copy')).toBeInTheDocument()
    expect(screen.getByText('Paste')).toBeInTheDocument()
    const content = document.querySelector('[data-slot="context-menu-content"]')
    expect(content).toHaveClass('rounded-md', 'border-border', 'bg-popover', 'shadow-[var(--elevation-overlay)]')
    expect(content?.className).not.toMatch(/glass|backdrop-blur/)
    expect(screen.getByText('Copy')).toHaveClass('min-h-9', 'focus:bg-hover')
  })

  it('structural Portal/Sub/Radio components are valid functions', () => {
    // These require open context or nesting — assert export shape only
    expect(typeof ContextMenu).toBe('function')
    expect(typeof ContextMenuTrigger).toBe('function')
    expect(typeof ContextMenuContent).toBe('function')
    expect(typeof ContextMenuItem).toBe('function')
    expect(typeof ContextMenuCheckboxItem).toBe('function')
    expect(typeof ContextMenuRadioItem).toBe('function')
    expect(typeof ContextMenuGroup).toBe('function')
    expect(typeof ContextMenuPortal).toBe('function')
    expect(typeof ContextMenuSub).toBe('function')
    expect(typeof ContextMenuSubContent).toBe('function')
    expect(typeof ContextMenuSubTrigger).toBe('function')
    expect(typeof ContextMenuRadioGroup).toBe('function')
  })
})
