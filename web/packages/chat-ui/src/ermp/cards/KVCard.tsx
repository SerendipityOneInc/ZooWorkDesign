import { memo } from 'react'

import type { KVCard as KVCardType } from '../types'

const TAG_STYLES: Record<string, { className: string; style?: React.CSSProperties }> = {
  normal: { className: 'text-foreground' },
  success: {
    className: 'font-semibold',
    style: { color: 'var(--color-chart-2, #16a34a)' },
  },
  warning: {
    className: 'font-semibold',
    style: { color: 'var(--color-chart-4, #ca8a04)' },
  },
  danger: { className: 'text-destructive font-semibold' },
}

function KVCardInner({ card }: { card: KVCardType }) {
  return (
    <div className="border-border bg-card rounded-lg border">
      {card.title && (
        <div className="border-border border-b px-4 py-3">
          <h3 className="text-foreground text-sm font-medium">{card.title}</h3>
        </div>
      )}
      <dl className="divide-border divide-y">
        {card.items.map((item) => (
          <div key={item.key} className="flex items-center justify-between px-4 py-2">
            <dt className="text-muted-foreground text-sm">{item.key}</dt>
            <dd
              className={`text-sm font-medium ${(TAG_STYLES[item.tag || 'normal'] || TAG_STYLES.normal).className}`}
              style={(TAG_STYLES[item.tag || 'normal'] || TAG_STYLES.normal).style}
            >
              {item.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

export const KVCard = memo(KVCardInner)
