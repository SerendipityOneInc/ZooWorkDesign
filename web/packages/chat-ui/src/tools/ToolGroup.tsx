'use client'

import {
  CheckIcon,
  ChevronRightIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  MinusCircleIcon,
  PlusIcon,
} from '@heroicons/react/20/solid'
import {
  Button,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
  Spinner,
} from '@zooclaw/zooworkdesign'
import { useEffect, useMemo, useState } from 'react'

import { useChatUiConfig } from '../provider'
import type { ToolStep } from '../types'
import { toolIdentityDetail, toolLabelKey } from './tool-presentation'

type Translate = (key: string, params?: Record<string, string>) => string

interface DisclosureState {
  expanded: boolean
  touched: boolean
  lastDefault: boolean
}

/**
 * Codex-style activity disclosure for one contiguous run.
 *
 * The transport adapter owns parsing, redaction and run grouping. This
 * presentational component renders safe argument previews and deterministic
 * localized labels. Human-authored command progress may be shown, but machine
 * payloads (JSON, HTML, response bodies, file contents) never enter the
 * timeline.
 */
export function ToolGroup({
  steps,
  defaultExpanded,
  isStreaming = false,
  activityLabel,
}: {
  steps: ToolStep[]
  /** Explicit values override automatic expansion from status; manual toggles still win. */
  defaultExpanded?: boolean
  isStreaming?: boolean
  /** Current live status, displayed without hiding the step history. */
  activityLabel?: string | null
  /** @deprecated Kept for source compatibility. Timeline copy never reads the user prompt. */
  userQuery?: string
}) {
  // Background children keep their own live status. Terminal attempts use the
  // normal activity summary, with any failures preserved in the detail rows.
  const activeDelegatedSteps = steps.filter(isActiveDelegatedWorkStep)
  const activitySteps = steps.filter((step) => !isActiveDelegatedWorkStep(step))

  return (
    <>
      <ActivityGroup steps={activitySteps} defaultExpanded={defaultExpanded} isStreaming={isStreaming} activityLabel={activityLabel} />
      <ActivityGroup steps={activeDelegatedSteps} delegated />
    </>
  )
}

function ActivityGroup({
  steps,
  defaultExpanded,
  isStreaming = false,
  delegated = false,
  activityLabel,
}: {
  steps: ToolStep[]
  defaultExpanded?: boolean
  isStreaming?: boolean
  delegated?: boolean
  activityLabel?: string | null
}) {
  const { t } = useChatUiConfig()
  const delegatedSummary = delegated ? summarizeDelegatedWork(steps) : undefined
  const status = delegatedSummary?.status ?? groupStatus(steps, isStreaming)
  const resolvedDefaultExpanded =
    defaultExpanded ?? (status === 'running' || status === 'waiting')
  const [disclosure, setDisclosure] = useState<DisclosureState>({
    expanded: resolvedDefaultExpanded,
    touched: false,
    lastDefault: resolvedDefaultExpanded,
  })

  if (resolvedDefaultExpanded !== disclosure.lastDefault) {
    setDisclosure((current) => ({
      expanded: current.touched ? current.expanded : resolvedDefaultExpanded,
      touched: current.touched,
      lastDefault: resolvedDefaultExpanded,
    }))
  }

  const elapsedMs = useActivityElapsed(steps, status === 'running')
  if (steps.length === 0) return null
  const count = String(delegatedSummary?.count ?? steps.length)
  const duration = elapsedMs === undefined ? undefined : formatDuration(elapsedMs)
  const label = groupLabel(t, status, count, duration, delegated)
  const liveLabel = isStreaming && status !== 'waiting' ? activityLabel : null

  return (
    <Collapsible
      open={disclosure.expanded}
      onOpenChange={(expanded) =>
        setDisclosure({ expanded, touched: true, lastDefault: resolvedDefaultExpanded })
      }
      className="w-full"
      data-testid="genclaw-tool-group"
      data-activity-status={status}
      data-delegated-work={delegated}
    >
      <CollapsibleTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          className="text-muted-foreground hover:text-foreground h-10 w-full justify-start gap-2 px-1.5 text-left"
          data-testid="genclaw-tool-group-toggle"
        >
          <ChevronRightIcon
            className={`size-3.5 transition-transform motion-reduce:transition-none ${
              disclosure.expanded ? 'rotate-90' : ''
            }`}
            aria-hidden="true"
          />
          <GroupStatusMark status={status} t={t} />
          <span
            role={liveLabel ? 'status' : undefined}
            aria-live={liveLabel ? 'polite' : undefined}
            className={`min-w-0 flex-1 truncate text-xs font-medium ${liveLabel ? 'shimmer-neutral' : ''}`}
          >
            {liveLabel || label}
          </span>
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <ToolList steps={steps} t={t} />
      </CollapsibleContent>
    </Collapsible>
  )
}

