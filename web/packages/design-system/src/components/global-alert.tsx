'use client'

import { useId, type ComponentProps, type ReactNode } from 'react'
import { Portal } from 'radix-ui'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { Alert, AlertDescription, AlertTitle, type AlertStatus } from './alert'
import { Button } from './button'
import { cn } from '../lib/cn'

export type GlobalAlertPlacement = 'top' | 'bottom' | 'top-right' | 'bottom-right'
export type GlobalAlertProps = Omit<ComponentProps<'div'>, 'title'> & {
  open: boolean
  title: ReactNode
  description?: ReactNode
  status?: AlertStatus
  actions?: ReactNode
  placement?: GlobalAlertPlacement
  /** Distance from the top/bottom safe area; set it to clear a fixed header. */
  offset?: number
  /** A positioned container for an embedded preview; omit for the viewport. */
  container?: HTMLElement | null
} & ({ onClose: () => void; closeLabel: string } | { onClose?: undefined; closeLabel?: never })

/** Persistent feedback. The caller owns dismissal, business state and localization. */
export function GlobalAlert({ open, title, description, status = 'info', actions, placement = 'top',
  offset = 16, container, onClose, closeLabel, className, style, ...props }: GlobalAlertProps) {
  const id = useId()
  if (!open) return null
  const bottom = placement.startsWith('bottom')
  return <Portal.Root container={container ?? undefined} asChild>
    <div {...props} data-slot="global-alert" data-placement={placement}
      className={cn('zc-global-alert', className)}
      style={{ ...style, position: container ? 'absolute' : 'fixed',
        maxHeight: `calc(100% - ${Math.max(0, offset) + 16}px - env(safe-area-inset-top, 0px) - env(safe-area-inset-bottom, 0px))`,
        [bottom ? 'bottom' : 'top']: `calc(${Math.max(0, offset)}px + env(safe-area-inset-${bottom ? 'bottom' : 'top'}, 0px))` }}>
      <Alert status={status} aria-labelledby={id} aria-describedby={description ? id + '-description' : undefined}
        aria-atomic="true" className="zc-global-alert-body flex items-center gap-3 py-3 shadow-overlay">
        <div className="zc-global-alert-content">
          <div className="min-w-0 flex-1">
            <AlertTitle id={id}>{title}</AlertTitle>
            {description && <AlertDescription id={id + '-description'} className="mt-1">{description}</AlertDescription>}
          </div>
          {actions && <div data-slot="global-alert-actions">{actions}</div>}
        </div>
        {onClose && <Button type="button" variant="ghost" size="icon-sm" aria-label={closeLabel} onClick={onClose} className="zc-global-alert-close -mr-1 shrink-0">
          <XMarkIcon aria-hidden="true" />
        </Button>}
      </Alert>
    </div>
  </Portal.Root>
}
