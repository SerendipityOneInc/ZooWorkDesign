'use client'

import { Popover } from 'radix-ui'
import { useId, useRef } from 'react'
import { AccountMenuSurface } from './account-menu-surface'
import { PrimaryNavUserCard } from './primary-nav-user-card'

export function PrimaryNavAccountMenu({
  open, onOpenChange, children, label = 'Account menu',
  profileLabel = 'Open account menu', menuLabel = 'Open account actions', onCloseAutoFocus, ...card
}: Omit<React.ComponentProps<typeof PrimaryNavUserCard>, 'isMenuOpen' | 'onMenuToggle' | 'menuId'> & {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
  label?: string
  onCloseAutoFocus?: (event: Event, trigger: HTMLButtonElement | null) => void
}) {
  const menuId = useId()
  const trigger = useRef<HTMLButtonElement | null>(null)
  const anchor = useRef<HTMLDivElement>(null)
  const outside = useRef(false)
  return (
    <Popover.Root open={open} onOpenChange={onOpenChange}>
      <Popover.Anchor asChild>
        <div ref={anchor} onClickCapture={(event) => {
          if (event.target instanceof Element) trigger.current = event.target.closest('button')
        }}>
          <PrimaryNavUserCard {...card} profileLabel={profileLabel} menuLabel={menuLabel} menuId={menuId}
            isMenuOpen={open} onMenuToggle={() => { outside.current = false; onOpenChange(!open) }} />
        </div>
      </Popover.Anchor>
      <Popover.Portal>
        <Popover.Content asChild id={menuId} aria-label={label} side="top" align="start" sideOffset={8} collisionPadding={16}
          onInteractOutside={(event) => {
            if (event.target instanceof Node && anchor.current?.contains(event.target)) event.preventDefault()
            else outside.current = true
          }}
          onCloseAutoFocus={(event) => {
            onCloseAutoFocus?.(event, trigger.current)
            if (event.defaultPrevented) return
            event.preventDefault()
            if (!outside.current) trigger.current?.focus()
          }}>
          <AccountMenuSurface floating>{children}</AccountMenuSurface>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}
