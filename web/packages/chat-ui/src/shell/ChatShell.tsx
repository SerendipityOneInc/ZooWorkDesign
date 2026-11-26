import type React from 'react'

import { cx } from '../utils'

export interface ChatShellProps {
  header?: React.ReactNode
  thread: React.ReactNode
  composer: React.ReactNode
  aside?: React.ReactNode
  className?: string
}

export function ChatShell({ header, thread, composer, aside, className }: ChatShellProps) {
  return (
    <div className={cx('flex h-dvh min-h-0 bg-[color:var(--background)] text-[color:var(--foreground)]', className)}>
      <main className="flex min-w-0 flex-1 flex-col">
        {header && (
          <header className="border-b border-[color:var(--chat-ui-border,#d4d4d4)] bg-[color:var(--background)] px-5 py-4">
            {header}
          </header>
        )}
        {thread}
        {composer}
      </main>
      {aside && (
        <aside className="hidden w-80 border-l border-[color:var(--chat-ui-border,#d4d4d4)] lg:block">{aside}</aside>
      )}
    </div>
  )
}
