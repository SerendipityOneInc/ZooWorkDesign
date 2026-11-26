'use client'

import type { ComponentProps } from 'react'
import { cn } from '../lib/cn'

export function PrimaryNavFooter({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      {...props}
      data-slot="primary-nav-footer"
      className={cn(
        'in-data-[brand-theme=paper-focus]:border-sidebar-border relative px-4 pt-3 pb-3 in-data-[brand-theme=paper-focus]:border-t in-data-[brand-theme=paper-focus]:py-1.5',
        className,
      )}
    />
  )
}
