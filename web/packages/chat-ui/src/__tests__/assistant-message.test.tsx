// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { AssistantMessage } from '../messages'
import { ChatUiProvider } from '../provider'

afterEach(cleanup)

const echoT = (key: string) => key
const renderAM = (ui: React.ReactElement, renderMarkdown?: (c: string, ctx?: unknown) => React.ReactNode) =>
  render(
    <ChatUiProvider t={echoT} renderMarkdown={renderMarkdown}>
      {ui}
    </ChatUiProvider>,
  )
const view = (over: object = {}) => ({
  id: 'a1', text: 'bot says hi', timestamp: Date.now(), isStreaming: false, kind: 'normal' as const, ...over,
})

describe('AssistantMessage', () => {
  it('renders one footer after a multi-part reply and copies/quotes the whole answer', () => {
    const onCopy = vi.fn().mockResolvedValue(false)
    const onQuoteReply = vi.fn()
    const timestamp = Date.parse('2026-09-18T05:00:00Z')
    const { container } = renderAM(<>
      <AssistantMessage view={view({ id: 'first', text: 'First part', showFooter: false })} />
      <AssistantMessage view={view({ id: 'image', text: '', showFooter: false })} slots={{ imageAttachments: <span>photo.png</span> }} isConsecutive />
      <AssistantMessage view={view({ id: 'last', text: 'Last part', timestamp, actionText: 'First part\n\nLast part' })} onCopy={onCopy} onQuoteReply={onQuoteReply} isConsecutive />
    </>)
    expect(screen.getByText('First part')).toBeInTheDocument()
    expect(screen.getByText('photo.png')).toBeInTheDocument()
    expect(screen.getByText('Last part')).toBeInTheDocument()
    expect(container.querySelectorAll('time')).toHaveLength(1)
    expect(container.querySelector('time')).toHaveAttribute('datetime', new Date(timestamp).toISOString())
    expect(screen.getAllByRole('button', { name: 'Copy' })).toHaveLength(1)
    fireEvent.click(screen.getByRole('button', { name: 'Copy' }))
    fireEvent.click(screen.getByRole('button', { name: 'Reply' }))
    expect(onCopy).toHaveBeenCalledWith('First part\n\nLast part')
    expect(onQuoteReply).toHaveBeenCalledWith('First part\n\nLast part')
  })

  it('renders bubble with name, markdown text, avatar and ermp slots', () => {
    renderAM(
      <AssistantMessage
        view={view({ botName: 'Clawdia' })}
        slots={{ avatar: <i data-testid="av" />, ermpCards: <i data-testid="ermp" /> }}
      />,
    )
    const root = screen.getByTestId('genclaw-bot-message')
    expect(root.textContent).toContain('Clawdia')
    expect(root.textContent).toContain('bot says hi')
    screen.getByTestId('av')
    screen.getByTestId('ermp')
  })

  // Tooling needs to tell one reply from another across re-renders. A turn's
  // streaming preview post and the final posts replacing it share their opening
  // text and shift position, so the post id is the only usable identity.
  it('exposes the message id as a DOM attribute', () => {
    renderAM(<AssistantMessage view={view({ id: 'post-xyz' })} />)
    expect(screen.getByTestId('genclaw-bot-message').getAttribute('data-message-id')).toBe('post-xyz')
  })

  it('hides identity chrome for a consecutive segment', () => {
    renderAM(
      <AssistantMessage view={view({ botName: 'Clawdia' })} isConsecutive slots={{ avatar: <img alt="bot" /> }} />,
    )
    expect(screen.queryByText('Clawdia')).toBeNull()
    expect(screen.queryByAltText('bot')).toBeNull()
  })

  it('renders commentary as a muted timeline segment', () => {
    renderAM(<AssistantMessage view={view({ presentation: 'commentary' })} />)
    const message = screen.getByTestId('genclaw-bot-message')
    expect(message.getAttribute('data-presentation')).toBe('commentary')
    expect(screen.getByTestId('genclaw-assistant-text').className).toContain('text-muted-foreground')
  })

  it.each([true, false])('omits commentary actions and time when the thread running state is %s', (isThreadRunning) => {
    const { container } = renderAM(
      <AssistantMessage
        view={view({ presentation: 'commentary', isThreadRunning })}
        onQuoteReply={vi.fn()}
      />,
    )
    fireEvent.mouseOver(screen.getByTestId('genclaw-bot-message'))
    expect(screen.getByText('bot says hi')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Copy' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Reply' })).not.toBeInTheDocument()
    expect(container.querySelector('time')).not.toBeInTheDocument()
  })

  it('keeps image attachments visible in an error presentation', () => {
    renderAM(
      <AssistantMessage
        view={view({ presentation: 'error' })}
        slots={{ imageAttachments: <i data-testid="error-image-attachment" /> }}
      />,
    )

    screen.getByTestId('genclaw-assistant-text')
    screen.getByTestId('error-image-attachment')
  })

  it.each(['imageAttachments', 'nonImageAttachments', 'ermpCards', 'interactiveCards', 'autoDetectedCards'] as const)(
    'keeps the completion time below %s when there is no text',
    (slot) => {
      const timestamp = Date.parse('2026-09-18T04:00:00Z')
      const { container } = renderAM(
        <AssistantMessage
          view={view({ text: '', timestamp })}
          slots={{ [slot]: <span>message content</span> }}
          onQuoteReply={vi.fn()}
        />,
      )
      const time = container.querySelector('time')
      expect(time).toHaveAttribute('datetime', new Date(timestamp).toISOString())
      expect(screen.getByText('message content').compareDocumentPosition(time!)).toBe(Node.DOCUMENT_POSITION_FOLLOWING)
      expect(screen.queryByRole('button', { name: 'Copy' })).not.toBeInTheDocument()
      expect(screen.queryByRole('button', { name: 'Reply' })).not.toBeInTheDocument()
    },
  )

  it('keeps the time on system messages without offering text actions', () => {
    const { container } = renderAM(<AssistantMessage view={view({ isSystem: true })} onQuoteReply={vi.fn()} />)
    expect(container.querySelector('time')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Copy' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Reply' })).not.toBeInTheDocument()
  })

  it('only shows the time on an attachment-only reply after streaming completes', () => {
    const timestamp = Date.parse('2026-09-18T04:00:00Z')
    const message = (isStreaming: boolean) => (
      <ChatUiProvider t={echoT}>
        <AssistantMessage view={view({ text: '', timestamp, isStreaming })} slots={{ imageAttachments: <span>photo.png</span> }} />
      </ChatUiProvider>
    )
    const { container, rerender } = render(message(true))
    expect(container.querySelector('time')).not.toBeInTheDocument()
    rerender(message(false))
    expect(container.querySelector('time')).toHaveAttribute('datetime', new Date(timestamp).toISOString())
  })

  it('omits the activity timestamp both during and after execution', () => {
    const timestamp = Date.parse('2026-09-18T04:00:00Z')
    const message = (isThreadRunning: boolean) => (
      <ChatUiProvider t={echoT}>
        <AssistantMessage
          view={view({ kind: 'tool-group', text: '', timestamp, isThreadRunning })}
          slots={{ toolGroup: <span>Tool activity</span> }}
          isLastMessage
        />
      </ChatUiProvider>
    )
    const { container, rerender } = render(message(true))
    expect(container.querySelector('time')).not.toBeInTheDocument()
    rerender(message(false))
    expect(screen.getByText('Tool activity')).toBeInTheDocument()
    expect(container.querySelector('time')).not.toBeInTheDocument()
  })

  it('passes rich ctx to renderMarkdown for the main text', () => {
    const renderMarkdown = vi.fn((c: string, _ctx?: unknown) => <span>{c}</span>)
    const onSendMessage = vi.fn()
    renderAM(<AssistantMessage view={view({ isStreaming: true })} onSendMessage={onSendMessage} />, renderMarkdown)
    const mainCall = renderMarkdown.mock.calls.find(([c]) => c === 'bot says hi')
    expect(mainCall).toBeDefined()
    const ctx = mainCall![1] as Record<string, unknown>
    expect(ctx.suppressSpecialistCards).toBe(true)
    ;(ctx.onCardCallback as (id: string, v: string) => void)('c9', 'go')
    expect(onSendMessage).toHaveBeenCalledWith('[ACTION:c9] go')
  })

  // The trailing "still generating" affordance used to be an ASCII spinner
  // (| / — \) driven by a 150ms setInterval. It now reuses the package's one
  // bouncing-dots primitive, so it matches the running tool row / thread loader
  // and there is no interval left to leak when a stream ends.
  describe('streaming indicator', () => {
    it('appends the shared bouncing dots inline after the streamed text', () => {
      const { container } = renderAM(<AssistantMessage view={view({ isStreaming: true })} />)
      const dots = screen.getByLabelText('Loading')
      expect(dots.querySelectorAll('.animate-bounce')).toHaveLength(3)
      // Inline: same block as the streamed text, and aligned to it rather than
      // dropping to the baseline.
      expect(dots.parentElement!.textContent).toContain('bot says hi')
      expect(dots.className).toContain('align-middle')
      // No ASCII spinner frame survives anywhere in the bubble.
      for (const frame of ['|', '/', '—', '\\']) expect(container.textContent).not.toContain(frame)
    })

    it('omits the indicator once streaming ends', () => {
      renderAM(<AssistantMessage view={view()} />)
      expect(screen.queryByLabelText('Loading')).toBeNull()
    })

    it('can delegate the live status to the thread without treating the reply as complete', () => {
      renderAM(<AssistantMessage view={view({ isStreaming: true })} showStreamingIndicator={false} />)
      expect(screen.getByTestId('genclaw-assistant-text').textContent).toContain('bot says hi')
      expect(screen.queryByLabelText('Loading')).toBeNull()
      expect(screen.queryByRole('button', { name: 'Copy' })).toBeNull()
    })
  })

  it('keeps earlier activity and thinking summaries collapsed but available alongside assistant identity', () => {
    renderAM(
      <AssistantMessage
        view={view({
          kind: 'tool-group',
          toolGroup: [{ id: 't1', name: 'read', phase: 'done', startedAt: 1 }],
          thinkingBlocks: ['pondering'],
        })}
        isLastMessage={false}
        slots={{ avatar: <i data-testid="activity-avatar" /> }}
      />,
    )
    screen.getByTestId('genclaw-tool-group')
    expect(screen.queryByTestId('genclaw-bot-message')).toBeNull()
    screen.getByTestId('genclaw-tool-turn')
    screen.getByTestId('activity-avatar')
    screen.getByText(/genClaw.thinking|Thinking/)
    expect(screen.queryByTestId('genclaw-tool-group-list')).toBeNull()
    expect(screen.queryByText('pondering')).toBeNull()
    fireEvent.click(screen.getByTestId('genclaw-tool-group-toggle'))
    fireEvent.click(screen.getByRole('button', { name: /genClaw.thinking|Thinking/ }))
    expect(screen.getByTestId('genclaw-tool-group-list')).toBeInTheDocument()
    expect(screen.getByText('pondering')).toBeInTheDocument()
  })

  it.each([
    ['the answer starts', false, true],
    ['the run ends before another message arrives', true, false],
  ])('collapses activity and thinking when %s', (_label, isLastMessage, isThreadRunning) => {
    const activity = view({
      kind: 'tool-group',
      text: '',
      toolGroup: [{ id: 't1', name: 'read', phase: 'done', startedAt: 1 }],
      thinkingBlocks: ['working summary'],
      isThreadRunning: true,
    })
    const { rerender } = renderAM(<AssistantMessage view={activity} isLastMessage />)
    expect(screen.getByTestId('genclaw-tool-group-list')).toBeInTheDocument()
    expect(screen.getByText('working summary')).toBeInTheDocument()
    rerender(
      <ChatUiProvider t={echoT}>
        <AssistantMessage view={{ ...activity, isThreadRunning }} isLastMessage={isLastMessage} />
      </ChatUiProvider>,
    )
    expect(screen.queryByTestId('genclaw-tool-group-list')).toBeNull()
    expect(screen.queryByText('working summary')).toBeNull()
    fireEvent.click(screen.getByTestId('genclaw-tool-group-toggle'))
    fireEvent.click(screen.getByRole('button', { name: /genClaw.thinking|Thinking/ }))
    expect(screen.getByTestId('genclaw-tool-group-list')).toBeInTheDocument()
    expect(screen.getByText('working summary')).toBeInTheDocument()
  })

  it('renders interactive cards through the package InteractiveCards', () => {
    const onCardAction = vi.fn().mockResolvedValue(undefined)
    renderAM(
      <AssistantMessage
        view={view({ interactiveCards: [{ kind: 'buttons', text: '', buttons: [{ actionId: 'b1', label: 'Go', style: 'primary' }] }] })}
        onCardAction={onCardAction}
      />,
    )
    fireEvent.click(screen.getByRole('button', { name: 'Go' }))
    expect(onCardAction).toHaveBeenCalledWith('a1', 'b1', undefined)
  })

  it('renders package-default interactive cards disabled without an action handler', () => {
    renderAM(
      <AssistantMessage
        view={view({ interactiveCards: [{ kind: 'buttons', text: '', buttons: [{ actionId: 'b1', label: 'Go', style: 'primary' }] }] })}
      />,
    )
    expect((screen.getByRole('button', { name: 'Go' }) as HTMLButtonElement).disabled).toBe(true)
  })

  it('compact variant renders reduced bubble', () => {
    renderAM(<AssistantMessage view={view()} compact />)
    expect(screen.queryByTestId('genclaw-bot-message')).toBeNull()
    screen.getByText('bot says hi')
  })

  it('hover action bar omits reply without onQuoteReply and fires it when present', () => {
    const onQuoteReply = vi.fn()
    renderAM(<AssistantMessage view={view()} onQuoteReply={onQuoteReply} />)
    const buttons = screen.getAllByRole('button')
    fireEvent.click(buttons[buttons.length - 1])
    expect(onQuoteReply).toHaveBeenCalledWith('bot says hi')
  })

  // Tool cards used to render flush-left while the reply they belong to sat
  // after the avatar column, so a run read as two misaligned columns. The card
  // now shares the assistant text column's offset and flexible width, including
  // the right inset that keeps text inside the composer edge.
  describe('tool-group column alignment', () => {
    const toolGroupView = () =>
      view({ kind: 'tool-group', toolGroup: [{ id: 't1', name: 'read', phase: 'done', startedAt: 1 }] })
    const classToken = (el: Element, prefix: string) =>
      el.className.split(/\s+/).find((c) => c.startsWith(prefix))

    it('main variant shares the avatar offset and flexible content width with text', () => {
      // Reference geometry: the regular main bubble owns the avatar column and
      // content cap that first activity entries must share.
      const { container: main } = renderAM(<AssistantMessage view={view()} />)
      const mainRow = main.querySelector('[data-testid="genclaw-bot-message"]')!
      const textColumn = mainRow.children[1]

      const { container } = renderAM(<AssistantMessage view={toolGroupView()} isLastMessage />)
      const card = screen.getByTestId('genclaw-tool-group')
      const column = card.parentElement!
      const row = column.parentElement!

      expect(row).toBe(container.firstElementChild)
      // Left edge: same avatar dimensions + same row gap as the assistant bubble.
      expect(row.firstElementChild!.className).toContain('h-[34px]')
      expect(row.firstElementChild!.className).toContain('w-[34px]')
      expect(classToken(row, 'gap-')).toBe(classToken(mainRow, 'gap-'))
      // Both columns fill the row; comparing two missing max-width classes
      // would pass even if the content columns no longer matched.
      expect(textColumn).toHaveClass('min-w-0', 'flex-1')
      expect(column).toHaveClass('min-w-0', 'flex-1')
      expect(classToken(textColumn, 'pr-')).toBeDefined()
      expect(classToken(column, 'pr-')).toBe(classToken(textColumn, 'pr-'))
      // The card fills that column instead of carrying its own cap.
      expect(card.className).toContain('w-full')
      expect(classToken(card, 'max-w-')).toBeUndefined()
    })

    it('compact variant keeps the flush-left card', () => {
      const { container } = renderAM(<AssistantMessage view={toolGroupView()} compact isLastMessage />)
      const card = screen.getByTestId('genclaw-tool-group')
      const wrapper = card.parentElement!
      // No avatar-column row is introduced: the card's parent is the top-level
      // stack, still flush-left and capped at the compact bubble width.
      expect(wrapper).toBe(container.firstElementChild)
      expect(classToken(wrapper, 'max-w-')).toBe('max-w-[85%]')
      expect(classToken(wrapper, 'ml-')).toBeUndefined()
      expect(classToken(wrapper, 'pl-')).toBeUndefined()
    })
  })
})
