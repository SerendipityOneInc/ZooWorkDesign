import { Fragment, type ReactNode } from 'react'
import { CHAT_UI_CATALOG_ITEMS } from './chat-ui/registry'

/** One ordering contract for sidebar, search, and the actual document. */
export const CATALOG = [
  { group: 'Introduction', items: [['purpose', 'Purpose'], ['principles', 'Principles'], ['styling', 'Styling']] },
  { group: 'Brand', items: [['brand', 'Identity · 品牌与资产']] },
  { group: 'Foundations', items: [
    ['color', 'Color'], ['type', 'Typography'], ['spacing', 'Spacing'], ['radius', 'Radius'],
    ['shadow', 'Elevation'], ['surfaces', 'Surfaces'], ['icons', 'Iconography'],
    ['illustrations', 'Illustrations & visual assets'], ['motion', 'Motion'],
  ] },
  { group: 'General controls', items: [['button', 'Button'], ['button-group', 'ButtonGroup'], ['kbd', 'Kbd']] },
  { group: 'Layout', items: [
    ['marketing-layout', 'Website layout'], ['workspace-layout', 'Workspace layout'],
    ['layout-grid', 'Layout & Grid'], ['splitter', 'Splitter'], ['separator', 'Separator'],
    ['aspect-ratio', 'AspectRatio'], ['scroll-area', 'ScrollArea'],
  ] },
  { group: 'Navigation', items: [
    ['product-navigation', 'Primary & secondary'], ['marketing-navigation', 'Website navigation'],
    ['marketing-footer', 'Website footer'], ['tabs', 'Tabs / Segmented'], ['breadcrumb', 'Breadcrumb'],
    ['pagination', 'Pagination'], ['nav-menu', 'NavigationMenu'], ['menubar', 'Menubar'],
    ['dropdown', 'Dropdown Menu'], ['context-menu', 'ContextMenu'], ['command', 'Command'],
  ] },
  { group: 'Data entry', items: [
    ['form', 'Inputs · Field'], ['input-group', 'InputGroup'], ['input-otp', 'InputOTP'],
    ['checkbox', 'Checkbox'], ['radio-group', 'RadioGroup'], ['switch', 'Switch'],
    ['slider', 'Slider'], ['select', 'Select'], ['native-select', 'NativeSelect'],
    ['toggle', 'Toggle · Toggle Group'],
  ] },
  { group: 'Data display', items: [
    ['avatar', 'Avatar'], ['badge', 'Badge'], ['tag', 'Tag'], ['card', 'Card'],
    ['table', 'Table'], ['item', 'Item'], ['statistic', 'Statistic'], ['calendar', 'Calendar'],
    ['carousel', 'Carousel'], ['accordion', 'Accordion'], ['collapsible', 'Collapsible'],
    ['tooltip', 'Tooltip'], ['popover', 'Popover'], ['hover-card', 'HoverCard'], ['empty', 'Empty'],
  ] },
  { group: 'Feedback', items: [
    ['alert', 'Alert'], ['global-alert', 'Global notice'], ['sonner', 'Toast'], ['dialog', 'Dialog'], ['alert-dialog', 'AlertDialog'],
    ['sheet', 'Sheet'], ['drawer', 'Drawer'], ['loading', 'Loading & progress'],
  ] },
  { group: 'Chat UI', items: CHAT_UI_CATALOG_ITEMS },
  { group: 'Patterns', items: [['chat-starters', 'Task starter pattern'], ['connector-pattern', 'Search & card collection'], ['app-shell', 'App shell sample']] },
  { group: 'Release', items: [['changelog', 'Changelog']] },
] as const

export type CatalogId = (typeof CATALOG)[number]['items'][number][0]
export const CATALOG_ITEMS = CATALOG.flatMap(group => group.items.map(([id, label]) => ({ id, label, group: group.group })))

export function CatalogContent({ sections }: { sections: Record<CatalogId, ReactNode> }) {
  return <>{CATALOG_ITEMS.map(({ id }) => <Fragment key={id}>{sections[id]}</Fragment>)}</>
}
