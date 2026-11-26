import { useState } from 'react'
import { EffortSlider, Slider, type EffortSliderLevel } from '@zooclaw/zooworkdesign'
import { usePreviewLocale } from './locale'
import { useEffortLabels } from './effort-copy'

function EffortSample({ initial, disabled = false, limited = false }: {
  initial: EffortSliderLevel; disabled?: boolean; limited?: boolean
}) {
  const labels = useEffortLabels()
  const [value, setValue] = useState<EffortSliderLevel>(initial)
  return <div className="pv-effort-sample"><EffortSlider value={value} onValueChange={setValue} disabled={disabled}
    levels={limited ? ['low', 'high'] : undefined} labels={{ ...labels, title: `${labels.title} · ${limited ? 'Low / High' : disabled ? 'Disabled' : labels[initial]}` }} /></div>
}

export function SliderExamples() {
  const { locale, t } = usePreviewLocale()
  const c = (en: string, zh: string) => locale === 'en' ? en : zh
  return <section className="pv-section" id="slider">
    <h2>{t('Slider')}</h2>
    <p className="pv-sd">{t('Range slider — single value or interval, horizontal or vertical.')}</p>
    <div style={{ maxWidth: 320 }}><Slider defaultValue={[40]} aria-label={c('Value', '数值')} /></div>
    <section className="pv-effort-examples" aria-label={c('Effort slider examples', '思考强度滑块示例')}>
      <h3>{c('EffortSlider · Thinking effort', 'EffortSlider · 思考强度')}</h3>
      <p className="pv-sd">{c('A standalone four-stop slider. Drag or use arrow keys to adjust; Max adds the gradient and particle effect.', '独立的四档滑块。可拖动或用方向键调整；最高档位带有渐变与粒子效果。')}</p>
      <div className="pv-effort-grid">{(['low', 'medium', 'high', 'max'] as const).map(level => <EffortSample key={level} initial={level} />)}</div>
      <div className="pv-effort-grid pv-effort-secondary">
        <div><h4>{c('Limited to Low / High', '仅支持低／高')}</h4><EffortSample initial="low" limited /></div>
        <div><h4>{c('Disabled', '禁用')}</h4><EffortSample initial="high" disabled /></div>
      </div>
      <pre className="pv-code"><code>{'<EffortSlider value={effort} onValueChange={setEffort} onValueCommit={saveEffort} />'}</code></pre>
      <p className="pv-platform-note"><a href="#chat-pickers">{c('See the model and effort panel together in Chat UI', '在 Chat UI 查看模型与思考强度面板的组合')} ↗</a></p>
    </section>
  </section>
}
