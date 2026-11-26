'use client'

import { EllipsisHorizontalIcon, EllipsisVerticalIcon } from '@heroicons/react/24/outline'
import type { ComponentProps } from 'react'
import { Button } from '../components/button'
import { cn } from '../lib/cn'

type IconButtonProps = Omit<ComponentProps<typeof Button>, 'size' | 'variant' | 'asChild'> & { 'aria-label': string }
const editAvatarIcon = new URL('../../assets/icons/edit-avatar.svg', import.meta.url).href

export function AvatarEditButton({ className, children, ...props }: IconButtonProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      className={cn('relative size-9 shrink-0 rounded-full p-0', className)}
      {...props}
    >
      {children}
      <span
        aria-hidden="true"
        className="border-border absolute top-[25px] left-[7px] flex size-[22px] items-center justify-center rounded-full border bg-[var(--agent-settings-control,var(--card))]"
      >
        <img src={editAvatarIcon} alt="" width={12} height={12} />
      </span>
    </Button>
  )
}

export function SettingsPanelToggleButton({ open, className, ...props }: IconButtonProps & { open: boolean }) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-expanded={open}
      className={cn(
        'bg-muted text-muted-foreground hover:bg-accent hover:text-foreground hover:border-border relative size-8 shrink-0 rounded-md border border-transparent transition-[background-color,border-color,box-shadow,transform] duration-150 hover:shadow-sm active:scale-95 motion-reduce:transform-none motion-reduce:transition-none',
        className,
      )}
      {...props}
    >
      <span aria-hidden="true" className="relative block size-4 rounded-[3px] border-[1.5px] border-current">
        <span
          data-open={open}
          className="absolute inset-y-0 right-[3px] w-[1.5px] rounded-full bg-current transition-transform duration-200 ease-out data-[open=true]:translate-x-px data-[open=true]:scale-y-[0.65] motion-reduce:transition-none"
        />
      </span>
    </Button>
  )
}

export function MoreIconButton({
  orientation = 'horizontal',
  className,
  ...props
}: IconButtonProps & { orientation?: 'horizontal' | 'vertical' }) {
  const horizontal = orientation === 'horizontal'
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className={cn(
        horizontal ? 'text-muted-foreground hover:text-foreground size-7 shrink-0' : 'size-7 rounded-md',
        className,
      )}
      {...props}
    >
      {horizontal ? (
        <EllipsisHorizontalIcon aria-hidden="true" className="size-4" />
      ) : (
        <EllipsisVerticalIcon aria-hidden="true" className="size-3.5" />
      )}
    </Button>
  )
}
