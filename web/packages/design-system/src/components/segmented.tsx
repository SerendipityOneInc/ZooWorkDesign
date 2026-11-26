'use client'

import type { ComponentProps, ReactNode } from 'react'
import { RadioGroup } from 'radix-ui'
import { cn } from '../lib/cn'
import { useSelectionIndicator } from './selection-indicator'

export interface SegmentedOption {
  value: string
  label: ReactNode
  icon?: ReactNode
  disabled?: boolean
  /** Required when label is an icon without visible text. */
  'aria-label'?: string
}

export type SegmentedProps = Omit<ComponentProps<typeof RadioGroup.Root>, 'children'> & {
  options: readonly (string | SegmentedOption)[]
  size?: 'sm' | 'md' | 'lg'
  block?: boolean
  shape?: 'default' | 'round'
}

/** A single value selector. Use Tabs when selection reveals an associated panel. */
export function Segmented({
  options, size = 'md', block = false, shape = 'default', orientation = 'horizontal',
  className, ref: forwardedRef, ...props
}: SegmentedProps) {
  const { ref, ready, indicator } = useSelectionIndicator('[role="radio"][data-state="checked"]')
  return (
    <RadioGroup.Root
      {...props}
      ref={(node) => {
        ref.current = node
        if (typeof forwardedRef === 'function') return forwardedRef(node)
        if (forwardedRef) forwardedRef.current = node
      }}
      data-slot="segmented"
      data-moving-indicator={ready}
      data-size={size}
      data-block={block}
      data-shape={shape}
      orientation={orientation}
      className={cn('zc-segmented zc-selection-group', className)}
    >
      {indicator}
      {options.map((entry) => {
        const option = typeof entry === 'string' ? { value: entry, label: entry } : entry
        return (
          <RadioGroup.Item key={option.value} value={option.value} disabled={option.disabled}
            className="zc-selection-item outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            aria-label={option['aria-label']} data-slot="segmented-item">
            {option.icon}{option.label}
          </RadioGroup.Item>
        )
      })}
    </RadioGroup.Root>
  )
}
