'use client'

import { useLayoutEffect, useRef, useState } from 'react'

type Bounds = { left: number; top: number; width: number; height: number; revision: number }

/** Track the real selected control, including font, content and container resizes. */
export function useSelectionIndicator(selector: string, variant: 'default' | 'line' = 'default', lineOffset = 0) {
  const ref = useRef<HTMLDivElement>(null)
  const [bounds, setBounds] = useState<Bounds | null>(null)
  useLayoutEffect(() => {
    const root = ref.current
    if (!root) return
    let alive = true
    let previousActive: HTMLElement | null = null
    let revision = 0
    const measure = () => {
      if (!alive) return
      const active = root.querySelector<HTMLElement>(selector)
      const box = active?.getBoundingClientRect()
      if (!active || !box || !box.width || !box.height) {
        setBounds((previous) => (previous === null ? previous : null))
        return
      }
      const parent = root.getBoundingClientRect()
      // DOMRects include ancestor scaling; indicator CSS coordinates do not.
      const scaleX = root.offsetWidth ? parent.width / root.offsetWidth : 1
      const scaleY = root.offsetHeight ? parent.height / root.offsetHeight : 1
      const vertical = root.dataset.orientation === 'vertical'
      if (active !== previousActive) revision += 1
      previousActive = active
      const next = {
        left: (box.left - parent.left) / scaleX + root.scrollLeft - root.clientLeft,
        top: (box.top - parent.top) / scaleY + root.scrollTop - root.clientTop,
        width: box.width / scaleX,
        height: box.height / scaleY,
        revision,
      }
      if (variant === 'line') {
        const label = active.querySelector<HTMLElement>('[data-slot="selection-label"]')?.getBoundingClientRect()
        if (vertical) {
          next.left += box.width / scaleX + 2
          next.width = 2
          if (label?.height) {
            next.top = (label.top - parent.top) / scaleY + root.scrollTop - root.clientTop
            next.height = label.height / scaleY
          }
        } else {
          next.top += box.height / scaleY - 2 + lineOffset
          next.height = 2
          if (label?.width) {
            next.left = (label.left - parent.left) / scaleX + root.scrollLeft - root.clientLeft
            next.width = label.width / scaleX
          }
        }
      }
      setBounds((previous) =>
        previous && Object.keys(next).every((key) => previous[key as keyof Bounds] === next[key as keyof Bounds])
          ? previous
          : next,
      )
    }
    const resize = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(measure) : null
    const observeSizes = () => {
      resize?.disconnect()
      resize?.observe(root)
      root.querySelectorAll<HTMLElement>('[role="tab"], button').forEach((element) => resize?.observe(element))
    }
    const mutations = new MutationObserver(() => {
      observeSizes()
      measure()
    })
    mutations.observe(root, {
      subtree: true,
      childList: true,
      characterData: true,
      attributes: true,
      attributeFilter: ['data-state', 'aria-pressed', 'data-orientation'],
    })
    observeSizes()
    measure()
    window.addEventListener('resize', measure)
    document.fonts?.ready.then(measure)
    return () => {
      alive = false
      mutations.disconnect()
      resize?.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [selector, variant, lineOffset])
  return {
    ref,
    ready: bounds !== null,
    indicator: bounds && (
      <span
        key={variant === 'line' ? bounds.revision : 'moving-surface'}
        data-slot="selection-indicator"
        data-variant={variant}
        aria-hidden="true"
        style={{ left: bounds.left, top: bounds.top, width: bounds.width, height: bounds.height }}
      />
    ),
  }
}
