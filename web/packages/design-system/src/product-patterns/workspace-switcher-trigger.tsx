'use client'

import { ChevronUpDownIcon } from '@heroicons/react/16/solid'
import type { ComponentProps, ReactNode } from 'react'
import { Button } from '../components/button'
import { cn } from '../lib/cn'

export function WorkspaceMonogram({ name }: { name?: string }) {
  return (
    <span aria-hidden="true" data-slot="workspace-monogram" className="flex size-5 shrink-0 items-center justify-center rounded-sm bg-primary text-xs font-semibold leading-none text-primary-foreground">
      {Array.from(name?.trim() ?? '')[0]?.toUpperCase() || '—'}
    </span>
  )
}

export interface WorkspaceSwitcherTriggerProps
  extends Omit<ComponentProps<typeof Button>, 'name' | 'children' | 'variant' | 'className' | 'style'> {
  name: string
  avatar: ReactNode
  /** Narrow agent rails hide the name; full-width mobile drawers keep it visible. */
  hideNameOnMobile?: boolean
  /** Match the icon and label columns of the surrounding navigation. */
  layout?: 'workspace' | 'primary-nav' | 'secondary-nav'
}

export function WorkspaceSwitcherTrigger({
  name,
  avatar,
  hideNameOnMobile = true,
  layout = 'workspace',
  ...props
}: WorkspaceSwitcherTriggerProps) {
  return (
    <Button
      {...props}
      variant="ghost"
      data-theme-sidebar-item
      data-workspace-switcher-layout={layout}
      className={cn(
        'hover:bg-sidebar-hover w-full min-w-0 justify-start rounded-[8px] py-2',
        layout === 'workspace' && 'h-auto gap-2 px-0',
        layout === 'primary-nav' && 'h-10 gap-2.5 border-0 px-3',
        layout === 'secondary-nav' && 'h-9 gap-3 px-3',
      )}
    >
      {avatar}
      <span className={`${hideNameOnMobile ? 'hidden md:block' : 'block'} min-w-0 flex-1 truncate text-left text-sm font-semibold`} title={name}>{name}</span>
      <ChevronUpDownIcon aria-hidden="true" className="text-muted-foreground size-4 shrink-0" />
    </Button>
  )
}
