'use client'
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline'
import { Button } from '../components/button'
export const defaultAgentSectionLabels = {
  agents: 'Agents',
  loading: 'Loading...',
  empty: 'No agents yet',
  unavailable: 'Unable to load agents',
  retry: 'Retry',
  showMore: 'Show More',
  showLess: 'Show Less',
}
export function PrimaryNavAgentSection({
  expanded,
  createAction,
  children,
  loading,
  empty,
  failed,
  hasMore,
  showLess,
  loadingMore,
  onRetry,
  onShowMore,
  onShowLess,
  labels = defaultAgentSectionLabels,
}: {
  expanded: boolean
  createAction: React.ReactNode
  children?: React.ReactNode
  loading?: boolean
  empty?: boolean
  failed?: boolean
  hasMore?: boolean
  showLess?: boolean
  loadingMore?: boolean
  onRetry?: () => void
  onShowMore?: () => void
  onShowLess?: () => void
  labels?: typeof defaultAgentSectionLabels
}) {
  return (
    <section className="mt-4 space-y-0.5" aria-label={labels.agents} data-testid="nav-agent-shortcuts">
      <div className={`mb-1 flex items-center px-3 ${expanded ? 'justify-between' : 'justify-center'}`}>
        {expanded && <span className="text-muted-foreground text-xs">{labels.agents}</span>}
        {createAction}
      </div>
      {children}
      {loading && !failed && (
        <p role="status" className="text-muted-foreground px-3 py-2 text-xs">
          {expanded ? labels.loading : '…'}
        </p>
      )}
      {empty && !failed && !loading && (
        <p role="status" className={expanded ? 'text-muted-foreground px-3 py-2 text-xs' : 'sr-only'}>
          {labels.empty}
        </p>
      )}
      {failed && (
        <div role="status">
          {expanded && <p className="text-muted-foreground px-3 py-2 text-xs">{labels.unavailable}</p>}
          <Button variant="ghost" size="sm" onClick={onRetry} className="w-full text-xs">
            {labels.retry}
          </Button>
        </div>
      )}
      {hasMore && (
        <Button
          variant="ghost"
          size="sm"
          aria-label={labels.showMore}
          data-expanded={expanded}
          disabled={loadingMore}
          onClick={onShowMore}
          className="text-muted-foreground hover:text-muted-foreground w-full justify-start border-0 px-3 text-sm font-medium data-[expanded=false]:justify-center data-[expanded=true]:pl-[42px]"
        >
          {expanded ? labels.showMore : <ChevronDownIcon className="h-4 w-4" />}
        </Button>
      )}
      {showLess && (
        <Button
          variant="ghost"
          size="sm"
          aria-label={labels.showLess}
          data-expanded={expanded}
          disabled={loadingMore}
          onClick={onShowLess}
          className="text-muted-foreground hover:text-muted-foreground w-full justify-start border-0 px-3 text-sm font-medium data-[expanded=false]:justify-center data-[expanded=true]:pl-[42px]"
        >
          {expanded ? labels.showLess : <ChevronUpIcon className="h-4 w-4" />}
        </Button>
      )}
    </section>
  )
}
