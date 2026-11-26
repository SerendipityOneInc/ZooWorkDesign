import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { AttachmentChip, ChatComposer, ChatMessage, ChatThread } from '../index'
import type { ChatUiMessage } from '../types'

describe('@zooclaw/zooworkdesign-chat', () => {
  it('renders user and assistant messages with accessible labels', () => {
    render(
      <>
        <ChatMessage message={{ id: 'u1', role: 'user', content: 'Hello' }} />
        <ChatMessage message={{ id: 'a1', role: 'assistant', content: 'Hi there' }} />
      </>,
    )

    expect(screen.getByLabelText('You message').textContent).toContain('Hello')
    expect(screen.getByLabelText('Assistant message').textContent).toContain('Hi there')
    expect(screen.getByText('Hello')).toHaveClass('font-medium')
    expect(screen.getByText('Hi there')).not.toHaveClass('font-medium')
  })

  it('submits trimmed composer input without mutating the controlled value', () => {
    const onChange = vi.fn()
    const onSubmit = vi.fn()

    render(<ChatComposer value="  deploy report  " onChange={onChange} onSubmit={onSubmit} />)

    fireEvent.click(screen.getByRole('button', { name: 'Send' }))

    expect(onSubmit).toHaveBeenCalledWith({ value: 'deploy report' })
    expect(onChange).not.toHaveBeenCalled()
  })

  it('blocks empty and disabled composer submits', () => {
    const onSubmit = vi.fn()
    const { rerender } = render(<ChatComposer value="   " onChange={() => {}} onSubmit={onSubmit} />)

    fireEvent.click(screen.getByRole('button', { name: 'Send' }))
    expect(onSubmit).not.toHaveBeenCalled()

    rerender(<ChatComposer value="hello" onChange={() => {}} onSubmit={onSubmit} disabled />)
    fireEvent.click(screen.getByRole('button', { name: 'Send' }))
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('blocks composer submit while generation is in progress', () => {
    const onChange = vi.fn()
    const onSubmit = vi.fn()

    render(
      <ChatComposer
        value="still generating"
        onChange={onChange}
        onSubmit={onSubmit}
        isGenerating
        onStop={() => {}}
      />,
    )

    const input = screen.getByTestId('chat-composer-input')
    fireEvent.keyDown(input, { key: 'Enter' })
    fireEvent.submit(input.closest('form')!)

    expect(onSubmit).not.toHaveBeenCalled()
    expect(onChange).not.toHaveBeenCalled()
  })

  it('renders attachment status and actions', () => {
    const onRemove = vi.fn()
    const onRetry = vi.fn()

    render(
      <AttachmentChip
        attachment={{ id: 'file-1', name: 'brief.pdf', size: 2048, status: 'error' }}
        onRemove={onRemove}
        onRetry={onRetry}
      />,
    )

    expect(screen.getByText('brief.pdf')).toBeTruthy()
    expect(screen.getByText('2 KB')).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'Retry attachment' }))
    fireEvent.click(screen.getByRole('button', { name: 'Remove attachment' }))
    expect(onRetry).toHaveBeenCalledWith('file-1')
    expect(onRemove).toHaveBeenCalledWith('file-1')
  })

  it('renders thread empty state when there are no messages', () => {
    render(<ChatThread messages={[]} />)

    expect(screen.getByText('Start a conversation')).toBeTruthy()
    expect(screen.getByText('Send a message to begin.')).toBeTruthy()
  })

  it('keeps a stable live log when the thread changes from empty to messages', () => {
    const { rerender } = render(<ChatThread messages={[]} />)

    const emptyLog = screen.getByRole('log', { name: 'Chat messages' })
    expect(emptyLog.getAttribute('aria-live')).toBe('polite')
    expect(emptyLog.getAttribute('aria-relevant')).toBe('additions text')
    expect(emptyLog.getAttribute('aria-busy')).toBe('false')

    rerender(<ChatThread messages={[{ id: 'm1', role: 'assistant', content: 'First response' }]} />)

    const populatedLog = screen.getByRole('log', { name: 'Chat messages' })
    expect(populatedLog).toBe(emptyLog)
    expect(populatedLog.textContent).toContain('First response')
  })

  it('uses a custom message renderer when provided', () => {
    const messages: ChatUiMessage[] = [{ id: 'm1', role: 'system', content: 'Audit mode' }]

    render(
      <ChatThread
        messages={messages}
        renderMessage={({ message }) => <div data-testid={`custom-${message.id}`}>{message.content}</div>}
      />,
    )

    expect(screen.getByTestId('custom-m1').textContent).toContain('Audit mode')
  })

  it('renders the message list as a polite live log while loading', () => {
    render(<ChatThread messages={[{ id: 'm1', role: 'assistant', content: 'Working' }]} isLoading />)

    const log = screen.getByRole('log', { name: 'Chat messages' })
    expect(log.getAttribute('aria-live')).toBe('polite')
    expect(log.getAttribute('aria-relevant')).toBe('additions text')
    expect(log.getAttribute('aria-busy')).toBe('true')
  })
})
