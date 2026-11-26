import { useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { PlusIcon } from '@heroicons/react/24/outline'
import {
  BRAND_ASSETS, Button, GridItem, Input, LayoutContainer, LayoutGrid, MarketingHeader,
  MarketingCtaActions, MarketingLayout, MarketingSection, MarketingSocialLinks, Segmented,
  Splitter, Textarea, WorkspaceLayout, WorkspacePageHeader,
} from '@zooclaw/zooworkdesign'
import { usePreviewLocale } from './locale'
import { AgentNavigationExample, PrimaryNavigationExample } from './NavigationExamples'
import { WorkspacePageHeaderExamples } from './PlatformComponentExamples'

function useCopy() {
  const { locale } = usePreviewLocale()
  return (en: string, zh: string) => locale === 'en' ? en : zh
}
function Rules({ rows }: { rows: string[][] }) {
  return <div className="pv-platform-table-wrap"><table className="pv-platform-rules"><tbody>
    {rows.map(([label, value]) => <tr key={label}><th scope="row">{label}</th><td>{value}</td></tr>)}
  </tbody></table></div>
}
function Canvas({ width, children }: { width: number; children: ReactNode }) {
  const container = useRef<HTMLDivElement>(null)
  const [available, setAvailable] = useState(width)
  useLayoutEffect(() => {
    const root = container.current
    if (!root) return
    const measure = () => setAvailable(root.clientWidth)
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(root)
    return () => observer.disconnect()
  }, [])
  const scale = Math.min(1, available / width)
  return <div className="pv-layout-canvas-fit" ref={container}>
    <div className="pv-layout-canvas-frame" style={{ width: width * scale, height: 562 * scale }}>
      <div className="pv-layout-canvas" data-scale={scale} style={{ width, transform: `scale(${scale})` }}>{children}</div>
    </div>
  </div>
}

export function MarketingLayoutExamples() {
  const c = useCopy()
  const [width, setWidth] = useState('1120')
  const [short, setShort] = useState(false)
  const [grid, setGrid] = useState(true)
  const scroll = useRef<HTMLDivElement>(null)
  const actions = <MarketingCtaActions salesLabel={c('Talk to Sales', '联系销售')} startLabel={c('Get Started', '立即开始')}
    salesHref="#marketing-layout" items={[{ label: c('Agent Builder', '智能体构建器'), href: '#marketing-layout' }]} />
  return <section className="pv-section" id="marketing-layout">
    <h2>{c('Website layout', '官网布局')}</h2>
    <p className="pv-sd">{c('A reusable website shell: sticky header, centered content, full-width section backgrounds, and a footer that stays at the bottom of short pages. Scroll inside the canvas to try it.',
      '可复用的官网骨架：顶部导航吸附、内容居中限宽、背景整幅铺开、短页面页脚到底。可在画布内部滚动体验。')}</p>
    <div className="pv-platform-toolbar">
      <Segmented aria-label={c('Website canvas width', '官网画布宽度')} value={width} onValueChange={setWidth}
        options={[{ value: '375', label: '375px' }, { value: '768', label: '768px' }, { value: '1120', label: '1120px' }, { value: '1440', label: '1440px' }]} />
      <Button variant="outline" size="sm" aria-pressed={grid} onClick={() => setGrid(!grid)}>{c('Show column grid', '显示列网格')}</Button>
      <Button variant="outline" size="sm" aria-pressed={short} onClick={() => { setShort(!short); scroll.current?.scrollTo({ top: 0 }) }}>{c('Short page', '短页面')}</Button>
    </div>
    <Canvas width={Number(width)}>
      <div className="pv-website-stage">
      <div className="pv-website-scroll" ref={scroll}>
        <MarketingLayout style={{ minHeight: '100%' }} data-marketing-surface
          header={<MarketingHeader compact={Number(width) < 1103} scrolled navLinks={[
            { label: c('Products', '产品'), href: '#marketing-layout' }, { label: c('Solutions', '解决方案'), href: '#marketing-layout' },
            { label: c('Pricing', '定价'), href: '#marketing-layout' }, { label: c('Resources', '资源'), href: '#marketing-layout' },
          ]} actions={actions} mobileActions={actions} homeHref="#marketing-layout" menuLabel={c('Open website navigation', '打开官网导航')} closeLabel={c('Close website navigation', '关闭官网导航')} />}
          footer={<footer className="pv-layout-footer"><LayoutContainer variant="marketing">
            <div className="pv-layout-footer-row"><img src={BRAND_ASSETS.logoDark} alt="ZooWork" width={120} />
              <MarketingSocialLinks /></div><p>© 2026 ZooWork</p>
          </LayoutContainer></footer>}>
          <MarketingSection spacing={short ? 'compact' : 'hero'}>
            <div className="pv-layout-hero-row">
            <div><p className="pv-platform-note">{c('Header → hero → content → footer', '顶部导航 → 首屏 → 内容区块 → 页脚')}</p>
            <h3 className="pv-layout-display">{c('Give your expertise room to grow.', '让专业拥有更大的空间。')}</h3></div>
            <p className="pv-layout-lede">{c('The same content edge aligns the navigation, section text and footer. The background can extend across the entire screen.',
              '导航、区块文字与页脚对齐同一内容边界，背景可延伸至屏幕两侧。')}</p>
            </div>
          </MarketingSection>
          {!short && <>
            <MarketingSection tone="subtle">
              <LayoutGrid><GridItem span={4} tablet={4} desktop={6}><h3>{c('Full-width surface', '整幅背景')}</h3>
                <p className="pv-platform-note">{c('A full-width section with constrained content inside.', '区块背景不受内容宽度约束。')}</p></GridItem>
                <GridItem span={4} tablet={4} desktop={6}><h3>{c('Centered content', '居中内容')}</h3>
                  <p className="pv-platform-note">{c('1240px maximum, including horizontal padding.', '最大宽度 1240px，包含左右内边距。')}</p></GridItem></LayoutGrid>
            </MarketingSection>
            <MarketingSection>
              <h3>{c('Build the next section', '继续组合下一段内容')}</h3>
              <p className="pv-platform-note">{c('Compose your own cards, media, carousel or statistics within the same grid.', '在同一套网格内组合卡片、媒体、轮播与数据统计。')}</p>
            </MarketingSection>
          </>}
        </MarketingLayout>
      </div>
      {grid && <div className="pv-website-guides" aria-hidden="true"><LayoutContainer variant="marketing">
        <div className="pv-website-guide-columns">{Array.from({ length: 12 }, (_, i) => <span key={i} />)}</div>
      </LayoutContainer></div>}
      </div>
    </Canvas>
    <Rules rows={[
      [c('Content container', '内容容器'), c('Max 1240px · 20px padding on small screens / 32px from 640px', '最大 1240px · 小屏 20px 边距 / 640px 起 32px')],
      [c('Preview scale', '预览缩放'), c('Fits the available space at a uniform scale; the selected canvas width and layout rules stay unchanged.', '按可用空间等比缩放，保留选定画布宽度及其布局规则。')],
      [c('Header / footer', '顶部栏 / 页脚'), c('Header sticks to the scroll container; footer follows content and fills short pages.', '顶部栏吸附于滚动容器；页脚跟随内容，短页面贴底。')],
      [c('Section spacing', '区块间距'), c('New convention: compact 24/32px, section 40/64px, hero 64/96px (small / large).', '新增规则：紧凑 24/32px、标准 40/64px、首屏 64/96px（小屏 / 大屏）。')],
    ]} />
    <pre className="pv-api-example"><code>{'<MarketingLayout header={<MarketingHeader … />} footer={<MarketingFooter … />}>\n  <MarketingSection spacing="hero">…</MarketingSection>\n  <MarketingSection tone="subtle"><LayoutGrid>…</LayoutGrid></MarketingSection>\n</MarketingLayout>'}</code></pre>
  </section>
}

export function WorkspaceLayoutExamples() {
  const c = useCopy()
  const [width, setWidth] = useState('1120')
  const [kind, setKind] = useState('primary')
  const [collapsed, setCollapsed] = useState(false)
  const [ratio, setRatio] = useState(50)
  const [mobileTab, setMobileTab] = useState('chat')
  const [overlay, setOverlay] = useState<HTMLDivElement | null>(null)
  const compact = Number(width) < 768
  const narrow = collapsed && !compact && kind === 'primary'
  const chat = <div className="pv-layout-chat">
    <div><h3>{c('Agent chat', '智能体聊天')}</h3><p>{c('Let’s turn your idea into a working agent.', '把你的想法变成能工作的智能体。')}</p>
      <p className="pv-platform-note">{c('Drag the center divider to give the conversation or settings more space. Each panel scrolls independently.', '拖动中间分割线，给聊天或设置分配更多空间。两个面板独立滚动。')}</p></div>
    <Textarea aria-label={c('Layout chat message', '布局示例聊天输入')} placeholder={c('Tell the agent what to improve…', '告诉智能体需要改进的内容…')} />
  </div>
  const settings = <div className="pv-layout-settings"><h3>{c('Agent settings', '智能体设置')}</h3>
    <label>{c('Name', '名称')}<Input defaultValue="Atlas" /></label>
    <label>{c('Description', '说明')}<Textarea defaultValue={c('A helpful research assistant.', '协助研究的智能体。')} key={c('en', 'zh')} /></label>
    {Array.from({ length: 5 }, (_, i) => <label key={i}>{c('Quick command', '快捷指令')} {i + 1}<Input placeholder={c('Add a prompt', '添加提示词')} /></label>)}
  </div>
  return <section className="pv-section pv-platform-section" id="workspace-layout">
    <h2>{c('Workspace layout', '工具布局')}</h2>
    <p className="pv-sd">{c('Two source-based layouts: a collection page with its title inside the content, and an agent workspace with a toolbar and resizable panels. Both reuse the navigation components shown in this catalog.',
      '按源码区分两类布局：列表页的标题位于内容区；智能体工作区有顶部操作栏和可调整分栏。两者复用目录中的导航组件。')}</p>
    <div className="pv-platform-toolbar">
      <Segmented aria-label={c('Workspace canvas width', '工具画布宽度')} value={width} onValueChange={setWidth}
        options={[{ value: '375', label: '375px' }, { value: '1120', label: '1120px' }, { value: '1440', label: '1440px' }]} />
      <Segmented aria-label={c('Workspace navigation kind', '工具导航类型')} value={kind} onValueChange={setKind}
        options={[{ value: 'primary', label: c('Primary · collection', '一级 · 列表') }, { value: 'secondary', label: c('Secondary · agent', '二级 · 智能体') }]} />
      <Button size="sm" variant="outline" disabled={compact || kind !== 'primary'} aria-pressed={narrow} onClick={() => setCollapsed(!collapsed)}>{c('Collapse navigation', '折叠导航')}</Button>
      <Button size="sm" variant="outline" onClick={() => setRatio(50)}>{c('Reset panel widths', '重置面板宽度')}</Button>
    </div>
    <Canvas width={Number(width)}><div ref={setOverlay} className="pv-workspace-canvas">
      <WorkspaceLayout compact={compact} collapsed={narrow} navigationKind={kind as 'primary' | 'secondary'}
        overlayContainer={overlay} style={{ height: '100%' }} navigationLabel={c('Workspace navigation', '工作区导航')}
        openNavigationLabel={c('Open workspace navigation', '打开工作区导航')} closeNavigationLabel={c('Close workspace navigation', '关闭工作区导航')}
        navigation={kind === 'primary'
          ? <PrimaryNavigationExample embedded collapsed={narrow} onCollapsedChange={setCollapsed} initialSelected="agents" />
          : <AgentNavigationExample onBack={() => setKind('primary')} />}
        header={kind === 'secondary' ? <div className="pv-layout-header-row"><strong>{kind === 'secondary' ? c('Edit agent', '编辑智能体') : c('Agents', '智能体')}</strong>
          {kind === 'secondary' && !compact && <span>{Math.round(ratio)}% / {Math.round(100 - ratio)}%</span>}
          {kind === 'secondary' && compact && <Segmented size="sm" value={mobileTab} onValueChange={setMobileTab} aria-label={c('Agent panel', '智能体面板')}
            options={[{ value: 'chat', label: c('Chat', '聊天') }, { value: 'settings', label: c('Settings', '设置') }]} />}</div> : undefined}>
        {kind === 'secondary' ? (compact ? (mobileTab === 'chat' ? chat : settings)
          : <Splitter value={ratio} onValueChange={setRatio} minFirst={360} minSecond={360}
            resizeLabel={c('Resize workspace chat and settings', '调整工作区聊天与设置宽度')} first={chat} second={settings} />)
          : <LayoutContainer variant="collection" className="pv-workspace-collection" data-compact={compact}>
            <WorkspacePageHeader title={c('Agents', '智能体')} description={c('Manage your agents and the agents shared with you.', '管理你的智能体，以及他人与你共享的智能体。')} />
            <div className="pv-workspace-collection-toolbar">
              <Segmented aria-label={c('Layout agent filter', '布局示例智能体筛选')} defaultValue="all" options={[
                { value: 'all', label: c('All', '全部') }, { value: 'mine', label: c('My agents', '我的智能体') },
                { value: 'shared', label: c('Shared with me', '与我共享') },
              ]} />
              <Button size="sm" onClick={() => setKind('secondary')}><PlusIcon />{c('Create Agent', '创建智能体')}</Button>
            </div>
            <div className="pv-workspace-content-slot">
              <span>{c('Collection content', '列表内容区')}</span>
              <p>{c('Place your table, cards or empty state here. This area shares the page title and toolbar edges.', '在这里放置表格、卡片或空状态，与页面标题和工具栏保持同一内容边界。')}</p>
              <Button size="sm" variant="outline" onClick={() => setKind('secondary')}>{c('Open split workspace', '打开分栏工作区')}</Button>
            </div>
          </LayoutContainer>}
      </WorkspaceLayout>
    </div></Canvas>
    <WorkspacePageHeaderExamples />
    <Rules rows={[
      [c('Navigation', '导航'), c('Primary 260px / secondary 256px / primary collapsed 64px. Uses the same navigation components as the Navigation section.', '一级 260px / 二级 256px / 一级折叠 64px；复用导航模块中同一套组件。')],
      [c('Collection page', '列表页面'), c('Agents source: max 1152px, 24px horizontal padding; title and toolbar sit inside the scrolling content. No desktop top bar.', 'Agents 源码：最大 1152px，左右 24px 内边距；标题和工具栏位于滚动内容中，桌面没有独立顶部栏。')],
      [c('Scroll ownership', '滚动归属'), c('100dvh shell; navigation and content scroll independently. Only primary navigation includes the global account footer.', '外壳 100dvh；导航与内容独立滚动；仅一级导航保留全局账户 Footer。')],
      [c('Secondary navigation', '二级导航'), c('Keep the back entry and contextual menus; do not repeat the global Profile or add an orphan footer divider. Personal settings pages remain available. The generic navigationFooter slot stays available for contextual content.', '保留返回入口及场景菜单，不重复全局 Profile，也不添加孤立的底部分隔线；账户设置内容页继续保留。通用 navigationFooter 插槽可承载场景相关内容。')],
      [c('Chat / settings split', '聊天 / 设置分栏'), c('Default 50/50; desktop panels ≥ 360px. Drag or use arrow keys; double-click resets.', '初始 50/50；桌面每侧最小 360px。拖动或方向键调整，双击复位。')],
      [c('Mobile', '移动端'), c('Below 768px: navigation opens in a Sheet; chat and settings switch as panels.', '768px 以下：导航切换为抽屉；聊天和设置切换面板。')],
    ]} />
    <pre className="pv-api-example"><code>{'<WorkspaceLayout navigation={<AgentNavigation />}\n  header={<Toolbar />} navigationKind="secondary"\n  navigationLabel="Agent navigation" openNavigationLabel="Open navigation" closeNavigationLabel="Close">\n  <Splitter first={<Chat />} second={<Settings />} minFirst={360} minSecond={360} />\n</WorkspaceLayout>'}</code></pre>
  </section>
}
