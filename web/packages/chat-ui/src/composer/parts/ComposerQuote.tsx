import { ArrowUturnLeftIcon, XMarkIcon } from '@heroicons/react/24/outline'

import { truncateQuoteText } from '../../messages/helpers'
import type { ChatComposerQuote, ChatComposerTestIds, ChatComposerVariant } from '../../types'
import { cx } from '../../utils'

interface ComposerQuoteProps {
  quote?: ChatComposerQuote
  variant: ChatComposerVariant
  onClearQuote?: () => void
  testIds?: ChatComposerTestIds
}

export function ComposerQuote({ quote, variant, onClearQuote, testIds }: ComposerQuoteProps) {
  if (!quote) return null

  const label = quote.label ?? 'Reply'
  const clearLabel = quote.clearLabel ?? 'Clear reply'
  // Must match the truncation applied when the quote is sent (QUOTE_MAX_CHARS),
  // so the preview text is exactly the text that ends up in the blockquote.
  // The `truncate` class below may clamp this further, but only visually.
  const preview = truncateQuoteText(quote.text)

  return (
    <div
      data-testid={testIds?.quote}
      className="relative mx-3 -mb-4 flex min-w-0 items-center gap-3 rounded-t-[var(--brand-composer-radius,22px)] border border-b-0 border-[color:var(--brand-composer-border,var(--input,var(--chat-ui-border,#d4d4d4)))] bg-[color:color-mix(in_srgb,var(--chat-ui-muted,#f5f5f5)_97%,var(--foreground,#262626)_3%)] px-4 pt-2 pb-6 shadow-[var(--brand-composer-shadow,0_12px_32px_rgba(0,0,0,0.02))]"
    >
      <span
        className={cx(
          'inline-flex shrink-0 items-center gap-1.5',
          variant === 'main' ? 'text-foreground' : 'text-[color:var(--foreground)]',
        )}
      >
        {quote.icon ?? <ArrowUturnLeftIcon className="size-4" />}
        <span className="text-sm font-medium">{label}</span>
      </span>
      <p
        className={cx(
          'min-w-0 flex-1 truncate text-sm leading-5',
          variant === 'main' ? 'text-muted-foreground' : 'text-[color:var(--chat-ui-muted-foreground,#737373)]',
        )}
      >
        {preview}
      </p>
      {onClearQuote ? (
        <button
          type="button"
          onClick={onClearQuote}
          className={cx(
            'focus-visible:ring-ring inline-flex size-7 shrink-0 items-center justify-center rounded-full transition-colors focus-visible:ring-2 focus-visible:outline-none',
            variant === 'main'
              ? 'text-muted-foreground hover:bg-background/60 hover:text-foreground'
              : 'text-[color:var(--chat-ui-muted-foreground,#737373)] hover:bg-[color:var(--chat-ui-card,#ffffff)] hover:text-[color:var(--foreground)]',
          )}
          aria-label={clearLabel}
        >
          <XMarkIcon className="size-4" />
        </button>
      ) : null}
    </div>
  )
}
