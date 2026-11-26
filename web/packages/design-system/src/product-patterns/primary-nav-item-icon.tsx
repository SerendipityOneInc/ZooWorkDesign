'use client'

import { useReducedMotion } from 'motion/react'

import { ProductNavIcon as AnimatedNavIcon } from './product-nav-icon'

const ANIMATED_NAV_KEYS = new Set(['home', 'library', 'tasks', 'connector', 'mcp', 'skills', 'knowledge-base'])

export function PrimaryNavItemIcon({ navKey, children }: { navKey: string; children: React.ReactNode }) {
  const reducedMotion = useReducedMotion()
  return (
    <span className="shrink-0">
      {!reducedMotion && ANIMATED_NAV_KEYS.has(navKey) ? (
        <AnimatedNavIcon name={navKey} className="h-[18px] w-[18px]" />
      ) : (
        children
      )}
    </span>
  )
}
