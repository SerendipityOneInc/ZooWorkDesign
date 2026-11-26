'use client'

import { useId, type ReactNode, type Ref } from 'react'
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from '../components/input-group'
import { Label } from '../components/label'
import { ToggleGroup, ToggleGroupItem } from '../components/toggle-group'

export interface CreditAmountSelectorProps {
  value: string
  onValueChange: (value: string) => void
  presets: readonly { value: string; label: string }[]
  /** The host may normalize e.g. 20.00 to preset 20 without changing input text. */
  selectedPresetValue?: string
  label: string
  presetsLabel: string
  currencySymbol: string
  currencyCode: string
  hint?: ReactNode
  error?: string
  disabled?: boolean
  inputRef?: Ref<HTMLInputElement>
}

/** Presentation only. The host owns monetary validation, conversion and payment. */
export function CreditAmountSelector({ value, onValueChange, presets, selectedPresetValue = value, label, presetsLabel, currencySymbol, currencyCode, hint, error, disabled, inputRef }: CreditAmountSelectorProps) {
  const id = useId()
  const describedBy = [hint ? `${id}-hint` : '', error ? `${id}-error` : ''].filter(Boolean).join(' ') || undefined
  return (
    <div data-slot="credit-amount-selector" className="space-y-3">
      <div className="space-y-2">
        <Label htmlFor={id}>{label}</Label>
        <InputGroup>
          <InputGroupAddon><InputGroupText aria-hidden="true">{currencySymbol}</InputGroupText></InputGroupAddon>
          <InputGroupInput ref={inputRef} id={id} type="text" inputMode="decimal" autoComplete="off" value={value} onChange={(event) => onValueChange(event.target.value)} disabled={disabled} aria-invalid={Boolean(error)} aria-describedby={describedBy} />
          <InputGroupAddon align="inline-end"><InputGroupText>{currencyCode}</InputGroupText></InputGroupAddon>
        </InputGroup>
      </div>
      {presets.length > 0 && (
        <ToggleGroup type="single" variant="outline" className="flex-wrap" value={selectedPresetValue} onValueChange={(next) => { if (next) onValueChange(next) }} disabled={disabled} aria-label={presetsLabel}>
          {presets.map((preset) => <ToggleGroupItem key={preset.value} value={preset.value}>{preset.label}</ToggleGroupItem>)}
        </ToggleGroup>
      )}
      {hint && <p id={`${id}-hint`} className="text-xs leading-5 text-muted-foreground">{hint}</p>}
      {error && <p id={`${id}-error`} className="text-sm text-destructive" role="alert">{error}</p>}
    </div>
  )
}
