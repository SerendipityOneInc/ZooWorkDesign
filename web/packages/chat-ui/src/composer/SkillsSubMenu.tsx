'use client'

import { ArrowPathIcon, ChatBubbleLeftEllipsisIcon, WrenchIcon } from '@heroicons/react/24/outline'
import {
  Button,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '@zooclaw/zooworkdesign'
import { type ReactNode, useCallback, useEffect, useRef, useState } from 'react'

const MAX_VISIBLE_SKILL_ROWS = 4.5

export interface SkillsSubMenuItem {
  name: string
  description?: string
  icon: ReactNode
}

export interface SkillsSubMenuLabels {
  trigger: string
  loading: string
  loadFailed: string
  openStore: string
  empty: string
  createWithZooClaw: string
}

export interface SkillsSubMenuProps {
  showSkillList?: boolean
  items: SkillsSubMenuItem[]
  isLoading: boolean
  isError: boolean
  labels: SkillsSubMenuLabels
  open: boolean
  onOpenChange: (open: boolean) => void
  subSide: 'left' | 'right'
  onCreateSkill: () => void
  onInsertSkill: (skillName: string) => void
  onOpenMarket: () => void
}

interface SkillsListProps {
  items: SkillsSubMenuItem[]
  firstFocusableItemRef: React.RefObject<HTMLDivElement | null>
  onInsertSkill: (skillName: string) => void
}

function SkillsList({ items, firstFocusableItemRef, onInsertSkill }: SkillsListProps) {
  const scrollViewportRef = useRef<HTMLDivElement>(null)
  const [hasOverflow, setHasOverflow] = useState(items.length > MAX_VISIBLE_SKILL_ROWS)
  const [isAtEnd, setIsAtEnd] = useState(false)

  const updateScrollState = useCallback((viewport: HTMLDivElement) => {
    if (viewport.scrollHeight === 0 && viewport.clientHeight === 0) return

    const maxScrollTop = Math.max(0, viewport.scrollHeight - viewport.clientHeight)
    const nextHasOverflow = maxScrollTop > 1
    setHasOverflow(nextHasOverflow)
    setIsAtEnd(!nextHasOverflow || maxScrollTop - viewport.scrollTop <= 1)
  }, [])

  useEffect(() => {
    const viewport = scrollViewportRef.current
    if (!viewport) return

    updateScrollState(viewport)
    const resizeObserver =
      typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(() => updateScrollState(viewport))
    resizeObserver?.observe(viewport)
    return () => resizeObserver?.disconnect()
  }, [items.length, updateScrollState])

  return (
    <div className="relative">
      <div
        ref={scrollViewportRef}
        data-testid="composer-skills-scroll"
        onScroll={(event) => updateScrollState(event.currentTarget)}
        className="max-h-[min(234px,max(0px,calc(var(--radix-dropdown-menu-content-available-height)-89px)))] overflow-y-auto overscroll-contain"
      >
        {items.map((item, index) => (
          <DropdownMenuItem
            key={item.name}
            ref={index === 0 ? firstFocusableItemRef : undefined}
            onSelect={() => onInsertSkill(item.name)}
            data-testid={`composer-skill-result-${item.name}`}
            className="min-h-[52px] items-start gap-1.5 rounded-[4px] px-2.5 py-2.5"
          >
            {item.icon}
            <span className="flex min-w-0 flex-1 flex-col gap-[3px]">
              <span className="block truncate text-xs leading-[15px] font-medium tracking-normal">{item.name}</span>
              {item.description && (
                <span className="text-muted-foreground block truncate font-[-apple-system,BlinkMacSystemFont,'SF_Pro',sans-serif] text-[11px] leading-[14px] font-normal tracking-normal">
                  {item.description}
                </span>
              )}
            </span>
          </DropdownMenuItem>
        ))}
      </div>
      {hasOverflow && !isAtEnd ? (
        <div
          aria-hidden="true"
          data-testid="composer-skills-overflow-fade"
          className="to-popover pointer-events-none absolute inset-x-0 bottom-0 h-[52px] bg-linear-to-b from-transparent dark:to-[var(--zc-paper)]"
        />
      ) : null}
    </div>
  )
}

export function SkillsSubMenu({
  showSkillList = true,
  items,
  isLoading,
  isError,
  labels,
  open,
  onOpenChange,
  subSide,
  onCreateSkill,
  onInsertSkill,
  onOpenMarket,
}: SkillsSubMenuProps) {
  const firstFocusableItemRef = useRef<HTMLDivElement>(null)
  const hasInstalledSkills = items.length > 0
  const hasVisibleSkillOptions = showSkillList && !isLoading && !isError && items.length > 0

  return (
    <DropdownMenuSub open={open} onOpenChange={onOpenChange}>
      <DropdownMenuSubTrigger
        onPointerMove={(event) => {
          if (event.pointerType !== 'touch') onOpenChange(true)
        }}
        data-testid="composer-add-skills"
        className="h-[35px] gap-1.5 rounded-[4px] px-2.5 py-2.5 text-xs leading-[15px] font-medium tracking-normal [&>svg]:size-[15px]"
      >
        <WrenchIcon />
        <span className="min-w-0 flex-1">{labels.trigger}</span>
      </DropdownMenuSubTrigger>
      <DropdownMenuPortal>
        <DropdownMenuSubContent
          surface="composer"
          data-preferred-side={subSide}
          sideOffset={4}
          align="end"
          className="w-[241px]"
          data-composer-menu-surface="true"
          data-testid="composer-skills-menu"
        >
          {showSkillList && (
            <>
              {isLoading ? (
                <div
                  role="status"
                  aria-live="polite"
                  aria-label={labels.loading}
                  className="flex items-center justify-center py-6"
                >
                  <ArrowPathIcon className="size-4 animate-spin" />
                </div>
              ) : isError ? (
                <div
                  role="status"
                  aria-live="polite"
                  className="flex flex-col items-center gap-2 px-3 py-5 text-center"
                >
                  <span className="text-muted-foreground text-xs">{labels.loadFailed}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={onOpenMarket}
                    data-testid="composer-add-skill-error-store"
                    className="hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 h-8 rounded-md border-0 px-3 text-sm active:not-aria-[haspopup]:translate-y-0"
                  >
                    {labels.openStore}
                  </Button>
                </div>
              ) : !hasInstalledSkills ? (
                <div
                  role="status"
                  aria-live="polite"
                  data-testid="composer-skills-empty"
                  className="flex flex-col items-center justify-center gap-2 px-3 py-10 text-center"
                >
                  <WrenchIcon className="text-muted-foreground/30 size-6" />
                  <span className="text-muted-foreground/65 text-xs leading-[15px] font-medium">{labels.empty}</span>
                </div>
              ) : (
                <SkillsList items={items} firstFocusableItemRef={firstFocusableItemRef} onInsertSkill={onInsertSkill} />
              )}

              <DropdownMenuSeparator className="my-1" />
            </>
          )}
          <DropdownMenuItem
            ref={hasVisibleSkillOptions ? undefined : firstFocusableItemRef}
            onSelect={onCreateSkill}
            data-testid="composer-add-skill-create"
            className="h-9 gap-1.5 rounded-[8px] px-2.5 py-2.5 text-xs leading-[15px] font-medium tracking-normal"
          >
            <ChatBubbleLeftEllipsisIcon className="size-[15px]" />
            <span className="min-w-0 flex-1 whitespace-nowrap">{labels.createWithZooClaw}</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={onOpenMarket}
            data-testid="composer-add-skill-market"
            className="h-9 gap-1.5 rounded-[8px] px-2.5 py-2.5 text-xs leading-[15px] font-medium tracking-normal"
          >
            <WrenchIcon className="size-[15px]" />
            <span className="min-w-0 flex-1">{labels.openStore}</span>
          </DropdownMenuItem>
        </DropdownMenuSubContent>
      </DropdownMenuPortal>
    </DropdownMenuSub>
  )
}
