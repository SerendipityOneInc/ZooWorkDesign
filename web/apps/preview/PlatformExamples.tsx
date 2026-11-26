import { useState, type ReactNode } from 'react'
import { ArrowTrendingUpIcon } from '@heroicons/react/24/outline'
import {
  Button, Calendar, Carousel, GridItem, Input, LayoutContainer, LayoutGrid, Progress, Segmented,
  Skeleton, Sparkline, Spinner, Splitter, Statistic, StatisticCountdown, Tooltip, TooltipContent, TooltipTrigger,
  sonnerToast,
} from '@zooclaw/zooworkdesign'
import { PreviewMessage, usePreviewLocale } from './locale'

function useCopy() {
  const { locale } = usePreviewLocale()
  return (en: string, zh: string) => locale === 'en' ? en : zh
}
function Section({ id, title, description, children }: { id: string; title: string; description: string; children: ReactNode }) {
  return <section id={id} className="pv-section">
    <h2>{title}</h2><p className="pv-sd">{description}</p>{children}
  </section>
}
function Specimen({ title, children }: { title: string; children: ReactNode }) {
  return <div className="pv-platform-specimen"><h3>{title}</h3>{children}</div>
}

export function SplitterExamples() {
  const c = useCopy()
  const [orientation, setOrientation] = useState<'horizontal' | 'vertical'>('horizontal')
  const [ratio, setRatio] = useState(50)
  return <Section id="splitter" title={c('Splitter', '可调整分栏')}
    description={c('Extracted from the agent chat/settings splitter: 50% initial width, 360px minimum per desktop panel, 24px keyboard steps, and double-click to reset. On narrow containers both minimums scale proportionally.',
      '提取自智能体聊天与设置分栏：初始各占 50%，桌面面板最小宽度 360px，方向键每次调整 24px，双击分隔线复位。窄容器按比例缩小两侧最小尺寸。')}>
    <div className="pv-platform-toolbar">
      <Segmented value={orientation} onValueChange={v => setOrientation(v as typeof orientation)}
        aria-label={c('Split direction', '分栏方向')} options={[
          { value: 'horizontal', label: c('Horizontal', '左右分栏') }, { value: 'vertical', label: c('Vertical', '上下分栏') },
        ]} />
      <Button variant="outline" size="sm" onClick={() => setRatio(50)}>{c('Reset split', '重置分栏')}</Button>
      <span>{Math.round(ratio)}% / {Math.round(100 - ratio)}%</span>
    </div>
    <div className="pv-splitter-demo">
      <Splitter orientation={orientation} value={ratio} onValueChange={setRatio}
        minFirst={orientation === 'horizontal' ? 360 : 100} minSecond={orientation === 'horizontal' ? 360 : 100}
        resizeLabel={c('Resize chat and settings', '调整聊天与设置宽度')}
        first={<div className="pv-splitter-content"><h3>{c('Chat', '聊天')}</h3>
          <p>{c('Content reflows as you drag the divider.', '拖动分隔线时，内容随宽度重新排布。')}</p>
          <Input aria-label={c('Message example', '消息示例')} placeholder={c('Tell the agent what to improve…', '告诉智能体需要改进的内容…')} />
        </div>}
        second={<div className="pv-splitter-content"><h3>{c('Settings', '设置')}</h3>
          <label>{c('Agent name', '智能体名称')}<Input defaultValue="Atlas" /></label>
          <p>{c('Focus the divider, then use arrows, Home or End.', '聚焦分隔线后，可以使用方向键、Home 或 End。')}</p>
        </div>} />
    </div>
    <pre className="pv-api-example"><code>{'<Splitter first={<Chat />} second={<Settings />} minFirst={360} minSecond={360} />'}</code></pre>
  </Section>
}

