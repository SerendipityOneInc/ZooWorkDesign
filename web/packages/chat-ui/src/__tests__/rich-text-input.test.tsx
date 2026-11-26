// @vitest-environment jsdom
/**
 * Comprehensive unit tests for RichTextInput. Complements the focused
 * RichTextInput.paste.unit.spec.tsx (large-paste-to-file branch only) by
 * covering the rest of the surface: markdown↔editor sync, chip rendering,
 * keyboard handling, drag-drop, IME composition, and click handlers.
 */
import { act, cleanup, fireEvent, render, within } from '@testing-library/react'
import { createRef, type ComponentProps } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { RichTextInput, type RichTextInputHandle } from '../index'
import { renderMarkdownIntoEditor } from '../composer/editor/markdown-dom'

afterEach(cleanup)

// --- helpers ----------------------------------------------------------------

type Props = ComponentProps<typeof RichTextInput>

function renderInput(overrides: Partial<Props> = {}) {
  const onChange = vi.fn()
  const onFileDrop = vi.fn()
  const onSubmit = vi.fn()
  const onImagePreview = vi.fn()
  const onEmptyImageClick = vi.fn()
  const onKeyDown = vi.fn()
  const onCompositionStart = vi.fn()
  const onCompositionEnd = vi.fn()
  const result = render(
    <RichTextInput
      value=""
      onChange={onChange}
      onFileDrop={onFileDrop}
      onSubmit={onSubmit}
      onImagePreview={onImagePreview}
      onEmptyImageClick={onEmptyImageClick}
      onKeyDown={onKeyDown}
      onCompositionStart={onCompositionStart}
      onCompositionEnd={onCompositionEnd}
      {...overrides}
    />,
  )
  const editor = result.getByTestId('rich-text-input') as HTMLDivElement
  return {
    ...result,
    editor,
    onChange,
    onFileDrop,
    onSubmit,
    onImagePreview,
    onEmptyImageClick,
    onKeyDown,
    onCompositionStart,
    onCompositionEnd,
  }
}

/**
 * jsdom's ClipboardEvent ignores `clipboardData` in init. Build a bubbling
 * Event and attach a fake clipboardData via defineProperty so React's
 * delegated paste listener can read it via nativeEvent.clipboardData.
 */
function firePaste(target: HTMLElement, opts: { plainText?: string; html?: string; files?: File[] } = {}): void {
  const types: string[] = []
  if (opts.plainText !== undefined) types.push('text/plain')
  if (opts.html !== undefined) types.push('text/html')
  const clipboardData = {
    getData: (type: string) => {
      if (type === 'text/plain') return opts.plainText ?? ''
      if (type === 'text/html') return opts.html ?? ''
      return ''
    },
    files: (opts.files ?? []) as unknown as FileList,
    items: [] as unknown as DataTransferItemList,
    types,
  }
  const event = new Event('paste', { bubbles: true, cancelable: true })
  Object.defineProperty(event, 'clipboardData', { value: clipboardData })
  target.dispatchEvent(event)
}

function fireDrop(target: HTMLElement, files: File[]): void {
  const dataTransfer = {
    files: files as unknown as FileList,
    items: [] as unknown as DataTransferItemList,
    types: ['Files'],
    getData: () => '',
  }
  const event = new Event('drop', { bubbles: true, cancelable: true })
  Object.defineProperty(event, 'dataTransfer', { value: dataTransfer })
  target.dispatchEvent(event)
}

function placeCursorAtEnd(node: Node): void {
  const range = document.createRange()
  range.selectNodeContents(node)
  range.collapse(false)
  const sel = window.getSelection()
  sel?.removeAllRanges()
  sel?.addRange(range)
}

function selectText(editor: HTMLElement, text: string): void {
  const walker = document.createTreeWalker(editor, NodeFilter.SHOW_TEXT)
  let node = walker.nextNode()
  while (node) {
    const content = node.textContent ?? ''
    const start = content.indexOf(text)
    if (start !== -1) {
      const range = document.createRange()
      range.setStart(node, start)
      range.setEnd(node, start + text.length)
      const selection = window.getSelection()
      selection?.removeAllRanges()
      selection?.addRange(range)
      return
    }
    node = walker.nextNode()
  }
  throw new Error(`Could not select text: ${text}`)
}

// --- tests ------------------------------------------------------------------

