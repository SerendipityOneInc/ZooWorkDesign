import { MusicalNoteIcon } from '@heroicons/react/24/outline'
import { memo } from 'react'

import type { AudioCard as AudioCardType } from '../types'
import { browserMimeType, formatDuration } from '../utils'

export const AudioCard = memo(function AudioCard({ card }: { card: AudioCardType }) {
  return (
    <div className="border-border bg-card min-w-[280px] overflow-hidden rounded-lg border">
      {(card.title || card.duration != null) && (
        <div className="border-border flex items-center gap-2 border-b px-3 py-2">
          <MusicalNoteIcon className="text-muted-foreground h-4 w-4 shrink-0" />
          {card.title && <span className="text-foreground truncate text-sm font-medium">{card.title}</span>}
          {card.duration != null && (
            <span className="text-muted-foreground ml-auto shrink-0 text-xs">{formatDuration(card.duration)}</span>
          )}
        </div>
      )}
      <div className="p-3">
        <audio controls className="w-full">
          <source src={card.src} type={browserMimeType(card.mimeType)} />
        </audio>
      </div>
    </div>
  )
})
