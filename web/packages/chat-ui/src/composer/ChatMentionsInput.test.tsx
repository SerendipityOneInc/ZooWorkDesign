import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { getMentionRecipients, type MentionOption, type MentionsValue } from '@zooclaw/zooworkdesign'
import { ChatMentionsInput } from './ChatMentionsInput'
import { setEditorSelection } from './editor/mention-dom'
import { editorToMarkdown } from './editor/markdown-dom'

const options: MentionOption[] = [
  { id: 'brief', kind: 'agent', label: 'Market Brief', keywords: ['research', '市场'] },
  { id: 'offline', kind: 'agent', label: 'Unavailable', disabled: true },
  { id: 'same', kind: 'agent', label: 'Alex' },
  { id: 'same', kind: 'person', label: 'Alex', description: 'Designer' },
]
const initial: MentionsValue = {
  text: 'Hi @Market Brief and @Alex',
  mentions: [
    { id: 'brief', kind: 'agent', label: 'Market Brief', start: 3, end: 16 },
    { id: 'same', kind: 'person', label: 'Alex', start: 21, end: 26 },
  ],
}
function type(text: string, caret = text.length) {
  const input = screen.getByRole('combobox', { name: 'Message' }) as HTMLDivElement
  const current = editorToMarkdown(input)
  if (text.startsWith(current)) input.append(document.createTextNode(text.slice(current.length)))
  else input.textContent = text
  input.focus()
  setEditorSelection(input, caret)
  fireEvent.input(input)
  return input
}

