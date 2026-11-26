import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'

import type { ChatComposerBanner, ChatComposerStatus, ChatComposerTestIds, ChatComposerVariant } from '../../types'
import { cx } from '../../utils'

interface ComposerNoticesProps {
  banner?: ChatComposerBanner
  status?: ChatComposerStatus
  testIds?: ChatComposerTestIds
  variant: ChatComposerVariant
}

const defaultConnectionDot = <span className="inline-flex h-2 w-2 shrink-0 animate-pulse rounded-full bg-current" />
const defaultTypingDots = (
  <span className="inline-flex gap-0.5 font-bold" aria-hidden="true">
    <span className="animate-bounce [animation-delay:0ms]">.</span>
    <span className="animate-bounce [animation-delay:150ms]">.</span>
    <span className="animate-bounce [animation-delay:300ms]">.</span>
  </span>
)

export function ComposerNotices({ banner, status, testIds, variant }: ComposerNoticesProps) {
  const useMainConnectionPresentation = variant === 'main' && status?.kind === 'connection'
  const useNeutralPresentation = status?.tone === 'neutral'
  const announceStatus = status?.kind === 'connection' || status?.announce === true

  return (
    <>
      {banner ? (
        <div
          data-testid={testIds?.banner}
          role="status"
          aria-live="polite"
          className={cx(
            'mb-2 flex gap-2 rounded-lg border px-3 py-2 text-xs leading-5',
            variant === 'main'
              ? 'border-ecap-warning-border bg-ecap-warning-bg text-ecap-warning-text'
              : 'border-[color:var(--chat-ui-warning-border,#f59e0b)] bg-[color:var(--chat-ui-warning-bg,#fffbeb)] text-[color:var(--chat-ui-warning-foreground,#92400e)]',
          )}
        >
          <ExclamationTriangleIcon className="mt-0.5 h-4 w-4 shrink-0" />
          <div>
            <p className="font-semibold">{banner.title}</p>
            <p>{banner.description}</p>
          </div>
        </div>
      ) : null}

      {status ? (
        <div
          data-testid={testIds?.status}
          role={announceStatus ? 'status' : undefined}
          aria-live={announceStatus ? 'polite' : undefined}
          className={cx(
            'flex items-center px-1 pb-1 text-xs',
            useNeutralPresentation
              ? 'text-ecap-preview-loading-text gap-2'
              : useMainConnectionPresentation
                ? cx('gap-2', 'text-ecap-caution-text')
                : cx(
                    'gap-1.5',
                    variant === 'main'
                      ? 'text-muted-foreground'
                      : 'text-[color:var(--chat-ui-muted-foreground,#737373)]',
                  ),
          )}
        >
          {status.icon ?? (status.kind === 'connection' ? defaultConnectionDot : defaultTypingDots)}
          <span
            className={cx(
              useNeutralPresentation ? 'font-normal' : status.kind === 'connection' && 'font-medium',
              status.textClassName,
            )}
          >
            {status.text}
          </span>
        </div>
      ) : null}
    </>
  )
}
