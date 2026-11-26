import { useState } from 'react'
import { Avatar, AvatarFallback, Segmented } from '@zooclaw/zooworkdesign'
import { AssistantMessage, UserMessage, type AttachmentView } from './source'
import { ChatExample, ChatSection, demoAgentImage, useChatCopy } from './shared'
import { AttachmentPreviewDialog, PreviewAttachments, previewCsv, previewImage, previewReport } from './PreviewAttachments'
import { CHAT_UI_COMPONENTS } from './registry'

export function ChatMessageExamples() {
  const { c } = useChatCopy()
  const [state, setState] = useState('complete')
  const [reply, setReply] = useState('')
  const [preview, setPreview] = useState<AttachmentView | null>(null)
  const time = Date.UTC(2026, 9, 15, 10, 33)
  const samples = [
    { id: 'text', title: c('Text', '纯文字'), description: c('The standard user message bubble.', '用户发送后的标准文字气泡。'), text: c('Summarize the market trends and include your sources.', '总结市场趋势，并附上信息来源。'), attachments: [] },
    { id: 'image', title: c('Image only', '单张图片'), description: c('A small image without an empty text bubble.', '仅显示图片，不生成空的文字气泡。'), text: '', attachments: [previewImage] },
    { id: 'image-text', title: c('Image with text', '图片与文字'), description: c('The image and its message stay together.', '图片与对应的文字保持在同一条消息中。'), text: c('Use this image as a reference.', '请以这张图片作为参考。'), attachments: [previewImage] },
    { id: 'document', title: c('Document', '文件消息'), description: c('File name, extension and a preview action.', '显示文件名和类型，点击可预览。'), text: '', attachments: [previewReport] },
    { id: 'multiple', title: c('Multiple attachments', '多个附件'), description: c('Images and documents in one attachment row.', '图片与文件排列在同一个附件行中。'), text: c('Compare the report with these sources.', '结合这些来源对照报告。'), attachments: [previewImage, previewReport, previewCsv] },
    { id: 'quoted', title: c('Quoted reply', '引用回复'), description: c('The quoted context appears above the message.', '引用内容显示在回复文字上方。'), text: c('> Focus on the past week.\n\nPlease expand on the second finding.', '> 重点关注过去一周。\n\n请展开说明第二项发现。'), attachments: [] },
  ]
  return <ChatSection id="chat-messages" title={c('Message types', '消息形态')}
    description={c('Compare messages after they are sent. These are the product message components, with labeled examples for each content type.', '对照查看消息发送后的样子。每种内容都有独立标注，均使用产品的消息组件。')} components={CHAT_UI_COMPONENTS['chat-messages']}>
    <div><h3 className="pv-chat-group-title">{c('Sent user messages', '用户发送后的消息')}</h3>
      <div role="region" aria-label={c('Sent message examples', '发送后的消息示例')} className="pv-chat-message-grid">
        {samples.map(sample => <ChatExample key={sample.id} title={sample.title} description={sample.description}>
          <div className="pv-chat-message-canvas"><UserMessage view={{ id: `sent-${sample.id}`, text: sample.text, actionText: sample.text || sample.attachments.map(item => item.name).join(', '), timestamp: time, senderLabel: c('You', '你') }}
            slots={{ avatar: <Avatar className="size-[34px]"><AvatarFallback className="from-ecap-success-border to-ecap-success-text bg-gradient-to-br text-[11px] font-semibold text-white">L</AvatarFallback></Avatar>, attachments: sample.attachments.length ? <PreviewAttachments items={sample.attachments} onPreview={setPreview} /> : undefined }} />
          </div>
        </ChatExample>)}
      </div>
    </div>
    <ChatExample title={c('Agent replies', '智能体回复')} description={c('Switch between a complete reply, streaming output and a failed reply. Expand the thinking block or hover to copy and reply.', '切换完成、输出中和失败状态。可展开思考过程，或悬停进行复制与引用。')}>
      <div className="pv-chat-workbench">
        <div className="pv-chat-workbench-controls"><Segmented value={state} onValueChange={setState} aria-label={c('Message state', '消息状态')} options={[
          { value: 'complete', label: c('Complete', '完成') }, { value: 'streaming', label: c('Streaming', '输出中') }, { value: 'error', label: c('Error', '错误') },
        ]} /></div>
        <div className="pv-chat-workbench-body"><AssistantMessage view={{ id: 'assistant-example', kind: 'normal', text: state === 'error' ? c('The connection was interrupted. Please try again.', '连接中断，请重试。') : c('Three themes stand out this week: faster delivery, deeper domain expertise, and clearer evaluation criteria.', '本周有三个突出趋势：更快的交付、更深入的领域知识，以及更清晰的评估标准。'), timestamp: time + 12000, botName: 'Market Brief', hideSenderHeader: true, isStreaming: state === 'streaming', isThreadRunning: state === 'streaming', presentation: state === 'error' ? 'error' : 'answer', thinkingBlocks: state === 'error' ? [] : [c('Comparing the available sources and grouping recurring themes.', '正在比较现有来源，并整理反复出现的主题。')], showFooter: true }} slots={{ avatar: <img src={demoAgentImage} alt="Market Brief" className="size-[34px]" /> }} onQuoteReply={setReply} /></div>
      </div>
      {reply && <p role="status" className="pv-chat-ui-result">{c('Reply selected:', '已选择引用：')} {reply} <a href="#chat-session">{c('Try replying in the conversation', '在完整会话中体验引用')} ↗</a></p>}
    </ChatExample>
    <AttachmentPreviewDialog view={preview} onClose={() => setPreview(null)} />
  </ChatSection>
}
