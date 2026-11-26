'use client'

import { useSelectionIndicator } from '../components/selection-indicator'

import { ProductButton as Button } from './product-button'
import { pluginTabClassName } from './plugin-tab-styles'
import { PluginSearch } from './plugin-search'
import { cn } from '../lib/cn'

export function ConnectorToolbar<T extends string>({
  categories,
  searchPlaceholder,
  query,
  category,
  presentation = 'page',
  onQueryChange,
  onCategoryChange,
}: {
  categories: readonly { value: T; label: string }[]
  searchPlaceholder: string
  query: string
  category: T
  presentation?: 'dialog' | 'page'
  onQueryChange: (query: string) => void
  onCategoryChange: (category: T) => void
}) {
  const selection = useSelectionIndicator('button[aria-pressed="true"]', 'line')
  const usesResponsiveRow = presentation === 'page'

  return (
    <div
      className={cn('flex flex-col gap-3', usesResponsiveRow && '@2xl:flex-row @2xl:items-center')}
      data-layout={usesResponsiveRow ? 'responsive-row' : 'stacked'}
      data-testid="composio-connectors-toolbar"
    >
      <div className={cn('flex min-w-0 items-center gap-6', usesResponsiveRow && '@2xl:flex-1')}>
        <div
          ref={selection.ref}
          data-moving-indicator={selection.ready || undefined}
          className="relative isolate flex min-w-0 gap-6 overflow-x-auto pb-1"
        >
          {selection.indicator}
          {categories.map((item) => (
            <Button
              key={item.value}
              type="button"
              variant="ghost"
              size="sm"
              aria-pressed={category === item.value}
              className={pluginTabClassName}
              onClick={() => onCategoryChange(item.value)}
            >
              <span data-slot="selection-label">{item.label}</span>
            </Button>
          ))}
        </div>
      </div>
      <PluginSearch
        className={usesResponsiveRow ? '@2xl:ml-auto @2xl:w-56 @2xl:shrink-0 @3xl:w-72' : 'sm:w-full'}
        layout={usesResponsiveRow ? 'responsive-compact' : 'stacked-full-width'}
        value={query}
        onChange={onQueryChange}
        placeholder={searchPlaceholder}
        testId="composio-connectors-search"
      />
    </div>
  )
}
