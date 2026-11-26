export const stateIllustrations = {
  'empty-knowledge': new URL('../../assets/illustrations/empty-knowledge.png', import.meta.url).href,
  'empty-tasks': new URL('../../assets/illustrations/empty-tasks.webp', import.meta.url).href,
  'no-results': new URL('../../assets/illustrations/no-results.webp', import.meta.url).href,
  'not-found': new URL('../../assets/illustrations/not-found.webp', import.meta.url).href,
  'connection-lost': new URL('../../assets/illustrations/connection-lost.webp', import.meta.url).href,
  'empty-credentials': new URL('../../assets/illustrations/empty-credentials.webp', import.meta.url).href,
  'empty-connections': new URL('../../assets/illustrations/empty-connections.webp', import.meta.url).href,
  'empty-records': new URL('../../assets/illustrations/empty-records.webp', import.meta.url).href,
  'feature-unavailable': new URL('../../assets/illustrations/feature-unavailable.webp', import.meta.url).href,
}

export type StateIllustrationVariant = keyof typeof stateIllustrations

import { cn } from '../lib/cn'

/** Decorative artwork: the surrounding state supplies the accessible title and actions. */
export function StateIllustration({
  variant,
  className,
}: {
  variant: StateIllustrationVariant
  className?: string
}) {
  return (
    <div
      aria-hidden="true"
      data-slot="state-illustration"
      data-variant={variant}
      className={cn(
        'pointer-events-none relative mx-auto aspect-[4/3] w-48 max-w-full overflow-hidden select-none sm:w-56',
        className,
      )}
    >
      <img
        src={stateIllustrations[variant]}
        alt=""
        width={1254}
        height={1254}
        className="absolute top-1/2 block h-auto w-full -translate-y-1/2 mix-blend-multiply dark:mix-blend-screen dark:invert"
      />
    </div>
  )
}
