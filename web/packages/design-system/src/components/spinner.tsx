/*!
 * Portions adapted from shadcn/ui (MIT). Copyright (c) 2023 shadcn.
 * Modified for ZooWork. See THIRD_PARTY_NOTICES.md and third-party/SOURCE_ATTRIBUTION.md.
 */
// No 'use client' — presentational, RSC-compatible.
import * as React from 'react'

import { cn } from '../lib/cn'

// A clean circular loading spinner (faint full ring + a bright quarter arc),
// drawn in currentColor so it inherits the surrounding text color. Replaces a
// refresh-arrows glyph, which read as spinning arrows rather than "loading".
function Spinner({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <svg
      data-slot="spinner"
      role="status"
      aria-label="Loading"
      viewBox="0 0 24 24"
      fill="none"
      className={cn('size-4 animate-spin', className)}
      {...props}
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" strokeWidth="2.5" />
      <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  )
}

export { Spinner }
