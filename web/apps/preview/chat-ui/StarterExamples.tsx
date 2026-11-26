import { useState } from 'react'
import { NewTaskStarter, type NewTaskStarterCategory, type NewTaskStarterTemplate } from './source'
import { ChatSection, demoImage, useChatCopy } from './shared'
import { CHAT_PATTERN_COMPONENTS } from './registry'

export function ChatStarterExamples() {
  const { c } = useChatCopy()
  const [category, setCategory] = useState('research')
  const [selected, setSelected] = useState<string | null>(null)
  const [result, setResult] = useState('')
  const agent = { id: 'market', displayName: c('Market Brief', '市场简报'), avatar: <img src={demoImage} alt="" className="size-7 rounded-full" /> }
  const categories: NewTaskStarterCategory[] = [
    { id: 'research', label: c('Research', '研究'), prompts: [{ id: 'market', title: c('Research the market', '研究市场'), prompt: c('Compare this week’s market trends and cite the sources.', '比较本周市场趋势，并附上来源。'), agent }, { id: 'competitors', title: c('Compare competitors', '比较竞品'), prompt: c('Compare three competitors and their positioning.', '比较三个竞品及其定位。'), agent }] },
    { id: 'writing', label: c('Writing', '写作'), prompts: [{ id: 'brief', title: c('Draft a launch brief', '起草发布简报'), prompt: c('Draft a launch brief for our next product.', '为下一个产品起草发布简报。'), agent }] },
    { id: 'templates', label: c('Templates', '模板'), prompts: [] },
  ]
  const templates: NewTaskStarterTemplate[] = [{ id: 'weekly', name: c('Weekly brief', '每周简报'), thumbnailUrl: demoImage, previewUrls: [demoImage], themeLabel: c('Research', '研究'), metaLabel: c('Report template', '报告模板'), description: c('A concise report with key findings and next steps.', '包含主要发现和后续步骤的简报。'), tags: [c('Weekly', '每周')], bestFor: c('Team updates and recurring research.', '团队更新与定期研究。'), agent }]
  return <ChatSection id="chat-starters" title={c('Task starter pattern', '任务起始组合')}
    description={c('A product workflow combining categories, suggested prompts and templates. Content and imagery are supplied by the application.', '由分类、推荐提示词与模板组成的产品流程。内容和配图由业务页面提供。')} components={CHAT_PATTERN_COMPONENTS['chat-starters']}>
    <NewTaskStarter categories={categories} activeCategoryId={category} selectedPromptId={selected} templates={templates} templateCategoryId="templates"
      onCategoryChange={setCategory} onPromptSelect={prompt => { setSelected(prompt.id); setResult(prompt.prompt) }} onTemplateSelect={template => setResult(template.name)}
      labels={{ samplePrompts: c('Try a prompt', '试试这些提示词'), chooseTemplate: c('Choose a template', '选择模板'), more: c('More', '更多'), addAndUse: c('Add and use', '添加并使用'), useTemplate: c('Use template', '使用模板'), closeTemplatePreview: c('Close preview', '关闭预览'), templateBestFor: c('Best for', '适合场景'), previewTemplate: c('Preview template', '预览模板') }} />
    <p role="status" className="pv-chat-ui-result">{result || c('Your selected prompt will appear here.', '选择的提示词将在这里显示。')}</p>
  </ChatSection>
}
