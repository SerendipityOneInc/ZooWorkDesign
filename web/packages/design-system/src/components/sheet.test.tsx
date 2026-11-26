import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import {
  Sheet,
  SheetBody,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './sheet'

describe('Sheet', () => {
  it('renders trigger with data-slot="sheet-trigger"', () => {
    render(
      <Sheet>
        <SheetTrigger data-testid="trigger">Open sidebar</SheetTrigger>
        <SheetContent>
          <SheetTitle>Settings</SheetTitle>
        </SheetContent>
      </Sheet>,
    )
    expect(screen.getByTestId('trigger')).toHaveAttribute('data-slot', 'sheet-trigger')
  })

  it('opens and shows title when trigger is clicked', () => {
    render(
      <Sheet>
        <SheetTrigger data-testid="trigger">Open</SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Notification settings</SheetTitle>
            <SheetDescription>Manage your notification preferences</SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>,
    )
    fireEvent.click(screen.getByTestId('trigger'))
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('Notification settings')).toBeInTheDocument()
  })

  it('SheetContent uses a solid elevated surface with a restrained overlay', () => {
    render(
      <Sheet open>
        <SheetContent showCloseButton={false}>
          <SheetHeader>
            <SheetTitle>Side panel</SheetTitle>
            <SheetDescription>Panel description</SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>,
    )
    const content = document.querySelector('[data-slot="sheet-content"]')
    const overlay = document.querySelector('[data-slot="sheet-overlay"]')
    const description = document.querySelector('[data-slot="sheet-description"]')

    expect(content).toBeInTheDocument()
    expect(content).toHaveClass('bg-popover', 'border-border', 'shadow-dialog', 'gap-0')
    expect(content).not.toHaveClass('bg-glass-panel', 'backdrop-blur-glass')
    expect(overlay).toHaveClass('bg-black/20')
    expect(overlay).not.toHaveClass('backdrop-blur-xs')
    expect(description).toHaveClass('text-foreground/65')
  })

  it('close button renders sr-only text', () => {
    render(
      <Sheet open>
        <SheetContent>
          <SheetTitle>Panel</SheetTitle>
        </SheetContent>
      </Sheet>,
    )
    expect(screen.getByText('Close')).toBeInTheDocument()
  })

  it('SheetBody provides a scrollable content region', () => {
    render(<SheetBody>Configuration fields</SheetBody>)
    const body = screen.getByText('Configuration fields')

    expect(body).toHaveAttribute('data-slot', 'sheet-body')
    expect(body).toHaveClass('min-h-0', 'flex-1', 'overflow-y-auto', 'px-5', 'py-5')
  })

  it('SheetClose, SheetBody, and SheetFooter are exported functions', () => {
    expect(typeof SheetClose).toBe('function')
    expect(typeof SheetBody).toBe('function')
    expect(typeof SheetFooter).toBe('function')
  })
})
