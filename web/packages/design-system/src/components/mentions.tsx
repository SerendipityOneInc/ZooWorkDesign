'use client'

import type { ComponentProps, ReactNode } from 'react'
import { validMentions, type MentionKind, type MentionReference, type MentionsValue } from './mention-value'
export { getMentionRecipients } from './mention-value'
export type { MentionKind, MentionReference, MentionsValue } from './mention-value'

export type MentionOption = {
  id: string
  kind: MentionKind
  label: string
  description?: string
  avatar?: string
  keywords?: readonly string[]
  disabled?: boolean
}
export type MentionsLabels = {
  suggestions: string; agents: string; people: string; empty: string; loading: string
  retry: string; selected: string; hint: string
}
export function MentionText({ value, onMentionClick, ...props }: Omit<ComponentProps<'span'>, 'children'> & {
  value: MentionsValue
  onMentionClick?: (mention: MentionReference) => void
}) {
  const parts: ReactNode[] = []
  let start = 0
  validMentions(value).forEach(mention => {
    parts.push(value.text.slice(start, mention.start))
    const text = value.text.slice(mention.start, mention.end)
    parts.push(onMentionClick ? <button key={mention.start} type="button" className="zc-mention-token outline-none focus-visible:ring-2 focus-visible:ring-ring" onClick={() => onMentionClick(mention)}>{text}</button> :
      <mark key={mention.start} className="zc-mention-token">{text}</mark>)
    start = mention.end
  })
  parts.push(value.text.slice(start))
  return <span {...props} data-slot="mention-text">{parts}</span>
}
