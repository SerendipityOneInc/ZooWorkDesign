import { useId, useState } from 'react'
import { ArrowUpRightIcon, CheckIcon, CursorArrowRaysIcon, PlusIcon } from '@heroicons/react/24/outline'
import { Badge, Button, Checkbox, Label, Switch } from '@zooclaw/zooworkdesign'
import { useChatCopy } from '../chat-ui/shared'

export function HeroScene() {
  const { c } = useChatCopy()
  const switchId = useId()
  const [accent, setAccent] = useState('violet')
  const [automate, setAutomate] = useState(true)
  const [done, setDone] = useState(false)
  return <div className={`home-hero-scene home-palette-${accent}`} aria-label={c('Interactive component composition', '可交互组件组合')} role="region">
    <div className="home-scene-grid" aria-hidden="true" />
    <img className="home-sculpture" src={`${import.meta.env.BASE_URL}assets/home/building-blocks.webp`} width="1280" height="1280" alt="" fetchPriority="high" />
    <span className="home-scene-label" aria-hidden="true"><span />{c('A little structure. Endless possibilities.', '一点秩序，无限可能。')}</span>
    <div className="home-scene-note" aria-hidden="true"><span className="home-note-icon"><CursorArrowRaysIcon /></span><span>{c('Your idea belongs here.', '这里，留给你的想法。')}</span><span className="home-note-cursor">↖</span></div>
    <div className="home-floating-card">
      <div className="home-floating-card-top"><span className="home-mini-mark"><PlusIcon /></span><Badge variant="secondary">{c('Your next thing', '下一个好想法')}</Badge></div>
      <h2>{c('Make it yours.', '搭出你的风格。')}</h2>
      <p>{c('A workspace with your kind of flow.', '让每一步，都按你的方式发生。')}</p>
      <div className="home-mini-setting"><Label htmlFor={switchId}>{c('A little automation', '一点自动化')}</Label><Switch id={switchId} checked={automate} onCheckedChange={setAutomate} /></div>
      <label className="home-mini-task"><Checkbox checked={done} onCheckedChange={value => setDone(value === true)} /><span>{c('Give that idea a try', '试试脑海里的那个想法')}</span></label>
      <Button asChild className="home-mini-button"><a href="#examples">{c('Try a conversation', '试试完整会话')}<ArrowUpRightIcon /></a></Button>
    </div>
    <fieldset className="home-palette"><legend>{c('Pick your palette', '挑个喜欢的颜色')}</legend><div>{[
      { value: 'violet', label: c('Violet', '紫罗兰') }, { value: 'moss', label: c('Moss', '苔绿') }, { value: 'coral', label: c('Coral', '珊瑚') },
    ].map(item => <label key={item.value} className={`home-swatch home-swatch-${item.value}`}><input type="radio" name={switchId + '-palette'} value={item.value} checked={accent === item.value} onChange={() => setAccent(item.value)} aria-label={item.label} />{accent === item.value && <CheckIcon aria-hidden="true" />}</label>)}</div></fieldset>
    <span className="home-scene-caption" aria-hidden="true">{c('Real components. Your composition.', '真实组件，自由组合。')}</span>
  </div>
}
