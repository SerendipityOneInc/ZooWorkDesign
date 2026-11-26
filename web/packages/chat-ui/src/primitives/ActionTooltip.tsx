'use client'

export interface ActionTooltipProps {
  label: string
  children: React.ReactNode
}

/** Ant-Design-style tooltip that appears below the trigger on hover. */
export function ActionTooltip({ label, children }: ActionTooltipProps) {
  return (
    <div className="group/tip relative inline-flex">
      {children}
      <div className="pointer-events-none absolute top-full left-1/2 z-50 mt-1.5 -translate-x-1/2 opacity-0 transition-opacity duration-200 group-hover/tip:opacity-100">
        <div className="bg-ecap-tooltip-bg text-ecap-tooltip-text relative rounded-md px-2 py-1 text-[12px] leading-[1.4] whitespace-nowrap shadow-md">
          {label}
          {/* Arrow */}
          <span className="border-b-ecap-tooltip-bg absolute bottom-full left-1/2 -translate-x-1/2 border-4 border-transparent" />
        </div>
      </div>
    </div>
  )
}
