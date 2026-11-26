'use client'

import { CheckIcon, ChevronDownIcon } from '@heroicons/react/20/solid'
import { ArrowUpRightIcon, UserGroupIcon, UserPlusIcon } from '@heroicons/react/24/outline'
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@zooclaw/zooworkdesign'
import * as React from 'react'

import { cx } from '../utils'

const AGENT_PANEL_CLASSES =
  'bg-popover dark:bg-[var(--agent-picker-panel,var(--ecap-surface-2,var(--zc-paper)))]'
const AGENT_HIGHLIGHT_CLASSES =
  'dark:focus:bg-[var(--agent-picker-hover,var(--ecap-surface-3,var(--zc-line)))] dark:data-[highlighted]:bg-[var(--agent-picker-hover,var(--ecap-surface-3,var(--zc-line)))] dark:data-[highlighted]:text-foreground'

export interface AgentPickerOption {
  id: string
  displayName: string
  description: string
  avatar: React.ReactNode
}

export interface AgentPickerProps {
  options: AgentPickerOption[]
  selectedId?: string
  isLoading?: boolean
  readOnly?: boolean
  open?: boolean
  onSelect: (id: string) => void
  onHireMore?: () => void
  onOpenChange?: (open: boolean) => void
  side?: 'top' | 'right' | 'bottom' | 'left'
  triggerLabel?: string
  switchLabel?: string
  hireMoreLabel?: string
  className?: string
  contentClassName?: string
}

export function AgentPicker({
  options,
  selectedId,
  isLoading = false,
  readOnly = false,
  open: controlledOpen,
  onSelect,
  onHireMore,
  onOpenChange,
  side = 'bottom',
  triggerLabel,
  switchLabel = 'Switch Agent',
  hireMoreLabel = 'Hire more Agents',
  className,
  contentClassName,
}: AgentPickerProps) {
  const [internalOpen, setInternalOpen] = React.useState(false)
  const open = controlledOpen ?? internalOpen
  const [tooltipOpen, setTooltipOpen] = React.useState(false)
  const selectedOption = options.find((option) => option.id === selectedId) ?? options[0]
  const effectiveSelectedId = selectedOption?.id
  const disabled = isLoading || options.length === 0

  if (readOnly) {
    return (
      <div
        data-testid="agent-picker-static"
        className={cx(
          'flex h-8 max-w-full min-w-0 shrink items-center gap-1.5 px-2 text-sm font-medium sm:max-w-[213px]',
          className,
        )}
      >
        {selectedOption?.avatar}
        <span className="min-w-0 truncate">{selectedOption?.displayName ?? switchLabel}</span>
      </div>
    )
  }

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) setTooltipOpen(false)
    if (controlledOpen === undefined) setInternalOpen(nextOpen)
    onOpenChange?.(nextOpen)
  }

  return (
    <DropdownMenu open={open} onOpenChange={handleOpenChange}>
      <Tooltip open={!open && tooltipOpen}>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={disabled}
              onBlur={() => setTooltipOpen(false)}
              onFocus={() => setTooltipOpen(false)}
              onPointerMove={() => setTooltipOpen(true)}
              onPointerOut={() => setTooltipOpen(false)}
              data-testid="agent-picker-trigger"
              className={cx(
                'h-8 max-w-full min-w-0 shrink gap-1.5 rounded-md border-0 px-2 text-sm font-medium focus-visible:bg-accent focus-visible:text-accent-foreground focus-visible:ring-0 sm:max-w-[213px]',
                className,
              )}
            >
              {triggerLabel ? (
                <>
                  <UserPlusIcon className="size-5" />
                  <span className="min-w-0 truncate">{triggerLabel}</span>
                </>
              ) : selectedOption ? (
                <>
                  {selectedOption.avatar}
                  <span className="min-w-0 truncate">{selectedOption.displayName}</span>
                </>
              ) : (
                <span className="min-w-0 truncate">{switchLabel}</span>
              )}
              {triggerLabel ? null : <ChevronDownIcon className="h-4 w-4" />}
            </Button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent side="top" align="center" sideOffset={8}>
          {switchLabel}
        </TooltipContent>
      </Tooltip>

      <DropdownMenuContent
        surface="composer"
        side={side}
        align="start"
        data-composer-menu-surface="true"
        data-testid="agent-picker-menu"
        className={cx(
          "w-[213px] max-h-[min(20.5rem,var(--radix-dropdown-menu-content-available-height))] overflow-y-auto overscroll-contain rounded-[8px] border-0 p-1 font-['Inter',ui-sans-serif,system-ui,sans-serif] shadow-[0_4px_16px_rgb(0_0_0/0.12)] dark:shadow-[0_4px_16px_rgb(0_0_0/0.4)]",
          AGENT_PANEL_CLASSES,
          contentClassName,
        )}
      >
        {options.map((option) => {
          const selected = option.id === effectiveSelectedId
          return (
            <DropdownMenuItem
              key={option.id}
              role="menuitemradio"
              aria-checked={selected}
              onSelect={() => onSelect(option.id)}
              data-testid={`agent-picker-option-${option.id}`}
              className={cx(
                "min-h-[42px] w-[205px] gap-1.5 rounded-[8px] py-1.5 pr-2 pl-2.5 text-left [&_svg:not([class*='text-'])]:text-muted-foreground",
                AGENT_HIGHLIGHT_CLASSES,
              )}
            >
              {option.avatar}
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-xs leading-[15px] font-medium tracking-normal">
                  {option.displayName}
                </span>
                <span className="truncate font-[-apple-system,BlinkMacSystemFont,'SF_Pro',sans-serif] text-[10px] leading-[13px] font-normal tracking-normal text-muted-foreground">
                  {option.description}
                </span>
              </span>
              {selected ? <CheckIcon data-slot="agent-picker-check" className="size-4" /> : null}
            </DropdownMenuItem>
          )
        })}

        {onHireMore ? (
          <>
            <DropdownMenuSeparator className="mx-0 my-0 w-[205px]" />
            <DropdownMenuItem
              onSelect={onHireMore}
              data-testid="agent-picker-hire-more"
              className={cx(
                "h-[35px] w-[205px] gap-1.5 rounded-[4px] px-2.5 py-2.5 text-xs leading-[15px] font-medium tracking-normal [&_svg:not([class*='text-'])]:text-muted-foreground",
                AGENT_HIGHLIGHT_CLASSES,
              )}
            >
              <UserGroupIcon className="size-[15px]" />
              <span className="min-w-0 flex-1 truncate">{hireMoreLabel}</span>
              <ArrowUpRightIcon className="size-[15px]" />
            </DropdownMenuItem>
          </>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