describe('Mentions input', () => {
  it('selects multiple identities, keeps text focus and never forwards selection Enter to send', async () => {
    const onValueChange = vi.fn(),
      onKeyDown = vi.fn()
    render(
      <ChatMentionsInput ariaLabel="Message" options={options} onValueChange={onValueChange} onKeyDown={onKeyDown} />,
    )
    const input = type('@research')
    expect(screen.getByRole('option', { name: 'Market Brief' })).toHaveAttribute('aria-selected', 'true')
    fireEvent.keyDown(input, { key: 'Enter' })
    expect(editorToMarkdown(input)).toBe('@Market Brief ')
    expect(onKeyDown).not.toHaveBeenCalled()
    await waitFor(() => expect(input).toHaveFocus())
    type('@Market Brief @Alex')
    fireEvent.keyDown(input, { key: 'ArrowDown' })
    expect(screen.getByRole('option', { name: 'Alex Designer' })).toHaveAttribute(
      'id',
      input.getAttribute('aria-activedescendant'),
    )
    fireEvent.keyDown(input, { key: 'Enter' })
    expect(getMentionRecipients(onValueChange.mock.lastCall![0])).toEqual([
      { id: 'brief', kind: 'agent', label: 'Market Brief' },
      { id: 'same', kind: 'person', label: 'Alex' },
    ])
  })
  it('supports boundary deletion and restores both text and identity with undo/redo', () => {
    const change = vi.fn()
    render(<ChatMentionsInput ariaLabel="Message" options={options} defaultValue={initial} onValueChange={change} />)
    const input = screen.getByRole('combobox') as HTMLDivElement
    setEditorSelection(input, 16)
    fireEvent.keyDown(input, { key: 'Backspace' })
    expect(editorToMarkdown(input)).toBe('Hi  and @Alex')
    expect(getMentionRecipients(change.mock.lastCall![0])).toHaveLength(1)
    fireEvent.keyDown(input, { key: 'z', ctrlKey: true })
    expect(editorToMarkdown(input)).toBe(initial.text)
    expect(change.mock.lastCall![0].mentions).toEqual(initial.mentions)
    fireEvent.keyDown(input, { key: 'z', metaKey: true, shiftKey: true })
    expect(editorToMarkdown(input)).toBe('Hi  and @Alex')
  })
  it('skips disabled options, dismisses with Escape/Tab, and handles asynchronous results', () => {
    const search = vi.fn()
    const { rerender } = render(<ChatMentionsInput ariaLabel="Message" options={options} onSearch={search} />)
    const input = type('@')
    fireEvent.keyDown(input, { key: 'ArrowDown' })
    expect(screen.getByRole('option', { name: 'Alex' })).toHaveAttribute('aria-selected', 'true')
    fireEvent.keyDown(input, { key: 'Escape' })
    expect(input).toHaveAttribute('aria-expanded', 'false')
    expect(search).toHaveBeenLastCalledWith(null)
    type('@market')
    expect(search).toHaveBeenLastCalledWith('market')
    rerender(<ChatMentionsInput ariaLabel="Message" options={[]} onSearch={search} loading />)
    expect(screen.getByRole('status')).toHaveTextContent('Loading suggestions')
    expect(screen.queryByRole('option')).toBeNull()
    rerender(<ChatMentionsInput ariaLabel="Message" options={[options[0]]} onSearch={search} />)
    expect(screen.getByRole('option', { name: 'Market Brief' })).toHaveAttribute('aria-selected', 'true')
    fireEvent.keyDown(input, { key: 'Tab' })
    expect(input).toHaveAttribute('aria-expanded', 'false')
  })
  it('does not select or send during Chinese composition', () => {
    const key = vi.fn(),
      search = vi.fn()
    render(
      <ChatMentionsInput
        ariaLabel="Message"
        options={[{ id: 'cn', kind: 'agent', label: '市场简报' }]}
        onSearch={search}
        onKeyDown={key}
      />,
    )
    const input = type('@')
    fireEvent.compositionStart(input)
    type('@市场')
    fireEvent.keyDown(input, { key: 'Enter', keyCode: 229 })
    expect(key).not.toHaveBeenCalled()
    expect(editorToMarkdown(input)).toBe('@市场')
    expect(input).toHaveAttribute('aria-expanded', 'false')
    fireEvent.compositionEnd(input)
    expect(search).toHaveBeenLastCalledWith('市场')
    fireEvent.keyDown(input, { key: 'Enter' })
    expect(editorToMarkdown(input)).toBe('@市场简报 ')
  })
  it('keeps failures recoverable and localizes loading, empty and unavailable states', () => {
    const retry = vi.fn()
    const { rerender } = render(
      <ChatMentionsInput ariaLabel="Message" options={[]} labels={{ empty: '没有结果', retry: '重试' }} />,
    )
    const input = type('@')
    expect(screen.getByRole('status')).toHaveTextContent('没有结果')
    rerender(
      <ChatMentionsInput
        ariaLabel="Message"
        options={[]}
        error="加载失败"
        onRetry={retry}
        labels={{ retry: '重试' }}
      />,
    )
    fireEvent.click(screen.getByRole('button', { name: '重试' }))
    expect(retry).toHaveBeenCalledOnce()
    fireEvent.keyDown(input, { key: 'Enter' })
    expect(retry).toHaveBeenCalledTimes(2)
    rerender(<ChatMentionsInput ariaLabel="Message" options={options} disabled />)
    expect(input).toHaveAttribute('contenteditable', 'false')
    expect(input).toHaveAttribute('aria-expanded', 'false')
  })
  it('honors maxLength and forwards Shift+Enter as a newline instead of choosing a result', () => {
    const keys = vi.fn()
    render(<ChatMentionsInput ariaLabel="Message" options={options} maxLength={10} onKeyDown={keys} />)
    const input = type('@')
    expect(screen.getByRole('option', { name: 'Market Brief' })).toHaveAttribute('aria-disabled', 'true')
    fireEvent.keyDown(input, { key: 'Enter', shiftKey: true })
    expect(keys).toHaveBeenCalledOnce()
    expect(editorToMarkdown(input)).toBe('@')
    fireEvent.keyDown(input, { key: 'Enter' })
    expect(editorToMarkdown(input)).toBe('@Alex ')
  })
})
