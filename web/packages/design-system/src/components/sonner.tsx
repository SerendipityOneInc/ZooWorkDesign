'use client'

/*!
 * Portions adapted from shadcn/ui (MIT). Copyright (c) 2023 shadcn.
 * Modified for ZooWork. See THIRD_PARTY_NOTICES.md and third-party/SOURCE_ATTRIBUTION.md.
 */

import type { CSSProperties } from 'react'
import { Toaster as Sonner, toast, type ToasterProps } from 'sonner'

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="system"
      className="toaster group"
      style={
        {
          '--normal-bg': 'var(--popover)',
          '--normal-text': 'var(--foreground)',
          '--normal-border': 'var(--border)',
          '--border-radius': 'var(--radius)',
        } as CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: 'cn-toast',
          title: 'text-foreground',
          description: 'text-muted-foreground',
          error: 'text-destructive border-destructive/30',
        },
      }}
      {...props}
    />
  )
}

export { Toaster, toast }
