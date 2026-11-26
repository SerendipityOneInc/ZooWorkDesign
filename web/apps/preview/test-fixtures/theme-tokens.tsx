import { createRoot } from 'react-dom/client'
import { ConnectorProviderCard, EffortSlider } from '@zooclaw/zooworkdesign'
import { ActionTooltip, ChatMessage, ComposerEffortPanel, NewTaskStarter, NewTaskStarterCategoryPill } from '@zooclaw/zooworkdesign-chat'
import '../preview.css'

const noop = () => {}
const labels = { samplePrompts: 'Prompts', chooseTemplate: 'Templates', more: 'More', addAndUse: 'Add', useTemplate: 'Use', closeTemplatePreview: 'Close', templateBestFor: 'Best for', previewTemplate: 'Preview' }
const categories = [{ id: 'research', label: 'Research', prompts: [{ id: 'brief', title: 'Prepare a release brief', prompt: 'Prepare a release brief', agent: { id: 'researcher', displayName: 'Research agent' } }] }]

createRoot(document.getElementById('root')!).render(
  <main style={{ maxWidth: 720, padding: 24, display: 'grid', gap: 24 }}>
    <section id="assistant"><ChatMessage message={{ id: 'assistant', role: 'assistant', content: 'A readable assistant reply.' }} /></section>
    <section id="user"><ChatMessage message={{ id: 'user', role: 'user', content: 'A readable user message.' }} /></section>
    <section id="system"><ChatMessage message={{ id: 'system', role: 'system', content: 'Conversation started.' }} /></section>
    <section id="effort"><ComposerEffortPanel model={{ id: 'balanced', label: 'Balanced model', description: 'A model for theme regression checks' }} value="medium" levels={['low', 'medium', 'high']} autoFocus={false} onSave={() => true} /></section>
    <section id="base-effort"><EffortSlider value="medium" levels={['low', 'medium', 'high']} /></section>
    <section id="tooltip"><ActionTooltip label="Copy message"><button type="button">Hover for tooltip</button></ActionTooltip></section>
    <section id="connector"><ConnectorProviderCard name="Example connector" description="A connected integration" logo="C" state={{ status: 'connected', enabled: true }} pendingAction={null} onConnect={noop} onEnable={noop} onDisable={noop} onDisconnect={noop} /></section>
    <section id="landing" data-marketing-surface style={{ padding: 16, background: 'var(--landing-hero-bg)' }}>
      <NewTaskStarterCategoryPill appearance="landing">Unselected category</NewTaskStarterCategoryPill>
      <NewTaskStarter appearance="landing" categories={categories} activeCategoryId="research" selectedPromptId="brief" labels={labels} onCategoryChange={noop} onPromptSelect={noop} />
    </section>
  </main>,
)
