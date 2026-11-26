/*!
 * Portions adapted from shadcn/ui (MIT). Copyright (c) 2023 shadcn.
 * Modified for ZooWork. See THIRD_PARTY_NOTICES.md and third-party/SOURCE_ATTRIBUTION.md.
 */
// No 'use client' — Alert is presentational, RSC-compatible.
import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '../lib/cn'
import { CheckCircleIcon, ExclamationCircleIcon, ExclamationTriangleIcon, InformationCircleIcon } from '@heroicons/react/24/outline'

export type AlertStatus = 'default' | 'info' | 'success' | 'warning' | 'danger'
const statusIcons = { default: InformationCircleIcon, info: InformationCircleIcon,
  success: CheckCircleIcon, warning: ExclamationTriangleIcon, danger: ExclamationCircleIcon }

const alertVariants = cva(
  'group/alert relative grid w-full gap-1 rounded-md border border-border p-4 text-left text-sm has-data-[slot=alert-action]:relative has-data-[slot=alert-action]:pr-18 has-[>svg]:grid-cols-[auto_1fr] has-[>svg]:gap-x-3 *:[svg]:row-span-2 *:[svg]:translate-y-0.5 *:[svg]:text-current *:[svg:not([class*="size-"])]:size-4',
  {
    variants: {
      variant: {
        default: 'bg-card text-card-foreground',
        destructive:
          'border-destructive/30 bg-card text-destructive shadow-none *:data-[slot=alert-description]:text-destructive/80 *:[svg]:text-current',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

function Alert({
  className,
  variant,
  status,
  icon,
  children,
  ...props
}: React.ComponentProps<'div'> &
  VariantProps<typeof alertVariants> & {
    /** Semantic status. Omitting it preserves the original neutral/variant API. */
    status?: AlertStatus
    /** @deprecated pass the icon as the leading SVG child instead. */
    icon?: React.ComponentType<{ className?: string }> | null | false
  }) {
  // Back-compat: the old Alert accepted an `icon` prop. Render it as the leading
  // svg child (the layout keys off has-[>svg]); new usage passes an svg child.
  const LegacyIcon = icon || null
  const StatusIcon = status && icon === undefined ? statusIcons[status] : null
  return (
    <div data-slot="alert" data-status={status} role={status && status !== 'danger' ? 'status' : 'alert'}
      className={cn(alertVariants({ variant }), status && 'zc-semantic-alert', className)} {...props}>
      {StatusIcon && <StatusIcon aria-hidden="true" />}
      {LegacyIcon ? <LegacyIcon /> : null}
      {children}
    </div>
  )
}

function AlertTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="alert-title"
      className={cn(
        'font-medium group-has-[>svg]/alert:col-start-2 [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground',
        className,
      )}
      {...props}
    />
  )
}

function AlertDescription({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        'text-sm text-balance text-muted-foreground group-has-[>svg]/alert:col-start-2 md:text-pretty [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground [&_p:not(:last-child)]:mb-4',
        className,
      )}
      {...props}
    />
  )
}

function AlertAction({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="alert-action"
      className={cn('absolute top-2 right-2', className)}
      {...props}
    />
  )
}

export { Alert, AlertTitle, AlertDescription, AlertAction }
