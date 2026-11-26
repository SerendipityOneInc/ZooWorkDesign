import type { ComponentProps, ReactNode } from 'react'
import { cn } from '../lib/cn'
import { LayoutContainer } from './layout-grid'

/** Visual slots only: consumers provide their own header/footer landmarks. */
export function MarketingLayout({ header, footer, children, className, ...props }:
  ComponentProps<'div'> & { header: ReactNode; footer: ReactNode }) {
  return <div {...props} data-slot="marketing-layout" className={cn('zc-marketing-layout', className)}>
    <div data-slot="marketing-layout-header">{header}</div>
    <div data-slot="marketing-layout-content">{children}</div>
    <div data-slot="marketing-layout-footer">{footer}</div>
  </div>
}

/** Full-bleed section background with the shared, centered website container. */
export function MarketingSection({ children, className, spacing = 'section', tone = 'default', ...props }:
  ComponentProps<'section'> & { spacing?: 'compact' | 'section' | 'hero'; tone?: 'default' | 'subtle' }) {
  return <section {...props} data-slot="marketing-section" data-spacing={spacing} data-tone={tone}
    className={cn('zc-marketing-section', className)}>
    <LayoutContainer variant="marketing">{children}</LayoutContainer>
  </section>
}
