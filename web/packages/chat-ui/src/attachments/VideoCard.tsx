'use client'

import { PlayCircleIcon } from '@heroicons/react/24/solid'

/** Shared video card for chat & replay attachments: <video> preview + play overlay. */
export function VideoCard({ src, name, onClick }: { src: string; name: string; onClick?: () => void }) {
  const content = (
    <>
      <video
        data-testid="genclaw-mm-video-attachment"
        src={src}
        preload="metadata"
        muted
        playsInline
        className="block max-h-[240px] max-w-[240px]"
      />
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/30 transition-colors group-hover:bg-black/50">
        <PlayCircleIcon className="h-12 w-12 text-white drop-shadow-lg" />
      </div>
    </>
  )

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        data-testid="genclaw-mm-video-attachment-card"
        className="group relative w-fit shrink-0 cursor-pointer overflow-hidden rounded-xl"
        title={name}
        aria-label={`Play video ${name}`}
      >
        {content}
      </button>
    )
  }

  return (
    <div
      data-testid="genclaw-mm-video-attachment-card"
      className="group relative w-fit shrink-0 overflow-hidden rounded-xl"
      title={name}
    >
      {content}
    </div>
  )
}
