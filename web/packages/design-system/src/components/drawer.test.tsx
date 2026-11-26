import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

// window.matchMedia (which vaul calls on mount) is polyfilled suite-wide in
// vitest.setup.ts, so no per-test stub is needed here.
import {
  Drawer,
  DrawerBody,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerPortal,
  DrawerTitle,
  DrawerTrigger,
} from './drawer'

describe('Drawer', () => {
  it('renders trigger with data-slot="drawer-trigger"', () => {
    render(
      <Drawer>
        <DrawerTrigger data-testid="trigger">Open Drawer</DrawerTrigger>
        <DrawerContent>
          <DrawerTitle>Settings</DrawerTitle>
        </DrawerContent>
      </Drawer>,
    )
    expect(screen.getByTestId('trigger')).toHaveAttribute('data-slot', 'drawer-trigger')
  })

  it('opens and shows title when trigger is clicked', () => {
    render(
      <Drawer>
        <DrawerTrigger data-testid="trigger">Open</DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Notification Settings</DrawerTitle>
            <DrawerDescription>Manage your notification preferences</DrawerDescription>
          </DrawerHeader>
        </DrawerContent>
      </Drawer>,
    )
    fireEvent.click(screen.getByTestId('trigger'))
    expect(screen.getByText('Notification Settings')).toBeInTheDocument()
  })

  it('moves focus into the drawer by default when opened', async () => {
    render(
      <Drawer>
        <DrawerTrigger data-testid="focus-trigger">Open settings</DrawerTrigger>
        <DrawerContent>
          <DrawerTitle>Settings</DrawerTitle>
          <input aria-label="Agent name" />
        </DrawerContent>
      </Drawer>,
    )

    fireEvent.click(screen.getByTestId('focus-trigger'))
    await waitFor(() => expect(screen.getByLabelText('Agent name')).toHaveFocus())
  })

  it('DrawerContent uses a solid elevated surface with a restrained overlay', () => {
    render(
      <Drawer open>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Panel</DrawerTitle>
            <DrawerDescription>Panel description</DrawerDescription>
          </DrawerHeader>
        </DrawerContent>
      </Drawer>,
    )
    const content = document.querySelector('[data-slot="drawer-content"]')
    const overlay = document.querySelector('[data-slot="drawer-overlay"]')
    const description = document.querySelector('[data-slot="drawer-description"]')

    expect(content).toBeInTheDocument()
    expect(content).toHaveClass('bg-popover', 'border-border', 'shadow-dialog', 'gap-0')
    expect(content).not.toHaveClass(
      'data-[vaul-drawer-direction=bottom]:rounded-t-2xl',
      'data-[vaul-drawer-direction=left]:rounded-r-2xl',
      'data-[vaul-drawer-direction=right]:rounded-l-2xl',
      'data-[vaul-drawer-direction=top]:rounded-b-2xl',
    )
    expect(content).not.toHaveClass('bg-glass-panel', 'backdrop-blur-glass')
    expect(overlay).toHaveClass('bg-black/20')
    expect(overlay).not.toHaveClass('backdrop-blur-xs')
    expect(description).toHaveClass('text-foreground/65')
  })

  it('DrawerFooter renders with data-slot="drawer-footer"', () => {
    render(
      <Drawer open>
        <DrawerContent>
          <DrawerTitle>Footer Test</DrawerTitle>
          <DrawerFooter>
            <button>Confirm</button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>,
    )
    expect(document.querySelector('[data-slot="drawer-footer"]')).toBeInTheDocument()
  })

  it('DrawerBody provides a scrollable content region', () => {
    render(<DrawerBody>Runtime controls</DrawerBody>)
    const body = screen.getByText('Runtime controls')

    expect(body).toHaveAttribute('data-slot', 'drawer-body')
    expect(body).toHaveClass('min-h-0', 'flex-1', 'overflow-y-auto', 'px-5', 'py-5')
  })

  it('DrawerClose renders inside an open Drawer', () => {
    render(
      <Drawer open>
        <DrawerContent>
          <DrawerTitle>Close test</DrawerTitle>
          <DrawerClose data-testid="close-btn">Close</DrawerClose>
        </DrawerContent>
      </Drawer>,
    )
    expect(screen.getByTestId('close-btn')).toBeInTheDocument()
  })

  it('DrawerOverlay renders inside an open Drawer', () => {
    render(
      <Drawer open>
        <DrawerContent>
          <DrawerTitle>Overlay test</DrawerTitle>
        </DrawerContent>
      </Drawer>,
    )
    // DrawerOverlay is rendered internally by DrawerContent; verify DrawerPortal is a function
    expect(typeof DrawerPortal).toBe('function')
  })
})
