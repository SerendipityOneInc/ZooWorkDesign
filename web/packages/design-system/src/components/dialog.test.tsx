import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from './dialog'

describe('Dialog', () => {
  it('submits an associated body form from a footer outside the scrolling region', () => {
    const onSubmit = vi.fn((event: React.FormEvent) => event.preventDefault())
    render(
      <Dialog open>
        <DialogContent scrollable>
          <DialogHeader><DialogTitle>Long form</DialogTitle><DialogDescription>Configure a resource.</DialogDescription></DialogHeader>
          <DialogBody aria-label="Form content">
            <form id="dialog-body-form" onSubmit={onSubmit}><input aria-label="Name" defaultValue="Example" /></form>
          </DialogBody>
          <DialogFooter><button type="submit" form="dialog-body-form">Save</button></DialogFooter>
        </DialogContent>
      </Dialog>,
    )
    const body = screen.getByLabelText('Form content')
    const save = screen.getByRole('button', { name: 'Save' })
    expect(body).toContainElement(screen.getByRole('textbox', { name: 'Name' }))
    expect(body).not.toContainElement(save)
    fireEvent.click(save)
    expect(onSubmit).toHaveBeenCalledOnce()
    expect(screen.getByRole('dialog')).toHaveAttribute('data-scrollable', 'true')
  })

  it('renders trigger with data-slot="dialog-trigger"', () => {
    render(
      <Dialog>
        <DialogTrigger data-testid="trigger">Open</DialogTrigger>
        <DialogContent>
          <DialogTitle>Title</DialogTitle>
          <DialogDescription>Description</DialogDescription>
        </DialogContent>
      </Dialog>,
    )
    expect(screen.getByTestId('trigger')).toHaveAttribute('data-slot', 'dialog-trigger')
  })

  it('opens dialog and shows title when trigger is clicked', () => {
    render(
      <Dialog>
        <DialogTrigger data-testid="trigger">Open</DialogTrigger>
        <DialogContent>
          <DialogTitle>Confirm delete</DialogTitle>
          <DialogDescription>This cannot be undone.</DialogDescription>
        </DialogContent>
      </Dialog>,
    )
    fireEvent.click(screen.getByTestId('trigger'))
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('Confirm delete')).toBeInTheDocument()
    expect(screen.getByText('This cannot be undone.')).toBeInTheDocument()
  })

  it('DialogFooter renders with data-slot="dialog-footer"', () => {
    render(
      <Dialog open>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Test</DialogTitle>
          </DialogHeader>
          <DialogFooter>
            <button>Cancel</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>,
    )
    const footer = document.querySelector('[data-slot="dialog-footer"]')
    expect(footer).toBeInTheDocument()
    expect(footer).not.toHaveClass('-mx-4', '-mb-4', 'border-t', 'bg-muted/50')
    expect(footer).toHaveClass('pt-1')
  })

  it('uses a solid modal surface with a restrained overlay', () => {
    render(
      <Dialog open>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Surface test</DialogTitle>
            <DialogDescription>Dialog content stays readable.</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>,
    )

    const content = document.querySelector('[data-slot="dialog-content"]')
    const overlay = document.querySelector('[data-slot="dialog-overlay"]')
    const description = document.querySelector('[data-slot="dialog-description"]')

    expect(content).toHaveClass('bg-popover', 'border-border', 'shadow-dialog')
    expect(content).not.toHaveClass('bg-glass-panel', 'backdrop-blur-glass')
    expect(overlay).toHaveClass('bg-black/25')
    expect(overlay).not.toHaveClass('backdrop-blur-xs')
    expect(description).toHaveClass('text-foreground/65')
    expect(description).not.toHaveClass('text-muted-foreground')
  })

  it('forwards a content-owned class to its overlay', () => {
    render(
      <Dialog open>
        <DialogContent overlayClassName="handoff-overlay">
          <DialogTitle>Handoff test</DialogTitle>
          <DialogDescription>Overlay state follows this dialog.</DialogDescription>
        </DialogContent>
      </Dialog>,
    )

    expect(document.querySelector('[data-slot="dialog-overlay"]')).toHaveClass('handoff-overlay')
  })

  it('DialogPortal renders inside an open Dialog', () => {
    // DialogPortal is used internally by DialogContent; confirm the dialog renders
    render(
      <Dialog open>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Portal test</DialogTitle>
            <DialogDescription>Verifying portal rendering.</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>,
    )
    expect(document.querySelector('[data-slot="dialog-content"]')).toBeInTheDocument()
    expect(typeof DialogPortal).toBe('function')
  })
})
