'use client'
import { SidebarToggleButton } from './sidebar-toggle-button'
import { useEffect, useRef, useState } from 'react'
import { TooltipArrowDownIcon, TooltipArrowRightIcon } from './navigation-icons'
export function PrimaryNavLogo({
  isCollapsed,
  isMobile,
  onToggle,
  brandName = 'ZooWork',
  lightLogoSrc,
  darkLogoSrc,
  collapsedLogoSrc,
  isElectron = false,
  LinkComponent = 'a',
  labels = { toggle: 'Toggle navigation', collapse: 'Collapse', expand: 'Expand navigation' },
}: {
  isCollapsed: boolean
  isMobile: boolean
  onToggle?: () => void
  brandName?: string
  lightLogoSrc: string
  darkLogoSrc?: string
  collapsedLogoSrc: string
  isElectron?: boolean
  LinkComponent?: React.ElementType
  labels?: { toggle: string; collapse: string; expand: string }
}) {
  const collapseButtonRef = useRef<HTMLButtonElement>(null)
  const expandButtonRef = useRef<HTMLButtonElement>(null)
  const focusTargetRef = useRef<'collapse' | 'expand' | null>(null)
  const [isExpandButtonFocused, setIsExpandButtonFocused] = useState(false)
  const showExpandedLogo = !onToggle || !isCollapsed || isMobile
  const showCollapsedLogo = Boolean(onToggle) && isCollapsed && !isMobile

  useEffect(() => {
    if (focusTargetRef.current === 'expand' && showCollapsedLogo) {
      expandButtonRef.current?.focus()
      focusTargetRef.current = null
    } else if (focusTargetRef.current === 'collapse' && showExpandedLogo) {
      collapseButtonRef.current?.focus()
      focusTargetRef.current = null
    }
  }, [showCollapsedLogo, showExpandedLogo])

  return (
    <div className="electron-drag-region md:glass:-ml-px md:glass:w-[calc(100%+2px)] relative h-14">
      <div
        aria-hidden={!showExpandedLogo}
        inert={!showExpandedLogo}
        data-testid="sidebar-logo-expanded"
        className={`absolute inset-y-0 right-5 left-5 flex items-center transition-opacity duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none ${
          showExpandedLogo ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        <LinkComponent
          href="/home"
          tabIndex={showExpandedLogo ? undefined : -1}
          className="flex min-w-0 flex-1 cursor-pointer items-center overflow-hidden transition-opacity hover:opacity-80"
        >
          {isElectron ? (
            <img
              src={lightLogoSrc}
              alt={brandName}
              height={32}
              className="h-8 w-auto max-w-none shrink-0 dark:brightness-0 dark:invert"
            />
          ) : (
            <>
              <img
                src={lightLogoSrc}
                alt={brandName}
                height={32}
                className="h-8 w-auto max-w-none shrink-0 dark:hidden"
                data-testid="sidebar-logo-light"
              />
              <img
                src={darkLogoSrc ?? lightLogoSrc}
                alt={brandName}
                height={32}
                className={`hidden h-8 w-auto max-w-none shrink-0 dark:block ${!darkLogoSrc ? 'dark:brightness-0 dark:invert' : ''}`}
                data-testid="sidebar-logo-dark"
              />
            </>
          )}
        </LinkComponent>
        {!isMobile && onToggle && (
          <div className="group/collapse relative mt-0.5 flex-shrink-0">
            <SidebarToggleButton
              expanded
              ref={collapseButtonRef}
              onClick={(event) => {
                event.currentTarget.blur()
                focusTargetRef.current = event.detail === 0 ? 'expand' : null
                onToggle()
              }}
              tabIndex={showExpandedLogo ? undefined : -1}
              aria-label={labels.toggle}
              data-testid="sidebar-collapse-button"
            />
            <div className="pointer-events-none absolute top-full left-1/2 z-[1070] mt-[6px] -translate-x-1/2 opacity-0 transition-opacity duration-200 group-hover/collapse:opacity-100">
              <div className="absolute bottom-full left-1/2 -translate-x-1/2">
                <TooltipArrowDownIcon />
              </div>
              <div className="bg-ecap-tooltip-bg rounded-md px-2 py-1.5 text-xs whitespace-nowrap text-white shadow-[0_2px_8px_rgba(0,0,0,0.15)]">
                {labels.collapse}
              </div>
            </div>
          </div>
        )}
      </div>

      {onToggle && <div
        aria-hidden={!showCollapsedLogo}
        inert={!showCollapsedLogo}
        data-testid="sidebar-logo-collapsed"
        className={`absolute inset-y-0 left-5 flex w-6 items-center transition-opacity duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none ${
          showCollapsedLogo ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        <div className="group/expand relative flex h-6 w-6 items-center justify-center">
          <LinkComponent href="/home" tabIndex={showCollapsedLogo ? undefined : -1} className="cursor-pointer">
            <img
              src={collapsedLogoSrc}
              alt={brandName}
              className="h-6 w-6 object-contain transition-all duration-300 ease-out group-hover/expand:scale-75 group-hover/expand:opacity-0 dark:brightness-0 dark:invert"
            />
          </LinkComponent>
          <SidebarToggleButton
            expanded={false}
            ref={expandButtonRef}
            onFocus={() => setIsExpandButtonFocused(true)}
            onBlur={() => setIsExpandButtonFocused(false)}
            onClick={(event) => {
              event.preventDefault()
              event.currentTarget.blur()
              focusTargetRef.current = event.detail === 0 ? 'collapse' : null
              onToggle()
            }}
            tabIndex={showCollapsedLogo ? undefined : -1}
            className={`absolute inset-0 flex cursor-pointer items-center justify-center transition-opacity duration-300 ease-out group-hover/expand:opacity-100 ${
              isExpandButtonFocused
                ? 'bg-sidebar-background ring-foreground/40 opacity-100 ring-2 outline-none'
                : 'opacity-0'
            }`}
            aria-label={labels.expand}
            data-testid="sidebar-expand-button"
          />
          <div className="pointer-events-none absolute top-1/2 left-full z-[1070] ml-[6px] -translate-y-1/2 opacity-0 transition-opacity duration-200 group-hover/expand:opacity-100">
            <div className="absolute top-1/2 right-full -translate-y-1/2">
              <TooltipArrowRightIcon />
            </div>
            <div className="bg-ecap-tooltip-bg rounded-md px-2 py-1.5 text-xs whitespace-nowrap text-white shadow-[0_2px_8px_rgba(0,0,0,0.15)]">
              {labels.expand}
            </div>
          </div>
        </div>
      </div>}
    </div>
  )
}
