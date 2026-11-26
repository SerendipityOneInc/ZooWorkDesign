import { useEffect, useId, useState, type ReactNode } from 'react'
import {
  AppearanceSelector, Button, CreditAmountSelector, DESIGN_SYSTEM_VERSION, Dialog, DialogBody, DialogContent,
  DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, Input, Label,
  PluginEmptyState, Segmented, Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow, TooltipProvider, WorkspacePageHeader,
  type AppearanceValue, type StateIllustrationVariant,
} from '@zooclaw/zooworkdesign'
import {
  ArrowRightIcon, ArrowTopRightOnSquareIcon, CheckIcon, CreditCardIcon,
  MoonIcon, RectangleStackIcon, Squares2X2Icon, SunIcon, SwatchIcon,
  TableCellsIcon, UserCircleIcon,
} from '@heroicons/react/24/outline'
import { WorkspaceSwitcherExample } from './WorkspaceSwitcherExample'
import { PreviewLocaleProvider, usePreviewLocale } from './locale'
import { LanguageSelector } from './LanguageSelector'
import { previewAsset } from './preview-assets'
import './preview.css'
import './brand-preview.css'
import './patterns.css'

const guideUrl = 'https://github.com/SerendipityOneInc/ZooWorkDesign/blob/main/docs/COMPONENTS.md'
const catalogUrl = 'https://serendipityoneinc.github.io/ZooWorkDesign/'
const changes = [
  { id: 'navigation', title: '导航与账户', icon: UserCircleIcon, kind: '新增组合',
    summary: '项目切换、账户菜单、积分与底部账户区域。',
    before: '消费页面需要分别组合项目选择、账户入口、弹层和积分行。',
    after: '增加共享组件，统一图标与文字对齐、弹层关闭、焦点返回和账户区域间距。',
    rule: '全局 Profile 只出现在一级导航；二级导航保留返回和场景菜单。余额、路由与权限由业务提供。',
    api: 'WorkspaceSwitcherTrigger · WorkspaceMonogram · PrimaryNavAccountMenu\nAccountCreditsSection / Row · PrimaryNavFooter · PrimaryNavLogo',
    try: '点击项目名称切换或创建示例项目，再点击底部账户，试试积分说明和 Esc 关闭。' },
  { id: 'appearance', title: '页面与外观', icon: SwatchIcon, kind: '新增 / 增强',
    summary: '页面标题、响应式操作区和三种外观选择。',
    before: '页面标题和浅色、深色、跟随系统的示意需要各处自行维护。',
    after: '页面标题新增 24px 模式，窄屏操作自动换行；增加可键盘操作的外观选择器。',
    rule: '区块标题保留原默认样式；外观选择器展示固定浅深示意，主题应用和保存由使用方接入。',
    api: 'WorkspacePageHeader size="page"\nAppearanceSelector',
    try: '选择浅色、深色或跟随系统；本页会响应选择。缩窄窗口，查看标题操作的换行。' },
  { id: 'empty', title: '空状态与插画', icon: Squares2X2Icon, kind: '新增素材 / 规范',
    summary: '四张补充插画，以及统一的尺寸、间距和使用语义。',
    before: '部分主要内容区使用普通图标，插画、文字和操作间距缺少统一约束。',
    after: '扩展已有空状态组件，增加内容区布局、标题层级，以及凭据、连接、记录、功能不可用插画。',
    rule: '根据真实状态选图。无数据、筛选无结果和网络失败分别表达；不把未知余额当成零。',
    api: 'PluginEmptyState layout="section" headingLevel={3}\nStateIllustration',
    try: '切换四种状态，观察同一组件中的插画、标题、说明和操作如何组合。' },
  { id: 'long-dialog', title: '长表单弹窗', icon: RectangleStackIcon, kind: '增强已有组件',
    summary: '正文可滚动，标题、关闭和底部操作保持可见。',
    before: '长表单整体滚动时，标题和底部按钮可能移出可见区域。',
    after: '既有 Dialog 增加正文分区和可选滚动模式，只让正文滚动。',
    rule: 'Header、Body、Footer 为同级分区。表单放在 Body，底部按钮通过 form ID 关联；短弹窗保持原默认行为。',
    api: 'DialogContent scrollable\nDialogHeader + DialogBody + DialogFooter',
    try: '在下方真实弹窗内滚动到底部、输入最后一个字段，再保存或按 Esc 关闭。' },
  { id: 'amount', title: '充值金额选择', icon: CreditCardIcon, kind: '新增组件',
    summary: '常驻金额输入、货币标识、快捷金额和校验提示。',
    before: '充值页面需要重复组合金额输入和选项，容易出现大卡片、额外 Other 入口和不一致样式。',
    after: '新增 CreditAmountSelector，用已有输入组和单选快捷项组成紧凑的金额选择区域。',
    rule: '组件保留原始输入字符串；精度、限额、优惠和支付请求由业务负责。提交中同步禁用输入和快捷项。',
    api: 'CreditAmountSelector\nInputGroup + Label + ToggleGroup',
    try: '输入 5. 体验编辑中间态，再点击快捷金额。此示例只展示组件，不会创建支付。' },
  { id: 'table', title: '菜单与宽表格', icon: TableCellsIcon, kind: '增强已有组件',
    summary: '菜单选中对勾、标准操作按钮和可键盘滚动的表格。',
    before: '菜单缺少对勾及统一主操作，宽表格的滚动区不易通过键盘聚焦。',
    after: '单选菜单支持对勾；创建操作支持 default / outline；表格可选择加入具名的键盘滚动区域。',
    rule: '菜单保留原方向键与禁用行为；表格只在传入 scrollLabel 时增加区域名称和 Tab 停靠点。',
    api: 'DropdownMenuRadioItem indicator="check" · DropdownMenuAction\nTable scrollLabel="…"',
    try: '点击或 Tab 聚焦下方表格外框，再按左右方向键。菜单的两种操作样式可在导航示例中切换。' },
]

