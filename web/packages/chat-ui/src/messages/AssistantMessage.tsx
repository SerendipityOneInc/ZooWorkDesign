'use client'

import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { CheckIcon, Square2StackIcon } from '@heroicons/react/24/outline'
import { Alert, AlertDescription } from '@zooclaw/zooworkdesign'
import { useCallback, useState } from 'react'
import type React from 'react'

import { InteractiveCards } from '../cards'
import { LoadingDots } from '../primitives/LoadingDots'
import { useChatUiConfig } from '../provider'
import { ToolGroup } from '../tools'
import type { InteractiveCardView, ToolStep } from '../types'
import { copyToClipboard } from '../utils'
import { buildCardActionMessage, buildFormSubmitMessage, formatMessageTime } from './helpers'
import { ReplyArrowIcon } from './ReplyArrowIcon'

/* ------------------------------------------------------------------ */
/*  ThinkingBlocksCollapsible                                          */
/* ------------------------------------------------------------------ */

function ThinkingBlocksCollapsible({
  blocks,
  defaultExpanded = false,
}: {
  blocks: string[]
  defaultExpanded?: boolean
}) {
  const { t, renderMarkdown } = useChatUiConfig()
  const [manualExpanded, setManualExpanded] = useState<boolean | null>(null)
  const expanded = manualExpanded ?? defaultExpanded

  return (
    <div className="flex flex-col gap-1">
      <button
        type="button"
        aria-expanded={expanded}
        onClick={() => setManualExpanded(!expanded)}
        className="bg-muted/50 border-border hover:bg-muted/80 flex w-full cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm transition-colors"
      >
        <ChevronDownIcon
          className={`text-muted-foreground h-4 w-4 transform transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}
        />
        <span className="text-muted-foreground text-xs font-medium">
          {t('genClaw.thinking') || 'Thinking'} ({blocks.length})
        </span>
      </button>
      {expanded && (
        <div className="border-border bg-muted/30 flex flex-col gap-2 rounded-lg border px-3 py-2">
          {blocks.map((block, i) => (
            <div key={i} className="text-muted-foreground text-xs leading-relaxed">
              {renderMarkdown(block)}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  StreamingIndicator — animated dots shown at the end of streaming   */
/* ------------------------------------------------------------------ */

/** Trailing "still generating" affordance, rendered inline after the streamed
 *  text. It delegates to the package's single dots primitive (also used by the
 *  thread loader and by a running tool row) instead of owning an animation of
 *  its own — no timer, so nothing to leak when a stream ends mid-frame.
 *  `align-middle` sits the 6px dot row on the text's middle instead of its
 *  baseline, so the dots read as part of the last line. */
function StreamingIndicator() {
  return <LoadingDots className="text-muted-foreground ml-1 align-middle" />
}

/* ------------------------------------------------------------------ */
/*  AssistantMessage                                                   */
/* ------------------------------------------------------------------ */

export interface AssistantMessageView {
  /** The surrounding workspace already identifies the assistant. */
  hideSenderHeader?: boolean
  id: string
  text: string
  /** False for earlier fragments of a logical reply; removes the entire footer row. */
  showFooter?: boolean
  /** Copy/Reply text for a grouped response, while each fragment renders its own text. */
  actionText?: string
  timestamp: number
  isStreaming: boolean
  isThreadRunning?: boolean
  isSystem?: boolean
  kind: 'tool-group' | 'normal'
  toolGroup?: ToolStep[]
  interactiveCards?: InteractiveCardView[]
  thinkingBlocks?: string[]
  precedingUserQuery?: string
  botName?: string
  presentation?: 'commentary' | 'answer' | 'error'
}

export interface AssistantMessageSlots {
  avatar?: React.ReactNode
  ermpCards?: React.ReactNode
  imageAttachments?: React.ReactNode
  nonImageAttachments?: React.ReactNode
  autoDetectedCards?: React.ReactNode
  leadingAccessory?: React.ReactNode
  /** Slot with package default. When omitted, renders the package ToolGroup from
   *  view.toolGroup/precedingUserQuery/isThreadRunning. The app container passes its
   *  app ./ToolGroup wrapper element to keep the protected spec's module mock live. */
  toolGroup?: React.ReactNode
  /** Slot with package default. When omitted, renders the package InteractiveCards
   *  from view.interactiveCards + onCardAction/onCardActionError/cardsDisabled. The
   *  app container passes its app ./InteractiveCards wrapper element. */
  interactiveCards?: React.ReactNode
}

export interface AssistantMessageProps {
  view: AssistantMessageView
  slots?: AssistantMessageSlots
  indentForSelection?: boolean
  compact?: boolean
  /** Hide when the surrounding thread already displays a live activity status. */
  showStreamingIndicator?: boolean
  isLastMessage?: boolean
  isConsecutive?: boolean
  cardsDisabled?: boolean
  cardsDisabledReason?: string
  onSendMessage?: (text: string) => void
  onQuoteReply?: (content: string) => void
  onOpenSpecialist?: (agentId: string) => void
  onCardAction?: (postId: string, actionId: string, selectedOption?: string) => Promise<void>
  onCardActionError?: (error: unknown) => void
  /** Copy handler; defaults to the package copyToClipboard. */
  onCopy?: (content: string) => Promise<boolean>
}

export function AssistantMessage(props: AssistantMessageProps): React.ReactNode {
  const {
    view,
    slots,
    indentForSelection,
    compact,
    showStreamingIndicator = true,
    isLastMessage,
    isConsecutive,
    cardsDisabled,
    cardsDisabledReason,
    onSendMessage,
    onQuoteReply,
    onOpenSpecialist,
    onCardAction,
    onCardActionError,
    onCopy,
  } = props
  const { t, locale, renderMarkdown } = useChatUiConfig()
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const text = view.text
  const isStreaming = view.isStreaming
  const timestamp = view.timestamp
  const messageId = view.id
  const thinkingBlocks = view.thinkingBlocks ?? []
  const isSystem = view.isSystem ?? false
  const actionText = view.actionText ?? text
  const canCopy = !isSystem && actionText.trim().length > 0
  const precedingUserQuery = view.precedingUserQuery ?? ''
  const presentation = view.presentation ?? 'answer'

  const handleCopy = useCallback(
    async (content: string, id: string) => {
      const copy = onCopy ?? copyToClipboard
      const ok = await copy(content)
      if (ok) {
        setCopiedId(id)
        setTimeout(() => setCopiedId(null), 2000)
      }
    },
    [onCopy],
  )

  const handleCardCallback = useCallback(
    (cardId: string | undefined, value: string) => {
      onSendMessage?.(buildCardActionMessage(cardId, value))
    },
    [onSendMessage],
  )

  const handleFormSubmit = useCallback(
    (cardId: string | undefined, data: Record<string, unknown>) => {
      onSendMessage?.(buildFormSubmitMessage(cardId, data))
    },
    [onSendMessage],
  )

  const interactiveCardsNode =
    slots?.interactiveCards ??
    ((view.interactiveCards?.length ?? 0) > 0 ? (
      <InteractiveCards
        postId={messageId}
        cards={view.interactiveCards!}
        disabled={cardsDisabled}
        disabledReason={cardsDisabledReason}
        onAction={onCardAction}
        onActionError={onCardActionError}
      />
    ) : null)

  // Activity group path. It shares the assistant identity and content column:
  // if activity is the first visible entry in a run it owns the avatar/name;
  // later groups reuse the same avatar-sized spacer as commentary/answers.
  // When a single MM post carries both `props.tool_steps` AND
  // `props.ermp_cards` / `props.thinking_blocks` with empty content,
  // `aggregateToolMessages` flushes it as a `tool-group` synthetic that
  // still carries those payloads on the same message — we must surface
  // them alongside the ToolGroup, otherwise the cards/thinking get
  // silently dropped from the render. (Codex review regression.)
  if (view.kind === 'tool-group') {
    // Expand during execution, then collapse when an answer arrives or the run ends.
    // Streaming label: only when BOTH (a) the group is still last AND
    // (b) the thread is actively generating. This way, when a run
    // finishes but the next assistant text message hasn't arrived yet,
    // the pulsing dot and "running" label turn off, and the header
    // swaps from "N tools running" to "N tools used".
    const isLatest = !!isLastMessage
    const isActivelyStreaming = isLatest && !!view.isThreadRunning
    const toolGroupNode =
      slots?.toolGroup ??
      (view.toolGroup ? (
        <ToolGroup
          steps={view.toolGroup}
          defaultExpanded={isActivelyStreaming}
          isStreaming={isActivelyStreaming}
          userQuery={precedingUserQuery}
        />
      ) : null)
    const toolGroupStack = (
      <>
        {toolGroupNode}
        {thinkingBlocks.length > 0 && (
          <ThinkingBlocksCollapsible blocks={thinkingBlocks} defaultExpanded={isActivelyStreaming} />
        )}
        {slots?.ermpCards && <div className="flex flex-col gap-2">{slots.ermpCards}</div>}
        {interactiveCardsNode}
      </>
    )
    // Compact (subagent panel): flush-left column capped at the compact bubble
    // width — same geometry the compact bubble below uses.
    if (compact) {
      return (
        <div className={`flex w-full max-w-[85%] flex-col gap-2 ${indentForSelection ? 'pl-8' : ''}`}>
          {toolGroupStack}
        </div>
      )
    }
    // Main: the first activity in a run establishes assistant identity. A
    // later activity uses the same spacer as a consecutive text segment.
    return (
      <div
        className={`group relative flex justify-start gap-3 ${indentForSelection ? 'pl-8' : ''}`}
        data-testid="genclaw-tool-turn"
        data-message-kind="activity"
        data-consecutive={isConsecutive || undefined}
        data-message-id={view.id}
      >
        {slots?.leadingAccessory}
        {isConsecutive ? (
          <div aria-hidden="true" className="h-[34px] w-[34px] flex-shrink-0" />
        ) : (
          <div className="border-border flex h-[34px] w-[34px] flex-shrink-0 items-center justify-center overflow-hidden rounded-full border">
            {slots?.avatar}
          </div>
        )}
        <div className="flex min-w-0 flex-1 flex-col gap-1 pr-9">
          {!isConsecutive && !view.hideSenderHeader && (
            <div className="flex items-center gap-2">
              <span className="text-foreground text-xs font-medium">
                {isSystem ? 'System' : view.botName || 'Assistant'}
              </span>
            </div>
          )}
          {toolGroupStack}
        </div>
      </div>
    )
  }

  const isCopied = copiedId === messageId

  // For compact variant (subagent/channel), render simple bubble
  if (compact) {
    return (
      <div className="flex justify-start">
        <div className="bg-card border-border max-w-[85%] rounded-lg border px-3 py-2 text-sm">
          {text.trim() && renderMarkdown(text)}
          {interactiveCardsNode}
        </div>
      </div>
    )
  }

  return (
    <div
      className={`group relative flex justify-start gap-3 ${indentForSelection ? 'pl-8' : ''}`}
      data-testid="genclaw-bot-message"
      data-consecutive={isConsecutive || undefined}
      data-presentation={presentation}
      // Stable identity for tooling that has to tell one reply from another
      // across re-renders. A turn's streaming preview post and the final posts
      // that replace it share their opening text, so neither position nor a
      // text prefix can distinguish them — see
      // scripts/measure-streaming-smoothness.mjs.
      data-message-id={view.id}
    >
      {slots?.leadingAccessory}
      {isConsecutive ? (
        <div aria-hidden="true" className="h-[34px] w-[34px] flex-shrink-0" />
      ) : (
        <div className="border-border flex h-[34px] w-[34px] flex-shrink-0 items-center justify-center overflow-hidden rounded-full border">
          {slots?.avatar}
        </div>
      )}
      {/* Keep content inside the inset composer/quote edge without moving the avatar. */}
      <div className="relative flex min-w-0 flex-1 flex-col gap-2 pr-9">
        {/* Sender identity; reply time belongs with the actions below the content. */}
        {!isConsecutive && !view.hideSenderHeader && (
          <div className="flex items-center gap-2">
            <span className="text-foreground text-xs font-medium">
              {isSystem ? 'System' : view.botName || 'Assistant'}
            </span>
          </div>
        )}

        {/* Thinking blocks */}
        {thinkingBlocks.length > 0 && (
          <ThinkingBlocksCollapsible
            blocks={thinkingBlocks}
            defaultExpanded={isStreaming && (!text.trim() || presentation === 'commentary')}
          />
        )}

        {/* ERMP cards */}
        {slots?.ermpCards && <div className="flex flex-col gap-2">{slots.ermpCards}</div>}

        {/* Interactive cards (card-kit via Mattermost attachments) */}
        {interactiveCardsNode}

        {/* Main text content with inline image attachments */}
        {text.trim() &&
          (presentation === 'error' ? (
            <>
              <Alert variant="destructive" className="shadow-none" data-testid="genclaw-assistant-text">
                <AlertDescription>
                  {renderMarkdown(text, {
                    onCardCallback: handleCardCallback,
                    onCardFormSubmit: handleFormSubmit,
                    onSendMessage,
                    onOpenSpecialist,
                    suppressSpecialistCards: isStreaming,
                    translate: t,
                  })}
                </AlertDescription>
              </Alert>
              {slots?.imageAttachments}
            </>
          ) : (
            <div
              className={`pt-1 leading-[1.7] [&_.prose>div:last-child>:last-child]:mb-0 ${
                presentation === 'commentary' ? 'text-muted-foreground text-[13px]' : 'text-sm'
              }`}
              data-testid="genclaw-assistant-text"
            >
              {renderMarkdown(text, {
                onCardCallback: handleCardCallback,
                onCardFormSubmit: handleFormSubmit,
                onSendMessage,
                onOpenSpecialist,
                suppressSpecialistCards: isStreaming,
                translate: t,
              })}
              {slots?.imageAttachments}
              {isStreaming && showStreamingIndicator && <StreamingIndicator />}
            </div>
          ))}

        {/* Image-only messages with no text */}
        {!text.trim() && slots?.imageAttachments}

        {/* Non-image attachments (audio, video, files) always rendered separately */}
        {slots?.nonImageAttachments}

        {/* Auto-detected media cards from URLs in bot text */}
        {slots?.autoDetectedCards && <div className="flex flex-col gap-2">{slots.autoDetectedCards}</div>}

        {/* Progress commentary has no footer, even after its physical post seals.
            Final attachment/card-only replies still retain their completion time. */}
        {view.showFooter !== false && !isStreaming && presentation !== 'commentary' && (canCopy || timestamp > 0) && (
          <div className="flex items-center justify-start gap-0.5 opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100">
            {canCopy && (
              <>
                <div className="group/tip relative inline-flex">
                  <button
                    type="button"
                    aria-label={isCopied ? 'Copied' : 'Copy'}
                    onClick={() => handleCopy(actionText, messageId)}
                    className="text-muted-foreground hover:text-foreground flex h-7 w-7 cursor-pointer items-center justify-center rounded-md transition-colors"
                  >
                    {isCopied ? <CheckIcon className="h-4 w-4" /> : <Square2StackIcon className="h-4 w-4" />}
                  </button>
                  <div className="pointer-events-none absolute top-full left-1/2 z-50 mt-1 -translate-x-1/2 opacity-0 transition-opacity duration-200 group-hover/tip:opacity-100">
                    <div className="bg-ecap-tooltip-bg text-ecap-tooltip-text rounded-md px-2 py-1 text-xs whitespace-nowrap shadow-md">
                      {isCopied ? 'Copied' : 'Copy'}
                    </div>
                  </div>
                </div>
                {onQuoteReply && (
                  <div className="group/tip relative inline-flex">
                    <button
                      type="button"
                      aria-label="Reply"
                      onClick={() => onQuoteReply(actionText)}
                      className="text-muted-foreground hover:text-foreground flex h-7 w-7 cursor-pointer items-center justify-center rounded-md transition-colors"
                    >
                      <ReplyArrowIcon className="h-4 w-4" />
                    </button>
                    <div className="pointer-events-none absolute top-full left-1/2 z-50 mt-1 -translate-x-1/2 opacity-0 transition-opacity duration-200 group-hover/tip:opacity-100">
                      <div className="bg-ecap-tooltip-bg text-ecap-tooltip-text rounded-md px-2 py-1 text-xs whitespace-nowrap shadow-md">
                        Reply
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
            {timestamp > 0 && (
              <time dateTime={new Date(timestamp).toISOString()} className="text-muted-foreground ml-1 text-xs">
                {formatMessageTime(timestamp, locale)}
              </time>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
