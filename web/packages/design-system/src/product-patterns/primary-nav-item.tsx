'use client'
import type * as React from 'react'
import { motion } from 'motion/react'
import { PrimaryNavItemIcon } from './primary-nav-item-icon'
import { TooltipArrowRightIcon } from './navigation-icons'
export interface PrimaryNavItemData {
  key: string
  label: string
  icon: React.ReactNode
  href: string
  disabled?: boolean
  badge?: string
  external?: boolean
}
export interface PrimaryNavItemProps {
  item: PrimaryNavItemData
  isActive: boolean
  isCollapsed: boolean
  isMobile?: boolean
  onMobileMenuClose?: () => void
  onClick?: () => void
  onNavigate?: () => void
  LinkComponent?: React.ElementType
  comingSoonLabel?: string
}
export function PrimaryNavItem({
  LinkComponent = 'a',
  comingSoonLabel = 'Coming soon',
  item,
  isActive,
  isCollapsed,
  isMobile = false,
  onMobileMenuClose,
  onClick,
  onNavigate,
}: PrimaryNavItemProps) {
  if (item.disabled) {
    return (
      <div className="group/nav relative">
        <span
          aria-disabled="true"
          className={`group text-muted-foreground/50 flex cursor-not-allowed items-center gap-2.5 rounded-[13px] px-[11px] py-[9px] text-[13.5px] font-medium ${isCollapsed && !isMobile ? 'justify-center' : ''}`}
        >
          <span className="flex-shrink-0">{item.icon}</span>
          {(!isCollapsed || isMobile) && (
            <span className={'overflow-hidden text-sm text-ellipsis whitespace-nowrap'}>
              {item.label} <span className="text-muted-foreground/50 text-xs">{comingSoonLabel}</span>
            </span>
          )}
        </span>
        {isCollapsed && !isMobile && (
          <div className="pointer-events-none absolute top-1/2 left-full z-[1070] ml-[10px] -translate-y-1/2 opacity-0 transition-opacity duration-200 group-hover/nav:opacity-100">
            <div className="absolute top-1/2 right-full -translate-y-1/2">
              <TooltipArrowRightIcon />
            </div>
            <div className="bg-ecap-tooltip-bg rounded-md px-2 py-1.5 text-xs whitespace-nowrap text-white shadow-[0_2px_8px_rgba(0,0,0,0.15)]">
              {item.label} ({comingSoonLabel})
            </div>
          </div>
        )}
      </div>
    )
  }

  const sharedClass = `group relative flex h-10 items-center gap-2.5 rounded-[13px] px-3 py-2.5 text-sm font-medium transition-all focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none ${
    isActive
      ? 'bg-sidebar-accent text-sidebar-accent-foreground'
      : 'text-muted-foreground hover:bg-sidebar-hover hover:text-foreground'
  } ${isCollapsed && !isMobile ? 'justify-center' : ''}`

  const content = (
    <>
      <PrimaryNavItemIcon navKey={item.key}>{item.icon}</PrimaryNavItemIcon>
      {(!isCollapsed || isMobile) && (
        <span className={'overflow-hidden text-sm text-ellipsis whitespace-nowrap'}>
          {item.label}
          {item.badge && (
            <span className="bg-destructive ml-1.5 inline-block rounded-full px-1.5 py-0.5 align-middle text-[10px] leading-none font-semibold text-white">
              New
            </span>
          )}
        </span>
      )}
    </>
  )

  return (
    <motion.div className="group/nav relative" initial="rest" animate="rest" whileHover="hover">
      {onClick ? (
        <button
          type="button"
          aria-label={item.label}
          data-testid={`nav-item-${item.key}`}
          data-active={isActive || undefined}
          className={`w-full ${sharedClass}`}
          onClick={() => {
            onClick()
            if (isMobile) onMobileMenuClose?.()
          }}
        >
          {content}
        </button>
      ) : item.external ? (
        <a
          href={item.href}
          target="_blank"
          aria-label={item.label}
          rel="noopener noreferrer"
          data-testid={`nav-item-${item.key}`}
          data-active={isActive || undefined}
          className={sharedClass}
          onClick={() => {
            if (isMobile) onMobileMenuClose?.()
          }}
        >
          {content}
        </a>
      ) : (
        <LinkComponent
          href={item.href}
          aria-label={item.label}
          aria-current={isActive ? 'page' : undefined}
          data-testid={`nav-item-${item.key}`}
          data-active={isActive || undefined}
          className={sharedClass}
          onClick={() => {
            onNavigate?.()
            if (isMobile) onMobileMenuClose?.()
          }}
        >
          {content}
        </LinkComponent>
      )}

      {isCollapsed && !isMobile && (
        <div className="pointer-events-none absolute top-1/2 left-full z-[1070] ml-[10px] -translate-y-1/2 opacity-0 transition-opacity duration-200 group-hover/nav:opacity-100">
          <div className="absolute top-1/2 right-full -translate-y-1/2">
            <TooltipArrowRightIcon />
          </div>
          <div className="bg-ecap-tooltip-bg rounded-md px-2 py-1.5 text-xs whitespace-nowrap text-white shadow-[0_2px_8px_rgba(0,0,0,0.15)]">
            {item.label}
          </div>
        </div>
      )}
    </motion.div>
  )
}
