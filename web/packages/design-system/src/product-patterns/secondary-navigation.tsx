'use client'
import { ArrowLeftIcon, ChevronDownIcon } from '@heroicons/react/24/outline'
import { useId, useState } from 'react'
import { Button } from '../components/button'
import { SecondaryNavBack, SecondaryNavItem } from './secondary-nav'
export interface SecondaryNavigationItem {
  id: string
  label: string
  icon: React.ReactNode
  href?: string
}
export interface SecondaryNavigationSection {
  id: string
  label: string | null
  items: SecondaryNavigationItem[]
}
export interface SecondaryNavigationProps {
  title: string
  sections: SecondaryNavigationSection[]
  activeTab: string
  onTabChange: (id: string) => void
  backLabel?: string
  backHref?: string
  LinkComponent?: React.ElementType
}

export function SecondaryNavigation({
  title, sections, activeTab, onTabChange,
  backLabel = 'Back to workspace', backHref = '/home', LinkComponent = 'a',
}: SecondaryNavigationProps) {
  const mobileNavigationId = useId()
  const [mobileNavigationOpen, setMobileNavigationOpen] = useState(false)
  const activeItemLabel =
    sections.flatMap((section) => section.items).find((item) => item.id === activeTab)?.label ?? title
  return (
      <nav
        aria-label={title}
        data-brand-settings-nav
        className="bg-sidebar-background flex max-h-[50dvh] shrink-0 flex-col md:max-h-none md:w-64"
      >
        <SecondaryNavBack asChild>
          <LinkComponent href={backHref}>
            <ArrowLeftIcon aria-hidden="true" className="size-5 shrink-0" />
            <span>{backLabel}</span>
          </LinkComponent>
        </SecondaryNavBack>
        <Button
          variant="ghost"
          aria-controls={mobileNavigationId}
          aria-expanded={mobileNavigationOpen}
          className="text-foreground hover:bg-sidebar-hover h-auto min-h-14 w-full justify-between gap-3 rounded-none px-5 py-2 text-left md:hidden"
          onClick={() => {
            setMobileNavigationOpen((open) => !open)
          }}
          type="button"
        >
          <span className="min-w-0">
            <span className="text-muted-foreground block text-xs font-medium">{title}</span>
            <span className="block truncate text-sm font-semibold">{activeItemLabel}</span>
          </span>
          <ChevronDownIcon
            aria-hidden="true"
            className={`size-4 shrink-0 transition-transform ${mobileNavigationOpen ? 'rotate-180' : ''}`}
          />
        </Button>

        <div
          className={`${mobileNavigationOpen ? 'block' : 'hidden'} border-border min-h-0 overflow-y-auto overscroll-y-contain border-t md:block md:flex-1 md:border-t-0`}
          id={mobileNavigationId}
        >
          <div className="space-y-6 px-2 pt-2 pb-4 md:px-4 md:pb-6">
            {sections.map((section) => {
              const sectionLabelId = `${mobileNavigationId}-${section.id}`
              return (
                <div key={section.id}>
                  {section.label ? (
                    <p
                      className={
                        section.id === 'profile'
                          ? 'sr-only'
                          : 'text-muted-foreground mb-2 truncate px-3 text-xs font-medium'
                      }
                      id={sectionLabelId}
                      title={section.label}
                    >
                      {section.label}
                    </p>
                  ) : null}
                  <ul
                    aria-label={section.label ? undefined : title}
                    aria-labelledby={section.label ? sectionLabelId : undefined}
                    className="space-y-1"
                  >
                    {section.items.map((item) => {
                      const isActive = activeTab === item.id
                      const icon = item.icon
                      const content = (
                        <>
                          {icon}
                          <span className="min-w-0 truncate">{item.label}</span>
                        </>
                      )

                      return (
                        <li key={item.id}>
                          {item.href ? (
                            <SecondaryNavItem
                              asChild
                              aria-current={isActive ? 'page' : undefined}
                              data-active={isActive || undefined}
                              onClick={() => setMobileNavigationOpen(false)}
                              title={item.label}
                            >
                              <LinkComponent href={item.href}>{content}</LinkComponent>
                            </SecondaryNavItem>
                          ) : (
                            <SecondaryNavItem
                              aria-current={isActive ? 'page' : undefined}
                              data-active={isActive || undefined}
                              onClick={() => {
                                setMobileNavigationOpen(false)
                                onTabChange(item.id)
                              }}
                              title={item.label}
                              type="button"
                            >
                              {content}
                            </SecondaryNavItem>
                          )}
                        </li>
                      )
                    })}
                  </ul>
                </div>
              )
            })}
          </div>
        </div>
      </nav>

  )
}