describe('RichTextInput — render basics', () => {
  it('restores a saved selection for command insertion and focuses the editor', () => {
    const commandRef = createRef<RichTextInputHandle>()
    const { editor, onChange } = renderInput({
      value: 'before selected after',
      commandRef,
    })
    selectText(editor, 'selected')
    fireEvent.blur(editor)

    act(() => commandRef.current?.insertMarkdown('Use search to…'))

    expect(onChange).toHaveBeenLastCalledWith('before Use search to… after')
    expect(document.activeElement).toBe(editor)
  })

  it('falls back to the end when the saved selection became stale', () => {
    const commandRef = createRef<RichTextInputHandle>()
    const { editor, onChange, rerender } = renderInput({
      value: 'first value',
      commandRef,
    })
    selectText(editor, 'first')
    fireEvent.blur(editor)
    rerender(<RichTextInput value="replacement" onChange={onChange} commandRef={commandRef} />)

    act(() => commandRef.current?.insertMarkdown(' appended'))

    expect(onChange).toHaveBeenLastCalledWith('replacement appended')
    expect(document.activeElement).toBe(editor)
  })

  it('can focus the editor with the caret explicitly moved to the end', () => {
    const commandRef = createRef<RichTextInputHandle>()
    const { editor } = renderInput({ value: 'editable starter draft', commandRef })
    selectText(editor, 'starter')
    fireEvent.blur(editor)

    act(() => commandRef.current!.focusAtEnd())

    const selection = window.getSelection()
    const range = selection!.getRangeAt(0)
    const contentAfterCaret = document.createRange()
    contentAfterCaret.selectNodeContents(editor)
    contentAfterCaret.setStart(range.endContainer, range.endOffset)

    expect(document.activeElement).toBe(editor)
    expect(contentAfterCaret.toString()).toBe('')
  })

  it('can preserve word boundaries when a command inserts at the end', () => {
    const commandRef = createRef<RichTextInputHandle>()
    const { editor, onChange } = renderInput({ value: 'hello', commandRef })
    placeCursorAtEnd(editor)
    fireEvent.blur(editor)

    act(() => commandRef.current?.insertMarkdown('Create a skill', { ensureBoundarySpaces: true }))

    expect(onChange).toHaveBeenLastCalledWith('hello Create a skill')
  })

  it('can preserve both word boundaries when replacing a tight selection', () => {
    const commandRef = createRef<RichTextInputHandle>()
    const { editor, onChange } = renderInput({ value: 'beforeSELECTEDafter', commandRef })
    selectText(editor, 'SELECTED')
    fireEvent.blur(editor)

    act(() => commandRef.current?.insertMarkdown('replacement', { ensureBoundarySpaces: true }))

    expect(onChange).toHaveBeenLastCalledWith('before replacement after')
  })

  it('renders a contentEditable div with rich-text-input testid', () => {
    const { editor } = renderInput()
    expect(editor.tagName).toBe('DIV')
    expect(editor.getAttribute('contenteditable')).toBe('true')
  })

  it('exposes multiline textbox semantics with an accessible name', () => {
    const { editor } = renderInput({ ariaLabel: 'Message ZooClaw', placeholder: 'Type here…' })

    expect(editor.getAttribute('role')).toBe('textbox')
    expect(editor.getAttribute('aria-multiline')).toBe('true')
    expect(editor.getAttribute('aria-label')).toBe('Message ZooClaw')
  })

  it('marks the editor non-editable when disabled', () => {
    const { editor } = renderInput({ disabled: true })
    expect(editor.getAttribute('contenteditable')).toBe('false')
    expect(editor.getAttribute('aria-disabled')).toBe('true')
  })

  it('forwards className and suppresses the focus outline', () => {
    const { editor } = renderInput({ className: 'my-custom-cls' })
    expect(editor.className).toContain('my-custom-cls')
    // Outline suppression moved from inline style to the Tailwind utility —
    // outline-none is the focus-ring contract, not styling ordering.
    expect(editor.className).toContain('outline-none')
  })

  it('sets data-placeholder on the empty editor', () => {
    const { editor } = renderInput({ placeholder: 'Type here…' })
    expect(editor.getAttribute('data-placeholder')).toBe('Type here…')
  })

  it('removes data-placeholder once the value contains text', () => {
    const { editor, rerender } = renderInput({ placeholder: 'Type here…' })
    rerender(<RichTextInput value="hello" onChange={vi.fn()} placeholder="Type here…" />)
    // useEffect runs after render — assert via the editor textContent
    expect(editor.textContent).toContain('hello')
    expect(editor.getAttribute('data-placeholder')).toBeNull()
  })
})

