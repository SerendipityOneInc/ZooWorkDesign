'use client'
import { Slot } from 'radix-ui'
import { cn } from '../lib/cn'
export function AccountMenuSurface({ className, floating = false, ...props }: React.ComponentProps<'div'> & { floating?: boolean }) {
  return (
    <div
      data-brand-user-menu
      {...props}
      data-floating={floating || undefined}
      className={cn(
        'animate-in fade-in slide-in-from-bottom-1 border-border dark:bg-popover z-50 rounded-xl border bg-white shadow-lg duration-200',
        floating ? 'max-h-(--radix-popover-content-available-height) w-72 max-w-[calc(100vw-2rem)] overflow-y-auto outline-none' : 'absolute bottom-full left-0 mb-2 w-full',
        className,
      )}
    />
  )
}
export function AccountMenuItem({ className, asChild = false, ...props }: React.ComponentProps<'button'> & { asChild?: boolean }) {
  const Component = asChild ? Slot.Root : 'button'
  return (
    <Component
      type={asChild ? undefined : 'button'}
      {...props}
      className={cn(
        'text-foreground hover:bg-accent focus-visible:bg-accent focus-visible:ring-2 focus-visible:ring-ring outline-none flex w-full cursor-pointer items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors',
        className,
      )}
    />
  )
}
