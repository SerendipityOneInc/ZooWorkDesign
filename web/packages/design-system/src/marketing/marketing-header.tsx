'use client'

import type { ComponentProps, ReactNode } from 'react'
import { cn } from '../lib/cn'
import { MarketingContent } from './marketing-content'
import { MarketingNavigation } from './marketing-navigation'
import { MarketingMobileNavigation } from './marketing-mobile-navigation'
import type { LandingNavLink } from './types'

/** Source: LandingHeader. Host owns scroll observation, routing and authentication. */
export function MarketingHeader({
  scrolled = false,
  compact,
  navLinks,
  actions,
  mobileActions,
  homeHref = '/',
  menuLabel,
  closeLabel,
  className,
  ...props
}: ComponentProps<'header'> & {
  scrolled?: boolean
  compact?: boolean
  navLinks: LandingNavLink[]
  actions?: ReactNode
  mobileActions?: ReactNode
  homeHref?: string
  menuLabel: string
  closeLabel: string
}) {
  return (
    <header
      {...props}
      data-marketing-surface
      data-scroll-state={scrolled ? 'scrolled' : 'top'}
      className={cn(
        "relative z-10 h-14 w-full border-b border-solid backdrop-blur-[22px] backdrop-saturate-[165%] transition-[background-color,border-color] duration-200 before:pointer-events-none before:absolute before:inset-0 before:transition-opacity before:duration-200 before:content-['']",
        scrolled
          ? 'border-landing-border-header bg-landing-header-glass before:bg-[image:var(--landing-header-glass-sheen)] before:opacity-100'
          : 'bg-landing-hero-bg border-transparent before:opacity-0',
        className,
      )}
    >
      <MarketingContent className="relative z-10 flex h-full items-center justify-between">
        <a href={homeHref} className="inline-flex items-center gap-1.5">
          <img
            className="block h-auto w-36 max-w-none max-[481px]:w-[104px] max-[360px]:w-20"
            src={new URL('../../assets/marketing/zoowork-horizontal-navy.png', import.meta.url).href}
            alt="ZooWork"
          />
        </a>
        {!compact && (
          <div className={compact === false ? undefined : 'max-[1102px]:hidden'}>
            <MarketingNavigation navLinks={navLinks} />
          </div>
        )}
        <div className="flex shrink-0 items-center gap-2">
          {!compact && <div className={compact === false ? undefined : 'max-[1102px]:hidden'}>{actions}</div>}
          {compact !== false && <MarketingMobileNavigation
            compact={compact}
            navLinks={navLinks}
            actions={mobileActions}
            menuLabel={menuLabel}
            closeLabel={closeLabel}
          />}
        </div>
      </MarketingContent>
    </header>
  )
}
