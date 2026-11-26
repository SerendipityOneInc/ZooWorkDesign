'use client'

import type { ComponentProps } from 'react'
import { Badge } from '../components/badge'
import { cn } from '../lib/cn'
/** Source: LandingNavItem promotional pricing marker, distinct from update status. */
export function PromotionBadge({ className, ...props }: ComponentProps<typeof Badge>) {
  return (
    <Badge
      variant="secondary"
      className={cn(
        'bg-pricing-offer-badge text-pricing-on-accent h-3.5 rounded-full border-0 px-1 text-[8px] leading-none font-bold',
        className,
      )}
      {...props}
    />
  )
}
