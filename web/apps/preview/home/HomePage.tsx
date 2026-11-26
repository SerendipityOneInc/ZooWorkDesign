import { useEffect, useId, useRef, useState } from 'react'
import { ArrowDownIcon, ArrowRightIcon, ArrowUpRightIcon, CheckIcon, CodeBracketIcon, Square2StackIcon } from '@heroicons/react/24/outline'
import { Badge, Button, Checkbox, DESIGN_SYSTEM_VERSION, FocusModalityProvider, Input, Label, Switch, Tabs, TabsContent, TabsList, TabsTrigger } from '@zooclaw/zooworkdesign'
import { PreviewLocaleProvider, type PreviewLocale } from '../locale'
import { useChatCopy } from '../chat-ui/shared'
import { HomeAgentDemo } from './HomeAgentDemo'
import { HomeHeader } from './HomeHeader'
import { HeroScene } from './HeroScene'
import { HomeReveal } from './HomeReveal'
import { SiteBrand } from '../SiteBrand'
import './home.css'

const repository = 'https://github.com/SerendipityOneInc/ZooWorkDesign'

function CopyCode({ code, label }: { code: string; label: string }) {
  const { c } = useChatCopy()
  const [status, setStatus] = useState<'idle' | 'copied' | 'failed'>('idle')
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current) }, [])
  const copy = async () => {
    try { await navigator.clipboard.writeText(code); setStatus('copied') } catch { setStatus('failed') }
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => setStatus('idle'), 3000)
  }
  return <div className="home-code-block">
    <div className="home-code-heading"><span>{label}</span><Button variant="ghost" size="icon-sm" aria-label={c(`Copy ${label}`, `复制 ${label}`)} onClick={() => void copy()}>{status === 'copied' ? <CheckIcon /> : <Square2StackIcon />}</Button></div>
    <pre tabIndex={0} aria-label={label}><code>{code}</code></pre>
    <span className="home-copy-status" role="status">{status === 'copied' ? c('Copied', '已复制') : status === 'failed' ? c('Select the code to copy it manually.', '请选择代码手动复制。') : ''}</span>
  </div>
}

function ComponentSample() {
  const { c } = useChatCopy()
  const nameId = useId()
  const switchId = useId()
  const [name, setName] = useState('My next idea')
  const [notifications, setNotifications] = useState(true)
  const [created, setCreated] = useState(false)
  return <div className="home-controls-sample">
    <div className="home-sample-label"><span>{c('A few components. Many possibilities.', '几个组件，更多可能。')}</span><CodeBracketIcon /></div>
    <form onSubmit={event => { event.preventDefault(); setCreated(true) }}>
      <div className="home-form-heading"><h3>{c('Make a little space.', '给想法一个空间。')}</h3><p>{c('Try the fields. They’re the actual components.', '试试这些控件，它们就是你可以使用的组件。')}</p></div>
      <div className="home-form-field"><Label htmlFor={nameId}>{c('Workspace name', '工作台名称')}</Label><Input id={nameId} value={name} maxLength={60} required onChange={event => { setName(event.target.value); setCreated(false) }} /></div>
      <div className="home-form-switch"><div><Label htmlFor={switchId}>{c('Keep me in the loop', '有进展时通知我')}</Label><p>{c('A small switch, a clear preference.', '简单的开关，清楚的偏好。')}</p></div><Switch id={switchId} checked={notifications} onCheckedChange={setNotifications} /></div>
      <div className="home-form-tags"><Badge variant="secondary">{c('Personal', '个人空间')}</Badge><Badge variant="outline">React Web</Badge></div>
      <Button type="submit" className="home-form-submit" disabled={!name.trim()}>{created ? <CheckIcon /> : <ArrowRightIcon />}{created ? c('Preview created', '演示已创建') : c('Create a preview', '创建演示')}</Button>
      <p className="home-form-status" role="status">{created ? c(`“${name.trim()}” is ready in this demo. Nothing was saved.`, `「${name.trim()}」已在演示中创建，不会保存真实数据。`) : c('Local demo · no account needed', '本地演示 · 无需账号')}</p>
    </form>
  </div>
}

export function HomePage({ initialLocale }: { initialLocale?: PreviewLocale } = {}) {
  return <PreviewLocaleProvider initialLocale={initialLocale}><FocusModalityProvider><HomeContent /></FocusModalityProvider></PreviewLocaleProvider>
}

