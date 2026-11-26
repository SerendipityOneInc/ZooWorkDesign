'use client'

import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { Fragment, useEffect, useRef, useState } from 'react'

export function ScrollableImageRow<T extends { id: string }>({
  items,
  size = 'small',
  align = 'start',
  renderItem,
}: {
  items: T[]
  size?: 'small' | 'large'
  align?: 'start' | 'end'
  renderItem: (item: T, size: 'small' | 'large') => React.ReactNode
}) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState(false)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const updateScrollState = () => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 0)
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1)
  }

  useEffect(() => {
    updateScrollState()
  }, [items.length])

  const scroll = (dir: 'left' | 'right') => {
    const el = scrollRef.current
    if (!el) return
    el.scrollBy({ left: dir === 'left' ? -200 : 200, behavior: 'smooth' })
  }

  return (
    <div
      className="relative max-w-full min-w-0"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="overflow-hidden">
        <div
          ref={scrollRef}
          className={`flex ${align === 'end' ? 'justify-end' : 'justify-start'} [scrollbar-width:none] gap-2 overflow-x-auto`}
          onScroll={updateScrollState}
        >
          {items.map((item) => (
            <Fragment key={item.id}>{renderItem(item, size)}</Fragment>
          ))}
        </div>
      </div>
      {hovered && canScrollLeft && (
        <button
          type="button"
          onClick={() => scroll('left')}
          className="bg-background/90 border-border absolute top-1/2 left-1 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border shadow-sm"
        >
          <ChevronLeftIcon className="h-4 w-4" />
        </button>
      )}
      {hovered && canScrollRight && (
        <button
          type="button"
          onClick={() => scroll('right')}
          className="bg-background/90 border-border absolute top-1/2 right-1 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border shadow-sm"
        >
          <ChevronRightIcon className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}
