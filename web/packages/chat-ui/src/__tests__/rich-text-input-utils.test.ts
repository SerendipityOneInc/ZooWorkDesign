import { describe, expect, it } from 'vitest'

import { determineSyncStrategy, findUploadedMediaUrl } from '../composer/editor/utils'

// ---------------------------------------------------------------------------
// findUploadedMediaUrl
// ---------------------------------------------------------------------------
describe('findUploadedMediaUrl', () => {
  describe('image type', () => {
    it('finds uploaded image URL by alt text', () => {
      const md = 'Hello ![photo](https://cdn.example.com/img.png) world'
      expect(findUploadedMediaUrl(md, 'photo', 'image')).toBe('https://cdn.example.com/img.png')
    })

    it('skips uploading: placeholder URLs', () => {
      const md = '![photo](uploading:abc123) ![photo](https://cdn.example.com/real.png)'
      expect(findUploadedMediaUrl(md, 'photo', 'image')).toBe('https://cdn.example.com/real.png')
    })

    it('returns null when only uploading URLs exist', () => {
      const md = '![photo](uploading:abc123)'
      expect(findUploadedMediaUrl(md, 'photo', 'image')).toBeNull()
    })

    it('returns null when alt text does not match', () => {
      const md = '![other](https://cdn.example.com/img.png)'
      expect(findUploadedMediaUrl(md, 'photo', 'image')).toBeNull()
    })

    it('returns null for empty markdown', () => {
      expect(findUploadedMediaUrl('', 'photo', 'image')).toBeNull()
    })

    it('handles special regex characters in alt text', () => {
      const md = '![file (1).png](https://cdn.example.com/img.png)'
      expect(findUploadedMediaUrl(md, 'file (1).png', 'image')).toBe('https://cdn.example.com/img.png')
    })

    it('handles alt text with brackets', () => {
      const md = '![test[1]](https://cdn.example.com/img.png)'
      expect(findUploadedMediaUrl(md, 'test[1]', 'image')).toBe('https://cdn.example.com/img.png')
    })

    it('returns first non-uploading URL when multiple matches', () => {
      const md = '![img](uploading:a) ![img](https://first.com/a.png) ![img](https://second.com/b.png)'
      expect(findUploadedMediaUrl(md, 'img', 'image')).toBe('https://first.com/a.png')
    })
  })

  describe('video type', () => {
    it('finds uploaded video URL by alt text', () => {
      const md = '[video:clip](https://cdn.example.com/vid.mp4)'
      expect(findUploadedMediaUrl(md, 'clip', 'video')).toBe('https://cdn.example.com/vid.mp4')
    })

    it('skips uploading: placeholder for video', () => {
      const md = '[video:clip](uploading:xyz) [video:clip](https://cdn.example.com/real.mp4)'
      expect(findUploadedMediaUrl(md, 'clip', 'video')).toBe('https://cdn.example.com/real.mp4')
    })

    it('returns null when no video match', () => {
      const md = '![clip](https://cdn.example.com/img.png)'
      expect(findUploadedMediaUrl(md, 'clip', 'video')).toBeNull()
    })

    it('does not confuse image and video syntax', () => {
      const md = '![clip](https://cdn.example.com/img.png) [video:clip](https://cdn.example.com/vid.mp4)'
      // Looking for video type should only find video syntax
      expect(findUploadedMediaUrl(md, 'clip', 'video')).toBe('https://cdn.example.com/vid.mp4')
      // Looking for image type should only find image syntax
      expect(findUploadedMediaUrl(md, 'clip', 'image')).toBe('https://cdn.example.com/img.png')
    })
  })

  describe('link type', () => {
    it('finds the resolved URL for a non-image file placeholder', () => {
      const md = '[archive.zip](uploading:tmp-1) [archive.zip](https://cdn.example.com/archive.zip)'
      expect(findUploadedMediaUrl(md, 'archive.zip', 'link')).toBe('https://cdn.example.com/archive.zip')
    })

    it('does not confuse an image with a file link that has the same label', () => {
      const md = '![report.pdf](https://cdn.example.com/preview.png) [report.pdf](https://cdn.example.com/report.pdf)'
      expect(findUploadedMediaUrl(md, 'report.pdf', 'link')).toBe('https://cdn.example.com/report.pdf')
    })
  })
})

// ---------------------------------------------------------------------------
// determineSyncStrategy
// ---------------------------------------------------------------------------
describe('determineSyncStrategy', () => {
  it('returns skip when composing (IME active)', () => {
    expect(
      determineSyncStrategy({
        isComposing: true,
        hasUploadingElements: false,
        partialUpdateSucceeded: false,
        markdownAfterPartialUpdate: '',
        targetValue: 'anything',
      }),
    ).toBe('skip')
  })

  it('returns skip when composing even with uploading elements', () => {
    expect(
      determineSyncStrategy({
        isComposing: true,
        hasUploadingElements: true,
        partialUpdateSucceeded: true,
        markdownAfterPartialUpdate: 'different',
        targetValue: 'target',
      }),
    ).toBe('skip')
  })

  it('returns skip when partial update succeeded and markdown matches', () => {
    const value = '![img](https://cdn.example.com/real.png)'
    expect(
      determineSyncStrategy({
        isComposing: false,
        hasUploadingElements: true,
        partialUpdateSucceeded: true,
        markdownAfterPartialUpdate: value,
        targetValue: value,
      }),
    ).toBe('skip')
  })

  it('returns rebuild when partial update succeeded but markdown differs', () => {
    expect(
      determineSyncStrategy({
        isComposing: false,
        hasUploadingElements: true,
        partialUpdateSucceeded: true,
        markdownAfterPartialUpdate: 'result markdown',
        targetValue: 'target markdown',
      }),
    ).toBe('rebuild')
  })

  it('returns rebuild when no uploading elements', () => {
    expect(
      determineSyncStrategy({
        isComposing: false,
        hasUploadingElements: false,
        partialUpdateSucceeded: false,
        markdownAfterPartialUpdate: '',
        targetValue: 'new value',
      }),
    ).toBe('rebuild')
  })

  it('returns rebuild when uploading elements exist but partial update failed', () => {
    expect(
      determineSyncStrategy({
        isComposing: false,
        hasUploadingElements: true,
        partialUpdateSucceeded: false,
        markdownAfterPartialUpdate: '',
        targetValue: 'new value',
      }),
    ).toBe('rebuild')
  })
})
