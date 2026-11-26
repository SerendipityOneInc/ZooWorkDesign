'use client'

import { ChevronDownIcon, GlobeAltIcon } from '@heroicons/react/24/outline'
import { Badge } from '../components/badge'
import { useId, useRef, useState } from 'react'
import { cn } from '../lib/cn'
import { useDocumentEvent } from './use-document-event'
import { MarketingContent } from './marketing-content'
import type { LandingFooterColumn, LandingFooterLink } from './types'
const FOOTER_LOGO_URL = new URL('../../assets/marketing/zoowork-horizontal-navy.png', import.meta.url).href

interface LandingFooterProps {
  locale: string
  onLocaleChange: (locale: string) => void
  columns: LandingFooterColumn[]
  languages: { code: string; label: string }[]
  labels: { tagline: string; home: string; language: string; copyright: string; comingSoon: string; useCases: string }
  award?: React.ReactNode
  socialLinks?: MarketingSocialLink[]
}
export interface MarketingSocialLink { label: string; href: string; icon?: string }
/** Supply your own account links and licensed icons. No product accounts are bundled. */
export const MARKETING_SOCIAL_LINKS: MarketingSocialLink[] = []

const FOOTER_LINK_CLASS =
  'text-landing-footer-fg-soft hover:text-landing-fg cursor-pointer border-0 bg-transparent p-0 text-left  text-[13.5px] leading-[1.7] font-normal transition-colors duration-150'

function FooterLinkItem({ link, comingSoonLabel }: { link: LandingFooterLink; comingSoonLabel: string }) {
  if (link.comingSoon) {
    return (
      <span
        className="text-landing-footer-fg-soft inline-flex flex-wrap items-center gap-x-2 gap-y-1 text-[13.5px] leading-[1.7]"
        aria-disabled="true"
      >
        <span>{link.label}</span>
        <Badge
          variant="outline"
          className="border-landing-border-footer bg-landing-footer-hover text-landing-footer-fg-muted h-auto px-1.5 py-0 text-[10px] font-normal"
        >
          {comingSoonLabel}
        </Badge>
      </span>
    )
  }
  if (link.onClick) {
    return (
      <button className={FOOTER_LINK_CLASS} type="button" onClick={link.onClick}>
        {link.label}
      </button>
    )
  }
  if (link.external) {
    return (
      <a className={FOOTER_LINK_CLASS} href={link.href} target="_blank" rel="noopener noreferrer">
        {link.label}
      </a>
    )
  }
  return (
    <a className={FOOTER_LINK_CLASS} href={link.href ?? '#'}>
      {link.label}
    </a>
  )
}