function Section({ id, children }: { id: string; children: ReactNode }) {
  const { t } = usePreviewLocale()
  const item = changes.find(change => change.id === id)!
  const Icon = item.icon
  return <section className="change-section" id={id} aria-labelledby={id + '-title'}>
    <div className="change-heading"><span className="change-icon"><Icon /></span><div><span className="change-kind">{t(item.kind)}</span><h2 id={id + '-title'}>{t(item.title)}</h2></div></div>
    <p className="change-lede">{t(item.summary)}</p>
    <div className="change-comparison"><div><span>{t("原来的情况")}</span><p>{t(item.before)}</p></div><div><span className="change-now"><CheckIcon />{t("这次补齐")}</span><p>{t(item.after)}</p></div></div>
    <div className="change-demo">{children}</div>
    <p className="change-try"><strong>{t("动手试试")}</strong>{t(item.try)}</p>
    <div className="change-rule"><span>{t("使用规则")}</span><p>{t(item.rule)}</p></div>
    <details className="change-api"><summary>{t("包含哪些组件")}</summary><pre>{item.api}</pre></details>
  </section>
}

const emptyStates = [
  { value: 'empty-credentials', label: '没有凭据', title: '还没有 API 密钥', description: '创建密钥后，就可以让你的服务安全地访问 API。', action: '创建第一个密钥' },
  { value: 'empty-connections', label: '没有连接', title: '还没有配置 Webhook', description: '添加端点，接收与你的服务相关的事件。', action: '添加 Webhook' },
  { value: 'empty-records', label: '没有记录', title: '还没有使用记录', description: '开始使用后，相关记录会显示在这里。' },
  { value: 'feature-unavailable', label: '功能不可用', title: '当前未提供此功能', description: '你可以继续使用其他已开放的功能。' },
] as const

