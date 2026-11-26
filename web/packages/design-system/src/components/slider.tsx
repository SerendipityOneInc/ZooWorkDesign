'use client'

/*!
 * Portions adapted from shadcn/ui (MIT). Copyright (c) 2023 shadcn.
 * Modified for ZooWork. See THIRD_PARTY_NOTICES.md and third-party/SOURCE_ATTRIBUTION.md.
 */

import * as React from 'react'
import { Slider as SliderPrimitive } from 'radix-ui'

import { cn } from '../lib/cn'

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  thumbProps,
  rangeProps,
  ...props
}: React.ComponentProps<typeof SliderPrimitive.Root> & {
  thumbProps?: React.ComponentProps<typeof SliderPrimitive.Thumb>
  rangeProps?: React.ComponentProps<typeof SliderPrimitive.Range>
}) {
  const _values = React.useMemo(
    () => (Array.isArray(value) ? value : Array.isArray(defaultValue) ? defaultValue : [min, max]),
    [value, defaultValue, min, max],
  )

  return (
    <SliderPrimitive.Root
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      className={cn(
        'relative flex w-full touch-none items-center select-none data-disabled:opacity-50 data-vertical:h-full data-vertical:min-h-40 data-vertical:w-auto data-vertical:flex-col',
        className,
      )}
      {...props}
    >
      <SliderPrimitive.Track
        data-slot="slider-track"
        className="bg-muted relative grow overflow-hidden rounded-full data-horizontal:h-1 data-horizontal:w-full data-vertical:h-full data-vertical:w-1"
      >
        <SliderPrimitive.Range
          {...rangeProps}
          data-slot="slider-range"
          className={cn('bg-primary absolute select-none data-horizontal:h-full data-vertical:w-full', rangeProps?.className)}
        />
      </SliderPrimitive.Track>
      {Array.from({ length: _values.length }, (_, index) => (
        <SliderPrimitive.Thumb
          {...thumbProps}
          data-slot="slider-thumb"
          key={index}
          className={cn(
            'border-primary ring-ring/35 relative block size-3.5 shrink-0 rounded-full border bg-white transition-[color,box-shadow] select-none after:absolute after:-inset-2 hover:ring-3 focus-visible:ring-3 focus-visible:outline-hidden active:ring-3 disabled:pointer-events-none disabled:opacity-50',
            thumbProps?.className,
          )}
        />
      ))}
    </SliderPrimitive.Root>
  )
}

export { Slider }
