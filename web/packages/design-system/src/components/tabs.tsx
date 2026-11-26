'use client'

/*!
 * Portions adapted from shadcn/ui (MIT). Copyright (c) 2023 shadcn.
 * Modified for ZooWork. See THIRD_PARTY_NOTICES.md and third-party/SOURCE_ATTRIBUTION.md.
 */

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { Tabs as TabsPrimitive } from 'radix-ui'

import { cn } from '../lib/cn'
import { useSelectionIndicator } from './selection-indicator'

function Tabs({ className, orientation = 'horizontal', ...props }: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      data-orientation={orientation}
      orientation={orientation}
      className={cn('group/tabs flex gap-2 data-horizontal:flex-col', className)}
      {...props}
    />
  )
}

const tabsListVariants = cva(
  'group/tabs-list zc-selection-group',
  {
    variants: {
      variant: {
        default: 'bg-surface-subtle',
        line: 'bg-transparent',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

function TabsList({
  className,
  variant = 'default',
  size = 'md',
  block = false,
  shape = 'default',
  children,
  ref,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List> & VariantProps<typeof tabsListVariants> & {
  size?: 'sm' | 'md' | 'lg'
  block?: boolean
  shape?: 'default' | 'round'
}) {
  const selection = useSelectionIndicator('[role="tab"][data-state="active"]', variant ?? 'default', 5)
  const attachRef = React.useCallback(
    (node: HTMLDivElement | null) => {
      selection.ref.current = node
      if (typeof ref === 'function') return ref(node)
      if (ref) ref.current = node
    },
    [ref, selection.ref],
  )
  return (
    <TabsPrimitive.List
      ref={attachRef}
      data-moving-indicator={selection.ready || undefined}
      data-slot="tabs-list"
      data-variant={variant}
      data-size={size}
      data-block={block}
      data-shape={shape}
      className={cn(tabsListVariants({ variant }), 'relative isolate', className)}
      {...props}
    >
      {selection.indicator}
      {children}
    </TabsPrimitive.List>
  )
}

function TabsTrigger({ className, children, asChild, ...props }: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      asChild={asChild}
      className={cn(
        'zc-selection-item outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        'group-data-[variant=line]/tabs-list:rounded-none group-data-[variant=line]/tabs-list:bg-transparent group-data-[variant=line]/tabs-list:hover:bg-transparent group-data-[variant=line]/tabs-list:data-active:border-transparent! group-data-[variant=line]/tabs-list:data-active:bg-transparent! dark:group-data-[variant=line]/tabs-list:data-active:border-transparent! dark:group-data-[variant=line]/tabs-list:data-active:bg-transparent!',
        'data-active:bg-surface data-active:text-foreground dark:data-active:text-foreground',
        'after:bg-primary after:absolute after:opacity-0 after:transition-opacity group-data-horizontal/tabs:after:inset-x-0 group-data-horizontal/tabs:after:bottom-[-5px] group-data-horizontal/tabs:after:h-0.5 group-data-vertical/tabs:after:inset-y-0 group-data-vertical/tabs:after:-right-1 group-data-vertical/tabs:after:w-0.5 group-data-[variant=line]/tabs-list:data-active:after:opacity-100',
        className,
      )}
      {...props}
    >
      {asChild ? children : <span data-slot="selection-label" className="inline-flex items-center justify-center gap-1.5">{children}</span>}
    </TabsPrimitive.Trigger>
  )
}

function TabsContent({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn('flex-1 text-sm outline-none', className)}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent, tabsListVariants }
