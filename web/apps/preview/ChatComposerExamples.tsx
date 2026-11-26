import { useRef, useState } from 'react'
import { Button, ProductSendIcon, Segmented } from '@zooclaw/zooworkdesign'
import { ChatComposer, getProductComposerPresentation, ReplyArrowIcon, NeutralChatActivityIcon, truncateQuoteText, type RichTextInputHandle, type ChatUiAttachment } from './chat-ui/source'
import { ComposerAddMenuExample } from './chat-ui/ComposerAddMenuExample'
import { ChatExample, ChatSection, useChatCopy } from './chat-ui/shared'
import { ComposerModelExample } from './chat-ui/ModelEffortExample'
export { ComposerModelExample } from './chat-ui/ModelEffortExample'

export function ChatComposerExamples() {
  const { c, labels } = useChatCopy()
  const [draft, setDraft] = useState('')
  const [sent, setSent] = useState('')
  const [mode, setMode] = useState('ready')
  const [quote, setQuote] = useState(false)
  const editorRef = useRef<RichTextInputHandle>(null)
  const [notice, setNotice] = useState('')
  const [attachments, setAttachments] = useState<ChatUiAttachment[]>([])
  return <ChatSection id="chat-composer" title={c('Chat composer', '聊天输入框')}
    description={c('The actual product composer, including its rich editor, attachment handling, quote, model picker and send/stop controls. Try the different conversation states.',
      '直接使用产品的聊天输入框，包含富文本编辑器、附件、引用、模型选择及发送／停止控件。可切换不同会话状态体验。')}
    components={['ChatComposer', 'RichTextInput', 'ComposerAddMenu']}>
    <ChatExample title={c('Input states', '输入框状态')} description={c('Inspect the editor and toolbar here. For files, images and sent messages, try the complete conversation.', '在这里查看编辑器与工具栏。添加文件、图片及发送结果可在完整会话中体验。')}>
    <div className="pv-chat-workbench">
    <div className="pv-chat-workbench-controls"><Segmented size="sm" value={mode} onValueChange={setMode} aria-label={c('Composer state', '输入框状态')} options={[
      { value: 'ready', label: c('Ready', '就绪') }, { value: 'running', label: c('Generating', '生成中') },
      { value: 'connection', label: c('Reconnecting', '重新连接') }, { value: 'disabled', label: c('Read only', '只读') },
    ]} /><Button variant="outline" size="sm" onClick={() => setQuote(true)}>{c('Add quote', '添加引用')}</Button>
      <Button variant="outline" size="sm" onClick={() => setAttachments([{ id: 'example', name: c('Weekly report.pdf', '周报.pdf'), size: 32768, status: 'ready' }])}>{c('Add sample file', '添加示例文件')}</Button></div>
    <div className="pv-chat-composer-demo"><ChatComposer {...getProductComposerPresentation('session')} value={draft} onChange={setDraft}
      editorCommandRef={editorRef}
      attachmentAction={props => <ComposerAddMenuExample {...props} onAttach={file => setAttachments(current => [...current.filter(item => item.id !== file.id), file])}
        onInsert={text => editorRef.current?.insertMarkdown(text, { ensureBoundarySpaces: true })} onAction={setNotice} />}
      labels={labels} inputAriaLabel={c('Message', '消息')} disabled={mode === 'disabled'} isGenerating={mode === 'running'}
      onSubmit={({ value }) => { setSent(quote ? `> ${truncateQuoteText(c('Please include the latest market trends.', '请包含最新的市场趋势。'))}\n\n${value}` : value); setDraft(''); setQuote(false); setMode('running') }} onStop={() => setMode('ready')}
      submitIcon={<ProductSendIcon />} sendButtonVariant="default" toolbarEndAction={<ComposerModelExample surface="session" disabled={mode === 'disabled'} />}
      attachments={attachments} onAttachFiles={files => setAttachments(current => [...current, ...files.map((file, index) => ({ id: `${file.name}-${index}`, name: file.name, size: file.size, status: 'ready' as const }))])}
      onRemoveAttachment={id => setAttachments(current => current.filter(file => file.id !== id))}
      quote={quote ? { text: c('Please include the latest market trends.', '请包含最新的市场趋势。'), label: c('Reply', '回复'), clearLabel: c('Clear reply', '清除引用'), icon: <ReplyArrowIcon /> } : undefined}
      onClearQuote={() => setQuote(false)} status={mode === 'connection' ? { kind: 'connection', text: c('Reconnecting. Your draft is safe.', '正在重新连接，草稿已保留。'), tone: 'neutral', icon: <NeutralChatActivityIcon />, textClassName: 'shimmer-neutral' } : undefined} />
      <p className="pv-platform-note">{c('Enter to send · Shift + Enter for a new line. Files and messages stay in this preview.', 'Enter 发送 · Shift + Enter 换行。文件与消息仅在本页演示。')}</p>
      {notice && <p role="status">{notice}</p>}
      {sent && <ChatExample title={c('Last preview message', '最近的预览消息')}><p role="status">{sent}</p></ChatExample>}
    </div>
    </div></ChatExample>
    <p className="pv-chat-next-link"><a href="#chat-attachments">{c('Compare files before and after sending', '对照查看文件发送前后')} ↗</a><a href="#chat-session">{c('Try the complete conversation', '体验完整会话')} ↗</a></p>
  </ChatSection>
}
