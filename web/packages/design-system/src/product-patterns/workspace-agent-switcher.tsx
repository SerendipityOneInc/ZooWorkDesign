'use client'
import { CheckIcon } from '@heroicons/react/24/outline'
import { WorkspaceSwitcherTrigger } from './workspace-switcher-trigger'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '../components/dropdown-menu'
export function WorkspaceAgentSwitcher({
  name,
  avatar,
  items,
  loading,
  failed,
  hasMore,
  loadingMore,
  onRetry,
  onLoadMore,
  LinkComponent = 'a',
  labels = {
    switchAgent: 'Switch agent',
    agents: 'Agents',
    loading: 'Loading...',
    unavailable: 'Unable to load agents',
    retry: 'Retry',
    showMore: 'Show More',
  },
}: {
  name: string
  avatar: React.ReactNode
  items: { id: string; name: string; avatar: React.ReactNode; href: string; current: boolean }[]
  loading?: boolean
  failed?: boolean
  hasMore?: boolean
  loadingMore?: boolean
  onRetry?: () => void
  onLoadMore?: () => void
  LinkComponent?: React.ElementType
  labels?: {
    switchAgent: string
    agents: string
    loading: string
    unavailable: string
    retry: string
    showMore: string
  }
}) {
  return (
    <div className="px-2 pt-1 pb-3 md:px-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <WorkspaceSwitcherTrigger
            name={name}
            avatar={avatar}
            aria-label={`${labels.switchAgent}: ${name ?? ''}`}
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="max-h-80 w-64 overflow-y-auto">
          <DropdownMenuLabel>{labels.agents}</DropdownMenuLabel>
          {items.map((agent) => (
            <DropdownMenuItem key={agent.id} asChild>
              <LinkComponent href={agent.href} aria-current={agent.current ? 'page' : undefined} className="gap-2">
                {agent.avatar}
                <span className="min-w-0 flex-1 truncate">{agent.name}</span>
                {agent.current && <CheckIcon aria-hidden="true" className="size-4 shrink-0" />}
              </LinkComponent>
            </DropdownMenuItem>
          ))}
          {loading && <DropdownMenuItem disabled>{labels.loading}</DropdownMenuItem>}
          {failed && (
            <>
              <p role="status" className="text-muted-foreground px-2 py-1.5 text-xs">
                {labels.unavailable}
              </p>
              <DropdownMenuItem
                onSelect={(event) => {
                  event.preventDefault()
                  onRetry?.()
                }}
              >
                {labels.retry}
              </DropdownMenuItem>
            </>
          )}
          {hasMore && (
            <DropdownMenuItem
              disabled={loadingMore}
              onSelect={(event) => {
                event.preventDefault()
                onLoadMore?.()
              }}
            >
              {loadingMore ? labels.loading : labels.showMore}
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
