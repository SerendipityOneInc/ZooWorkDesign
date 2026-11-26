'use client'

import { CheckIcon, Square2StackIcon } from '@heroicons/react/24/outline'
import { useMemo, useState } from 'react'
import type React from 'react'

import { useChatUiConfig } from '../provider'
import type { TurnStatusView } from '../types'
import { copyToClipboard } from '../utils'
import {
  emojiNameToChar,
  formatMessageTime,
  formatTurnStatusLabel,
  parseQuoteAndReply,
  shouldShowTurnStatusOnUserMessage,
  turnStatusDotClass,
} from './helpers'
import { ReplyArrowIcon } from './ReplyArrowIcon'

export interface UserMessageView {
  id: string
  text: string
  /** Original reply content when display text has extracted media. */
  actionText?: string
  timestamp: number
  senderLabel?: string
  reactions?: { name: string; count: number }[]
  turnStatus?: TurnStatusView
}

export interface UserMessageSlots {
  avatar?: React.ReactNode
  attachments?: React.ReactNode
  autoDetectedCards?: React.ReactNode
  leadingAccessory?: React.ReactNode
  /** Rendered where the old <MessageActions .../> call sat (null in prod, but the
   *  protected app spec asserts its module mock — app passes the app element). */
  trailingActions?: React.ReactNode
}

export interface UserMessageProps {
  view: UserMessageView
  slots?: UserMessageSlots
  indentForSelection?: boolean
  compact?: boolean
  isLastMessage?: boolean
  onQuoteReply?: (content: string) => void
  /** Copy handler; defaults to the package copyToClipboard. App passes its
   *  ./MessageActions re-export to keep the spec's module mock live + app logger. */
  onCopy?: (content: string) => Promise<boolean>
}

