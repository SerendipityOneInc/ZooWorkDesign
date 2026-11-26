import { fireEvent, render } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { RichTextInput } from '../index'

describe('RichTextInput package contract', () => {
  it('exports a controlled content-editable input from the package root', () => {
    const onChange = vi.fn()

    const { getByTestId } = render(<RichTextInput value="hello" onChange={onChange} />)

    const editor = getByTestId('rich-text-input')
    expect(editor.tagName).toBe('DIV')
    expect(editor.getAttribute('contenteditable')).toBe('true')
    expect(editor.textContent).toBe('hello')
  })

  it('does not submit an IME process-key Enter event', () => {
    const onSubmit = vi.fn()
    const { getByTestId } = render(<RichTextInput value="你好" onChange={() => {}} onSubmit={onSubmit} />)

    fireEvent.keyDown(getByTestId('rich-text-input'), {
      key: 'Enter',
      keyCode: 229,
      which: 229,
      isComposing: false,
    })

    expect(onSubmit).not.toHaveBeenCalled()
  })
})