export function LayoutExamples() {
  const c = useCopy()
  const [variant, setVariant] = useState<'marketing' | 'product'>('marketing')
  const [width, setWidth] = useState(1100)
  return <Section id="layout-grid" title={c('Layout & Grid', '布局与网格')}
    description={c('Share spacing and alignment across surfaces. Marketing uses the source 1240px centered container; product content is fluid alongside a 260px primary rail or 256px secondary rail.',
      '不同界面共享间距与对齐。官网沿用源码 1240px 居中容器；工具内容随可用空间伸缩，配合 260px 一级导航或 256px 二级导航。')}>
    <div className="pv-platform-toolbar">
      <Segmented aria-label={c('Layout surface', '布局场景')} value={variant} onValueChange={v => setVariant(v as typeof variant)}
        options={[{ value: 'marketing', label: c('Website', '官网') }, { value: 'product', label: c('Product', '工具平台') }]} />
      <label>{c('Preview width', '预览宽度')} · {width}px
        <input type="range" min={320} max={1440} step={20} value={width} onChange={e => setWidth(Number(e.target.value))} />
      </label>
    </div>
    <div className="pv-grid-viewport">
      <div className="pv-grid-frame" style={{ width }}>
        <div className="pv-layout-header">{c('Header', '顶部栏')}</div>
        <div style={{ display: 'grid', gridTemplateColumns: variant === 'product' && width >= 768 ? '260px minmax(0, 1fr)' : 'minmax(0, 1fr)' }}>
          {variant === 'product' && width >= 768 && <div className="pv-layout-rail">{c('Primary navigation', '一级导航')}<br />260px</div>}
          <LayoutContainer variant={variant}>
            <div className="pv-layout-content-title">{variant === 'marketing' ? c('Centered content · max 1240px', '居中内容 · 最大 1240px') : c('Fluid workspace content', '弹性工作区内容')}</div>
            <LayoutGrid gap={24}>
              <GridItem span="full"><div className="pv-grid-cell">{c('Page heading', '页面标题')}</div></GridItem>
              {[1, 2, 3].map(n => <GridItem key={n} span={4} tablet={4} desktop={4}>
                <div className="pv-grid-cell">{c('Content', '内容')} {n}<br /><small>4 / 4 / 4</small></div>
              </GridItem>)}
              <GridItem span={4} tablet={8} desktop={8}><div className="pv-grid-cell">{c('Primary area', '主内容区')}<br /><small>4 / 8 / 8</small></div></GridItem>
              <GridItem span={4} tablet={8} desktop={4}><div className="pv-grid-cell">{c('Supporting area', '辅助内容区')}<br /><small>4 / 8 / 4</small></div></GridItem>
            </LayoutGrid>
          </LayoutContainer>
        </div>
      </div>
    </div>
    <div className="pv-platform-table-wrap"><table className="pv-platform-rules">
      <thead><tr><th>{c('Content width', '内容容器宽度')}</th><th>{c('Columns', '列数')}</th><th>{c('Gutter', '列间距')}</th><th>{c('Outer padding', '外侧边距')}</th></tr></thead>
      <tbody>{[['< 640px', '4', '24px', '20px'], ['640–1023px', '8', '24px', '32px'], ['≥ 1024px', '12', '24px', '32px']].map(row =>
        <tr key={row[0]}>{row.map((text, i) => <td key={i}>{text}</td>)}</tr>)}</tbody>
    </table></div>
    <p className="pv-platform-note">{c('4/8/12 columns are a new shared grid convention, measured against content width. Outer padding responds to viewport width. Existing pages do not yet all use this grid. Gaps: 8, 16, 24 or 32px.',
      '4/8/12 列是新增的共享网格规则，按内容容器宽度响应；外侧边距按视口宽度响应。现有页面尚未全部接入此网格。间距支持 8、16、24、32px。')}</p>
    <pre className="pv-api-example"><code>{'<LayoutContainer variant="marketing">\n  <LayoutGrid gap={24}>\n    <GridItem span={4} tablet={4} desktop={4}>…</GridItem>\n  </LayoutGrid>\n</LayoutContainer>'}</code></pre>
  </Section>
}

