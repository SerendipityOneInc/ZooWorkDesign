import type React from 'react'

import { LoadingDots } from '../primitives/LoadingDots'
import type { ChatMessageRenderer, ChatUiLabels, ChatUiMessage } from '../types'
import { cx, mergeLabels } from '../utils'
import { ChatMessage } from './ChatMessage'

export interface ChatThreadProps {
  messages: ChatUiMessage[]
  labels?: ChatUiLabels
  isLoading?: boolean
  emptyState?: React.ReactNode
  renderMessage?: ChatMessageRenderer
  onRemoveAttachment?: (id: string) => void
  onRetryAttachment?: (id: string) => void
  className?: string
}

export function ChatThread({
  messages,
  labels,
  isLoading = false,
  emptyState,
  renderMessage,
  onRemoveAttachment,
  onRetryAttachment,
  className,
}: ChatThreadProps) {
  const mergedLabels = mergeLabels(labels)
  const isEmpty = messages.length === 0 && !isLoading

  return (
    <section
      className={cx(
        'min-h-0 flex-1',
        isEmpty ? 'flex items-center justify-center p-6' : 'overflow-y-auto py-4',
        className,
      )}
      aria-label="Chat messages"
      role="log"
      aria-live="polite"
      aria-relevant="additions text"
      aria-busy={isLoading}
    >
      {isEmpty ? (
        emptyState ?? (
          <div className="text-center">
            <h2 className="text-base font-semibold text-[color:var(--foreground)]">{mergedLabels.emptyTitle}</h2>
            <p className="mt-1 text-sm text-[color:var(--chat-ui-muted-foreground,#737373)]">
              {mergedLabels.emptyDescription}
            </p>
          </div>
        )
      ) : (
        messages.map((message) =>
          renderMessage ? (
            <div key={message.id}>{renderMessage({ message, labels: mergedLabels })}</div>
          ) : (
            <ChatMessage
              key={message.id}
              message={message}
              labels={labels}
              onRemoveAttachment={onRemoveAttachment}
              onRetryAttachment={onRetryAttachment}
            />
          ),
        )
      )}
      {isLoading && (
        <div className="px-4 py-3 text-sm text-[color:var(--chat-ui-muted-foreground,#737373)]">
          <LoadingDots />
        </div>
      )}
    </section>
  )
}
