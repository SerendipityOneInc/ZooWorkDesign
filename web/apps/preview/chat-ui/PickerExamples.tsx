import { useState } from 'react'
import { BoltIcon } from '@heroicons/react/24/outline'
import { Button, DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, Segmented } from '@zooclaw/zooworkdesign'
import { AgentPicker, SkillStoreDialog, SkillsSubMenu } from './source'
import { ComposerModelExample } from '../ChatComposerExamples'
import { EffortPanelSpecimen } from './ModelEffortExample'
import { ChatExample, ChatSection, demoImage, useChatCopy } from './shared'
import { CHAT_UI_COMPONENTS } from './registry'

export function ChatPickerExamples() {
  const { c } = useChatCopy()
  const [agent, setAgent] = useState('market')
  const [state, setState] = useState('ready')
  const [store, setStore] = useState(false)
  const [sub, setSub] = useState(false)
  const [result, setResult] = useState('')
  const [failSave, setFailSave] = useState('success')
  const [effortResult, setEffortResult] = useState('')
  const skills = [
    { id: 'research', slug: 'research', name: c('Market research', '市场研究'), author: 'ZooWork', summary: c('Find sources and summarize trends.', '查找来源并总结趋势。'), icon: <BoltIcon className="size-5" /> },
    { id: 'writing', slug: 'writing', name: c('Content writing', '内容写作'), author: 'ZooWork', summary: c('Turn research into a clear first draft.', '将研究整理成清晰的初稿。'), icon: <BoltIcon className="size-5" /> },
  ]
  return <ChatSection id="chat-pickers" title={c('Agent, model & skill pickers', '智能体、模型与技能选择')}
    description={c('The menus used in the product composer. Select an agent or model, insert a skill, or browse the skill store.', '产品输入框中的选择菜单。可切换智能体和模型、插入技能，或浏览技能库。')} components={CHAT_UI_COMPONENTS['chat-pickers']}>
    <Segmented value={state} onValueChange={setState} aria-label={c('Picker state', '选择器状态')} options={[
      { value: 'ready', label: c('Available', '可用') }, { value: 'loading', label: c('Loading', '加载中') },
      { value: 'empty', label: c('Empty', '空状态') }, { value: 'error', label: c('Error', '错误') },
    ]} />
    <ChatExample title={c('Model & thinking effort · Panel preview', '模型与思考强度 · 面板预览')}
      description={c('Both panels are shown directly and can be adjusted. The standalone slider is also available in Slider.', '面板直接展示，可直接调整。独立的滑块组件也可在 Slider 中查看。')}>
      <div className="pv-effort-panel-grid"><EffortPanelSpecimen /><EffortPanelSpecimen max /></div>
      <a className="pv-platform-note" href="#slider">{c('View EffortSlider in Slider', '前往 Slider 查看 EffortSlider')} ↗</a>
    </ChatExample>
    <ChatExample title={c('Click-through example', '点击交互示例')}
      description={c('Choose a model to open its effort panel. Drag the slider or use arrow keys; use the model name to go back. Auto has no effort panel. This catalog is demo data.', '选择模型后进入思考强度面板。拖动滑块或使用方向键调整，点击模型名称返回列表。自动模式不显示思考强度面板。模型目录为演示数据。')}>
      <div className="pv-row"><Segmented size="sm" value={failSave} onValueChange={value => { setFailSave(value); setEffortResult('') }} aria-label={c('Effort save result', '思考强度保存结果')}
        options={[{ value: 'success', label: c('Save succeeds', '保存成功') }, { value: 'failure', label: c('Save fails', '保存失败') }]} />
        <ComposerModelExample surface="new-chat" failEffortSave={failSave === 'failure'} onSaveResult={setEffortResult} loading={state === 'loading'} error={state === 'error' ? c('Models could not load.', '无法加载模型。') : undefined} onRetry={() => setState('ready')} {...(state === 'empty' ? { options: [] } : {})} /></div>
      <p role="status" className="pv-chat-ui-result">{effortResult || c('Max adds the gradient and particle effect. Unsupported effort levels are skipped.', '选择最高强度可查看渐变与粒子效果。模型不支持的强度会自动跳过。')}</p>
    </ChatExample>
    <div className="pv-chat-ui-grid">
      <ChatExample title={c('Agent', '智能体')}><AgentPicker selectedId={agent} onSelect={setAgent} isLoading={state === 'loading'}
        switchLabel={c('Switch agent', '切换智能体')} hireMoreLabel={c('Find more agents', '发现更多智能体')} onHireMore={() => setResult(c('Explore agents selected.', '已选择浏览更多智能体。'))}
        options={state === 'empty' ? [] : ['market', 'writing'].map((id, i) => ({ id, displayName: i ? c('Content Studio', '内容助手') : c('Market Brief', '市场简报'), description: i ? c('Writing and editing', '写作与编辑') : c('Research and insights', '研究与洞察'), avatar: <img src={demoImage} alt="" className="size-7 rounded-full" /> }))} /></ChatExample>
      <ChatExample title={c('Skills', '技能')}><div className="pv-row"><DropdownMenu><DropdownMenuTrigger asChild><Button variant="outline">{c('Add to message', '添加到消息')}</Button></DropdownMenuTrigger><DropdownMenuContent>
        <SkillsSubMenu open={sub} onOpenChange={setSub} subSide="right" items={state === 'empty' ? [] : skills} isLoading={state === 'loading'} isError={state === 'error'}
          labels={{ trigger: c('Skills', '技能'), loading: c('Loading…', '加载中…'), loadFailed: c('Could not load skills', '无法加载技能'), openStore: c('Browse skill store', '浏览技能库'), empty: c('No skills yet', '暂无技能'), createWithZooClaw: c('Create a skill', '创建技能') }}
          onCreateSkill={() => setResult(c('Skill creation selected.', '已选择创建技能。'))} onInsertSkill={setResult} onOpenMarket={() => setStore(true)} />
      </DropdownMenuContent></DropdownMenu><Button variant="outline" onClick={() => setStore(true)}>{c('Open skill store', '打开技能库')}</Button></div></ChatExample>
    </div>
    <p role="status" className="pv-chat-ui-result">{result || c('Selections stay in this preview.', '选择结果仅保留在当前预览中。')}</p>
    <SkillStoreDialog open={store} onOpenChange={setStore} items={state === 'empty' ? [] : skills} isLoading={state === 'loading'} isError={state === 'error'} onRetry={() => setState('ready')} onConfirm={item => { setResult(item.name); setStore(false) }}
      labels={{ title: c('Skill store', '技能库'), description: c('Choose a skill to add to your message.', '选择一个技能添加到消息中。'), loading: c('Loading skills…', '正在加载技能…'), loadFailedTitle: c('Skills unavailable', '技能暂不可用'), loadFailedDescription: c('Try loading the list again.', '请重新加载列表。'), retry: c('Retry', '重试'), emptyTitle: c('No skills yet', '暂无技能'), emptyDescription: c('New skills will appear here.', '新技能将显示在这里。'), loadingMore: c('Loading more…', '加载更多…'), loadMore: c('Load more', '加载更多'), selectOne: c('Select a skill', '选择技能'), cancel: c('Cancel', '取消'), addToMessage: c('Add to message', '添加到消息') }} />
  </ChatSection>
}
