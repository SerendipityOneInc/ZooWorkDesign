export type MentionKind = 'agent' | 'person'
export type MentionReference = {
  id: string
  kind: MentionKind
  label: string
  /** UTF-16 offsets into text, including the @ prefix. End is exclusive. */
  start: number
  end: number
}
export type MentionsValue = { text: string; mentions: readonly MentionReference[] }

/** Never infer recipients from display text. Accept only intact explicit references. */
export function validMentions(value: MentionsValue): MentionReference[] {
  let end = 0
  return [...value.mentions].sort((a, b) => a.start - b.start).filter(mention => {
    if (!mention.id || !mention.label || !['agent', 'person'].includes(mention.kind) ||
      !Number.isInteger(mention.start) || !Number.isInteger(mention.end) || mention.start < end ||
      mention.end > value.text.length || value.text.slice(mention.start, mention.end) !== `@${mention.label}`) return false
    end = mention.end
    return true
  })
}

export function getMentionRecipients(value: MentionsValue) {
  const seen = new Set<string>()
  return validMentions(value).filter(mention => {
    const key = JSON.stringify([mention.kind, mention.id])
    if (seen.has(key)) return false
    seen.add(key)
    return true
  }).map(({ id, kind, label }) => ({ id, kind, label }))
}

/** An edit through a reference turns it into plain text; later references shift. */
export function replaceMentionRange(value: MentionsValue, start: number, end: number, insert: string): MentionsValue {
  const delta = insert.length - (end - start)
  return {
    text: value.text.slice(0, start) + insert + value.text.slice(end),
    mentions: validMentions(value).flatMap(mention => {
      if (mention.end <= start) return [mention]
      if (mention.start >= end) return [{ ...mention, start: mention.start + delta, end: mention.end + delta }]
      return []
    }),
  }
}

export function reconcileMentionText(value: MentionsValue, text: string): MentionsValue {
  let start = 0
  while (start < value.text.length && start < text.length && value.text[start] === text[start]) start++
  let before = value.text.length
  let after = text.length
  while (before > start && after > start && value.text[before - 1] === text[after - 1]) { before--; after-- }
  return replaceMentionRange(value, start, before, text.slice(start, after))
}

export function findMentionQuery(value: MentionsValue, caret: number) {
  const prefix = value.text.slice(0, caret)
  const start = prefix.lastIndexOf('@')
  if (start < 0 || (start > 0 && !/[\s([{（【，,：:]/u.test(prefix[start - 1]))) return null
  const query = prefix.slice(start + 1)
  if (/[\n\r@]/u.test(query) || query.length > 80 || validMentions(value).some(mention => start >= mention.start && start < mention.end)) return null
  return { start, end: caret, query }
}
