'use client'

import { useEffect, useRef, useState, useSyncExternalStore, type ComponentProps, type ReactNode } from 'react'
import { Bars3Icon } from '@heroicons/react/24/outline'
import { Button } from './button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './sheet'
import { cn } from '../lib/cn'

const mobileQuery = '(max-width: 767px)'
const subscribe = (onChange: () => void) => {
  const media = window.matchMedia(mobileQuery)
  media.addEventListener('change', onChange)
  return () => media.removeEventListener('change', onChange)
}
const getSnapshot = () => window.matchMedia(mobileQuery).matches
const getServerSnapshot = () => false

export type WorkspaceLayoutProps = ComponentProps<'div'> & {
  navigation: ReactNode
  navigationFooter?: ReactNode
  header?: ReactNode
  navigationKind?: 'primary' | 'secondary'
  collapsed?: boolean
  /** Overrides the viewport breakpoint, useful in embedded canvases. */
  compact?: boolean
  navigationLabel: string
  openNavigationLabel: string
  closeNavigationLabel: string
  /** A positioned container keeps the mobile Sheet inside an embedded canvas. */
  overlayContainer?: HTMLElement | null
}

/** Primary and secondary navigation replace one another in the same slot. */
export function WorkspaceLayout({ navigation, navigationFooter, header, children,
  navigationKind = 'primary', collapsed = false, compact, navigationLabel, openNavigationLabel,
  closeNavigationLabel, overlayContainer, className, ...props }: WorkspaceLayoutProps) {
  const mobile = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  const isCompact = compact ?? mobile
  const [menuOpen, setMenuOpen] = useState(false)
  const wasCompact = useRef(isCompact)
  useEffect(() => {
    if (wasCompact.current && !isCompact) setMenuOpen(false)
    wasCompact.current = isCompact
  }, [isCompact])
  const contents = <>
    <div data-slot="workspace-navigation-content">{navigation}</div>
    {navigationFooter && <div data-slot="workspace-navigation-footer">{navigationFooter}</div>}
  </>
  return <div {...props} data-slot="workspace-layout" data-compact={isCompact}
    data-navigation={collapsed ? 'collapsed' : navigationKind} className={cn('zc-workspace-layout', className)}>
    {!isCompact && <nav aria-label={navigationLabel} data-slot="workspace-layout-navigation">{contents}</nav>}
    <div data-slot="workspace-layout-column">
      {(header || isCompact) && <div data-slot="workspace-layout-header">
        {isCompact && <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
          <SheetTrigger asChild><Button variant="ghost" size="icon-sm" aria-label={openNavigationLabel}><Bars3Icon /></Button></SheetTrigger>
          <SheetContent side="left" container={overlayContainer} closeLabel={closeNavigationLabel}
            aria-describedby={undefined}
            className={cn('bg-sidebar-background data-[side=left]:w-[min(260px,calc(100%-32px))]', overlayContainer && 'absolute')}
            overlayClassName={overlayContainer ? 'absolute' : undefined}>
            <SheetHeader><SheetTitle>{navigationLabel}</SheetTitle></SheetHeader>
            <nav aria-label={navigationLabel} className="flex min-h-0 flex-1 flex-col"
              onClick={event => {
                if ((event.target as HTMLElement).closest('a[href]')) setMenuOpen(false)
              }}>{contents}</nav>
          </SheetContent>
        </Sheet>}
        <div className="min-w-0 flex-1">{header}</div>
      </div>}
      <div data-slot="workspace-layout-content">{children}</div>
    </div>
  </div>
}
