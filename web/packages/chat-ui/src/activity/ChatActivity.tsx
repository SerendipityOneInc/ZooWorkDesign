import type { ReactNode } from 'react'

/** Live status at the next assistant-reply position, extracted from OpenClawChatSurface. */
export function ChatActivity({ label, avatar }: { label: string; avatar?: ReactNode }) {
  return (
    <div
      role="status"
      aria-live="polite"
      data-testid="chat-thread-activity"
      className="text-ecap-preview-loading-text -mt-2.5 flex min-h-[34px] items-center gap-3 text-sm"
    >
      {avatar ?? <div aria-hidden="true" className="size-[34px] shrink-0" />}
      <span className="shimmer-neutral">{label.replace(/(?:…|\.{3})$/, '')}</span>
    </div>
  )
}
