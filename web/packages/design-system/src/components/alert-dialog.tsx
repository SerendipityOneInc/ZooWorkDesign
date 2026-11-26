'use client'

/*!
 * Portions adapted from shadcn/ui (MIT). Copyright (c) 2023 shadcn.
 * Modified for ZooWork. See THIRD_PARTY_NOTICES.md and third-party/SOURCE_ATTRIBUTION.md.
 */

import { XMarkIcon } from '@heroicons/react/24/outline'
import { AlertDialog as AlertDialogPrimitive } from 'radix-ui'
import * as React from 'react'

import { cn } from '../lib/cn'
import { Button } from './button'
import {
  modalCloseButtonClassName,
  modalContentClassName,
  modalDescriptionClassName,
  modalFooterClassName,
  modalHeaderClassName,
  modalOverlayClassName,
  modalTitleClassName,
} from './modal-styles'

function AlertDialog({ ...props }: React.ComponentProps<typeof AlertDialogPrimitive.Root>) {
  return <AlertDialogPrimitive.Root data-slot="alert-dialog" {...props} />
}

function AlertDialogTrigger({
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Trigger>) {
  return <AlertDialogPrimitive.Trigger data-slot="alert-dialog-trigger" {...props} />
}

function AlertDialogPortal({
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Portal>) {
  return <AlertDialogPrimitive.Portal data-slot="alert-dialog-portal" {...props} />
}

function AlertDialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Overlay>) {
  return (
    <AlertDialogPrimitive.Overlay
      data-slot="alert-dialog-overlay"
      className={cn(modalOverlayClassName, className)}
      {...props}
    />
  )
}

function AlertDialogContent({
  className,
  children,
  onOpenAutoFocus,
  overlayClassName,
  size = 'default',
  showCloseButton = true,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Content> & {
  overlayClassName?: string
  size?: 'default' | 'sm'
  showCloseButton?: boolean
}) {
  return (
    <AlertDialogPortal>
      <AlertDialogOverlay className={overlayClassName} />
      <AlertDialogPrimitive.Content
        data-slot="alert-dialog-content"
        data-size={size}
        className={cn(
          modalContentClassName,
          'group/alert-dialog-content data-[size=default]:sm:max-w-[26rem] data-[size=sm]:sm:max-w-sm',
          className,
        )}
        onOpenAutoFocus={(event) => {
          onOpenAutoFocus?.(event)
          if (event.defaultPrevented) return

          const cancelButton = (event.currentTarget as HTMLElement).querySelector<HTMLElement>(
            '[data-slot="alert-dialog-cancel"]',
          )
          if (cancelButton) {
            event.preventDefault()
            cancelButton.focus()
          }
        }}
        {...props}
      >
        {children}
        {showCloseButton && (
          <AlertDialogPrimitive.Cancel
            data-slot="alert-dialog-close"
            className={modalCloseButtonClassName}
          >
            <XMarkIcon strokeWidth={2} />
            <span className="sr-only">Close</span>
          </AlertDialogPrimitive.Cancel>
        )}
      </AlertDialogPrimitive.Content>
    </AlertDialogPortal>
  )
}

function AlertDialogHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="alert-dialog-header"
      className={cn(
        modalHeaderClassName,
        'pr-8',
        'has-data-[slot=alert-dialog-media]:grid has-data-[slot=alert-dialog-media]:grid-cols-[auto_1fr] has-data-[slot=alert-dialog-media]:gap-x-4',
        className,
      )}
      {...props}
    />
  )
}

function AlertDialogFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="alert-dialog-footer"
      className={cn(modalFooterClassName, className)}
      {...props}
    />
  )
}

function AlertDialogMedia({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="alert-dialog-media"
      className={cn(
        'mb-2 inline-flex size-10 items-center justify-center rounded-md bg-muted',
        'sm:group-data-[size=default]/alert-dialog-content:row-span-2',
        "*:[svg:not([class*='size-'])]:size-6",
        className,
      )}
      {...props}
    />
  )
}

function AlertDialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Title>) {
  return (
    <AlertDialogPrimitive.Title
      data-slot="alert-dialog-title"
      className={cn(
        modalTitleClassName,
        'group-has-data-[slot=alert-dialog-media]/alert-dialog-content:col-start-2',
        className,
      )}
      {...props}
    />
  )
}

function AlertDialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Description>) {
  return (
    <AlertDialogPrimitive.Description
      data-slot="alert-dialog-description"
      className={cn(modalDescriptionClassName, className)}
      {...props}
    />
  )
}

function AlertDialogAction({
  className,
  variant = 'default',
  size = 'default',
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Action> &
  Pick<React.ComponentProps<typeof Button>, 'variant' | 'size'>) {
  return (
    <Button variant={variant} size={size} asChild>
      <AlertDialogPrimitive.Action
        data-slot="alert-dialog-action"
        className={cn(className)}
        {...props}
      />
    </Button>
  )
}

function AlertDialogCancel({
  className,
  variant = 'outline',
  size = 'default',
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Cancel> &
  Pick<React.ComponentProps<typeof Button>, 'variant' | 'size'>) {
  return (
    <Button variant={variant} size={size} asChild>
      <AlertDialogPrimitive.Cancel
        data-slot="alert-dialog-cancel"
        className={cn(className)}
        {...props}
      />
    </Button>
  )
}

export {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger,
}
