// Heroicons v2 dropped the `reply` icon family entirely (closest geometric
// match `ArrowUturnLeftIcon` is a different "u-turn" shape, not a reply
// glyph). Permanent self-hosted wrapper — do NOT migrate without redesign.
// Used in chat reply UI (GenClawInput / OpenClawUserMessage / OpenClawAssistantMessage).
// Tracked as "skip" in docs/superpowers/specs/2026-04-25-heroicons-migration.md.
export function ReplyArrowIcon({ className = 'h-3 w-3' }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
    </svg>
  )
}
