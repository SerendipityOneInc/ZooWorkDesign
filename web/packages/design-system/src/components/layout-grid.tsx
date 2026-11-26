import type { ComponentProps, CSSProperties } from 'react'
import { cn } from '../lib/cn'

export function LayoutContainer({ variant = 'product', className, ...props }:
  ComponentProps<'div'> & { variant?: 'product' | 'marketing' | 'collection' }) {
  return <div {...props} data-slot="layout-container" data-variant={variant} className={cn('zc-layout-container', className)} />
}

/** Container-responsive 4 / 8 / 12 columns. Spans may differ at each breakpoint. */
export function LayoutGrid({ gap = 24, className, style, ...props }:
  ComponentProps<'div'> & { gap?: 8 | 16 | 24 | 32 }) {
  return <div data-slot="layout-grid-container"><div {...props} data-slot="layout-grid"
    className={cn('zc-layout-grid', className)} style={{ ...style, gap }} /></div>
}

type Span = number | 'full'
export function GridItem({ span = 'full', tablet, desktop, style, ...props }:
  ComponentProps<'div'> & { span?: Span; tablet?: Span; desktop?: Span }) {
  const css = (value: Span, max: number) => value === 'full' ? '1 / -1' : `span ${Math.max(1, Math.min(max, Math.round(value)))}`
  return <div {...props} data-slot="grid-item" style={{ ...style,
    '--grid-span': css(span, 4), '--grid-tablet': css(tablet ?? span, 8),
    '--grid-desktop': css(desktop ?? tablet ?? span, 12),
  } as CSSProperties} />
}
