import { useEffect, useRef, useState } from 'react'
import { ArrowRightIcon, ArrowUpRightIcon, Bars3Icon, ChatBubbleLeftRightIcon, MoonIcon, Squares2X2Icon, SunIcon, SwatchIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { Button, NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from '@zooclaw/zooworkdesign'
import { GitHubLink } from '../GitHubLink'
import { LanguageSelector } from '../LanguageSelector'
import { SiteBrand } from '../SiteBrand'
import { useChatCopy } from '../chat-ui/shared'

export function HomeHeader() {
  const { locale, c } = useChatCopy()
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'))
  const [mobileOpen, setMobileOpen] = useState(false)
  const trigger = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    if (!mobileOpen) return
    const onEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || event.defaultPrevented) return
      event.preventDefault()
      setMobileOpen(false)
      trigger.current?.focus()
    }
    // WebKit pointer clicks do not necessarily focus the menu button, so an
    // Escape event may originate outside the header even while its menu is open.
    document.addEventListener('keydown', onEscape)
    return () => document.removeEventListener('keydown', onEscape)
  }, [mobileOpen])
  const catalog = (section = 'button') => `${import.meta.env.BASE_URL}?view=components&lang=${locale}#${section}`
  const groups = [
    { title: c('Explore', '探索组件'), items: [
      { title: c('React components', 'React 组件'), detail: c('The pieces for your next interface.', '构建下一个界面的基础积木。'), href: catalog(), icon: Squares2X2Icon, tone: 'violet' },
      { title: 'Chat UI', detail: c('Conversations, composers, agent tools.', '会话、输入框与 Agent 工具。'), href: catalog('chat-session'), icon: ChatBubbleLeftRightIcon, tone: 'lime' },
      { title: c('Foundations', '基础规范'), detail: c('Color, type and a shared language.', '颜色、字体与一致的设计语言。'), href: catalog('color'), icon: SwatchIcon, tone: 'peach' },
    ] },
    { title: c('Resources', '资源'), items: [
      { title: c('Get started', '接入指南'), detail: c('From install to your first component.', '从安装到第一个组件。'), href: '#get-started', icon: ArrowRightIcon, tone: 'violet' },
      { title: c('Design resources', '设计资源'), detail: c('Explore tokens and the Figma roadmap.', '了解变量与 Figma 发布进度。'), href: '#design-resources', icon: SwatchIcon, tone: 'lime' },
      { title: c('Changelog', '更新记录'), detail: c('See what’s new in the library.', '查看组件库的最新变化。'), href: catalog('changelog'), icon: Squares2X2Icon, tone: 'peach' },
    ] },
  ]
  return <header className="home-header">
    <div className="home-header-inner">
      <a className="home-brand" href={`${import.meta.env.BASE_URL}?lang=${locale}`} aria-label={c('ZooWorkDesign home', 'ZooWorkDesign 首页')}><SiteBrand /></a>
      <NavigationMenu className="home-nav" viewport={false} aria-label={c('Main navigation', '主导航')}>
        <NavigationMenuList>{groups.map(group => <NavigationMenuItem key={group.title}>
          <NavigationMenuTrigger>{group.title}</NavigationMenuTrigger>
          <NavigationMenuContent className="home-nav-panel">
            <p className="home-nav-caption">{group.title}</p>
            {group.items.map(item => <NavigationMenuLink asChild key={item.title}><a className="home-nav-card" href={item.href}>
              <span className={`home-nav-icon home-tint-${item.tone}`}><item.icon /></span>
              <span><strong>{item.title}{item.title === 'Chat UI' && <small>Alpha</small>}</strong><span>{item.detail}</span></span><ArrowUpRightIcon />
            </a></NavigationMenuLink>)}
          </NavigationMenuContent>
        </NavigationMenuItem>)}<NavigationMenuItem><NavigationMenuLink asChild><a className="home-nav-example" href="#examples">{c('Playground', '交互体验')}</a></NavigationMenuLink></NavigationMenuItem></NavigationMenuList>
      </NavigationMenu>
      <div className="home-header-actions">
        <div className="home-header-utilities"><Button variant="ghost" size="icon-sm" onClick={() => { document.documentElement.classList.toggle('dark', !dark); setDark(!dark) }} aria-label={dark ? c('Switch to light mode', '切换为浅色模式') : c('Switch to dark mode', '切换为深色模式')}>{dark ? <SunIcon /> : <MoonIcon />}</Button><LanguageSelector /><GitHubLink /></div>
        <Button asChild className="home-header-cta"><a href="#get-started">{c('Get started', '开始使用')}<ArrowUpRightIcon /></a></Button>
        <Button ref={trigger} variant="ghost" size="icon-sm" className="home-menu-toggle" aria-label={c('Navigation menu', '导航菜单')} aria-expanded={mobileOpen} aria-controls="home-mobile-nav" onClick={() => setMobileOpen(!mobileOpen)}>{mobileOpen ? <XMarkIcon /> : <Bars3Icon />}</Button>
      </div>
    </div>
    {mobileOpen && <nav id="home-mobile-nav" className="home-mobile-nav" aria-label={c('Mobile navigation', '移动端导航')}>{groups.map(group => <div key={group.title}><p>{group.title}</p>{group.items.map(item => <a key={item.title} href={item.href} onClick={() => setMobileOpen(false)}>{item.title}<ArrowUpRightIcon /></a>)}</div>)}<a href="#examples" onClick={() => setMobileOpen(false)}>{c('Playground', '交互体验')}<ArrowUpRightIcon /></a></nav>}
  </header>
}