type ActivityStatus = 'running' | 'waiting' | 'done' | 'cancelled'

function isDelegatedWorkStep(step: ToolStep): boolean {
  return step.name.trim().toLowerCase() === 'sessions_spawn'
}

function isActiveDelegatedWorkStep(step: ToolStep): boolean {
  return isDelegatedWorkStep(step) && step.phase === 'running'
}

function summarizeDelegatedWork(steps: ToolStep[]): { status: ActivityStatus; count: number } {
  const waiting = steps.filter((step) => step.status?.toLowerCase() === 'awaiting_approval')
  if (waiting.length > 0) return { status: 'waiting', count: waiting.length }
  return { status: 'running', count: steps.length }
}

function groupStatus(steps: ToolStep[], isStreaming: boolean): ActivityStatus {
  if (steps.some((step) => step.phase === 'running' && step.status === 'awaiting_approval')) return 'waiting'
  if (steps.some((step) => step.phase === 'running')) return 'running'
  if (steps.some((step) => step.phase === 'cancelled')) return 'cancelled'
  if (isStreaming) return 'running'
  return 'done'
}

function groupLabel(
  t: Translate,
  status: ActivityStatus,
  count: string,
  duration: string | undefined,
  delegated: boolean,
): string {
  if (delegated) return delegatedWorkLabel(t, status, count, duration)
  if (status === 'waiting') return t('genClaw.toolGroup.waitingApprovalLabel')
  if (status === 'running') {
    return duration
      ? t('genClaw.toolGroup.activityRunning', { duration })
      : t('genClaw.toolGroup.activityRunningNoDuration')
  }
  if (status === 'cancelled') return t('genClaw.toolGroup.activityStopped', { count })
  return duration
    ? t('genClaw.toolGroup.activityDone', { count, duration })
    : t('genClaw.toolGroup.activityDoneNoDuration', { count })
}

function delegatedWorkLabel(
  t: Translate,
  status: ActivityStatus,
  count: string,
  duration?: string,
): string {
  if (status === 'running') {
    return duration
      ? t('genClaw.toolGroup.delegatedRunning', { count, duration })
      : t('genClaw.toolGroup.delegatedRunningNoDuration', { count })
  }
  if (status === 'waiting') return t('genClaw.toolGroup.delegatedWaiting', { count })
  if (status === 'cancelled') return t('genClaw.toolGroup.delegatedStopped', { count })
  return duration
    ? t('genClaw.toolGroup.delegatedDone', { count, duration })
    : t('genClaw.toolGroup.delegatedDoneNoDuration', { count })
}

function GroupStatusMark({ status, t }: { status: ActivityStatus; t: Translate }) {
  if (status === 'running') {
    return <Spinner className="text-foreground size-3.5 motion-reduce:animate-none" aria-label={t('genClaw.toolGroup.runningLabel')} />
  }
  if (status === 'waiting') {
    return (
      <span role="img" aria-label={t('genClaw.toolGroup.waitingApprovalLabel')}>
        <ExclamationTriangleIcon className="text-ecap-caution-text size-3.5" aria-hidden="true" />
      </span>
    )
  }
  if (status === 'cancelled') {
    return (
      <span role="img" aria-label={t('genClaw.toolGroup.stoppedLabel')}>
        <MinusCircleIcon className="text-muted-foreground size-3.5" aria-hidden="true" />
      </span>
    )
  }
  return (
    <span role="img" aria-label={t('genClaw.toolGroup.completedLabel')}>
      <CheckIcon className="text-muted-foreground size-3.5" aria-hidden="true" />
    </span>
  )
}

function useActivityElapsed(steps: ToolStep[], running: boolean): number | undefined {
  const startedAt = useMemo(() => {
    const values = steps.map((step) => step.startedAt).filter((value) => Number.isFinite(value) && value > 0)
    return values.length > 0 ? Math.min(...values) : undefined
  }, [steps])
  const completedDuration = useMemo(() => {
    if (startedAt === undefined) return undefined
    const endings = steps
      .filter((step) => step.durationMs !== undefined)
      .map((step) => step.startedAt + (step.durationMs ?? 0))
    return endings.length > 0 ? Math.max(0, Math.max(...endings) - startedAt) : undefined
  }, [startedAt, steps])
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    if (!running || startedAt === undefined) return
    setNow(Date.now())
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [running, startedAt])

  return running && startedAt !== undefined ? Math.max(0, now - startedAt) : completedDuration
}

