// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { ChatUiProvider, useChatUiConfig } from '../provider'

afterEach(cleanup)

function Probe() {
  const { t, renderMarkdown } = useChatUiConfig()
  return (
    <div>
      <span data-testid="t-out">{t('some.key', { count: '2' })}</span>
      <span data-testid="md-out">{renderMarkdown('**hi**')}</span>
    </div>
  )
}

describe('ChatUiProvider', () => {
  it('provides safe defaults without a provider', () => {
    render(<Probe />)
    expect(screen.getByTestId('t-out').textContent).toContain('some.key')
    expect(screen.getByTestId('md-out').textContent).toContain('**hi**')
  })

  it('uses supplied adapters', () => {
    render(
      <ChatUiProvider t={(key, params) => `${key}!${params?.count ?? ''}`} renderMarkdown={(c) => <em>{c}</em>}>
        <Probe />
      </ChatUiProvider>,
    )
    expect(screen.getByTestId('t-out').textContent).toContain('some.key!2')
    expect(screen.getByTestId('md-out').querySelector('em')).not.toBeNull()
  })

  it('keeps defaults for adapters not supplied', () => {
    render(
      <ChatUiProvider t={(key) => `T:${key}`}>
        <Probe />
      </ChatUiProvider>,
    )
    expect(screen.getByTestId('t-out').textContent).toContain('T:some.key')
    expect(screen.getByTestId('md-out').textContent).toContain('**hi**')
  })

  it('passes markdown ctx through to the renderer and defaults locale to en', () => {
    const seen: unknown[] = []
    function CtxProbe() {
      const { renderMarkdown, locale } = useChatUiConfig()
      return (
        <div>
          <span data-testid="locale-out">{locale}</span>
          {renderMarkdown('hi', { suppressSpecialistCards: true })}
          {(() => {
            seen.push('rendered')
            return null
          })()}
        </div>
      )
    }
    const renderMarkdown = vi.fn((content: string) => <b data-testid="md">{content}</b>)
    render(
      <ChatUiProvider renderMarkdown={renderMarkdown}>
        <CtxProbe />
      </ChatUiProvider>,
    )
    expect(screen.getByTestId('locale-out').textContent).toContain('en')
    expect(renderMarkdown).toHaveBeenCalledWith('hi', { suppressSpecialistCards: true })
  })

  it('supplies a provided locale', () => {
    function LocaleProbe() {
      return <span data-testid="locale-out2">{useChatUiConfig().locale}</span>
    }
    render(
      <ChatUiProvider locale="zh">
        <LocaleProbe />
      </ChatUiProvider>,
    )
    expect(screen.getByTestId('locale-out2').textContent).toContain('zh')
  })
})
