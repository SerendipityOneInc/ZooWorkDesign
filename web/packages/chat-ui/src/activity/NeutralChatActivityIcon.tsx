'use client'

import 'ldrs/react/JellyTriangle.css'

import { JellyTriangle } from 'ldrs/react'

export function NeutralChatActivityIcon() {
  return (
    <>
      <span
        className="inline-flex shrink-0 leading-none motion-reduce:hidden"
        data-testid="chat-activity-icon"
        aria-hidden="true"
      >
        <JellyTriangle size={8} speed={1.75} color="currentColor" />
      </span>
      <span
        className="hidden h-2 w-2 shrink-0 rounded-full bg-current motion-reduce:inline-flex"
        data-testid="chat-activity-static-icon"
        aria-hidden="true"
      />
    </>
  )
}
