'use client'

import { useEffect, useId, useRef, useState, type ComponentProps, type ReactNode } from 'react'
import { cn } from '../lib/cn'
import { Skeleton } from './skeleton'

export type StatisticProps = Omit<ComponentProps<'div'>, 'title' | 'prefix'> & {
  title: ReactNode
  value?: number | string | null
  precision?: number
  locale?: string
  groupSeparator?: string
  decimalSeparator?: string
  prefix?: ReactNode
  suffix?: ReactNode
  formatter?: (value: number | string) => ReactNode
  loading?: boolean
  loadingLabel?: string
  description?: ReactNode
  trend?: ReactNode
}

export function Statistic({
  title, value, precision, locale = 'en', groupSeparator, decimalSeparator,
  prefix, suffix, formatter, loading = false, loadingLabel = 'Loading', description, trend, className, ...props
}: StatisticProps) {
  const titleId = useId()
  const missing = value === null || value === undefined || (typeof value === 'number' && !Number.isFinite(value))
  const digits = precision === undefined ? undefined : Math.max(0, Math.min(20, Math.trunc(precision)))
  const content = missing ? '—' : formatter ? formatter(value) : typeof value === 'number'
    ? new Intl.NumberFormat(locale, { minimumFractionDigits: digits, maximumFractionDigits: digits })
      .formatToParts(value).map((part) => part.type === 'group' ? (groupSeparator ?? part.value)
        : part.type === 'decimal' ? (decimalSeparator ?? part.value) : part.value).join('')
    : value
  return <div {...props} data-slot="statistic" className={cn('zc-statistic', className)} aria-busy={loading}>
    <div id={titleId} data-slot="statistic-title">{title}</div>
    {loading ? <div role="status" aria-label={loadingLabel}><Skeleton className="h-8 w-24" /></div> :
      <div data-slot="statistic-value" aria-labelledby={titleId}>
        {!missing && prefix && <span data-slot="statistic-prefix">{prefix}</span>}
        <span>{content}</span>
        {!missing && suffix && <span data-slot="statistic-suffix">{suffix}</span>}
      </div>}
    {description && <div data-slot="statistic-description">{description}</div>}
    {trend && <div data-slot="statistic-trend">{loading ? <Skeleton className="h-10 w-full" /> : trend}</div>}
  </div>
}

export type StatisticCountdownProps = Omit<StatisticProps, 'value' | 'precision' | 'formatter'> & {
  target: number | Date
  onFinish?: () => void
}

/** Derive each frame from wall time so background tabs cannot accumulate timer drift. */
export function StatisticCountdown({ target, onFinish, ...props }: StatisticCountdownProps) {
  const end = typeof target === 'number' ? target : target.getTime()
  const [now, setNow] = useState(() => Date.now())
  const finished = useRef<number | null>(null)
  const callback = useRef(onFinish)
  callback.current = onFinish
  useEffect(() => {
    if (!Number.isFinite(end)) return
    let timer: ReturnType<typeof setInterval> | undefined
    const tick = () => {
      const time = Date.now()
      setNow(time)
      if (time >= end) {
        if (timer) clearInterval(timer)
        if (finished.current !== end) { finished.current = end; callback.current?.() }
      }
    }
    if (Date.now() < end) timer = setInterval(tick, 250)
    tick()
    return () => { if (timer) clearInterval(timer) }
  }, [end])
  const seconds = Math.max(0, Math.ceil((end - now) / 1000))
  const value = Number.isFinite(seconds)
    ? [Math.floor(seconds / 3600), Math.floor(seconds / 60) % 60, seconds % 60].map(n => String(n).padStart(2, '0')).join(':')
    : null
  return <Statistic {...props} value={value} />
}
