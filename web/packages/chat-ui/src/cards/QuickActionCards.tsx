'use client'

import { ChatBubbleLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'

export interface QuickActionItem {
  id: string
  title: string
  description: string
  icon?: React.ReactNode
}

export interface QuickActionCardsProps {
  items: QuickActionItem[]
  onActionClick: (title: string) => void
}

export function QuickActionCards({ items, onActionClick }: QuickActionCardsProps) {
  if (items.length === 0) return null

  return (
    <div className="mt-3 flex flex-col gap-2">
      {items.map((item) => (
        <button
          type="button"
          key={item.id}
          onClick={() => onActionClick(item.title)}
          className="border-border hover:border-foreground/20 hover:bg-muted/50 group flex items-center gap-3 rounded-xl border bg-white px-4 py-3 text-left transition-all dark:bg-white/5"
        >
          <div className="bg-muted group-hover:bg-foreground/10 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors">
            <span className="text-muted-foreground group-hover:text-foreground transition-colors">
              {item.icon ?? <ChatBubbleLeftIcon className="h-5 w-5" />}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-foreground block truncate text-sm font-medium">{item.title}</span>
            <span className="text-muted-foreground block text-xs">{item.description}</span>
          </div>
          <ChevronRightIcon className="text-muted-foreground group-hover:text-foreground h-4 w-4 shrink-0 transition-colors" />
        </button>
      ))}
    </div>
  )
}
