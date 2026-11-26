/*!
 * Portions adapted from shadcn/ui (MIT). Copyright (c) 2023 shadcn.
 * Modified for ZooWork. See THIRD_PARTY_NOTICES.md and third-party/SOURCE_ATTRIBUTION.md.
 */
import { Slot } from 'radix-ui'
import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'

import { cn } from '../lib/cn'
import { Spinner } from './spinner'

const buttonVariants = cva(
  "group/button motion-fast relative inline-flex shrink-0 items-center justify-center rounded-md border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-[color,background-color,border-color,box-shadow,transform,opacity] outline-none select-none motion-reduce:transform-none [&:not(:disabled):not([aria-disabled=true]):active]:scale-[0.98] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/35 disabled:pointer-events-none disabled:opacity-50 data-[loading=true]:opacity-100 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 data-[menu-open=true]:bg-selected data-[menu-open=true]:text-accent-foreground data-[keyboard-focus-shape=rounded-rectangle]:focus-visible:bg-hover data-[keyboard-focus-shape=rounded-rectangle]:focus-visible:text-accent-foreground data-[keyboard-focus-shape=rounded-rectangle]:focus-visible:ring-0 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary-hover active:bg-primary-active',
        // @deprecated Use `default`. Kept as an API-compatible visual alias.
        primary: 'bg-primary text-primary-foreground hover:bg-primary-hover active:bg-primary-active',
        outline:
          'border-[var(--button-outline-border)] bg-control-background hover:border-[var(--button-outline-border-hover)] hover:bg-hover hover:text-foreground aria-expanded:bg-selected aria-expanded:text-foreground dark:hover:bg-hover',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-hover aria-expanded:bg-selected aria-expanded:text-secondary-foreground',
        ghost: 'hover:bg-hover hover:text-foreground aria-expanded:bg-selected aria-expanded:text-foreground',
        destructive:
          'bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40',
        link: 'text-primary underline-offset-4 hover:underline',
        composerSend:
          'bg-[color:var(--chat-ui-accent,#111827)] text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40',
      },
      size: {
        default: 'h-9 gap-1.5 px-3 has-data-[icon=inline-end]:pr-2.5 has-data-[icon=inline-start]:pl-2.5',
        xs: "h-7 gap-1 rounded-sm px-2 text-xs in-data-[slot=button-group]:rounded-md has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 gap-1 rounded-md px-2.5 text-xs in-data-[slot=button-group]:rounded-md has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&_svg:not([class*='size-'])]:size-3.5",
        lg: 'h-10 gap-1.5 px-3.5 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3',
        icon: 'size-9',
        composerIcon: "size-9 rounded-lg p-2 [&_svg:not([class*='size-'])]:size-5",
        'icon-xs': "size-7 rounded-sm in-data-[slot=button-group]:rounded-md [&_svg:not([class*='size-'])]:size-3",
        'icon-sm': 'size-8 rounded-md in-data-[slot=button-group]:rounded-md',
        'icon-lg': 'size-10',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  },
)

export interface ButtonProps
  extends React.ComponentProps<'button'>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
}

export function Button({
  className,
  variant = 'default',
  size = 'default',
  asChild = false,
  loading = false,
  disabled,
  children,
  onClick,
  ...props
}: ButtonProps) {
  const isUnavailable = disabled || loading

  if (asChild) {
    return (
      <Slot.Root
        data-slot="button"
        data-variant={variant}
        data-size={size}
        data-loading={loading || undefined}
        aria-busy={loading || undefined}
        aria-disabled={isUnavailable || undefined}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
        data-zc-button=""
        onClick={(event) => {
          if (isUnavailable) {
            event.preventDefault()
            return
          }
          onClick?.(event as unknown as React.MouseEvent<HTMLButtonElement>)
        }}
        onAuxClick={(event) => {
          if (isUnavailable) {
            event.preventDefault()
            return
          }
          props.onAuxClick?.(event as unknown as React.MouseEvent<HTMLButtonElement>)
        }}
      >
        {children}
      </Slot.Root>
    )
  }

  return (
    <button
      data-slot="button"
      data-variant={variant}
      data-size={size}
      data-loading={loading || undefined}
      aria-busy={loading || undefined}
      disabled={isUnavailable}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
      data-zc-button=""
      onClick={onClick}
    >
      {loading ? (
        <>
          <span
            data-slot="button-content"
            className="motion-fast inline-flex items-center justify-center gap-[inherit] opacity-0 transition-opacity motion-reduce:transition-none"
          >
            {children}
          </span>
          <Spinner aria-hidden="true" className="absolute inset-auto" />
        </>
      ) : (
        children
      )}
    </button>
  )
}

export { buttonVariants }
