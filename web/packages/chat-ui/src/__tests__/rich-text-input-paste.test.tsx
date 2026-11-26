// @vitest-environment jsdom
/**
 * Tests the paste-to-file branch in RichTextInput.handlePaste — large plain-text
 * pastes are synthesized into a .txt File and routed through onFileDrop instead
 * of being inserted inline. Two triggers cover different failure modes:
 *   - bytes > 5000  (UX rule for CJK/emoji-heavy pastes)
 *   - chars > 4000  (default inline-message limit)
 */
import { cleanup, render } from '@testing-library/react'
import type { ComponentProps } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { RichTextInput } from '../index'

afterEach(cleanup)

function firePaste(target: HTMLElement, plainText: string): void {
  // jsdom's ClipboardEvent ignores `clipboardData` in init, so build a bubbling
  // Event and attach clipboardData via defineProperty. React's delegated root
  // listener reads `nativeEvent.clipboardData` through the SyntheticEvent.
  const clipboardData = {
    getData: (type: string) => (type === 'text/plain' ? plainText : ''),
    files: [] as File[],
    items: [] as DataTransferItem[],
    types: ['text/plain'],
  }
  const event = new Event('paste', { bubbles: true, cancelable: true })
  Object.defineProperty(event, 'clipboardData', { value: clipboardData })
  target.dispatchEvent(event)
}

type Props = ComponentProps<typeof RichTextInput>

function renderInput(overrides: Partial<Props> = {}) {
  const onChange = vi.fn()
  const onFileDrop = vi.fn()
  const result = render(
    <RichTextInput
      value=""
      onChange={onChange}
      onFileDrop={onFileDrop}
      acceptFileTypes=".txt,image/*"
      {...overrides}
    />,
  )
  return { ...result, onChange, onFileDrop }
}

describe('RichTextInput — paste-to-file', () => {
  it('routes paste > 5KB UTF-8 bytes to onFileDrop as a .txt File', () => {
    const { getByTestId, onFileDrop } = renderInput()
    firePaste(getByTestId('rich-text-input'), 'a'.repeat(6000))

    expect(onFileDrop).toHaveBeenCalledTimes(1)
    const files = onFileDrop.mock.calls[0][0] as File[]
    expect(files).toHaveLength(1)
    expect(files[0]).toBeInstanceOf(File)
    expect(files[0].name).toMatch(/^pasted-\d+\.txt$/)
    expect(files[0].type).toBe('text/plain')
    expect(files[0].size).toBe(6000)
  })

  it('keeps small pastes inline (does not call onFileDrop)', () => {
    const { getByTestId, onFileDrop } = renderInput()
    firePaste(getByTestId('rich-text-input'), 'hello world')

    expect(onFileDrop).not.toHaveBeenCalled()
  })

  it('triggers on ASCII pastes > 4000 chars even when bytes stay under 5KB', () => {
    // 4500 ASCII chars = 4500 bytes (< 5KB byte rule) but > the default 4000-char limit
    const { getByTestId, onFileDrop } = renderInput()
    firePaste(getByTestId('rich-text-input'), 'a'.repeat(4500))

    expect(onFileDrop).toHaveBeenCalledTimes(1)
    const file = onFileDrop.mock.calls[0][0][0] as File
    expect(file.size).toBe(4500)
  })

  it('honors a consumer-specific inline paste character limit', () => {
    const { getByTestId, onFileDrop } = renderInput({ maxInlinePasteCharacters: 100 })
    firePaste(getByTestId('rich-text-input'), 'a'.repeat(101))

    expect(onFileDrop).toHaveBeenCalledTimes(1)
  })

  it('triggers on CJK pastes by byte size even when char count is under cap', () => {
    // 2000 Chinese chars = 6000 UTF-8 bytes (3 bytes/char): under 4000-char cap
    // but over the 5KB byte rule
    const { getByTestId, onFileDrop } = renderInput()
    firePaste(getByTestId('rich-text-input'), '中'.repeat(2000))

    expect(onFileDrop).toHaveBeenCalledTimes(1)
    const file = onFileDrop.mock.calls[0][0][0] as File
    expect(file.size).toBe(6000)
  })

  it('falls back to inline when parent acceptFileTypes excludes .txt', () => {
    const { getByTestId, onFileDrop } = renderInput({ acceptFileTypes: 'image/*,video/*' })
    firePaste(getByTestId('rich-text-input'), 'a'.repeat(6000))

    expect(onFileDrop).not.toHaveBeenCalled()
  })

  it('does not throw when no onFileDrop prop is provided', () => {
    const { getByTestId } = render(<RichTextInput value="" onChange={vi.fn()} acceptFileTypes=".txt,image/*" />)

    expect(() => firePaste(getByTestId('rich-text-input'), 'a'.repeat(6000))).not.toThrow()
  })
})
