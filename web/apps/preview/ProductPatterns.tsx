import { usePreviewLocale } from './locale'
import { useEffect, useRef, useState } from 'react'
import { ConnectorProviderCard, ConnectorToolbar, NativeSelect, type ConnectorAction, type ConnectorProviderState } from '@zooclaw/zooworkdesign'
import { AgentNavigationExample, PrimaryNavigationExample, SettingsNavigationExample } from './NavigationExamples'
import { WorkspaceSwitcherExample } from './WorkspaceSwitcherExample'

export function ProductNavigationSection() {
  const { t } = usePreviewLocale()
  const [agentState, setAgentState] = useState('ready')
  return (
    <section id="product-navigation" className="pv-section pv-platform-section">
      <h2>{t('Primary & secondary navigation')}</h2>
      <p className="pv-sd">{t('独立导航组件。体验折叠、账户菜单、列表加载与重试、Agent 切换和会话操作。')}</p>
      <div className="pv-platform-toolbar">
        <label className="pv-example-control">
          {t('Agent 列表状态')}
          <NativeSelect value={agentState} onChange={event => setAgentState(event.target.value)}>
            <option value="ready">{t('正常')}</option>
            <option value="loading">{t('加载中')}</option>
            <option value="empty">{t('空列表')}</option>
            <option value="error">{t('错误 / 重试')}</option>
          </NativeSelect>
        </label>
      </div>
      <div className="pv-nav-gallery">
        <div>
          <h3>{t('一级导航')}</h3>
          <PrimaryNavigationExample agentState={agentState} onAgentStateChange={setAgentState} />
        </div>
        <div>
          <h3>{t('设置二级导航')}</h3>
          <div className="pv-nav-stage">
            <SettingsNavigationExample />
          </div>
        </div>
        <div>
          <h3>{t('Agent 二级导航')}</h3>
          <div className="pv-nav-stage">
            <AgentNavigationExample />
          </div>
        </div>
        <div>
          <h3>{t('Project navigation')}</h3>
          <WorkspaceSwitcherExample />
        </div>
      </div>
      <p className="bv-note">
        {t('样例中的链接和账户操作只作用于本地预览。导航组件与业务适配器共享源码，路由和真实账户操作由使用方接入。')}
      </p>
    </section>
  )
}

const providers = [
  {
    id: 'gmail',
    name: 'Gmail',
    category: 'Communication',
    description: 'Read and send emails.',
    logo: null,
  },
  {
    id: 'slack',
    name: 'Slack',
    category: 'Communication',
    description: 'Connect your team conversations.',
    logo: null,
  },
  { id: 'docs', name: 'Google Docs', category: 'Workspace', description: 'Create and manage documents.', logo: null },
] as const

export function ConnectorExample({
  name = 'Gmail',
  initialState = { status: 'disconnected', enabled: false },
}: {
  name?: string
  initialState?: ConnectorProviderState
}) {
  const { t } = usePreviewLocale()
  const provider = providers.find((item) => item.name === name) ?? providers[0]
  const [state, setState] = useState(initialState)
  const [pending, setPending] = useState<ConnectorAction | null>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current)
    },
    [],
  )
  const run = (action: ConnectorAction) => {
    if (timer.current) return
    setPending(action)
    timer.current = setTimeout(() => {
      setState({
        status: action === 'disconnect' ? 'disconnected' : 'connected',
        enabled: action !== 'disable' && action !== 'disconnect',
      })
      setPending(null)
      timer.current = null
    }, 900)
  }
  return (
    <ConnectorProviderCard
      name={provider.name}
      description={t(provider.description)}
      logo={
        provider.logo ? (
          <img src={provider.logo} alt="" className="size-9 object-contain" />
        ) : (
          <span aria-hidden="true">{t('G')}</span>
        )
      }
      labels={{
        connected: t('Connected'),
        pending: t('Pending'),
        disconnected: t('Disconnected'),
        unavailable: t('Unavailable'),
        error: t('Error'),
        comingSoon: t('Coming soon'),
        disabled: t('Disabled'),
        connect: t('Connect'),
        disconnect: t('Disconnect'),
        enable: t('Enable'),
        disable: t('Disable'),
      }}
      state={state}
      pendingAction={pending}
      onConnect={() => run('connect')}
      onEnable={() => run('enable')}
      onDisable={() => run('disable')}
      onDisconnect={() => run('disconnect')}
    />
  )
}

const states: { label: string; state: ConnectorProviderState }[] = [
  { label: '未连接', state: { status: 'disconnected', enabled: false } },
  { label: '已连接', state: { status: 'connected', enabled: true } },
  { label: '已停用', state: { status: 'connected', enabled: false } },
  { label: '等待授权', state: { status: 'pending', enabled: false } },
  { label: '连接错误', state: { status: 'error', enabled: false } },
  { label: '即将上线', state: { status: 'unavailable', enabled: false } },
]

export function ProductCardSection() {
  const { t } = usePreviewLocale()
  const [revision, setRevision] = useState(0)
  return (
    <section id="connector-cards" className="pv-card-family">
      <div className="bv-heading">
        <h3>{t('Connector cards')}</h3>
        <button className="bv-text-link" onClick={() => setRevision((value) => value + 1)}>
          {t('重置全部状态')}
        </button>
      </div>
      <p className="pv-sd">{t('同一张卡片的不同状态。第三方 Logo 保留原色；操作使用中性色，状态使用语义色。')}</p>
      <div className="pv-connector-gallery">
        {states.map(({ label, state }) => (
          <div key={`${label}-${revision}`}>
            <h3>{t(label)}</h3>
            <ConnectorExample initialState={state} />
          </div>
        ))}
      </div>
      <p className="bv-note">
        {t('可点击连接、启用、停用与断开，查看操作中禁用和加载效果。仅更新当前示例卡片，不发起真实 OAuth。')}
      </p>
    </section>
  )
}

export function ConnectorPatternSection() {
  const { t } = usePreviewLocale()
  const [category, setCategory] = useState('All')
  const [query, setQuery] = useState('')
  const filtered = providers.filter(
    (provider) =>
      (category === 'All' || provider.category === category) &&
      `${provider.name} ${t(provider.description)}`.toLowerCase().includes(query.toLowerCase().trim()),
  )
  return (
    <section id="connector-pattern" className="pv-section pv-platform-section">
      <h2>{t('Search & card collection')}</h2>
      <p className="pv-sd">{t('Pattern：分类、搜索与独立连接卡片的组合。导航组件见 Navigation，卡片状态见 Cards。')}</p>
      <div className="@container">
        <ConnectorToolbar
          categories={['All', 'Workspace', 'Communication'].map((value) => ({ value, label: t(value) }))}
          searchPlaceholder={t('Search connectors')}
          query={query}
          category={category}
          onQueryChange={setQuery}
          onCategoryChange={setCategory}
        />
        <div className="pv-connector-gallery mt-6">
          {filtered.map((provider) => (
            <ConnectorExample key={provider.id} name={provider.name} />
          ))}
        </div>
        {!filtered.length && (
          <p role="status" className="text-muted-foreground py-8 text-sm">
            {t('No connectors found')}
          </p>
        )}
      </div>
    </section>
  )
}
