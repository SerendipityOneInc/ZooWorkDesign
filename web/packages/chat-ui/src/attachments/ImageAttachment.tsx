'use client'

import { largeImageBoxStyle } from './utils'
import type { AttachmentView } from './types'

export function ImageAttachment({
  view,
  size = 'small',
  onPreview,
}: {
  view: AttachmentView
  size?: 'small' | 'large'
  onPreview?: (v: AttachmentView) => void
}) {
  const blobURL = view.url

  const handleClick = () => {
    if (view.url) onPreview?.(view)
  }

  // Only the `large` variant needs dimension reservation: `small` is a fixed
  // 80x80 cover-cropped thumbnail whose layout box is already stable.
  const boxStyle = size === 'large' ? largeImageBoxStyle(view) : null

  // Fallback classes used when dimensions are unknown (old behavior).
  const fallbackCls = boxStyle
    ? ''
    : size === 'large'
      ? 'h-auto max-h-[320px] w-auto min-w-[120px]'
      : 'h-[80px] w-[80px]'

  if (!blobURL) {
    return (
      <div
        data-testid="genclaw-mm-image-attachment-loading"
        className={`bg-muted shrink-0 animate-pulse rounded-xl ${fallbackCls}`.trim()}
        style={boxStyle ?? undefined}
      />
    )
  }

  return (
    <img
      data-testid="genclaw-mm-image-attachment"
      src={blobURL}
      alt={view.name}
      className={`shrink-0 ${onPreview ? 'cursor-pointer ' : ''}rounded-xl object-cover object-center ${fallbackCls}`.trim()}
      style={boxStyle ?? undefined}
      onClick={onPreview ? handleClick : undefined}
    />
  )
}
