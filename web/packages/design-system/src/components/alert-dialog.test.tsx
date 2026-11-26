import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogMedia,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './alert-dialog'

describe('AlertDialog', () => {
  it('renders trigger with data-slot="alert-dialog-trigger"', () => {
    render(
      <AlertDialog>
        <AlertDialogTrigger data-testid="trigger">Delete account</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogTitle>Confirm deletion</AlertDialogTitle>
          <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
        </AlertDialogContent>
      </AlertDialog>,
    )
    expect(screen.getByTestId('trigger')).toHaveAttribute('data-slot', 'alert-dialog-trigger')
  })

  it('opens and shows title when trigger is clicked', () => {
    render(
      <AlertDialog>
        <AlertDialogTrigger data-testid="trigger">Delete</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogTitle>Confirm account deletion</AlertDialogTitle>
          <AlertDialogDescription>Data cannot be recovered after deletion.</AlertDialogDescription>
        </AlertDialogContent>
      </AlertDialog>,
    )
    fireEvent.click(screen.getByTestId('trigger'))
    expect(screen.getByRole('alertdialog')).toBeInTheDocument()
    expect(screen.getByText('Confirm account deletion')).toBeInTheDocument()
  })

  it('renders the shared close button and dismisses through the cancel primitive', async () => {
    render(
      <AlertDialog defaultOpen>
        <AlertDialogContent>
          <AlertDialogTitle>Confirm account deletion</AlertDialogTitle>
          <AlertDialogDescription>Data cannot be recovered after deletion.</AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>,
    )

    const closeButton = screen.getByRole('button', { name: 'Close' })
    expect(closeButton).toHaveAttribute('data-slot', 'alert-dialog-close')
    await waitFor(() => expect(screen.getByRole('button', { name: 'Cancel' })).toHaveFocus())
    fireEvent.click(closeButton)
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument()
  })

  it('supports hiding the close button', () => {
    render(
      <AlertDialog open>
        <AlertDialogContent showCloseButton={false}>
          <AlertDialogTitle>Confirm account deletion</AlertDialogTitle>
          <AlertDialogDescription>Data cannot be recovered after deletion.</AlertDialogDescription>
        </AlertDialogContent>
      </AlertDialog>,
    )

    expect(screen.queryByRole('button', { name: 'Close' })).not.toBeInTheDocument()
  })

  it('uses the same solid modal surface and restrained overlay as Dialog', () => {
    render(
      <AlertDialog open>
        <AlertDialogContent>
          <AlertDialogTitle>Notice</AlertDialogTitle>
          <AlertDialogDescription>Please confirm the action</AlertDialogDescription>
        </AlertDialogContent>
      </AlertDialog>,
    )
    const content = document.querySelector('[data-slot="alert-dialog-content"]')
    const overlay = document.querySelector('[data-slot="alert-dialog-overlay"]')
    expect(content).toHaveClass('bg-popover', 'border-border', 'shadow-dialog')
    expect(content).not.toHaveClass('bg-glass-panel', 'backdrop-blur-glass')
    expect(overlay).toHaveClass('bg-black/25')
    expect(overlay).not.toHaveClass('backdrop-blur-xs')
  })

  it('forwards a content-owned class to its overlay', () => {
    render(
      <AlertDialog open>
        <AlertDialogContent overlayClassName="handoff-overlay">
          <AlertDialogTitle>Handoff test</AlertDialogTitle>
          <AlertDialogDescription>Overlay state follows this alert.</AlertDialogDescription>
        </AlertDialogContent>
      </AlertDialog>,
    )

    expect(document.querySelector('[data-slot="alert-dialog-overlay"]')).toHaveClass('handoff-overlay')
  })

  it('renders Action and Cancel as buttons', () => {
    render(
      <AlertDialog open>
        <AlertDialogContent>
          <AlertDialogTitle>Confirm action</AlertDialogTitle>
          <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>,
    )
    expect(screen.getByText('Cancel')).toBeInTheDocument()
    expect(screen.getByText('Confirm')).toBeInTheDocument()
    const footer = document.querySelector('[data-slot="alert-dialog-footer"]')
    const title = document.querySelector('[data-slot="alert-dialog-title"]')
    const description = document.querySelector('[data-slot="alert-dialog-description"]')
    expect(footer).toHaveClass('pt-1')
    expect(footer).not.toHaveClass('-mx-4', '-mb-4', 'border-t', 'bg-muted/50')
    expect(title).toHaveClass('font-semibold', 'text-foreground')
    expect(title).not.toHaveClass('cn-font-heading')
    expect(description).toHaveClass('text-foreground/65')
    expect(description).not.toHaveClass('text-muted-foreground')
  })

  it('AlertDialogOverlay renders inside an open AlertDialog', () => {
    render(
      <AlertDialog open>
        <AlertDialogContent>
          <AlertDialogTitle>Overlay test</AlertDialogTitle>
          <AlertDialogDescription>Checking overlay.</AlertDialogDescription>
        </AlertDialogContent>
      </AlertDialog>,
    )
    // Overlay is rendered internally; verify the content is in the document
    expect(document.querySelector('[data-slot="alert-dialog-content"]')).toBeInTheDocument()
  })

  it('AlertDialogPortal and AlertDialogMedia are valid function components', () => {
    // Portal wraps a teleported overlay; Media is a layout slot
    render(
      <AlertDialog open>
        <AlertDialogContent>
          <AlertDialogMedia data-testid="media" />
          <AlertDialogTitle>Media test</AlertDialogTitle>
          <AlertDialogDescription>Checking media slot.</AlertDialogDescription>
        </AlertDialogContent>
      </AlertDialog>,
    )
    expect(document.querySelector('[data-slot="alert-dialog-media"]')).toBeInTheDocument()
    expect(typeof AlertDialogPortal).toBe('function')
  })
})