export function CalendarExamples() {
  const c = useCopy()
  const { locale } = usePreviewLocale()
  const [date, setDate] = useState(new Date(2026, 9, 13))
  const labels = { previousMonth: c('Previous month', '上个月'), nextMonth: c('Next month', '下个月') }
  return <Section id="calendar" title={c('Calendar', '日历')}
    description={c('New shared component: select a day, browse months, or compose a schedule with date content. Arrow keys move days; Page Up/Down changes month; Shift changes year. Home/End moves within the week.',
      '新增共享组件：选择日期、浏览月份，也可以在日期中放入日程。方向键移动日期；Page Up/Down 切换月份，配合 Shift 切换年份；Home/End 移动至本周首尾。')}>
    <div className="pv-platform-grid pv-calendar-examples">
      <Specimen title={c('Single date · weekends disabled', '单日选择 · 周末禁用')}>
        <Calendar locale={locale === 'en' ? 'en' : 'zh-CN'} labels={labels} value={date} onValueChange={setDate}
          disabled={d => d.getDay() === 0 || d.getDay() === 6} />
        <p className="pv-platform-note">{new Intl.DateTimeFormat(locale === 'en' ? 'en' : 'zh-CN', { dateStyle: 'long' }).format(date)}</p>
      </Specimen>
      <Specimen title={c('Schedule cells', '日程单元格')}>
        <Calendar locale={locale === 'en' ? 'en' : 'zh-CN'} labels={labels} defaultMonth={new Date(2026, 9, 1)}
          cellContent={d => d.getDate() % 7 === 0 ? <span className="pv-calendar-event">{c('Review', '评审')}</span> : null} />
      </Specimen>
    </div>
    <pre className="pv-api-example"><code>{'<Calendar value={date} onValueChange={setDate} locale="en" />'}</code></pre>
  </Section>
}

export function CarouselExamples() {
  const c = useCopy()
  const [index, setIndex] = useState(0)
  const titles = [c('Start with your expertise.', '从你的专业出发。'), c('Build the workflow.', '构建工作流程。'), c('Refine together.', '一起持续完善。')]
  return <Section id="carousel" title={c('Carousel', '轮播')}
    description={c('New shared component for a small set of related highlights. Use arrows, dots, keyboard navigation or touch swipe. Movement starts only after an action; reduced-motion preferences are respected.',
      '新增共享组件，用于少量相关的重点内容。支持箭头、指示点、键盘和触摸滑动。由用户操作触发切换，并遵循减少动态效果的系统设置。')}>
    <div className="pv-carousel-example">
      <Carousel index={index} onIndexChange={setIndex} labels={{
        previous: c('Previous slide', '上一张'), next: c('Next slide', '下一张'), carousel: c('Brand highlights', '品牌重点内容'),
        slide: (i, n) => c(`Slide ${i} of ${n}`, `第 ${i} 张，共 ${n} 张`),
      }}>
        {titles.map((title, i) => <div key={i} className="pv-carousel-slide" data-tone={i}>
          <span>0{i + 1}</span><p>{title}</p>
          <Button variant="outline" onClick={() => sonnerToast(c('Example action', '示例操作'))}>{c('Explore', '探索')}</Button>
        </div>)}
      </Carousel>
    </div>
    <pre className="pv-api-example"><code>{'<Carousel index={index} onIndexChange={setIndex}>\n  <FeatureOne /><FeatureTwo /><FeatureThree />\n</Carousel>'}</code></pre>
  </Section>
}

