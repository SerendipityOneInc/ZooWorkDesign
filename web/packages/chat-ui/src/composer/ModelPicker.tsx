'use client'

import { ChevronDownIcon, CpuChipIcon } from '@heroicons/react/20/solid'
import { CheckIcon } from '@heroicons/react/16/solid'
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
  Input,
  ScrollArea,
  Spinner,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@zooclaw/zooworkdesign'
import * as React from 'react'

import { cx } from '../utils'
import { groupModelPickerOptions } from './model-picker-groups'
import { ModelProviderIcon, type ModelProviderIconName } from './ModelProviderIcon'
import { ModelPickerPanelTransition } from './ModelPickerPanelTransition'

const MODEL_PANEL_CLASSES = 'bg-[var(--model-picker-panel,#ffffff)] dark:bg-[var(--model-picker-panel,var(--zc-wash))]'
const MODEL_BORDER_CLASSES =
  'border-[var(--model-picker-border,#e4e4e7)] dark:border-[var(--model-picker-border,var(--zc-line))]'
const MODEL_REVEAL_BATCH_SIZE = 5

function DropdownMenuModelTrigger({
  className,
  'data-hover-surface': hoverSurface = 'compact',
  ...props
}: React.ComponentProps<typeof Button> & {
  'data-hover-surface'?: string
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      data-slot="dropdown-menu-model-trigger"
      data-composer-model-trigger="true"
      data-hover-surface={hoverSurface}
      className={cx(
        'text-foreground h-8 max-w-full min-w-0 shrink gap-[7px] rounded-[8px] border-0 px-2.5 text-xs leading-4 font-medium sm:max-w-[196px]',
        'hover:bg-[var(--model-picker-hover,#f4f4f5)] dark:hover:bg-[var(--model-picker-hover,var(--zc-line))]',
        'aria-expanded:bg-[var(--model-picker-hover,#f4f4f5)] dark:aria-expanded:bg-[var(--model-picker-hover,var(--zc-line))]',
        'data-[state=open]:bg-[var(--model-picker-hover,#f4f4f5)] dark:data-[state=open]:bg-[var(--model-picker-hover,var(--zc-line))]',
        'focus-visible:text-foreground focus-visible:border-transparent focus-visible:bg-[var(--model-picker-hover,#f4f4f5)] focus-visible:ring-0 dark:focus-visible:bg-[var(--model-picker-hover,var(--zc-line))]',
        '[&>span]:min-w-0 [&>span]:truncate [&>svg]:shrink-0 [&>svg:not([class*="size-"])]:size-4',
        className,
      )}
      {...props}
    />
  )
}

function DropdownMenuModelItem({ className, ...props }: React.ComponentProps<typeof DropdownMenuItem>) {
  return (
    <DropdownMenuItem
      data-slot="dropdown-menu-model-item"
      data-variant={undefined}
      data-density={undefined}
      className={cx(
        'text-popover-foreground relative flex min-h-8 cursor-default items-center gap-1.5 rounded-[4px] px-2.5 py-1.5 text-xs leading-4 font-medium outline-hidden select-none',
        'focus:text-popover-foreground focus:bg-[var(--model-picker-hover,#f4f4f5)] dark:focus:bg-[var(--model-picker-hover,var(--zc-line))]',
        'data-[highlighted]:text-popover-foreground data-[highlighted]:bg-[var(--model-picker-hover,#f4f4f5)] dark:data-[highlighted]:bg-[var(--model-picker-hover,var(--zc-line))]',
        'data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0',
        className,
      )}
      {...props}
    />
  )
}

function DropdownMenuModelLabel({ className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span
      data-slot="dropdown-menu-model-label"
      className={cx('min-w-0 overflow-hidden text-ellipsis whitespace-nowrap', className)}
      {...props}
    />
  )
}

function DropdownMenuModelBadge({
  className,
  variant = 'multiplier',
  ...props
}: React.ComponentProps<'span'> & {
  variant?: 'multiplier' | 'default'
}) {
  return (
    <span
      data-slot="dropdown-menu-model-badge"
      data-variant={variant}
      className={cx(
        'inline-flex shrink-0 items-center justify-center rounded-[4px] p-1 text-[10px] leading-none font-semibold',
        variant === 'default' ? 'bg-blue-50 text-blue-700' : 'bg-muted text-muted-foreground',
        className,
      )}
      {...props}
    />
  )
}