function EmptyDemo() {
  const { t } = usePreviewLocale()
  const [variant, setVariant] = useState<StateIllustrationVariant>('empty-credentials')
  const [notice, setNotice] = useState('')
  const state = emptyStates.find(item => item.value === variant)!
  return <>
    <div className="demo-toolbar"><Segmented aria-label={t("选择空状态")} value={variant} onValueChange={value => { setVariant(value as StateIllustrationVariant); setNotice('') }} options={emptyStates.map(item => ({ value: item.value, label: t(item.label) }))} /></div>
    <PluginEmptyState layout="section" headingLevel={3} variant={variant} title={t(state.title)} description={t(state.description)}>
      {'action' in state && <Button variant="outline" onClick={() => setNotice('已点击示例操作，实际创建流程由业务页面接入。')}>{t(state.action)}</Button>}
    </PluginEmptyState>
    {notice && <p className="demo-notice" role="status">{t(notice)}</p>}
    <div className="spacing-rule"><span>{t("插画 → 标题")}<b>16px</b></span><span>{t("标题 → 说明")}<b>8px</b></span><span>{t("文字 → 操作")}<b>24px</b></span></div>
  </>
}

function EmbeddedDialog({ mode }: { mode: 'dialog' | 'amount' }) {
  const { t } = usePreviewLocale()
  const [open, setOpen] = useState(true)
  const [amount, setAmount] = useState('20')
  const [saved, setSaved] = useState(false)
  const id = useId()
  return <div className="embedded-demo">
    {saved && <p role="status">{t("演示表单已保存。")}</p>}
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild><Button variant="outline" onClick={() => setSaved(false)}>{mode === 'dialog' ? t("重新打开长表单") : t("重新打开金额选择")}</Button></DialogTrigger>
      <DialogContent scrollable closeLabel={t("关闭")} onOpenAutoFocus={event => event.preventDefault()}>
        <DialogHeader><DialogTitle>{mode === 'dialog' ? t("长表单示例") : t("充值金额示例")}</DialogTitle><DialogDescription>{mode === 'dialog' ? t("滚动字段时，标题和操作按钮始终可见。") : t("体验金额输入与快捷选项，此示例不会创建支付。")}</DialogDescription></DialogHeader>
        <DialogBody>
          {mode === 'dialog' ? <form id={id} className="space-y-5" onSubmit={event => { event.preventDefault(); setSaved(true); setOpen(false) }}>
            {Array.from({ length: 12 }, (_, index) => <div className="space-y-2" key={index}><Label htmlFor={id + '-' + index}>{t("字段")} {index + 1}</Label><Input id={id + '-' + index} autoComplete="off" placeholder={t("输入示例内容")} /></div>)}
          </form> : <CreditAmountSelector value={amount} onValueChange={setAmount} label={t("输入金额")} presetsLabel={t("快捷金额")} currencySymbol="$" currencyCode="USD" presets={[{ value: '5', label: '$5.00' }, { value: '20', label: '$20.00' }, { value: '100', label: '$100.00' }]} hint={t("限额和校验由接入应用提供。")} />}
        </DialogBody>
        <DialogFooter>{mode === 'dialog' ? <><Button variant="outline" onClick={() => setOpen(false)}>{t("取消")}</Button><Button type="submit" form={id}>{t("保存示例")}</Button></> : <Button size="lg" className="w-full" disabled>{t("仅作演示")}</Button>}</DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
}

function DialogFrame({ mode, dark }: { mode: 'dialog' | 'amount'; dark: boolean }) {
  const { t, locale } = usePreviewLocale()
  const url = import.meta.env.BASE_URL + '?view=patterns&demo=' + mode + '&theme=' + (dark ? 'dark' : 'light') + '&lang=' + locale
  return <><div className="demo-toolbar"><span>{mode === 'dialog' ? t("实际滚动，头尾保持可见") : t("直接编辑，或选择快捷金额")}</span><a href={url} target="_blank" rel="noreferrer">{t("单独体验")}<ArrowTopRightOnSquareIcon /></a></div><iframe title={mode === 'dialog' ? t("长表单弹窗真实组件预览") : t("充值金额真实组件预览")} className="dialog-frame" src={url} /></>
}

