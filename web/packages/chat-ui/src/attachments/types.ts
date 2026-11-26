export type AttachmentKind = 'image' | 'video' | 'audio' | 'file'

export interface AttachmentView {
  id: string
  kind: AttachmentKind
  /** Resolved, directly-renderable URL (object URL / signed URL). `null` = loading. */
  url: string | null
  name: string
  mimeType: string
  size?: number
  /** Server-reported natural dimensions → reserved box (image). */
  width?: number
  height?: number
  /** File kind: whether an in-app preview affordance should be offered. */
  previewable?: boolean
}

export interface AttachmentGalleryItem {
  id: string
  kind: AttachmentKind
}

export type AttachmentSize = 'small' | 'large'
export type AttachmentAlign = 'start' | 'end'
