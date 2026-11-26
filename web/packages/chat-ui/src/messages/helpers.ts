import type { TurnStatusView } from '../types'

export const TURN_STATUS_DETAIL_COMPLETED_WITHOUT_VISIBLE_RESPONSE = 'completed_without_visible_response'
export const TURN_STATUS_DETAIL_STOPPED = 'stopped'

// Emoji name → char mapping for common status reactions from the backend.
// Unknown names render as :name: fallback.
export const REACTION_EMOJI_MAP: Record<string, string> = {
  // Lifecycle states
  eyes: '\u{1f440}',
  brain: '\u{1f9e0}',
  thinking_face: '\u{1f914}',
  fire: '\u{1f525}',
  hammer_and_wrench: '\u{1f6e0}\u{fe0f}',
  technologist: '\u{1f468}\u{200d}\u{1f4bb}',
  man_technologist: '\u{1f468}\u{200d}\u{1f4bb}',
  zap: '\u{26a1}',
  high_voltage: '\u{26a1}',
  white_check_mark: '\u{2705}',
  x: '\u{274c}',
  warning: '\u{26a0}\u{fe0f}',
  clamp: '\u{1f5dc}\u{fe0f}',
  airplane_departure: '\u{1f6eb}',
  building_construction: '\u{1f3d7}\u{fe0f}',
  information_desk_person: '\u{1f481}',
  '+1': '\u{1f44d}',
  thumbsup: '\u{1f44d}',
  scream: '\u{1f631}',
  yawning_face: '\u{1f971}',
  fearful: '\u{1f628}',
  writing_hand: '\u270d',
  // Tool-specific
  mag: '\u{1f50d}',
  globe_with_meridians: '\u{1f310}',
  book: '\u{1f4d6}',
  memo: '\u{1f4dd}',
  pencil2: '\u270f\u{fe0f}',
  computer: '\u{1f4bb}',
  speech_balloon: '\u{1f4ac}',
  art: '\u{1f3a8}',
  frame_with_picture: '\u{1f5bc}\u{fe0f}',
  email: '\u{1f4e7}',
  calendar: '\u{1f4c5}',
  octocat: '\u{1f419}',
  clipboard: '\u{1f4cb}',
  file_folder: '\u{1f4c1}',
  outbox_tray: '\u{1f4e4}',
  inbox_tray: '\u{1f4e5}',
  hourglass_flowing_sand: '\u23f3',
}

export function emojiNameToChar(name: string): string {
  return REACTION_EMOJI_MAP[name] ?? `:${name}:`
}

export function turnStatusDotClass(status: TurnStatusView): string {
  if (status.state === 'error') return 'bg-ecap-error-text'
  if (status.state === 'unknown') return 'bg-ecap-warning-text'
  return 'bg-primary'
}

/**
 * Max length of quoted text carried into a reply, in Unicode grapheme clusters.
 *
 * Single source of truth for the quote contract: the composer's quote preview
 * and the `> ` blockquote the app prepends on send must truncate identically,
 * otherwise the preview shows text that is not what gets sent.
 */
export const QUOTE_MAX_CHARS = 200

const QUOTE_GRAPHEME_SEGMENTER = new Intl.Segmenter(undefined, { granularity: 'grapheme' })

/**
 * Truncate quoted text to `max` grapheme clusters, appending an ellipsis when cut.
 *
 * `Intl.Segmenter` keeps user-perceived characters intact, including emoji
 * modifiers, regional-indicator flags, and zero-width-joiner sequences.
 *
 * Cost is bounded by `max`, not by input length: the composer re-renders this
 * on every keystroke while a quote is pinned, and a quoted assistant reply can
 * be many KB, so neither branch may walk (or allocate) the whole string.
 */
export function truncateQuoteText(text: string, max: number = QUOTE_MAX_CHARS): string {
  // A string's UTF-16 length is always >= its grapheme count, so this cheap
  // check settles the common "short enough" case without iterating at all.
  if (text.length <= max) return text

  let count = 0
  for (const { index } of QUOTE_GRAPHEME_SEGMENTER.segment(text)) {
    if (count >= max) return `${text.slice(0, index)}…`
    count += 1
  }
  // Fewer graphemes than `max` despite the longer UTF-16 length.
  return text
}

/** Split leading `> ` blockquote lines from the user's actual reply text. */
export function parseQuoteAndReply(content: string): { quote: string | null; reply: string } {
  const lines = content.split('\n')
  const quoteLines: string[] = []
  let i = 0

  while (i < lines.length && lines[i].startsWith('> ')) {
    quoteLines.push(lines[i].slice(2))
    i++
  }
  // Skip blank lines between quote and reply
  while (i < lines.length && lines[i].trim() === '') i++

  if (quoteLines.length === 0) return { quote: null, reply: content }

  const quote = quoteLines.join('\n')
  const reply = lines.slice(i).join('\n')
  return { quote, reply }
}

export function formatMessageTime(ts: number, locale: string): string {
  if (!ts) return ''
  // Server may send seconds — normalize to ms
  const ms = ts < 1e12 ? ts * 1000 : ts
  const d = new Date(ms)
  if (isNaN(d.getTime())) return ''
  const time = d.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })
  const now = new Date()
  const isToday =
    d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate()
  if (isToday) return time
  const date = d.toLocaleDateString(locale, { month: 'short', day: 'numeric' })
  return `${date}, ${time}`
}

export function shouldShowTurnStatusOnUserMessage(status: TurnStatusView): boolean {
  return (
    status.state === 'error' ||
    status.state === 'unknown' ||
    status.detail === TURN_STATUS_DETAIL_COMPLETED_WITHOUT_VISIBLE_RESPONSE ||
    status.detail === TURN_STATUS_DETAIL_STOPPED
  )
}

export function formatTurnStatusLabel(status: TurnStatusView): string {
  if (status.state === 'unknown') return 'Status unknown'
  if (status.state === 'error') return status.errorMessage ? `Failed: ${status.errorMessage}` : 'Failed'
  if (status.detail === TURN_STATUS_DETAIL_COMPLETED_WITHOUT_VISIBLE_RESPONSE) {
    return 'Completed without a visible response'
  }
  if (status.detail === TURN_STATUS_DETAIL_STOPPED) return 'Stopped'

  switch (status.phase) {
    case 'queued':
      return 'Queued'
    case 'thinking':
      return 'Thinking'
    case 'tool':
      return status.toolName ? `Using ${status.toolName}` : 'Using tool'
    case 'compacting':
      return 'Compacting context'
    case 'responding':
      return 'Writing response'
    case 'done':
      return 'Done'
    case 'error':
      return 'Failed'
  }
}

export function buildCardActionMessage(cardId: string | undefined, value: string): string {
  return cardId ? `[ACTION:${cardId}] ${value}` : value
}

export function buildFormSubmitMessage(cardId: string | undefined, data: Record<string, unknown>): string {
  return cardId ? `[FORM:${cardId}] ${JSON.stringify(data)}` : JSON.stringify(data)
}