describe('RichTextInput — markdown → editor sync', () => {
  it('renders malformed media markers without polynomial slowdown', () => {
    const editor = document.createElement('div')
    const malformedMarker = '![' + '\\'
    const markdown = '![' + malformedMarker.repeat(20_000)

    const startedAt = performance.now()
    renderMarkdownIntoEditor(editor, markdown, {})
    const elapsedMs = performance.now() - startedAt

    expect(editor.textContent).toBe(markdown)
    expect(elapsedMs).toBeLessThan(1_000)
  })

  it('renders plain text as a text node', () => {
    const { editor } = renderInput({ value: 'hello world' })
    expect(editor.textContent).toBe('hello world')
  })

  it('renders an image markdown chip with thumbnail img', () => {
    const { editor } = renderInput({
      value: '![my-photo.png](https://cdn.example.com/p.png)',
    })
    const chip = editor.querySelector('.rich-text-media') as HTMLElement
    expect(chip).not.toBeNull()
    expect(chip.getAttribute('data-type')).toBe('image')
    expect(chip.getAttribute('data-url')).toBe('https://cdn.example.com/p.png')
    expect(chip.getAttribute('data-alt')).toBe('my-photo.png')
    const img = chip.querySelector('img')
    expect(img?.getAttribute('src')).toBe('https://cdn.example.com/p.png')
  })

  it('renders a video markdown chip with 🎬 icon (no img)', () => {
    const { editor } = renderInput({
      value: '[video:clip.mp4](https://cdn.example.com/c.mp4)',
    })
    const chip = editor.querySelector('.rich-text-media') as HTMLElement
    expect(chip.getAttribute('data-type')).toBe('video')
    expect(chip.querySelector('img')).toBeNull()
    expect(chip.textContent).toContain('🎬')
  })

  it('renders a web link as a complete, clickable anchor', () => {
    const url = `https://docs.example.com/${'long-path-'.repeat(8)}`
    const { editor } = renderInput({
      value: `[${url}](${url})`,
    })
    const chip = editor.querySelector('.rich-text-media') as HTMLElement
    expect(chip.getAttribute('data-type')).toBe('link')
    expect(chip.tagName).toBe('A')
    expect(chip.getAttribute('href')).toBe(url)
    expect(chip.getAttribute('target')).toBe('_blank')
    expect(chip.getAttribute('rel')).toBe('noopener noreferrer')
    expect((chip as HTMLAnchorElement).tabIndex).toBe(0)
    expect(chip.textContent).toBe(url)
    expect(chip.className).toContain('break-all')
  })

  it('keeps a bare file URL complete instead of mistaking it for an attachment card', () => {
    const url = 'https://cdn.example.com/reports/quarterly-report.pdf'
    const { editor } = renderInput({ value: `[${url}](${url})` })
    const link = editor.querySelector('a') as HTMLAnchorElement
    expect(link.textContent).toBe(url)
    expect(link.getAttribute('data-file-reference')).toBeNull()
    expect(link.className).toContain('break-all')
  })

  it('renders a labeled file URL as a compact inline chip', () => {
    const url = 'https://cdn.example.com/quarterly-report.xlsx'
    const { editor } = renderInput({
      value: `[季度经营报告.xlsx](${url})`,
    })
    const card = editor.querySelector('[data-file-reference="true"]') as HTMLElement
    const link = within(card).getByRole('link')
    expect(link).toHaveAttribute('href', url)
    expect(link).toHaveAttribute('target', '_blank')
    expect(link.tabIndex).toBe(0)
    expect(link.querySelector('button')).toBeNull()
    expect(card.className).toContain('h-7')
    expect(card.className).toContain('rounded-[6px]')
    expect(card.querySelector('[data-file-type-badge="true"]')?.textContent).toBe('XLSX')
    expect(card.querySelector('[data-file-name="true"]')?.textContent).toBe('季度经营报告.xlsx')
    expect(card.querySelector('[data-upload-status="true"]')).toBeNull()
  })

  it('renders a non-image upload placeholder with a spinner and an accessible localized status', () => {
    const { editor } = renderInput({
      value: '[归档.zip](uploading:tmp-1)',
      uploadingAttachmentLabel: '上传中…',
    })
    const card = editor.querySelector('[data-file-reference="true"]') as HTMLElement
    expect(card.tagName).toBe('SPAN')
    expect(card.getAttribute('data-uploading')).toBe('true')
    expect(card.getAttribute('aria-busy')).toBe('true')
    expect(card.getAttribute('aria-label')).toBe('归档.zip, 上传中…')
    expect(card.className).not.toContain('animate-pulse')
    expect(card.querySelector('[data-file-type-badge="true"]')?.textContent).toBe('ZIP')
    expect(card.querySelector('[data-file-name="true"]')?.textContent).toBe('归档.zip')
    expect(card.querySelector('[data-upload-status="true"]')?.textContent).toBe('')
    expect(card.querySelector('.animate-spin')).not.toBeNull()
  })

  it('uses the app-owned attachment icon inside a file reference card', () => {
    const createFileReferenceIcon = vi.fn((filename: string) => {
      const icon = document.createElement('span')
      icon.setAttribute('data-sprite-icon', filename.endsWith('.xlsx') ? 'sheet' : 'file')
      return icon
    })
    const { editor } = renderInput({
      value: '[季度经营报告.xlsx](uploading:tmp-1)',
      createFileReferenceIcon,
    })

    const card = editor.querySelector('[data-file-reference="true"]') as HTMLElement
    expect(createFileReferenceIcon).toHaveBeenCalledWith('季度经营报告.xlsx')
    expect(card.querySelector('[data-file-type-icon="true"] [data-sprite-icon="sheet"]')).not.toBeNull()
    expect(card.querySelector('[data-file-type-badge="true"]')).toBeNull()
  })

  it('keeps a labeled non-file web link as normal link text', () => {
    const { editor } = renderInput({ value: '[产品文档](https://docs.example.com/start)' })
    const link = editor.querySelector('a') as HTMLAnchorElement
    expect(link.textContent).toBe('产品文档')
    expect(link.getAttribute('data-file-reference')).toBeNull()
    expect(link.className).toContain('underline')
  })

  it('falls back to "image1" / "image2" alt when alt is empty', () => {
    const { editor } = renderInput({
      value: '![](https://a.test/1.png)![](https://a.test/2.png)',
    })
    const chips = editor.querySelectorAll('.rich-text-media')
    expect(chips).toHaveLength(2)
    expect(chips[0].getAttribute('data-alt')).toBe('image1')
    expect(chips[1].getAttribute('data-alt')).toBe('image2')
  })

  it('renders mixed text and chips inline', () => {
    const { editor } = renderInput({
      value: 'before ![pic](https://t.test/x.png) middle [link](https://t.test) after',
    })
    expect(editor.textContent).toContain('before')
    expect(editor.textContent).toContain('middle')
    expect(editor.textContent).toContain('after')
    const chips = editor.querySelectorAll('.rich-text-media')
    expect(chips).toHaveLength(2)
    expect(chips[0].getAttribute('data-type')).toBe('image')
    expect(chips[1].getAttribute('data-type')).toBe('link')
  })

  it('renders newlines as <br> elements', () => {
    const { editor } = renderInput({ value: 'line1\nline2\nline3' })
    expect(editor.querySelectorAll('br')).toHaveLength(2)
  })

  it('keeps the filename for an empty-URL image placeholder', () => {
    const { editor } = renderInput({ value: '![placeholder]()' })
    const chip = editor.querySelector('.rich-text-media') as HTMLElement
    expect(chip.querySelector('img')).toBeNull()
    expect(chip.textContent).toBe('placeholder')
  })

  it('renders an uploading chip with its filename and a busy state', () => {
    const { editor } = renderInput({
      value: '![pic](uploading:tmp-1)',
    })
    const chip = editor.querySelector('.rich-text-media') as HTMLElement
    expect(chip.getAttribute('aria-busy')).toBe('true')
    expect(chip.textContent).toBe('pic')
    expect(chip.querySelector('img')).toBeNull()
  })

  it('preserves a full filename for the width-constrained chip label', () => {
    const longAlt = 'this-is-an-extremely-long-filename-that-should-truncate.pdf'
    const { editor } = renderInput({
      value: `![${longAlt}](https://t.test/x.pdf)`,
    })
    const chip = editor.querySelector('.rich-text-media') as HTMLElement
    const labelSpan = chip.querySelector('[data-chip-label]') as HTMLElement
    expect(labelSpan.textContent).toBe(longAlt)
  })
})