const COLLAPSE_THRESHOLD = 6
const RECENT_STEP_COUNT = 4

function ToolList({ steps, t }: { steps: ToolStep[]; t: Translate }) {
  const [showEarlier, setShowEarlier] = useState(false)
  const needsCollapse = steps.length > COLLAPSE_THRESHOLD
  const hiddenCount = needsCollapse ? Math.max(0, steps.length - RECENT_STEP_COUNT) : 0
  const visibleSteps = needsCollapse && !showEarlier ? steps.slice(-RECENT_STEP_COUNT) : steps

  return (
    <div className="relative pl-5 before:absolute before:top-0 before:bottom-4 before:left-[11px] before:w-px before:bg-border">
      <ItemGroup role="list" className="gap-0" data-testid="genclaw-tool-group-list">
        {needsCollapse && !showEarlier && (
          <div role="listitem" className="relative z-10 bg-card py-0.5">
            <Button
              type="button"
              variant="ghost"
              size="xs"
              onClick={() => setShowEarlier(true)}
              className="text-muted-foreground hover:text-foreground"
              data-testid="genclaw-tool-group-show-earlier"
            >
              <PlusIcon data-icon="inline-start" />
              {t('genClaw.toolGroup.earlierSteps', { count: String(hiddenCount) })}
            </Button>
          </div>
        )}
        {visibleSteps.map((step) => (
          <ToolRow key={step.id} step={step} t={t} />
        ))}
      </ItemGroup>
    </div>
  )
}

function ToolRow({ step, t }: { step: ToolStep; t: Translate }) {
  const running = step.phase === 'running' && step.status !== 'awaiting_approval'
  const delegated = isDelegatedWorkStep(step)
  const title = stepTitle(step, t)
  const detail = stepDetail(step, title)
  const multilineDetail = detail?.includes('\n') === true
  const detailNeedsToggle = multilineDetail || (detail?.length ?? 0) > 72
  const [detailExpanded, setDetailExpanded] = useState(multilineDetail)
  const detailLayout = detailExpanded
    ? delegated
      ? 'line-clamp-none whitespace-pre-wrap'
      : 'line-clamp-none max-h-48 overflow-y-auto whitespace-pre-wrap'
    : delegated
      ? 'line-clamp-2'
      : 'line-clamp-1'

  useEffect(() => {
    setDetailExpanded(multilineDetail)
  }, [detail, multilineDetail, step.id])

  return (
    <Item
      role="listitem"
      size="xs"
      className="relative z-10 flex-nowrap border-0 bg-card py-1.5 pr-3 pl-2 hover:bg-hover"
      data-testid={`genclaw-tool-row-${step.name}`}
      data-activity-step-status={step.phase}
    >
      <ItemMedia className="size-4 rounded-full bg-card" variant="icon">
        <StepStatusIcon step={step} t={t} />
      </ItemMedia>
      <ItemContent className="min-w-0 gap-0.5">
        <ItemTitle className={step.phase === 'error' ? 'text-muted-foreground' : undefined}>{title}</ItemTitle>
        {detail && (
          <ItemDescription
            className={`${detailLayout} font-mono text-[10.5px] break-words`}
            data-testid="genclaw-tool-row-preview"
          >
            {detail}
          </ItemDescription>
        )}
      </ItemContent>
      <ItemActions className="shrink-0 gap-1">
        {detailNeedsToggle && (
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            aria-expanded={detailExpanded}
            aria-label={
              detailExpanded ? t('genClaw.toolGroup.hideDetails') : t('genClaw.toolGroup.showDetails')
            }
            onClick={() => setDetailExpanded((value) => !value)}
            data-testid={`genclaw-tool-row-${step.name}-details`}
          >
            <ChevronRightIcon className={detailExpanded ? 'rotate-90' : undefined} />
          </Button>
        )}
        {running ? (
          <ElapsedTimer startedAt={step.startedAt} />
        ) : (
          step.durationMs !== undefined && (
            <span className="text-muted-foreground text-[10px] tabular-nums">{formatDuration(step.durationMs)}</span>
          )
        )}
      </ItemActions>
    </Item>
  )
}

