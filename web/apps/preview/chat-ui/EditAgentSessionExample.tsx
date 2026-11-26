import { useEffect, useRef, useState } from 'react'
import { Avatar, AvatarFallback, Button, ProductSendIcon } from '@zooclaw/zooworkdesign'
import { AssistantMessage, ChatActivity, ChatComposer, ChatShell, ReplyArrowIcon, UserMessage, getProductComposerPresentation, truncateQuoteText, type AttachmentView, type RichTextInputHandle } from './source'
import { ComposerAddMenuExample } from './ComposerAddMenuExample'
import { ComposerModelExample } from '../ChatComposerExamples'
import { demoAgentImage, demoImage, useChatCopy } from './shared'
import { AttachmentPreviewDialog, PreviewAttachments, previewReport } from './PreviewAttachments'

interface PreviewUpload {
  id: string
  name: string
  url: string
  pendingMarkdown: string
  markdown: string
  kind: 'image' | 'file'
  mimeType: string
  size?: number
}
interface PreviewTurn {
  id: string
  role: 'user' | 'assistant'
  text: string
  attachments?: AttachmentView[]
  timestamp: number
}

/** Product components with local conversation/upload callbacks; no network or model requests. */
export function EditAgentSessionExample() {
  const { c, labels } = useChatCopy()
  const editor = useRef<RichTextInputHandle>(null)
  const transcript = useRef<HTMLDivElement>(null)
  const sequence = useRef(0)
  const uploads = useRef<PreviewUpload[]>([])
  const ownedUrls = useRef(new Set<string>())
  const [draft, setDraft] = useState('')
  const [quote, setQuote] = useState('')
  const [pending, setPending] = useState<PreviewUpload[]>([])
  const [turns, setTurns] = useState<PreviewTurn[]>([])
  const [thinking, setThinking] = useState(false)
  const [preview, setPreview] = useState<AttachmentView | null>(null)
  const [notice, setNotice] = useState('')
  const greeting = c(
    'Hi! I’m Market Brief. I can help with daily market briefs, company and industry research, earnings previews, and watchlist scans.\n\nTry asking: “Give me today’s market brief” or “Research the key variables before NVDA earnings.”',
    '哈喽！我是 Market Brief，可以帮你做每日市场简报、个股／行业研究、财报前瞻、催化剂日历和自选股扫描。\n\n比如你可以直接说：“给我今天的美股市场简报”或“研究一下 NVDA 财报前的关键变量”。',
  )
  const uploading = pending.filter(image => draft.includes(image.pendingMarkdown))
  useEffect(() => {
    const urls = ownedUrls.current
    return () => { for (const url of urls) URL.revokeObjectURL(url) }
  }, [])
  const revealLatest = () => requestAnimationFrame(() => {
    const log = transcript.current
    if (log) log.scrollTop = log.scrollHeight
  })
  const queueAttachment = (url: string, filename: string, kind: 'image' | 'file', mimeType: string, size?: number) => {
    const name = filename.replace(/[[\]\r\n]/g, '') || 'image.png'
    const id = `edit-agent-attachment-${++sequence.current}`
    const prefix = kind === 'image' ? '!' : ''
    const upload = { id, name, url, kind, mimeType, size, pendingMarkdown: `${prefix}[${name}](uploading:${id})`, markdown: `${prefix}[${name}](${url})` }
    uploads.current.push(upload)
    setPending(current => [...current, upload])
    setDraft(current => `${current}${current && !/\s$/.test(current) ? ' ' : ''}${upload.pendingMarkdown}`)
    requestAnimationFrame(() => editor.current?.focusAtEnd())
  }
  const attachFiles = (files: File[]) => {
    for (const file of files) {
      const url = URL.createObjectURL(file)
      ownedUrls.current.add(url)
      queueAttachment(url, file.name, file.type.startsWith('image/') ? 'image' : 'file', file.type || 'application/octet-stream', file.size)
    }
  }
  const finishUpload = () => {
    setDraft(current => pending.reduce((text, image) => text.replaceAll(image.pendingMarkdown, image.markdown), current))
    setPending([])
    requestAnimationFrame(() => editor.current?.focusAtEnd())
  }
  const reply = (text: string) => {
    setQuote(text)
    requestAnimationFrame(() => editor.current?.focus())
  }
  const send = (value: string) => {
    if (uploading.length || thinking || !value.trim()) return
    let text = value
    const attachments: AttachmentView[] = []
    for (const item of uploads.current) {
      if (!text.includes(item.markdown)) continue
      attachments.push({ id: item.id, kind: item.kind, name: item.name, url: item.url, mimeType: item.mimeType, size: item.size, previewable: item.kind === 'file' })
      text = text.replace(item.markdown, '')
    }
    const body = text.trim()
    setTurns(current => [...current, {
      id: `edit-agent-turn-${++sequence.current}`, role: 'user', timestamp: Date.now(), attachments,
      text: quote ? `> ${truncateQuoteText(quote).replace(/\n/g, '\n> ')}\n\n${body}` : body,
    }])
    setDraft('')
    setQuote('')
    setThinking(true)
    revealLatest()
  }
  const completeResponse = () => {
    if (!thinking) return
    setTurns(current => [...current, {
      id: `edit-agent-turn-${++sequence.current}`, role: 'assistant', timestamp: Date.now(),
      text: c('Preview response complete. Your message and attachments are shown above, with the same message components used in the product.', '示例回复已完成。上方的消息与附件由产品使用的同一套消息组件展示。'),
    }])
    setThinking(false)
    revealLatest()
  }
  const avatar = <img src={demoAgentImage} alt={c('Market Brief avatar', '市场简报头像')} className="size-[34px] object-cover" />
  const assistant = (turn: PreviewTurn) => <AssistantMessage key={turn.id}
    view={{ id: turn.id, kind: 'normal', text: turn.text, timestamp: turn.timestamp, botName: 'Market Brief', hideSenderHeader: true, isStreaming: false }}
    slots={{ avatar }} onQuoteReply={reply} />

  return <section aria-label={c('Edit Agent chat session', '编辑智能体聊天会话')} className="min-w-0">
    <h3 className="mb-3 text-base font-medium">{c('Edit Agent · chat session', '编辑智能体 · 聊天会话')}</h3>
    <p className="pv-platform-note">{c('Use + to select local files, or insert a sample below. Complete uploads before sending; hover messages for Copy / Reply.', '通过加号选择本地文件，或插入下方示例。完成上传后发送；悬停消息可复制或引用。')}</p>
    <div className="pv-chat-session-controls">
      <div><span>{c('Sample content', '示例内容')}</span>
        <Button variant="outline" size="sm" disabled={thinking} onClick={() => queueAttachment(demoImage, 'preview-image.png', 'image', 'image/png')}>{c('Add sample image', '添加示例图片')}</Button>
        <Button variant="outline" size="sm" disabled={thinking} onClick={() => queueAttachment(previewReport.url!, previewReport.name, 'file', previewReport.mimeType, previewReport.size)}>{c('Add sample document', '添加示例文件')}</Button>
      </div>
      <div><span>{c('Preview controls', '演示控制')}</span>
        {uploading.length > 0 && <Button variant="outline" size="sm" onClick={finishUpload}>{c('Complete uploads', '完成上传')}</Button>}
        {thinking && <Button variant="outline" size="sm" onClick={completeResponse}>{c('Complete preview response', '完成示例回复')}</Button>}
        <Button variant="ghost" size="sm" onClick={() => { setDraft(''); setQuote(''); setPending([]); setTurns([]); setThinking(false); setNotice(''); setPreview(null); uploads.current = []; for (const url of ownedUrls.current) URL.revokeObjectURL(url); ownedUrls.current.clear() }}>{c('Reset conversation', '重置会话')}</Button>
      </div>
    </div>
    <div className="max-w-[920px] overflow-hidden rounded-xl border border-border">
      <ChatShell className="h-[640px]! min-h-0"
        thread={<div ref={transcript} role="log" aria-label={c('Edit Agent messages', '编辑智能体消息')} aria-live="polite" className="min-h-0 flex-1 space-y-6 overflow-y-auto px-6 pt-7 pb-6">
          {assistant({ id: 'edit-agent-greeting', role: 'assistant', text: greeting, timestamp: Date.UTC(2026, 9, 15, 10, 33) })}
          {turns.map(turn => turn.role === 'assistant' ? assistant(turn) : <UserMessage key={turn.id}
            view={{ id: turn.id, text: turn.text, timestamp: turn.timestamp, senderLabel: c('You', '你'), actionText: turn.text || turn.attachments?.map(item => item.name).join(', ') }}
            slots={{
              avatar: <Avatar className="size-[34px]"><AvatarFallback className="from-ecap-success-border to-ecap-success-text bg-gradient-to-br text-[11px] font-semibold text-white">L</AvatarFallback></Avatar>,
              attachments: turn.attachments?.length ? <PreviewAttachments items={turn.attachments} onPreview={setPreview} /> : undefined,
            }} />)}
          {thinking && <ChatActivity label={c('Thinking…', '正在思考…')} avatar={<div className="border-border flex size-[34px] shrink-0 items-center justify-center overflow-hidden rounded-full border">{avatar}</div>} />}
        </div>}
        composer={<div className="pv-chat-composer-demo"><ChatComposer {...getProductComposerPresentation('session')} value={draft} onChange={setDraft}
          editorCommandRef={editor} inputAriaLabel={c('Edit Agent message', '编辑智能体消息输入框')}
          labels={{ ...labels, inputPlaceholder: c('Tell the Agent what to improve...', '告诉智能体需要改进什么…'), send: c('Send to preview agent', '发送给示例智能体'), stop: c('Stop preview response', '停止示例回复') }}
          getUploadPreview={url => uploads.current.find(item => item.kind === 'image' && `uploading:${item.id}` === url)?.url}
          isUploading={uploading.length > 0} submitDisabled={uploading.length > 0 || !draft.trim()} isGenerating={thinking}
          onAttachFiles={attachFiles} onSubmit={({ value }) => send(value)} onStop={() => setThinking(false)}
          quote={quote ? { label: c('Reply', '回复'), text: quote, clearLabel: c('Clear reply', '清除引用'), icon: <ReplyArrowIcon /> } : undefined} onClearQuote={() => setQuote('')}
          attachmentAction={props => <ComposerAddMenuExample {...props} triggerLabel={c('Add files to Edit Agent message', '为编辑智能体消息添加文件')}
            recentFiles={[{ id: 'preview-image', name: 'preview-image.png', status: 'ready' }, { id: 'preview-report', name: previewReport.name, status: 'ready' }]}
            onAttach={file => file.id === 'preview-image' ? queueAttachment(demoImage, file.name, 'image', 'image/png') : queueAttachment(previewReport.url!, file.name, 'file', previewReport.mimeType, previewReport.size)} onInsert={text => editor.current?.insertMarkdown(text, { ensureBoundarySpaces: true })} onAction={setNotice} />}
          toolbarEndAction={<ComposerModelExample surface="session" />} submitIcon={<ProductSendIcon />} sendButtonVariant="default" /></div>}
      />
    </div>
    {notice && <p role="status" className="pv-platform-note">{notice}</p>}
    <AttachmentPreviewDialog view={preview} onClose={() => setPreview(null)} />
  </section>
}
