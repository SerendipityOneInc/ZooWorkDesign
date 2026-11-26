import { ProductNavIcon as AnimatedNavIcon } from '../../packages/design-system/src/product-patterns/product-nav-icon'
import { useState } from 'react'
import { motion } from 'motion/react'
import { Input, NativeSelect, sourceAssets, StateIllustration, PluginEmptyState, Button } from '@zooclaw/zooworkdesign'
import { sourceIcons } from './source-icon-catalog'
import { usePreviewLocale } from './locale'

function Source({ paths }: { paths: string[] }) {
  const { t } = usePreviewLocale()
  const [open, setOpen] = useState(false)
  return (
    <details onToggle={(event) => setOpen(event.currentTarget.open)} className="pv-asset-source">
      <summary>
        {t('Source references')} · {paths.length}
      </summary>
      {open && paths.map((path) => <code key={path}>{path}</code>)}
    </details>
  )
}

export function IconCatalog() {
  const { t } = usePreviewLocale()
  const [query, setQuery] = useState('')
  const [all, setAll] = useState(false)
  const icons = sourceIcons.filter((item) => `${item.name} ${item.family}`.toLowerCase().includes(query.toLowerCase()))
  const assets = sourceAssets.filter(
    (item) =>
      ['Product icons', 'Third-party marks'].includes(item.group) &&
      `${item.name} ${item.path}`.toLowerCase().includes(query.toLowerCase()),
  )
  return (
    <>
      <p className="pv-sd">
        {t(
          'Use Heroicons for general controls, original ZooWork paths for product navigation and sending, and original partner marks for integrations. Preserve viewBox and aspect ratio; size the control separately from the icon.',
        )}
      </p>
      <h3>{t('Animated product navigation')}</h3>
      <div className="pv-asset-grid">
        {['home', 'library', 'tasks', 'connector', 'mcp', 'skills', 'knowledge-base'].map((name) => (
          <motion.div key={name} initial="rest" whileHover="hover" className="pv-asset-tile">
            <AnimatedNavIcon name={name} className="size-6" />
            <code>{name}</code>
          </motion.div>
        ))}
      </div>
      <Input
        className="my-5 max-w-sm"
        aria-label={t('Search icons')}
        placeholder={t('Search icons')}
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      <h3>Heroicons · {sourceIcons.length}</h3>
      <div className="pv-asset-grid">
        {(all || query ? icons : icons.slice(0, 24)).map(({ Icon, name, family, references }) => (
          <div key={`${family}/${name}`} className="pv-asset-tile">
            <Icon className={family.startsWith('16') ? 'size-4' : 'size-6'} />
            <code>{name}</code>
            <small>{family}</small>
            <Source paths={references} />
          </div>
        ))}
      </div>
      {!query && (
        <Button className="my-4" variant="outline" size="sm" onClick={() => setAll(!all)}>
          {t(all ? 'Show Less' : 'Show all icons')}
        </Button>
      )}
      <h3>
        {t('Product icons and third-party marks')} · {assets.length}
      </h3>
      <div className="pv-asset-grid">
        {assets.map((item) => (
          <div key={item.path} className="pv-asset-tile">
            <div className="pv-original-mark">
              <img src={item.src} alt="" loading="lazy" />
            </div>
            <code>{item.name}</code>
            <small>{t(item.group)}</small>
            <Source paths={item.references} />
          </div>
        ))}
      </div>
      <p className="bv-note">
        {t(
          'This inventory covers named imports and referenced local assets in the current source. Runtime connector logos, user uploads and remote assets are supplied by the host application.',
        )}
      </p>
    </>
  )
}

