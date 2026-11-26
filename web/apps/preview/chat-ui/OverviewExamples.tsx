import { usePreviewLocale } from '../locale'
import { ChatSection, useChatCopy } from './shared'
import { CHAT_UI_GROUPS } from './registry'

export function ChatOverviewExamples() {
  const { c } = useChatCopy()
  const { t } = usePreviewLocale()
  return <ChatSection id="chat-overview" title={c('Chat UI overview', '聊天组件总览')}
    description={c('Find a component by what it does, then try the complete conversation to see how the pieces work together.', '按用途查找组件，再通过完整会话查看它们如何配合。')} components={[]}>
    <div className="pv-chat-guide">
      {CHAT_UI_GROUPS.map(group => <nav key={group.title} aria-label={t(group.title)}>
        <h3>{t(group.title)}</h3><p>{t(group.description)}</p>
        {group.items.map(([id, label]) => <a key={id} href={`#${id}`}>{t(label)}<span aria-hidden="true">↗</span></a>)}
      </nav>)}
    </div>
    <div className="pv-chat-guide-note"><strong>{c('Follow the message', '顺着消息看完整流程')}</strong>
      <p>{c('Add text, files or images → inspect the upload state → send → view the message and Agent activity.', '输入文字、添加文件或图片 → 检查上传状态 → 发送 → 查看消息与智能体执行状态。')}</p>
      <a href="#chat-session">{c('Try the complete conversation', '体验完整会话')} ↗</a>
    </div>
  </ChatSection>
}