export function StatisticExamples() {
  const c = useCopy()
  const { locale } = usePreviewLocale()
  const [loading, setLoading] = useState(false)
  const [target, setTarget] = useState(() => Date.now() + 3600000)
  const [finished, setFinished] = useState(false)
  const activity = [3, 3, 6, 4, 11, 7, 8, 14, 10, 12, 6, 10, 13, 16].map((value, index) => ({ label: `10/${index + 1}`, value }))
  const trend = (data: typeof activity, label: string) => <Sparkline data={data} label={label} emptyLabel={c('No data', '暂无数据')} />
  return <Section id="statistic" title={c('Statistic', '统计数值')}
    description={c('New shared component: labels, numeric hierarchy, locale-aware grouping, precision, units and loading. The same primitive works alone or inside a card; semantic colors explain meaning rather than decoration.',
      '新增共享组件：统一标题与数值层级、数字分组、精度、单位和加载状态。可以单独展示或组合进卡片；语义色表达含义。')}>
    <div className="pv-platform-toolbar">
      <Button variant="outline" size="sm" onClick={() => setLoading(v => !v)}>{c('Toggle loading', '切换加载状态')}</Button>
      <Button variant="outline" size="sm" onClick={() => { setFinished(false); setTarget(Date.now() + 10000) }}>{c('Restart 10s countdown', '重新开始 10 秒倒计时')}</Button>
    </div>
    <div className="pv-statistic-grid">
      <Statistic title={c('Active agents', '活跃智能体')} value={12480} locale={locale} loading={loading} loadingLabel={c('Loading count', '正在加载数量')} />
      <Statistic title={c('Success rate', '成功率')} value={98.6} precision={1} suffix="%" loading={loading} loadingLabel={c('Loading', '加载中')} />
      <Statistic title={c('Usage', '使用量')} value={2480.5} precision={2} prefix="$" locale={locale} loading={loading} loadingLabel={c('Loading', '加载中')} />
      <Statistic title={c('Capacity', '容量')} value="24" suffix="/ 100" description={c('Workspace members', '工作区成员')} loading={loading} loadingLabel={c('Loading', '加载中')} />
      <Statistic title={c('Weekly growth', '每周增长')} value={12.5} precision={1} suffix="%" loading={loading}
        prefix={<ArrowTrendingUpIcon className="size-4 text-success" />} description={c('Compared with last week', '与上周相比')} />
      <Statistic title={c('Unavailable metric', '暂无数据')} value={null} description={c('No data received yet', '尚未收到数据')} />
      <StatisticCountdown title={c('Time remaining', '剩余时间')} target={target} onFinish={() => setFinished(true)}
        description={finished ? c('Completed', '已完成') : c('Hours : minutes : seconds', '时 : 分 : 秒')} />
    </div>
    <pre className="pv-api-example"><code>{'<Statistic title="Success rate" value={98.6} precision={1} suffix="%" />\n<StatisticCountdown title="Time remaining" target={deadline} />'}</code></pre>
    <h3 className="pv-selection-heading">{c('Dashboard trends', '数据看板趋势')}</h3>
    <p className="pv-platform-note">{c('The Agents activity line, reused in metric cards: 1.5px with a purple–teal–green gradient. Hover for values or focus and use arrow keys. Sample data below.',
      '复用 Agents 活动趋势线：1.5px 细线，紫色 → 青色 → 绿色渐变。悬停查看数值，或聚焦后使用方向键。下方为示例数据。')}</p>
    <div className="pv-statistic-grid">
      <Statistic title={c('Activity · 14 days', '活动量 · 14 天')} value={activity.reduce((total, point) => total + point.value, 0)} loading={loading} loadingLabel={c('Loading activity', '正在加载活动量')}
        description={c('Total interactions', '互动总量')} trend={trend(activity, c('Daily activity trend', '每日活动趋势'))} />
      <Statistic title={c('Zero activity', '无活动')} value={0} loading={loading} loadingLabel={c('Loading activity', '正在加载活动量')}
        description={c('Complete data, all values are zero', '数据完整，所有数值为零')} trend={trend(activity.map(point => ({ ...point, value: 0 })), c('Zero activity trend', '零活动趋势'))} />
      <Statistic title={c('Awaiting data', '等待数据')} value={null} description={c('No observations received', '尚未收到观测数据')}
        trend={trend([], c('Activity trend', '活动趋势'))} />
    </div>
    <p className="pv-platform-note">{c('Color follows horizontal position; line height carries the value. Missing observations break the line. Use a full chart when axes or series comparisons are needed.',
      '颜色随横向位置变化，高度表达数值；缺失观测会断开折线。需要坐标轴或多组数据对比时，应使用完整图表。')}</p>
    <pre className="pv-api-example"><code>{'<Statistic title="Activity" value={total}\n  trend={<Sparkline data={dailyActivity} label="Daily activity" emptyLabel="No data" />} />'}</code></pre>
  </Section>
}

