import { useEffect, useRef, useState } from 'react'
import { ArrowPathIcon, DocumentTextIcon, MagnifyingGlassIcon, SparklesIcon } from '@heroicons/react/24/outline'
import { Avatar, AvatarFallback, Badge, Button, Checkbox, ProductSendIcon } from '@zooclaw/zooworkdesign'
import { AssistantMessage, ChatActivity, ChatComposer, UserMessage, getProductComposerPresentation, type ChatUiAttachment } from '@zooclaw/zooworkdesign-chat'
import { ChatPreviewProvider, demoAgentImage, useChatCopy } from '../chat-ui/shared'

type Turn = { id: string; role: 'user' | 'assistant'; text?: string }

/** A consumer composition of the public components; responses and file metadata stay local. */
export function HomeAgentDemo() {
  const { c, labels } = useChatCopy()
  const [scenario, setScenario] = useState(0)
  const [draft, setDraft] = useState('')
  const [turns, setTurns] = useState<Turn[]>([])
  const [thinking, setThinking] = useState(false)
  const [stopped, setStopped] = useState(false)
  const [attachments, setAttachments] = useState<ChatUiAttachment[]>([])
  const [checked, setChecked] = useState([true, false, false])
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const sequence = useRef(0)
  const transcript = useRef<HTMLDivElement>(null)
  const scenarios = [
    { title: c('Product launch', '产品发布'), icon: SparklesIcon,
      prompt: c('Help me turn our launch notes into a clear plan.', '帮我把产品发布笔记，整理成清晰的行动计划。'),
      response: c('Here’s a starting point. Three small steps to get your next idea out into the world.', '我把发布准备整理成了三个小步骤。先把最重要的事做好，再让想法被更多人看见。'),
      tasks: [c('Define the first release', '明确首版范围'), c('Try the complete experience', '走通完整体验'), c('Share it with your first users', '分享给第一批用户')] },
    { title: c('Research notes', '研究整理'), icon: MagnifyingGlassIcon,
      prompt: c('How can I make sense of my user interviews?', '怎么把用户访谈整理成有用的结论？'),
      response: c('Start with what people are trying to do. Then connect their friction points to a small experiment.', '先记录用户想完成的事，再把遇到的阻碍，变成可以验证的小实验。'),
      tasks: [c('Group recurring observations', '归纳重复出现的观察'), c('Find the most common friction', '找到最常见的阻碍'), c('Choose one idea to test', '选择一个想法验证')] },
    { title: c('Weekly planning', '任务规划'), icon: DocumentTextIcon,
      prompt: c('Help me make room for focused work this week.', '帮我安排这一周，留出一些专注工作的时间。'),
      response: c('Keep the plan light. Choose one outcome, protect time for it, and leave space to review.', '计划可以轻一点：确定一个结果，留出完整的时间，再给复盘留一点空间。'),
      tasks: [c('Choose this week’s outcome', '确定本周最重要的结果'), c('Reserve a focus block', '预留一段专注时间'), c('Review what you learned', '回顾收获与调整')] },
  ]
  const current = scenarios[scenario]
  const cancelPending = () => {
    if (timer.current) clearTimeout(timer.current)
    timer.current = null
  }
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current) }, [])
  useEffect(() => {
    if (!turns.length) return
    const log = transcript.current
    if (log) log.scrollTop = log.scrollHeight
  }, [turns, thinking])
  const reset = (next = scenario) => {
    cancelPending()
    setScenario(next); setTurns([]); setDraft(''); setThinking(false)
    setStopped(false); setAttachments([]); setChecked([true, false, false])
    if (transcript.current) transcript.current.scrollTop = 0
  }
  const send = (value: string) => {
    if (thinking || (!value.trim() && !attachments.length)) return
    const text = [value.trim(), attachments.map(file => file.name).join(', ')].filter(Boolean).join('\n')
    setTurns(previous => [...previous, { id: `home-user-${++sequence.current}`, role: 'user', text }])
    setDraft(''); setAttachments([]); setThinking(true); setStopped(false)
    timer.current = setTimeout(() => {
      setTurns(previous => [...previous, { id: `home-agent-${++sequence.current}`, role: 'assistant' }])
      setThinking(false); timer.current = null
    }, 1400)
  }
  const avatar = <img src={demoAgentImage} alt="" className="size-[34px] object-cover" />
  const timestamp = Date.UTC(2026, 10, 11, 1, 41)
  return <ChatPreviewProvider>
    <div className="home-workspace">
      <aside className="home-demo-sidebar" aria-label={c('Example conversations', '示例会话')}>
        <div className="home-workspace-name"><span className="home-workspace-monogram">W</span><span>{c('Your workspace', '你的工作台')}<small>{c('Made with ZooWork', '使用 ZooWork 搭建')}</small></span></div>
        <p className="home-sidebar-caption">{c('TRY A CONVERSATION', '试试这些会话')}</p>
        <div className="home-demo-scenarios">{scenarios.map((item, index) => <Button key={index} variant="ghost" onClick={() => reset(index)} aria-pressed={scenario === index} className="home-scenario"><item.icon />{item.title}</Button>)}</div>
        <div className="home-sidebar-bottom"><span className="home-demo-status-dot" />{c('Your idea, your interface.', '你的想法，你的界面。')}</div>
      </aside>
      <section className="home-demo-conversation" aria-label={c('Interactive agent demo', '智能体交互演示')}>
        <header className="home-demo-top"><div><span>{current.title}</span><Badge variant="secondary">{c('Demo', '演示')}</Badge></div><Button size="icon-sm" variant="ghost" onClick={() => reset()} aria-label={c('Reset demo', '重置演示')} title={c('Reset demo', '重置演示')}><ArrowPathIcon /></Button></header>
        <div ref={transcript} className="home-demo-transcript" role="log" aria-live="polite" aria-label={c('Demo messages', '演示消息')}>
          <UserMessage view={{ id: 'home-opening', text: current.prompt, timestamp, senderLabel: c('You', '你') }} slots={{ avatar: <Avatar className="size-[30px]"><AvatarFallback>Y</AvatarFallback></Avatar> }} />
          <AssistantMessage view={{ id: 'home-greeting', kind: 'normal', text: current.response, timestamp, isStreaming: false, botName: c('Workspace assistant', '工作台助手'), hideSenderHeader: true }} slots={{ avatar,
            ermpCards: <div className="home-task-list"><div className="home-task-list-title"><span>{c('Next steps', '下一步')}</span><span>{checked.filter(Boolean).length}/3</span></div>{current.tasks.map((task, index) => <label key={index} className="home-task-row"><Checkbox checked={checked[index]} onCheckedChange={value => setChecked(previous => previous.map((item, at) => at === index ? value === true : item))} /><span className={checked[index] ? 'home-task-done' : undefined}>{task}</span></label>)}</div>,
          }} />
          {turns.map(turn => turn.role === 'user' ? <UserMessage key={turn.id} view={{ id: turn.id, text: turn.text!, timestamp, senderLabel: c('You', '你') }} /> : <AssistantMessage key={turn.id} view={{ id: turn.id, kind: 'normal', text: c('Your message is here. Connect your own agent to bring this conversation to life — this reply is a local demo.', '你的消息已显示在会话中。接入自己的 Agent，就可以在这里继续对话；这是一条本地演示回复。'), timestamp, isStreaming: false, hideSenderHeader: true }} slots={{ avatar }} />)}
          {thinking && <ChatActivity label={c('Preparing a demo reply…', '正在生成演示回复…')} avatar={avatar} />}
          {stopped && <p className="home-demo-stopped" role="status">{c('Demo reply stopped. Send another message to try again.', '已停止演示回复，可以再发一条消息。')}</p>}
        </div>
        <ChatComposer {...getProductComposerPresentation('session', { root: 'home-demo-composer', content: 'px-4' })}
          value={draft} onChange={setDraft} onSubmit={({ value }) => send(value)} inputAriaLabel={c('Try the message composer', '试用消息输入框')}
          labels={{ ...labels, inputPlaceholder: c('Try a message of your own…', '输入一句话，试试你的想法…') }}
          isGenerating={thinking} submitDisabled={!draft.trim() && !attachments.length} onStop={() => { cancelPending(); setThinking(false); setStopped(true) }}
          attachments={attachments} onAttachFiles={files => setAttachments(previous => [...previous, ...files.map(file => ({ id: `home-file-${++sequence.current}`, name: file.name, size: file.size, mimeType: file.type, status: 'ready' as const }))])}
          onRemoveAttachment={id => setAttachments(previous => previous.filter(file => file.id !== id))}
          toolbarEndAction={<span className="home-demo-model">{c('Demo agent', '示例 Agent')}</span>} submitIcon={<ProductSendIcon />} sendButtonVariant="default" />
        <p className="home-demo-footnote">{c('Interactive demo. Messages and files stay in your browser.', '交互演示，消息和文件均保留在当前浏览器中。')}</p>
      </section>
    </div>
  </ChatPreviewProvider>
}