describe('RichTextInput — editor → markdown (input event)', () => {
  it('emits onChange with editor text content on input', () => {
    const { editor, onChange } = renderInput()
    editor.appendChild(document.createTextNode('hello'))
    fireEvent.input(editor)
    expect(onChange).toHaveBeenCalled()
    expect(onChange.mock.calls.at(-1)?.[0]).toBe('hello')
  })

  it('round-trips an image chip back to markdown when the editor input fires', () => {
    const { editor, onChange } = renderInput({
      value: '![pic.png](https://t.test/x.png)',
    })
    fireEvent.input(editor)
    expect(onChange).toHaveBeenCalled()
    expect(onChange.mock.calls.at(-1)?.[0]).toBe('![pic.png](https://t.test/x.png)')
  })

  it('round-trips a video chip back to markdown', () => {
    const { editor, onChange } = renderInput({
      value: '[video:clip.mp4](https://t.test/c.mp4)',
    })
    fireEvent.input(editor)
    expect(onChange.mock.calls.at(-1)?.[0]).toBe('[video:clip.mp4](https://t.test/c.mp4)')
  })

  it('round-trips a link chip back to markdown', () => {
    const { editor, onChange } = renderInput({
      value: '[Docs](https://docs.test)',
    })
    fireEvent.input(editor)
    expect(onChange.mock.calls.at(-1)?.[0]).toBe('[Docs](https://docs.test)')
  })

  it('serialises BR elements as newlines in the markdown output', () => {
    const { editor, onChange } = renderInput({ value: 'a\nb' })
    fireEvent.input(editor)
    expect(onChange.mock.calls.at(-1)?.[0]).toBe('a\nb')
  })
})

describe('RichTextInput — paste: file branch', () => {
  it('routes accepted image files to onFileDrop and prevents default', () => {
    const { editor, onFileDrop } = renderInput({ acceptFileTypes: 'image/*' })
    const file = new File(['x'], 'photo.png', { type: 'image/png' })
    firePaste(editor, { files: [file] })
    expect(onFileDrop).toHaveBeenCalledTimes(1)
    expect(onFileDrop.mock.calls[0][0][0].name).toBe('photo.png')
  })

  it('drops unsupported file types silently (no onFileDrop call)', () => {
    const { editor, onFileDrop } = renderInput({ acceptFileTypes: 'image/*' })
    const file = new File(['x'], 'doc.pdf', { type: 'application/pdf' })
    firePaste(editor, { files: [file] })
    expect(onFileDrop).not.toHaveBeenCalled()
  })

  it('filters mixed file types — keeps accepted, drops unaccepted', () => {
    const { editor, onFileDrop } = renderInput({ acceptFileTypes: 'image/*' })
    const ok = new File(['x'], 'photo.png', { type: 'image/png' })
    const bad = new File(['x'], 'doc.pdf', { type: 'application/pdf' })
    firePaste(editor, { files: [ok, bad] })
    expect(onFileDrop).toHaveBeenCalledTimes(1)
    const accepted = onFileDrop.mock.calls[0][0] as File[]
    expect(accepted).toHaveLength(1)
    expect(accepted[0].name).toBe('photo.png')
  })

  it('does not throw when no onFileDrop prop is provided', () => {
    const { editor } = renderInput({ onFileDrop: undefined })
    const file = new File(['x'], 'photo.png', { type: 'image/png' })
    expect(() => firePaste(editor, { files: [file] })).not.toThrow()
  })

  it('accepts video by the image/* + video/* default acceptFileTypes', () => {
    const { editor, onFileDrop } = renderInput()
    const file = new File(['x'], 'clip.mp4', { type: 'video/mp4' })
    firePaste(editor, { files: [file] })
    expect(onFileDrop).toHaveBeenCalledTimes(1)
  })

  it('accepts an exact MIME match (e.g. application/pdf)', () => {
    const { editor, onFileDrop } = renderInput({ acceptFileTypes: 'application/pdf' })
    const file = new File(['x'], 'a.pdf', { type: 'application/pdf' })
    firePaste(editor, { files: [file] })
    expect(onFileDrop).toHaveBeenCalledTimes(1)
  })

  it('accepts files by extension (e.g. .pdf) when MIME type is missing', () => {
    const { editor, onFileDrop } = renderInput({ acceptFileTypes: '.pdf' })
    const file = new File(['x'], 'doc.PDF', { type: '' })
    firePaste(editor, { files: [file] })
    expect(onFileDrop).toHaveBeenCalledTimes(1)
  })

  it('accepts everything when acceptFileTypes is */*', () => {
    const { editor, onFileDrop } = renderInput({ acceptFileTypes: '*/*' })
    const file = new File(['x'], 'whatever.bin', { type: 'application/octet-stream' })
    firePaste(editor, { files: [file] })
    expect(onFileDrop).toHaveBeenCalledTimes(1)
  })

  it('accepts everything when acceptFileTypes is empty string', () => {
    const { editor, onFileDrop } = renderInput({ acceptFileTypes: '' })
    const file = new File(['x'], 'mystery.bin', { type: 'application/octet-stream' })
    firePaste(editor, { files: [file] })
    expect(onFileDrop).toHaveBeenCalledTimes(1)
  })
})

