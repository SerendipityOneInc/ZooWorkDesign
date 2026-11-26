'use client'
import { ScrollArea } from '../components/scroll-area'
export function WorkspaceNavigation({
  label,
  back,
  switcher,
  actions,
  children,
}: {
  label: string
  back: React.ReactNode
  switcher: React.ReactNode
  actions: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <nav
      aria-label={label}
      data-agent-workspace-nav
      className="bg-sidebar-background flex w-16 shrink-0 flex-col md:w-64"
    >
      {back}
      {switcher}
      <div className="space-y-1 px-2 md:px-4">{actions}</div>
      <ScrollArea className="min-h-0 flex-1 px-2 md:px-4">
        <div className="grid min-w-0 grid-cols-1">{children}</div>
      </ScrollArea>
    </nav>
  )
}
