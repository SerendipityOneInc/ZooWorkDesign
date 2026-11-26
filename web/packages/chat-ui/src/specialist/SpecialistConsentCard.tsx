'use client'

import type React from 'react'
import { useState } from 'react'

type ConsentVariant = 'neutral' | 'destructive'

export interface SpecialistConsentCardProps {
  labels: string[]
  body: React.ReactNode
  variant: ConsentVariant
  /** Called with the clicked button label (verbatim, as it appears in the markdown body).
   * The caller is responsible for composing the localized outgoing message — the card
   * stays purely presentational and knows nothing about i18n, agent ids, or action verbs. */
  onButtonClick: (buttonLabel: string) => void
  /** Pre-resolved localized label for the "destructive action" warning banner. Ignored
   * when variant is neutral. Defaults to English when omitted so standalone tests and
   * non-chat consumers still render sensible copy. */
  destructiveBannerLabel?: string
  /** Pre-resolved localized template for the "You chose: X" confirmation shown after a
   * button is clicked. `{label}` is replaced with the chosen button text. */
  chosenLabelTemplate?: string
}

export function SpecialistConsentCard({
  labels,
  body,
  variant,
  onButtonClick,
  destructiveBannerLabel = 'Destructive action',
  chosenLabelTemplate = 'You chose: {label}',
}: SpecialistConsentCardProps) {
  const [consumed, setConsumed] = useState<string | null>(null)

  if (labels.length === 0) return null

  const handleClick = (label: string) => {
    if (consumed) return
    setConsumed(label)
    onButtonClick(label)
  }

  const isDestructive = variant === 'destructive'
  const cardBorderClass = isDestructive ? 'border-destructive' : 'border-border'

  return (
    <div
      data-testid={`specialist-consent-card-${variant}`}
      className={`bg-card my-2 overflow-hidden rounded-lg border ${cardBorderClass}`}
    >
      {isDestructive && (
        <div className="bg-destructive/10 text-destructive flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium">
          <span aria-hidden="true">⚠️</span>
          <span>{destructiveBannerLabel}</span>
        </div>
      )}
      <div className="px-4 py-3">
        {body}
      </div>
      <div className="border-border flex flex-wrap gap-2 border-t px-4 py-3">
        {labels.map((label, i) => {
          const isChosen = consumed === label
          const isPrimary = i === 0
          const base =
            'inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60'
          // `text-white` (not the `-destructive-foreground` token) because the codebase's
          // `@theme` mapping in globals.css does NOT wire up `--color-destructive-foreground`,
          // which would leave the button text to inherit and render dark-on-red in light theme.
          // White on red reads correctly in both themes.
          const primaryClass = isDestructive
            ? 'bg-destructive text-white hover:bg-destructive/90'
            : 'bg-foreground text-background hover:bg-foreground/90'
          const secondaryClass = 'bg-muted text-foreground border border-border hover:bg-accent'
          const variantClass = isPrimary ? primaryClass : secondaryClass
          return (
            <button
              key={label}
              type="button"
              data-testid={`specialist-consent-button-${label}`}
              className={`${base} ${variantClass}`}
              disabled={consumed !== null}
              onClick={() => handleClick(label)}
            >
              {isChosen ? `✓ ${label}` : label}
            </button>
          )
        })}
        {consumed && (
          <span className="text-muted-foreground ml-auto self-center text-xs" data-testid="specialist-consent-chosen">
            {chosenLabelTemplate.replace('{label}', consumed)}
          </span>
        )}
      </div>
    </div>
  )
}
