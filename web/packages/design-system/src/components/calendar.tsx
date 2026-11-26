'use client'

import { useId, useLayoutEffect, useRef, useState, type ComponentProps, type ReactNode } from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/16/solid'
import { Button } from './button'
import { cn } from '../lib/cn'

const day = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate())
const startMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1)
const sameDay = (a: Date | undefined, b: Date) => !!a && day(a).getTime() === day(b).getTime()
const addDays = (date: Date, count: number) => new Date(date.getFullYear(), date.getMonth(), date.getDate() + count)
function addMonths(date: Date, count: number) {
  const next = new Date(date.getFullYear(), date.getMonth() + count, 1)
  return new Date(next.getFullYear(), next.getMonth(), Math.min(date.getDate(), new Date(next.getFullYear(), next.getMonth() + 1, 0).getDate()))
}
const dateKey = (date: Date) => [date.getFullYear(), date.getMonth() + 1, date.getDate()].join('-')

export type CalendarProps = Omit<ComponentProps<'div'>, 'onChange' | 'defaultValue'> & {
  value?: Date
  defaultValue?: Date
  onValueChange?: (date: Date) => void
  month?: Date
  defaultMonth?: Date
  onMonthChange?: (date: Date) => void
  locale?: string
  weekStartsOn?: 0 | 1
  minDate?: Date
  maxDate?: Date
  disabled?: boolean | ((date: Date) => boolean)
  cellContent?: (date: Date) => ReactNode
  labels?: { previousMonth: string; nextMonth: string }
}

export function Calendar({
  value, defaultValue, onValueChange, month: controlledMonth, defaultMonth, onMonthChange,
  locale = 'en', weekStartsOn = 1, minDate, maxDate, disabled = false, cellContent,
  labels = { previousMonth: 'Previous month', nextMonth: 'Next month' }, className, ...props
}: CalendarProps) {
  const [selected, setSelected] = useState(defaultValue)
  const [localMonth, setMonth] = useState(() => startMonth(defaultMonth ?? value ?? defaultValue ?? new Date()))
  const month = startMonth(controlledMonth ?? localMonth)
  const active = value ?? selected
  const [focused, setFocused] = useState(() => day(value ?? defaultValue ?? new Date()))
  const pendingFocus = useRef(false)
  const root = useRef<HTMLDivElement>(null)
  const heading = useId()
  const blocked = (date: Date) => !!(
    (minDate && day(date) < day(minDate)) || (maxDate && day(date) > day(maxDate)) ||
    (typeof disabled === 'function' ? disabled(date) : disabled)
  )
  const leading = (month.getDay() - weekStartsOn + 7) % 7
  const dates = Array.from({ length: 42 }, (_, i) => addDays(month, i - leading))
  const focusDate = dates.find(d => sameDay(d, focused) && !blocked(d)) ??
    dates.find(d => sameDay(active, d) && !blocked(d)) ??
    dates.find(d => d.getMonth() === month.getMonth() && !blocked(d))
  const setVisibleMonth = (date: Date) => {
    const next = startMonth(date)
    if (controlledMonth === undefined) setMonth(next)
    onMonthChange?.(next)
  }
  useLayoutEffect(() => {
    if (!pendingFocus.current) return
    root.current?.querySelector<HTMLButtonElement>('button[data-day][tabindex="0"]')?.focus()
    pendingFocus.current = false
  }, [focused, controlledMonth])

  const moveFocus = (date: Date, direction: number) => {
    let next = date
    // Bounded search also handles a calendar where every day is disabled.
    for (let i = 0; i < 366; i++, next = addDays(next, direction)) {
      if ((minDate && next < day(minDate)) || (maxDate && next > day(maxDate))) return
      if (!blocked(next)) {
        pendingFocus.current = true
        setFocused(next)
        if (startMonth(next).getTime() !== month.getTime()) setVisibleMonth(next)
        return
      }
    }
  }
  const previous = addMonths(month, -1)
  const next = addMonths(month, 1)
  const previousDisabled = disabled === true || !!(minDate && addDays(month, -1) < day(minDate))
  const nextDisabled = disabled === true || !!(maxDate && next > day(maxDate))
  return <div {...props} ref={root} data-slot="calendar" data-events={!!cellContent} className={cn('zc-calendar', className)}>
    <div data-slot="calendar-header">
      <div id={heading} aria-live="polite">{new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'long' }).format(month)}</div>
      <div className="flex gap-1">
        <Button type="button" size="icon-sm" variant="ghost" aria-label={labels.previousMonth} disabled={previousDisabled}
          onClick={() => { setVisibleMonth(previous); setFocused(previous) }}><ChevronLeftIcon /></Button>
        <Button type="button" size="icon-sm" variant="ghost" aria-label={labels.nextMonth} disabled={nextDisabled}
          onClick={() => { setVisibleMonth(next); setFocused(next) }}><ChevronRightIcon /></Button>
      </div>
    </div>
    <table role="grid" aria-labelledby={heading}>
      <thead><tr>{dates.slice(0, 7).map(date => <th key={dateKey(date)} scope="col"
        aria-label={new Intl.DateTimeFormat(locale, { weekday: 'long' }).format(date)}>
        {new Intl.DateTimeFormat(locale, { weekday: 'short' }).format(date)}
      </th>)}</tr></thead>
      <tbody>{Array.from({ length: 6 }, (_, week) => <tr key={week}>
        {dates.slice(week * 7, week * 7 + 7).map(date => <td role="gridcell" key={dateKey(date)} aria-selected={sameDay(active, date)}>
          <button type="button" data-day={dateKey(date)} disabled={blocked(date)}
            className="outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
            data-outside={date.getMonth() !== month.getMonth()} data-selected={sameDay(active, date)}
            aria-current={sameDay(new Date(), date) ? 'date' : undefined}
            aria-label={new Intl.DateTimeFormat(locale, { dateStyle: 'full' }).format(date)}
            tabIndex={sameDay(focusDate, date) ? 0 : -1}
            onFocus={() => setFocused(date)}
            onClick={() => {
              if (value === undefined) setSelected(date)
              onValueChange?.(date)
              if (date.getMonth() !== month.getMonth()) setVisibleMonth(date)
            }}
            onKeyDown={event => {
              const weekday = (date.getDay() - weekStartsOn + 7) % 7
              const targets: Record<string, Date> = {
                ArrowLeft: addDays(date, -1), ArrowRight: addDays(date, 1),
                ArrowUp: addDays(date, -7), ArrowDown: addDays(date, 7),
                Home: addDays(date, -weekday), End: addDays(date, 6 - weekday),
                PageUp: addMonths(date, event.shiftKey ? -12 : -1),
                PageDown: addMonths(date, event.shiftKey ? 12 : 1),
              }
              if (event.key in targets) {
                event.preventDefault()
                moveFocus(targets[event.key], targets[event.key] < date ? -1 : 1)
              }
            }}>
            <span>{date.getDate()}</span>{cellContent?.(date)}
          </button>
        </td>)}
      </tr>)}</tbody>
    </table>
  </div>
}
