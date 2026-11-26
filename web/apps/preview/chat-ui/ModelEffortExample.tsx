import { useState } from 'react'
import { ComposerEffortPanel, ModelPicker, type ComposerEffortLabels, type ComposerEffortLevel, type ModelPickerProps } from './source'
import { useChatCopy } from './shared'
import { useEffortLabels } from '../effort-copy'

/** Fixture capabilities only; product catalogs and persistence belong to the host. */
export function ComposerModelExample({
  surface = 'session',
  failEffortSave = false,
  onSaveResult,
  ...props
}: Partial<ModelPickerProps> & { surface?: 'new-chat' | 'session'; failEffortSave?: boolean; onSaveResult?: (message: string) => void }) {
  const { c } = useChatCopy()
  const [model, setModel] = useState('terra')
  const [efforts, setEfforts] = useState<Record<string, ComposerEffortLevel>>({})
  const labels: ComposerEffortLabels = { ...useEffortLabels(), selectModel: c('Select model', '选择模型') }
  const value = efforts[model] ?? 'medium'
  const levels = (id: string): ComposerEffortLevel[] => id === 'sonnet' ? ['low', 'medium', 'high'] : ['low', 'medium', 'high', 'max']

  return <ModelPicker value={model} onValueChange={id => { setModel(id); return Promise.resolve(true) }} showDefaultBadge={false}
    side={surface === 'new-chat' ? 'bottom' : 'top'}
    triggerDetail={model === 'auto' ? undefined : labels[value]}
    modelSettings={{
      triggerLabel: labels.selectModel,
      available: id => id !== 'auto',
      render: (option, onBack) => <ComposerEffortPanel key={option.id} model={option} value={efforts[option.id] ?? 'medium'}
        levels={levels(option.id)} onBack={onBack} labels={labels}
        onSave={async level => {
          if (failEffortSave) {
            onSaveResult?.(c('Could not save. The previous effort has been restored.', '保存失败，已恢复之前的思考强度。'))
            return false
          }
          setEfforts(current => ({ ...current, [option.id]: level }))
          onSaveResult?.(c(`Saved ${option.label} · ${labels[level]}.`, `已保存 ${option.label} · ${labels[level]}。`))
          return true
        }} />,
    }}
    searchPlaceholder={c('Search models…', '搜索模型…')} emptySearchLabel={c('No matching models', '没有匹配模型')}
    labels={{ showMore: c('Show more', '显示更多'), showLess: c('Show less', '收起') }} options={[
      { id: 'auto', label: c('Auto', '自动'), description: c('The host chooses a model for each task.', '由宿主为当前任务选择模型。') },
      { id: 'terra', label: 'GPT-5.6 Terra', description: c('Reasoning and everyday work', '推理与日常工作'), providerIcon: 'openai' },
      { id: 'sonnet', label: 'Claude Sonnet 4.6', description: c('Writing and coding', '写作与编程'), providerIcon: 'claude' },
      { id: 'extra', label: 'GPT-5.4 Mini', description: c('Fast, compact tasks', '快速完成轻量任务'), displayTier: 2, providerIcon: 'openai' },
      ...Array.from({ length: 10 }, (_, i) => ({ id: `preview-${i + 1}`, label: c(`Preview model ${i + 1}`, `预览模型 ${i + 1}`), description: c('Demo data for browsing and search.', '用于体验列表展开与搜索的演示数据。'), displayTier: 2 as const })),
    ]} {...props} />
}

export function EffortPanelSpecimen({ max = false }: { max?: boolean }) {
  const { c } = useChatCopy()
  const labels = useEffortLabels()
  const [value, setValue] = useState<ComposerEffortLevel>(max ? 'max' : 'medium')
  return <div className="pv-effort-panel-specimen">
    <ComposerEffortPanel model={{ id: 'terra', label: 'GPT-5.6 Terra', description: '' }} value={value}
      autoFocus={false} levels={['low', 'medium', 'high', 'max']}
      labels={{ ...labels, title: max ? c('Thinking effort · Max', '思考强度 · Max') : labels.title }}
      onSave={level => { setValue(level); return true }} />
  </div>
}
