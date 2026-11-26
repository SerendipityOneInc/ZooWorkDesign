import { afterEach, describe, expect, it, vi } from 'vitest'

import { createMediaElement } from '../composer/editor/chip-elements'
import { editorToMarkdown, tryUpdateUploadingMedia } from '../composer/editor/markdown-dom'

afterEach(() => {
  document.body.replaceChildren()
  vi.restoreAllMocks()
})

describe('image composer chips', () => {
  it('shows the local photo and filename while uploading, with an accessible busy state', () => {
    const chip = createMediaElement('holiday-photo.jpg', 'uploading:one', 'image', {
      getUploadPreview: () => 'blob:local-photo',
    })
    expect(chip.querySelector('img')?.src).toBe('blob:local-photo')
    expect(chip.textContent).toBe('holiday-photo.jpg')
    expect(chip.getAttribute('aria-busy')).toBe('true')
    expect(chip.querySelector('[data-upload-status]')).not.toBeNull()
    expect(chip.textContent).not.toContain('📷')
  })

  it('opens a larger preview on hover and keyboard focus, then dismisses it', () => {
    const chip = createMediaElement('photo.jpg', 'https://example.com/photo.jpg', 'image', {})
    document.body.appendChild(chip)
    const preview = chip.querySelector('[popover]') as HTMLElement
    const show = vi.fn()
    const hide = vi.fn()
    preview.showPopover = show
    preview.hidePopover = hide
    chip.dispatchEvent(new MouseEvent('mouseenter'))
    expect(show).toHaveBeenCalledOnce()
    expect(preview.querySelector('img')?.src).toBe('https://example.com/photo.jpg')
    chip.dispatchEvent(new MouseEvent('mouseleave'))
    expect(hide).toHaveBeenCalledOnce()
    chip.dispatchEvent(new FocusEvent('focus'))
    expect(show).toHaveBeenCalledTimes(2)
    chip.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    expect(hide).toHaveBeenCalledTimes(2)
  })

  it('falls back to a full render when repeated filenames make incremental matching ambiguous', () => {
    const editor = document.createElement('div')
    editor.appendChild(createMediaElement('photo.jpg', 'https://example.com/old.jpg', 'image', {}))
    editor.appendChild(createMediaElement('photo.jpg', 'uploading:two', 'image', {}))
    expect(
      tryUpdateUploadingMedia(
        editor,
        '![photo.jpg](https://example.com/old.jpg) ![photo.jpg](https://example.com/new.jpg)',
        {},
      ),
    ).toBe(false)
  })

  it('replaces the local preview after upload without serializing preview markup', () => {
    const editor = document.createElement('div')
    editor.appendChild(
      createMediaElement('photo.jpg', 'uploading:one', 'image', { getUploadPreview: () => 'blob:local' }),
    )
    const markdown = '![photo.jpg](https://example.com/photo.jpg)'
    expect(tryUpdateUploadingMedia(editor, markdown, {})).toBe(true)
    expect(editor.querySelector('[aria-busy]')).toBeNull()
    expect(editor.querySelector('img')?.src).toBe('https://example.com/photo.jpg')
    expect(editorToMarkdown(editor)).toBe(markdown)
  })
})
