'use client'

import { LayoutGroup, motion, useReducedMotion } from 'motion/react'
import { useRef, useState } from 'react'
import { cn } from '../lib/cn'
import { useDocumentEvent } from './use-document-event'
import type { LandingNavLink } from './types'
import { LandingNavItem } from './landing-nav-item'
const RESOURCE_ITEM_LINK_CLASS =
  'flex h-full w-full items-center px-5 py-2 transition-colors duration-150 ease-in-out hover:bg-landing-surface-muted focus-visible:bg-landing-surface-muted'

const TOP_NAV_LINK_CLASS =
  "relative -mx-2 inline-flex min-h-9 items-center px-2 py-1.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-landing-focus after:absolute after:inset-x-2 after:bottom-1 after:h-0.5 after:origin-left after:scale-x-0 after:bg-landing-fg after:transition-transform after:duration-150 after:ease-out after:content-[''] hover:after:scale-x-100 focus-visible:after:scale-x-100 aria-expanded:after:scale-x-100 motion-reduce:after:transition-none"

function GroupedSolutionsMenu({
  groups,
  onClose,
}: {
  groups: NonNullable<LandingNavLink['dropdownGroups']>
  onClose: () => void
}) {
  return (
    <div className="grid w-full grid-cols-2 gap-8 p-5">
      {groups.map((group) => (
        <section key={group.label} aria-label={group.label}>
          <LandingNavItem
            link={{ label: group.label, href: group.href }}
            className="hover:bg-landing-surface-muted focus-visible:bg-landing-surface-muted mb-4 block rounded-lg px-3 py-2 text-base font-semibold transition-colors duration-150"
            onClick={onClose}
          />
          <ul className="grid gap-1">
            {group.links.map((item) => (
              <li key={item.href}>
                <LandingNavItem
                  link={item}
                  className="hover:bg-landing-surface-muted focus-visible:bg-landing-surface-muted block rounded-lg px-3 py-2.5 whitespace-normal transition-colors duration-150"
                  onClick={onClose}
                />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}

function NavDropdownMenu({
  link,
  open,
  setOpen,
}: {
  link: LandingNavLink
  open: boolean
  setOpen: (open: boolean) => void
}) {
  const reducedMotion = useReducedMotion()
  const menuRef = useRef<HTMLDivElement>(null)
  const openedByHover = useRef(false)
  const documentRef = useRef<Document>(globalThis.document)
  const items = link.dropdown ?? []
  const isWide = items.length > 4

  useDocumentEvent(
    'click',
    (event) => {
      if (open && menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    },
    documentRef,
  )

  return (
    <div
      className="lp-resources-wrap relative"
      ref={menuRef}
      onMouseEnter={() => {
        openedByHover.current = true
        setOpen(true)
      }}
      onPointerDown={(event) => {
        if (event.pointerType === 'touch' || event.pointerType === 'pen') openedByHover.current = false
      }}
      onMouseLeave={(event) => {
        const nav = event.currentTarget.closest('nav')
        if (!(event.relatedTarget instanceof Node) || !nav?.contains(event.relatedTarget)) setOpen(false)
      }}
      onFocus={link.dropdownTrigger ? undefined : () => setOpen(true)}
      onBlur={(event) => {
        if (open && !event.currentTarget.contains(event.relatedTarget)) setOpen(false)
      }}
      onKeyDown={(event) => {
        openedByHover.current = false
        if (event.key === 'Escape') {
          setOpen(false)
          menuRef.current?.querySelector<HTMLElement>('button, a')?.focus()
        }
      }}
    >
      <LandingNavItem
        link={link}
        className={cn(TOP_NAV_LINK_CLASS, 'justify-center gap-1.5')}
        ariaExpanded={open}
        ariaHaspopup={link.dropdownGroups ? undefined : 'menu'}
        onClick={() => setOpen(link.dropdownTrigger ? openedByHover.current || !open : false)}
      >
        {link.label}
        <img
          className={cn('h-[5px] w-[7px]', open && 'rotate-180')}
          src={new URL('../../assets/marketing/resources-caret.svg', import.meta.url).href}
          alt=""
          aria-hidden="true"
        />
      </LandingNavItem>
      {open ? (
        <motion.div
          layoutId={reducedMotion ? undefined : 'landing-nav-panel'}
          initial={false}
          transition={{ duration: reducedMotion ? 0 : 0.25, ease: [0.22, 1, 0.36, 1] }}
          className={cn(
            "border-landing-glass-bg bg-landing-menu-bg absolute top-[calc(100%+18px)] left-1/2 z-[70] flex w-[218px] -translate-x-1/2 flex-col rounded-[10px] border-[0.5px] border-solid px-2.5 pt-2.5 pb-3 text-left shadow-[var(--landing-shadow-resource-menu)] backdrop-blur-[5px] before:absolute before:top-[-18px] before:left-0 before:h-[18px] before:w-full before:content-['']",
            isWide && 'w-[300px]',
            link.dropdownGroups && 'w-[min(800px,85vw)]',
          )}
          role={link.dropdownGroups ? undefined : 'menu'}
        >
          {link.dropdownGroups ? (
            <GroupedSolutionsMenu groups={link.dropdownGroups} onClose={() => setOpen(false)} />
          ) : (
            items.map((item) => (
              <div
                className={cn('h-10 w-[198px] overflow-hidden rounded-[10px]', isWide && 'w-[280px]')}
                role="menuitem"
                key={item.label}
              >
                <LandingNavItem
                  link={item}
                  className={cn(RESOURCE_ITEM_LINK_CLASS, item.badge && 'justify-between gap-2')}
                  onClick={() => {
                    item.onClick?.()
                    setOpen(false)
                  }}
                />
              </div>
            ))
          )}
        </motion.div>
      ) : null}
    </div>
  )
}

export function MarketingNavigation({ navLinks }: { navLinks: LandingNavLink[] }) {
  const [active, setActive] = useState<string | null>(null)

  return (
    <LayoutGroup>
      <nav className="flex items-center gap-[clamp(20px,3vw,40px)]" onMouseLeave={() => setActive(null)}>
        {navLinks.map((link) =>
          link.dropdown ? (
            <NavDropdownMenu
              key={link.label}
              link={link}
              open={active === link.label}
              setOpen={(open) => setActive(open ? link.label : null)}
            />
          ) : (
            <div key={link.label} onMouseEnter={() => setActive(null)}>
              <LandingNavItem link={link} className={link.comingSoon ? undefined : TOP_NAV_LINK_CLASS} />
            </div>
          ),
        )}
      </nav>
    </LayoutGroup>
  )
}
