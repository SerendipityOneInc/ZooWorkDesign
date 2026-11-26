import { useState } from 'react'
import {
  Button,
  MarketingCtaActions,
  MarketingFooter,
  MarketingHeader,
  MarketingSocialLinks,
  type LandingNavLink,
  type LandingFooterColumn,
} from '@zooclaw/zooworkdesign'
import { usePreviewLocale } from './locale'

export function MarketingNavigationExample() {
  const { t } = usePreviewLocale()
  const [compact, setCompact] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const leaf = (label: string): LandingNavLink => ({ label: t(label), href: '#marketing-navigation' })
  const links: LandingNavLink[] = [
    {
      ...leaf('Products'),
      dropdownTrigger: true,
      dropdown: ['Agent Builder', 'Managed Agent API', 'Enterprise AI Stack', 'ZooData'].map(leaf),
    },
    {
      ...leaf('Solutions'),
      dropdownTrigger: true,
      dropdown: [],
      dropdownGroups: [
        {
          label: t('Agent Gallery'),
          href: '#marketing-navigation',
          links: [
            'Competitive Research Agent',
            'Marketing Reporting Agent',
            'Content Repurposing Agent',
            'SEO Audit Agent',
            'Prospect Research Agent',
            'Sales Meeting Prep Agent',
          ].map(leaf),
        },
        {
          label: t('Industry'),
          href: '#marketing-navigation',
          links: [
            'Cross-border Commerce',
            'Integrated Marketing Agency',
            'B2B Sales & CRM',
            'Smart Manufacturing Ops',
            'Hedge-Fund Research',
            'Interior Design',
          ].map(leaf),
        },
      ],
    },
    { ...leaf('Pricing'), badge: t('70% OFF') },
    leaf('Enterprise'),
    leaf('Developer'),
    {
      ...leaf('Resources'),
      dropdownTrigger: true,
      dropdown: ['Documentation', 'Blog', 'Changelog', 'Getting Started'].map(leaf),
    },
  ]
  return (
    <section className="pv-section" id="marketing-navigation">
      <h2>{t('Website navigation')}</h2>
      <p className="pv-sd">
        {t(
          'Source: LandingHeader / LandingMobileNav. Hover or click to open, move between menus, press Escape to close. The mobile menu keeps its accordion, scroll area and focus trap. Links in this example stay inside the catalog.',
        )}
      </p>
      <div className="pv-demo mb-5">
        <Button variant="outline" size="sm" onClick={() => setCompact(!compact)}>
          {t(compact ? 'Show desktop navigation' : 'Show mobile navigation')}
        </Button>
        <Button variant="outline" size="sm" aria-pressed={scrolled} onClick={() => setScrolled(!scrolled)}>
          {t('Scrolled glass header')}
        </Button>
      </div>
      <div className="pv-marketing-nav-stage" data-compact={compact} style={{ minHeight: compact ? 160 : 600 }}>
        <MarketingHeader
          compact={compact}
          scrolled={scrolled}
          navLinks={links}
          homeHref="#marketing-navigation"
          actions={
            <MarketingCtaActions
              salesLabel={t('Talk to Sales')}
              startLabel={t('Get Started')}
              salesHref="#marketing-navigation"
              items={[leaf('Agent Builder'), leaf('Managed Agent API')]}
            />
          }
          mobileActions={
            <MarketingCtaActions
              salesLabel={t('Talk to Sales')}
              startLabel={t('Get Started')}
              salesHref="#marketing-navigation"
              items={[leaf('Agent Builder'), leaf('Managed Agent API')]}
            />
          }
          menuLabel={t('Website menu')}
          closeLabel={t('Close')}
        />
      </div>
      <p className="bv-note">
        {t(
          'Navigation is separate from conversion actions. Supply your own sign-in and sales actions through the actions slot. Website samples retain the source light palette; the catalog typography uses Inter and Noto Sans SC.',
        )}
      </p>
    </section>
  )
}

export function MarketingFooterExample() {
  const { locale, setLocale, t } = usePreviewLocale()
  const columns: LandingFooterColumn[] = [
    ['Product', 'Agent Builder', 'Managed Agent API', 'Enterprise', 'ZooData'],
    ['Use Cases', 'Solutions', 'Agent Gallery', 'Cross-border Commerce', 'B2B Sales & CRM'],
    ['Resources', 'Documentation', 'Blog', 'Changelog', 'Getting Started'],
    ['Company', 'About', 'Contact', 'Privacy', 'Terms'],
  ].map(([title, ...links]) => ({
    title: t(title),
    links: links.map((label) => ({ label: t(label), href: '#marketing-footer' })),
  }))
  return (
    <section className="pv-section" id="marketing-footer">
      <h2>{t('Website footer')}</h2>
      <p className="pv-sd">
        {t(
          'Source: LandingFooter. Reuse footer columns, social links and locale selection independently. The language menu supports arrows, Home, End and Escape; choosing a language updates this catalog.',
        )}
      </p>
      <h3>{t('Social links · 34px controls / 15px marks')}</h3>
      <div data-marketing-surface className="my-5 p-5">
        <MarketingSocialLinks />
      </div>
      <div className="pv-marketing-footer" data-marketing-surface>
        <MarketingFooter
          locale={locale}
          onLocaleChange={(value) => setLocale(value === 'zh' ? 'zh' : 'en')}
          languages={[
            { code: 'en', label: t('English') },
            { code: 'zh', label: t('Simplified Chinese') },
          ]}
          columns={columns}
          labels={{
            tagline: t('Your expertise, deployed in minutes.'),
            home: t('Home'),
            language: t('Website language'),
            copyright: '© 2026 ZooWork',
            comingSoon: t('Coming soon'),
            useCases: t('Use Cases'),
          }}
        />
      </div>
      <p className="bv-note">
        {t(
          'Social links open the official external destinations. Footer links above use local examples; production routing, language persistence and campaign content belong to the host application.',
        )}
      </p>
    </section>
  )
}
