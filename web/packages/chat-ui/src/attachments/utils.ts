import type React from 'react'

export function formatAttachmentSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

const LARGE_IMAGE_MAX_H = 320

/**
 * Compute the exact display box for a large image using the server-reported
 * intrinsic dimensions, so we can reserve that space in the layout *before*
 * the blob finishes loading. Returns `null` when dimensions are unknown
 * (falls back to the old CSS-only sizing).
 *
 * This is the fix for the "switching agents scrolls to an old message then
 * flashes to bottom" bug: when chat messages contain images, the placeholder
 * and the eventually-loaded <img> had different heights, so the initial
 * scroll-to-bottom ran against a too-short scrollHeight. By pinning the box
 * to the final dimensions from the start, there is no layout shift to chase.
 */
export function largeImageBoxStyle(dims: { width?: number; height?: number }): React.CSSProperties | null {
  const w = dims.width
  const h = dims.height
  if (!w || !h || w <= 0 || h <= 0) return null

  const scale = h > LARGE_IMAGE_MAX_H ? LARGE_IMAGE_MAX_H / h : 1
  const displayW = Math.round(w * scale)
  const displayH = Math.round(h * scale)

  // `width` pins the preferred width; `maxWidth: 100%` lets a narrow parent
  // bubble shrink it, and `aspect-ratio` keeps the height proportional in
  // that case so we never distort the image or stretch the placeholder.
  return {
    width: displayW,
    height: 'auto',
    aspectRatio: `${displayW} / ${displayH}`,
    maxWidth: '100%',
    maxHeight: displayH,
  }
}

// Chrome natively supports these media MIME types in <video>/<audio>.
// For unsupported container types (quicktime, avi, mkv…) that typically carry
// browser-decodable codecs (H.264/AAC), we return undefined so the browser
// attempts playback via codec sniffing instead of rejecting the <source> outright.

const BROWSER_VIDEO_TYPES = new Set(['video/mp4', 'video/webm', 'video/ogg'])
const BROWSER_AUDIO_TYPES = new Set([
  'audio/mpeg',
  'audio/mp4',
  'audio/ogg',
  'audio/wav',
  'audio/webm',
  'audio/aac',
  'audio/flac',
])

export function browserMimeType(mime: string | undefined): string | undefined {
  if (!mime) return undefined
  const lower = mime.toLowerCase()
  if (BROWSER_VIDEO_TYPES.has(lower) || BROWSER_AUDIO_TYPES.has(lower)) return lower
  return undefined
}
