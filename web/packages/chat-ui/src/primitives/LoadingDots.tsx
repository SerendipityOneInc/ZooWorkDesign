import { cx } from '../utils'

export type LoadingDotsSize = 'xs' | 'sm'

export interface LoadingDotsProps {
  className?: string
  /** Dot scale: 'sm' (default) for message-level indicators, 'xs' for dense rows. */
  size?: LoadingDotsSize
  /** Accessible name for the indicator. Defaults to 'Loading'. */
  label?: string
}

const SIZES: Record<LoadingDotsSize, { gap: string; dot: string }> = {
  sm: { gap: 'gap-1', dot: 'h-1.5 w-1.5' },
  xs: { gap: 'gap-[2px]', dot: 'h-1 w-1' },
}

/** The one bouncing-dots primitive for the package. Every "something is still
 *  happening" affordance (thread loader, streaming reply, running tool row)
 *  renders this — no per-call-site reimplementation, no ASCII spinners. */
export function LoadingDots({ className, size = 'sm', label = 'Loading' }: LoadingDotsProps) {
  const { gap, dot } = SIZES[size]
  // Dots take their color from the surrounding text (`bg-current`), so callers
  // set a `text-*` token on the wrapper instead of the primitive hardcoding one.
  const dotClass = cx(dot, 'animate-bounce rounded-full bg-current')
  return (
    <span className={cx('inline-flex items-center', gap, className)} aria-label={label}>
      <span className={cx(dotClass, '[animation-delay:-0.2s]')} />
      <span className={cx(dotClass, '[animation-delay:-0.1s]')} />
      <span className={dotClass} />
    </span>
  )
}
