import { useState } from 'react'
import { Button } from '@zooclaw/zooworkdesign'
import { ERMPCardRenderer, InteractiveCards, QuickActionCards, SpecialistConsentCard, SpecialistOpenCard, type ERMPCard, type InteractiveCardView } from './source'
import { ChatExample, ChatSection, demoAudio, demoImage, demoVideo, useChatCopy } from './shared'
import { CHAT_UI_COMPONENTS } from './registry'

export function ChatCardExamples() {
  const { c } = useChatCopy()
  const [audio] = useState(demoAudio)
  const [result, setResult] = useState('')
  const [version, setVersion] = useState(0)
  const [submitted, setSubmitted] = useState<string[]>([])
  const interactive: InteractiveCardView[] = [
    { kind: 'banner', text: c('The report is ready for review.', '报告已准备好，可以审阅。') },
    { kind: 'buttons', text: c('Choose the next step.', '选择下一步操作。'), buttons: [{ actionId: 'approve', label: c('Approve draft', '通过草稿'), style: 'primary' }, { actionId: 'revise', label: c('Request changes', '要求修改'), style: 'default' }] },
    { kind: 'select', text: c('Delivery format', '交付格式'), actionId: 'format', placeholder: c('Select a format', '选择格式'), options: [{ label: 'PDF', value: 'pdf' }, { label: 'Markdown', value: 'markdown' }] },
    { kind: 'multiselect', text: c('Include in the report', '报告包含内容'), options: [{ actionId: 'summary', label: c('Summary', '摘要'), checked: true }, { actionId: 'sources', label: c('Sources', '来源'), checked: false }], submitActionId: 'sections', submitLabel: c('Confirm sections', '确认章节') },
  ]
  const cards: ERMPCard[] = [
    { _id: 'table', _card: 'table', title: c('Weekly activity', '每周活动'), columns: [{ key: 'name', label: c('Agent', '智能体') }, { key: 'count', label: c('Tasks', '任务'), align: 'right' }], rows: [{ name: c('Market Brief', '市场简报'), count: 24 }, { name: c('Content Studio', '内容助手'), count: 18 }] },
    { _id: 'kv', _card: 'kv', title: c('Run details', '执行详情'), items: [{ key: c('Status', '状态'), value: c('Completed', '已完成'), tag: 'success' }, { key: c('Duration', '时长'), value: '42s' }] },
    { _id: 'actions', _card: 'actions', title: c('Next steps', '下一步'), buttons: [{ label: c('Save draft', '保存草稿'), action: 'callback', value: 'save', style: 'primary' }, { label: c('Copy title', '复制标题'), action: 'copy', value: c('Weekly report', '每周报告') }] },
    { _id: 'form', _card: 'form', title: c('Report preferences', '报告偏好'), submitLabel: c('Apply preferences', '应用偏好'), fields: [{ name: 'title', label: c('Title', '标题'), type: 'text', required: true, default: c('Weekly report', '每周报告') }, { name: 'format', label: c('Format', '格式'), type: 'select', options: ['PDF', 'Markdown'], default: 'PDF' }, { name: 'sources', label: c('Include sources', '包含来源'), type: 'toggle', default: true }] },
    { _id: 'audio', _card: 'audio', src: audio, title: c('Audio summary', '音频摘要'), mimeType: 'audio/wav', duration: 1 },
    { _id: 'video', _card: 'video', src: demoVideo, title: c('Sample clip', '示例视频'), mimeType: 'video/mp4' },
    { _id: 'file', _card: 'file', src: 'data:text/plain;charset=utf-8,Preview%20report', name: 'report.txt', size: 14, mimeType: 'text/plain' },
    { _id: 'composite', _card: 'composite', title: c('Delivery summary', '交付摘要'), sections: [{ _card: 'kv', items: [{ key: c('Items', '项目'), value: '3' }] }, { _id: 'confirm-delivery', _card: 'actions', buttons: [{ label: c('Confirm delivery', '确认交付'), action: 'callback', value: 'confirm' }] }] },
  ]
  const mark = (id: string | undefined, value: unknown) => { setSubmitted(current => [...current, id ?? 'preview']); setResult(`${id}: ${typeof value === 'string' ? value : JSON.stringify(value)}`) }
  return <ChatSection id="chat-cards" title={c('Response cards', '回复卡片')}
    description={c('Suggested prompts, confirmations, selections, forms and structured responses, rendered by the same components used in chat.', '推荐提示词、确认、选择、表单与结构化回复，均使用聊天中的原始组件展示。')} components={CHAT_UI_COMPONENTS['chat-cards']}>
    <div className="pv-row"><Button size="sm" variant="outline" onClick={() => { setVersion(value => value + 1); setSubmitted([]); setResult('') }}>{c('Reset card actions', '重置卡片操作')}</Button><p role="status">{result || c('Choose an action to see its result.', '选择操作以查看结果。')}</p></div>
    <ChatExample title={c('Quick actions', '快捷操作')}><QuickActionCards items={[{ id: 'summary', title: c('Summarize this week', '总结本周'), description: c('Turn updates into a short report.', '将更新整理成简短报告。') }, { id: 'plan', title: c('Plan next week', '规划下周'), description: c('Identify priorities and owners.', '明确优先事项和负责人。') }]} onActionClick={setResult} /></ChatExample>
    <ChatExample title={c('Interactive responses', '交互式回复')}><InteractiveCards key={version} postId="preview" cards={interactive} onAction={async (_post, action, selected) => { mark(action, selected ?? action) }} /></ChatExample>
    <div className="pv-chat-ui-grid" key={`specialist-${version}`}>
      <ChatExample title={c('Specialist handoff', '专家交接')}><SpecialistOpenCard agentId="market" displayName={c('Market Brief', '市场简报')} greeting={c('I can help research this topic.', '我可以帮助研究这个主题。')} ariaLabel={c('Open Market Brief', '打开市场简报')} avatarUrl={demoImage} onOpen={() => setResult(c('Market Brief selected.', '已选择市场简报。'))} /></ChatExample>
      <ChatExample title={c('Approval', '批准')}><SpecialistConsentCard labels={[c('Allow', '允许'), c('Decline', '拒绝')]} body={c('Allow the agent to read this attachment?', '允许智能体读取这个附件？')} variant="neutral" chosenLabelTemplate={c('You chose: {label}', '你选择了：{label}')} onButtonClick={setResult} /></ChatExample>
      <ChatExample title={c('Destructive confirmation', '危险操作确认')}><SpecialistConsentCard labels={[c('Delete draft', '删除草稿'), c('Keep draft', '保留草稿')]} body={c('Delete the draft from this preview?', '删除当前预览中的草稿？')} variant="destructive" destructiveBannerLabel={c('Confirm deletion', '确认删除')} chosenLabelTemplate={c('You chose: {label}', '你选择了：{label}')} onButtonClick={setResult} /></ChatExample>
    </div>
    {[
      { title: c('Structured information', '结构化信息'), ids: ['table', 'kv', 'composite'] },
      { title: c('Forms & actions', '表单与操作'), ids: ['form', 'actions'] },
      { title: c('Media response cards', '媒体回复卡片'), ids: ['audio', 'video', 'file'] },
    ].map(group => <div key={group.ids[0]}><h3 className="pv-chat-group-title">{group.title}</h3><div className="pv-chat-ui-card-grid">{cards.filter(card => group.ids.includes(card._id!)).map(card => <ChatExample key={`${version}-${card._id}`} title={'title' in card && typeof card.title === 'string' ? card.title : 'name' in card && typeof card.name === 'string' ? card.name : card._card}><ERMPCardRenderer card={card} isSubmitted={id => submitted.includes(id ?? '')} onCallback={mark} onFormSubmit={mark} /></ChatExample>)}</div></div>)}
  </ChatSection>
}
