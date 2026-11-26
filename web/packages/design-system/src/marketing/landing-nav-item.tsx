'use client'

import { Badge } from '../components/badge'
import { PromotionBadge } from './promotion-badge'
import type { LandingNavLink } from './types'
import { cn } from '../lib/cn'
const NAV_LINK_CLASS = 'cursor-pointer text-sm leading-[21.7px] font-normal whitespace-nowrap text-landing-fg'

export function LandingNavItem({
  link,
  onClick,
  className,
  children,
  ariaExpanded,
  ariaHaspopup,
}: {
  link: LandingNavLink
  onClick?: () => void
  className?: string
  children?: React.ReactNode
  ariaExpanded?: boolean
  ariaHaspopup?: 'menu'
}) {
  const content = children ?? (
    <span className="relative inline-flex items-center gap-1.5">
      <span>{link.label}</span>
      {link.badge ? (
        link.comingSoon ? (
          <Badge variant="secondary" className="h-[18px] rounded-full px-1.5 text-[10px] leading-none font-semibold">
            {link.badge}
          </Badge>
        ) : (
          <PromotionBadge className="absolute -top-2.5 -right-7">{link.badge}</PromotionBadge>
        )
      ) : null}
    </span>
  )
  const navClassName = cn(NAV_LINK_CLASS, className)
  if (link.comingSoon) {
    return (
      <span role="link" aria-disabled="true" className={cn(navClassName, 'cursor-default opacity-60')}>
        {content}
      </span>
    )
  }
  if (link.dropdownTrigger || link.onClick) {
    return (
      <button
        type="button"
        className={navClassName}
        onClick={onClick}
        aria-expanded={ariaExpanded}
        aria-haspopup={ariaHaspopup}
      >
        {content}
      </button>
    )
  }
  if (link.external) {
    return (
      <a
        className={navClassName}
        href={link.href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClick}
        aria-expanded={ariaExpanded}
        aria-haspopup={ariaHaspopup}
      >
        {content}
      </a>
    )
  }
  return (
    <a
      className={navClassName}
      href={link.href}
      target={link.newTab ? '_blank' : undefined}
      rel={link.newTab ? 'noopener noreferrer' : undefined}
      onClick={onClick}
      aria-expanded={ariaExpanded}
      aria-haspopup={ariaHaspopup}
    >
      {content}
    </a>
  )
}
