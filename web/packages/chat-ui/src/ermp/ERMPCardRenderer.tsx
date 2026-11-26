import { memo } from 'react'

import { ActionsCard } from './cards/ActionsCard'
import { AudioCard } from './cards/AudioCard'
import { CompositeCard } from './cards/CompositeCard'
import { FileCard } from './cards/FileCard'
import { FormCard } from './cards/FormCard'
import { KVCard } from './cards/KVCard'
import { TableCard } from './cards/TableCard'
import type { ERMPCard } from './types'
import { VideoCard } from './cards/VideoCard'

function ERMPCardRendererInner({
  card,
  readOnly,
  isSubmitted,
  onCallback,
  onFormSubmit,
}: {
  card: ERMPCard
  readOnly?: boolean
  isSubmitted?: (cardId?: string) => boolean
  onCallback: (cardId: string | undefined, value: string) => void
  onFormSubmit: (cardId: string | undefined, data: Record<string, unknown>) => void
}) {
  switch (card._card) {
    case 'audio':
      return <AudioCard card={card} />
    case 'video':
      return <VideoCard card={card} />
    case 'file':
      return <FileCard card={card} />
    case 'table':
      return <TableCard card={card} />
    case 'kv':
      return <KVCard card={card} />
    case 'actions':
      return <ActionsCard card={card} readOnly={readOnly} isSubmitted={isSubmitted} onCallback={onCallback} />
    case 'form':
      return <FormCard card={card} readOnly={readOnly} isSubmitted={isSubmitted} onSubmit={onFormSubmit} />
    case 'composite':
      return (
        <CompositeCard
          card={card}
          readOnly={readOnly}
          isSubmitted={isSubmitted}
          onCallback={onCallback}
          onFormSubmit={onFormSubmit}
        />
      )
    default: {
      const fallback = (card as { _fallback?: string })._fallback
      if (fallback) {
        return <span className="text-muted-foreground text-sm">{fallback}</span>
      }
      return null
    }
  }
}

export const ERMPCardRenderer = memo(ERMPCardRendererInner)
