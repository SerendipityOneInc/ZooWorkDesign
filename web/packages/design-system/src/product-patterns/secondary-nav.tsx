'use client'

import { Button } from '../components/button'

export function SecondaryNavItem({ className = '', ...props }: React.ComponentProps<typeof Button>) {
  return (
    <Button
      {...props}
      variant="ghost"
      data-theme-sidebar-item
      className={`text-foreground hover:bg-sidebar-hover aria-[current=page]:bg-background aria-[current=page]:hover:bg-sidebar-hover h-9 w-full justify-start gap-3 px-3 text-left aria-[current=page]:font-semibold ${className}`}
    />
  )
}

export function SecondaryNavBack(props: React.ComponentProps<typeof Button>) {
  return (
    <div className="flex h-14 shrink-0 items-center px-2 md:px-4">
      <SecondaryNavItem {...props} />
    </div>
  )
}

export type SecondaryNavItemProps = React.ComponentProps<typeof Button>
