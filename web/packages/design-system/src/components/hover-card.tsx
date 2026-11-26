'use client'

/*!
 * Portions adapted from shadcn/ui (MIT). Copyright (c) 2023 shadcn.
 * Modified for ZooWork. See THIRD_PARTY_NOTICES.md and third-party/SOURCE_ATTRIBUTION.md.
 */

import { HoverCard as HoverCardPrimitive } from 'radix-ui'
import * as React from 'react'

import { cn } from '../lib/cn'
import { overlayPanelStyles } from './overlay-styles'

function HoverCard({ ...props }: React.ComponentProps<typeof HoverCardPrimitive.Root>) {
  return <HoverCardPrimitive.Root data-slot="hover-card" {...props} />
}

function HoverCardTrigger({ ...props }: React.ComponentProps<typeof HoverCardPrimitive.Trigger>) {
  return <HoverCardPrimitive.Trigger data-slot="hover-card-trigger" {...props} />
}

function HoverCardContent({
  className,
  align = 'center',
  sideOffset = 4,
  surface = 'glass',
  ...props
}: React.ComponentProps<typeof HoverCardPrimitive.Content> & {
  surface?: 'glass' | 'composer'
}) {
  return (
    <HoverCardPrimitive.Portal data-slot="hover-card-portal">
      <HoverCardPrimitive.Content
        data-slot="hover-card-content"
        data-surface={surface}
        align={align}
        sideOffset={sideOffset}
        className={cn(
          'z-50 origin-(--radix-hover-card-content-transform-origin) text-sm text-popover-foreground outline-hidden motion-fast',
          overlayPanelStyles,
          surface === 'glass'
            ? 'w-64 p-3'
            : 'w-[213px] rounded-md p-0',
          'data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
          'data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95',
          className,
        )}
        {...props}
      />
    </HoverCardPrimitive.Portal>
  )
}

export { HoverCard, HoverCardContent, HoverCardTrigger }
