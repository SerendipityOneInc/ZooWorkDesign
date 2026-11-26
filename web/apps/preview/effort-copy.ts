import type { EffortSliderLabels } from '@zooclaw/zooworkdesign'
import { usePreviewLocale } from './locale'

export function useEffortLabels(): EffortSliderLabels {
  const { locale } = usePreviewLocale()
  return locale === 'zh'
    ? { title: '思考强度', auto: '自动', off: '关闭', low: '低', medium: '中', high: '高', max: '最高' }
    : { title: 'Thinking effort', auto: 'Auto', off: 'Off', low: 'Low', medium: 'Medium', high: 'High', max: 'Max' }
}
