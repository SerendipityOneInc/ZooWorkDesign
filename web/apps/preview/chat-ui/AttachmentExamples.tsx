import { useState } from 'react'
import { Button, ProductSendIcon } from '@zooclaw/zooworkdesign'
import { AttachmentChip, AudioAttachment, ChatComposer, UserMessage, VideoAttachment, getProductComposerPresentation, type AttachmentView, type ChatUiAttachment } from './source'
import { ChatExample, ChatSection, demoAudio, demoVideo, useChatCopy } from './shared'
import { AttachmentPreviewDialog, PreviewAttachments, previewCsv, previewImage, previewReport } from './PreviewAttachments'
import { CHAT_UI_COMPONENTS } from './registry'

function AttachmentComparison({ view, onPreview }: { view: AttachmentView; onPreview: (view: AttachmentView) => void }) {
  const { c, labels } = useChatCopy()
  const image = view.kind === 'image'
  const markdown = `${image ? '!' : ''}[${view.name}](${view.url})`
  const [draft, setDraft] = useState(markdown)
  const [sent, setSent] = useState({ text: '', items: [view], timestamp: Date.UTC(2026, 9, 15, 10, 33) })
  return <ChatExample title={image ? c('Image', '图片') : c('Document', '文件')}
    description={image ? c('An inline thumbnail becomes a small image in the sent message. Hover the chip to enlarge it.', '输入框里的缩略图，发送后显示为消息小图；悬停芯片可放大查看。') : c('The editor file reference becomes a file tile in the sent message.', '输入框里的文件引用，发送后显示为带文件名与类型的附件。')}>
    <div className="pv-chat-comparison">
      <div><h4>{c('Before sending', '发送前')}</h4><ChatComposer {...getProductComposerPresentation('session', { content: 'px-0' })} value={draft} onChange={setDraft} labels={{ ...labels, send: image ? c('Send image example', '发送图片示例') : c('Send document example', '发送文件示例') }}
        inputAriaLabel={image ? c('Image before sending', '发送前的图片') : c('Document before sending', '发送前的文件')} attachmentAction={() => null}
        submitIcon={<ProductSendIcon />} sendButtonVariant="default" onSubmit={({ value }) => {
          setSent({ text: value.replace(markdown, '').trim(), items: value.includes(markdown) ? [view] : [], timestamp: Date.now() }); setDraft('')
        }} /><Button variant="ghost" size="sm" onClick={() => setDraft(markdown)}>{c('Restore sample', '恢复示例')}</Button></div>
      <div><h4>{c('After sending', '发送后')}</h4><div className="pv-chat-sent-attachment"><UserMessage view={{ id: `attachment-${view.id}`, text: sent.text, actionText: sent.text || sent.items.map(item => item.name).join(', '), timestamp: sent.timestamp, senderLabel: c('You', '你') }}
        slots={{ attachments: sent.items.length ? <PreviewAttachments items={sent.items} onPreview={onPreview} /> : undefined }} /></div></div>
    </div>
  </ChatExample>
}

export function ChatAttachmentExamples() {
  const { c, labels } = useChatCopy()
  const [audio] = useState(demoAudio)
  const [preview, setPreview] = useState<AttachmentView | null>(null)
  const initialChips: ChatUiAttachment[] = [
    { id: 'ready', name: previewReport.name, size: previewReport.size, status: 'ready', canOpen: true },
    { id: 'uploading', name: 'sources.csv', status: 'uploading' },
    { id: 'error', name: 'notes.txt', status: 'error', canRetry: true },
  ]
  const [chips, setChips] = useState(initialChips)
  return <ChatSection id="chat-attachments" title={c('Files & images', '文件与图片')}
    description={c('Compare the same attachment before and after sending, then inspect upload states and media players. Use the complete conversation to add your own files.', '对照同一附件发送前后的样子，再查看上传状态与媒体播放器。添加自己的文件可使用完整会话演示。')} components={CHAT_UI_COMPONENTS['chat-attachments']}>
    <AttachmentComparison view={previewImage} onPreview={setPreview} />
    <AttachmentComparison view={previewReport} onPreview={setPreview} />
    <ChatExample title={c('Upload states', '上传状态')} description={c('Ready, uploading and failed. Remove or retry an attachment to inspect the result.', '就绪、上传中和失败。可以移除或重试附件查看结果。')}>
      <div className="pv-chat-upload-states">{chips.map(attachment => <div key={attachment.id}><span className="pv-chat-state-label">{attachment.status === 'ready' ? c('Ready', '就绪') : attachment.status === 'uploading' ? c('Uploading', '上传中') : c('Failed', '失败')}</span>
        <AttachmentChip attachment={attachment} labels={labels} onOpen={() => setPreview(previewReport)} onRemove={id => setChips(current => current.filter(item => item.id !== id))} onRetry={id => setChips(current => current.map(item => item.id === id ? { ...item, status: 'ready' } : item))} />
      </div>)}</div><Button variant="ghost" size="sm" onClick={() => setChips(initialChips)}>{c('Reset attachments', '重置附件')}</Button>
    </ChatExample>
    <ChatExample title={c('Multiple attachments', '多个附件')} description={c('Image and file attachments share a row, keeping their product sizes and scrolling when space is limited.', '图片与文件使用同一附件行，保持产品尺寸；空间不足时可横向滚动。')}>
      <div className="pv-chat-attachment-row"><PreviewAttachments items={[previewImage, previewReport, previewCsv]} onPreview={setPreview} align="start" /></div>
    </ChatExample>
    <div><h3 className="pv-chat-group-title">{c('Other media', '其他媒体')}</h3><div className="pv-chat-ui-grid">
      <ChatExample title={c('Audio', '音频')}><AudioAttachment view={{ id: 'audio', kind: 'audio', name: c('Audio summary', '音频摘要'), url: audio, mimeType: 'audio/wav' }} /></ChatExample>
      <ChatExample title={c('Video', '视频')}><VideoAttachment view={{ id: 'video', kind: 'video', name: c('Sample clip', '示例视频'), url: demoVideo, mimeType: 'video/mp4' }} onPreview={setPreview} /></ChatExample>
    </div></div>
    <p className="pv-chat-next-link"><a href="#chat-session">{c('Add files and images in the complete conversation', '在完整会话中添加文件与图片')} ↗</a></p>
    <AttachmentPreviewDialog view={preview} onClose={() => setPreview(null)} />
  </ChatSection>
}
