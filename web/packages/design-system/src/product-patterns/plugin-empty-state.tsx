import type { ComponentProps, ReactNode } from 'react'

import { cn } from '../lib/cn'
import { StateIllustration } from './state-illustration'

export interface PluginEmptyStateProps {
  title: string
  description?: string
  variant?: ComponentProps<typeof StateIllustration>['variant']
  /** Page preserves the original plugin spacing; section fits tables/settings. */
  layout?: 'page' | 'section'
  headingLevel?: 1 | 2 | 3
  children?: ReactNode
  'data-testid'?: string
}

export function PluginEmptyState({
  title,
  description,
  variant = 'no-results',
  layout = 'page',
  headingLevel = 3,
  children,
  ...props
}: PluginEmptyStateProps) {
  const Heading = headingLevel === 1 ? 'h1' : headingLevel === 2 ? 'h2' : 'h3'
  return (
    <div
      {...props}
      data-slot="illustrated-empty-state"
      data-layout={layout}
      className={cn(
        'flex min-h-80 min-w-0 flex-col items-center justify-center px-4 text-center',
        layout === 'page' ? 'flex-1 pt-12 pb-[clamp(3rem,18vh,12rem)]' : 'py-12',
      )}
    >
      <StateIllustration variant={variant} />
      <Heading className="mt-4 max-w-full text-base leading-6 font-medium break-words">{title}</Heading>
      {description && <p className={cn('text-muted-foreground mt-2 text-sm leading-6 break-words', layout === 'page' ? 'max-w-xl' : 'max-w-sm')}>{description}</p>}
      {children && <div data-slot="empty-state-actions" className="mt-6 flex max-w-full flex-col items-center gap-2">{children}</div>}
    </div>
  )
}
