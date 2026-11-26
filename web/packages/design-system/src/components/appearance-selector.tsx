'use client'

import { useId } from 'react'

export type AppearanceValue = 'light' | 'dark' | 'system'

export interface AppearanceSelectorProps {
  value: AppearanceValue
  onValueChange: (value: AppearanceValue) => void
  labels?: Record<AppearanceValue, string>
  groupLabel?: string
  disabled?: boolean
}

/** Fixed preview colors show the choices independently of the active theme. */
function ThemeLines({ dark = false, half = false }: { dark?: boolean; half?: boolean }) {
  return (
    <span className={`flex min-w-0 flex-1 flex-col justify-center gap-1.5 ${half ? 'p-2.5' : 'p-3'} ${dark ? 'bg-[#1a1a1a]' : 'bg-[#f8f8f7]'}`}>
      <span className={`h-1 rounded-sm ${half ? 'w-[60%]' : 'w-[40%]'} ${dark ? 'bg-[#404040]' : 'bg-[#d4d4d4]'}`} />
      <span className={`h-1 w-full rounded-sm ${dark ? 'bg-[#404040]' : 'bg-[#d4d4d4]'}`} />
      {!half && <span className={`h-1 w-[65%] rounded-sm ${dark ? 'bg-[#404040]' : 'bg-[#d4d4d4]'}`} />}
    </span>
  )
}

export function AppearanceSelector({
  value,
  onValueChange,
  labels = { light: 'Light', dark: 'Dark', system: 'Follow System' },
  groupLabel = 'Appearance',
  disabled = false,
}: AppearanceSelectorProps) {
  const name = useId()
  return (
    <fieldset disabled={disabled} aria-label={groupLabel} data-slot="appearance-selector" className="grid w-full max-w-[392px] min-w-0 grid-cols-3 gap-3 sm:gap-4">
      {(['light', 'dark', 'system'] as const).map(mode => (
        <label key={mode} data-disabled={disabled || undefined} className="min-w-0 cursor-pointer text-center data-disabled:cursor-not-allowed data-disabled:opacity-50">
          <input
            className="peer sr-only"
            type="radio"
            name={name}
            value={mode}
            checked={value === mode}
            onChange={event => { if (event.target.checked) onValueChange(mode) }}
          />
          <span
            aria-hidden="true"
            data-slot="appearance-preview"
            data-mode={mode}
            data-selected={value === mode}
            className="flex h-20 w-full overflow-hidden rounded-lg border-2 border-border transition-shadow peer-enabled:hover:border-muted-foreground peer-checked:border-ring peer-checked:ring-1 peer-checked:ring-ring peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-background"
          >
            {mode === 'system' ? <><ThemeLines half /><ThemeLines dark half /></> : <ThemeLines dark={mode === 'dark'} />}
          </span>
          <span className="mt-2 block text-[13px] font-medium text-muted-foreground">{labels[mode]}</span>
        </label>
      ))}
    </fieldset>
  )
}
