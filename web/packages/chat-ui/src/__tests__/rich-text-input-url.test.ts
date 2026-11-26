// @vitest-environment jsdom
/**
 * Unit tests for the URL display/markdown utilities behind RichTextInput.
 *
 * Historically this spec asserted against a vendored copy of `truncateUrl`
 * because the helper was module-private inside RichTextInput.tsx (and the
 * copy had drifted from the real implementation). After the F20 decomposition
 * the real functions are importable from composer/editor/markdown-text, so
 * the tests now exercise the production code directly.
 */
import { describe, expect, it } from 'vitest'

import {
  containsMediaMarkdown,
  containsUrl,
  convertUrlsToLinkMarkdown,
} from '../composer/editor/markdown-text'

describe('RichTextInput — URL chip markdown format', () => {
  it('produces a standard markdown link, not an image', () => {
    const url = 'https://example.com/image.jpg'
    const markdown = convertUrlsToLinkMarkdown(url)
    expect(markdown).toBe(`[${url}](${url})`)
    expect(markdown).toMatch(/^\[.+\]\(https?:\/\/.+\)$/)
    expect(markdown.startsWith('!')).toBe(false)
  })

  it('keeps the complete long URL in both display text and target', () => {
    const url = 'https://uimg2.iminsp.com/user_upload/20260225/2e3936b7-very-long-path.png'
    const markdown = convertUrlsToLinkMarkdown(url)
    expect(markdown).toBe(`[${url}](${url})`)
  })

  it('converts every bare URL in mixed text', () => {
    const text = 'see https://a.com and https://b.com/x'
    const result = convertUrlsToLinkMarkdown(text)
    expect(result).toBe('see [https://a.com](https://a.com) and [https://b.com/x](https://b.com/x)')
  })
})

describe('RichTextInput — URL/markdown detection', () => {
  it('containsUrl detects bare http(s) URLs only', () => {
    expect(containsUrl('go to https://example.com now')).toBe(true)
    expect(containsUrl('no links here')).toBe(false)
  })

  it('containsMediaMarkdown detects image, video and link syntax', () => {
    expect(containsMediaMarkdown('![alt](https://x.com/a.png)')).toBe(true)
    expect(containsMediaMarkdown('[video:clip](https://x.com/v.mp4)')).toBe(true)
    expect(containsMediaMarkdown('[text](https://x.com)')).toBe(true)
    expect(containsMediaMarkdown('plain text')).toBe(false)
  })
})
