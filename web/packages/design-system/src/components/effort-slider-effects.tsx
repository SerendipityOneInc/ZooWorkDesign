'use client'

import { motion } from 'motion/react'

const SPARKLES = [
  { placement: 'right-5 top-0.5', size: 'size-0.5', delay: 0 },
  { placement: 'right-6 bottom-0.5', size: 'size-[3px]', delay: 0.19 },
  { placement: 'right-8 top-1.5', size: 'size-0.5', delay: 0.08 },
  { placement: 'right-10 top-0.5', size: 'size-[3px]', delay: 0.37 },
  { placement: 'right-12 bottom-1', size: 'size-0.5', delay: 0.24 },
  { placement: 'right-14 top-1', size: 'size-0.5', delay: 0.62 },
  { placement: 'right-18 bottom-0.5', size: 'size-[3px]', delay: 0.46 },
  { placement: 'right-24 top-1.5', size: 'size-0.5', delay: 0.83 },
  { placement: 'right-32 top-0.5', size: 'size-0.5', delay: 0.58 },
  { placement: 'right-44 bottom-1', size: 'size-0.5', delay: 1.07 },
  { placement: 'right-56 top-1', size: 'size-0.5', delay: 0.72 },
] as const

/** Decorative motion stays inside the track and never intercepts slider input. */
export function EffortSliderMaxTrack() {
  return (
    <motion.div
      aria-hidden="true"
      data-testid="effort-slider-max-motion"
      className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <motion.span
        className="absolute -inset-y-1 left-0 w-2/3 bg-[image:var(--zw-gradient-activity)] blur-[6px]"
        animate={{ x: ['160%', '-160%'], opacity: [0, 0.85, 0.85, 0] }}
        transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 0.2, ease: 'linear' }}
      />
      {SPARKLES.map(({ placement, size, delay }) => (
        <motion.span
          key={placement}
          className={`bg-primary-foreground absolute rounded-full ${size} ${placement}`}
          animate={{ opacity: [0, 0.9, 0.55, 0], x: [2, -14], y: [1, -2], scale: [0.5, 1, 0.6] }}
          transition={{ duration: 1.5, delay, repeat: Infinity, repeatDelay: 0.35, ease: 'easeOut' }}
        />
      ))}
    </motion.div>
  )
}

/** A single, irregular puff marks entering Max and then removes itself. */
export function EffortSliderMaxBurst({ active, onComplete }: { active: boolean; onComplete: () => void }) {
  return (
    <motion.span
      aria-hidden="true"
      data-testid="effort-slider-max-burst"
      className={`pointer-events-none absolute inset-0 ${active ? '' : 'hidden'}`}
      initial={{ opacity: active ? 1 : 0 }}
      animate={{ opacity: active ? [1, 1, 0] : 0 }}
      transition={{ duration: active ? 0.6 : 0, times: [0, 0.65, 1] }}
      onAnimationComplete={onComplete}
    >
      {[
        { x: 5, y: -17, size: 'size-[3px]' },
        { x: 16, y: -10, size: 'size-1' },
        { x: 20, y: 2, size: 'size-[3px]' },
        { x: 11, y: 12, size: 'size-0.5' },
        { x: -5, y: 14, size: 'size-[3px]' },
        { x: -8, y: -9, size: 'size-0.5' },
      ].map(({ x, y, size }, index) => (
        <motion.span
          key={index}
          className={`bg-brand-ink/90 shadow-brand-ink/30 absolute top-1/2 left-1/2 -translate-1/2 rounded-full shadow-[0_0_3px] ${size}`}
          initial={{ x: 0, y: 0, opacity: 0 }}
          animate={{ x, y, opacity: [0, 0.95, 0.6, 0], scale: [0.45, 1, 0.3] }}
          transition={{
            duration: 0.4 + index * 0.02,
            delay: index * 0.012,
            ease: [0.16, 1, 0.3, 1],
          }}
        />
      ))}
    </motion.span>
  )
}
