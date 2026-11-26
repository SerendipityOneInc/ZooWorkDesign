'use client'

import { CheckIcon } from '@heroicons/react/20/solid'
import { ArrowPathIcon, WrenchIcon } from '@heroicons/react/24/outline'
import {
  Button,
  Card,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  ItemGroup,
  ScrollArea,
  Spinner,
} from '@zooclaw/zooworkdesign'
import { useState } from 'react'
import type { ReactNode } from 'react'

import { cx } from '../utils'

export interface SkillStoreDialogItem {
  id: string
  slug: string
  name: string
  author: string
  summary: string
  icon: ReactNode
}

export interface SkillStoreDialogLabels {
  title: string
  description: string
  loading: string
  loadFailedTitle: string
  loadFailedDescription: string
  retry: string
  emptyTitle: string
  emptyDescription: string
  loadingMore: string
  loadMore: string
  selectOne: string
  cancel: string
  addToMessage: string
}

export interface SkillStoreDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  items: SkillStoreDialogItem[]
  isLoading?: boolean
  isError?: boolean
  onRetry?: () => void
  hasNextPage?: boolean
  isFetchingNextPage?: boolean
  onLoadMore?: () => void
  onConfirm: (item: SkillStoreDialogItem) => void
  labels: SkillStoreDialogLabels
}

export function SkillStoreDialog({
  open,
  onOpenChange,
  items,
  isLoading = false,
  isError = false,
  onRetry,
  hasNextPage = false,
  isFetchingNextPage = false,
  onLoadMore,
  onConfirm,
  labels,
}: SkillStoreDialogProps) {
  const [selectedItem, setSelectedItem] = useState<SkillStoreDialogItem | null>(null)

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) setSelectedItem(null)
    onOpenChange(nextOpen)
  }

  const confirm = () => {
    if (!selectedItem) return
    onConfirm(selectedItem)
    handleOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        data-testid="composer-skill-market-dialog"
        data-viewport-capped="true"
        className={cx(
          'bg-background flex min-h-0 flex-col gap-0 overflow-hidden p-0',
          'w-[calc(100%-2rem)]! max-w-[920px]! h-[calc(100vh-2rem)]! max-h-[680px]!',
        )}
      >
        <DialogHeader className="shrink-0 px-6 pt-5 pr-14 pb-4">
          <DialogTitle>{labels.title}</DialogTitle>
          <DialogDescription>{labels.description}</DialogDescription>
        </DialogHeader>

        <ScrollArea className="min-h-0 flex-1">
          <div className="p-5">
            {isLoading ? (
              <div
                role="status"
                aria-live="polite"
                aria-label={labels.loading}
                className="flex min-h-72 items-center justify-center"
              >
                <Spinner className="size-5" />
              </div>
            ) : isError ? (
              <Empty role="status" aria-live="polite" className="min-h-72">
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <WrenchIcon />
                  </EmptyMedia>
                  <EmptyTitle>{labels.loadFailedTitle}</EmptyTitle>
                  <EmptyDescription>{labels.loadFailedDescription}</EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                  <Button type="button" variant="outline" size="sm" onClick={() => void onRetry?.()}>
                    <ArrowPathIcon className="size-4" />
                    {labels.retry}
                  </Button>
                </EmptyContent>
              </Empty>
            ) : items.length === 0 ? (
              <Empty role="status" aria-live="polite" className="min-h-72">
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <WrenchIcon />
                  </EmptyMedia>
                  <EmptyTitle>{labels.emptyTitle}</EmptyTitle>
                  <EmptyDescription>{labels.emptyDescription}</EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : (
              <ItemGroup
                data-testid="composer-skill-market-grid"
                className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3"
              >
                {items.map((item) => {
                  const selected = selectedItem?.id === item.id
                  return (
                    <Card
                      key={item.id}
                      size="sm"
                      role="listitem"
                      data-selected={selected}
                      className="border-border/50 data-[selected=true]:border-border data-[selected=true]:bg-muted/50 hover:border-border h-full min-h-28 border py-0 transition-[transform,box-shadow,border-color,background-color] duration-200 hover:-translate-y-0.5 hover:shadow-md"
                    >
                      <button
                        type="button"
                        aria-pressed={selected}
                        data-testid={`composer-market-skill-${item.slug}`}
                        className="focus-visible:ring-ring/35 flex h-full w-full items-start gap-3 rounded-xl px-4 py-4 text-left outline-none focus-visible:ring-[3px]"
                        onClick={() => setSelectedItem(item)}
                      >
                        {item.icon}
                        <span className="flex min-w-0 flex-1 flex-col gap-1">
                          <span className="flex w-full items-start justify-between gap-2">
                            <span className="line-clamp-1 text-sm leading-snug font-medium">{item.name}</span>
                            {selected && (
                              <CheckIcon
                                data-testid={`composer-market-skill-selected-${item.slug}`}
                                className="text-foreground size-4 shrink-0"
                              />
                            )}
                          </span>
                          <span className="text-muted-foreground line-clamp-1 text-xs">{item.author}</span>
                          <span className="text-muted-foreground line-clamp-2 text-sm leading-normal font-normal">
                            {item.summary}
                          </span>
                        </span>
                      </button>
                    </Card>
                  )
                })}
              </ItemGroup>
            )}

            {hasNextPage && (
              <div className="flex justify-center pt-5">
                <Button
                  type="button"
                  variant="outline"
                  disabled={isFetchingNextPage}
                  onClick={() => void onLoadMore?.()}
                >
                  {isFetchingNextPage && <Spinner className="size-4" />}
                  {isFetchingNextPage ? labels.loadingMore : labels.loadMore}
                </Button>
              </div>
            )}
          </div>
        </ScrollArea>

        <DialogFooter className="bg-background mx-0 mb-0 min-h-16 shrink-0 flex-row items-center justify-between rounded-none border-0 px-6 py-3">
          <span className="text-muted-foreground min-w-0 truncate text-xs">
            {selectedItem ? selectedItem.name : labels.selectOne}
          </span>
          <div className="flex shrink-0 items-center gap-2">
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
              {labels.cancel}
            </Button>
            <Button type="button" disabled={!selectedItem} onClick={confirm}>
              {labels.addToMessage}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