function StepStatusIcon({ step, t }: { step: ToolStep; t: Translate }) {
  if (step.status?.toLowerCase() === 'awaiting_approval') {
    return (
      <span role="img" aria-label={t('genClaw.toolGroup.waitingApprovalLabel')}>
        <ExclamationTriangleIcon className="text-ecap-caution-text size-3.5" aria-hidden="true" />
      </span>
    )
  }
  if (step.phase === 'running') {
    return <Spinner className="text-foreground size-3.5 motion-reduce:animate-none" aria-label={t('genClaw.toolGroup.runningLabel')} />
  }
  if (step.phase === 'error') {
    return (
      <span role="img" aria-label={t('genClaw.toolGroup.failedLabel')}>
        <ExclamationCircleIcon className="text-muted-foreground size-3.5" aria-hidden="true" />
      </span>
    )
  }
  if (step.phase === 'cancelled') {
    return (
      <span role="img" aria-label={t('genClaw.toolGroup.stoppedLabel')}>
        <MinusCircleIcon className="text-muted-foreground size-3.5" aria-hidden="true" />
      </span>
    )
  }
  return (
    <span role="img" aria-label={t('genClaw.toolGroup.completedLabel')}>
      <CheckIcon className="text-muted-foreground size-3.5" aria-hidden="true" />
    </span>
  )
}

function stepTitle(step: ToolStep, t: Translate): string {
  const key = toolLabelKey(step.name, step.itemKind, step.action, step.phase)
  return key ? t(`genClaw.toolGroup.${key}`) : truncateDisplayCopy(step.name, 240) ?? step.name
}

function stepDetail(step: ToolStep, title: string): string | undefined {
  const values = [step.inputSummary, toolIdentityDetail(step.name), trustedActivityDetail(step)]
  const unique = values
    .map((value) => safeDisplayCopy(value, 2_000))
    .filter((value): value is string => Boolean(value) && value !== title)
    .filter((value, index, all) => all.indexOf(value) === index)
  return unique.length > 0 ? unique.join(' · ') : undefined
}

function trustedActivityDetail(step: ToolStep): string | undefined {
  if (step.itemKind === 'command') return step.progressText
  if (step.itemKind === 'patch' || step.itemKind === 'plan') {
    return step.summary ?? step.progressText
  }
  return undefined
}

function safeDisplayCopy(value: string | undefined, maxLength: number): string | undefined {
  const normalized = value?.trim()
  if (!normalized || isMachinePayload(normalized)) return undefined
  return truncateDisplayCopy(normalized, maxLength)
}

function isMachinePayload(value: string): boolean {
  const normalized = value.trim()
  if (/^```\s*(json|html|xml)?\b/i.test(normalized)) return true
  if (/^(?:<!doctype\s+html|<html\b|<\?xml\b)/i.test(normalized)) return true
  if (/^data:[^;\s]+;base64,/i.test(normalized)) return true

  const machineField =
    /["'](?:ok|provider|endpoint|status|body|data|result|results|organic|searchParameters|headers)["']\s*:/i
  if (machineField.test(normalized) && /[[{]/.test(normalized)) return true

  if (/^[[{]/.test(normalized)) {
    try {
      JSON.parse(normalized)
      return true
    } catch {
      // Truncated transport payloads are often invalid JSON but retain their
      // structural prefix and key/value syntax.
      return /^\{[^}]*["'][^"']+["']\s*:/.test(normalized) || /^\[\s*[[{"']/.test(normalized)
    }
  }

  return false
}

function truncateDisplayCopy(value: string | undefined, maxLength: number): string | undefined {
  const normalized = value?.trim()
  if (!normalized) return undefined
  if (normalized.length <= maxLength) return normalized
  return `${normalized.slice(0, maxLength - 1).trimEnd()}…`
}

function ElapsedTimer({ startedAt }: { startedAt: number }) {
  const [elapsed, setElapsed] = useState(() => Math.max(0, Date.now() - startedAt))
  useEffect(() => {
    const id = setInterval(() => setElapsed(Math.max(0, Date.now() - startedAt)), 600)
    return () => clearInterval(id)
  }, [startedAt])
  return <span className="text-muted-foreground text-[10px] tabular-nums" aria-hidden="true">{formatDuration(elapsed)}</span>
}

function formatDuration(ms: number): string {
  if (ms < 1000) return `${Math.max(0, Math.round(ms))}ms`
  if (ms < 10_000) return `${(ms / 1000).toFixed(1)}s`
  if (ms < 60_000) return `${Math.round(ms / 1000)}s`
  const minutes = Math.floor(ms / 60_000)
  const seconds = Math.round((ms % 60_000) / 1000)
  return seconds > 0 ? `${minutes}m ${seconds}s` : `${minutes}m`
}
