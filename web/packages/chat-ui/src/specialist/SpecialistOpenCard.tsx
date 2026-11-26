'use client'

import { ChevronRightIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'

export interface SpecialistOpenCardProps {
  agentId: string
  /** Fully resolved display name (already humanized / localized by the caller). */
  displayName: string
  /** Localized short greeting line shown under the name. */
  greeting: string
  /** Fully composed aria-label (already i18n-interpolated by the caller). */
  ariaLabel: string
  /** Optional image URL for the avatar slot; component falls back to a monogram when absent or on load error. */
  avatarUrl?: string
  onOpen: (agentId: string) => void
}

/** Humanize `research_analysis` or `market-analyst` → `Research Analysis` / `Market Analyst`.
 * Splits on BOTH underscore and hyphen so either snake_case or kebab-case catalog ids
 * produce a clean display-name fallback. Exposed so `MarkdownContent` (in the main React
 * tree) can precompute a fallback before handing it to the detached createRoot. */
export function humanizeAgentId(id: string): string {
  return id
    .split(/[_-]/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

/** Extract a 1-2 character monogram from a display name. Latin names get two initials
 * (e.g. "Research Analysis" → "RA"); CJK / emoji names keep a single leading character. */
function monogramOf(name: string): string {
  const chars = [...name.trim()].filter((c) => !/\s/.test(c))
  if (chars.length === 0) return '·'
  const first = chars[0] ?? ''
  const isLatinLike = /[A-Za-z0-9]/.test(first)
  if (!isLatinLike) return first
  const words = name.trim().split(/\s+/).filter(Boolean)
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase()
  return first.toUpperCase()
}

function AvatarSlot({ displayName, avatarUrl }: { displayName: string; avatarUrl?: string }) {
  const [imgFailed, setImgFailed] = useState(false)
  const showImage = !!avatarUrl && !imgFailed

  return (
    <span className="bg-muted/80 ring-border text-foreground/80 relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full ring-1 select-none">
      {showImage ? (
        <img
          src={avatarUrl!}
          alt=""
          className="h-full w-full object-cover"
          onError={() => setImgFailed(true)}
          draggable={false}
        />
      ) : (
        <span aria-hidden="true" className="text-xs font-semibold tracking-tight">
          {monogramOf(displayName)}
        </span>
      )}
    </span>
  )
}

export function SpecialistOpenCard({
  agentId,
  displayName,
  greeting,
  ariaLabel,
  avatarUrl,
  onOpen,
}: SpecialistOpenCardProps) {
  const handleActivate = () => onOpen(agentId)

  const handleKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleActivate()
    }
  }

  return (
    <div
      data-testid="specialist-open-card"
      data-agent-id={agentId}
      role="button"
      tabIndex={0}
      aria-label={ariaLabel}
      onClick={handleActivate}
      onKeyDown={handleKey}
      className="group border-border bg-card hover:border-foreground/40 focus-visible:ring-ring my-2 flex w-full max-w-sm cursor-pointer items-center gap-3 overflow-hidden rounded-xl border px-4 py-3 shadow-sm transition-[transform,box-shadow,border-color] duration-200 ease-out hover:-translate-y-[1px] hover:shadow-md focus-visible:ring-2 focus-visible:outline-none"
    >
      <AvatarSlot displayName={displayName} avatarUrl={avatarUrl} />

      <div className="flex min-w-0 flex-1 items-center">
        <span className="text-foreground truncate text-sm font-semibold">{displayName}</span>
      </div>

      {/* Greeting doubles as a send-message CTA: primary-filled pill at rest (reads as "this
          is the action"), with a chevron that slides right on hover to reinforce the "send" feel. */}
      <span className="bg-foreground text-background group-hover:bg-foreground/90 inline-flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap shadow-sm transition-all duration-200 group-hover:shadow-md">
        <span>{greeting}</span>
        <ChevronRightIcon className="h-3 w-3 transition-transform duration-200 ease-out group-hover:translate-x-[2px]" />
      </span>
    </div>
  )
}
