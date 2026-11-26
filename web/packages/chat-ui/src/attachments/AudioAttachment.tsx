'use client'

import { MusicalNoteIcon } from '@heroicons/react/24/outline'

import { browserMimeType, formatAttachmentSize } from './utils'
import type { AttachmentView } from './types'

export function AudioAttachment({ view }: { view: AttachmentView }) {
  const blobURL = view.url

  return (
    <div className="border-border bg-card min-w-[280px] overflow-hidden rounded-lg border">
      <div className="border-border flex items-center gap-2 border-b px-3 py-2">
        <MusicalNoteIcon className="text-muted-foreground h-4 w-4 shrink-0" />
        <span className="text-foreground truncate text-sm font-medium">{view.name}</span>
        {view.size != null && (
          <span className="text-muted-foreground ml-auto shrink-0 text-xs">{formatAttachmentSize(view.size)}</span>
        )}
      </div>
      <div className="p-3">
        {blobURL ? (
          <audio data-testid="genclaw-mm-audio-attachment" controls className="w-full">
            <source src={blobURL} type={browserMimeType(view.mimeType)} />
          </audio>
        ) : (
          <div className="bg-muted h-[54px] animate-pulse rounded" />
        )}
      </div>
    </div>
  )
}
