'use client'

import * as React from 'react'

const focusableSelector = [
  'button',
  'input',
  'select',
  'textarea',
  'a[href]',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

export function FocusModalityProvider({ children }: React.PropsWithChildren) {
  React.useEffect(() => {
    const pointerTargets = new Set<HTMLElement>()

    const clearPointerTargets = () => {
      pointerTargets.forEach((target) => target.removeAttribute('data-zc-focus-modality'))
      pointerTargets.clear()
    }

    const markPointerTarget = (target: HTMLElement) => {
      pointerTargets.add(target)
      target.setAttribute('data-zc-focus-modality', 'pointer')
    }

    const handlePointerDown = (event: PointerEvent) => {
      document.documentElement.setAttribute('data-zc-input-modality', 'pointer')
      const eventTarget = event.target instanceof Element ? event.target : null
      const isOverlayInteraction = Boolean(
        eventTarget?.closest('[data-slot$="-content"], [data-slot$="-overlay"]'),
      )

      if (!isOverlayInteraction) {
        const activeElement = document.activeElement
        const retainedPointerTarget = activeElement instanceof HTMLElement && pointerTargets.has(activeElement)
          ? activeElement
          : null
        clearPointerTargets()

        // Cancelled pointer events may leave focus unchanged. Restore only an
        // existing pointer marker so retained keyboard focus stays visible.
        if (retainedPointerTarget) markPointerTarget(retainedPointerTarget)
      }

      const target = eventTarget?.closest<HTMLElement>(focusableSelector)
      if (!target) return

      markPointerTarget(target)
    }

    const handleFocusIn = (event: FocusEvent) => {
      if (document.documentElement.getAttribute('data-zc-input-modality') !== 'pointer') return

      const eventTarget = event.target instanceof Element ? event.target : null
      const target = eventTarget?.closest<HTMLElement>(focusableSelector)
      if (!target) return

      markPointerTarget(target)
    }

    const handleKeyDown = () => {
      document.documentElement.setAttribute('data-zc-input-modality', 'keyboard')
      clearPointerTargets()
    }

    const handleFocusOut = (event: FocusEvent) => {
      if (!(event.target instanceof HTMLElement)) return
      event.target.removeAttribute('data-zc-focus-modality')
      pointerTargets.delete(event.target)
    }

    document.addEventListener('pointerdown', handlePointerDown, true)
    document.addEventListener('focusin', handleFocusIn, true)
    document.addEventListener('focusout', handleFocusOut, true)
    document.addEventListener('keydown', handleKeyDown, true)

    return () => {
      clearPointerTargets()
      document.documentElement.removeAttribute('data-zc-input-modality')
      document.removeEventListener('pointerdown', handlePointerDown, true)
      document.removeEventListener('focusin', handleFocusIn, true)
      document.removeEventListener('focusout', handleFocusOut, true)
      document.removeEventListener('keydown', handleKeyDown, true)
    }
  }, [])

  return children
}
