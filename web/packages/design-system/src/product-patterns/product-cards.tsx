'use client'

import type { ComponentProps, ReactNode } from 'react'
import { ChevronRightIcon, WrenchScrewdriverIcon } from '@heroicons/react/24/outline'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/card'
import { Button } from '../components/button'
import { cn } from '../lib/cn'

type CardProps = ComponentProps<typeof Card>

/** Presentation extracted from agents/components/AgentDefinitionCard.tsx. */
export function AgentSummaryCard({
  name, description, avatar, actions, indicator, href, ...props
}: Omit<CardProps, 'children'> & {
  name: string; description: string; avatar: ReactNode; actions?: ReactNode; indicator?: ReactNode; href: string
}) {
  return (
    <Card {...props} className={cn('group/agent border-border bg-card h-full transition-shadow group-hover:shadow-md', props.className)}>
      <CardHeader className="gap-3">
        <div className="flex items-start justify-between gap-4">
          {avatar}
          {actions}
        </div>
        <a href={href} className="block">
          <CardTitle className="flex items-center gap-2 text-base">
            <span className="min-w-0">{name}</span>{indicator}
          </CardTitle>
          <CardDescription className="mt-1 line-clamp-2">{description}</CardDescription>
        </a>
      </CardHeader>
    </Card>
  )
}

/** MarketplaceAgentCard structure. Purchase/permission decisions stay with callers. */
export function AgentCatalogCard({
  name, description, avatar, badge, skills, actions, href, updating = false, updatingLabel, ...props
}: Omit<CardProps, 'children'> & {
  name: string; description: string; avatar: ReactNode; badge?: ReactNode; skills?: ReactNode;
  actions: ReactNode; href: string; updating?: boolean; updatingLabel?: string
}) {
  return (
    <Card {...props} size="sm" data-theme-agent-card aria-busy={updating}
      className={cn('bg-card relative h-full gap-0 overflow-visible rounded-2xl border-0 p-5 py-5 shadow-none transition-shadow hover:shadow-[0_4px_24px_rgba(0,0,0,0.1)]', props.className)}>
      {updating && (
        <div role="status" className="absolute inset-0 z-20 flex items-center justify-center rounded-2xl bg-black/40">
          <div className="flex flex-col items-center gap-2">
            <div className="border-background h-6 w-6 animate-spin rounded-full border-2 border-t-transparent" />
            <span className="text-background text-xs font-medium">{updatingLabel}</span>
          </div>
        </div>
      )}
      <div className="contents" inert={updating || undefined}>
        <CardHeader className="block px-0">
          <a href={href} className="flex min-w-0 items-center gap-3">
            <span data-theme-agent-avatar className="shrink-0 rounded-full">{avatar}</span>
            <span className="flex min-w-0 flex-1 items-center gap-1.5">
              <CardTitle className="text-foreground truncate text-sm font-semibold">{name}</CardTitle>{badge}
            </span>
          </a>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col px-0">
          <p data-theme-agent-description className="text-muted-foreground mt-3 h-[2.5rem] text-xs leading-relaxed">
            <span className="line-clamp-2">{description}</span>
          </p>
          {skills}
        </CardContent>
        <CardFooter className="mt-4 justify-end gap-2 border-0 bg-transparent p-0 pb-5">{actions}</CardFooter>
      </div>
    </Card>
  )
}

/** RegistrySkillCard presentation with the original icon, text and menu columns. */
export function SkillResourceCard({
  name, description, icon, status, actions, ...props
}: Omit<CardProps, 'children'> & {
  name: string; description: string; icon: ReactNode; status?: ReactNode; actions?: ReactNode
}) {
  return (
    <Card {...props} className={cn('flex-row items-start gap-4 rounded-2xl p-5', props.className)}>
      <div className="bg-muted flex size-12 shrink-0 items-center justify-center rounded-xl">{icon}</div>
      <div className="min-w-0 flex-1">
        <h3 className="text-foreground text-base font-semibold break-words">{name}</h3>
        <p className="text-muted-foreground mt-1 line-clamp-2 text-sm leading-5 break-words">{description}</p>
        {status && <div className="mt-3 flex flex-wrap items-center gap-2">{status}</div>}
      </div>
      {actions}
    </Card>
  )
}

