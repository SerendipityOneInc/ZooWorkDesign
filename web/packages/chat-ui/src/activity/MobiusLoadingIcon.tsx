'use client'

import { type CSSProperties, useId } from 'react'

import { MOBIUS_DRAW_SEGMENTS, MOBIUS_DURATION_SECONDS, MOBIUS_OPACITY_EASING, MOBIUS_PATH } from './mobius-loading'

export function MobiusLoadingIcon({ className }: { className?: string }) {
  const clipId = `mobius-${useId().replace(/:/g, '')}`
  const timing = {
    '--mobius-duration': `${MOBIUS_DURATION_SECONDS}s`,
    animationTimingFunction: MOBIUS_OPACITY_EASING,
  } as CSSProperties

  return (
    <svg className={className} viewBox="-8 267 1040 490" aria-hidden="true" focusable="false">
      <defs>
        <clipPath id={clipId}>
          <path d={MOBIUS_PATH} />
        </clipPath>
      </defs>
      {/* CSS starts at first paint, without waiting for hydration or window.load.
          Reduced-motion users retain the complete mark from the server HTML. */}
      <path className="hidden motion-reduce:block" d={MOBIUS_PATH} fill="currentColor" />
      <g
        className="animate-mobius-frame motion-reduce:hidden"
        fill="currentColor"
        clipPath={`url(#${clipId})`}
        style={timing}
      >
        {MOBIUS_DRAW_SEGMENTS.map(({ path, easing }) => (
          <path key={easing} className="animate-mobius-frame" d={path} style={{ animationTimingFunction: easing }} />
        ))}
      </g>
    </svg>
  )
}