export function IllustrationCatalog() {
  const { t } = usePreviewLocale()
  return (
    <section className="pv-section" id="illustrations">
      <h2>{t('Illustrations & visual assets')}</h2>
      <p className="pv-sd">
        {t(
          'Use state artwork to explain absence or recovery, brand illustrations for storytelling, and avatars to identify agents. Keep original proportions and whitespace; do not use illustrations as clickable icons. Third-party trust marks are contextual assets, not general decoration.',
        )}
      </p>
      {['State illustrations', 'Brand illustrations', 'Agent avatars', 'Trust marks'].map((group) => (
        <div key={group} className="pv-asset-group">
          <h3>{t(group)}</h3>
          <div className="pv-illustration-grid">
            {sourceAssets
              .filter((item) => item.group === group)
              .map((item) => (
                <figure className="pv-asset-tile" key={item.path}>
                  <div className="pv-illustration-image">
                    {group === 'State illustrations' ? (
                      <StateIllustration
                        variant={item.name as React.ComponentProps<typeof StateIllustration>['variant']}
                      />
                    ) : (
                      <img src={item.src} alt="" loading="lazy" />
                    )}
                  </div>
                  <figcaption>
                    <code>{item.name}</code>
                    <Source paths={item.references} />
                  </figcaption>
                </figure>
              ))}
          </div>
        </div>
      ))}
    </section>
  )
}

export function SourceEmptyExamples() {
  const { t, locale } = usePreviewLocale()
  const c = (zh: string, en: string) => locale === 'zh' ? zh : en
  const [variant, setVariant] = useState<React.ComponentProps<typeof StateIllustration>['variant']>('no-results')
  const [layout, setLayout] = useState<'page' | 'section'>('section')
  const copy = {
    'no-results': ['No results found', 'Try another search.'],
    'empty-knowledge': ['No knowledge yet', 'Add knowledge for your agents.'],
    'empty-tasks': ['No tasks yet', 'Tasks will appear here.'],
    'not-found': ['Not found', 'This item is no longer available.'],
    'connection-lost': ['Connection lost', 'Check your connection and try again.'],
    'empty-credentials': ['No API keys yet', 'Create a key and store its secret securely. The secret cannot be viewed again.'],
    'empty-connections': ['No webhooks yet', 'Choose the events your service needs. Each Project supports up to 10 endpoints.'],
    'empty-records': ['No payments yet', 'Completed and pending payments will appear here.'],
    'feature-unavailable': ['Members are not available', 'Invitations and member management are not available yet.'],
  }
  return (
    <>
      <p className="pv-sd">
        {t(
          'Source layouts from the Agents list and plugin pages. Illustrated states are distinct from compact sidebar placeholders; copy and actions come from the caller.',
        )}
      </p>
      <div className="pv-empty-grid">
        <div>
          <h3>{t('Agents · shared list')}</h3>
          <div className="text-muted-foreground flex flex-col items-center justify-center py-24 text-center text-sm">
            <StateIllustration variant="empty-tasks" />
            <p>{t('No shared agents yet.')}</p>
          </div>
          <code>AgentsClient / StateIllustration</code>
        </div>
        <div>
          <h3>{t('Plugin pages · illustrated state')}</h3>
          <NativeSelect
            aria-label={t('State illustration')}
            value={variant}
            onChange={(event) => setVariant(event.target.value as typeof variant)}
          >
            {Object.keys(copy).map((key) => (
              <option key={key}>{key}</option>
            ))}
          </NativeSelect>
          <NativeSelect aria-label={c('空状态布局', 'Empty state layout')} value={layout} onChange={(event) => setLayout(event.target.value as typeof layout)}>
            <option value="section">{c('内容区 · Platform', 'Section · Platform')}</option>
            <option value="page">{c('整页 · 原插件布局', 'Page · original plugin layout')}</option>
          </NativeSelect>
          <PluginEmptyState variant={variant} layout={layout} title={t(copy[variant][0])} description={t(copy[variant][1])}>
            {variant === 'empty-credentials' || variant === 'empty-connections' ? <Button variant="outline" onClick={() => window.alert(c('示例操作，应用负责打开创建表单。', 'Demo action: the application opens its creation form.'))}>{t(variant === 'empty-credentials' ? 'Create first key' : 'Create first webhook')}</Button> : null}
          </PluginEmptyState>
          <p className="text-sm text-muted-foreground">{c('占位：192×144 / 224×168px · 插画→标题16px · 标题→描述8px · 文字→操作24px。', 'Footprint: 192×144 / 224×168px · artwork→title 16px · title→description 8px · text→action 24px.')}</p>
          <code>PluginEmptyState / StateIllustration</code>
        </div>
      </div>
    </>
  )
}
