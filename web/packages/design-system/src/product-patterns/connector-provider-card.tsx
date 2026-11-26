'use client'

import {
  LockClosedIcon,
  LockOpenIcon,
  PlusIcon,
  PowerIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  LinkIcon,
} from '@heroicons/react/24/outline'
import { ProductButton as Button } from './product-button'
import { ProductSpinner as Spinner } from './product-spinner'
import { cn } from '../lib/cn'
import type {
  ConnectorLabels,
  ConnectorAction,
  ConnectorProviderState as ProviderState,
  ConnectorProviderStatus as ProviderStatus,
} from './connector-types'
import { defaultConnectorLabels } from './connector-types'

export function ConnectorProviderCard({
  name,
  description,
  logo,
  labels = defaultConnectorLabels,
  state,
  onConnect,
  onEnable,
  onDisable,
  onDisconnect,
  pendingAction,
}: {
  name: string
  description: string
  logo: React.ReactNode
  labels?: ConnectorLabels
  state: ProviderState
  onConnect: () => void
  onEnable: () => void
  onDisable: () => void
  onDisconnect: () => void
  pendingAction: ConnectorAction | null
}) {
  const unavailable = state.status === 'unavailable'
  const connected = state.status === 'connected'

  return (
    <article
      className={cn(
        'border-border bg-card flex min-h-32 items-stretch gap-4 rounded-2xl border p-5',
        unavailable && 'opacity-70',
      )}
      data-theme-provider-card
    >
      <div className="bg-muted/30 flex size-14 shrink-0 items-center justify-center self-start rounded-xl">{logo}</div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h2
            className={cn(
              'text-foreground text-base font-semibold text-balance',
              unavailable && 'text-muted-foreground',
            )}
          >
            {name}
          </h2>
          {!unavailable && !connected && state.status !== 'disconnected' && (
            <ProviderStatusBadge labels={labels} status={state.status} />
          )}
        </div>
        <p className="text-muted-foreground mt-1 line-clamp-2 text-sm leading-5 break-words">{description}</p>
      </div>

      {unavailable ? (
        <ProviderStatusBadge labels={labels} status={state.status} />
      ) : (
        <ProviderActions
          labels={labels}
          state={state}
          pendingAction={pendingAction}
          onConnect={onConnect}
          onEnable={onEnable}
          onDisable={onDisable}
          onDisconnect={onDisconnect}
        />
      )}
    </article>
  )
}

function ProviderStatusBadge({
  status,
  enabled = true,
  labels,
}: {
  status: ProviderStatus
  enabled?: boolean
  labels: ConnectorLabels
}) {
  const StatusIcon = status === 'pending' ? ClockIcon : status === 'error' ? ExclamationTriangleIcon : LinkIcon
  const connected = status === 'connected'
  const pending = status === 'pending'
  const error = status === 'error'
  const unavailable = status === 'unavailable'

  if (unavailable) {
    return (
      <span className="text-muted-foreground/50 inline-flex shrink-0 items-center gap-2 self-start text-sm font-medium">
        <span className="bg-muted-foreground/20 size-2 rounded-full" />
        {labels.comingSoon}
      </span>
    )
  }

  if (connected) {
    return (
      <span
        className={cn(
          'inline-flex shrink-0 items-center gap-2 text-sm font-medium',
          enabled ? 'text-ecap-success-text' : 'text-muted-foreground',
        )}
      >
        <span className={cn('size-2 rounded-full', enabled ? 'bg-ecap-success' : 'bg-muted-foreground/40')} />
        {enabled ? labels.connected : labels.disabled}
      </span>
    )
  }

  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center gap-1 rounded-md px-2 py-1 text-xs',
        pending && 'bg-ecap-caution-bg text-ecap-caution-text',
        error && 'bg-ecap-error-bg text-ecap-error-text',
        !connected && !pending && !error && 'bg-muted text-muted-foreground',
      )}
    >
      <StatusIcon className="size-3.5" />
      {labels[status]}
    </span>
  )
}

function ProviderActions({
  labels,
  state,
  pendingAction,
  onConnect,
  onEnable,
  onDisable,
  onDisconnect,
}: {
  labels: ConnectorLabels
  state: ProviderState
  pendingAction: ConnectorAction | null
  onConnect: () => void
  onEnable: () => void
  onDisable: () => void
  onDisconnect: () => void
}) {
  const connected = state.status === 'connected'
  const unavailable = state.status === 'unavailable'
  const isCardBusy = pendingAction !== null
  const isActionPending = (action: ConnectorAction) => pendingAction === action

  return (
    <div
      className={cn(
        'flex shrink-0 flex-col items-end gap-2 self-stretch text-right',
        connected ? 'min-w-24 justify-between' : 'justify-center',
      )}
    >
      {!connected && !unavailable && (
        <Button
          type="button"
          size="icon"
          variant="outline"
          className="bg-background size-11 rounded-xl border-[var(--ecap-connector-action-border)] shadow-none"
          disabled={isCardBusy}
          aria-busy={isActionPending('connect')}
          aria-label={labels.connect}
          data-theme-provider-icon-action
          onClick={onConnect}
        >
          {isActionPending('connect') ? <Spinner className="size-5 animate-spin" /> : <PlusIcon className="size-5" />}
        </Button>
      )}
      {connected && (
        <>
          <ProviderStatusBadge labels={labels} status={state.status} enabled={state.enabled} />
          <div className="flex w-full items-center justify-end gap-3.5">
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="text-muted-foreground hover:text-foreground h-auto p-0 hover:bg-transparent has-[>svg]:px-0"
              disabled={isCardBusy}
              aria-busy={isActionPending('disconnect')}
              onClick={onDisconnect}
            >
              {isActionPending('disconnect') ? (
                <Spinner className="size-4 animate-spin" />
              ) : (
                <PowerIcon className="size-4" />
              )}
              {labels.disconnect}
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="text-muted-foreground hover:text-foreground h-auto p-0 hover:bg-transparent has-[>svg]:px-0"
              disabled={isCardBusy}
              aria-busy={isActionPending(state.enabled ? 'disable' : 'enable')}
              onClick={state.enabled ? onDisable : onEnable}
            >
              {isActionPending(state.enabled ? 'disable' : 'enable') ? (
                <Spinner className="size-4 animate-spin" />
              ) : state.enabled ? (
                <LockOpenIcon className="size-4" />
              ) : (
                <LockClosedIcon className="size-4" />
              )}
              {state.enabled ? labels.disable : labels.enable}
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
