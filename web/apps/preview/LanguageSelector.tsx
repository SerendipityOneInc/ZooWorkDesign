import { LanguageIcon } from '@heroicons/react/24/outline'
import { Button, Tooltip, TooltipContent, TooltipTrigger } from '@zooclaw/zooworkdesign'
import { usePreviewLocale } from './locale'

export function LanguageSelector() {
  const { locale, setLocale, t } = usePreviewLocale()
  const label = t(
    locale === 'en' ? 'EN — English. Switch to Chinese (Simplified).' : 'ZH — Chinese (Simplified). Switch to English.',
  )
  return (
    <Tooltip>
    <TooltipTrigger asChild><Button
      type="button"
      size="icon-lg"
      variant="ghost"
      className="bg-surface-subtle rounded-lg"
      aria-label={label}
      onClick={() => setLocale(locale === 'en' ? 'zh' : 'en')}
    >
      <LanguageIcon aria-hidden="true" />
    </Button>
    </TooltipTrigger>
    <TooltipContent side="bottom" sideOffset={8}>
      {locale === 'en' ? 'Switch to Chinese' : '切换为英文'}
    </TooltipContent>
    </Tooltip>
  )
}
