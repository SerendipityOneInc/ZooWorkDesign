'use client'

import { AnimatePresence, motion, useIsPresent } from 'motion/react'
import * as React from 'react'
import { useMediaQuery } from 'usehooks-ts'

import { cx } from '../utils'

type Panel = 'models' | 'settings'

/** Keep the popover anchored while its content crossfades and its dimensions settle. */
export const ModelPickerPanelTransition = React.forwardRef<
  HTMLDivElement,
  Omit<React.ComponentProps<typeof motion.div>, 'children'> & { panel: Panel; searching: boolean; tall: boolean; children: React.ReactNode }
>(function ModelPickerPanelTransition({ panel, searching, tall, children, ...props }, ref) {
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)', { defaultValue: true, initializeWithValue: false })
  const [heights, setHeights] = React.useState<Partial<Record<Panel, number>>>({})
  const recordHeight = React.useCallback((view: Panel, height: number) => {
    if (height > 0) setHeights((previous) => previous[view] === height ? previous : { ...previous, [view]: height })
  }, [])

  return (
    <motion.div
      {...props}
      ref={ref}
      initial={false}
      animate={{ width: panel === 'settings' ? 304 : 276, height: heights[panel] ?? heights.models ?? 'auto' }}
      transition={{ duration: reducedMotion ? 0 : 0.22, ease: [0.16, 1, 0.3, 1] }}
    >
      <AnimatePresence initial={false} mode="popLayout" custom={panel === 'settings' ? 1 : -1}>
        <PanelFrame
          key={panel}
          panel={panel}
          tall={tall}
          reducedMotion={reducedMotion}
          lockedHeight={panel === 'models' && searching ? heights.models : undefined}
          onHeight={recordHeight}
        >
          {children}
        </PanelFrame>
      </AnimatePresence>
    </motion.div>
  )
})

const PanelFrame = React.forwardRef<HTMLDivElement, {
  panel: Panel
  tall: boolean
  reducedMotion: boolean
  lockedHeight?: number
  onHeight: (panel: Panel, height: number) => void
  children: React.ReactNode
}>(function PanelFrame({ panel, tall, reducedMotion, lockedHeight, onHeight, children }, ref) {
  const isPresent = useIsPresent()
  const elementRef = React.useRef<HTMLDivElement>(null)
  React.useImperativeHandle(ref, () => elementRef.current!, [])
  React.useLayoutEffect(() => {
    const element = elementRef.current
    if (!element || !isPresent) return
    const measure = () => onHeight(panel, element.offsetHeight)
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(element)
    return () => observer.disconnect()
  }, [isPresent, onHeight, panel])

  return (
    <motion.div
      ref={elementRef}
      aria-hidden={!isPresent || undefined}
      inert={!isPresent || undefined}
      className={cx(
        'flex w-full shrink-0 flex-col',
        panel === 'settings' ? 'p-2' : 'p-1',
        tall
          ? 'max-h-[min(29rem,var(--radix-dropdown-menu-content-available-height))]'
          : 'max-h-[min(20.5rem,var(--radix-dropdown-menu-content-available-height))]',
      )}
      style={{ height: lockedHeight }}
      variants={{
        exit: (direction: number) => ({ opacity: 0, x: reducedMotion ? 0 : direction * -8 }),
      }}
      initial={{ opacity: 0, x: reducedMotion ? 0 : panel === 'settings' ? 8 : -8 }}
      animate={{ opacity: 1, x: 0 }}
      exit="exit"
      transition={{ duration: reducedMotion ? 0 : 0.16, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
})