function ReviewPage() {
  const { t } = usePreviewLocale()
  const [appearance, setAppearance] = useState<AppearanceValue>('light')
  const [dark, setDark] = useState(false)
  const [active, setActive] = useState('overview')
  const [notice, setNotice] = useState('')
  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const apply = () => { const next = appearance === 'dark' || (appearance === 'system' && media.matches); document.documentElement.classList.toggle('dark', next); setDark(next) }
    apply(); media.addEventListener('change', apply)
    return () => media.removeEventListener('change', apply)
  }, [appearance])
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      const first = entries.filter(entry => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]
      if (first) setActive(first.target.id)
    }, { rootMargin: '-80px 0px -65% 0px', threshold: 0 })
    document.querySelectorAll('main > section').forEach(section => observer.observe(section))
    return () => observer.disconnect()
  }, [])
  return <div className="review-page">
    <a className="review-skip" href="#overview">{t("跳转到改动总览")}</a>
    <header className="review-topbar"><a className="review-brand" href="#overview"><img src={previewAsset('product-source/brand/zoowork-horizontal-navy.png')} alt="ZooWork" /><span>Design System</span></a><div className="review-top-actions"><span className="review-pr-tag">{t("组件组合示例")}</span><Button variant="ghost" size="icon" aria-label={dark ? t("切换浅色") : t("切换深色")} onClick={() => setAppearance(dark ? 'light' : 'dark')}>{dark ? <SunIcon /> : <MoonIcon />}</Button><LanguageSelector /><a href={guideUrl} target="_blank" rel="noreferrer" className="review-github">{t("查看组件指南")}<ArrowTopRightOnSquareIcon /></a></div></header>
    <div className="review-layout"><aside className="review-sidebar"><p className="review-sidebar-title">{t("本次更新")}</p><nav aria-label={t("改动目录")}><a href="#overview" aria-current={active === 'overview' ? 'location' : undefined}><Squares2X2Icon />{t("改动总览")}</a>{changes.map(item => <a key={item.id} href={'#' + item.id} aria-current={active === item.id ? 'location' : undefined}><item.icon />{t(item.title)}</a>)}<a href="#rules" aria-current={active === 'rules' ? 'location' : undefined}><CheckIcon />{t("规则速览")}</a></nav><div className="review-sidebar-footer"><span className="review-status-dot" />{t("真实组件预览")}<span>{t("当前构建")}</span><code>{DESIGN_SYSTEM_VERSION}</code></div></aside>
    <main className="review-main">
      <section id="overview" className="review-overview" aria-labelledby="review-title"><div className="review-eyebrow"><span />ZOOWORK · COMPONENT UPDATE</div><h1 id="review-title">{t("组件组合示例")}<span>{t("把共享能力，补回设计系统。")}</span></h1><p className="review-intro">{t("这次把 Platform 中的通用组件与交互整理进组件库。先看下面的改动清单，再逐项体验真实组件。")}</p><div className="review-summary-meta"><span><CheckIcon />{t("六组改动可交互体验")}</span><span>{t("新增组件 + 既有增强 + 使用规则")}</span><a href={catalogUrl} target="_blank" rel="noreferrer">{t("打开完整组件目录")}<ArrowTopRightOnSquareIcon /></a></div>
        <div className="review-change-list">{changes.map(item => <a key={item.id} href={'#' + item.id}><span className="overview-icon"><item.icon /></span><div><strong>{t(item.title)}</strong><p>{t(item.summary)}</p></div><span className="overview-kind">{t(item.kind)}</span><ArrowRightIcon className="overview-arrow" /></a>)}</div>
      </section>
      <Section id="navigation"><div className="navigation-demo-layout"><div className="navigation-live"><WorkspaceSwitcherExample /></div><div className="navigation-explanation"><p className="demo-caption">{t("在同一份共享导航里体验")}</p><h3>{t("项目与账户，各有统一入口。")}</h3><ul><li><CheckIcon />{t("项目名、标识与导航文字列对齐")}</li><li><CheckIcon />{t("单选对勾清晰标明当前项目")}</li><li><CheckIcon />{t("创建按钮可选实心或描边样式")}</li><li><CheckIcon />{t("账户菜单支持外部点击与 Esc 关闭")}</li><li><CheckIcon />{t("关闭后焦点回到实际触发入口")}</li></ul><p className="demo-caption">{t("直接复用 组件组合 的项目导航示例。")}</p></div></div></Section>
      <Section id="appearance"><div className="page-header-demo"><WorkspacePageHeader size="page" headingLevel={2} title={t("API 密钥")} description={t("管理当前项目的访问凭据。")} actions={<Button onClick={() => setNotice('已点击示例操作，实际创建流程由业务提供。')}>{t("创建密钥")}</Button>} />{notice && <p className="demo-notice" role="status">{t(notice)}</p>}</div><div className="appearance-demo"><div><h3>{t("浅色、深色、跟随系统")}</h3><p>{t("切换选项，查看选中状态与本页主题。")}</p></div><AppearanceSelector value={appearance} onValueChange={setAppearance} groupLabel={t("页面外观")} labels={{ light: t("浅色"), dark: t("深色"), system: t("跟随系统") }} /></div></Section>
      <Section id="empty"><EmptyDemo /></Section>
      <Section id="long-dialog"><DialogFrame mode="dialog" dark={dark} /></Section>
      <Section id="amount"><DialogFrame mode="amount" dark={dark} /></Section>
      <Section id="table"><div className="demo-toolbar"><span>{t("Tab 聚焦表格外框，再用左右方向键滚动。")}</span></div><div className="table-demo"><Table scrollLabel={t("项目用量表格滚动区域")} aria-label={t("项目用量示例")} className="min-w-[920px]"><TableHeader><TableRow>{[t("项目"), t("API 请求"), t("成功率"), t("最近活跃"), t("状态")].map(item => <TableHead scope="col" key={item}>{item}</TableHead>)}</TableRow></TableHeader><TableBody>{[[t("默认项目"), '12,480', '99.8%', '2026-10-19 19:30', t("正常")], [t("研究项目"), '3,260', '99.9%', '2026-10-19 18:45', t("正常")], [t("运营项目"), '816', '100%', '2026-10-19 17:20', t("正常")]].map(row => <TableRow key={row[0]}>{row.map((cell, i) => <TableCell key={i}>{cell}</TableCell>)}</TableRow>)}</TableBody></Table></div></Section>
      <section id="rules" className="review-rules" aria-labelledby="rules-title"><span className="change-kind">{t("本次规则汇总")}</span><h2 id="rules-title">{t("以后使用组件时，照这些规则来。")}</h2><div className="rules-list">{changes.map(item => <div key={item.id}><span><item.icon />{t(item.title)}</span><p>{t(item.rule)}</p></div>)}</div><div className="review-pending"><strong>{t("当前进度")}</strong><p>{t("本页与组件目录使用同一份共享组件，全部操作使用本地示例数据。发布版本可在预览站的版本记录中核对。")}</p></div><div className="review-footer"><a href={guideUrl} target="_blank" rel="noreferrer">{t("查看组件指南")}<ArrowTopRightOnSquareIcon /></a><a href={catalogUrl + '#changelog'} target="_blank" rel="noreferrer">{t("查看发布预览与更新记录")}<ArrowTopRightOnSquareIcon /></a><a href="#overview">{t("回到顶部 ↑")}</a></div></section>
    </main></div>
  </div>
}

const params = new URLSearchParams(window.location.search)
const demo = params.get('demo')
document.documentElement.dataset.brandTheme = 'paper-focus'
document.documentElement.dataset.brandSystem = 'zoowork'
document.documentElement.lang = 'zh-CN'
if (demo) {
  document.documentElement.classList.toggle('dark', params.get('theme') === 'dark')
  document.body.classList.add('embedded-body')
}
function ReviewDocumentTitle() {
  const { t } = usePreviewLocale()
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      document.title = t(demo === 'dialog' ? '长表单组件 · 组件组合' : demo === 'amount' ? '金额选择组件 · 组件组合' : '组件组合示例 · ZooWork Design System')
    })
    return () => cancelAnimationFrame(frame)
  }, [t])
  return null
}

export function PatternsShowcaseApp() {
  const requestedLocale = params.get('lang')
  return <PreviewLocaleProvider initialLocale={requestedLocale === 'en' || requestedLocale === 'zh' ? requestedLocale : undefined}><ReviewDocumentTitle /><TooltipProvider>{demo === 'dialog' || demo === 'amount' ? <EmbeddedDialog mode={demo} /> : <ReviewPage />}</TooltipProvider></PreviewLocaleProvider>
}