function HomeContent() {
  const { locale, c } = useChatCopy()
  const catalog = (section = 'button') => `${import.meta.env.BASE_URL}?view=components&lang=${locale}#${section}`
  const css = "@import 'tailwindcss';\n@import '@zooclaw/zooworkdesign/tailwind.css';\n@import '@zooclaw/zooworkdesign/brand.css';"
  const example = `'use client'\n\nimport { useState } from 'react'\nimport { Button } from '@zooclaw/zooworkdesign'\n\nexport function MyTool() {\n  const [count, setCount] = useState(0)\n\n  return (\n    <Button onClick={() => setCount(count + 1)}>\n      ${c('Ideas created', '已创建想法')} · {count}\n    </Button>\n  )\n}`
  return <div className="home-page" id="top">
    <a className="home-skip-link" href="#home-main">{c('Skip to content', '跳到正文')}</a>
    <HomeHeader />

    <main id="home-main" tabIndex={-1}>
      <section className="home-hero home-container" aria-labelledby="home-title">
        <div className="home-hero-copy">
          <a className="home-announcement" href={catalog('changelog')}><span className="home-preview-dot" />{c('Meet your next building blocks', '下一件好作品，从这里开始')}<ArrowUpRightIcon /></a>
          <h1 id="home-title">{c('Good ideas.', '让好想法，')}<br /><span>{c('Great interfaces.', '长成好界面。')}</span></h1>
          <p className="home-hero-lede">{c('Beautiful React components for the tools and agents you want to build. Less starting from scratch. More making it yours.', '为你的工具和 Agent，准备好美观、直观的 React 组件。少一点从零搭建，多一点自由创造。')}</p>
          <div className="home-hero-actions"><Button asChild size="lg" className="home-cta"><a href="#get-started">{c('Start building', '开始使用')}<ArrowUpRightIcon /></a></Button><Button asChild variant="outline" size="lg" className="home-cta"><a href={catalog()}>{c('Explore components', '浏览组件')}<ArrowRightIcon /></a></Button></div>
          <p className="home-hero-note">React Web <span /> TypeScript <span /> {c('Made to be composed', '为自由组合而设计')}</p>
          <a className="home-hero-anchor" href="#examples"><span><ArrowDownIcon /></span>{c('Take it for a spin', '往下看看，亲手试试')}</a>
        </div>
        <HeroScene />
      </section>
      <div className="home-toolbelt home-container"><p>{c('A familiar stack. A fresh starting point.', '熟悉的技术栈，全新的起点。')}</p><div><span><CodeBracketIcon />React 19</span><span className="home-tech-ts"><b>TS</b>TypeScript</span><span><span className="home-tech-waves" aria-hidden="true">≈</span>Tailwind CSS 4</span><span><span className="home-tech-figma" aria-hidden="true"><i /><i /><i /><i /><i /></span>Figma</span></div></div>

      <HomeReveal>
      <section className="home-showcase home-container" id="examples" aria-label={c('Built with ZooWorkDesign', '使用 ZooWorkDesign 搭建')}>
        <div className="home-showcase-heading"><div><p className="home-eyebrow">{c('A HEAD START FOR YOUR NEXT AGENT', '让下一个 Agent，快一点成形')}</p><h2>{c('More than a chat bubble.', '不止一个聊天气泡。')}</h2></div><p>{c('Messages, tools and a composer that feels right. Try a conversation, then build your own.', '消息、工具，以及顺手的输入框。先试一段会话，再搭建属于你的体验。')}</p></div>
        <div className="home-demo-stage"><div className="home-showcase-caption"><span>{c('YOUR NEXT WORKSPACE, TAKING SHAPE', '让下一个工作台，开始成形')}</span><span>Chat UI <Badge variant="outline">Alpha</Badge></span></div>
        <HomeAgentDemo /></div>
        <div className="home-showcase-footer"><span>{c('Real components. A conversation you can try.', '真实组件，亲手试试这段会话。')}</span><a href={catalog('chat-session')}>{c('Explore Chat UI', '查看 Chat UI')}<ArrowUpRightIcon /></a></div>
      </section>

      </HomeReveal>
      <HomeReveal>
      <section className="home-foundations home-container" id="capabilities" aria-labelledby="home-foundations-title">
        <div className="home-section-copy"><p className="home-eyebrow">{c('SMALL DETAILS. A SHARED LANGUAGE.', '细节到位，体验一致。')}</p><h2 id="home-foundations-title">{c('From the first button', '从一颗按钮，')}<br />{c('to the whole experience.', '到完整的体验。')}</h2><p>{c('Forms that make sense. Navigation that feels familiar. Clear feedback at the right moment. Compose the pieces, then make them yours.', '让表单容易填写，让导航符合直觉，让每次操作都有清楚的反馈。组合现成的组件，再赋予它们你的想法。')}</p><ul className="home-feature-list"><li><CheckIcon />{c('Consistent controls and interaction states', '一致的控件与交互状态')}</li><li><CheckIcon />{c('Light and dark, from the same tokens', '同一套变量，浅深色自然切换')}</li><li><CheckIcon />{c('Composable React components', '自由组合的 React 组件')}</li></ul><a className="home-text-link" href={catalog()}>{c('Find your next building block', '找到你需要的组件')}<ArrowRightIcon /></a></div>
        <ComponentSample />
      </section>

      </HomeReveal>
      <HomeReveal>
      <section className="home-resources" id="design-resources" aria-labelledby="home-resources-title"><div className="home-container">
        <div className="home-resources-heading"><p className="home-eyebrow">{c('DESIGN AND BUILD, TOGETHER', '从设计到实现')}</p><h2 id="home-resources-title">{c('One language, across your product.', '让整个产品，说同一种语言。')}</h2></div>
        <div className="home-resource-grid">
          <article><div className="home-resource-art home-art-controls" aria-hidden="true"><Button tabIndex={-1} size="sm">{c('Create', '创建')}</Button><Badge variant="secondary">{c('Ready', '已就绪')}</Badge><Checkbox tabIndex={-1} checked /><Switch tabIndex={-1} checked /></div><h3>{c('Components for the everyday', '日常交互，开箱可用')}</h3><p>{c('Buttons, forms, navigation, overlays and feedback. Explore each component and its states in the live catalog.', '按钮、表单、导航、弹层与反馈。在组件目录中查看真实效果和各种状态。')}</p><a href={catalog('form')}>{c('Browse the catalog', '浏览组件目录')}<ArrowUpRightIcon /></a></article>
          <article><div className="home-resource-art home-art-theme" aria-hidden="true"><span>Aa</span><span>Aa</span><i /><i /><i /></div><h3>{c('A theme that stays coherent', '主题统一，细节相通')}</h3><p>{c('Shared color, type, spacing and motion tokens keep your interface consistent as it grows.', '共享颜色、字体、间距与动效变量，让页面不断扩展，体验依然一致。')}</p><a href={catalog('color')}>{c('Explore foundations', '查看基础规范')}<ArrowUpRightIcon /></a></article>
          <article><div className="home-resource-art home-art-design" aria-hidden="true"><span className="home-design-selection"><span>Aa</span><i /><i /><i /><i /></span><span className="home-design-cursor">↖ <small>Design</small></span></div><h3>{c('Designed to be shared', '设计与开发，共用规范')}</h3><p>{c('Figma components and variables accompany the React library. The public Community file is being prepared.', 'Figma 组件与变量对应 React 组件实现。Community 公开文件正在准备中。')}</p><span className="home-resource-status">{c('Figma · public release in preparation', 'Figma · 公开发布准备中')}</span></article>
        </div>
      </div></section>

      </HomeReveal>
      <HomeReveal>
      <section className="home-start home-container" id="get-started" aria-labelledby="home-start-title">
        <div className="home-section-copy"><p className="home-eyebrow">{c('YOUR NEXT IDEA STARTS HERE', '从这里开始，下一个想法。')}</p><h2 id="home-start-title">{c('Bring your idea.', '带上你的想法。')}<br />{c('We’ll bring the pieces.', '组件，已经准备好了。')}</h2><p>{c('Use ZooWorkDesign in a React 19 project with Tailwind CSS 4. Start with one component, then compose the rest of your interface.', '在 React 19 和 Tailwind CSS 4 项目中使用 ZooWorkDesign。从一个组件开始，逐步搭建自己的界面。')}</p>
          <div className="home-support"><span><CheckIcon />React Web</span><span>Vite · Next.js</span><span>Chat UI · Alpha</span></div>
          <p className="home-scope-note">{c('Native iOS and macOS component libraries are not available yet.', '目前尚未提供 iOS 与 macOS 原生组件库。')}</p>
          <a className="home-text-link" href={`${repository}/blob/main/docs/CONSUMING.md`} target="_blank" rel="noopener noreferrer">{c('Read the integration guide', '阅读完整接入指南')}<ArrowUpRightIcon /></a>
        </div>
        <div className="home-start-code"><p className="home-access-note"><span>{c('Open source', '开源许可')}</span>{c('Apache 2.0 code. Public npm packages. Chat UI remains Alpha.', '代码采用 Apache 2.0，使用公开 npm 包。Chat UI 保持 Alpha。')}</p>
          <CopyCode label={c('Install', '安装')} code={`pnpm add @zooclaw/zooworkdesign@${DESIGN_SYSTEM_VERSION}`} />
          <Tabs defaultValue="react"><TabsList aria-label={c('Integration examples', '接入示例')}><TabsTrigger value="react">React</TabsTrigger><TabsTrigger value="css">CSS</TabsTrigger></TabsList><TabsContent value="react"><CopyCode label="MyTool.tsx" code={example} /></TabsContent><TabsContent value="css"><CopyCode label="globals.css" code={css} /><p className="home-code-help">{c('Configure the Tailwind 4 Vite or PostCSS plugin, and set data-brand-theme="paper-focus" on your html element. See the guide for the full setup.', '配置 Tailwind 4 的 Vite 或 PostCSS 插件，并在 html 元素设置 data-brand-theme="paper-focus"；完整配置见接入指南。')}</p></TabsContent></Tabs>
        </div>
      </section>
      </HomeReveal>
    </main>
    <footer className="home-footer home-container"><div><SiteBrand /><span>{c('A little less setup. A little more making.', '少一点重复搭建，多一点创造。')}</span></div><nav aria-label={c('Footer', '页脚')}><a href={catalog('changelog')}>{c('Changelog', '更新记录')}</a><a href={`${import.meta.env.BASE_URL}assets/licenses/index.html`}>{c('Credits & licenses', '署名与许可')}</a><a href={repository} target="_blank" rel="noopener noreferrer">GitHub<ArrowUpRightIcon /></a></nav></footer>
  </div>
}
