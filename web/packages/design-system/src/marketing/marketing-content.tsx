'use client'

import { LayoutContainer } from '../components/layout-grid'

export function MarketingContent({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <LayoutContainer variant="marketing" data-marketing-content className={className} {...props} />
  )
}