describe('RichTextInput — paste: HTML & plain branches', () => {
  // insertMediaMarkdown / detectAndConvertUrls bail when there is no collapsed
  // Range inside the editor (selection.rangeCount === 0). A real browser sets
  // one up via the focus click on contentEditable; in jsdom we have to do it
  // by hand before each paste that exercises those branches.
  function focusAndPositionCursor(editor: HTMLElement) {
    editor.focus()
    placeCursorAtEnd(editor)
  }

  it('extracts media chips from pasted HTML and re-inserts them', () => {
    const { editor, onChange } = renderInput()
    focusAndPositionCursor(editor)
    const html =
      '<div><span class="rich-text-media" data-url="https://t.test/p.png" data-alt="pic" data-type="image"></span></div>'
    firePaste(editor, { plainText: 'pic', html })
    const finalMarkdown = onChange.mock.calls.at(-1)?.[0] as string
    expect(finalMarkdown).toContain('![pic](https://t.test/p.png)')
  })

  it('extracts video chips from pasted HTML', () => {
    const { editor, onChange } = renderInput()
    focusAndPositionCursor(editor)
    const html =
      '<span class="rich-text-media" data-url="https://t.test/c.mp4" data-alt="clip" data-type="video"></span>'
    firePaste(editor, { plainText: 'clip', html })
    const finalMarkdown = onChange.mock.calls.at(-1)?.[0] as string
    expect(finalMarkdown).toContain('[video:clip](https://t.test/c.mp4)')
  })

  it('extracts link chips from pasted HTML', () => {
    const { editor, onChange } = renderInput()
    focusAndPositionCursor(editor)
    const html = '<span class="rich-text-media" data-url="https://docs.test" data-alt="Docs" data-type="link"></span>'
    firePaste(editor, { plainText: 'Docs', html })
    const finalMarkdown = onChange.mock.calls.at(-1)?.[0] as string
    expect(finalMarkdown).toContain('[Docs](https://docs.test)')
  })

  it('converts bare URLs in external HTML pastes to link chips', () => {
    const { editor, onChange } = renderInput()
    focusAndPositionCursor(editor)
    firePaste(editor, {
      plainText: 'see https://example.com here',
      html: '<p>see https://example.com here</p>',
    })
    const finalMarkdown = onChange.mock.calls.at(-1)?.[0] as string
    expect(finalMarkdown).toContain('https://example.com')
    // Bare URL should be wrapped in markdown link syntax: [display](url)
    expect(finalMarkdown).toMatch(/\[https?:\/\/[^\]]+\]\(https?:\/\/[^)]+\)/)
  })

  it('converts plain-text pastes containing bare URLs into link chips', () => {
    const { editor, onChange } = renderInput()
    focusAndPositionCursor(editor)
    firePaste(editor, { plainText: 'visit https://abc.test for more' })
    const finalMarkdown = onChange.mock.calls.at(-1)?.[0] as string
    expect(finalMarkdown).toMatch(/\[https?:\/\/abc\.test\]\(https:\/\/abc\.test\)/)
  })

  it('re-inserts plain-text pastes containing markdown chip syntax', () => {
    const { editor, onChange } = renderInput()
    focusAndPositionCursor(editor)
    firePaste(editor, {
      plainText: 'see ![pic](https://t.test/x.png) here',
    })
    const finalMarkdown = onChange.mock.calls.at(-1)?.[0] as string
    expect(finalMarkdown).toContain('![pic](https://t.test/x.png)')
  })

  it('inserts plain text into the editor when paste has HTML but no URL (no chip conversion)', () => {
    const { editor, onChange } = renderInput()
    focusAndPositionCursor(editor)
    firePaste(editor, { plainText: 'just plain text', html: '<p>just plain text</p>' })
    // Plain text branch fires onChange via handleInput. Assert on what was
    // inserted, not just that the callback fired — the previous "called once"
    // assertion would still pass if the component dropped the text or
    // duplicated it.
    expect(editor.textContent).toBe('just plain text')
    expect(onChange).toHaveBeenCalled()
    expect(onChange.mock.calls.at(-1)?.[0]).toBe('just plain text')
    // No chip should be created — this is the no-conversion branch
    expect(editor.querySelector('.rich-text-media')).toBeNull()
  })
})