function DropdownMenuModelCheck({ className, ...props }: React.ComponentProps<typeof CheckIcon>) {
  return (
    <CheckIcon
      data-slot="dropdown-menu-model-check"
      className={cx('text-popover-foreground ml-auto size-4 shrink-0', className)}
      {...props}
    />
  )
}

function DropdownMenuModelDetailContent({
  className,
  side = 'right',
  align = 'start',
  sideOffset = 4,
  ...props
}: React.ComponentProps<typeof HoverCardContent>) {
  return (
    <HoverCardContent
      data-slot="dropdown-menu-model-detail"
      surface="composer"
      side={side}
      align={align}
      sideOffset={sideOffset}
      className={cx('w-[213px] overflow-hidden rounded-[8px] p-0 text-left text-wrap', MODEL_PANEL_CLASSES, className)}
      {...props}
    />
  )
}

function DropdownMenuModelDetailTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="dropdown-menu-model-detail-title"
      className={cx('min-h-[35px] px-2.5 pt-2.5 pb-2 text-xs leading-[15px] font-medium', className)}
      {...props}
    />
  )
}

function DropdownMenuModelDetailDescription({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="dropdown-menu-model-detail-description"
      className={cx('text-muted-foreground min-h-10 px-2.5 pb-3 text-[11px] leading-[14px]', className)}
      {...props}
    />
  )
}

function DropdownMenuModelDetailFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="dropdown-menu-model-detail-footer"
      className={cx(
        'flex h-10 items-center justify-between gap-3 border-t px-2.5 text-xs leading-none font-medium',
        MODEL_BORDER_CLASSES,
        className,
      )}
      {...props}
    />
  )
}

export interface ModelPickerOption {
  /** Short lifecycle badge, such as a scheduled or completed model retirement. */
  statusLabel?: string
  id: string
  label: string
  description: string
  multiplier?: string | null
  default?: boolean
  providerIcon?: ModelProviderIconName
  /** Defaults to true. Keeps mixed catalogs browseable when only some models may be selected. */
  selectable?: boolean
  /** Presentation only: 2 places the model in the expandable list. Missing means primary. */
  displayTier?: 1 | 2
}

export interface ModelPickerProps {
  options: ModelPickerOption[]
  value: string
  /** Display-only metadata for a saved model outside the selectable catalog. */
  currentModel?: ModelPickerOption
  /** Show the selected model's Default badge in the trigger. */
  showDefaultBadge?: boolean
  /** Compact secondary text alongside the selected model. */
  triggerDetail?: React.ReactNode
  /** Optional controls before the model list and below its scrollable area. */
  menuStart?: React.ReactNode
  menuEnd?: React.ReactNode
  /** Optional second panel entered after a model selection succeeds. */
  modelSettings?: {
    /** Replaces the trigger's model metadata while the settings panel is open. */
    triggerLabel?: string
    available: (modelId: string) => boolean
    render: (model: ModelPickerOption, onBack: () => void) => React.ReactNode
  }
  /** Always shows search, labelled with this text. */
  searchPlaceholder?: string
  emptySearchLabel?: string
  /** Localized copy for the expandable list; its search label is used when `searchPlaceholder` is unset. */
  labels?: { search?: string; showMore?: string; showLess?: string; /** @deprecated Use showMore. */ moreModels?: string }
  onValueChange?: (value: string) => void | Promise<boolean>
  onRetry?: () => void
  disabled?: boolean
  loading?: boolean
  valueLoading?: boolean
  saving?: boolean
  managed?: boolean
  error?: string | null
  readOnlyReason?: string | null
  side?: 'top' | 'right' | 'bottom' | 'left'
  align?: 'start' | 'center' | 'end'
  className?: string
  contentClassName?: string
}

