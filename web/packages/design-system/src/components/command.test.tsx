import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from './command'

describe('Command', () => {
  it('renders with data-slot="command" and an opaque surface', () => {
    render(
      <Command data-testid="cmd">
        <CommandList>
          <CommandEmpty>No results</CommandEmpty>
        </CommandList>
      </Command>,
    )
    const el = screen.getByTestId('cmd')
    expect(el).toHaveAttribute('data-slot', 'command')
    expect(el).toHaveClass('border-border', 'bg-popover')
    expect(el.className).not.toMatch(/glass|backdrop-blur/)
  })

  it('CommandInput renders with data-slot="command-input"', () => {
    render(
      <Command>
        <CommandInput placeholder="Search..." />
        <CommandList>
          <CommandEmpty>No results</CommandEmpty>
        </CommandList>
      </Command>,
    )
    const input = document.querySelector('[data-slot="command-input"]')
    expect(input).toBeInTheDocument()
  })

  it('CommandList renders with data-slot="command-list"', () => {
    render(
      <Command>
        <CommandList>
          <CommandEmpty>No results</CommandEmpty>
        </CommandList>
      </Command>,
    )
    expect(document.querySelector('[data-slot="command-list"]')).toBeInTheDocument()
  })

  it('CommandGroup renders items and heading', () => {
    render(
      <Command>
        <CommandList>
          <CommandGroup heading="Actions">
            <CommandItem>New File</CommandItem>
            <CommandItem>Open File</CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>,
    )
    expect(screen.getByText('New File')).toBeInTheDocument()
    expect(screen.getByText('Open File')).toBeInTheDocument()
  })

  it('uses the dedicated hover color for the highlighted item', () => {
    render(
      <Command>
        <CommandList>
          <CommandItem>Run workflow</CommandItem>
        </CommandList>
      </Command>,
    )
    expect(screen.getByText('Run workflow')).toHaveClass('data-[selected=true]:bg-hover')
    expect(screen.getByText('Run workflow')).not.toHaveClass('data-selected:bg-muted')
  })

  it('selects an available command and keeps a disabled command inactive', () => {
    const available = vi.fn()
    const unavailable = vi.fn()
    render(<Command><CommandList>
      <CommandItem onSelect={available}>Open attachment</CommandItem>
      <CommandItem disabled onSelect={unavailable}>Unavailable action</CommandItem>
    </CommandList></Command>)
    const enabled = screen.getByRole('option', { name: 'Open attachment' })
    expect(enabled).toHaveAttribute('data-disabled', 'false')
    expect(enabled).toHaveAttribute('aria-disabled', 'false')
    fireEvent.click(enabled)
    expect(available).toHaveBeenCalledOnce()
    const disabled = screen.getByRole('option', { name: 'Unavailable action' })
    expect(disabled).toHaveAttribute('aria-disabled', 'true')
    fireEvent.click(disabled)
    expect(unavailable).not.toHaveBeenCalled()
  })

  it('CommandShortcut renders with data-slot="command-shortcut"', () => {
    render(
      <Command>
        <CommandList>
          <CommandGroup>
            <CommandItem>
              Save
              <CommandShortcut>⌘S</CommandShortcut>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>,
    )
    const shortcut = document.querySelector('[data-slot="command-shortcut"]')
    expect(shortcut).toBeInTheDocument()
    expect(shortcut?.textContent).toBe('⌘S')
  })

  it('CommandSeparator renders with data-slot="command-separator"', () => {
    render(
      <Command>
        <CommandList>
          <CommandGroup>
            <CommandItem>Item A</CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup>
            <CommandItem>Item B</CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>,
    )
    expect(document.querySelector('[data-slot="command-separator"]')).toBeInTheDocument()
  })

  it('CommandDialog hosts the cmdk Command context — input + items render inside the dialog', () => {
    render(
      <CommandDialog open title="Palette" description="Search commands">
        <CommandInput placeholder="Type a command…" />
        <CommandList>
          <CommandItem>Open file</CommandItem>
        </CommandList>
      </CommandDialog>,
    )
    // The input and item only render if children are wrapped in a <Command> root
    // (cmdk subcomponents throw/no-op without that context).
    expect(screen.getByPlaceholderText('Type a command…')).toBeInTheDocument()
    expect(screen.getByText('Open file')).toBeInTheDocument()
  })
})
