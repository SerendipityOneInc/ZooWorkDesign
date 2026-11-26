'use client'

import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { useEffect, useState } from 'react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../components/accordion'
import { Button } from '../components/button'
import { Sheet, SheetBody, SheetClose, SheetContent, SheetTitle, SheetTrigger } from '../components/sheet'
import { cn } from '../lib/cn'
import { LandingNavItem } from './landing-nav-item'
import type { LandingNavLink } from './types'
const MOBILE_LINK_CLASS =
  'hover:bg-landing-surface-muted focus-visible:outline-landing-fg flex min-h-12 w-full items-center justify-between gap-3 rounded-md px-3 py-3 text-base leading-6 whitespace-normal focus-visible:outline-2 focus-visible:-outline-offset-2'

const MOBILE_TOP_LEVEL_LINK_CLASS =
  'border-landing-border-ui flex min-h-13 items-center border-b px-2 py-3 text-base whitespace-normal'

const MOBILE_MENU_MOTION_CLASS =
  'data-open:[animation-duration:var(--duration-layout)] data-open:[animation-timing-function:cubic-bezier(0.25,1,0.5,1)] data-closed:[animation-duration:var(--duration-emphasis)] data-closed:[animation-timing-function:cubic-bezier(0.4,0,0.2,1)] motion-reduce:animate-none!'

function MobileNavLinks({ links, onNavigate }: { links: LandingNavLink[]; onNavigate: () => void }) {
  return (
    <ul>
      {links.map((link) => (
        <li key={link.label}>
          <LandingNavItem
            link={link}
            className={MOBILE_LINK_CLASS}
            onClick={() => {
              onNavigate()
              link.onClick?.()
            }}
          />
        </li>
      ))}
    </ul>
  )
}

function MobileNavGroup({ link, onNavigate }: { link: LandingNavLink; onNavigate: () => void }) {
  return (
    <AccordionItem value={link.label} className="border-landing-border-ui">
      <AccordionTrigger className="text-landing-fg hover:bg-landing-surface-muted [&_[data-slot=accordion-trigger-icon]]:text-landing-text-secondary min-h-13 px-2 text-base font-normal">
        {link.label}
      </AccordionTrigger>
      <AccordionContent className="text-landing-fg h-auto px-0 pb-3 [&_a]:no-underline">
        <div className="bg-landing-surface-muted rounded-lg px-1">
          {link.dropdownGroups ? (
            link.dropdownGroups.map((group) => (
              <section key={group.label} aria-label={group.label} className="py-2">
                <LandingNavItem
                  link={{ label: group.label, href: group.href }}
                  className="hover:bg-landing-surface-control-hover focus-visible:bg-landing-surface-control-hover flex min-h-12 items-center rounded-md px-3 text-base font-medium whitespace-normal"
                  onClick={onNavigate}
                />
                <MobileNavLinks links={group.links} onNavigate={onNavigate} />
              </section>
            ))
          ) : (
            <MobileNavLinks links={link.dropdown ?? []} onNavigate={onNavigate} />
          )}
        </div>
      </AccordionContent>
    </AccordionItem>
  )
}

export function MarketingMobileNavigation({
  navLinks,
  menuLabel,
  closeLabel,
  actions,
  compact = false,
}: {
  navLinks: LandingNavLink[]
  menuLabel: string
  closeLabel: string
  actions?: React.ReactNode
  compact?: boolean
}) {
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)
  useEffect(() => {
    const resize = () => {
      if (!compact && window.innerWidth > 1101) setOpen(false)
    }
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [compact])
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          aria-label={menuLabel}
          className={cn(
            'text-landing-fg hover:bg-landing-surface-muted size-11 rounded-md border-0 p-0',
            !compact && 'min-[1102px]:hidden',
          )}
        >
          <Bars3Icon className="size-6" />
        </Button>
      </SheetTrigger>
      <SheetContent
        data-marketing-surface
        aria-describedby={undefined}
        showCloseButton={false}
        side="right"
        overlayClassName={MOBILE_MENU_MOTION_CLASS}
        className={`${MOBILE_MENU_MOTION_CLASS} border-landing-border-ui bg-landing-hero-bg text-landing-fg h-dvh data-[side=right]:w-full min-[481px]:data-[side=right]:w-[420px]`}
      >
        <div className="border-landing-border-ui flex min-h-14 shrink-0 items-center justify-between border-b px-5 pt-[max(6px,env(safe-area-inset-top))] pb-1.5">
          <SheetTitle className="text-landing-fg text-xl font-medium">{menuLabel}</SheetTitle>
          <SheetClose asChild>
            <Button
              variant="ghost"
              aria-label={closeLabel}
              className="text-landing-fg hover:bg-landing-surface-muted size-11"
            >
              <XMarkIcon className="size-6" />
            </Button>
          </SheetClose>
        </div>
        <SheetBody className="overscroll-contain px-5 py-2">
          <nav aria-label={menuLabel}>
            <Accordion type="multiple">
              {navLinks.map((link) =>
                link.dropdown ? (
                  <MobileNavGroup key={link.label} link={link} onNavigate={close} />
                ) : (
                  <LandingNavItem
                    key={link.label}
                    link={link}
                    className={cn(MOBILE_TOP_LEVEL_LINK_CLASS, 'hover:bg-landing-surface-muted')}
                    onClick={close}
                  />
                ),
              )}
            </Accordion>
          </nav>
        </SheetBody>
        {actions && (
          <div className="border-landing-border-ui grid gap-2 border-t px-5 pt-4 pb-[max(16px,env(safe-area-inset-bottom))]">
            {actions}
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
