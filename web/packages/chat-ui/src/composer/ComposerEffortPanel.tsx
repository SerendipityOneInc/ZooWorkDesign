'use client'

import { ChevronRightIcon } from '@heroicons/react/20/solid'
import { Button, EffortSlider, type EffortSliderLabels, type EffortSliderLevel } from '@zooclaw/zooworkdesign'
import { useState } from 'react'
import type { ModelPickerOption } from './ModelPicker'

export type ComposerEffortLevel = EffortSliderLevel
export interface ComposerEffortLabels extends EffortSliderLabels { selectModel: string }
export interface ComposerEffortPanelProps {
  model: ModelPickerOption
  value: ComposerEffortLevel | undefined
  levels: ComposerEffortLevel[]
  disabled?: boolean
  /** Omit for a directly displayed specimen; pass for model-list navigation. */
  onBack?: () => void
  autoFocus?: boolean
  onSave: (level: ComposerEffortLevel) => boolean | Promise<boolean>
  onSaveError?: (error: unknown) => void
  labels?: Partial<ComposerEffortLabels>
}
const DEFAULT_LABELS: ComposerEffortLabels = {
  title: 'Thinking effort', selectModel: 'Select model', auto: 'Auto',
  off: 'Off', low: 'Low', medium: 'Medium', high: 'High', max: 'Max',
}

/** Chat-specific header and persistence around the shared design-system slider. */
export function ComposerEffortPanel({
  model, value, levels, disabled = false, onBack, autoFocus = true, onSave, onSaveError, labels,
}: ComposerEffortPanelProps) {
  const copy = { ...DEFAULT_LABELS, ...labels }
  const [draft, setDraft] = useState({ source: value, value })
  const [saving, setSaving] = useState(false)
  const current = draft.source === value ? draft.value : value
  const currentLabel = current ? copy[current] : copy.auto
  async function commit(level: ComposerEffortLevel) {
    if (disabled || saving || !levels.includes(level)) return
    setDraft({ source: value, value: level })
    setSaving(true)
    try {
      if (!(await onSave(level))) setDraft({ source: value, value })
    } catch (error) {
      setDraft({ source: value, value })
      onSaveError?.(error)
    } finally { setSaving(false) }
  }
  return (
    <div
      role="group"
      aria-label={copy.title}
      className="p-1"
      data-testid="composer-effort-panel"
      onKeyDown={(event) => {
        if (event.key === 'Tab') event.stopPropagation()
      }}
    >
      <div className="flex flex-col items-center gap-0.5 pt-2">
        <div role="status" aria-live="polite" className="text-foreground text-center text-lg leading-6 font-medium">
          {current ? currentLabel : null}
        </div>
        {onBack ? <Button
          type="button"
          variant="ghost"
          className="text-muted-foreground h-7 max-w-full min-w-0 gap-2 px-2 text-sm font-normal"
          aria-label={copy.selectModel}
          onClick={onBack}
        >
          <span className="min-w-0 truncate text-left">{model.label}</span>
          <ChevronRightIcon className="text-muted-foreground size-3.5 shrink-0" />
        </Button> : <div className="text-muted-foreground h-7 max-w-full truncate px-2 text-sm leading-7">{model.label}</div>}
      </div>
      <div className="px-2 pt-2 pb-1">
        <EffortSlider data-testid="composer-effort-slider" value={current} levels={levels} disabled={disabled || saving}
          autoFocus={autoFocus} showValue={false} labels={copy}
          onValueChange={level => setDraft({ source: value, value: level })} onValueCommit={commit}
          onValueCancel={() => setDraft({ source: value, value })} />
      </div>
    </div>
  )
}