export function TooltipExamples() {
  const c = useCopy()
  const [offset, setOffset] = useState('4')
  const [align, setAlign] = useState<'start' | 'center' | 'end'>('center')
  const sides = ['top', 'right', 'bottom', 'left'] as const
  const names = { top: c('Top', '上方'), right: c('Right', '右侧'), bottom: c('Bottom', '下方'), left: c('Left', '左侧') }
  return <Section id="tooltip" title={c('Tooltip', '文字提示')}
    description={c('Hover or keyboard-focus a trigger to see its tooltip. side sets the preferred direction; sideOffset sets the gap to the arrow tip in pixels. Near viewport edges it may flip or shift to remain visible.',
      '悬停或键盘聚焦触发器，查看提示。side 设置优先出现方向；sideOffset 设置触发器与箭头尖端的像素间距。靠近视口边缘时会自动翻转或移动，保证提示可见。')}>
    <div className="pv-platform-toolbar">
      <label>{c('Gap', '间距')}<Segmented value={offset} onValueChange={setOffset} aria-label={c('Tooltip gap', '提示间距')}
        options={['4', '8', '12', '16'].map(v => ({ value: v, label: v + 'px' }))} /></label>
      <label>{c('Alignment', '对齐方式')}<Segmented value={align} onValueChange={v => setAlign(v as typeof align)}
        aria-label={c('Tooltip alignment', '提示对齐方式')} options={[
          { value: 'start', label: c('Start', '起点') }, { value: 'center', label: c('Center', '居中') }, { value: 'end', label: c('End', '终点') },
        ]} /></label>
    </div>
    <div className="pv-tooltip-compass">
      {sides.map(side => <Tooltip key={side}>
        <TooltipTrigger asChild><Button style={{ gridArea: side }} variant="outline">{names[side]}</Button></TooltipTrigger>
        <TooltipContent side={side} align={align} sideOffset={Number(offset)}>
          {names[side]} · {offset}px
        </TooltipContent>
      </Tooltip>)}
      <span style={{ gridArea: 'center' }}>{offset}px</span>
    </div>
    <pre className="pv-api-example"><code>{`<TooltipContent side="top" align="${align}" sideOffset={${offset}}>…</TooltipContent>`}</code></pre>
    <p className="pv-platform-note">{c('Keep tooltips brief. Use Popover for links, buttons or other interactive content. Default gap: 4px; this header’s language switch uses 8px.',
      '提示内容应简短。需要链接、按钮等交互内容时使用 Popover。默认间距 4px；顶部语言按钮使用 8px。')}</p>
  </Section>
}