export function ModelPicker({
  options,
  value,
  currentModel,
  showDefaultBadge = false,
  triggerDetail,
  menuStart,
  menuEnd,
  modelSettings,
  searchPlaceholder,
  emptySearchLabel = 'No matching models',
  labels,
  onValueChange,
  onRetry,
  disabled = false,
  loading = false,
  valueLoading = false,
  saving = false,
  managed = false,
  error = null,
  readOnlyReason = null,
  side = 'bottom',
  align = 'end',
  className,
  contentClassName,
}: ModelPickerProps) {
  const [search, setSearch] = React.useState('')
  const detailIdPrefix = React.useId()
  const [menuOpen, setMenuOpen] = React.useState(false)
  const [revealedCount, setRevealedCount] = React.useState(0)
  const [detailModelId, setDetailModelId] = React.useState<string | null>(null)
  const [panelModelId, setPanelModelId] = React.useState<string | null>(null)
  const [selectingModel, setSelectingModel] = React.useState(false)
  const contentRef = React.useRef<HTMLDivElement>(null)
  const previousPanel = React.useRef<string | null>(null)
  const menuSession = React.useRef(0)
  const panelModel = options.find((option) => option.id === panelModelId)
  const settingsPanel =
    panelModel && modelSettings?.available(panelModel.id)
      ? modelSettings.render(panelModel, () => setPanelModelId(null))
      : null
  const settingsTriggerLabel = menuOpen && settingsPanel ? modelSettings?.triggerLabel : undefined
  React.useEffect(() => {
    if (menuOpen && !panelModelId && previousPanel.current) {
      const target =
        contentRef.current?.querySelector<HTMLElement>('[data-model-picker-option][aria-checked="true"]') ??
        contentRef.current?.querySelector<HTMLElement>('[data-model-picker-option]')
      target?.focus()
    }
    previousPanel.current = menuOpen ? panelModelId : null
  }, [menuOpen, panelModelId])
  React.useLayoutEffect(() => {
    const viewport = contentRef.current?.querySelector<HTMLElement>('[data-slot="scroll-area-viewport"]')
    if (viewport) viewport.scrollTop = revealedCount > 0 ? viewport.scrollHeight : 0
  }, [revealedCount])
  const selectedOption =
    options.find((option) => option.id === value) ?? (currentModel?.id === value ? currentModel : undefined)
  const selectedId = selectedOption?.id ?? ''
  const groups = groupModelPickerOptions(options, selectedId)
  const grouped = groups.more.length > 0
  const allModelsShown = revealedCount >= groups.more.length
  // A grouped catalog always offers search so collapsed models stay reachable.
  const searchLabel = searchPlaceholder ?? (grouped ? (labels?.search ?? 'Search models…') : undefined)
  const query = search.trim().toLowerCase()
  // Search always spans the complete catalog, regardless of how many rows are revealed.
  const visibleOptions = options.filter(
    (option) => !searchLabel || `${option.label} ${option.id}`.toLowerCase().includes(query),
  )
  const showGroups = grouped && !query
  const inventoryEmpty = options.length === 0
  const hasError = Boolean(error)
  const hasAdditionalControls = Boolean(menuStart || menuEnd)
  const readOnly = disabled || saving || (!hasAdditionalControls && (loading || (!hasError && inventoryEmpty)))
  // When the value resolves to no option and the caller has told us why the picker is
  // read-only, surface that reason instead of "Select model". A surface wired without a
  // model source (no controller, no workspace id) would otherwise render an inviting
  // "Select model" that can never resolve — the reason is already computed, so show it.
  const unselectableLabel = inventoryEmpty ? 'No models available' : (readOnlyReason ?? 'Select model')
  const triggerLabel = error
    ? 'Models unavailable'
    : (loading || valueLoading) && !selectedOption
      ? 'Loading models…'
      : (selectedOption?.label ?? unselectableLabel)

  const trigger = (
    <DropdownMenuTrigger asChild>
      <DropdownMenuModelTrigger
        disabled={readOnly}
        className={cx(triggerDetail && 'sm:max-w-[260px]', settingsTriggerLabel && 'w-[196px] rounded-full', className)}
        data-testid="model-picker-trigger"
      >
        {settingsTriggerLabel ? (
          <span className="text-muted-foreground flex-1 text-center font-normal">{settingsTriggerLabel}</span>
        ) : (
          <>
            {saving || ((loading || valueLoading) && !selectedOption) ? (
              <Spinner className="size-4" />
            ) : selectedOption ? (
              <ModelPickerIcon option={selectedOption} />
            ) : (
              <CpuChipIcon className="size-4" />
            )}
            <span>{triggerLabel}</span>
            {triggerDetail ? <span className="text-muted-foreground shrink-0 font-normal">{triggerDetail}</span> : null}
            {showDefaultBadge && selectedOption?.default && !hasError ? (
              <DropdownMenuModelBadge variant="default">Default</DropdownMenuModelBadge>
            ) : null}
          </>
        )}
        <ChevronDownIcon width={13} height={13} className="size-[13px] shrink-0" />
      </DropdownMenuModelTrigger>
    </DropdownMenuTrigger>
  )

  return (
    <DropdownMenu
      open={menuOpen}
      onOpenChange={(open) => {
        menuSession.current += 1
        setMenuOpen(open)
        // Keep the current view through Radix's exit animation. Resetting it on
        // close remounts/focuses model rows and can flash their detail cards.
        if (open) {
          setSearch('')
          setRevealedCount(0)
          setPanelModelId(null)
        }
        setDetailModelId(null)
      }}
    >
      {managed ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <span
              tabIndex={0}
              aria-label="Browse models. This Specialist manages its model."
              data-testid="model-picker-managed-trigger"
              className="focus-visible:ring-ring inline-flex max-w-full min-w-0 shrink rounded-md focus-visible:ring-2 focus-visible:outline-none"
            >
              {trigger}
            </span>
          </TooltipTrigger>
          <TooltipContent side="top">This Specialist manages its model.</TooltipContent>
        </Tooltip>
      ) : (
        trigger
      )}

      {hasError || !inventoryEmpty || hasAdditionalControls ? (
        <DropdownMenuContent
          asChild
          ref={contentRef}
          surface="composer"
          data-surface="model"
          side={side}
          align={align}
          className={cx(
            "flex w-[276px] flex-col overflow-hidden rounded-[8px] border-0 font-['Inter',ui-sans-serif,system-ui,sans-serif] shadow-[0_4px_16px_rgb(0_0_0/0.12)] dark:shadow-[0_4px_16px_rgb(0_0_0/0.4)]",
            MODEL_PANEL_CLASSES,
            menuEnd
              ? 'max-h-[min(29rem,var(--radix-dropdown-menu-content-available-height))]'
              : 'max-h-[min(20.5rem,var(--radix-dropdown-menu-content-available-height))]',
            settingsPanel && 'ring-border/60 w-[304px] max-w-[calc(100vw-1rem)] rounded-2xl p-2 ring-1',
            'p-0 transition-[border-radius] duration-200 motion-reduce:transition-none',
            contentClassName,
          )}
          data-testid="model-picker-menu"
        >
          <ModelPickerPanelTransition panel={settingsPanel ? 'settings' : 'models'} searching={Boolean(query)} tall={Boolean(menuEnd)}>
          {settingsPanel ?? (
            <>
              {menuStart}
              {searchLabel && !hasError ? (
                <div className={cx('z-10 shrink-0 p-1 pb-2', MODEL_PANEL_CLASSES)}>
                  <Input
                    aria-label={searchLabel}
                    placeholder={searchLabel}
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key !== 'Escape' && event.key !== 'Tab') event.stopPropagation()
                      if (event.key === 'ArrowDown') {
                        event.preventDefault()
                        event.currentTarget
                          .closest('[role="menu"]')
                          ?.querySelector<HTMLElement>('[data-model-picker-option]')
                          ?.focus()
                      }
                    }}
                    className="h-8 text-xs"
                  />
                </div>
              ) : null}
              <ScrollArea
                type="auto"
                className="flex min-h-0 flex-1 flex-col [&>[data-slot=scroll-area-scrollbar]]:w-1.5 [&>[data-slot=scroll-area-viewport]]:min-h-0 [&>[data-slot=scroll-area-viewport]]:flex-1 [&>[data-slot=scroll-area-viewport]]:overscroll-contain"
                onScrollCapture={() => setDetailModelId(null)}
              >
                {hasError ? (
                  <>
                    <div role="alert" className="text-destructive px-2 py-2 text-xs">
                      {error}
                    </div>
                    {onRetry ? (
                      <DropdownMenuItem className="h-10" onSelect={onRetry}>
                        Retry
                      </DropdownMenuItem>
                    ) : null}
                  </>
                ) : (
                  <>
                    {readOnlyReason ? (
                      <div role="note" className="text-muted-foreground px-2.5 py-2 text-[11px] leading-4">
                        {readOnlyReason}
                      </div>
                    ) : null}
                    {visibleOptions.length === 0 ? (
                      <div role="status" className="text-muted-foreground p-2 text-xs">
                        {emptySearchLabel}
                      </div>
                    ) : null}
                    {(showGroups ? groups.primary : visibleOptions).map(renderOption)}
                    {showGroups ? groups.more.slice(0, revealedCount).map(renderOption) : null}
                  </>
                )}
              </ScrollArea>
              {showGroups && !hasError ? (
                <div className={cx('shrink-0 pt-1', MODEL_PANEL_CLASSES)}>
                  <DropdownMenuModelItem
                    aria-expanded={revealedCount > 0}
                    data-testid="model-picker-more-toggle"
                    className="text-muted-foreground"
                    onSelect={(event) => {
                      event.preventDefault()
                      setDetailModelId(null)
                      setRevealedCount(allModelsShown ? 0 : Math.min(revealedCount + MODEL_REVEAL_BATCH_SIZE, groups.more.length))
                    }}
                  >
                    <DropdownMenuModelLabel>
                      {allModelsShown ? (labels?.showLess ?? 'Show less') : (labels?.showMore ?? labels?.moreModels ?? 'Show more')}
                    </DropdownMenuModelLabel>
                    <ChevronDownIcon
                      width={13}
                      height={13}
                      className={cx('ml-auto size-[13px] shrink-0', allModelsShown && 'rotate-180')}
                    />
                  </DropdownMenuModelItem>
                </div>
              ) : null}
              {menuEnd}
            </>
          )}
          </ModelPickerPanelTransition>
        </DropdownMenuContent>
      ) : null}
    </DropdownMenu>
  )

  function renderOption(option: ModelPickerOption) {
    const selected = option.id === selectedId
    const canShowDetails = menuOpen && !panelModelId
    const showDetails = canShowDetails && detailModelId === option.id
    const detailId = `${detailIdPrefix}-model-${options.indexOf(option)}`
    const selectable =
      Boolean(onValueChange) && option.selectable !== false && !disabled && !loading && !saving && !selectingModel
    const selectOption = (event: Event) => {
      if (!selectable || !onValueChange) {
        event.preventDefault()
        return
      }
      setDetailModelId(null)
      if (modelSettings?.available(option.id)) {
        event.preventDefault()
        const session = menuSession.current
        setSelectingModel(true)
        void Promise.resolve()
          .then(async () => onValueChange(option.id))
          .then((saved) => {
            if (saved !== false && session === menuSession.current) {
              setPanelModelId(option.id)
              setSearch('')
            }
          })
          .catch(() => {
            // The caller owns save errors; leave its model list and retry state visible.
          })
          .finally(() => setSelectingModel(false))
        return
      }
      setMenuOpen(false)
      void onValueChange(option.id)
    }

    return (
      <HoverCard
        key={option.id}
        open={showDetails}
        onOpenChange={(open) => {
          if (open && !canShowDetails) return
          setDetailModelId((current) => (open ? option.id : current === option.id ? null : current))
        }}
        openDelay={0}
      >
        <HoverCardTrigger
          asChild
          onPointerEnter={() => { if (canShowDetails) setDetailModelId(option.id) }}
          onFocus={() => { if (canShowDetails) setDetailModelId(option.id) }}
        >
          <DropdownMenuModelItem
            role="menuitemradio"
            aria-checked={selected}
            aria-disabled={!selectable}
            data-read-only={!selectable || undefined}
            aria-describedby={showDetails ? detailId : undefined}
            onSelect={selectOption}
            data-model-picker-option={option.id}
            data-testid={`model-picker-option-${option.id}`}
            className={!selectable ? 'cursor-help opacity-70' : undefined}
          >
            <ModelPickerIcon option={option} />
            <DropdownMenuModelLabel>{option.label}</DropdownMenuModelLabel>
            {option.statusLabel ? <DropdownMenuModelBadge>{option.statusLabel}</DropdownMenuModelBadge> : null}
            {option.multiplier ? <DropdownMenuModelBadge>{option.multiplier}</DropdownMenuModelBadge> : null}
            {option.default ? <DropdownMenuModelBadge variant="default">Default</DropdownMenuModelBadge> : null}
            {selected ? <DropdownMenuModelCheck /> : null}
          </DropdownMenuModelItem>
        </HoverCardTrigger>
        <DropdownMenuModelDetailContent
          id={detailId}
          role="note"
          aria-label={`${option.label} details`}
          data-model-picker-details={option.id}
          data-testid="model-picker-details"
        >
          <DropdownMenuModelDetailTitle>{option.label}</DropdownMenuModelDetailTitle>
          <DropdownMenuModelDetailDescription>{option.description}</DropdownMenuModelDetailDescription>
          {option.multiplier ? (
            <DropdownMenuModelDetailFooter>
              <span>Token consumption rate</span>
              <DropdownMenuModelBadge>{option.multiplier}</DropdownMenuModelBadge>
            </DropdownMenuModelDetailFooter>
          ) : null}
        </DropdownMenuModelDetailContent>
      </HoverCard>
    )
  }
}

function ModelPickerIcon({ option }: { option: ModelPickerOption }) {
  if (!option.providerIcon) {
    return <CpuChipIcon data-slot="model-picker-icon" data-model-provider-icon="unknown" className="size-3 shrink-0" />
  }

  return <ModelProviderIcon provider={option.providerIcon} data-slot="model-picker-icon" className="size-3 shrink-0" />
}
