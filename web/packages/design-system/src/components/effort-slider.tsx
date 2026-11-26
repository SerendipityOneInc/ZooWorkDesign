'use client'

import { useCallback, useState } from 'react'
import { useMediaQuery } from 'usehooks-ts'
import { cn } from '../lib/cn'
import { Slider } from './slider'
import { EffortSliderMaxBurst, EffortSliderMaxTrack } from './effort-slider-effects'

const EFFORT_STOPS = ['low', 'medium', 'high', 'max'] as const
export type EffortSliderLevel = 'off' | (typeof EFFORT_STOPS)[number]
export interface EffortSliderLabels {
  title: string
  auto: string
  off: string
  low: string
  medium: string
  high: string
  max: string
}
export interface EffortSliderProps {
  /** Controlled value. Off and undefined are preserved until the user chooses a stop. */
  value?: EffortSliderLevel
  levels?: readonly EffortSliderLevel[]
  disabled?: boolean
  /** Focus is opt-in for popovers; gallery instances never move page focus. */
  autoFocus?: boolean
  showValue?: boolean
  labels?: Partial<EffortSliderLabels>
  onValueChange?: (level: EffortSliderLevel) => void
  /** Called once at pointer release, or for a keyboard choice. Persistence belongs to the host. */
  onValueCommit?: (level: (typeof EFFORT_STOPS)[number]) => void
  onValueCancel?: () => void
  className?: string
  'data-testid'?: string
}
const DEFAULT_LABELS: EffortSliderLabels = {
  title: 'Thinking effort', auto: 'Auto', off: 'Off', low: 'Low', medium: 'Medium', high: 'High', max: 'Max',
}

/** PR #4083's effort control, reusable without a model picker or chat session. */
export function EffortSlider({
  value, levels = EFFORT_STOPS, disabled = false, autoFocus = false, showValue = true,
  labels, onValueChange, onValueCommit, onValueCancel, className, 'data-testid': testId = 'effort-slider',
}: EffortSliderProps) {
  const copy = { ...DEFAULT_LABELS, ...labels }
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)', { defaultValue: true, initializeWithValue: false })
  const [burst, setBurst] = useState({ id: 0, playing: false })
  const focusThumb = useCallback((element: HTMLSpanElement | null) => element?.focus(), [])
  const current = value
  const currentLabel = current ? copy[current] : copy.auto
  const position = EFFORT_STOPS.findIndex(level => level === current)
  const supported = EFFORT_STOPS.filter(level => levels.includes(level))
  const maxMotion = current === 'max' && !reducedMotion

  function preview(level: (typeof EFFORT_STOPS)[number]) {
    if (disabled) return
    if (level === 'max' && current !== 'max' && !reducedMotion) {
      setBurst(previous => ({ id: previous.id + 1, playing: true }))
    }
    onValueChange?.(level)
  }
  function commit(level: (typeof EFFORT_STOPS)[number]) {
    if (disabled || !levels.includes(level)) return
    preview(level)
    onValueCommit?.(level)
  }
  function onSliderKeyDown(event: React.KeyboardEvent) {
    const forward = ['ArrowRight', 'ArrowUp', 'PageUp'].includes(event.key)
    const backward = ['ArrowLeft', 'ArrowDown', 'PageDown'].includes(event.key)
    if (!forward && !backward && event.key !== 'Home' && event.key !== 'End') return
    event.preventDefault()
    event.stopPropagation()
    const next =
      event.key === 'Home'
        ? supported[0]
        : event.key === 'End'
          ? supported.at(-1)
          : forward
            ? supported.find((level) => EFFORT_STOPS.indexOf(level) > position)
            : [...supported].reverse().find((level) => EFFORT_STOPS.indexOf(level) < position)
    if (next) void commit(next)
  }

  return <div data-slot="effort-slider" className={cn('w-full', className)}>
    {showValue && <div role="status" aria-live="polite" className="text-foreground mb-2 text-center text-lg leading-6 font-medium">{currentLabel}</div>}
      <div className="relative">
          <Slider
            data-testid={testId}
            min={0}
            max={3}
            step={1}
            value={[Math.max(0, position)]}
            disabled={disabled}
            thumbProps={{
              ref: autoFocus ? focusThumb : undefined,
              className:
                'motion-fast transition-[scale,box-shadow] hover:scale-115 motion-reduce:transition-none',
              'aria-label': copy.title,
              'aria-valuetext': currentLabel,
              children: burst.playing ? (
                <EffortSliderMaxBurst
                  key={burst.id}
                  active={maxMotion}
                  onComplete={() => {
                    setBurst((previous) => (previous.id === burst.id ? { ...previous, playing: false } : previous))
                  }}
                />
              ) : undefined,
            }}
            rangeProps={{
              className: current === 'max' ? 'bg-[image:var(--zw-gradient-activity)]' : undefined,
              children: maxMotion ? <EffortSliderMaxTrack /> : undefined,
            }}
            onKeyDownCapture={onSliderKeyDown}
            onPointerCancel={onValueCancel}
            onPointerUp={(event) => {
              // Off keeps a semantic thumb at the start without changing its saved value.
              // Radix skips commits at the unchanged starting position, so handle that choice.
              if (position >= 0 || event.button !== 0) return
              const { left, width } = event.currentTarget.getBoundingClientRect()
              if (width > 0 && event.clientX - left <= width / 6) void commit('low')
            }}
            onValueChange={([index]) => {
              const level = EFFORT_STOPS[index]
              if (level && levels.includes(level)) preview(level)
            }}
            onValueCommit={([index]) => {
              const level = EFFORT_STOPS[index]
              if (level && levels.includes(level)) void commit(level)
              else onValueCancel?.()
            }}
            className="[&_[data-slot=slider-range]]:bg-brand-ink [&_[data-slot=slider-thumb]]:border-border/60 [&_[data-slot=slider-thumb]]:bg-background [&_[data-slot=slider-track]]:bg-foreground/20 h-10 [&_[data-slot=slider-thumb]]:size-4.5 [&_[data-slot=slider-thumb]]:shadow-sm [&_[data-slot=slider-track]]:h-4"
          />
          {current !== 'max' ? (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-[9px] top-1/2 flex -translate-y-1/2 justify-between"
            >
              {EFFORT_STOPS.map((level, index) => (
                <span
                  key={level}
                  className={cn(
                    'size-1.5 rounded-full',
                    index < position ? 'bg-primary-foreground/50' : 'bg-muted-foreground/40',
                    index === position && 'invisible',
                    !levels.includes(level) && 'opacity-30',
                  )}
                />
              ))}
            </div>
          ) : null}
      </div>
  </div>
}
