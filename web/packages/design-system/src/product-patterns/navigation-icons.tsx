export function TooltipArrowRightIcon({ className = 'block' }: { className?: string }) {
  return (
    <svg width="6" height="16" viewBox="0 0 6 16" className={className}>
      <path
        d="M 6 0 C 6 1 5.2 2.5 4.1 3.6 L 1.1 6.6 C 0.5 7.2 0.5 8.8 1.1 9.4 L 4.1 12.4 C 5.2 13.5 6 15 6 16 Z"
        className="fill-ecap-tooltip-bg"
      />
    </svg>
  )
}

export function TooltipArrowDownIcon({ className = 'block' }: { className?: string }) {
  return (
    <svg width="16" height="6" viewBox="0 0 16 6" className={className}>
      <path
        d="M 0 6 C 1 6 2.5 5.2 3.6 4.1 L 6.6 1.1 C 7.2 0.5 8.8 0.5 9.4 1.1 L 12.4 4.1 C 13.5 5.2 15 6 16 6 Z"
        className="fill-ecap-tooltip-bg"
      />
    </svg>
  )
}

// Inverse of TooltipArrowDownIcon — apex points up (used when the tooltip
// sits below the trigger and the arrow needs to point up at the trigger).
export function TooltipArrowUpIcon({ className = 'block' }: { className?: string }) {
  return (
    <svg width="16" height="6" viewBox="0 0 16 6" className={className}>
      <path
        d="M 0 0 C 1 0 2.5 0.8 3.6 1.9 L 6.6 4.9 C 7.2 5.5 8.8 5.5 9.4 4.9 L 12.4 1.9 C 13.5 0.8 15 0 16 0 Z"
        className="fill-ecap-tooltip-bg"
      />
    </svg>
  )
}

export function SidebarPanelIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <rect x="3.75" y="3.75" width="16.5" height="16.5" rx="2.25" />
      <path d="M9 4v16" />
    </svg>
  )
}