describe('RichTextInput — drag & drop', () => {
  it('routes dropped files to onFileDrop, filtering by acceptFileTypes', () => {
    const { editor, onFileDrop } = renderInput({ acceptFileTypes: 'image/*' })
    const ok = new File(['x'], 'p.png', { type: 'image/png' })
    const bad = new File(['x'], 'd.pdf', { type: 'application/pdf' })
    fireDrop(editor, [ok, bad])
    expect(onFileDrop).toHaveBeenCalledTimes(1)
    expect(onFileDrop.mock.calls[0][0]).toHaveLength(1)
    expect((onFileDrop.mock.calls[0][0] as File[])[0].name).toBe('p.png')
  })

  it('does not crash when no files are accepted', () => {
    const { editor, onFileDrop } = renderInput({ acceptFileTypes: 'image/*' })
    const bad = new File(['x'], 'd.pdf', { type: 'application/pdf' })
    fireDrop(editor, [bad])
    expect(onFileDrop).not.toHaveBeenCalled()
  })

  it('is a no-op when no onFileDrop prop is provided', () => {
    const { editor } = renderInput({ onFileDrop: undefined })
    const file = new File(['x'], 'p.png', { type: 'image/png' })
    expect(() => fireDrop(editor, [file])).not.toThrow()
  })

  it('preventDefault on dragOver to enable drop', () => {
    const { editor } = renderInput()
    const event = new Event('dragover', { bubbles: true, cancelable: true })
    Object.defineProperty(event, 'dataTransfer', {
      value: { files: [] as unknown as FileList, types: [] },
    })
    editor.dispatchEvent(event)
    expect(event.defaultPrevented).toBe(true)
  })
})

/**
 * fireEvent returns dispatchEvent()'s result, which is `false` once
 * preventDefault() ran on a cancelable event. For keydown that is the
 * observable contract of "the browser inserts nothing for this key".
 */
function keyDownWasSwallowed(editor: HTMLElement, init: Record<string, unknown>): boolean {
  return fireEvent.keyDown(editor, init) === false
}

