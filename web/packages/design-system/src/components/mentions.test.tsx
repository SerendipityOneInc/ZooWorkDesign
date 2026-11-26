import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { getMentionRecipients, MentionText, type MentionsValue } from './mentions'
import { findMentionQuery, reconcileMentionText, replaceMentionRange, validMentions } from './mention-value'

const initial: MentionsValue = { text: 'Hi @Market Brief and @Alex', mentions: [
  { id: 'brief', kind: 'agent', label: 'Market Brief', start: 3, end: 16 },
  { id: 'same', kind: 'person', label: 'Alex', start: 21, end: 26 },
] }
describe('mention identity and edits', () => {
  it('keeps offsets after insertion/deletion and invalidates references edited in the middle', () => {
    // A surrogate pair is two UTF-16 positions, just like textarea selectionStart.
    const prefixed = reconcileMentionText(initial, `👋${initial.text}`)
    expect(prefixed.mentions.map(item => item.start)).toEqual([5, 23])
    const edited = reconcileMentionText(initial, 'Hi @Market Summary and @Alex')
    expect(getMentionRecipients(edited)).toEqual([{ id: 'same', kind: 'person', label: 'Alex' }])
    expect(edited.mentions[0].start).toBe(23)
    expect(replaceMentionRange(initial, 0, initial.text.length, '').mentions).toEqual([])
  })
  it('validates ranges and distinguishes same-name and cross-type recipients', () => {
    const value: MentionsValue = { text: '@Alex @Alex @Alex', mentions: [
      { id: 'same', kind: 'agent', label: 'Alex', start: 0, end: 5 },
      { id: 'same', kind: 'person', label: 'Alex', start: 6, end: 11 },
      { id: 'same', kind: 'person', label: 'Alex', start: 12, end: 17 },
      { id: 'forged', kind: 'agent', label: 'Other', start: 0, end: 3 },
    ] }
    expect(getMentionRecipients(value)).toEqual([{ id: 'same', kind: 'agent', label: 'Alex' }, { id: 'same', kind: 'person', label: 'Alex' }])
    expect(validMentions({ text: '@Alex', mentions: [{ id: 'bad', kind: 'person', label: 'Alex', start: -1, end: 4 }] })).toEqual([])
    expect(getMentionRecipients({ text: '@Alex', mentions: [] })).toEqual([])
  })
  it('searches multi-word or Chinese names but excludes emails and selected references', () => {
    expect(findMentionQuery({ text: '@Market Br', mentions: [] }, 10)?.query).toBe('Market Br')
    expect(findMentionQuery({ text: '请 @市场', mentions: [] }, 5)?.query).toBe('市场')
    expect(findMentionQuery({ text: 'mail@example.com', mentions: [] }, 16)).toBeNull()
    expect(findMentionQuery(initial, 14)).toBeNull()
    expect(findMentionQuery({ text: '@Alex\nhello', mentions: [] }, 11)).toBeNull()
  })
})

describe('MentionText', () => {
  it('renders only explicit mentions as interactive message references', () => {
    const click = vi.fn()
    render(<MentionText value={initial} onMentionClick={click} />)
    fireEvent.click(screen.getByRole('button', { name: '@Alex' }))
    expect(click).toHaveBeenCalledWith(initial.mentions[1])
    expect(screen.getAllByRole('button')).toHaveLength(2)
  })
})
