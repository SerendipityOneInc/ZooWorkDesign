import { VideoCameraIcon } from '@heroicons/react/24/outline'
import { memo } from 'react'

import type { VideoCard as VideoCardType } from '../types'
import { browserMimeType } from '../utils'

export const VideoCard = memo(function VideoCard({ card }: { card: VideoCardType }) {
  return (
    <div className="border-border bg-card min-w-[280px] overflow-hidden rounded-lg border">
      {card.title && (
        <div className="border-border flex items-center gap-2 border-b px-3 py-2">
          <VideoCameraIcon className="text-muted-foreground h-4 w-4 shrink-0" />
          <span className="text-foreground truncate text-sm font-medium">{card.title}</span>
        </div>
      )}
      <div className="p-3">
        <video controls className="w-full rounded" poster={card.poster} width={card.width} height={card.height}>
          <source src={card.src} type={browserMimeType(card.mimeType)} />
        </video>
      </div>
    </div>
  )
})
