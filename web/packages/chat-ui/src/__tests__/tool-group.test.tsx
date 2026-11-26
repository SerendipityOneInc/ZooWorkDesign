// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { ChatUiProvider } from '../provider'
import { ToolGroup } from '../tools'
import type { ToolStep } from '../types'

const echoT = (key: string, params?: Record<string, string>) => {
  if (!params || Object.keys(params).length === 0) return key
  return `${key} ${Object.values(params).join(' ')}`
}
const renderTG = (ui: React.ReactElement) => render(<ChatUiProvider t={echoT}>{ui}</ChatUiProvider>)

function step(overrides: Partial<ToolStep> & { id: string; name: string }): ToolStep {
  return {
    phase: 'done',
    startedAt: new Date('2026-04-15T12:00:00Z').getTime(),
    ...overrides,
  }
}

afterEach(cleanup)

describe('ToolGroup activity timeline', () => {
  it('shows ordinary tool approval as waiting without a spinner or running timer', () => {
    renderTG(<ToolGroup steps={[step({ id: 'approval', name: 'approval_decide', phase: 'running', status: 'awaiting_approval' })]} isStreaming activityLabel="Working" />)
    expect(screen.getByTestId('genclaw-tool-group').getAttribute('data-activity-status')).toBe('waiting')
    expect(screen.getByTestId('genclaw-tool-group-toggle').textContent).toContain('waitingApprovalLabel')
    expect(screen.queryByLabelText('genClaw.toolGroup.runningLabel')).toBeNull()
    expect(screen.getByTestId('genclaw-tool-row-approval_decide').textContent).not.toMatch(/\d+m|\d+s/)
  })

  it('renders nothing for empty steps', () => {
    const { container } = renderTG(<ToolGroup steps={[]} />)
    expect(container.firstChild).toBeNull()
  })

  it('fills its assistant content column without adding a second width cap', () => {
    renderTG(<ToolGroup steps={[step({ id: 'tc-1', name: 'read' })]} />)
    const group = screen.getByTestId('genclaw-tool-group')
    expect(group.className).toContain('w-full')
    expect(group.className.split(/\s+/).find((name) => name.startsWith('max-w-'))).toBeUndefined()
  })

  it('renders the completed activity summary collapsed by default', () => {
    renderTG(<ToolGroup steps={[step({ id: 'tc-1', name: 'read' }), step({ id: 'tc-2', name: 'exec' })]} />)
    const toggle = screen.getByTestId('genclaw-tool-group-toggle')
    expect(toggle.textContent).toContain('genClaw.toolGroup.activityDoneNoDuration')
    expect(toggle.textContent).toContain('2')
    expect(toggle.getAttribute('aria-expanded')).toBe('false')
    expect(screen.queryByTestId('genclaw-tool-group-list')).toBeNull()
  })

  it('keeps a single failed step in the normal completed summary and timer', () => {
    renderTG(
      <ToolGroup
        steps={[
          step({
            id: 'tc-failed',
            name: 'exec',
            phase: 'error',
            durationMs: 1500,
            errorMessage: 'Command failed',
          }),
        ]}
        defaultExpanded
      />,
    )
    expect(screen.getByTestId('genclaw-tool-group').getAttribute('data-activity-status')).toBe('done')
    expect(screen.getByTestId('genclaw-tool-group-toggle').textContent).toContain(
      'genClaw.toolGroup.activityDone',
    )
    expect(screen.getByTestId('genclaw-tool-group-toggle').textContent).toContain('1.5s')
    expect(screen.getByTestId('genclaw-tool-row-exec').getAttribute('data-activity-step-status')).toBe(
      'error',
    )
  })

  it('shows honest elapsed activity copy while running', () => {
    const now = Date.now()
    renderTG(
      <ToolGroup
        steps={[step({ id: 'tc-1', name: 'read', phase: 'running', startedAt: now })]}
        isStreaming
        defaultExpanded
      />,
    )
    const toggle = screen.getByTestId('genclaw-tool-group-toggle')
    expect(toggle.textContent).toContain('genClaw.toolGroup.activityRunning')
    expect(screen.getByTestId('genclaw-tool-group').getAttribute('data-activity-status')).toBe('running')
  })

  it('specializes a running sessions_spawn row as delegated work after the parent turn ends', () => {
    renderTG(
      <ToolGroup
        steps={[
          step({
            id: 'tc-spawn',
            name: 'sessions_spawn',
            phase: 'running',
            status: 'running',
            inputSummary: 'Research the release',
            startedAt: Date.now(),
          }),
        ]}
        isStreaming={false}
      />,
    )

    const group = screen.getByTestId('genclaw-tool-group')
    expect(group.getAttribute('data-delegated-work')).toBe('true')
    expect(group.getAttribute('data-activity-status')).toBe('running')
    expect(screen.getByTestId('genclaw-tool-group-toggle').textContent).toContain(
      'genClaw.toolGroup.delegatedRunning',
    )
    expect(screen.getByTestId('genclaw-tool-row-sessions_spawn').textContent).toContain(
      'Research the release',
    )
  })

  it('counts only currently running delegated tasks in a mixed group', () => {
    renderTG(
      <ToolGroup
        steps={[
          step({ id: 'tc-spawn-running', name: 'sessions_spawn', phase: 'running', status: 'running' }),
          step({ id: 'tc-spawn-done', name: 'sessions_spawn', phase: 'done', status: 'succeeded' }),
        ]}
      />,
    )

    const [activity, delegated] = screen.getAllByTestId('genclaw-tool-group')
    expect(activity.getAttribute('data-activity-status')).toBe('done')
    const toggle = within(delegated).getByTestId('genclaw-tool-group-toggle')
    expect(toggle.textContent).toContain('genClaw.toolGroup.delegatedRunning')
    expect(toggle.textContent?.split(/\s+/)[1]).toBe('1')
  })

  it('expands delegated task copy inline without a nested scroll area', () => {
    renderTG(
      <ToolGroup
        steps={[
          step({
            id: 'tc-spawn-long-task',
            name: 'sessions_spawn',
            phase: 'running',
            status: 'running',
            inputSummary:
              'Research the release across several official sources and return a concise comparison with conclusions.',
            startedAt: Date.now(),
          }),
        ]}
      />,
    )

    const preview = screen.getByTestId('genclaw-tool-row-preview')
    expect(preview.className).toContain('line-clamp-2')
    expect(preview.className).not.toContain('overflow-y-auto')

    fireEvent.click(screen.getByTestId('genclaw-tool-row-sessions_spawn-details'))

    expect(preview.className).toContain('whitespace-pre-wrap')
    expect(preview.className).not.toContain('line-clamp-2')
    expect(preview.className).not.toContain('max-h-48')
    expect(preview.className).not.toContain('overflow-y-auto')
  })

  it('keeps delegated approval waiting expanded with a distinct warning state', () => {
    renderTG(
      <ToolGroup
        steps={[
          step({
            id: 'tc-spawn-waiting',
            name: 'sessions_spawn',
            phase: 'running',
            status: 'awaiting_approval',
          }),
        ]}
      />,
    )

    expect(screen.getByTestId('genclaw-tool-group').getAttribute('data-activity-status')).toBe('waiting')
    expect(screen.getByTestId('genclaw-tool-group-list')).not.toBeNull()
    expect(screen.getByTestId('genclaw-tool-group-toggle').textContent).toContain(
      'genClaw.toolGroup.delegatedWaiting',
    )
    expect(within(screen.getByTestId('genclaw-tool-group-toggle')).getByRole('img').getAttribute('aria-label')).toBe(
      'genClaw.toolGroup.waitingApprovalLabel',
    )
  })

  it('auto-collapses successful delegated work when the user has not touched its disclosure', () => {
    const running = step({
      id: 'tc-spawn-complete',
      name: 'sessions_spawn',
      phase: 'running',
      status: 'running',
      startedAt: Date.now(),
    })
    const { rerender } = renderTG(<ToolGroup steps={[running]} />)
    expect(screen.getByTestId('genclaw-tool-group-list')).not.toBeNull()

    rerender(
      <ChatUiProvider t={echoT}>
        <ToolGroup steps={[{ ...running, phase: 'done', status: 'succeeded', durationMs: 1500 }]} />
      </ChatUiProvider>,
    )

    expect(screen.getByTestId('genclaw-tool-group').getAttribute('data-activity-status')).toBe('done')
    expect(screen.queryByTestId('genclaw-tool-group-list')).toBeNull()
    expect(screen.getByTestId('genclaw-tool-group-toggle').textContent).toContain(
      'genClaw.toolGroup.activityDone',
    )
  })

  it('keeps failed spawn attempts in collapsed details after successful retries', () => {
    renderTG(
      <ToolGroup
        steps={[
          step({ id: 'tc-spawn-failed-1', name: 'sessions_spawn', phase: 'error', status: 'failed' }),
          step({ id: 'tc-spawn-failed-2', name: 'sessions_spawn', phase: 'error', status: 'failed' }),
          step({ id: 'tc-spawn-done-1', name: 'sessions_spawn', status: 'succeeded' }),
          step({ id: 'tc-spawn-done-2', name: 'sessions_spawn', status: 'succeeded' }),
        ]}
        isStreaming={false}
      />,
    )

    expect(screen.getByTestId('genclaw-tool-group').getAttribute('data-activity-status')).toBe('done')
    expect(screen.queryByTestId('genclaw-tool-group-list')).toBeNull()
    const toggle = screen.getByTestId('genclaw-tool-group-toggle')
    expect(toggle.textContent).toContain('genClaw.toolGroup.activityDoneNoDuration 4')
    fireEvent.click(toggle)
    expect(screen.getAllByTestId('genclaw-tool-row-sessions_spawn').map((row) =>
      row.getAttribute('data-activity-step-status'),
    )).toEqual(['error', 'error', 'done', 'done'])
  })

  it('keeps the normal timer while recovering from a rejected spawn and collapses after the parent finishes', () => {
    const failed = step({
      id: 'tc-spawn-rejected', name: 'sessions_spawn', phase: 'error', startedAt: Date.now(), durationMs: 633,
    })
    const { rerender } = renderTG(<ToolGroup steps={[failed]} isStreaming />)

    expect(screen.getByTestId('genclaw-tool-group').getAttribute('data-activity-status')).toBe('running')
    expect(screen.getByTestId('genclaw-tool-group-toggle').textContent).toContain('activityRunning')

    rerender(<ChatUiProvider t={echoT}><ToolGroup steps={[failed]} isStreaming={false} /></ChatUiProvider>)

    const toggle = screen.getByTestId('genclaw-tool-group-toggle')
    expect(toggle.textContent).toContain('activityDone 1 633ms')
    expect(toggle.getAttribute('aria-expanded')).toBe('false')
    fireEvent.click(toggle)
    expect(screen.getByTestId('genclaw-tool-row-sessions_spawn').getAttribute('data-activity-step-status')).toBe('error')
  })

  it.each([
    ['running', 'running', 'delegatedRunning'],
    ['awaiting_approval', 'waiting', 'delegatedWaiting'],
  ])('shows a %s child separately without changing the completed activity summary', (status, activityStatus, label) => {
    renderTG(
      <ToolGroup
        steps={[
          step({ id: 'tc-rejected', name: 'sessions_spawn', phase: 'error', durationMs: 633 }),
          step({ id: 'tc-search', name: 'web_search', durationMs: 2900 }),
          step({ id: 'tc-active-child', name: 'sessions_spawn', phase: 'running', status }),
        ]}
        isStreaming={false}
      />,
    )

    const [activity, delegated] = screen.getAllByTestId('genclaw-tool-group')
    const toggle = within(activity).getByTestId('genclaw-tool-group-toggle')
    expect(activity.getAttribute('data-delegated-work')).toBe('false')
    expect(activity.getAttribute('data-activity-status')).toBe('done')
    expect(toggle.textContent).toContain('activityDone 2 2.9s')
    expect(toggle.getAttribute('aria-expanded')).toBe('false')
    expect(delegated.getAttribute('data-delegated-work')).toBe('true')
    expect(delegated.getAttribute('data-activity-status')).toBe(activityStatus)
    expect(within(delegated).getByTestId('genclaw-tool-group-toggle').textContent).toContain(label)
    expect(within(delegated).getByTestId('genclaw-tool-group-list')).not.toBeNull()

    fireEvent.click(toggle)
    expect(within(activity).getByTestId('genclaw-tool-row-sessions_spawn').getAttribute('data-activity-step-status')).toBe('error')
    expect(within(delegated).getByTestId('genclaw-tool-row-sessions_spawn').getAttribute('data-activity-step-status')).toBe('running')
    expect(screen.getAllByTestId('genclaw-tool-row-sessions_spawn')).toHaveLength(2)
  })

  it('does not let a completed child hide ordinary tools that are still running', () => {
    renderTG(
      <ToolGroup
        steps={[
          step({ id: 'tc-spawn-done', name: 'sessions_spawn', status: 'succeeded' }),
          step({ id: 'tc-search-running', name: 'web_search', phase: 'running' }),
        ]}
        isStreaming
      />,
    )

    expect(screen.getByTestId('genclaw-tool-group').getAttribute('data-activity-status')).toBe('running')
    expect(screen.getByTestId('genclaw-tool-group-toggle').textContent).toContain('activityRunning')
  })

  it.each(['done', 'error'] as const)('moves a child ending with %s into history without changing the parent outcome', (phase) => {
    const child = step({ id: 'tc-child', name: 'sessions_spawn', phase: 'running' })
    const completed = step({ id: 'tc-search', name: 'web_search' })
    const { rerender } = renderTG(<ToolGroup steps={[completed, child]} />)
    expect(screen.getAllByTestId('genclaw-tool-group')).toHaveLength(2)

    rerender(
      <ChatUiProvider t={echoT}>
        <ToolGroup steps={[completed, { ...child, phase }]} />
      </ChatUiProvider>,
    )

    expect(screen.getByTestId('genclaw-tool-group').getAttribute('data-activity-status')).toBe('done')
    const toggle = screen.getByTestId('genclaw-tool-group-toggle')
    expect(toggle.getAttribute('aria-expanded')).toBe('false')
    fireEvent.click(toggle)
    expect(screen.getByTestId('genclaw-tool-row-sessions_spawn').getAttribute('data-activity-step-status')).toBe(phase)
  })

  it('shows trusted command progress but never the raw command result', () => {
    const running = step({
      id: 'tc-real-copy',
      name: 'exec',
      itemKind: 'command',
      phase: 'running',
      startedAt: Date.now(),
      inputSummary: 'pnpm install',
      progressText: 'Installing dependencies',
      summary: '{"stdout":"secret dependency log"}',
    })
    const { rerender } = renderTG(<ToolGroup steps={[running]} isStreaming defaultExpanded />)
    const runningRow = screen.getByTestId('genclaw-tool-row-exec')
    expect(runningRow.textContent).toContain('genClaw.toolGroup.stepCommand')
    expect(runningRow.textContent).toContain('pnpm install')
    expect(runningRow.textContent).toContain('Installing dependencies')

    rerender(
      <ChatUiProvider t={echoT}>
        <ToolGroup steps={[{ ...running, phase: 'done' }]} defaultExpanded />
      </ChatUiProvider>,
    )
    const completedRow = screen.getByTestId('genclaw-tool-row-exec')
    expect(completedRow.textContent).toContain('Installing dependencies')
    expect(completedRow.textContent).not.toContain('secret dependency log')
  })

  it('does not display successful result text even when it looks human-readable', () => {
    renderTG(
      <ToolGroup
        steps={[step({ id: 'tc-result-copy', name: 'web_fetch', summary: 'Full fetched page body' })]}
        defaultExpanded
      />,
    )
    const row = screen.getByTestId('genclaw-tool-row-web_fetch')
    expect(row.textContent).toContain('genClaw.toolGroup.stepFetch')
    expect(row.textContent).not.toContain('Full fetched page body')
  })

  it('does not trust plain-text errors from legacy steps without an item kind', () => {
    renderTG(
      <ToolGroup
        steps={[
          step({
            id: 'tc-legacy-error',
            name: 'company_internal_tool',
            phase: 'error',
            errorMessage: 'customer account details from the raw tool response',
          }),
        ]}
        defaultExpanded
      />,
    )

    const row = screen.getByTestId('genclaw-tool-row-company_internal_tool')
    expect(row.textContent).not.toContain('customer account details')
  })

  it('never injects the user query when runtime detail is absent', () => {
    renderTG(
      <ToolGroup
        steps={[step({ id: 'tc-no-copy', name: 'web_fetch' })]}
        userQuery="private user request"
        defaultExpanded
      />,
    )
    const row = screen.getByTestId('genclaw-tool-row-web_fetch')
    expect(row.textContent).toContain('genClaw.toolGroup.stepFetch')
    expect(row.textContent).not.toContain('private user request')
    expect(row.textContent).not.toMatch(/partA_|partB_/)
  })

  it('renders rows with zooclaw-design-system Item primitives', () => {
    renderTG(<ToolGroup steps={[step({ id: 'tc-ds', name: 'read' })]} defaultExpanded />)
    const row = screen.getByTestId('genclaw-tool-row-read')
    expect(row.getAttribute('data-slot')).toBe('item')
    expect(row.querySelector('[data-slot="item-content"]')).not.toBeNull()
    expect(row.querySelector('[data-slot="item-title"]')).not.toBeNull()
  })

  it('toggles the activity disclosure', () => {
    renderTG(<ToolGroup steps={[step({ id: 'tc-1', name: 'read' })]} />)
    fireEvent.click(screen.getByTestId('genclaw-tool-group-toggle'))
    expect(screen.getByTestId('genclaw-tool-group-list')).not.toBeNull()
    fireEvent.click(screen.getByTestId('genclaw-tool-group-toggle'))
    expect(screen.queryByTestId('genclaw-tool-group-list')).toBeNull()
  })

  it.each(['done', 'running'] as const)('follows a changed default with %s steps while the user has not touched the disclosure', (phase) => {
    const steps = [step({ id: 'tc-1', name: 'read', phase })]
    const { rerender } = renderTG(<ToolGroup steps={steps} defaultExpanded />)
    expect(screen.getByTestId('genclaw-tool-group-list')).not.toBeNull()
    rerender(
      <ChatUiProvider t={echoT}>
        <ToolGroup steps={steps} defaultExpanded={false} />
      </ChatUiProvider>,
    )
    expect(screen.queryByTestId('genclaw-tool-group-list')).toBeNull()
  })

  it.each(['done', 'running'] as const)('preserves a user override with %s steps when the caller default later changes', (phase) => {
    const steps = [step({ id: 'tc-1', name: 'read', phase })]
    const { rerender } = renderTG(
      <ToolGroup steps={steps} defaultExpanded={false} />,
    )
    fireEvent.click(screen.getByTestId('genclaw-tool-group-toggle'))
    expect(screen.getByTestId('genclaw-tool-group-list')).not.toBeNull()

    rerender(
      <ChatUiProvider t={echoT}>
        <ToolGroup steps={steps} defaultExpanded />
      </ChatUiProvider>,
    )
    expect(screen.getByTestId('genclaw-tool-group-list')).not.toBeNull()

    rerender(
      <ChatUiProvider t={echoT}>
        <ToolGroup steps={steps} defaultExpanded={false} />
      </ChatUiProvider>,
    )
    expect(screen.getByTestId('genclaw-tool-group-list')).not.toBeNull()
  })

  it.each([
    ['web_search', 'stepSearch'],
    ['web_fetch', 'stepFetch'],
    ['browser_task', 'stepBrowse'],
    ['web_image_search', 'stepImageSearch'],
    ['read', 'stepRead'],
    ['sessions_spawn', 'stepDelegate'],
    ['write', 'stepWrite'],
    ['update_plan', 'stepPlan'],
    ['image_generate', 'stepGenerateImage'],
    ['memory_search', 'stepMemory'],
    ['cron', 'stepSchedule'],
    ['composio_execute', 'stepIntegration'],
    ['agent_db', 'stepDatabase'],
  ])('uses a deterministic label for %s', (name, key) => {
    renderTG(<ToolGroup steps={[step({ id: `tc-${name}`, name })]} defaultExpanded />)
    expect(screen.getByTestId(`genclaw-tool-row-${name}`).textContent).toContain(`genClaw.toolGroup.${key}`)
  })

  it.each([
    ['image_generate', 'status', 'stepImageStatus'],
    ['image_generate', 'list', 'stepImageModels'],
    ['subagents', 'list', 'stepInspectSubtasks'],
    ['sessions_yield', undefined, 'stepWait'],
    ['media_materialize', undefined, 'stepSaveWorkspace'],
    ['sessions_history', undefined, 'stepInspectSession'],
  ])('uses action-aware activity copy for %s/%s', (name, action, key) => {
    renderTG(<ToolGroup steps={[step({ id: `tc-${name}`, name, action })]} defaultExpanded />)
    expect(screen.getByTestId(`genclaw-tool-row-${name}`).textContent).toContain(
      `genClaw.toolGroup.${key}`,
    )
  })

  it('shows a failed command label without exposing untrusted result detail', () => {
    renderTG(
      <ToolGroup
        steps={[
          step({
            id: 'tc-failed-command',
            name: 'exec',
            phase: 'error',
            errorMessage: 'customer account details from raw stderr',
            summary: 'private stdout result preview',
            progressText: 'unclassified command output',
          }),
        ]}
        defaultExpanded
      />,
    )

    const row = screen.getByTestId('genclaw-tool-row-exec')
    expect(row.textContent).toContain('genClaw.toolGroup.stepCommandFailed')
    expect(row.textContent).not.toContain('customer account details')
    expect(row.textContent).not.toContain('private stdout')
    expect(row.textContent).not.toContain('unclassified command output')
    expect(within(row).getByRole('img').getAttribute('aria-label')).toBe(
      'genClaw.toolGroup.failedLabel',
    )
  })

  it('shows an unknown tool name without guessing an action', () => {
    renderTG(<ToolGroup steps={[step({ id: 'tc-unknown', name: 'company_internal_tool' })]} defaultExpanded />)
    const row = screen.getByTestId('genclaw-tool-row-company_internal_tool')
    expect(row.textContent).toContain('company_internal_tool')
    expect(row.textContent).not.toMatch(/stepProcess|partA_|partB_/)
  })

  it.each([
    {
      name: 'web_search',
      input: '2026 summer fashion trends',
      result: '{ "ok": true, "provider": "serper", "body": { "organic": [] } }',
      hidden: 'serper',
    },
    {
      name: 'web_fetch',
      input: 'https://example.com/article',
      result: '# Article\n\nFull fetched page body',
      hidden: 'Full fetched page body',
    },
    {
      name: 'read',
      input: 'src/private-config.ts',
      result: 'export const privateToken = "do-not-render"',
      hidden: 'do-not-render',
    },
  ])('shows safe $name intent and hides its raw result', ({ name, input, result, hidden }) => {
    renderTG(
      <ToolGroup
        steps={[step({ id: `tc-safe-${name}`, name, itemKind: 'tool', inputSummary: input, summary: result })]}
        defaultExpanded
      />,
    )
    const row = screen.getByTestId(`genclaw-tool-row-${name}`)
    expect(row.textContent).toContain(input)
    expect(row.textContent).not.toContain(hidden)
  })

  it('trusts the structured patch projection but not generic tool results', () => {
    renderTG(
      <ToolGroup
        steps={[
          step({
            id: 'tc-patch',
            name: 'apply_patch',
            itemKind: 'patch',
            summary: '2 files changed (+4 -1)',
          }),
        ]}
        defaultExpanded
      />,
    )
    const row = screen.getByTestId('genclaw-tool-row-apply_patch')
    expect(row.textContent).toContain('genClaw.toolGroup.stepWrite')
    expect(row.textContent).toContain('2 files changed (+4 -1)')
  })

  it('shows only the identity of a dynamic MCP tool', () => {
    renderTG(
      <ToolGroup
        steps={[
          step({
            id: 'tc-mcp',
            name: 'mcp__google_drive__search_files',
            itemKind: 'tool',
            inputSummary: 'MCP · google_drive · search_files',
            summary: '{"structuredContent":{"files":[{"name":"private-plan"}]}}',
          }),
        ]}
        defaultExpanded
      />,
    )
    const row = screen.getByTestId('genclaw-tool-row-mcp__google_drive__search_files')
    expect(row.textContent).toContain('genClaw.toolGroup.stepIntegration')
    expect(row.textContent).toContain('MCP · google_drive · search_files')
    expect(row.textContent).not.toContain('private-plan')
  })

  it('does not expose a result from an unknown tool', () => {
    renderTG(
      <ToolGroup
        steps={[
          step({
            id: 'tc-unknown-result',
            name: 'company_internal_tool',
            itemKind: 'tool',
            summary: 'customer account details',
          }),
        ]}
        defaultExpanded
      />,
    )
    const row = screen.getByTestId('genclaw-tool-row-company_internal_tool')
    expect(row.textContent).toContain('company_internal_tool')
    expect(row.textContent).not.toContain('customer account details')
  })

  it('keeps runtime input detail collapsed until its dedicated button is used', () => {
    renderTG(
      <ToolGroup
        steps={[
          step({
            id: 'tc-detail',
            name: 'exec',
            inputSummary: 'command=mkdir -p artifacts && cp tmp/report.html artifacts/final-report.html',
          }),
        ]}
        defaultExpanded
      />,
    )
    const preview = screen.getByTestId('genclaw-tool-row-preview')
    const button = screen.getByTestId('genclaw-tool-row-exec-details')
    expect(button.getAttribute('aria-expanded')).toBe('false')
    expect(preview.className).toContain('line-clamp-1')
    fireEvent.click(button)
    expect(button.getAttribute('aria-expanded')).toBe('true')
    expect(preview.className).toContain('whitespace-pre-wrap')
  })

  it('expands multiline plan detail by default', () => {
    renderTG(
      <ToolGroup
        steps={[
          step({
            id: 'tc-plan',
            name: 'update_plan',
            inputSummary: 'inspect  completed\nimplement  in_progress\nverify  pending',
          }),
        ]}
        defaultExpanded
      />,
    )
    const button = screen.getByTestId('genclaw-tool-row-update_plan-details')
    expect(button.getAttribute('aria-expanded')).toBe('true')
    expect(screen.getByTestId('genclaw-tool-row-preview').textContent).toContain('implement  in_progress')
  })

  it('does not expose tool call ids or timestamps as detail', () => {
    renderTG(<ToolGroup steps={[step({ id: 'secret-call-id', name: 'read' })]} defaultExpanded />)
    const row = screen.getByTestId('genclaw-tool-row-read')
    expect(row.textContent).not.toContain('secret-call-id')
    expect(row.textContent).not.toContain('startedAt')
  })

  describe('long activity history', () => {
    const steps = Array.from({ length: 7 }, (_, index) =>
      step({ id: `tc-${index}`, name: index === 6 ? 'write' : `tool_${index}` }),
    )

    function rows() {
      return screen.getAllByTestId(/^genclaw-tool-row-/).filter((element) => element.getAttribute('data-slot') === 'item')
    }

    it('shows the four most recent steps behind an earlier-steps disclosure', () => {
      renderTG(<ToolGroup steps={steps} defaultExpanded />)
      expect(screen.getByTestId('genclaw-tool-group-show-earlier').textContent).toContain('3')
      expect(rows()).toHaveLength(4)
      expect(rows().at(-1)?.textContent).toContain('stepWrite')
    })

    it('shows the full unique history after expansion', () => {
      renderTG(<ToolGroup steps={steps} defaultExpanded />)
      fireEvent.click(screen.getByTestId('genclaw-tool-group-show-earlier'))
      const visible = rows()
      expect(visible).toHaveLength(7)
      expect(new Set(visible.map((row) => row.getAttribute('data-testid'))).size).toBe(7)
    })
  })

  it('keeps failed rows local while preserving a cancelled group outcome', () => {
    const { rerender } = renderTG(
      <ToolGroup steps={[step({ id: 'tc-error', name: 'exec', phase: 'error', summary: 'Command failed' })]} />,
    )
    expect(screen.getByTestId('genclaw-tool-group').getAttribute('data-activity-status')).toBe('done')
    expect(screen.getByTestId('genclaw-tool-group-toggle').textContent).toContain('activityDone')

    rerender(
      <ChatUiProvider t={echoT}>
        <ToolGroup
          steps={[step({ id: 'tc-stop', name: 'exec', phase: 'cancelled', summary: 'Stopped by user' })]}
        />
      </ChatUiProvider>,
    )
    expect(screen.getByTestId('genclaw-tool-group').getAttribute('data-activity-status')).toBe('cancelled')
    expect(screen.getByTestId('genclaw-tool-group-toggle').textContent).toContain('activityStopped')
  })

  it('preserves a cancelled outcome when later completed steps are present', () => {
    renderTG(
      <ToolGroup
        steps={[
          step({ id: 'tc-cancelled', name: 'exec', phase: 'cancelled' }),
          step({ id: 'tc-after-cancel', name: 'read', phase: 'done' }),
        ]}
      />,
    )

    expect(screen.getByTestId('genclaw-tool-group').getAttribute('data-activity-status')).toBe('cancelled')
    expect(screen.getByTestId('genclaw-tool-group-toggle').textContent).toContain('activityStopped')
  })

  it('keeps the group running while the agent recovers from an earlier failed step', () => {
    renderTG(
      <ToolGroup
        steps={[
          step({ id: 'tc-error', name: 'web_fetch', phase: 'error' }),
          step({ id: 'tc-retry', name: 'web_search', phase: 'running', startedAt: Date.now() }),
        ]}
        isStreaming
      />,
    )

    expect(screen.getByTestId('genclaw-tool-group').getAttribute('data-activity-status')).toBe('running')
    const toggle = screen.getByTestId('genclaw-tool-group-toggle')
    expect(toggle.textContent).toContain('activityRunning')
    expect(toggle.textContent).toMatch(/\d+(?:\.\d+)?(?:ms|s|m)/)
  })

  it('shows completed activity after the agent recovers from an earlier failed step', () => {
    renderTG(
      <ToolGroup
        steps={[
          step({ id: 'tc-error', name: 'read', phase: 'error' }),
          step({ id: 'tc-recovery', name: 'read' }),
        ]}
      />,
    )

    expect(screen.getByTestId('genclaw-tool-group').getAttribute('data-activity-status')).toBe('done')
    expect(screen.getByTestId('genclaw-tool-group-toggle').textContent).toContain('activityDoneNoDuration')
  })

  it('keeps elapsed timing active when a step fails while the thread continues', () => {
    renderTG(
      <ToolGroup
        steps={[step({ id: 'tc-error', name: 'exec', phase: 'error', startedAt: Date.now() })]}
        isStreaming
      />,
    )

    expect(screen.getByTestId('genclaw-tool-group').getAttribute('data-activity-status')).toBe('running')
    const toggle = screen.getByTestId('genclaw-tool-group-toggle')
    expect(toggle.textContent).toContain('activityRunning')
    expect(toggle.textContent).toMatch(/\d+(?:\.\d+)?(?:ms|s|m)/)
  })

  it('keeps a terminal cancellation visible while the thread prepares its next response', () => {
    renderTG(
      <ToolGroup
        steps={[step({ id: 'tc-cancelled', name: 'exec', phase: 'cancelled' })]}
        isStreaming
      />,
    )

    expect(screen.getByTestId('genclaw-tool-group').getAttribute('data-activity-status')).toBe('cancelled')
    expect(screen.getByTestId('genclaw-tool-group-toggle').textContent).toContain('activityStopped')
  })

  it('renders step and group duration when the runtime supplies an end timestamp', () => {
    renderTG(
      <ToolGroup steps={[step({ id: 'tc-duration', name: 'exec', durationMs: 1500 })]} defaultExpanded />,
    )
    expect(screen.getByTestId('genclaw-tool-group-toggle').textContent).toContain('1.5s')
    expect(screen.getByTestId('genclaw-tool-row-exec').textContent).toContain('1.5s')
  })

  it('uses the design-system Spinner for a running row', () => {
    renderTG(
      <ToolGroup
        steps={[step({ id: 'tc-running', name: 'exec', phase: 'running', startedAt: Date.now() })]}
        isStreaming
        defaultExpanded
      />,
    )
    const row = screen.getByTestId('genclaw-tool-row-exec')
    const spinner = row.querySelector('[data-slot="spinner"]')
    expect(spinner).not.toBeNull()
    expect(spinner?.getAttribute('class')).toContain('motion-reduce:animate-none')
  })

  describe('elapsed timer', () => {
    beforeEach(() => vi.useFakeTimers())
    afterEach(() => vi.useRealTimers())

    it('increments the current row without a live-region announcement', async () => {
      const now = Date.now()
      renderTG(
        <ToolGroup
          steps={[step({ id: 'tc-timer', name: 'exec', phase: 'running', startedAt: now })]}
          isStreaming
          defaultExpanded
        />,
      )
      const row = screen.getByTestId('genclaw-tool-row-exec')
      const initial = row.textContent
      await act(async () => vi.advanceTimersByTimeAsync(1200))
      expect(row.textContent).not.toBe(initial)
      expect(within(row).getByText(/1\.\ds/).getAttribute('aria-hidden')).toBe('true')
    })

    it('cleans up timers on unmount', () => {
      const clearSpy = vi.spyOn(globalThis, 'clearInterval')
      const { unmount } = renderTG(
        <ToolGroup
          steps={[step({ id: 'tc-cleanup', name: 'exec', phase: 'running', startedAt: Date.now() })]}
          isStreaming
          defaultExpanded
        />,
      )
      unmount()
      expect(clearSpy).toHaveBeenCalled()
      clearSpy.mockRestore()
    })
  })
})
