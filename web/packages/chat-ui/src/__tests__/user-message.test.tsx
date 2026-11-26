// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { UserMessage } from '../messages'
import { ChatUiProvider } from '../provider'

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

const echoT = (key: string) => key
const renderUM = (ui: React.ReactElement) => render(<ChatUiProvider t={echoT}>{ui}</ChatUiProvider>)
const view = (over: object = {}) => ({ id: 'u1', text: 'hello there', timestamp: Date.now(), ...over })

describe('UserMessage', () => {
  it('can label an external participant without attributing their messages to the Web viewer', () => {
    renderUM(<UserMessage view={{ ...view(), senderLabel: 'User' }} />)
    expect(screen.getByText('User')).toBeInTheDocument()
    expect(screen.queryByText('common.you')).not.toBeInTheDocument()
  })
  it('renders the bubble with markdown text, name label, and avatar slot', () => {
    renderUM(<UserMessage view={view()} slots={{ avatar: <i data-testid="av" /> }} />)
    const root = screen.getByTestId('genclaw-user-message')
    expect(root.textContent).toContain('hello there')
    expect(root.textContent).toContain('common.you')
    expect(screen.getByTestId('genclaw-user-message-content')).toHaveClass('font-medium')
    screen.getByTestId('av')
  })

  it('renders quoted reply block split from the reply text', () => {
    renderUM(<UserMessage view={view({ text: '> earlier words\n\nmy answer' })} />)
    screen.getByText('earlier words')
    expect(screen.getByTestId('genclaw-user-message').textContent).toContain('my answer')
  })

  it('renders card-action pill instead of bubble for [ACTION:] messages', () => {
    renderUM(<UserMessage view={view({ text: '[ACTION:c1] option_a' })} />)
    expect(screen.getByTestId('genclaw-user-message').textContent).toContain('option a')
    expect(screen.getByText(/option a/).parentElement).toHaveClass('font-medium')
    expect(screen.queryByTestId('genclaw-user-copy')).toBeNull()
  })

  it('renders card-action pill after extra whitespace for [ACTION:] messages', () => {
    renderUM(<UserMessage view={view({ text: '[ACTION:c1]    option_a' })} />)
    expect(screen.getByTestId('genclaw-user-message').textContent).toContain('option a')
  })

  it.each([
    { name: 'attachment-only upload', text: '', attachments: <span>photo.png</span> },
    { name: 'card action', text: '[ACTION:c1] option_a', attachments: undefined },
    { name: 'form submission', text: '[FORM:c1] {}', attachments: undefined },
  ])('keeps the time below a $name without a copy button', ({ text, attachments }) => {
    const timestamp = Date.parse('2026-09-18T04:00:00Z')
    const { container } = renderUM(<UserMessage view={view({ text, timestamp })} slots={{ attachments }} />)
    const time = container.querySelector('time')
    expect(time).toHaveAttribute('datetime', new Date(timestamp).toISOString())
    expect(time?.textContent).not.toBe('')
    expect(screen.queryByTestId('genclaw-user-copy')).not.toBeInTheDocument()
    const content = attachments ? screen.getByText('photo.png') : screen.getByText(/已选择|已提交表单/)
    expect(content.compareDocumentPosition(time!)).toBe(Node.DOCUMENT_POSITION_FOLLOWING)
  })

  it('renders reactions with counts and turn status when error state', () => {
    renderUM(
      <UserMessage
        view={view({
          reactions: [{ name: 'fire', count: 2 }],
          turnStatus: {
            turnId: 't1', userPostId: 'u1', channelId: 'c1', phase: 'error', state: 'error',
            seq: 1, terminal: true, updatedAt: 0, heartbeatAt: 0, errorMessage: 'boom',
          },
        })}
      />,
    )
    expect(screen.getByTestId('genclaw-turn-status').textContent).toContain('Failed: boom')
    screen.getByText('\u{1f525}')
    screen.getByText('2')
  })

  it('copies the reply text with feedback', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    const original = Object.getOwnPropertyDescriptor(navigator, 'clipboard')
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true })
    try {
      renderUM(<UserMessage view={view()} />)
      fireEvent.click(screen.getByTestId('genclaw-user-copy'))
      expect(writeText).toHaveBeenCalledWith('hello there')
    } finally {
      if (original) Object.defineProperty(navigator, 'clipboard', original)
      else delete (navigator as { clipboard?: unknown }).clipboard
    }
  })

  it('compact variant renders a simple bubble without header', () => {
    renderUM(<UserMessage view={view()} compact />)
    expect(screen.queryByTestId('genclaw-user-message')).toBeNull()
    expect(screen.getByTestId('genclaw-user-message-content')).toHaveClass('font-medium')
    screen.getByText('hello there')
  })
})