/** EngineChannelCard visual shell; account selection and setup remain caller-owned. */
export function ChannelConnectionCard({
  name, account, icon, status, agentLabel, agentName, agentAvatar, onSelectAgent, actions, children, ...props
}: CardProps & {
  name: string; account: string; icon: ReactNode; status: ReactNode; agentLabel: string;
  agentName: string; agentAvatar: ReactNode; onSelectAgent: () => void; actions: ReactNode
}) {
  return (
    <Card {...props} role="group" aria-label={`${name} (${account})`}
      className={cn('border-border bg-card gap-3 self-start rounded-[12px] border py-4 shadow-none', props.className)}>
      <CardHeader className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-2.5">
        <div className="bg-card border-border flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-[6px] border">{icon}</div>
        <div className="min-w-0">
          <CardTitle className="text-sm font-medium">{name}</CardTitle>
          <CardDescription className="mt-1 truncate text-xs" title={account}>{account}</CardDescription>
        </div>
        {status}
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-col gap-1.5">
          <span className="text-muted-foreground text-xs">{agentLabel}</span>
          <Button variant="outline" aria-label={`${agentLabel}: ${agentName}`}
            className="h-9 w-full justify-between rounded-[8px] border-dashed hover:border-[var(--button-outline-border)]"
            onClick={onSelectAgent}>
            <span className="flex min-w-0 items-center gap-2">
              <span aria-hidden="true" className="size-6 shrink-0 overflow-hidden rounded-full [&>*]:rounded-full">{agentAvatar}</span>
              <span className="truncate">{agentName}</span>
            </span>
            <ChevronRightIcon className="text-muted-foreground size-3.5" aria-hidden="true" />
          </Button>
        </div>
        {children}
        <div className="flex flex-wrap gap-2">{actions}</div>
      </CardContent>
    </Card>
  )
}

/** AgentBuilderProjectCard, with its original hero and compact row variants. */
export function ProjectResumeCard({
  name, updatedLabel, status, resumeLabel, variant = 'hero', className, ...props
}: ComponentProps<'a'> & {
  name: string; updatedLabel: string; status: ReactNode; resumeLabel: string; variant?: 'hero' | 'row'
}) {
  const hero = variant === 'hero'
  return (
    <a {...props} className={cn('group flex items-center gap-3 text-left transition-colors',
      hero ? 'border-border bg-card hover:bg-accent rounded-lg border px-4 py-3.5 shadow-xs' : 'hover:bg-accent rounded-md px-2 py-2.5', className)}>
      <span className={cn('bg-muted flex shrink-0 items-center justify-center rounded-lg',
        hero ? 'text-[var(--ecap-text-link)] h-10 w-10' : 'text-muted-foreground h-8 w-8')}>
        <WrenchScrewdriverIcon aria-hidden="true" className={hero ? 'h-5 w-5' : 'h-4 w-4'} />
      </span>
      {hero ? (
        <div className="min-w-0 flex-1">
          <div className="text-foreground truncate text-[15px] font-semibold">{name}</div>
          <div className="mt-1.5 flex items-center gap-2">{status}<span className="text-muted-foreground text-xs">{updatedLabel}</span></div>
        </div>
      ) : (
        <>
          <span className="text-foreground min-w-0 flex-1 truncate text-sm font-medium">{name}</span>
          {status}
          <span className="text-muted-foreground w-32 shrink-0 text-right text-xs tabular-nums">{updatedLabel}</span>
        </>
      )}
      {hero && <span className="text-[var(--ecap-text-link)] flex shrink-0 items-center gap-1 text-sm font-medium">{resumeLabel}<ChevronRightIcon className="h-4 w-4" /></span>}
    </a>
  )
}
