'use client'

import { Fragment } from 'react'
import type React from 'react'

import { ScrollableImageRow } from './ScrollableImageRow'
import type { AttachmentGalleryItem } from './types'

export function AttachmentGallery({
  items,
  size = 'small',
  align = 'start',
  renderItem,
}: {
  items: AttachmentGalleryItem[]
  size?: 'small' | 'large'
  align?: 'start' | 'end'
  renderItem: (item: AttachmentGalleryItem, size: 'small' | 'large') => React.ReactNode
}) {
  if (items.length === 0) return null

  // Audio/video stay stacked; images + files go in the scrollable row (parity
  // with the previous MMAttachments split, now keyed on AttachmentKind).
  const rowItems = items.filter((i) => i.kind === 'image' || i.kind === 'file')
  const mediaItems = items.filter((i) => i.kind === 'audio' || i.kind === 'video')

  return (
    <div className="flex flex-col gap-2">
      {rowItems.length > 0 && (
        <ScrollableImageRow items={rowItems} size={size} align={align} renderItem={renderItem} />
      )}
      {/* Package owns the key so callers don't key inside renderItem. */}
      {mediaItems.map((item) => (
        <Fragment key={item.id}>{renderItem(item, size)}</Fragment>
      ))}
    </div>
  )
}