describe('RichTextInput — keyboard handling', () => {
  it('Enter calls onSubmit and prevents the default newline', () => {
    const { editor, onSubmit } = renderInput()
    expect(keyDownWasSwallowed(editor, { key: 'Enter' })).toBe(true)
    expect(onSubmit).toHaveBeenCalledTimes(1)
  })

  it('Shift+Enter does NOT call onSubmit (lets newline insert)', () => {
    const { editor, onSubmit } = renderInput()
    expect(keyDownWasSwallowed(editor, { key: 'Enter', shiftKey: true })).toBe(false)
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('does not throw when Enter fires without an onSubmit prop', () => {
    const { editor } = renderInput({ onSubmit: undefined })
    expect(() => fireEvent.keyDown(editor, { key: 'Enter' })).not.toThrow()
  })

  it('swallows plain Enter when no submit is available instead of inserting a newline', () => {
    // ChatComposer only passes onSubmit when canSubmit — while a response streams
    // it is undefined. Falling through would insert a blank line the user reads as
    // "my message failed to send".
    const { editor } = renderInput({ onSubmit: undefined })
    expect(keyDownWasSwallowed(editor, { key: 'Enter' })).toBe(true)
  })

  it('still inserts a newline for Shift+Enter when no submit is available', () => {
    const { editor } = renderInput({ onSubmit: undefined })
    expect(keyDownWasSwallowed(editor, { key: 'Enter', shiftKey: true })).toBe(false)
  })

  it('forwards a swallowed Enter to the onKeyDown prop', () => {
    const { editor, onKeyDown } = renderInput({ onSubmit: undefined })
    fireEvent.keyDown(editor, { key: 'Enter' })
    expect(onKeyDown).toHaveBeenCalled()
    expect(onKeyDown.mock.calls[0][0].key).toBe('Enter')
  })

  it('forwards arbitrary keys to the onKeyDown prop', () => {
    const { editor, onKeyDown } = renderInput()
    fireEvent.keyDown(editor, { key: 'ArrowLeft' })
    expect(onKeyDown).toHaveBeenCalled()
    expect(onKeyDown.mock.calls[0][0].key).toBe('ArrowLeft')
  })

  it('Cmd+A selects all editor content (and prevents propagation)', () => {
    const { editor } = renderInput({ value: 'some content' })
    fireEvent.keyDown(editor, { key: 'a', metaKey: true })
    const sel = window.getSelection()
    expect(sel?.rangeCount).toBeGreaterThan(0)
    const range = sel!.getRangeAt(0)
    expect(range.startContainer === editor || editor.contains(range.startContainer)).toBe(true)
  })

  it('Ctrl+A also selects all editor content', () => {
    const { editor } = renderInput({ value: 'some content' })
    fireEvent.keyDown(editor, { key: 'a', ctrlKey: true })
    const sel = window.getSelection()
    expect(sel?.rangeCount).toBeGreaterThan(0)
  })

  it('Backspace at offset 0 in a text node removes the chip immediately before', () => {
    const { editor, onChange } = renderInput({
      value: '![pic](https://t.test/x.png)after',
    })
    const chip = editor.querySelector('.rich-text-media') as HTMLElement
    expect(chip).not.toBeNull()
    // Cursor at start of "after" text node (which sits right after the chip)
    const textNode = chip.nextSibling as Text
    const range = document.createRange()
    range.setStart(textNode, 0)
    range.collapse(true)
    const sel = window.getSelection()
    sel?.removeAllRanges()
    sel?.addRange(range)

    fireEvent.keyDown(editor, { key: 'Backspace' })
    // chip removed
    expect(editor.querySelector('.rich-text-media')).toBeNull()
    expect(onChange).toHaveBeenCalled()
  })

  it('Delete at end of a text node removes the chip immediately after', () => {
    const { editor, onChange } = renderInput({
      value: 'before![pic](https://t.test/x.png)',
    })
    const chip = editor.querySelector('.rich-text-media') as HTMLElement
    const textNode = chip.previousSibling as Text
    const range = document.createRange()
    range.setStart(textNode, textNode.textContent!.length)
    range.collapse(true)
    const sel = window.getSelection()
    sel?.removeAllRanges()
    sel?.addRange(range)

    fireEvent.keyDown(editor, { key: 'Delete' })
    expect(editor.querySelector('.rich-text-media')).toBeNull()
    expect(onChange).toHaveBeenCalled()
  })
})

describe('RichTextInput — IME composition', () => {
  it('forwards onCompositionStart and onCompositionEnd to the parent', () => {
    const { editor, onCompositionStart, onCompositionEnd } = renderInput()
    fireEvent.compositionStart(editor)
    expect(onCompositionStart).toHaveBeenCalled()
    fireEvent.compositionEnd(editor)
    expect(onCompositionEnd).toHaveBeenCalled()
  })

  it('Enter pressed during composition does NOT trigger onSubmit (isComposing guard)', () => {
    const { editor, onSubmit } = renderInput()
    fireEvent.compositionStart(editor)
    // jsdom: native isComposing must be passed through; the component checks
    // both isComposingRef AND nativeEvent.isComposing.
    fireEvent.keyDown(editor, { key: 'Enter', isComposing: true })
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('Enter used by IME to commit preedit text does NOT trigger onSubmit when keyCode is 229', () => {
    const { editor, onSubmit } = renderInput()
    fireEvent.keyDown(editor, { key: 'Enter', keyCode: 229, which: 229, isComposing: false })
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('does NOT swallow a composing Enter when submit is unavailable (IME keeps the key)', () => {
    // The no-submit suppression must not reach composition-confirm Enter, or the
    // IME can never commit preedit text while a response is streaming.
    const { editor } = renderInput({ onSubmit: undefined })
    fireEvent.compositionStart(editor)
    expect(keyDownWasSwallowed(editor, { key: 'Enter', isComposing: true })).toBe(false)
  })

  it('does NOT swallow a keyCode-229 Enter when submit is unavailable', () => {
    const { editor } = renderInput({ onSubmit: undefined })
    expect(keyDownWasSwallowed(editor, { key: 'Enter', keyCode: 229, which: 229, isComposing: false })).toBe(false)
  })
})

describe('RichTextInput — focus & click', () => {
  it('removes a ready image without submitting, opening a preview or losing surrounding text', () => {
    const { editor, onChange, onSubmit, onImagePreview } = renderInput({
      value: 'Before ![photo](https://cdn.test/photo.png) [report.md](https://cdn.test/report.md) after',
    })
    const chip = editor.querySelector('[data-type="image"]') as HTMLElement
    const remove = within(chip).getByRole('button', { name: 'Remove attachment' })
    fireEvent.keyDown(remove, { key: 'Enter' })
    expect(onSubmit).not.toHaveBeenCalled()
    fireEvent.click(remove)
    expect(onChange).toHaveBeenLastCalledWith('Before  [report.md](https://cdn.test/report.md) after')
    expect(editor.querySelector('[data-type="image"]')).toBeNull()
    expect(editor.querySelector('[data-file-reference]')).not.toBeNull()
    expect(onImagePreview).not.toHaveBeenCalled()
    expect(document.activeElement).toBe(editor)
  })

  it('removes an uploading document and hides deletion controls while read only', () => {
    const value = '[report.md](uploading:doc-1)'
    const { editor, onChange, rerender } = renderInput({ value })
    fireEvent.click(within(editor).getByRole('button', { name: 'Remove attachment' }))
    expect(onChange).toHaveBeenLastCalledWith('')
    expect(editor.querySelector('[data-file-reference]')).toBeNull()

    rerender(<RichTextInput value={value} onChange={onChange} disabled />)
    expect(editor.querySelector('[data-file-reference]')).not.toBeNull()
    expect(within(editor).queryByRole('button', { name: 'Remove attachment' })).toBeNull()
    rerender(<RichTextInput value={value} onChange={onChange} />)
    expect(within(editor).getByRole('button', { name: 'Remove attachment' })).toBeEnabled()
    rerender(<RichTextInput value={value} onChange={onChange} removeAttachmentLabel="移除附件" />)
    expect(within(editor).getByRole('button', { name: '移除附件' })).toBeEnabled()
  })

  it('keeps the caret after appended attachments when a focused editor is rebuilt', () => {
    const commandRef = createRef<RichTextInputHandle>()
    const { editor, rerender, onChange } = renderInput({ value: 'Review ', commandRef })
    act(() => commandRef.current?.focusAtEnd())

    rerender(<RichTextInput value="Review [report.md](uploading:file-1) ![photo](uploading:image-1)" onChange={onChange} commandRef={commandRef} />)

    const range = window.getSelection()!.getRangeAt(0)
    const end = document.createRange()
    end.selectNodeContents(editor)
    end.collapse(false)
    expect(document.activeElement).toBe(editor)
    expect(range.collapsed).toBe(true)
    expect(range.compareBoundaryPoints(Range.START_TO_START, end)).toBe(0)
  })

  it('removes the data-placeholder attribute once the editor has content (focus path stays consistent)', () => {
    // The focus state itself is internal, but its observable side effect is
    // the data-placeholder attribute toggle on the editor element. Asserting
    // on that contract is what makes this test guard the focus/placeholder
    // logic rather than just exercising no-crash behavior.
    const { editor, rerender } = renderInput({ placeholder: 'type here' })
    expect(editor.getAttribute('data-placeholder')).toBe('type here')
    fireEvent.focus(editor)
    fireEvent.blur(editor)
    expect(editor.isConnected).toBe(true)
    // Update the controlled value to non-empty — placeholder should clear via
    // the value+isFocused effect
    rerender(<RichTextInput value="hello" onChange={vi.fn()} placeholder="type here" />)
    expect(editor.getAttribute('data-placeholder')).toBeNull()
  })

  it('allows a rendered web link to use its native click navigation', () => {
    const { editor } = renderInput({ value: '[link](https://x.test)' })
    const anchor = editor.querySelector('a') as HTMLAnchorElement
    const event = new MouseEvent('click', { bubbles: true, cancelable: true })
    anchor.dispatchEvent(event)
    expect(event.defaultPrevented).toBe(false)
  })

  it('keeps a rendered link in Tab order and does not submit when Enter activates it', () => {
    const { editor, onSubmit } = renderInput({ value: '[link](https://x.test)' })
    const anchor = editor.querySelector('a') as HTMLAnchorElement
    expect(anchor.tabIndex).toBe(0)
    anchor.focus()

    expect(document.activeElement).toBe(anchor)
    expect(keyDownWasSwallowed(anchor, { key: 'Enter' })).toBe(false)
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('keeps editor select-all available when a rendered link has focus', () => {
    const { editor } = renderInput({ value: 'before [link](https://x.test) after' })
    const anchor = editor.querySelector('a') as HTMLAnchorElement
    anchor.focus()

    fireEvent.keyDown(anchor, { key: 'a', ctrlKey: true })

    const selection = window.getSelection()
    expect(selection?.rangeCount).toBeGreaterThan(0)
    const range = selection!.getRangeAt(0)
    expect(range.startContainer === editor || editor.contains(range.startContainer)).toBe(true)
  })

  it('does not make non-http markdown targets clickable inside the editor', () => {
    const { editor } = renderInput({ value: '[unsafe](javascript:alert(1))' })
    const link = editor.querySelector('.rich-text-media') as HTMLElement

    expect(link.tagName).toBe('SPAN')
    expect(editor.querySelector('a')).toBeNull()
  })

  it('clicking an image chip with a URL calls onImagePreview with the URL', () => {
    const { editor, onImagePreview } = renderInput({
      value: '![pic](https://t.test/x.png)',
    })
    const chip = editor.querySelector('.rich-text-media') as HTMLElement
    chip.click()
    expect(onImagePreview).toHaveBeenCalledWith('https://t.test/x.png')
  })

  it('clicking an empty-URL image chip calls onEmptyImageClick with the alt', () => {
    const { editor, onEmptyImageClick } = renderInput({
      value: '![placeholder]()',
    })
    const chip = editor.querySelector('.rich-text-media') as HTMLElement
    chip.click()
    expect(onEmptyImageClick).toHaveBeenCalledWith('placeholder')
  })

  it('clicking an uploading chip does NOT trigger onImagePreview or onEmptyImageClick', () => {
    const { editor, onImagePreview, onEmptyImageClick } = renderInput({
      value: '![pic](uploading:tmp-1)',
    })
    const chip = editor.querySelector('.rich-text-media') as HTMLElement
    chip.click()
    expect(onImagePreview).not.toHaveBeenCalled()
    expect(onEmptyImageClick).not.toHaveBeenCalled()
  })
})

describe('RichTextInput — uploading chip lifecycle', () => {
  it('replaces an uploading chip with a final chip when the URL settles', () => {
    const { editor, rerender } = renderInput({
      value: '![pic](uploading:tmp-1)',
    })
    let chip = editor.querySelector('.rich-text-media') as HTMLElement
    expect(chip.getAttribute('data-url')).toBe('uploading:tmp-1')

    // Parent updates the markdown to the resolved URL
    rerender(<RichTextInput value="![pic](https://cdn.test/p.png)" onChange={vi.fn()} />)
    chip = editor.querySelector('.rich-text-media') as HTMLElement
    expect(chip.getAttribute('data-url')).toBe('https://cdn.test/p.png')
    expect(chip.className).not.toContain('animate-pulse')
  })

  it('removes an uploading chip when the upload fails (no URL appears in next value)', () => {
    const { editor, rerender } = renderInput({
      value: '![pic](uploading:tmp-1)',
    })
    expect(editor.querySelectorAll('.rich-text-media')).toHaveLength(1)

    // Simulate upload failure: parent removes the chip from the markdown
    rerender(<RichTextInput value="" onChange={vi.fn()} />)
    expect(editor.querySelectorAll('.rich-text-media')).toHaveLength(0)
  })

  it('replaces a non-image uploading card with its clickable resolved file card', () => {
    const { editor, rerender } = renderInput({
      value: '[archive.zip](uploading:tmp-1)',
    })
    expect(editor.querySelector('[data-uploading="true"]')).not.toBeNull()

    rerender(
      <RichTextInput
        value="[archive.zip](https://cdn.test/archive.zip)"
        onChange={vi.fn()}
        uploadingAttachmentLabel="Uploading"
      />,
    )

    const card = editor.querySelector('[data-file-reference="true"]') as HTMLElement
    expect(within(card).getByRole('link')).toHaveAttribute('href', 'https://cdn.test/archive.zip')
    expect(card.getAttribute('data-uploading')).toBeNull()
    expect(card.querySelector('[data-upload-status="true"]')).toBeNull()
  })
})
