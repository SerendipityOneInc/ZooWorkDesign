import { AttachmentChip } from '../primitives/AttachmentChip'
import { LoadingDots } from '../primitives/LoadingDots'
import type { ChatUiLabels, ChatUiMessage } from '../types'
import { cx, formatTimestamp, mergeLabels } from '../utils'

export interface ChatMessageProps {
  message: ChatUiMessage
  labels?: ChatUiLabels
  onRemoveAttachment?: (id: string) => void
  onRetryAttachment?: (id: string) => void
  className?: string
}

export function ChatMessage({ message, labels, onRemoveAttachment, onRetryAttachment, className }: ChatMessageProps) {
  const mergedLabels = mergeLabels(labels)
  const timestamp = formatTimestamp(message.createdAt)
  const label =
    message.role === 'user' ? mergedLabels.user : message.role === 'system' ? mergedLabels.system : mergedLabels.assistant
  const isUser = message.role === 'user'
  const isSystem = message.role === 'system'

  if (isSystem) {
    return (
      <div className={cx('flex min-w-0 justify-center px-4 py-2', className)} aria-label={`${label} message`}>
        <div className="max-w-full rounded-full border border-[color:var(--chat-ui-border,var(--border,#d4d4d4))] bg-[color:var(--chat-ui-muted,var(--muted,#f5f5f5))] px-3 py-1 text-xs break-words text-[color:var(--chat-ui-muted-foreground,var(--muted-foreground,#737373))] [overflow-wrap:anywhere] sm:max-w-2xl">
          {message.content}
        </div>
      </div>
    )
  }

  return (
    <article
      className={cx('flex min-w-0 gap-3 px-4 py-3', isUser ? 'justify-end' : 'justify-start', className)}
      aria-label={`${label} message`}
    >
      <div className={cx('flex min-w-0 max-w-[min(720px,85%)] flex-col gap-1.5', isUser ? 'items-end' : 'items-start')}>
        <div className="flex items-center gap-2 text-xs text-[color:var(--chat-ui-muted-foreground,var(--muted-foreground,#737373))]">
          <span>{label}</span>
          {timestamp && <time>{timestamp}</time>}
        </div>
        <div
          className={cx(
            'max-w-full whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-6 break-words shadow-sm [overflow-wrap:anywhere]',
            isUser
              ? 'bg-[color:var(--chat-ui-user-bg,var(--primary,#111827))] font-medium text-[color:var(--chat-ui-user-fg,var(--primary-foreground,#ffffff))]'
              : 'border border-[color:var(--chat-ui-border,var(--border,#d4d4d4))] bg-[color:var(--chat-ui-assistant-bg,var(--card,#ffffff))] text-[color:var(--card-foreground,var(--foreground,#181818))]',
          )}
        >
          {message.content}
          {message.status === 'streaming' && (
            <LoadingDots className="ml-2 text-[color:var(--chat-ui-muted-foreground,var(--muted-foreground,#737373))]" />
          )}
        </div>
        {message.attachments && message.attachments.length > 0 && (
          <div className={cx('flex max-w-full flex-wrap gap-2', isUser ? 'justify-end' : 'justify-start')}>
            {message.attachments.map((attachment) => (
              <AttachmentChip
                key={attachment.id}
                attachment={attachment}
                labels={labels}
                onRemove={onRemoveAttachment}
                onRetry={onRetryAttachment}
              />
            ))}
          </div>
        )}
      </div>
    </article>
  )
}
