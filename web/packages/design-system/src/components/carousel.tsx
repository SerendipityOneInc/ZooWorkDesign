'use client'

import { Children, useRef, useState, type ComponentProps, type ReactNode } from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/16/solid'
import { Button } from './button'
import { cn } from '../lib/cn'

export type CarouselProps = Omit<ComponentProps<'section'>, 'onChange'> & {
  children: ReactNode
  index?: number
  defaultIndex?: number
  onIndexChange?: (index: number) => void
  loop?: boolean
  labels?: { previous: string; next: string; slide: (index: number, total: number) => string; carousel: string }
}

/** Explicit navigation by default; no surprise automatic movement or focus changes. */
export function Carousel({
  children, index: controlled, defaultIndex = 0, onIndexChange, loop = false, className,
  labels = { previous: 'Previous slide', next: 'Next slide', slide: (i, n) => `Slide ${i} of ${n}`, carousel: 'Carousel' },
  ...props
}: CarouselProps) {
  const slides = Children.toArray(children)
  const [local, setLocal] = useState(defaultIndex)
  const touch = useRef<{ x: number; y: number } | null>(null)
  const swiped = useRef(false)
  const index = Math.max(0, Math.min(slides.length - 1, controlled ?? local))
  const go = (next: number) => {
    if (!slides.length) return
    const bounded = loop ? (next + slides.length) % slides.length : Math.max(0, Math.min(slides.length - 1, next))
    if (controlled === undefined) setLocal(bounded)
    if (index !== bounded) onIndexChange?.(bounded)
  }
  return <section aria-label={labels.carousel} {...props} data-slot="carousel"
    aria-roledescription={labels.carousel} className={cn('zc-carousel', className)}>
    <div data-slot="carousel-viewport" tabIndex={slides.length > 1 ? 0 : undefined}
      className="outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
      onKeyDown={event => {
        swiped.current = false
        if (event.target !== event.currentTarget) return
        const target: Record<string, number> = { ArrowLeft: index - 1, ArrowRight: index + 1, Home: 0, End: slides.length - 1 }
        if (event.key in target) { event.preventDefault(); go(target[event.key]) }
      }}
      onPointerDown={event => {
        swiped.current = false
        if (event.pointerType === 'touch') touch.current = { x: event.clientX, y: event.clientY }
      }}
      onClickCapture={event => {
        if (swiped.current) { event.preventDefault(); event.stopPropagation(); swiped.current = false }
      }}
      onPointerCancel={() => { touch.current = null }}
      onPointerUp={event => {
        if (!touch.current) return
        const dx = event.clientX - touch.current.x
        const dy = event.clientY - touch.current.y
        touch.current = null
        if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy)) {
          swiped.current = true
          go(index + (dx < 0 ? 1 : -1))
        }
      }}>
      <div data-slot="carousel-track" style={{ transform: `translateX(-${index * 100}%)` }}>
        {slides.map((slide, i) => <div key={i} data-slot="carousel-slide" role="group"
          aria-label={labels.slide(i + 1, slides.length)} aria-hidden={i !== index} inert={i !== index}>
          {slide}
        </div>)}
      </div>
    </div>
    {slides.length > 1 && <div data-slot="carousel-controls">
      <Button type="button" size="icon-sm" variant="outline" aria-label={labels.previous}
        disabled={!loop && index === 0} onClick={() => go(index - 1)}><ChevronLeftIcon /></Button>
      <div data-slot="carousel-dots">{slides.map((_, i) =>
        <button key={i} type="button" aria-label={labels.slide(i + 1, slides.length)}
          className="outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-current={i === index ? 'true' : undefined} onClick={() => go(i)}>
          <span aria-hidden="true" />
        </button>)}</div>
      <span className="sr-only" role="status">{labels.slide(index + 1, slides.length)}</span>
      <Button type="button" size="icon-sm" variant="outline" aria-label={labels.next}
        disabled={!loop && index === slides.length - 1} onClick={() => go(index + 1)}><ChevronRightIcon /></Button>
    </div>}
  </section>
}