export function MarketingFooter({ locale, onLocaleChange, columns, languages, labels, award, socialLinks }: LandingFooterProps) {
  const tagline = labels.tagline.replace(/([,，、،])\s*/, '$1\n')
  return (
    <footer
      className="border-landing-border-footer bg-landing-footer-bg text-landing-fg mt-auto w-full border-t border-solid pt-[72px] pb-[34px] max-[481px]:pt-14 max-[481px]:pb-7"
      data-marketing-footer
    >
      <MarketingContent>
        <div className="grid grid-cols-[1.6fr_repeat(4,minmax(0,1fr))] gap-10 max-[1101px]:grid-cols-2 max-[641px]:grid-cols-1">
          <div className="max-[1101px]:col-span-2 max-[641px]:col-span-1">
            <a className="inline-flex w-fit" href="/" aria-label={`ZooWork — ${labels.home}`}>
              <img className="block h-9 w-auto max-w-48 object-contain" src={FOOTER_LOGO_URL} alt="ZooWork" />
            </a>
            <p className="text-landing-footer-fg-muted mt-4 max-w-[300px] text-[13.5px] leading-[1.7] font-normal text-pretty whitespace-pre-line">
              {tagline}
            </p>
            {award}
            <MarketingSocialLinks className="mt-5" links={socialLinks} />
          </div>

          {columns.map((col) => (
            <div
              className={cn(
                'flex min-w-0 flex-col gap-[15px]',
                col.title === labels.useCases &&
                  'items-start text-left [&_a]:w-full [&_a]:text-left [&_button]:w-full [&_button]:text-left',
              )}
              key={col.title}
            >
              <p className="text-landing-fg text-[13px] font-bold text-balance">{col.title}</p>
              <div className="flex flex-col gap-[11px]">
                {col.links.map((link) => (
                  <FooterLinkItem key={link.label} link={link} comingSoonLabel={labels.comingSoon} />
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-landing-footer-divider mt-14 h-px" />

        <div className="mt-[22px] flex min-h-10 items-center justify-between gap-6 max-[641px]:flex-col max-[641px]:items-start">
          <p className="text-landing-footer-fg-faint text-[12.5px] font-normal whitespace-nowrap">{labels.copyright}</p>
          <MarketingLanguageSelector
            locale={locale}
            onLocaleChange={onLocaleChange}
            languages={languages}
            label={labels.language}
          />
        </div>
      </MarketingContent>
    </footer>
  )
}

export function MarketingSocialLinks({ className, links = MARKETING_SOCIAL_LINKS }: { className?: string; links?: MarketingSocialLink[] }) {
  if (!links.length) return null
  return (
    <div className={cn('flex items-center gap-2', className)}>
      {links.map((social) => (
        <a
          key={social.label}
          href={social.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={social.label}
          className="border-landing-border-footer bg-landing-footer-hover hover:border-landing-footer-border-hover hover:bg-landing-footer-bg inline-flex size-[34px] cursor-pointer items-center justify-center rounded-[10px] border border-solid transition-colors duration-150 [&_img]:block [&_img]:size-[15px] [&_img]:opacity-70"
        >
          {social.icon ? <img src={social.icon} alt="" /> : <GlobeAltIcon className="size-4" aria-hidden="true" />}
        </a>
      ))}
    </div>
  )
}

export function MarketingLanguageSelector({
  locale,
  onLocaleChange,
  languages,
  label,
}: Pick<LandingFooterProps, 'locale' | 'onLocaleChange' | 'languages'> & { label: string }) {
  const [showLangMenu, setShowLangMenu] = useState(false)
  const langRef = useRef<HTMLDivElement>(null)
  const langTriggerRef = useRef<HTMLButtonElement>(null)
  const languageMenuId = useId()

  const focusLanguageOption = (position: 'first' | 'last') => {
    requestAnimationFrame(() => {
      const options = langRef.current?.querySelectorAll<HTMLButtonElement>('[role="menuitemradio"]')
      if (!options?.length) return
      options[position === 'first' ? 0 : options.length - 1]?.focus()
    })
  }

  const closeLanguageMenu = (restoreFocus = false) => {
    setShowLangMenu(false)
    if (restoreFocus) requestAnimationFrame(() => langTriggerRef.current?.focus())
  }

  // Close the language menu on outside click.
  const documentRef = useRef<Document>(globalThis.document)
  useDocumentEvent(
    'click',
    (e) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setShowLangMenu(false)
      }
    },
    documentRef,
  )

  return (
    <div ref={langRef} className={cn('relative', showLangMenu && 'z-10')}>
      <button
        ref={langTriggerRef}
        type="button"
        className="border-landing-border-footer-control bg-landing-footer-bg text-landing-footer-fg-soft hover:bg-landing-footer-hover inline-flex h-10 w-[140px] cursor-pointer items-center justify-center gap-2 rounded-[10px] border border-solid text-sm leading-[18.7px] font-medium whitespace-nowrap transition-colors duration-150 [&_svg]:size-[18px]"
        onClick={() => setShowLangMenu(!showLangMenu)}
        onKeyDown={(event) => {
          if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return
          event.preventDefault()
          setShowLangMenu(true)
          focusLanguageOption(event.key === 'ArrowDown' ? 'first' : 'last')
        }}
        aria-label={`${label}: ${languages.find((item) => item.code === locale)?.label ?? locale}`}
        aria-haspopup="menu"
        aria-expanded={showLangMenu}
        aria-controls={languageMenuId}
      >
        <GlobeAltIcon aria-hidden="true" />
        <span>{languages.find((item) => item.code === locale)?.label ?? locale}</span>
        <ChevronDownIcon className="!size-3" aria-hidden="true" />
      </button>
      <ul
        hidden={!showLangMenu}
        id={languageMenuId}
        role="menu"
        aria-label={label}
        className={cn(
          'border-landing-border-footer-menu bg-landing-footer-menu-bg absolute right-0 bottom-[calc(100%+6px)] z-10 max-h-[60vh] min-w-[140px] list-none overflow-y-auto rounded-xl border border-solid py-1.5 shadow-sm',
          showLangMenu ? 'block' : 'hidden',
        )}
        onKeyDown={(event) => {
          const options = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="menuitemradio"]'))
          const activeIndex = options.indexOf(document.activeElement as HTMLButtonElement)

          if (event.key === 'Escape') {
            event.preventDefault()
            closeLanguageMenu(true)
            return
          }
          if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return

          event.preventDefault()
          if (event.key === 'Home') options[0]?.focus()
          else if (event.key === 'End') options.at(-1)?.focus()
          else if (event.key === 'ArrowDown') options[(activeIndex + 1) % options.length]?.focus()
          else options[(activeIndex - 1 + options.length) % options.length]?.focus()
        }}
      >
        {languages.map(({ code, label }) => (
          <li key={code} role="none">
            <button
              type="button"
              role="menuitemradio"
              aria-checked={locale === code}
              className={cn(
                'text-landing-footer-fg-muted hover:bg-landing-footer-hover hover:text-landing-fg block w-full cursor-pointer border-0 bg-transparent px-4 py-2 text-left text-[13px] transition-colors duration-150',
                locale === code && 'text-landing-fg font-semibold',
              )}
              onClick={() => {
                onLocaleChange(code)
                closeLanguageMenu(true)
              }}
            >
              {label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
