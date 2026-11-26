import { useState } from 'react'
import { ListBulletIcon, Squares2X2Icon, SunIcon, MoonIcon } from '@heroicons/react/24/outline'
import { Button, Segmented, Tabs, TabsContent, TabsList, TabsTrigger } from '@zooclaw/zooworkdesign'
import { usePreviewLocale } from './locale'

export function SelectionExamples() {
  const { locale, t } = usePreviewLocale()
  const c = (en: string, zh: string) => locale === 'en' ? en : zh
  const [appearance, setAppearance] = useState<'line' | 'default'>('line')
  const [scope, setScope] = useState('all')
  const options = [
    { value: 'all', label: c('All', '全部') },
    { value: 'mine', label: c('My agents', '我的智能体') },
    { value: 'shared', label: c('Shared with me', '与我共享') },
  ]
  return <section id="tabs" className="pv-section pv-platform-section">
    <h2>{t('Tabs / Segmented')}</h2>
    <p className="pv-sd">{c('One visual family for switching between related choices. Use Tabs for content panels and Segmented for a filter value or view mode.',
      '一套视觉规则，覆盖相关选项之间的切换。内容面板使用 Tabs；筛选值或视图模式使用 Segmented。')}</p>
    <div className="pv-platform-grid">
      <div className="pv-platform-specimen">
        <h3>{c('Content panels · Tabs', '内容切换 · Tabs')}</h3>
        <p className="pv-platform-note">{c('Each tab opens its associated panel. Both appearances use the same behavior.', '每个选项关联一个内容面板，两种外观保留同一套交互。')}</p>
        <div className="pv-selection-appearances" role="group" aria-label={c('Tab appearance', '选项卡外观')}>
          <Button size="sm" variant="outline" aria-pressed={appearance === 'line'} onClick={() => setAppearance('line')}>{c('Underline', '下划线')}</Button>
          <Button size="sm" variant="outline" aria-pressed={appearance === 'default'} onClick={() => setAppearance('default')}>{c('Filled', '块状')}</Button>
        </div>
        <Tabs defaultValue="overview">
          <TabsList variant={appearance} aria-label={c('Agent detail panels', '智能体详情面板')}>
            <TabsTrigger value="overview">{t('Overview')}</TabsTrigger>
            <TabsTrigger value="analytics">{t('Analytics')}</TabsTrigger>
            <TabsTrigger value="settings">{t('Settings')}</TabsTrigger>
          </TabsList>
          <TabsContent className="pv-selection-panel" value="overview">{t('Overview panel — shows a summary of recent tasks.')}</TabsContent>
          <TabsContent className="pv-selection-panel" value="analytics">{t('Analytics panel — charts and data will be displayed here.')}</TabsContent>
          <TabsContent className="pv-selection-panel" value="settings">{t('Settings panel — preferences and permissions.')}</TabsContent>
        </Tabs>
        <pre className="pv-api-example"><code>{`<Tabs defaultValue="overview">\n  <TabsList variant="${appearance}">\n    <TabsTrigger value="overview">…</TabsTrigger>\n  </TabsList>\n  <TabsContent value="overview">…</TabsContent>\n</Tabs>`}</code></pre>
      </div>
      <div className="pv-platform-specimen">
        <h3>{c('Filters and modes · Segmented', '筛选与模式 · Segmented')}</h3>
        <p className="pv-platform-note">{c('Choose one value to update the current view. Agent scope and list/grid modes belong here.', '选择一个值来更新当前视图，适用于智能体范围、列表与网格等模式。')}</p>
        <Segmented aria-label={c('Agent scope', '智能体范围')} value={scope} onValueChange={setScope} options={options} />
        <p className="pv-selection-panel" role="status">{c('Current filter: ', '当前筛选：')}{options.find(option => option.value === scope)?.label}</p>
        <pre className="pv-api-example"><code>{'<Segmented\n  options={options}\n  value={scope}\n  onValueChange={setScope}\n/>'}</code></pre>
      </div>
    </div>
    <h3 className="pv-selection-heading">{c('Shared styles and states', '共用样式与状态')}</h3>
    <p className="pv-platform-note">{c('Both controls share sizes, spacing, surfaces and focus feedback. Filled indicators slide and resize; underlines draw at the selected label width.',
      '两者共用尺寸、间距、表面与焦点反馈。块状底色平滑移动并变宽；下划线在选中文字下原地展开，宽度贴合标签。')}</p>
    <div className="pv-platform-grid">
      <div className="pv-platform-specimen">
        <h3>{c('Sizes · 32 / 40 / 48px', '尺寸 · 32 / 40 / 48px')}</h3>
        {(['sm', 'md', 'lg'] as const).map(size => <div className="pv-selection-size" key={size}>
          <span>{size.toUpperCase()}</span><Segmented size={size} aria-label={`${c('Size sample', '尺寸示例')} ${size}`} defaultValue="all" options={options.slice(0, 2)} />
        </div>)}
      </div>
      <div className="pv-platform-specimen">
        <h3>{c('Full width and disabled', '全宽与禁用')}</h3>
        <Segmented block aria-label={c('Full width filter', '充满容器的筛选')} defaultValue="all" options={options} />
        <Segmented aria-label={c('Unavailable scope', '部分不可用的范围')} defaultValue="all"
          options={options.map(option => ({ ...option, disabled: option.value === 'shared' }))} />
        <Segmented disabled aria-label={c('Disabled filter', '已禁用的筛选')} defaultValue="all" options={options} size="sm" />
      </div>
      <div className="pv-platform-specimen">
        <h3>{c('Vertical · icon only', '垂直 · 纯图标')}</h3>
        <Segmented orientation="vertical" aria-label={c('Display mode', '显示模式')} defaultValue="list" options={[
          { value: 'list', label: <ListBulletIcon />, 'aria-label': c('List view', '列表视图') },
          { value: 'grid', label: <Squares2X2Icon />, 'aria-label': c('Grid view', '网格视图') },
        ]} />
      </div>
      <div className="pv-platform-specimen">
        <h3>{c('Round shape', '胶囊形')}</h3>
        <Segmented shape="round" aria-label={c('Example color scheme', '示例主题模式')} defaultValue="light" options={[
          { value: 'light', label: <SunIcon />, 'aria-label': c('Light', '浅色') },
          { value: 'dark', label: <MoonIcon />, 'aria-label': c('Dark', '深色') },
        ]} />
      </div>
    </div>
    <p className="pv-platform-note">{c('Keyboard: Tab enters the control; arrow keys move between available options. Tabs connects each option to a panel; Segmented submits a single value when given a name.',
      '键盘：Tab 进入控件，方向键在可用选项间移动。Tabs 关联内容面板；Segmented 配置 name 后可提交单个表单值。')}</p>
  </section>
}