export function LoadingExamples() {
  const c = useCopy()
  const [loading, setLoading] = useState(true)
  const [progress, setProgress] = useState(45)
  return <Section id="loading" title={c('Loading & progress', '加载与进度')}
    description={c('Choose by what is known: Skeleton preserves the shape of incoming content, Spinner indicates unknown duration, and Progress shows measurable completion.',
      '根据已知信息选择：Skeleton 保留待加载内容的结构，Spinner 表示时长未知的操作，Progress 展示可测量的完成进度。')}>
    <div className="pv-platform-grid">
      <Specimen title={c('Skeleton · content placeholder', '骨架屏 · 内容占位')}>
        <div id="skeleton" className="pv-anchor-target" aria-busy={loading}>
          <div className="pv-loading-card">
            {loading ? <><Skeleton className="size-10 rounded-full" /><Skeleton className="h-4 w-40" /><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-3/4" /></> :
              <><strong>{c('Research agent', '研究智能体')}</strong><p>{c('Your agent is ready to help.', '你的智能体已就绪。')}</p></>}
            <span className="sr-only" role="status">{loading ? c('Loading agent', '正在加载智能体') : c('Agent loaded', '智能体已加载')}</span>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={() => setLoading(v => !v)}>{c('Toggle skeleton', '切换骨架屏')}</Button>
      </Specimen>
      <Specimen title={c('Spinner · indeterminate', '旋转指示 · 进度未知')}>
        <div id="spinner" className="pv-platform-toolbar pv-anchor-target">
          <Spinner aria-label={c('Loading', '加载中')} className="size-4" />
          <Spinner aria-label={c('Loading', '加载中')} className="size-6" />
          <Spinner aria-label={c('Loading', '加载中')} className="size-8" />
          <Button loading>{c('Connecting', '连接中')}</Button>
        </div>
      </Specimen>
      <Specimen title={c('Progress · measurable', '进度条 · 已知进度')}>
        <div id="progress" className="pv-anchor-target">
          <Progress value={progress} aria-label={c('Import progress', '导入进度')} />
          <label className="pv-platform-toolbar">{progress}%
            <input type="range" min={0} max={100} value={progress} aria-label={c('Set progress', '设置进度')}
              onChange={e => setProgress(Number(e.target.value))} />
          </label>
        </div>
      </Specimen>
    </div>
  </Section>
}

export function ToastExamples() {
  const c = useCopy()
  const { t } = usePreviewLocale()
  return <Section id="sonner" title={c('Toast', '轻提示 Toast')}
    description={c('Short global feedback, stacked at the bottom right. Sonner is the implementation library. Use persistent feedback with an action when a message needs attention; use Alert for information that belongs in the page.',
      '短暂的全局反馈，默认在右下角堆叠。Sonner 是实现库名称。需要关注的信息可以保持显示并附带操作；属于页面内容的信息使用 Alert。')}>
    <div className="pv-platform-toolbar">
      <Button onClick={() => sonnerToast(<PreviewMessage message="Changes saved" />)}>{t('Default toast')}</Button>
      <Button variant="outline" onClick={() => sonnerToast.success(<PreviewMessage message="Changes saved" />)}>{c('Success toast', '成功提示')}</Button>
      <Button variant="destructive" onClick={() => sonnerToast.error(<PreviewMessage message="Action failed" />)}>{t('Error toast')}</Button>
      <Button variant="outline" onClick={() => sonnerToast.info(<PreviewMessage message="Toast info" />)}>{c('Info toast', '信息提示')}</Button>
      <Button variant="outline" onClick={() => sonnerToast.warning(<PreviewMessage message="Toast warning" />)}>{c('Warning toast', '警告提示')}</Button>
      <Button variant="outline" onClick={() => {
        const id = sonnerToast.loading(<PreviewMessage message="Toast loading" />, { duration: Infinity,
          action: { label: <PreviewMessage message="Dismiss" />, onClick: () => sonnerToast.dismiss(id) },
        })
      }}>{c('Persistent loading', '持续加载提示')}</Button>
      <Button variant="outline" onClick={() => sonnerToast(<PreviewMessage message="Toast retry" />, {
        duration: Infinity, action: { label: <PreviewMessage message="Retry" />, onClick: () => sonnerToast.success(<PreviewMessage message="Changes saved" />) },
        cancel: { label: <PreviewMessage message="Dismiss" />, onClick: () => {} },
      })}>{c('With actions', '带操作的提示')}</Button>
    </div>
    <pre className="pv-api-example"><code>{'sonnerToast.success("Changes saved")\n// Mount <Sonner /> once at the application root.'}</code></pre>
  </Section>
}
