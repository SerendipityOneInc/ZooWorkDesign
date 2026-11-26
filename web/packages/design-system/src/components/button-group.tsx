/*!
 * Portions adapted from shadcn/ui (MIT). Copyright (c) 2023 shadcn.
 * Modified for ZooWork. See THIRD_PARTY_NOTICES.md and third-party/SOURCE_ATTRIBUTION.md.
 */
// No 'use client' — presentational, RSC-compatible.

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { Slot } from 'radix-ui'

import { cn } from '../lib/cn'
import { Separator } from './separator'

const buttonGroupVariants = cva(
  'group/button-group flex w-fit items-stretch *:focus-visible:relative *:focus-visible:z-10 has-[>[data-slot=button-group]]:gap-2 has-[select[aria-hidden=true]:last-child]:[&>[data-slot=select-trigger]:last-of-type]:rounded-r-md [&>[data-slot=select-trigger]:not([class*=\'w-\'])]:w-fit [&>input]:flex-1',
  {
    variants: {
      orientation: {
        horizontal: 'flex-row',
        vertical: 'flex-col',
      },
      variant: {
        segmented:
          'gap-1 rounded-lg bg-surface-subtle p-1 [&>[data-slot=button]]:border-transparent [&>[data-slot=button]]:bg-transparent [&>[data-slot=button]]:text-muted-foreground [&>[data-slot=button]]:shadow-none [&>[data-slot=button]]:hover:bg-hover [&>[data-slot=button]]:hover:text-foreground [&>[data-slot=button][aria-pressed=true]]:border-border [&>[data-slot=button][aria-pressed=true]]:bg-surface [&>[data-slot=button][aria-pressed=true]]:text-foreground [&>[data-slot=button][aria-pressed=true]]:shadow-[var(--elevation-card)]',
        attached: '',
      },
    },
    compoundVariants: [
      {
        orientation: 'horizontal',
        variant: 'attached',
        className:
          '[&>*:not(:first-child)]:rounded-l-none [&>*:not(:first-child)]:border-l-0 [&>*:not(:last-child)]:rounded-r-none [&>[data-slot]:not(:has(~[data-slot]))]:rounded-r-lg!',
      },
      {
        orientation: 'vertical',
        variant: 'attached',
        className:
          '[&>*:not(:first-child)]:rounded-t-none [&>*:not(:first-child)]:border-t-0 [&>*:not(:last-child)]:rounded-b-none [&>[data-slot]:not(:has(~[data-slot]))]:rounded-b-lg!',
      },
    ],
    defaultVariants: {
      orientation: 'horizontal',
      variant: 'segmented',
    },
  },
)

function ButtonGroup({
  className,
  orientation,
  variant,
  ...props
}: React.ComponentProps<'div'> & VariantProps<typeof buttonGroupVariants>) {
  const resolvedVariant = variant ?? 'segmented'

  return (
    <div
      role="group"
      data-slot="button-group"
      data-orientation={orientation}
      data-variant={resolvedVariant}
      className={cn(buttonGroupVariants({ orientation, variant: resolvedVariant }), className)}
      {...props}
    />
  )
}

function ButtonGroupText({
  className,
  asChild = false,
  ...props
}: React.ComponentProps<'div'> & {
  asChild?: boolean
}) {
  const Comp = asChild ? Slot.Root : 'div'

  return (
    <Comp
      className={cn(
        "flex items-center gap-2 rounded-md border border-[var(--button-outline-border)] bg-control-background px-2.5 text-sm font-medium text-muted-foreground [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    />
  )
}

function ButtonGroupSeparator({
  className,
  orientation = 'vertical',
  ...props
}: React.ComponentProps<typeof Separator>) {
  return (
    <Separator
      data-slot="button-group-separator"
      orientation={orientation}
      className={cn(
        'relative self-stretch bg-input data-horizontal:mx-px data-horizontal:w-auto data-vertical:my-px data-vertical:h-auto',
        className,
      )}
      {...props}
    />
  )
}

export { ButtonGroup, ButtonGroupSeparator, ButtonGroupText, buttonGroupVariants }
