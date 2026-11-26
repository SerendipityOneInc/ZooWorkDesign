import { MobiusLoadingIcon } from './MobiusLoadingIcon'
import { cx as cn } from '../utils'

interface ClawSpinnerBaseProps {
  className?: string
  size?: 'sm' | 'md'
}

type ClawSpinnerProps = ClawSpinnerBaseProps &
  ({ label?: undefined; showLabel?: false } | { label: string; showLabel?: boolean })

export function ClawSpinner({ className, label, showLabel = false, size = 'md' }: ClawSpinnerProps) {
  const isStatus = Boolean(label)

  return (
    <div
      className={cn('flex flex-col items-center gap-3', className)}
      role={isStatus ? 'status' : undefined}
      aria-live={isStatus ? 'polite' : undefined}
      aria-label={isStatus && !showLabel ? label : undefined}
      aria-hidden={isStatus ? undefined : true}
    >
      <div
        aria-hidden="true"
        className={cn(
          'text-ecap-agent-builder-send-disabled flex shrink-0 items-center justify-center',
          size === 'sm' ? 'size-12' : 'size-24',
        )}
        data-testid="genclaw-loading"
      >
        <MobiusLoadingIcon className="h-auto w-full" />
      </div>
      {showLabel && label ? <span className="text-muted-foreground/70 text-xs">{label}</span> : null}
    </div>
  )
}
