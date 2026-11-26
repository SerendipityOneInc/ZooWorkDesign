'use client'

import { ArrowUpIcon, PlusIcon } from '@heroicons/react/24/outline'
import { StopIcon } from '@heroicons/react/24/solid'
import type { ComponentProps } from 'react'
import { Button } from '../components/button'
import { cn } from '../lib/cn'

type ActionProps = Omit<ComponentProps<typeof Button>, 'size' | 'variant' | 'asChild'> & { 'aria-label': string }

/** ComposerAddMenu trigger; caller owns menus, uploads and tooltip behavior. */
export function ComposerAttachButton({ className, children, ...props }: ActionProps) {
  return (
    <Button type="button" variant="ghost" size="icon" className={cn('rounded-[8px]', className)} {...props}>
      {children ?? <PlusIcon aria-hidden="true" className="size-5" />}
    </Button>
  )
}

const actionGeometry = 'h-8 w-8 shrink-0 rounded-[8px] p-0 shadow-none focus-visible:ring-2 disabled:opacity-100'
const activeColors = 'bg-primary text-primary-foreground hover:bg-primary'

/** Source geometry and colors from chat-ui/ComposerToolbar. */
export function ComposerSendButton({
  className,
  children,
  disabled,
  appearance = 'default',
  ...props
}: ActionProps & { appearance?: 'default' | 'zoowork' }) {
  const colors =
    appearance === 'zoowork'
      ? disabled
        ? 'bg-[color:var(--ecap-agent-builder-send-disabled,#d4d4d8)] text-white'
        : 'bg-[color:var(--ecap-agent-builder-send-active,#09090b)] text-white hover:opacity-90'
      : disabled
        ? 'bg-[color:var(--brand-composer-send-disabled-background,var(--muted,#f5f5f5))] text-[color:var(--brand-composer-send-disabled-foreground,var(--muted-foreground,#737373))]'
        : activeColors
  return (
    <Button
      type="submit"
      size="icon-sm"
      disabled={disabled}
      className={cn(actionGeometry, 'disabled:cursor-not-allowed', colors, className)}
      data-variant={appearance}
      data-chat-composer-send
      {...props}
    >
      {children ?? <ArrowUpIcon aria-hidden="true" className="size-5" />}
    </Button>
  )
}

export function ComposerStopButton({ className, children, ...props }: ActionProps) {
  return (
    <Button type="button" size="icon-sm" className={cn(actionGeometry, activeColors, className)} {...props}>
      {children ?? <StopIcon aria-hidden="true" className="size-4" />}
    </Button>
  )
}

/** Exact outline from the app's public/icons/new-chat-send.svg, using currentColor. */
export function ProductSendIcon(props: ComponentProps<'svg'>) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" className="size-5" {...props}>
      <path d="M10.8944 2.55279C10.725 2.214 10.3788 2 10 2C9.62124 2 9.27498 2.214 9.10558 2.55279L2.10558 16.5528C1.92823 16.9075 1.97724 17.3335 2.2305 17.6386C2.48376 17.9438 2.89342 18.0705 3.27473 17.9615L8.27472 16.533C8.70402 16.4103 9 16.0179 9 15.5714V11C9 10.4477 9.44772 10 10 10C10.5523 10 11 10.4477 11 11V15.5714C11 16.0179 11.296 16.4103 11.7253 16.533L16.7253 17.9615C17.1066 18.0705 17.5163 17.9438 17.7695 17.6386C18.0228 17.3335 18.0718 16.9075 17.8944 16.5528L10.8944 2.55279Z" />
    </svg>
  )
}
