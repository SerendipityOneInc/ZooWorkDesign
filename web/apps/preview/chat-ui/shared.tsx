import type { ReactNode } from 'react'
import { sourceAssets } from '@zooclaw/zooworkdesign'
import { ChatUiProvider, type ChatUiLabels } from './source'
import { usePreviewLocale } from '../locale'
import { chatMessages } from './messages'
import { ConstructionHeading } from '../ConstructionBadge'
import { previewAsset } from '../preview-assets'

export function useChatCopy() {
  const { locale } = usePreviewLocale()
  const c = (en: string, zh: string) => locale === 'en' ? en : zh
  const labels: ChatUiLabels = {
    attach: c('Add attachment', '添加附件'), assistant: c('Assistant', '助手'), user: c('You', '你'), system: c('System', '系统'),
    send: c('Send message', '发送消息'), stop: c('Stop generation', '停止生成'), inputPlaceholder: c('Type a message...', '输入消息...（Enter 发送，Shift+Enter 换行）'),
    emptyTitle: c('Start a conversation', '开始对话'), emptyDescription: c('Send your first message below.', '在下方发送第一条消息。'),
    removeAttachment: c('Remove attachment', '移除附件'), retryAttachment: c('Retry attachment', '重试附件'), uploadingAttachment: c('Uploading…', '正在上传…'),
  }
  return { locale, c, labels }
}
export function ChatPreviewProvider({ children }: { children: ReactNode }) {
  const { locale } = useChatCopy()
  return <ChatUiProvider locale={locale} t={(key, params) => {
    let text = chatMessages[locale]?.[key] ?? chatMessages.en[key] ?? key
    for (const [name, value] of Object.entries(params ?? {})) text = text.replaceAll(`{${name}}`, value)
    return text
  }}>{children}</ChatUiProvider>
}
export function ChatSection({ id, title, description, components, children }: {
  id: string; title: string; description: string; components: readonly string[]; children: ReactNode
}) {
  const { c } = useChatCopy()
  return <section id={id} className="pv-section pv-platform-section pv-chat-ui-section">
    <ConstructionHeading title={title} /><p className="pv-sd">{description}</p>
    <ChatPreviewProvider><div className="pv-chat-ui-content">{children}</div></ChatPreviewProvider>
    {components.length > 0 && <details className="pv-chat-ui-source"><summary>{title} · {components.length} {c('components', '个组件')}</summary><p><code>@zooclaw/zooworkdesign-chat</code> · {components.join(' · ')}</p></details>}
  </section>
}
export function ChatExample({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return <section className="pv-chat-ui-example"><header><h3>{title}</h3>{description && <p>{description}</p>}</header><div className="pv-chat-ui-example-body">{children}</div></section>
}
export const demoImage = previewAsset('product-source/avatars/owl.png')
export const demoAgentImage = sourceAssets.find(asset => asset.group === 'Agent avatars' && asset.name === '01-circle')!.src
export const demoVideo = previewAsset('videos/sample-clip.mp4')
// A short, locally generated tone: playable media without network or third-party tracking.
export function demoAudio() {
  const bytes = new Uint8Array(44 + 8000 * 2)
  const data = new DataView(bytes.buffer)
  const text = (at: number, value: string) => [...value].forEach((ch, i) => data.setUint8(at + i, ch.charCodeAt(0)))
  text(0, 'RIFF'); data.setUint32(4, bytes.length - 8, true); text(8, 'WAVEfmt ')
  data.setUint32(16, 16, true); data.setUint16(20, 1, true); data.setUint16(22, 1, true)
  data.setUint32(24, 8000, true); data.setUint32(28, 16000, true); data.setUint16(32, 2, true); data.setUint16(34, 16, true)
  text(36, 'data'); data.setUint32(40, bytes.length - 44, true)
  for (let i = 0; i < 8000; i++) data.setInt16(44 + i * 2, Math.sin(i / 8000 * 440 * Math.PI * 2) * 2000 * Math.sin(i / 8000 * Math.PI), true)
  return `data:audio/wav;base64,${btoa(Array.from(bytes, byte => String.fromCharCode(byte)).join(''))}`
}
