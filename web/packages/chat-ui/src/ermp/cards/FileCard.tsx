import { ArrowDownTrayIcon, DocumentIcon } from '@heroicons/react/24/outline'
import { memo } from 'react'

import type { FileCard as FileCardType } from '../types'
import { formatFileSize } from '../utils'

function fileIconColor(mimeType?: string): string {
  if (!mimeType) return 'text-muted-foreground'
  if (mimeType.startsWith('application/pdf')) return 'text-destructive'
  if (mimeType.startsWith('image/')) return 'text-primary'
  if (mimeType.startsWith('video/')) return 'text-primary'
  if (mimeType.startsWith('audio/')) return 'text-primary'
  if (mimeType.includes('zip') || mimeType.includes('compressed') || mimeType.includes('archive'))
    return 'text-muted-foreground'
  return 'text-muted-foreground'
}

export const FileCard = memo(function FileCard({ card }: { card: FileCardType }) {
  return (
    <a
      href={card.src}
      download
      target="_blank"
      rel="noopener noreferrer"
      className="border-border bg-card hover:bg-accent flex min-w-[220px] items-center gap-3 rounded-lg border px-3 py-2.5 transition-colors"
    >
      {/* File icon */}
      <DocumentIcon className={`h-5 w-5 shrink-0 ${fileIconColor(card.mimeType)}`} />

      {/* Name and size */}
      <div className="min-w-0 flex-1">
        <p className="text-foreground truncate text-sm font-medium">{card.name}</p>
        {card.size != null && <p className="text-muted-foreground text-xs">{formatFileSize(card.size)}</p>}
      </div>

      {/* Download icon */}
      <ArrowDownTrayIcon className="text-muted-foreground h-4 w-4 shrink-0" />
    </a>
  )
})
