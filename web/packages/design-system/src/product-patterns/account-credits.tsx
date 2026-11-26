'use client'

import { ChevronRightIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/outline'
import { Button } from '../components/button'

export function AccountCreditsSection({ children }: { children: React.ReactNode }) {
  return <div className="bg-muted mx-3 mb-2 space-y-3 rounded-lg p-3" data-theme-user-plan>{children}</div>
}

/** Presentation only: callers own balance units, authorization and billing actions. */
export function AccountCreditsRow({
  label, balance, icon, onNavigate, onAbout, aboutLabel = 'About credits',
  balanceLabel, navigationLabel, href, LinkComponent = 'a', disabled = false, navigationRef,
}: {
  label: string
  balance: string
  icon?: React.ReactNode
  balanceLabel?: string
  navigationLabel?: string
  onNavigate?: () => void
  onAbout?: () => void
  aboutLabel?: string
  href?: string
  LinkComponent?: React.ElementType
  disabled?: boolean
  navigationRef?: React.Ref<HTMLAnchorElement>
}) {
  const content = <>
    <span className="flex items-center gap-1.5"><span className="text-xs font-medium">{label}</span>{icon}</span>
    <span className="flex min-w-0 items-center gap-1"><span aria-label={balanceLabel} className="truncate text-xs font-semibold tabular-nums">{balance}</span>{!disabled && <ChevronRightIcon aria-hidden="true" className="text-muted-foreground size-3.5" />}</span>
  </>
  return (
    <div className="flex items-center gap-1" data-slot="account-credits-row">
      {disabled ? <div data-testid="user-menu-credits" className="flex min-w-0 flex-1 items-center justify-between gap-3">{content}</div> :
        <Button type={href ? undefined : 'button'} data-testid="user-menu-credits" asChild={Boolean(href)} aria-label={navigationLabel} variant="ghost" className="h-auto min-w-0 flex-1 justify-between gap-3 p-0" onClick={onNavigate}>
          {href ? <LinkComponent href={href} ref={navigationRef}>{content}</LinkComponent> : content}
        </Button>}
      {onAbout && <Button type="button" aria-label={aboutLabel} variant="ghost" size="icon-xs" onClick={onAbout}><QuestionMarkCircleIcon className="size-3.5" /></Button>}
    </div>
  )
}
