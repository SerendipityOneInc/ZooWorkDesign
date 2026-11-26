'use client'

import { memo, useState } from 'react'

import { useChatUiConfig } from '../../provider'

import type { ActionsCard as ActionsCardType, ERMPButton } from '../types'

function CopyButton({ btn, base, style }: { btn: ERMPButton; base: string; style: string }) {
  const { locale } = useChatUiConfig()
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(btn.value).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <button type="button" className={`${base} ${style}`} onClick={handleCopy}>
      {copied ? (locale.startsWith('zh') ? '已复制' : 'Copied') : btn.label}
    </button>
  )
}

const BUTTON_STYLES: Record<string, string> = {
  primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
  secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
  danger: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
}

function ActionButton({
  btn,
  cardId,
  submitted,
  readOnly,
  onCallback,
}: {
  btn: ERMPButton
  cardId: string | undefined
  submitted: boolean
  readOnly: boolean
  onCallback: (cardId: string | undefined, value: string) => void
}) {
  const { locale } = useChatUiConfig()
  const chinese = locale.startsWith('zh')
  const style = BUTTON_STYLES[btn.style || 'secondary'] || BUTTON_STYLES.secondary
  const base = 'inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors'

  // In replay (read-only) mode links still open their target, since it's
  // just navigation — no creator state is touched.
  if (btn.action === 'link') {
    return (
      <a href={btn.value} target="_blank" rel="noopener noreferrer" className={`${base} ${style}`}>
        {btn.label}
      </a>
    )
  }

  if (btn.action === 'copy') {
    return <CopyButton btn={btn} base={base} style={style} />
  }

  // callback — disabled in read-only replay (clicking would hit the creator's
  // session, which no longer exists from the viewer's perspective).
  const title = readOnly ? (chinese ? '回放中不可操作' : 'Disabled in replay') : undefined
  return (
    <button
      type="button"
      className={`${base} ${style} disabled:opacity-50`}
      disabled={submitted || readOnly}
      onClick={() => onCallback(cardId, btn.value)}
      title={title}
    >
      {submitted ? (chinese ? '已提交' : 'Submitted') : btn.label}
    </button>
  )
}

function ActionsCardInner({
  card,
  readOnly = false,
  isSubmitted,
  onCallback,
}: {
  card: ActionsCardType
  readOnly?: boolean
  isSubmitted?: (cardId?: string) => boolean
  onCallback: (cardId: string | undefined, value: string) => void
}) {
  const [submitted, setSubmitted] = useState(() => isSubmitted?.(card._id) ?? false)

  const handleCallback = (cardId: string | undefined, value: string) => {
    if (readOnly) return
    onCallback(cardId, value)
    setSubmitted(true)
  }

  return (
    <div className="border-border bg-card rounded-lg border">
      {(card.title || card.description) && (
        <div className="border-border border-b px-4 py-3">
          {card.title && <h3 className="text-foreground text-sm font-medium">{card.title}</h3>}
          {card.description && <p className="text-muted-foreground mt-1 text-sm">{card.description}</p>}
        </div>
      )}
      <div className="flex flex-wrap gap-2 px-4 py-3">
        {card.buttons.map((btn, i) => (
          <ActionButton
            key={i}
            btn={btn}
            cardId={card._id}
            submitted={submitted}
            readOnly={readOnly}
            onCallback={handleCallback}
          />
        ))}
      </div>
    </div>
  )
}

export const ActionsCard = memo(ActionsCardInner)
