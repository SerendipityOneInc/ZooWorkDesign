'use client'

import { useEffect, useId, useLayoutEffect, useRef, useState, type ComponentProps, type ReactNode } from 'react'
import { cn } from '../lib/cn'

export type SplitterProps = Omit<ComponentProps<'div'>, 'children' | 'onChange'> & {
  first: ReactNode
  second: ReactNode
  orientation?: 'horizontal' | 'vertical'
  /** Percentage allocated to the first panel, clamped by both pixel minimums. */
  value?: number
  defaultValue?: number
  onValueChange?: (value: number) => void
  minFirst?: number
  minSecond?: number
  disabled?: boolean
  resizeLabel?: string
}

/** Interaction extracted from AgentWorkspaceSplit; content and routing stay with the host. */
export function Splitter({
  first, second, orientation = 'horizontal', value, defaultValue = 50, onValueChange,
  minFirst = 360, minSecond = 360, disabled = false, resizeLabel = 'Resize panels',
  className, style, ...props
}: SplitterProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [uncontrolled, setUncontrolled] = useState(defaultValue)
  const [extent, setExtent] = useState(0)
  const [dragging, setDragging] = useState(false)
  const drag = useRef<{ start: number; size: number; pointer: number } | null>(null)
  const separator = useRef<HTMLDivElement>(null)
  const id = useId()
  const horizontal = orientation === 'horizontal'
  const requested = Math.max(0, Math.min(100, value ?? uncontrolled))
  const sum = Math.max(0, minFirst) + Math.max(0, minSecond)
  const scale = extent && sum > extent ? extent / sum : 1
  const lower = extent ? Math.max(0, minFirst) * scale / extent * 100 : 0
  const upper = extent ? 100 - Math.max(0, minSecond) * scale / extent * 100 : 100
  const position = Math.min(upper, Math.max(lower, requested))

  useLayoutEffect(() => {
    const root = ref.current
    if (!root) return
    const measure = () => setExtent(horizontal ? root.clientWidth : root.clientHeight)
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(root)
    return () => observer.disconnect()
  }, [horizontal])

  const stop = () => {
    const pointer = drag.current?.pointer
    drag.current = null
    setDragging(false)
    if (pointer !== undefined && separator.current?.hasPointerCapture(pointer))
      separator.current.releasePointerCapture(pointer)
  }
  useEffect(() => {
    window.addEventListener('blur', stop)
    return () => window.removeEventListener('blur', stop)
  }, [])
  useEffect(() => { if (disabled) stop() }, [disabled])

  const update = (next: number) => {
    const bounded = Math.min(upper, Math.max(lower, next))
    if (value === undefined) setUncontrolled(bounded)
    onValueChange?.(bounded)
  }
  return (
    <div {...props} ref={ref} data-slot="splitter" data-orientation={orientation}
      data-dragging={dragging} className={cn('zc-splitter', className)}
      style={{ ...style, gridTemplateColumns: horizontal ? `${position}% minmax(0,1fr)` : undefined,
        gridTemplateRows: horizontal ? undefined : `${position}% minmax(0,1fr)` }}>
      <div id={id + '-first'} data-slot="splitter-panel">{first}</div>
      <div id={id + '-second'} data-slot="splitter-panel">{second}</div>
      <div ref={separator} data-slot="splitter-handle" role="separator"
        className="outline-none"
        tabIndex={disabled ? -1 : 0} aria-disabled={disabled || undefined}
        aria-label={resizeLabel} aria-orientation={horizontal ? 'vertical' : 'horizontal'}
        aria-controls={id + '-first ' + id + '-second'}
        aria-valuemin={Math.round(lower)} aria-valuemax={Math.round(upper)} aria-valuenow={Math.round(position)}
        style={horizontal ? { left: position + '%' } : { top: position + '%' }}
        onPointerDown={(event) => {
          if (disabled || event.button !== 0) return
          event.preventDefault()
          event.currentTarget.blur()
          drag.current = { start: horizontal ? event.clientX : event.clientY, size: position, pointer: event.pointerId }
          event.currentTarget.setPointerCapture(event.pointerId)
          setDragging(true)
        }}
        onPointerMove={(event) => {
          if (!drag.current || !extent || disabled) return
          const rect = ref.current?.getBoundingClientRect()
          const renderedExtent = (horizontal ? rect?.width : rect?.height) || extent
          update(drag.current.size + ((horizontal ? event.clientX : event.clientY) - drag.current.start) / renderedExtent * 100)
        }}
        onPointerUp={stop} onPointerCancel={stop} onLostPointerCapture={stop}
        onDoubleClick={() => { if (!disabled) update(defaultValue) }}
        onKeyDown={(event) => {
          if (disabled) return
          const step = extent ? 24 / extent * 100 : 5
          const values: Record<string, number> = {
            [horizontal ? 'ArrowLeft' : 'ArrowUp']: position - step,
            [horizontal ? 'ArrowRight' : 'ArrowDown']: position + step,
            Home: lower, End: upper,
          }
          if (event.key in values) {
            event.preventDefault()
            update(values[event.key])
          }
        }}><span aria-hidden="true" /><span data-slot="splitter-highlight" aria-hidden="true" /></div>
    </div>
  )
}
