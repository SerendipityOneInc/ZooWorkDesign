import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { MentionsExamples } from './MentionsExamples'
import { setEditorSelection } from '../../packages/chat-ui/src/composer/editor/mention-dom'
import { PreviewLocaleProvider } from './locale'

describe('Mentions chat preview', () => {
  it('opens suggestions from the toolbar without submitting or clearing the draft', async () => {
    render(<PreviewLocaleProvider initialLocale="en"><MentionsExamples /></PreviewLocaleProvider>)
    const input = screen.getByRole('combobox', { name: 'Chat message' })
    const submit = vi.fn()
    input.closest('form')!.addEventListener('submit', submit)
    fireEvent.click(screen.getByRole('button', { name: 'Mention' }))
    expect(submit).not.toHaveBeenCalled()
    expect(input).toHaveTextContent('@')
    await waitFor(() => expect(screen.getByRole('listbox')).toBeVisible())
    expect(input).toHaveFocus()
    fireEvent.click(screen.getByRole('option', { name: 'Market Brief Research and daily market updates' }))
    await waitFor(() => expect(window.getSelection()?.anchorNode?.textContent).toBe(' '))
    fireEvent.click(screen.getByRole('button', { name: 'Mention' }))
    expect(submit).not.toHaveBeenCalled()
    expect(input).toHaveTextContent('@Market Brief @')
    await waitFor(() => expect(screen.getByRole('listbox')).toBeVisible())
    expect(screen.getByText('Send a message to see its inline mentions.')).toBeVisible()
  })
  it('sends a local message with several recipients and clears the composer', () => {
    render(<PreviewLocaleProvider initialLocale="en"><MentionsExamples /></PreviewLocaleProvider>)
    expect(screen.getByRole('button', { name: 'Send preview message' })).toBeDisabled()
    fireEvent.click(screen.getByRole('button', { name: 'Try multiple mentions' }))
    const recipients = screen.getByLabelText('Mentioned recipients')
    expect(recipients).toHaveTextContent('Market BriefContent StudioLynn')
    fireEvent.keyDown(screen.getByRole('combobox', { name: 'Chat message' }), { key: 'Enter' })
    expect(screen.getByRole('combobox', { name: 'Chat message' })).toBeEmptyDOMElement()
    fireEvent.click(screen.getByRole('button', { name: '@Lynn' }))
    expect(screen.getByRole('status')).toHaveTextContent('Lynn · Teammate')
    expect(screen.getByText('3 distinct recipients')).toBeVisible()
  })
  it('provides Chinese candidate groups and recovers from a simulated loading failure', () => {
    render(<PreviewLocaleProvider initialLocale="zh"><MentionsExamples /></PreviewLocaleProvider>)
    const input = screen.getByRole('combobox', { name: '聊天消息' })
    fireEvent.click(screen.getByRole('radio', { name: '加载失败' }))
    input.textContent = '@'
    input.focus()
    setEditorSelection(input, 1)
    fireEvent.input(input)
    expect(screen.getByRole('status')).toHaveTextContent('无法加载候选对象')
    fireEvent.click(screen.getByRole('button', { name: '重试' }))
    const list = screen.getByRole('listbox', { name: '提及智能体或同事' })
    expect(within(list).getByRole('group', { name: '智能体' })).toBeVisible()
    expect(within(list).getByRole('group', { name: '同事' })).toBeVisible()
    fireEvent.click(within(list).getByRole('option', { name: '内容助手 写作、编辑与内容策划' }))
    expect(input).toHaveTextContent('@内容助手')
    expect(input.querySelector('[data-mention-id]')).toHaveAttribute('contenteditable', 'false')
  })
})
