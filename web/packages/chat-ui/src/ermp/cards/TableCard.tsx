import { memo } from 'react'

import type { TableCard as TableCardType } from '../types'

function TableCardInner({ card }: { card: TableCardType }) {
  return (
    <div className="border-border bg-card rounded-lg border">
      {card.title && (
        <div className="border-border border-b px-4 py-3">
          <h3 className="text-foreground text-sm font-medium">{card.title}</h3>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-border border-b">
              {card.columns.map((col) => (
                <th
                  key={col.key}
                  className="text-muted-foreground px-4 py-2 font-medium"
                  style={{ textAlign: col.align || 'left' }}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {card.rows.map((row, i) => (
              <tr key={i} className="border-border border-b last:border-b-0">
                {card.columns.map((col) => (
                  <td key={col.key} className="text-foreground px-4 py-2" style={{ textAlign: col.align || 'left' }}>
                    {String(row[col.key] ?? '')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {card.summary && (
        <div className="border-border border-t px-4 py-3">
          <p className="text-muted-foreground text-sm">{card.summary}</p>
        </div>
      )}
    </div>
  )
}

export const TableCard = memo(TableCardInner)
