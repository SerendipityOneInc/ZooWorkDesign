'use client'

import { ChevronDoubleLeftIcon, ChevronDoubleRightIcon } from '@heroicons/react/24/outline'
import type { ComponentProps } from 'react'
import { cn } from '../lib/cn'
import { SidebarPanelIcon } from './navigation-icons'

/** Primary navigation control. The parent owns collapse state and focus routing. */
export function SidebarToggleButton({
  expanded,
  className,
  ...props
}: ComponentProps<'button'> & { expanded: boolean; 'aria-label': string }) {
  const Chevron = expanded ? ChevronDoubleLeftIcon : ChevronDoubleRightIcon
  return (
    <button
      type="button"
      data-sidebar-toggle
      aria-expanded={expanded}
      className={cn(
        expanded
          ? 'hover:bg-background cursor-pointer rounded-md p-1.5 transition-all duration-200'
          : 'flex size-6 cursor-pointer items-center justify-center transition-opacity duration-300 ease-out',
        className,
      )}
      {...props}
    >
      <Chevron
        className={cn(
          'side-nav-chevron-icon size-4',
          expanded
            ? 'text-muted-foreground group-hover/collapse:text-foreground transition-colors duration-200'
            : 'text-foreground',
        )}
      />
      <SidebarPanelIcon
        className={cn(
          'paper-focus-sidebar-panel-icon hidden size-[19px]',
          expanded
            ? 'text-muted-foreground group-hover/collapse:text-foreground transition-colors duration-200'
            : 'text-foreground',
        )}
      />
    </button>
  )
}
