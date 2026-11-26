import { describe, expect, it } from 'vitest'

import {
  buildCardActionMessage,
  buildFormSubmitMessage,
  emojiNameToChar,
  formatMessageTime,
  formatTurnStatusLabel,
  parseQuoteAndReply,
  QUOTE_MAX_CHARS,
  shouldShowTurnStatusOnUserMessage,
  TURN_STATUS_DETAIL_COMPLETED_WITHOUT_VISIBLE_RESPONSE,
  TURN_STATUS_DETAIL_STOPPED,
  truncateQuoteText,
} from '../messages/helpers'
import type { TurnStatusView } from '../types'

const status = (over: Partial<TurnStatusView>): TurnStatusView => ({
  turnId: 't1',
  userPostId: 'p1',
  channelId: 'c1',
  phase: 'thinking',
  state: 'executing',
  seq: 1,
  terminal: false,
  updatedAt: 0,
  heartbeatAt: 0,
  ...over,
})

describe('messages/helpers', () => {
  it('parses leading blockquote into quote + reply', () => {
    expect(parseQuoteAndReply('> quoted line\n\nmy reply')).toEqual({ quote: 'quoted line', reply: 'my reply' })
    expect(parseQuoteAndReply('no quote')).toEqual({ quote: null, reply: 'no quote' })
  })

  it('leaves quotes at or below the limit untouched', () => {
    expect(truncateQuoteText('short quote')).toBe('short quote')
    const exact = 'a'.repeat(QUOTE_MAX_CHARS)
    expect(truncateQuoteText(exact)).toBe(exact)
  })

  it('truncates longer quotes to QUOTE_MAX_CHARS plus an ellipsis', () => {
    expect(truncateQuoteText('a'.repeat(QUOTE_MAX_CHARS + 50))).toBe(`${'a'.repeat(QUOTE_MAX_CHARS)}…`)
    expect(truncateQuoteText('abcdef', 3)).toBe('abc…')
  })

  it('counts code points so simple emoji and astral characters are never split', () => {
    // Each 👍 is 2 UTF-16 units — a naive slice(0, 3) would emit half a pair.
    expect(truncateQuoteText('👍👍👍👍', 3)).toBe('👍👍👍…')
    expect(Array.from(truncateQuoteText('👍👍👍👍', 3))).toHaveLength(4)
    // CJK stays intact at the boundary too.
    expect(truncateQuoteText('你好世界', 2)).toBe('你好…')
  })

  it.each(['👍🏽', '🇨🇳', '👨‍👩‍👧‍👦'])('keeps the composite grapheme %s intact at the truncation boundary', (grapheme) => {
    expect(truncateQuoteText(`a${grapheme}b`, 2)).toBe(`a${grapheme}…`)
  })

  it('keeps astral text whose UTF-16 length exceeds the limit but code-point count does not', () => {
    // 150 emoji = 300 UTF-16 units: over QUOTE_MAX_CHARS by `.length`, under it
    // by code points. Must come back untouched, with no stray ellipsis.
    const allAstral = '🙂'.repeat(QUOTE_MAX_CHARS - 50)
    expect(allAstral.length).toBeGreaterThan(QUOTE_MAX_CHARS)
    expect(truncateQuoteText(allAstral)).toBe(allAstral)
  })

  it('builds card action and form messages', () => {
    expect(buildCardActionMessage('c1', 'yes')).toBe('[ACTION:c1] yes')
    expect(buildCardActionMessage(undefined, 'yes')).toBe('yes')
    expect(buildFormSubmitMessage('f1', { a: 1 })).toBe('[FORM:f1] {"a":1}')
  })

  it('maps emoji names with :name: fallback', () => {
    expect(emojiNameToChar('fire')).toBe('\u{1f525}')
    expect(emojiNameToChar('nope_nope')).toBe(':nope_nope:')
  })

  it('formats turn status labels', () => {
    expect(formatTurnStatusLabel(status({ phase: 'tool', toolName: 'web_search' }))).toBe('Using web_search')
    expect(formatTurnStatusLabel(status({ state: 'error', errorMessage: 'boom' }))).toBe('Failed: boom')
    expect(
      formatTurnStatusLabel(
        status({ state: 'done', phase: 'done', detail: TURN_STATUS_DETAIL_COMPLETED_WITHOUT_VISIBLE_RESPONSE }),
      ),
    ).toBe('Completed without a visible response')
    expect(formatTurnStatusLabel(status({ state: 'done', phase: 'done', detail: TURN_STATUS_DETAIL_STOPPED }))).toBe(
      'Stopped',
    )
    expect(shouldShowTurnStatusOnUserMessage(status({ state: 'error' }))).toBe(true)
    expect(shouldShowTurnStatusOnUserMessage(status({ state: 'executing' }))).toBe(false)
    expect(
      shouldShowTurnStatusOnUserMessage(
        status({ state: 'done', phase: 'done', detail: TURN_STATUS_DETAIL_COMPLETED_WITHOUT_VISIBLE_RESPONSE }),
      ),
    ).toBe(true)
  })

  it('formats message time (empty for 0, string otherwise)', () => {
    expect(formatMessageTime(0, 'en')).toBe('')
    expect(formatMessageTime(Date.parse('2026-04-15T12:00:00Z'), 'en')).not.toBe('')
  })
})
