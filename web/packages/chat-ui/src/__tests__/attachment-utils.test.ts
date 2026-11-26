import { describe, expect, it } from 'vitest'

import { browserMimeType, formatAttachmentSize, largeImageBoxStyle } from '../attachments/utils'

describe('attachments/utils', () => {
  it('formats attachment sizes with one KB decimal (byte-identical to the app util)', () => {
    expect(formatAttachmentSize(512)).toBe('512 B')
    expect(formatAttachmentSize(2048)).toBe('2.0 KB')
    expect(formatAttachmentSize(3 * 1024 * 1024)).toBe('3.0 MB')
  })

  it('returns null box style when dimensions are unknown', () => {
    expect(largeImageBoxStyle({})).toBeNull()
    expect(largeImageBoxStyle({ width: 0, height: 10 })).toBeNull()
  })

  it('computes a reserved box from dimensions', () => {
    const style = largeImageBoxStyle({ width: 200, height: 100 })
    expect(style).not.toBeNull()
    expect(style!.width).toBe(200)
    expect(style!.aspectRatio).toBe('200 / 100')
  })

  it('returns the lowercased mime for supported containers and undefined otherwise', () => {
    expect(browserMimeType('audio/mpeg')).toBe('audio/mpeg') // supported → NOT undefined (pins the mapping)
    expect(browserMimeType('video/mp4')).toBe('video/mp4')
    expect(browserMimeType('audio/x-weird')).toBeUndefined() // unsupported container
    expect(browserMimeType(undefined)).toBeUndefined()
  })
})
