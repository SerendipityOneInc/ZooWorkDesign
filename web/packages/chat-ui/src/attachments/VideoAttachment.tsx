'use client'

import { VideoCard } from './VideoCard'
import type { AttachmentView } from './types'

export function VideoAttachment({
  view,
  onPreview,
}: {
  view: AttachmentView
  onPreview?: (v: AttachmentView) => void
}) {
  const blobURL = view.url

  const handleClick = () => {
    if (view.url) onPreview?.(view)
  }

  if (!blobURL) {
    return <div className="bg-muted h-[180px] w-[180px] shrink-0 animate-pulse rounded-xl" />
  }

  return <VideoCard src={blobURL} name={view.name} onClick={onPreview ? handleClick : undefined} />
}
