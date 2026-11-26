import { EditAgentSessionExample } from './EditAgentSessionExample'
import { ChatThread } from './source'
import { ChatSection, useChatCopy } from './shared'
import { CHAT_UI_COMPONENTS } from './registry'

export function ChatSessionExamples() {
  const { c, labels } = useChatCopy()
  return <ChatSection id="chat-session" title={c('Complete conversation', '完整会话演示')}
    description={c('Try the complete flow: compose, attach, upload, send, reply and stop. Sample actions run locally so you can inspect every state.', '体验编辑、添加附件、上传、发送、引用与停止的完整流程。示例在本地运行，便于停留查看每个状态。')} components={CHAT_UI_COMPONENTS['chat-session']}>
    <EditAgentSessionExample />
    <details className="pv-chat-ui-source"><summary>{c('Basic message list · ChatThread', '基础消息列表 · ChatThread')}</summary>
      <div className="pv-chat-thread-example"><ChatThread labels={labels} messages={[
        { id: 'thread-user', role: 'user', content: c('Summarize this report.', '总结这份报告。'), status: 'complete' },
        { id: 'thread-assistant', role: 'assistant', content: c('Here are the key findings and next steps.', '以下是主要发现与后续步骤。'), status: 'complete' },
      ]} /></div>
    </details>
  </ChatSection>
}
