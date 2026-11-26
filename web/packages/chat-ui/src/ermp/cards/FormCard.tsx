'use client'

import { memo, useState } from 'react'

import { useChatUiConfig } from '../../provider'

import type { FormCard as FormCardType, FormField } from '../types'

function initValues(fields: FormField[]): Record<string, unknown> {
  const values: Record<string, unknown> = {}
  for (const field of fields) {
    if (field.default !== undefined) {
      values[field.name] = field.default
    } else if (field.type === 'toggle') {
      values[field.name] = false
    } else if (field.type === 'number') {
      values[field.name] = 0
    } else {
      values[field.name] = ''
    }
  }
  return values
}

function FieldRenderer({
  field,
  value,
  disabled,
  onChange,
}: {
  field: FormField
  value: unknown
  disabled: boolean
  onChange: (name: string, value: unknown) => void
}) {
  const { locale } = useChatUiConfig()
  const chinese = locale.startsWith('zh')
  const labelEl = <label className="text-foreground mb-1 block text-sm font-medium">{field.label}</label>

  const inputClass =
    'w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground disabled:opacity-50'

  if (field.type === 'textarea') {
    return (
      <div>
        {labelEl}
        <textarea
          aria-label={field.label}
          className={inputClass}
          placeholder={field.placeholder}
          value={String(value ?? '')}
          disabled={disabled}
          rows={3}
          onChange={(e) => onChange(field.name, e.target.value)}
        />
      </div>
    )
  }

  if (field.type === 'select') {
    return (
      <div>
        {labelEl}
        <select
          aria-label={field.label}
          className={inputClass}
          value={String(value ?? '')}
          disabled={disabled}
          onChange={(e) => onChange(field.name, e.target.value)}
        >
          <option value="">{field.placeholder || (chinese ? '请选择' : 'Select an option')}</option>
          {field.options?.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>
    )
  }

  if (field.type === 'toggle') {
    const on = Boolean(value)
    return (
      <div className="flex items-center justify-between">
        <span className="text-foreground text-sm font-medium">{field.label}</span>
        <button
          type="button"
          role="switch"
          aria-label={field.label}
          aria-checked={on}
          disabled={disabled}
          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors disabled:opacity-50 ${on ? 'bg-primary' : 'bg-input'}`}
          onClick={() => onChange(field.name, !on)}
        >
          <span
            className={`bg-background pointer-events-none block h-5 w-5 rounded-full shadow-lg transition-transform ${on ? 'translate-x-5' : 'translate-x-0'}`}
          />
        </button>
      </div>
    )
  }

  if (field.type === 'number') {
    return (
      <div>
        {labelEl}
        <input
          type="number"
          aria-label={field.label}
          className={inputClass}
          placeholder={field.placeholder}
          value={String(value ?? 0)}
          disabled={disabled}
          onChange={(e) => onChange(field.name, Number(e.target.value))}
        />
      </div>
    )
  }

  // text (default)
  return (
    <div>
      {labelEl}
      <input
        type="text"
        aria-label={field.label}
        className={inputClass}
        placeholder={field.placeholder}
        value={String(value ?? '')}
        disabled={disabled}
        onChange={(e) => onChange(field.name, e.target.value)}
      />
    </div>
  )
}

function FormCardInner({
  card,
  readOnly = false,
  isSubmitted,
  onSubmit,
}: {
  card: FormCardType
  readOnly?: boolean
  isSubmitted?: (cardId?: string) => boolean
  onSubmit: (cardId: string | undefined, data: Record<string, unknown>) => void
}) {
  const { locale } = useChatUiConfig()
  const chinese = locale.startsWith('zh')
  const [values, setValues] = useState(() => initValues(card.fields))
  const [submitted, setSubmitted] = useState(() => isSubmitted?.(card._id) ?? false)

  // Fields and submit are both disabled when viewed inside a public replay.
  // The form's target session (the creator's chat) no longer exists from the
  // viewer's perspective, so submitting would be a no-op at best.
  const disabled = submitted || readOnly
  const submitTitle = readOnly ? (chinese ? '回放中不可操作' : 'Disabled in replay') : undefined

  const handleChange = (name: string, value: unknown) => {
    if (disabled) return
    setValues((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = () => {
    if (disabled) return
    onSubmit(card._id, values)
    setSubmitted(true)
  }

  return (
    <div className="border-border bg-card rounded-lg border">
      {card.title && (
        <div className="border-border border-b px-4 py-3">
          <h3 className="text-foreground text-sm font-medium">{card.title}</h3>
        </div>
      )}
      <div className="space-y-4 px-4 py-3">
        {card.fields.map((field) => (
          <FieldRenderer
            key={field.name}
            field={field}
            value={values[field.name]}
            disabled={disabled}
            onChange={handleChange}
          />
        ))}
        <button
          type="button"
          className="bg-primary text-primary-foreground hover:bg-primary/90 w-full rounded-md px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50"
          disabled={disabled}
          onClick={handleSubmit}
          title={submitTitle}
        >
          {submitted ? (chinese ? '已提交' : 'Submitted') : card.submitLabel || (chinese ? '提交' : 'Submit')}
        </button>
      </div>
    </div>
  )
}

export const FormCard = memo(FormCardInner)
