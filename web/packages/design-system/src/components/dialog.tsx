'use client'

/*!
 * Portions adapted from shadcn/ui (MIT). Copyright (c) 2023 shadcn.
 * Modified for ZooWork. See THIRD_PARTY_NOTICES.md and third-party/SOURCE_ATTRIBUTION.md.
 */

import { XMarkIcon } from '@heroicons/react/24/outline'
import { Dialog as DialogPrimitive } from 'radix-ui'
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

function Dialog({ ...props }: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />
}

function DialogTrigger({ ...props }: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />
}

function DialogPortal({ ...props }: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />
}

function DialogClose({ ...props }: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />
}

function DialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={cn(modalOverlayClassName, className)}
      {...props}
    />
  )
}

function DialogContent({
  className,
  children,
  overlayClassName,
  scrollable = false,
  showCloseButton = true,
  closeLabel = 'Close',
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
  overlayClassName?: string
  /** Keep the header and footer visible; place long content in DialogBody. */
  scrollable?: boolean
  showCloseButton?: boolean
  closeLabel?: string
}) {
  return (
    <DialogPortal>
      <DialogOverlay className={overlayClassName} />
      <DialogPrimitive.Content
        data-slot="dialog-content"
        data-scrollable={scrollable || undefined}
        className={cn(
          modalContentClassName,
          'sm:max-w-[26rem]',
          'group/dialog',
          scrollable && 'flex max-h-[calc(100dvh-2rem)] flex-col gap-0 overflow-hidden p-0',
          className,
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close
            data-slot="dialog-close"
            className={modalCloseButtonClassName}
          >
            <XMarkIcon strokeWidth={2} />
            <span className="sr-only">{closeLabel}</span>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPortal>
  )
}

function DialogHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="dialog-header"
      className={cn(
        modalHeaderClassName,
        'pr-8',
        'group-data-[scrollable=true]/dialog:shrink-0 group-data-[scrollable=true]/dialog:border-b group-data-[scrollable=true]/dialog:border-border group-data-[scrollable=true]/dialog:p-5 group-data-[scrollable=true]/dialog:pr-12',
        className,
      )}
      {...props}
    />
  )
}

function DialogBody({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="dialog-body"
      className={cn('min-h-0 min-w-0 flex-1 overflow-y-auto overscroll-y-contain p-5 [overflow-wrap:anywhere]', className)}
      {...props}
    />
  )
}

function DialogFooter({
  className,
  showCloseButton = false,
  children,
  ...props
}: React.ComponentProps<'div'> & {
  showCloseButton?: boolean
}) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        modalFooterClassName,
        'group-data-[scrollable=true]/dialog:mt-0 group-data-[scrollable=true]/dialog:shrink-0 group-data-[scrollable=true]/dialog:border-t group-data-[scrollable=true]/dialog:border-border group-data-[scrollable=true]/dialog:px-5 group-data-[scrollable=true]/dialog:py-4',
        className,
      )}
      {...props}
    >
      {children}
      {showCloseButton && (
        <DialogPrimitive.Close asChild>
          <Button type="button" variant="outline" size="sm">
            Close
          </Button>
        </DialogPrimitive.Close>
      )}
    </div>
  )
}

function DialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn(modalTitleClassName, className)}
      {...props}
    />
  )
}

function DialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn(modalDescriptionClassName, className)}
      {...props}
    />
  )
}

export {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
}
