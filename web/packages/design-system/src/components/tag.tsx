// No 'use client' — Tag is a presentational span, RSC-compatible.
import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { Slot } from 'radix-ui'

import { cn } from '../lib/cn'

// Tag is Badge's short rounded-rectangle sibling: compact keyword/status labels
// that can be pure text or icon + text without becoming pill-shaped.
const tagVariants = cva(
  'group/tag inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded border border-transparent py-0.5 whitespace-nowrap transition-colors focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/35 [&>svg]:pointer-events-none [&>svg]:size-3',
  {
    variants: {
      variant: {
        // Neutral — tokenized so it follows light/dark automatically.
        default: 'bg-surface-subtle text-muted-foreground',
        // Outlined neutral — no fill, hairline border.
        outline: 'border-border text-foreground',
        // Status colors. success/warning/info use Tailwind's palette (the brand
        // has no green/amber/blue); danger ties to the brand --destructive token
        // so error tags match Badge's destructive and the brand red.
        success: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300',
        warning: 'bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300',
        danger: 'bg-destructive/10 text-destructive dark:bg-destructive/20',
        info: 'bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300',
        attachment:
          'max-w-full gap-2 rounded-md border-[color:var(--chat-ui-border,#d4d4d4)] bg-[color:var(--chat-ui-muted,#f5f5f5)] px-2.5 py-1.5 text-xs text-[color:var(--foreground)]',
      },
      size: {
        default: 'px-2.5 text-[11px] font-normal',
        sm: 'px-2 text-[10px] font-medium',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

function Tag({
  className,
  variant = 'default',
  size = 'default',
  asChild = false,
  ...props
}: React.ComponentProps<'span'> &
  VariantProps<typeof tagVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : 'span'

  return (
    <Comp
      data-slot="tag"
      data-variant={variant}
      data-size={size}
      className={cn(tagVariants({ variant, size }), className)}
      {...props}
    />
  )
}

function TagText({ className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span
      data-slot="tag-text"
      className={cn('min-w-0 truncate font-medium', className)}
      {...props}
    />
  )
}

function TagMeta({ className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span
      data-slot="tag-meta"
      className={cn('shrink-0 text-[color:var(--chat-ui-muted-foreground,#737373)]', className)}
      {...props}
    />
  )
}

function TagAction({ className, ...props }: React.ComponentProps<'button'>) {
  return (
    <button
      type="button"
      data-slot="tag-action"
      className={cn(
        'shrink-0 rounded p-0.5 text-[color:var(--foreground)] hover:bg-[color:var(--chat-ui-border,#d4d4d4)]',
        className,
      )}
      {...props}
    />
  )
}

export type TagProps = React.ComponentProps<typeof Tag>

export { Tag, TagAction, TagMeta, TagText, tagVariants }
