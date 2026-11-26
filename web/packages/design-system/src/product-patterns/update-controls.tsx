'use client'

import { ArrowPathIcon, ArrowUpIcon } from '@heroicons/react/24/outline'
import type { ComponentProps } from 'react'
import { Badge } from '../components/badge'
import { Button } from '../components/button'
import { cn } from '../lib/cn'

/** Inline 16px indicator from AgentDefinitionUpdateBadge. Caller owns visibility. */
export function UpdateAvailableBadge({
  label,
  className,
  ...props
}: Omit<ComponentProps<typeof Badge>, 'children'> & { label: string }) {
  return (
    <Badge
      role="img"
      aria-label={label}
      className={cn('bg-brand-ink size-4 rounded-full p-0 text-white', className)}
      {...props}
    >
      <ArrowUpIcon
        data-update-arrow
        className="motion-safe:group-hover/agent:animate-nudge-up size-3 motion-safe:group-hover/agent:[animation-iteration-count:infinite]"
        strokeWidth={3}
        aria-hidden="true"
      />
    </Badge>
  )
}

/** Purple is an explicit update-action exception, not a generic primary variant. */
export function UpdateActionButton({
  updating,
  disabled,
  label,
  loadingLabel,
  size = 'sm',
  className,
  ...props
}: Omit<ComponentProps<typeof Button>, 'children' | 'size' | 'variant' | 'loading' | 'asChild'> & {
  updating: boolean
  label: string
  loadingLabel: string
  size?: 'xs' | 'sm'
}) {
  return (
    <Button
      type="button"
      size={size}
      disabled={disabled || updating}
      aria-label={updating ? loadingLabel : label}
      aria-busy={updating || undefined}
      data-agent-update-action
      className={cn(
        'bg-brand-ink hover:bg-brand-ink/90 active:bg-brand-ink/80 focus-visible:ring-brand-ink/40 relative text-white hover:text-white',
        size === 'sm' && 'gap-1.5 px-3',
        className,
      )}
      {...props}
    >
      <span aria-hidden="true" className={cn('inline-flex items-center gap-1.5', updating && 'invisible')}>
        <ArrowPathIcon className="h-4 w-4" />
        <span>{label}</span>
      </span>
      {updating && (
        <span aria-hidden="true" className="absolute inset-0 flex items-center justify-center">
          <svg
            className="h-4 w-4 animate-spin motion-reduce:animate-none"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path d="M21 12a9 9 0 1 1-6.219-8.56" strokeLinecap="round" />
          </svg>
        </span>
      )}
    </Button>
  )
}
