'use client'

// @deprecated Superseded by sonner — `import { Toaster, toast } from '@zooclaw/zooworkdesign'`.
// Kept for reference; no longer part of the public API.

import { XMarkIcon } from '@heroicons/react/24/outline'
import { Toast as ToastPrimitive } from 'radix-ui'
import * as React from 'react'

import { cn } from '../lib/cn'

// ── Types ──────────────────────────────────────────────────────────────────────

export interface ToastItem {
  id: string
  title: string
  description?: string
  variant?: 'default' | 'destructive'
  duration?: number
}

export interface ToastOptions {
  title: string
  description?: string
  variant?: 'default' | 'destructive'
  duration?: number
}

// ── Module-level event emitter (no React context needed) ──────────────────────

type Listener = (toasts: ToastItem[]) => void

let _toasts: ToastItem[] = []
const _listeners = new Set<Listener>()

function _emit() {
  for (const fn of _listeners) fn([..._toasts])
}

export function toast(options: ToastOptions): string {
  const id = Math.random().toString(36).slice(2)
  _toasts = [..._toasts, { id, ...options }]
  _emit()
  return id
}

export function dismiss(id: string) {
  _toasts = _toasts.filter((t) => t.id !== id)
  _emit()
}

export function clearToasts() {
  _toasts = []
  _emit()
}

// ── useToast hook ─────────────────────────────────────────────────────────────

export function useToast() {
  const [toasts, setToasts] = React.useState<ToastItem[]>([..._toasts])
  React.useEffect(() => {
    _listeners.add(setToasts)
    setToasts([..._toasts])
    return () => {
      _listeners.delete(setToasts)
    }
  }, [])
  return { toast, dismiss, toasts }
}

// ── Radix primitive wrappers ──────────────────────────────────────────────────

export function ToastProvider({ children, ...props }: React.ComponentProps<typeof ToastPrimitive.Provider>) {
  return (
    <ToastPrimitive.Provider swipeDirection="right" {...props}>
      {children}
    </ToastPrimitive.Provider>
  )
}

export function ToastViewport({ className, ...props }: React.ComponentProps<typeof ToastPrimitive.Viewport>) {
  return (
    <ToastPrimitive.Viewport
      data-slot="toast-viewport"
      className={cn(
        'pointer-events-none fixed bottom-0 right-0 z-50 flex max-h-screen w-full flex-col-reverse gap-2 p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:max-w-[420px]',
        className,
      )}
      {...props}
    />
  )
}

export function Toast({
  className,
  variant = 'default',
  ...props
}: React.ComponentProps<typeof ToastPrimitive.Root> & { variant?: 'default' | 'destructive' }) {
  return (
    <ToastPrimitive.Root
      data-slot="toast"
      className={cn(
        'group pointer-events-auto relative flex w-full items-center justify-between gap-4 overflow-hidden rounded-md border border-border p-4 shadow-[var(--elevation-raised)] transition-[transform,opacity] motion-emphasis',
        'data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none',
        variant === 'default' && 'bg-popover text-foreground',
        variant === 'destructive' && 'bg-destructive text-destructive-foreground border-destructive',
        className,
      )}
      {...props}
    />
  )
}

export function ToastTitle({ className, ...props }: React.ComponentProps<typeof ToastPrimitive.Title>) {
  return (
    <ToastPrimitive.Title
      data-slot="toast-title"
      className={cn('text-sm font-semibold', className)}
      {...props}
    />
  )
}

export function ToastDescription({ className, ...props }: React.ComponentProps<typeof ToastPrimitive.Description>) {
  return (
    <ToastPrimitive.Description
      data-slot="toast-description"
      className={cn('text-sm opacity-80', className)}
      {...props}
    />
  )
}

export function ToastClose({ className, ...props }: React.ComponentProps<typeof ToastPrimitive.Close>) {
  return (
    <ToastPrimitive.Close
      data-slot="toast-close"
      className={cn(
        'absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity',
        'hover:text-foreground focus:opacity-100 focus:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/35',
        'group-hover:opacity-100',
        className,
      )}
      {...props}
    >
      <XMarkIcon className="size-4" />
    </ToastPrimitive.Close>
  )
}

// ── Toaster: drop-in consumer component ───────────────────────────────────────

export function Toaster() {
  const { toasts, dismiss: dismissToast } = useToast()
  return (
    <ToastProvider>
      {toasts.map((t) => (
        <Toast
          key={t.id}
          variant={t.variant}
          duration={t.duration}
          onOpenChange={(open) => {
            if (!open) dismissToast(t.id)
          }}
        >
          <div className="flex flex-col gap-1">
            <ToastTitle>{t.title}</ToastTitle>
            {t.description ? <ToastDescription>{t.description}</ToastDescription> : null}
          </div>
          <ToastClose />
        </Toast>
      ))}
      <ToastViewport />
    </ToastProvider>
  )
}
