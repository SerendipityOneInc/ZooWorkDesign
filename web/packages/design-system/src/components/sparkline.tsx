'use client'

import { useId, useState, type ComponentProps } from 'react'
import { Tooltip, TooltipContent, TooltipTrigger } from './tooltip'
import { cn } from '../lib/cn'

export type SparklinePoint = { label: string; value: number | null }
export type SparklineProps = Omit<ComponentProps<'div'>, 'children'> & {
  data: readonly SparklinePoint[]
  label: string
  emptyLabel: string
  height?: number
  formatValue?: (value: number) => string
}

/** Source palette and 1.5px linear stroke: Agents / AgentActivityChart. */
export function Sparkline({ data, label, emptyLabel, height = 40, formatValue = String, className, ...props }: SparklineProps) {
  const gradientId = `sparkline-${useId().replace(/:/g, '')}`
  const [active, setActive] = useState<number | null>(null)
  const available = data.flatMap((point, index) => point.value !== null && Number.isFinite(point.value) ? [index] : [])
  const values = available.map(index => data[index].value!)
  // Normalization also keeps a domain spanning large positive/negative values finite.
  const magnitude = values.reduce((max, value) => Math.max(max, Math.abs(value)), 1)
  const low = Math.min(0, ...values.map(value => value / magnitude))
  const high = Math.max(1 / magnitude, ...values.map(value => value / magnitude))
  const points = data.map((point, index) => point.value !== null && Number.isFinite(point.value) ? {
    x: data.length === 1 ? 128 : 4 + index / (data.length - 1) * 248,
    y: 36 - ((point.value / magnitude - low) / (high - low)) * 32,
  } : null)
  const selected = active !== null && available.includes(active) ? active : available.at(-1)
  const current = selected === undefined ? null : points[selected]
  const description = data.map(point => `${point.label}: ${point.value !== null && Number.isFinite(point.value) ? formatValue(point.value) : emptyLabel}`).join('; ')
  let path = ''
  points.forEach((point, index) => { if (point) path += `${index && points[index - 1] ? 'L' : 'M'}${point.x} ${point.y} ` })
  if (!available.length) return <div {...props} data-slot="sparkline" className={cn('zc-sparkline focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4', className)} style={{ height, ...props.style }}>
    <span role="img" aria-label={`${label}: ${emptyLabel}`} className="text-muted-foreground text-xs">{emptyLabel}</span>
  </div>
  return <Tooltip open={active !== null} onOpenChange={open => { if (!open) setActive(null) }}>
    <TooltipTrigger asChild>
      <div {...props} data-slot="sparkline" className={cn('zc-sparkline focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4', className)} style={{ height, ...props.style }}
        tabIndex={0} role="img" aria-label={`${label}. ${description}`}
        onPointerMove={event => {
          props.onPointerMove?.(event)
          const bounds = event.currentTarget.getBoundingClientRect()
          const target = (event.clientX - bounds.left) / bounds.width * 256
          setActive(available.reduce((best, index) => Math.abs(points[index]!.x - target) < Math.abs(points[best]!.x - target) ? index : best, available[0]))
        }}
        onFocus={event => { props.onFocus?.(event); setActive(available.at(-1)!) }}
        onBlur={event => { props.onBlur?.(event); setActive(null) }}
        onPointerLeave={event => { props.onPointerLeave?.(event); if (document.activeElement !== event.currentTarget) setActive(null) }}
        onKeyDown={event => {
          props.onKeyDown?.(event)
          if (event.defaultPrevented || !['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return
          event.preventDefault()
          const index = available.indexOf(selected!)
          setActive(event.key === 'Home' ? available[0] : event.key === 'End' ? available.at(-1)! :
            available[Math.max(0, Math.min(available.length - 1, index + (event.key === 'ArrowRight' ? 1 : -1)))])
        }}>
        <svg viewBox="0 0 256 40" preserveAspectRatio="none" aria-hidden="true">
          <defs><linearGradient id={gradientId} x1="0" y1="0" x2="256" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="var(--zw-activity-purple, #7874d7)" />
            <stop offset="50%" stopColor="var(--zw-activity-teal, #56b3ab)" />
            <stop offset="100%" stopColor="var(--zw-activity-green, #6bdc69)" />
          </linearGradient></defs>
          <path d={path.trim()} fill="none" stroke={`url(#${gradientId})`} strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
          {points.map((point, index) => point && !points[index - 1] && !points[index + 1] ?
            <circle key={index} cx={point.x} cy={point.y} r="1.5" fill={`url(#${gradientId})`} /> : null)}
          {active !== null && current && <circle cx={current.x} cy={current.y} r="2.5" fill="var(--surface)" stroke="var(--foreground)" strokeWidth="1" vectorEffect="non-scaling-stroke" />}
        </svg>
      </div>
    </TooltipTrigger>
    <TooltipContent><span aria-live="polite">{selected !== undefined && `${data[selected].label}: ${formatValue(data[selected].value!)}`}</span></TooltipContent>
  </Tooltip>
}
