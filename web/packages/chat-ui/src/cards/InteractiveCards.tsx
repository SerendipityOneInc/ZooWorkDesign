'use client'

import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { useState } from 'react'

import { useChatUiConfig } from '../provider'
import type { InteractiveCardView } from '../types'
import { cx } from '../utils'

type InteractiveCardButtonStyle = 'primary' | 'danger' | 'default'

const BUTTON_STYLES: Record<InteractiveCardButtonStyle, string> = {
  primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
  danger: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
  default: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
}

const BUTTON_BASE =
  'inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50'
const COMPLETION_BANNER_ATTRIBUTION = /^(✓ \*\*[\s\S]*\*\*)\s+selected by @\S+\s*$/

export interface InteractiveCardsProps {
  postId: string
  cards: InteractiveCardView[]
  /** External disable: replay read-only, missing transport, etc. */
  disabled?: boolean
  /** Tooltip shown on disabled action buttons. */
  disabledReason?: string
  /** Dispatch the card action. Omit to render action controls disabled. A
   *  resolved promise keeps controls disabled until the authoritative post edit. */
  onAction?: (postId: string, actionId: string, selectedOption?: string) => Promise<void>
  onActionError?: (error: unknown) => void
}

export function InteractiveCards({ postId, cards, disabled, disabledReason, onAction, onActionError }: InteractiveCardsProps) {
  return (
    <div className="flex flex-col gap-2">
      {cards.map((card, i) => (
        <InteractiveCard
          key={`${postId}-${i}-${JSON.stringify(card)}`}
          postId={postId}
          card={card}
          disabled={disabled}
          disabledReason={disabledReason}
          onAction={onAction}
          onActionError={onActionError}
        />
      ))}
    </div>
  )
}

function InteractiveCard({
  postId,
  card,
  disabled: externallyDisabled,
  disabledReason,
  onAction,
  onActionError,
}: Omit<InteractiveCardsProps, 'cards'> & { card: InteractiveCardView }) {
  const { renderMarkdown } = useChatUiConfig()
  const [pendingActionId, setPendingActionId] = useState<string | null>(null)

  if (card.kind === 'banner') {
    return (
      <div className="border-border bg-card rounded-lg border px-4 py-3 text-sm" data-testid="interactive-card-banner">
        {renderMarkdown(card.text.replace(COMPLETION_BANNER_ATTRIBUTION, '$1'))}
      </div>
    )
  }

  const disabled = externallyDisabled === true || onAction === undefined || pendingActionId !== null

  const dispatch = (actionId: string, selectedOption?: string) => {
    if (disabled || !onAction) return
    setPendingActionId(actionId)
    void onAction(postId, actionId, selectedOption).catch((err) => {
      onActionError?.(err)
      setPendingActionId(null)
    })
  }

  let controls: React.ReactNode
  switch (card.kind) {
    case 'buttons':
      controls = (
        <div className="flex flex-wrap gap-2">
          {card.buttons.map((btn) => (
            <button
              key={btn.actionId}
              type="button"
              className={cx(BUTTON_BASE, BUTTON_STYLES[btn.style], pendingActionId === btn.actionId && 'animate-pulse')}
              disabled={disabled}
              title={disabledReason}
              onClick={() => dispatch(btn.actionId)}
              data-testid="interactive-card-button"
            >
              {btn.label}
            </button>
          ))}
        </div>
      )
      break
    case 'select':
      controls = (
        <CardSelect
          disabled={disabled}
          placeholder={card.placeholder}
          options={card.options}
          onSelect={(value) => dispatch(card.actionId, value)}
        />
      )
      break
    case 'multiselect':
      controls = (
        <CardMultiSelect
          disabled={disabled}
          disabledReason={disabledReason}
          options={card.options}
          pendingActionId={pendingActionId}
          submitActionId={card.submitActionId}
          submitLabel={card.submitLabel}
          onToggle={(actionId) => dispatch(actionId)}
          onSubmit={() => dispatch(card.submitActionId)}
        />
      )
      break
    default: {
      const fallbackText = typeof (card as { text?: unknown }).text === 'string' ? (card as { text: string }).text : ''
      return fallbackText.trim() ? (
        <div className="border-border bg-card rounded-lg border px-4 py-3 text-sm" data-testid="interactive-card-banner">
          {renderMarkdown(fallbackText)}
        </div>
      ) : null
    }
  }

  return (
    <div className="border-border bg-card rounded-lg border" data-testid="interactive-card">
      {card.text.trim() && (
        <div className="border-border border-b px-4 py-3 text-sm">{renderMarkdown(card.text)}</div>
      )}
      <div className="px-4 py-3">{controls}</div>
    </div>
  )
}

function CardMultiSelect({
  disabled,
  disabledReason,
  options,
  pendingActionId,
  submitActionId,
  submitLabel,
  onToggle,
  onSubmit,
}: {
  disabled: boolean
  disabledReason?: string
  options: { actionId: string; label: string; checked: boolean }[]
  pendingActionId: string | null
  submitActionId: string
  submitLabel: string
  onToggle: (actionId: string) => void
  onSubmit: () => void
}) {
  const hasCheckedOption = options.some((option) => option.checked)

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-2">
        {options.map((option) => (
          <label
            key={option.actionId}
            className={cx(
              'border-border bg-background text-foreground flex items-center gap-3 rounded-md border px-3 py-2 text-sm transition-colors hover:bg-secondary/50',
              pendingActionId === option.actionId && 'animate-pulse',
            )}
          >
            <input
              type="checkbox"
              checked={option.checked}
              disabled={disabled}
              title={disabledReason}
              onChange={() => onToggle(option.actionId)}
              className="border-input text-primary focus-visible:ring-ring/40 h-4 w-4 rounded focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-70"
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
      <button
        type="button"
        className={cx(BUTTON_BASE, BUTTON_STYLES.primary, 'self-start', pendingActionId === submitActionId && 'animate-pulse')}
        disabled={disabled || !hasCheckedOption}
        title={disabledReason}
        onClick={onSubmit}
      >
        {submitLabel}
      </button>
    </div>
  )
}

/** Native select styled to match the app's ds Select (chevron overlay, same classes). */
function CardSelect({
  disabled,
  placeholder,
  options,
  onSelect,
}: {
  disabled: boolean
  placeholder: string
  options: { value: string; label: string }[]
  onSelect: (value: string) => void
}) {
  return (
    <div className="relative">
      <select
        value=""
        disabled={disabled}
        onChange={(e) => {
          if (e.target.value) onSelect(e.target.value)
        }}
        data-testid="interactive-card-select"
        aria-label={placeholder}
        className="border-border bg-background text-foreground focus-visible:ring-ring/40 flex h-9 w-full appearance-none rounded-md border px-3 py-1 pr-9 text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-70"
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronDownIcon
        aria-hidden="true"
        className="text-muted-foreground pointer-events-none absolute top-1/2 right-2.5 h-4 w-4 -translate-y-1/2 opacity-70"
      />
    </div>
  )
}
