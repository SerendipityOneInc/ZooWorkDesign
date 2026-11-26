import { memo } from 'react'

import { ERMPCardRenderer } from '../ERMPCardRenderer'
import type { CompositeCard as CompositeCardType } from '../types'

function CompositeCardInner({
  card,
  readOnly,
  isSubmitted,
  onCallback,
  onFormSubmit,
}: {
  card: CompositeCardType
  readOnly?: boolean
  isSubmitted?: (cardId?: string) => boolean
  onCallback: (cardId: string | undefined, value: string) => void
  onFormSubmit: (cardId: string | undefined, data: Record<string, unknown>) => void
}) {
  return (
    <div className="border-border bg-card rounded-lg border">
      {(card.title || card.icon) && (
        <div className="border-border flex items-center gap-2 border-b px-4 py-3">
          {card.icon && <span className="text-base">{card.icon}</span>}
          {card.title && <h3 className="text-foreground text-sm font-medium">{card.title}</h3>}
        </div>
      )}
      <div className="divide-border divide-y">
        {card.sections
          .filter((s) => s._card !== 'composite')
          .map((section, i) => (
            <div key={i} className="[&>*]:rounded-none [&>*]:border-0">
              <ERMPCardRenderer
                card={section}
                readOnly={readOnly}
                isSubmitted={isSubmitted}
                onCallback={onCallback}
                onFormSubmit={onFormSubmit}
              />
            </div>
          ))}
      </div>
    </div>
  )
}

export const CompositeCard = memo(CompositeCardInner)
