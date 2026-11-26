import { useState } from 'react'
import { Button, Segmented, Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@zooclaw/zooworkdesign'
import { ActionTooltip, ChatActivity, ClawSpinner, NeutralChatActivityIcon, UserMessage, LoadingDots, ModelDegradationBanner, ToolGroup, type ToolStep } from './source'
import { ChatExample, ChatSection, demoAgentImage, useChatCopy } from './shared'
import { CHAT_UI_COMPONENTS } from './registry'

export function ChatActivityExamples() {
  const { c } = useChatCopy()
  const [phase, setPhase] = useState('done')
  const [startedAt] = useState(Date.now)
  const [notice, setNotice] = useState('')
  const steps: ToolStep[] = [
    { id: 'search', name: 'web_search', phase: 'done', startedAt, durationMs: 2400, summary: c('Found three relevant sources.', '已找到三个相关来源。') },
    { id: 'research', name: 'read_file', phase: phase as ToolStep['phase'], startedAt: startedAt + 2400, durationMs: 1800, summary: c('Read the weekly report.', '已读取每周报告。'), progressText: c('Reading sources…', '正在阅读来源…'), errorMessage: phase === 'error' ? c('Source unavailable.', '来源不可用。') : undefined },
  ]
  return <ChatSection id="chat-activity" title={c('Activity & loading', '执行与加载')} description={c('Conversation states, tool execution, loading indicators and availability notices, grouped by purpose.', '按用途分组查看会话状态、工具执行、加载指示和可用性通知。')} components={CHAT_UI_COMPONENTS['chat-activity']}>
    <ChatSessionStates />
    <ChatExample title={c('Tool execution', '工具执行')}><div className="pv-chat-workbench"><div className="pv-chat-workbench-controls"><Segmented value={phase} onValueChange={setPhase} aria-label={c('Execution state', '执行状态')} options={[
      { value: 'running', label: c('Running', '执行中') }, { value: 'done', label: c('Complete', '完成') }, { value: 'error', label: c('Failed', '失败') }, { value: 'cancelled', label: c('Stopped', '已停止') },
    ]} /></div><div className="pv-chat-workbench-body"><ToolGroup steps={steps} isStreaming={phase === 'running'} defaultExpanded /></div></div>
    <div className="pv-row"><LoadingDots label={c('Thinking…', '思考中…')} size="sm" /><ActionTooltip label={c('Retry this preview run', '重试当前预览任务')}><Button size="sm" variant="outline" onClick={() => setPhase('running')}>{c('Retry run', '重试任务')}</Button></ActionTooltip></div>
    </ChatExample><ChatExample title={c('Model availability', '模型可用性')}><div className="pv-chat-ui-stack">{(['degraded', 'expiryWarning', 'expired'] as const).map(variant => <ModelDegradationBanner key={variant} variant={variant} daysLeft={3} onUpgradeClick={() => setNotice(c('Plan action selected in preview.', '已在预览中选择套餐操作。'))} />)}</div></ChatExample>
    {notice && <p role="status">{notice}</p>}
  </ChatSection>
}


function ChatSessionStates() {
  const { c, labels } = useChatCopy()
  const [state, setState] = useState('thinking')
  const states = [
    { value: 'queued', label: c('Waiting to start…', '正在排队…') },
    { value: 'thinking', label: c('Thinking…', '正在思考…') },
    { value: 'tool', label: c('Working on the task…', '正在执行任务…') },
    { value: 'compacting', label: c('Organizing context…', '正在整理上下文…') },
    { value: 'responding', label: c('Preparing the response…', '正在组织回复…') },
    { value: 'approval', label: c('Awaiting approval', '等待审批') },
  ]
  const [connection, setConnection] = useState(false)
  const active = states.find(item => item.value === state)
  return <>
    <ChatExample title={c('Conversation activity', '会话实时状态')} description={c('Compare activity states here; try sending and stopping in the complete conversation.', '在这里对照执行状态；发送和停止可在完整会话中体验。')}>
      <div className="pv-chat-workbench"><div className="pv-chat-workbench-controls">
        <Select value={state} onValueChange={setState}><SelectTrigger aria-label={c('Session activity', '会话状态')} className="w-64"><SelectValue /></SelectTrigger>
          <SelectContent>{states.map(item => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}<SelectItem value="stopped">{c('Stopped', '已停止')}</SelectItem></SelectContent></Select>
        <Button variant="outline" size="sm" aria-pressed={connection} onClick={() => setConnection(current => !current)}>{c('Reconnecting', '重新连接')}</Button>
        {active && <Button variant="outline" size="sm" onClick={() => setState('stopped')}>{labels.stop}</Button>}
      </div>
      <div className="pv-chat-workbench-body pv-chat-ui-message-sample">
        <UserMessage view={{ id: 'activity-user', text: c('Summarize the latest market research.', '总结最新的市场研究。'), senderLabel: c('You', '你'), timestamp: Date.UTC(2026, 9, 14, 9) }} />
        {active && !connection && <ChatActivity label={active.label} avatar={<div className="border-border flex size-[34px] shrink-0 items-center justify-center overflow-hidden rounded-full border"><img src={demoAgentImage} alt={c('Market Brief', '市场简报')} className="size-[34px]" /></div>} />}
      </div>
      {connection && <div className="pv-chat-workbench-body text-muted-foreground flex items-center gap-2 text-sm"><NeutralChatActivityIcon /><span className="shimmer-neutral">{c('Reconnecting…', '正在重新连接…')}</span></div>}
      </div>
    </ChatExample>
    <div className="pv-chat-ui-grid">
      <ChatExample title={c('Loading conversation history', '加载会话历史')}><ClawSpinner label={c('Loading messages', '正在加载消息')} /></ChatExample>
      <ChatExample title={c('Preparing the first greeting', '初始化与首次问候')}><div className="flex flex-col items-center gap-3"><ClawSpinner showLabel={false} /><p className="text-muted-foreground text-sm">{c('Setting things up for you...', '正在为你准备...')}</p></div></ChatExample>
      <ChatExample title={c('Compact activity indicator', '紧凑状态指示')}><div role="status" className="text-ecap-preview-loading-text flex items-center gap-2 text-xs"><NeutralChatActivityIcon /><span className="shimmer-neutral">{c('Thinking…', '正在思考…')}</span></div></ChatExample>
    </div>
  </>
}
