'use client'

import { CheckIcon } from '@heroicons/react/16/solid'
import { ArrowUpLeftIcon } from '@heroicons/react/24/outline'
import {
  Button,
  cn,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@zooclaw/zooworkdesign'
import { useRef, useState } from 'react'

import { cx } from '../utils'
import { NewTaskTemplateDialog } from './NewTaskTemplateDialog'

export interface NewTaskStarterAgent {
  id: string
  displayName: string
  avatar?: React.ReactNode
  description?: string
}

export interface NewTaskStarterPrompt {
  id: string
  title: string
  prompt: string
  agent: NewTaskStarterAgent
}

export interface NewTaskStarterCategory {
  id: string
  label: string
  icon?: React.ReactNode
  prompts: NewTaskStarterPrompt[]
}

export interface NewTaskStarterTemplate {
  id: string
  name: string
  thumbnailUrl: string
  previewUrls: string[]
  themeLabel: string
  metaLabel: string
  description?: string
  tags?: string[]
  bestFor?: string
  agent: NewTaskStarterAgent
}

export interface NewTaskStarterMoreOption extends Omit<NewTaskStarterCategory, 'prompts'> {
  id: string
  label: string
  icon?: React.ReactNode
  prompts?: NewTaskStarterPrompt[]
}

export interface NewTaskStarterLabels {
  samplePrompts: string
  chooseTemplate: string
  more: string
  addAndUse: string
  useTemplate: string
  closeTemplatePreview: string
  templateBestFor: string
  previewTemplate: string
  templateMore?: string
}

export type NewTaskStarterAppearance = 'default' | 'landing' | 'landing-adaptive'

export interface NewTaskStarterCategoryPillProps
  extends Omit<React.ComponentProps<typeof Button>, 'variant'> {
  appearance?: NewTaskStarterAppearance
  selected?: boolean
  selectedIndicator?: React.ReactNode
  showSelectedIndicator?: boolean
}

export interface NewTaskStarterProps {
  categories: NewTaskStarterCategory[]
  activeCategoryId: string | null
  labels: NewTaskStarterLabels
  onCategoryChange: (categoryId: string) => void
  onPromptSelect: (prompt: NewTaskStarterPrompt) => void
  selectedPromptId?: string | null
  selectedTemplateId?: string | null
  templates?: NewTaskStarterTemplate[]
  templateCategoryId?: string
  onTemplateSelect?: (template: NewTaskStarterTemplate) => void
  onMore?: () => void
  moreOptions?: NewTaskStarterMoreOption[]
  onMoreSelect?: (id: string) => void
  moreAction?: React.ReactNode
  onTemplateMore?: () => void
  templateMoreHref?: string
  disabled?: boolean
  className?: string
  appearance?: NewTaskStarterAppearance
  selectedCategoryIndicator?: React.ReactNode
}

export function NewTaskStarterCategoryPill({
  appearance = 'default',
  selected = false,
  selectedIndicator,
  showSelectedIndicator = selected,
  className,
  children,
  ...props
}: NewTaskStarterCategoryPillProps) {
  const usesLandingLayout = appearance !== 'default'
  const usesAdaptivePalette = appearance === 'landing-adaptive'

  return (
    <Button
      {...props}
      data-slot="starter-category"
      variant="outline"
      className={cx(
        usesLandingLayout
          ? "lp-cat-pill relative inline-flex h-11 min-w-20 cursor-pointer items-center justify-center gap-2.5 overflow-visible rounded-[100000px] border border-solid border-landing-glass-border bg-landing-glass-bg px-4 py-[7px] font-[family-name:'Roboto',sans-serif] text-sm font-normal tracking-[-0.13px] whitespace-nowrap text-landing-fg shadow-none backdrop-blur-[10px] transition-colors duration-200 ease-in-out hover:border-landing-glass-border hover:bg-landing-glass-hover max-[481px]:h-10 max-[481px]:min-w-0"
          : 'relative h-11 gap-2 overflow-visible rounded-full px-4 text-sm',
        usesAdaptivePalette &&
          'border-border/70 bg-card/35 text-foreground hover:border-border hover:bg-accent/70 focus-visible:border-foreground/25 focus-visible:ring-2 focus-visible:ring-foreground/10 dark:bg-card/45',
        appearance === 'landing' && selected && 'border-landing-fg border-[1.2px] hover:border-landing-fg',
        usesAdaptivePalette &&
          selected &&
          'border-foreground/25 bg-accent/65 text-foreground shadow-none hover:border-foreground/30 hover:bg-accent/75',
        appearance === 'default' &&
          selected &&
          'border-foreground/35 bg-card text-foreground shadow-xs hover:border-foreground/45 hover:bg-card',
        className,
      )}
    >
      {children}
      {showSelectedIndicator
        ? (selectedIndicator ?? (
            <span
              data-slot="starter-category-check"
              aria-hidden="true"
              className="bg-foreground text-background ring-background absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full shadow-xs ring-2"
            >
              <CheckIcon className="size-3" />
            </span>
          ))
        : null}
    </Button>
  )
}

export function NewTaskStarter({
  categories,
  activeCategoryId,
  labels,
  onCategoryChange,
  onPromptSelect,
  selectedPromptId,
  selectedTemplateId,
  templates = [],
  templateCategoryId,
  onTemplateSelect,
  onMore,
  moreOptions = [],
  onMoreSelect,
  moreAction,
  onTemplateMore,
  templateMoreHref,
  disabled = false,
  className,
  appearance = 'default',
  selectedCategoryIndicator,
}: NewTaskStarterProps) {
  const [previewTemplate, setPreviewTemplate] = useState<NewTaskStarterTemplate | null>(null)
  const categoryRefs = useRef<Array<HTMLButtonElement | null>>([])
  const previewTriggerRef = useRef<HTMLButtonElement | null>(null)
  const usesLandingLayout = appearance !== 'default'
  const usesAdaptivePalette = appearance === 'landing-adaptive'
  const activeMoreOption = moreOptions.find((option) => option.id === activeCategoryId)
  const activeCategory =
    categories.find((category) => category.id === activeCategoryId) ??
    (activeMoreOption?.prompts ? { ...activeMoreOption, prompts: activeMoreOption.prompts } : null)
  const showTemplates = Boolean(
    templateCategoryId && activeCategoryId === templateCategoryId && templates.length > 0,
  )

  if (categories.length === 0) return null

  const moveCategory = (index: number, direction: -1 | 1) => {
    const nextIndex = (index + direction + categories.length) % categories.length
    const nextCategory = categories[nextIndex]
    onCategoryChange(nextCategory.id)
    categoryRefs.current[nextIndex]?.focus()
  }

  return (
    <section
      data-testid="new-task-starter"
      data-new-task-starter-appearance={appearance}
      className={cx('mx-auto flex w-full flex-col items-stretch', className)}
    >
      <div
        role="group"
        aria-label={labels.samplePrompts}
        className={cx(
          'flex snap-x items-center overflow-x-auto px-1 py-1 sm:flex-wrap sm:justify-center sm:overflow-visible',
          usesLandingLayout ? 'gap-4 max-[481px]:gap-2.5' : 'gap-2',
        )}
      >
        {categories.map((category, index) => {
          const selected = category.id === activeCategoryId
          return (
            <NewTaskStarterCategoryPill
              key={category.id}
              ref={(node) => {
                categoryRefs.current[index] = node
              }}
              type="button"
              aria-pressed={selected}
              disabled={disabled}
              appearance={appearance}
              selected={selected}
              selectedIndicator={selectedCategoryIndicator}
              className="snap-start"
              onClick={() => onCategoryChange(category.id)}
              onKeyDown={(event) => {
                if (event.key === 'ArrowRight') {
                  event.preventDefault()
                  moveCategory(index, 1)
                }
                if (event.key === 'ArrowLeft') {
                  event.preventDefault()
                  moveCategory(index, -1)
                }
              }}
            >
              {category.icon}
              {category.label}
            </NewTaskStarterCategoryPill>
          )
        })}
        {moreAction ??
          (moreOptions.length > 0 && onMoreSelect ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <NewTaskStarterCategoryPill
                  type="button"
                  aria-pressed={Boolean(activeMoreOption)}
                  disabled={disabled}
                  appearance={appearance}
                  selected={Boolean(activeMoreOption)}
                  selectedIndicator={selectedCategoryIndicator}
                  className="snap-start px-5"
                >
                  {activeMoreOption?.icon}
                  {activeMoreOption?.label ?? labels.more}
                </NewTaskStarterCategoryPill>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                surface="composer"
                side="bottom"
                align="end"
                data-composer-menu-surface="true"
                data-new-task-starter-appearance={appearance}
                className={cx(
                  'min-w-44 rounded-lg p-1',
                  appearance === 'landing' &&
                    'border-landing-border-ui bg-landing-menu-bg text-landing-fg border shadow-[var(--landing-shadow-dropdown)]',
                  usesAdaptivePalette &&
                    'border-border/70 bg-popover text-popover-foreground border shadow-lg dark:bg-popover',
                )}
              >
                {moreOptions.map((option) => (
                  <DropdownMenuItem
                    key={option.id}
                    className="min-h-10 gap-2 rounded-md px-3 text-sm text-inherit"
                    onSelect={() => onMoreSelect(option.id)}
                  >
                    {option.icon}
                    <span>{option.label}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : onMore ? (
            <NewTaskStarterCategoryPill
              type="button"
              disabled={disabled}
              appearance={appearance}
              className="snap-start px-5"
              onClick={onMore}
            >
              {labels.more}
            </NewTaskStarterCategoryPill>
          ) : null)}
      </div>

      {activeCategory && activeCategory.prompts.length > 0 ? (
        <div className="mt-7">
          <p
            className={cx(
              'font-semibold uppercase',
              appearance === 'landing'
                ? "font-[family-name:'Inter',sans-serif] text-[10.5px] tracking-[1.365px] text-landing-text-tertiary"
                : usesAdaptivePalette
                  ? "text-muted-foreground font-[family-name:'Inter',sans-serif] text-[10.5px] tracking-[1.365px]"
                : 'text-muted-foreground text-[11px] tracking-[0.14em]',
            )}
          >
            {labels.samplePrompts}
          </p>
          <div
            className={cx(
              'grid sm:grid-cols-2 xl:grid-cols-4',
              usesLandingLayout ? 'mt-6 gap-5' : 'mt-4 gap-3',
            )}
          >
            {activeCategory.prompts.map((prompt) => {
              const selected = prompt.id === selectedPromptId
              return (
                <button
                  key={prompt.id}
                  type="button"
                  data-slot="starter-prompt"
                  aria-pressed={selected}
                  disabled={disabled}
                  onClick={() => onPromptSelect(prompt)}
                  className={cn(
                    'group flex min-h-36 flex-col items-start justify-between gap-5 border text-left transition-[background,border-color,box-shadow] disabled:cursor-not-allowed disabled:opacity-50',
                    appearance === 'landing'
                      ? 'border-landing-border-prompt bg-transparent p-[17px] shadow-none hover:border-landing-border-prompt-hover'
                      : usesAdaptivePalette
                        ? 'border-border/70 bg-transparent p-[17px] text-foreground shadow-none hover:border-border hover:bg-accent/20'
                      : 'border-border bg-card text-card-foreground hover:border-foreground/25 hover:bg-accent rounded-2xl p-4 shadow-sm',
                    appearance === 'landing' &&
                      (selected
                        ? 'border-landing-selected-border bg-landing-selected-bg rounded-2xl backdrop-blur-[10px]'
                        : 'rounded-[20px]'),
                    usesAdaptivePalette &&
                      (selected
                        ? 'border-foreground/20 bg-accent/45 rounded-2xl backdrop-blur-[10px]'
                        : 'rounded-[20px]'),
                    appearance === 'default' && selected && 'border-foreground/25 bg-accent shadow-sm',
                  )}
                >
                  <span
                    className={cx(
                      'text-sm',
                      appearance === 'landing'
                        ? "font-[family-name:'Roboto',sans-serif] leading-7 font-normal text-landing-fg"
                        : usesAdaptivePalette
                          ? "font-[family-name:'Roboto',sans-serif] leading-7 font-normal text-foreground"
                        : 'leading-6 font-medium',
                    )}
                  >
                    {prompt.title}
                  </span>
                  <span className="flex w-full items-center justify-between gap-3">
                    <span
                      data-slot="starter-agent"
                      className={cx(
                        'inline-flex min-w-0 items-center rounded-full border font-semibold',
                        appearance === 'landing'
                          ? "gap-2.5 border-landing-glass-border bg-landing-glass-bg py-[7px] pr-[17px] pl-[9px] font-[family-name:'Inter',sans-serif] text-[13px] tracking-[-0.13px] text-landing-text-agent backdrop-blur-[10px] [&_img]:size-[30px] [&_img]:shadow-[var(--landing-shadow-agent-avatar)]"
                          : usesAdaptivePalette
                            ? "border-border/70 bg-card/55 gap-2.5 py-[7px] pr-[17px] pl-[9px] font-[family-name:'Inter',sans-serif] text-[13px] tracking-[-0.13px] text-foreground backdrop-blur-[10px] [&_img]:size-[30px] [&_img]:shadow-sm"
                          : 'border-border bg-background gap-2 py-1 pr-3 pl-1 text-xs',
                      )}
                    >
                      {prompt.agent.avatar}
                      <span className="truncate">{prompt.agent.displayName}</span>
                    </span>
                    <ArrowUpLeftIcon
                      className={cx(
                        'shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:-translate-x-0.5',
                        appearance === 'landing'
                          ? 'size-3.5 text-landing-text-tertiary'
                          : usesAdaptivePalette
                            ? 'text-muted-foreground size-3.5'
                          : 'text-muted-foreground size-4',
                      )}
                    />
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      ) : null}

      {showTemplates ? (
        <div className="mt-9">
          <div className="flex items-center justify-between gap-4">
            <p
              className={cx(
                'font-semibold uppercase',
                appearance === 'landing'
                  ? "font-[family-name:'Inter',sans-serif] text-[10.5px] tracking-[1.365px] text-landing-text-tertiary"
                  : usesAdaptivePalette
                    ? "text-muted-foreground font-[family-name:'Inter',sans-serif] text-[10.5px] tracking-[1.365px]"
                  : 'text-muted-foreground text-[11px] tracking-[0.14em]',
              )}
            >
              {labels.chooseTemplate}
            </p>
            {labels.templateMore && templateMoreHref ? (
              <a
                href={templateMoreHref}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground text-xs font-semibold tracking-[0.14em] uppercase"
              >
                {labels.templateMore}
              </a>
            ) : labels.templateMore && onTemplateMore ? (
              <Button type="button" variant="link" size="sm" onClick={onTemplateMore}>
                {labels.templateMore}
              </Button>
            ) : null}
          </div>
          <div className="mt-4 flex snap-x gap-4 overflow-x-auto pb-3 xl:grid xl:grid-cols-4 xl:overflow-visible">
            {templates.map((template) => {
              const selected = template.id === selectedTemplateId
              return (
                <article
                  key={template.id}
                  data-slot="starter-template"
                  className={cn(
                    'w-[17rem] shrink-0 snap-start overflow-hidden rounded-2xl border transition-[border-color,box-shadow] xl:w-auto',
                    appearance === 'landing'
                      ? 'border-landing-card-glass bg-landing-card-glass shadow-[var(--landing-shadow-template-card)] backdrop-blur-[9px]'
                      : usesAdaptivePalette
                        ? 'border-border/70 bg-card/55 shadow-sm backdrop-blur-[9px]'
                      : 'border-border bg-card shadow-sm',
                    appearance === 'landing' &&
                      selected &&
                      'border-landing-template-selected-border shadow-[var(--landing-shadow-template-selected)]',
                    usesAdaptivePalette && selected && 'border-foreground/20 shadow-sm',
                    appearance === 'default' && selected && 'border-foreground/25 shadow-sm',
                  )}
                >
                  <button
                    type="button"
                    disabled={disabled}
                    aria-label={`${labels.previewTemplate} ${template.name}`}
                    onClick={(event) => {
                      previewTriggerRef.current = event.currentTarget
                      setPreviewTemplate(template)
                    }}
                    className="group/template relative block aspect-video w-full overflow-hidden disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <img
                      src={template.thumbnailUrl}
                      alt=""
                      loading="lazy"
                      className="size-full object-cover transition-transform duration-300 group-hover/template:scale-105"
                    />
                    <span className="absolute inset-x-2 top-2 flex items-center justify-between gap-2">
                      <span className="bg-foreground/85 text-background rounded-md px-2 py-1 text-[10px] font-bold">
                        {template.themeLabel}
                      </span>
                      <span className="bg-foreground/70 text-background rounded-md px-2 py-1 text-[10px] font-bold">
                        {template.metaLabel}
                      </span>
                    </span>
                  </button>
                  <div className="flex items-center justify-between gap-3 p-3">
                    <span className="min-w-0 truncate text-sm font-semibold">{template.name}</span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={disabled || !onTemplateSelect}
                      aria-pressed={selected}
                      aria-label={`${labels.addAndUse} ${template.name}`}
                      onClick={() => onTemplateSelect?.(template)}
                    >
                      {labels.addAndUse}
                    </Button>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      ) : null}

      {onTemplateSelect ? (
        <NewTaskTemplateDialog
          template={previewTemplate}
          labels={labels}
          onOpenChange={(open) => {
            if (!open) {
              setPreviewTemplate(null)
              requestAnimationFrame(() => previewTriggerRef.current?.focus())
            }
          }}
          onSelect={onTemplateSelect}
        />
      ) : null}
    </section>
  )
}
