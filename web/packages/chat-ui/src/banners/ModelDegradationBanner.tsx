'use client'

import { ExclamationTriangleIcon } from '@heroicons/react/24/solid'

import { useChatUiConfig } from '../provider'

const DEGRADED_IQ_SCORE = 25

export interface ModelDegradationBannerProps {
  variant: 'degraded' | 'expired' | 'expiryWarning'
  /** Days until expiry; required when variant is 'expiryWarning'. */
  daysLeft?: number
  onUpgradeClick: () => void
}

export function ModelDegradationBanner({ variant, daysLeft, onUpgradeClick }: ModelDegradationBannerProps) {
  const { t, logger } = useChatUiConfig()

  // Degraded variant: IQ bar design
  if (variant === 'degraded') {
    return (
      <div
        data-testid="genclaw-degradation-banner"
        data-variant="degraded"
        className="border-border text-foreground flex items-center gap-3 border-b bg-transparent px-3 py-2 text-xs"
      >
        <span className="shrink-0 text-base" role="img" aria-label="brain">
          🧠
        </span>
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <div className="flex shrink-0 items-center gap-1.5">
            <span className="font-semibold">{t('modelDegradation.degradedTitle')}</span>
            <span className="opacity-50">·</span>
            <span className="opacity-70">
              {t('modelDegradation.degradedScore').replace('{score}', String(DEGRADED_IQ_SCORE))}
            </span>
          </div>
          <div
            className="relative h-1.5 min-w-16 flex-1 overflow-visible rounded-full"
            style={{ background: 'var(--ecap-iq-bar-gradient)' }}
          >
            <div
              className="border-ecap-warning-text absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 bg-white shadow-sm"
              style={{ left: `${DEGRADED_IQ_SCORE}%` }}
            />
          </div>
        </div>
        <button
          type="button"
          onClick={onUpgradeClick}
          className="border-border text-foreground hover:bg-muted shrink-0 rounded-md border bg-white px-3 py-1 text-xs font-medium whitespace-nowrap transition-colors"
        >
          {t('modelDegradation.boostAI')}
        </button>
      </div>
    )
  }

  // Expired / expiryWarning variants: unchanged
  let message: string
  if (variant === 'expired') {
    message = t('modelDegradation.expired')
  } else {
    if (daysLeft == null) logger.error('ModelDegradationBanner: expiryWarning variant requires daysLeft')
    message = t('modelDegradation.expiryWarning').replace('{days}', String(daysLeft ?? 1))
  }
  const buttonLabel = t('modelDegradation.subscribe')

  const variantClasses =
    variant === 'expired'
      ? {
          container: 'bg-ecap-error-bg border-ecap-error-border text-ecap-error-text',
          button: 'text-ecap-error-text border-ecap-error-border hover:bg-ecap-error-bg/80',
        }
      : {
          container: 'bg-ecap-caution-bg border-ecap-caution-border text-ecap-caution-text',
          button: 'text-ecap-caution-text border-ecap-caution-border hover:bg-ecap-caution-border/30',
        }

  return (
    <div
      data-testid="genclaw-degradation-banner"
      data-variant={variant}
      className={`flex items-center justify-between gap-3 border-b px-4 py-2 text-sm ${variantClasses.container}`}
    >
      <div className="flex items-center gap-2">
        <ExclamationTriangleIcon className="h-4 w-4 shrink-0" />
        <span>{message}</span>
      </div>
      <button
        type="button"
        onClick={onUpgradeClick}
        className={`rounded-md border px-3 py-1 text-xs font-medium whitespace-nowrap transition-colors ${variantClasses.button}`}
      >
        {buttonLabel}
      </button>
    </div>
  )
}
