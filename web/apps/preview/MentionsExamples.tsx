import { useRef, useState } from 'react'
import { AtSymbolIcon, CpuChipIcon, UserIcon } from '@heroicons/react/24/outline'
import { Button, ProductSendIcon, MentionText, getMentionRecipients, Segmented,
  type MentionOption, type MentionsLabels, type MentionsValue } from '@zooclaw/zooworkdesign'
import { usePreviewLocale } from './locale'
import { ConstructionHeading } from './ConstructionBadge'
import { ComposerModelExample } from './ChatComposerExamples'
import { ComposerAddMenuExample } from './chat-ui/ComposerAddMenuExample'
import { ChatComposer, ChatMentionsInput, getProductComposerPresentation, type ChatUiAttachment, type RichTextInputHandle } from './chat-ui/source'

const blank: MentionsValue = { text: '', mentions: [] }

export function MentionsExamples() {
  const { locale, t } = usePreviewLocale()
  const c = (en: string, zh: string) => locale === 'en' ? en : zh
  const input = useRef<HTMLDivElement>(null)
  const commands = useRef<RichTextInputHandle>(null)
  const [draft, setDraft] = useState<MentionsValue>(blank)
  const [sent, setSent] = useState<MentionsValue | null>(null)
  const [placement, setPlacement] = useState('bottom')
  const [mode, setMode] = useState('ready')
  const [detail, setDetail] = useState('')
  const [attachments, setAttachments] = useState<ChatUiAttachment[]>([])
  const labels: MentionsLabels = {
    suggestions: c('Mention an agent or teammate', '提及智能体或同事'), agents: c('Agents', '智能体'), people: c('Teammates', '同事'),
    empty: c('No matches. Try a name or role.', '没有匹配结果，试试姓名或职责。'), loading: c('Finding agents and teammates…', '正在查找智能体与同事…'),
    retry: c('Retry', '重试'), selected: c('Mentioned', '已提及'), hint: c('↑ ↓ Navigate · Enter Select · Esc Close', '↑ ↓ 选择 · Enter 确认 · Esc 关闭'),
  }
  const options: MentionOption[] = [
    { id: 'market-brief', kind: 'agent', label: c('Market Brief', '市场简报'), description: c('Research and daily market updates', '研究与每日市场动态'), keywords: ['market', 'research', '市场', '研究'] },
    { id: 'content-studio', kind: 'agent', label: c('Content Studio', '内容助手'), description: c('Writing, editing and content planning', '写作、编辑与内容策划'), keywords: ['content', 'writing', '内容', '写作'] },
    { id: 'data-analyst', kind: 'agent', label: c('Data Analyst', '数据分析师'), description: c('Metrics, trends and reports', '指标、趋势与报表'), keywords: ['data', 'analysis', '数据', '分析'] },
    { id: 'archive', kind: 'agent', label: c('Archive Assistant', '归档助手'), description: c('Unavailable in this session', '当前会话不可用'), disabled: true },
    { id: 'lynn', kind: 'person', label: 'Lynn', description: c('Product design · Teammate', '产品设计 · 同事'), keywords: ['design', '设计'] },
    { id: 'robin', kind: 'person', label: 'Robin', description: c('Engineering · Teammate', '工程开发 · 同事'), keywords: ['engineering', '开发'] },
  ]
  const recipients = getMentionRecipients(draft)
  const error = mode === 'error' ? c('Could not load suggestions.', '无法加载候选对象。') : undefined
  const send = () => {
    if (!draft.text.trim()) return
    setSent(draft)
    setDraft(blank)
    setDetail('')
    input.current?.focus()
  }
  const insertAt = () => {
    commands.current?.insertMarkdown('@', { ensureBoundarySpaces: true })
  }
  const fillExample = () => {
    let text = ''
    const mentions: MentionsValue['mentions'][number][] = []
    for (const option of [options[0], options[1], options[4]]) {
      const start = text.length
      text += `@${option.label}`
      mentions.push({ id: option.id, kind: option.kind, label: option.label, start, end: text.length })
      text += ' '
    }
    text += c('Please work together on the weekly report.', '请一起完成本周报告。')
    setDraft({ text, mentions })
    input.current?.focus()
  }
  return <section id="mentions" className="pv-section pv-platform-section">
    <ConstructionHeading title={t('Mentions')} />
    <p className="pv-sd">{c('Mentions belong to the chat composer. Type @ to find agents and teammates. Suggestions follow the caret; selected names become purple pills. Mention several recipients in the same message.',
      'Mention 是聊天输入框的能力。输入 @ 搜索智能体和同事，候选菜单跟随光标，选中的名称显示为紫色胶囊。一条消息可连续提及多个对象。')}</p>
    <div className="pv-mentions-toolbar">
      <Segmented size="sm" value={placement} onValueChange={setPlacement} aria-label={c('Suggestion placement', '候选列表位置')}
        options={[{ value: 'bottom', label: c('Below caret', '光标下方') }, { value: 'top', label: c('Above caret', '光标上方') }]} />
      <Button variant="outline" size="sm" onClick={fillExample}>{c('Try multiple mentions', '体验多人提及')}</Button>
      <Button variant="ghost" size="sm" onClick={() => { setDraft(blank); setSent(null); setMode('ready'); setDetail('') }}>{c('Reset', '重置')}</Button>
    </div>
    <div className="pv-mentions-demo">
      <div>
        <label id="mention-chat-label" className="pv-mentions-label" htmlFor="mention-chat">{c('Chat message', '聊天消息')}</label>
        <ChatComposer {...getProductComposerPresentation('session')} value={draft.text} onChange={() => undefined} onSubmit={send}
          sendButtonVariant="default" submitIcon={<ProductSendIcon />} submitDisabled={!draft.text.trim()}
          labels={{ send: c('Send preview message', '发送预览消息') }}
          attachments={attachments} onAttachFiles={files => setAttachments(current => [...current, ...files.map(file => ({ id: file.name, name: file.name, size: file.size, status: 'ready' as const }))])} onRemoveAttachment={id => setAttachments(current => current.filter(file => file.id !== id))}
          attachmentAction={props => <><ComposerAddMenuExample {...props} onAttach={file => setAttachments(current => [...current.filter(item => item.id !== file.id), file])}
            onInsert={text => commands.current?.insertMarkdown(text, { ensureBoundarySpaces: true })} onAction={setDetail} /><Button type="button" variant="ghost" size="sm" onClick={insertAt}><AtSymbolIcon />{c('Mention', '提及')}</Button></>}
          toolbarEndAction={<ComposerModelExample surface="session" />}
          renderEditor={editor => <ChatMentionsInput {...editor} editorAttributes={{ id: 'mention-chat', 'aria-describedby': 'mention-chat-help' }} inputRef={input} commandRef={commands} value={draft} onValueChange={setDraft}
            options={mode === 'empty' ? [] : options} labels={labels} ariaLabel={c('Chat message', '聊天消息')}
            placeholder={c('Ask a question. Type @ to mention someone…', '说说你的想法，输入 @ 提及智能体或同事…')}
            placement={placement as 'top' | 'bottom'} loading={mode === 'loading'} error={error} onRetry={() => setMode('ready')} />} />
        <p id="mention-chat-help" className="pv-platform-note">{c('Enter to send · Shift + Enter for a new line. Preview messages stay on this page.', 'Enter 发送 · Shift + Enter 换行。消息仅在本页预览。')}</p>
        <div className="pv-mentions-recipients" aria-label={c('Mentioned recipients', '已提及的对象')}>
          {recipients.length ? recipients.map(recipient => <span key={`${recipient.kind}:${recipient.id}`}>
            {recipient.kind === 'agent' ? <CpuChipIcon /> : <UserIcon />}{recipient.label}
          </span>) : <small>{c('Selected agents and teammates will appear here.', '选中的智能体和同事将在这里显示。')}</small>}
        </div>
        <div className="pv-mentions-sent" aria-live="polite">
          <h3>{c('Message preview', '消息预览')}</h3>
          {sent ? <><MentionText value={sent} onMentionClick={mention => setDetail(`${mention.label} · ${mention.kind === 'agent' ? c('Agent', '智能体') : c('Teammate', '同事')}`)} />
            <p className="pv-platform-note">{c(`${getMentionRecipients(sent).length} distinct recipients`, `共提及 ${getMentionRecipients(sent).length} 个不同对象`)}</p></> :
            <p className="pv-platform-note">{c('Send a message to see its inline mentions.', '发送消息后，可以在这里查看行内提及效果。')}</p>}
          {detail && <p className="pv-platform-note" role="status">{detail}</p>}
        </div>
      </div>
      <div className="pv-mentions-rules">
        <h3>{c('Candidate states', '候选列表状态')}</h3>
        <Segmented orientation="vertical" block size="sm" aria-label={c('Candidate state', '候选列表状态')} value={mode} onValueChange={setMode} options={[
          { value: 'ready', label: c('Available', '正常') }, { value: 'loading', label: c('Loading', '加载中') },
          { value: 'empty', label: c('No results', '无结果') }, { value: 'error', label: c('Load failed', '加载失败') },
        ]} />
        <p className="pv-platform-note">{c('Choose a state, then type @ in the message to inspect it.', '选择状态后，在消息中输入 @ 查看。')}</p>
        <h3>{c('Interaction rules', '交互规则')}</h3>
        <ul>
          <li>{c('Keep typing @ to add another agent or teammate.', '继续输入 @，可添加更多智能体或同事。')}</li>
          <li>{c('Use ↑ / ↓ and Enter to select. Escape closes the list; Tab moves on.', '↑ / ↓ 切换，Enter 确认。Esc 关闭列表，Tab 移至下一控件。')}</li>
          <li>{c('Backspace at the end of a mention removes it as a whole. Undo restores it.', '光标紧贴提及末尾时，Backspace 整体删除，撤销可恢复。')}</li>
          <li>{c('Names may match; identity comes from the selected record.', '名称可以相同，对象身份以选中的记录为准。')}</li>
        </ul>
      </div>
    </div>
    <pre className="pv-api-example"><code>{'<ChatComposer value={draft.text} onChange={onChange} onSubmit={send}\n  renderEditor={editor => <ChatMentionsInput {...editor}\n    value={draft} onValueChange={setDraft} options={candidates} />} />\n<MentionText value={message} onMentionClick={openProfile} />'}</code></pre>
  </section>
}
