/*!
 * Portions adapted from shadcn/ui (MIT). Copyright (c) 2023 shadcn.
 * Modified for ZooWork. See THIRD_PARTY_NOTICES.md and third-party/SOURCE_ATTRIBUTION.md.
 */
// No 'use client' — Badge is a presentational span, RSC-compatible.
import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { Slot } from 'radix-ui'

import { cn } from '../lib/cn'

const badgeVariants = cva(
  'group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-sm border border-transparent px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-colors focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/35 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3!',
  {
    variants: {
      variant: {
        default: 'bg-foreground text-background [a]:hover:bg-foreground/80',
        secondary: 'bg-secondary text-secondary-foreground [a]:hover:bg-secondary/80',
        destructive: 'bg-destructive/10 text-destructive focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:focus-visible:ring-destructive/40 [a]:hover:bg-destructive/20',
        notification: 'bg-destructive text-destructive-foreground [a]:hover:bg-destructive/90',
        success: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300',
        warning: 'bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300',
        danger: 'bg-destructive/10 text-destructive dark:bg-destructive/20',
        info: 'bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300',
        outline: 'border-border text-foreground [a]:hover:bg-hover [a]:hover:text-muted-foreground',
        ghost: 'hover:bg-hover hover:text-muted-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      shape: {
        default: '',
        count: 'min-w-5 rounded-full px-1 font-semibold tabular-nums',
        dot: 'size-2.5 min-w-2.5 rounded-full p-0 text-[0px]',
      },
    },
    defaultVariants: {
      variant: 'default',
      shape: 'default',
    },
  },
)

function Badge({
  className,
  variant = 'default',
  shape = 'default',
  asChild = false,
  ...props
}: React.ComponentProps<'span'> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : 'span'

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      data-shape={shape}
      className={cn(badgeVariants({ variant, shape }), className)}
      {...props}
    />
  )
}

/**
 * @deprecated Back-compat: `main` exported a `BadgeProps` interface from this file.
 * The radix-nova Badge infers its props inline (now also accepts `asChild`), so this
 * is re-derived from the component to keep `import { BadgeProps }` consumers compiling.
 * Prefer `React.ComponentProps<typeof Badge>`.
 */
export type BadgeProps = React.ComponentProps<typeof Badge>

export { Badge, badgeVariants }
