'use client'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../components/dropdown-menu'
import { ChevronDownIcon, ArrowUpRightIcon } from '@heroicons/react/16/solid'
import { type ReactElement, useEffect, useRef, useState } from 'react'
export function MarketingActionMenu({
  children,
  items,
  isRedirecting = false,
  onPrepare,
  onNavigate,
}: {
  children: ReactElement
  items: { label: string; href: string }[]
  isRedirecting?: boolean
  onPrepare?: () => void
  onNavigate?: () => void
}) {
  const [loginMenuOpen, setLoginMenuOpen] = useState(false)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const openedByHover = useRef(false)

  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    closeTimer.current = null
  }

  useEffect(
    () => () => {
      if (closeTimer.current) clearTimeout(closeTimer.current)
    },
    [],
  )

  const openOnHover = () => {
    if (isRedirecting) return
    cancelClose()
    onPrepare?.()
    if (!loginMenuOpen) openedByHover.current = true
    setLoginMenuOpen(true)
  }

  const closeAfterHover = () => {
    cancelClose()
    closeTimer.current = setTimeout(() => setLoginMenuOpen(false), 150)
  }

  return (
    <DropdownMenu
      modal={false}
      open={loginMenuOpen}
      onOpenChange={(open) => {
        if (open) onPrepare?.()
        cancelClose()
        setLoginMenuOpen(open)
      }}
    >
      <DropdownMenuTrigger
        asChild
        onPointerDown={(event) => {
          if (openedByHover.current && loginMenuOpen && event.pointerType === 'mouse') event.preventDefault()
        }}
        onMouseEnter={openOnHover}
        onMouseLeave={closeAfterHover}
        onKeyDown={() => {
          openedByHover.current = false
        }}
      >
        {children}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        data-marketing-surface
        onMouseEnter={cancelClose}
        onMouseLeave={closeAfterHover}
        onKeyDown={() => {
          cancelClose()
          openedByHover.current = false
        }}
        onCloseAutoFocus={(event) => {
          if (openedByHover.current) event.preventDefault()
        }}
        align="center"
        side="bottom"
        sideOffset={12}
        className="border-landing-glass-bg bg-landing-menu-bg text-landing-fg w-56 rounded-[10px] border-[0.5px] border-solid px-2.5 pt-2.5 pb-3 shadow-[var(--landing-shadow-resource-menu)] backdrop-blur-[5px]"
      >
        {items.map((item) => (
          <DropdownMenuItem
            key={item.label}
            disabled={isRedirecting}
            asChild
            className="focus:bg-landing-surface-muted focus:text-landing-fg hover:bg-landing-surface-muted h-10 w-full cursor-pointer justify-between gap-2 rounded-[10px] px-3.5 py-2 text-sm leading-[21.7px] font-normal transition-[background,opacity] duration-150 ease-in-out"
          >
            <a href={item.href} onClick={onNavigate}>
              <span className="whitespace-nowrap">{item.label}</span>
              <ArrowUpRightIcon className="size-3.5 shrink-0" aria-hidden="true" />
            </a>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function MarketingCtaActions({
  salesLabel,
  startLabel,
  salesHref,
  items,
}: {
  salesLabel: string
  startLabel: string
  salesHref: string
  items: { label: string; href: string }[]
}) {
  return (
    <div className="flex items-center gap-5 max-[481px]:gap-2">
      <a
        className="text-landing-fg hover:bg-landing-surface-muted inline-flex h-[37px] min-w-24 cursor-pointer items-center justify-center rounded-[6px] px-4 text-sm leading-5 font-normal whitespace-nowrap transition-colors duration-200"
        href={salesHref}
      >
        {salesLabel}
      </a>
      <MarketingActionMenu items={items}>
        <button
          type="button"
          className="border-landing-border-button bg-landing-fg inline-flex h-[37px] min-w-[99px] cursor-pointer items-center justify-center gap-1.5 rounded-[6px] border border-solid px-2 text-sm leading-5 font-normal whitespace-nowrap text-white transition-opacity duration-200 hover:opacity-[0.88]"
        >
          {startLabel}
          <ChevronDownIcon aria-hidden="true" className="size-3.5" />
        </button>
      </MarketingActionMenu>
    </div>
  )
}
