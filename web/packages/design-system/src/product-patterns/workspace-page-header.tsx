import type { ReactNode } from 'react'


export function WorkspacePageHeader({
  title,
  description,
  badge,
  actions,
  id,
  headingLevel = 2,
  size = 'section',
}: {
  title: string
  description: string
  badge?: ReactNode
  actions?: ReactNode
  id?: string
  headingLevel?: 1 | 2
  size?: 'section' | 'page'
}) {
  const Heading = headingLevel === 1 ? 'h1' : 'h2'
  if (size === 'section') {
    return (
      <header className="mb-6 shrink-0">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Heading id={id} className="text-base font-semibold">{title}</Heading>
            {badge}
          </div>
          {actions}
        </div>
        <p className="text-muted-foreground mt-1 text-sm leading-6">{description}</p>
      </header>
    )
  }
  return (
    <header data-slot="workspace-page-header" data-size={size} className="min-w-0 shrink-0">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 max-w-2xl">
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <Heading id={id} className="min-w-0 break-words text-2xl leading-8 font-semibold">
              {title}
            </Heading>
            {badge}
          </div>
          <p className="mt-2 max-w-[65ch] text-sm leading-6 text-muted-foreground">{description}</p>
        </div>
        {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
      </div>
    </header>
  )
}