export function UserMessage(props: UserMessageProps): React.ReactNode {
  const { view, slots, indentForSelection, compact, isLastMessage, onCopy } = props
  const { t, locale, renderMarkdown } = useChatUiConfig()
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const text = view.text
  const timestamp = view.timestamp
  const messageId = view.id
  const reactions = view.reactions ?? []
  const turnStatus = view.turnStatus
  const showTurnStatus = turnStatus !== undefined && shouldShowTurnStatusOnUserMessage(turnStatus)

  // Parse quote/reply structure from the text
  const { quote, reply } = useMemo(() => parseQuoteAndReply(text), [text])
  const truncatedQuote = quote ? (quote.length > 120 ? quote.slice(0, 120) + '\u2026' : quote) : null

  // Detect card interaction callbacks: [ACTION:card_id] value or [FORM:card_id] {...}
  const actionMatch = reply.match(/^\[ACTION:[^\]]*\]\s*(\S.*)$/)
  const formMatch = !actionMatch && reply.match(/^\[FORM:[^\]]*\]\s*/)
  const isCardAction = !!(actionMatch || formMatch)
  const actionText = view.actionText ?? reply
  const canCopy = !isCardAction && actionText.trim().length > 0

  const handleCopy = async (content: string, id: string) => {
    const copy = onCopy ?? copyToClipboard
    const ok = await copy(content)
    if (ok) {
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    }
  }

  const isCopied = copiedId === messageId

  // For compact variant (subagent/channel), render simple bubble
  if (compact) {
    return (
      <div className="flex justify-end">
        <div className="flex max-w-[85%] min-w-0 flex-col items-end gap-2">
          {slots?.attachments && <div className="w-full overflow-hidden">{slots.attachments}</div>}
          {text.trim() && (
            <div
              data-testid="genclaw-user-message-content"
              className="border-border bg-muted rounded-lg border px-3 py-2 text-sm font-medium"
            >
              {renderMarkdown(text)}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div
      className={`group relative flex justify-end gap-3 ${indentForSelection ? 'pl-8' : ''}`}
      data-testid="genclaw-user-message"
    >
      {slots?.leadingAccessory}
      <div className="relative max-w-[85%]">
        <div className="mb-1 flex items-center justify-end gap-2">
          <span className="text-foreground text-xs font-medium">{view.senderLabel ?? t('common.you')}</span>
        </div>

        {/* Quoted reference block — visually separate from the reply */}
        {truncatedQuote && (
          <div className="border-border/60 bg-muted/50 mb-1.5 flex items-center gap-2 rounded-xl border px-3 py-2">
            <span className="bg-border/60 text-muted-foreground inline-flex shrink-0 items-center gap-1 rounded-md px-1.5 py-0.5">
              <ReplyArrowIcon className="h-3 w-3" />
              <span className="text-[10px] font-medium tracking-wider uppercase">Reply</span>
            </span>
            <p className="text-muted-foreground min-w-0 flex-1 truncate text-xs">{truncatedQuote}</p>
          </div>
        )}

        {/* User's actual message */}
        {isCardAction ? (
          <div className="border-primary/20 bg-primary/10 text-primary inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium">
            <CheckIcon className="h-4 w-4" />
            <span>
              {formMatch
                ? '\u5DF2\u63D0\u4EA4\u8868\u5355'
                : `\u5DF2\u9009\u62E9: ${actionMatch![1].replace(/_/g, ' ')}`}
            </span>
          </div>
        ) : (
          <div className="flex min-w-0 flex-col items-end gap-2">
            {slots?.attachments && <div className="w-full overflow-hidden">{slots.attachments}</div>}
            {(reply.trim() || slots?.autoDetectedCards || (view.reactions?.length ?? 0) > 0 || showTurnStatus) && (
              <div className="text-foreground w-fit rounded-2xl bg-[var(--ecap-chat-user-bg)] px-[18px] py-2.5 text-sm leading-[1.7]">
                <div data-testid="genclaw-user-message-content" className="font-medium">
                  {renderMarkdown(reply)}
                </div>
                {slots?.autoDetectedCards && <div className="mt-2 flex flex-col gap-2">{slots.autoDetectedCards}</div>}
                {/* Bot activity reactions (emoji-only, no Assistant name). */}
                {reactions.length > 0 && (
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    {reactions.map(({ name, count }) => (
                      <span
                        key={name}
                        className="text-muted-foreground inline-flex items-center gap-1"
                        title={`:${name}:`}
                      >
                        <span className="text-xl leading-none">{emojiNameToChar(name)}</span>
                        {count > 1 && <span className="text-xs">{count}</span>}
                      </span>
                    ))}
                  </div>
                )}
                {showTurnStatus && (
                  <div
                    data-testid="genclaw-turn-status"
                    className="text-muted-foreground mt-2 flex max-w-full items-center gap-1.5 text-xs leading-none"
                  >
                    <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${turnStatusDotClass(turnStatus)}`} />
                    <span className="min-w-0 truncate">{formatTurnStatusLabel(turnStatus)}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {(canCopy || timestamp > 0) && (
          <div className="mt-2 flex items-center justify-end gap-1 opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100">
            {timestamp > 0 && (
              <time dateTime={new Date(timestamp).toISOString()} className="text-muted-foreground text-xs">
                {formatMessageTime(timestamp, locale)}
              </time>
            )}
            {canCopy && (
              <div className="group/tip relative inline-flex">
                <button
                  type="button"
                  aria-label={isCopied ? 'Copied' : 'Copy'}
                  data-testid="genclaw-user-copy"
                  onClick={() => handleCopy(actionText, messageId)}
                  className="text-muted-foreground hover:text-foreground flex h-7 w-7 items-center justify-center rounded-md transition-colors"
                >
                  {isCopied ? <CheckIcon className="h-4 w-4" /> : <Square2StackIcon className="h-4 w-4" />}
                </button>
                <div className="pointer-events-none absolute top-full left-1/2 z-50 mt-1 -translate-x-1/2 opacity-0 transition-opacity duration-200 group-hover/tip:opacity-100">
                  <div className="bg-ecap-tooltip-bg text-ecap-tooltip-text rounded-md px-2 py-1 text-xs whitespace-nowrap shadow-md">
                    {isCopied ? 'Copied' : 'Copy'}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Hover action buttons — only on the last message */}
        {actionText && !isCardAction && isLastMessage && slots?.trailingActions}
      </div>
      {slots?.avatar}
    </div>
  )
}
