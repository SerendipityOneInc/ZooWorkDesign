import { WrenchScrewdriverIcon } from '@heroicons/react/24/outline'
import { Badge } from '@zooclaw/zooworkdesign'
import { usePreviewLocale } from './locale'

/** Documentation status; never added to the product components themselves. */
export function ConstructionBadge({ compact = false }: { compact?: boolean }) {
  const { locale } = usePreviewLocale()
  const label = locale === 'zh' ? '施工中' : 'Under construction'
  return <Badge variant="warning" className="pv-construction-badge" data-compact={compact || undefined}>
    {!compact && <WrenchScrewdriverIcon aria-hidden="true" />}
    <span>{compact && locale === 'en' ? 'WIP' : label}</span>
  </Badge>
}

export function ConstructionHeading({ title }: { title: string }) {
  const { locale } = usePreviewLocale()
  return <>
    <div className="pv-construction-heading"><h2>{title}</h2><ConstructionBadge /></div>
    <p className="pv-construction-note">{locale === 'zh'
      ? '本模块所有组件均在施工中，样式与交互仍会调整。'
      : 'All components in this module are under construction. Styles and interactions are still being refined.'}</p>
  </>
}
