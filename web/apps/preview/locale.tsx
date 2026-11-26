import { createContext, useContext, useEffect, useMemo, useState, type PropsWithChildren } from 'react'
import { previewMessages } from './messages'

export type PreviewLocale = 'en' | 'zh'
export const PREVIEW_LOCALE_STORAGE_KEY = 'zoowork-design-system-locale'
type Values = Record<string, string | number>

export function translatePreview(locale: PreviewLocale, message: string, values?: Values): string {
  const key = message.trim()
  const copy = previewMessages[key]?.[locale === 'en' ? 0 : 1]
  const translated = copy === undefined ? message : message.replace(key, () => copy)
  return values ? translated.replace(/\{(\w+)\}/g, (match, key: string) => String(values[key] ?? match)) : translated
}

function initialLanguage(): PreviewLocale {
  try {
    const saved = localStorage.getItem(PREVIEW_LOCALE_STORAGE_KEY)
    if (saved === 'zh' || saved === 'en') return saved
  } catch {
    /* The preview also works when storage is unavailable. */
  }
  return typeof navigator !== 'undefined' && navigator.language.startsWith('zh') ? 'zh' : 'en'
}

const PreviewLocaleContext = createContext({
  locale: 'en' as PreviewLocale,
  setLocale: (_locale: PreviewLocale) => {},
  t: (message: string, values?: Values) => translatePreview('en', message, values),
})

export function PreviewLocaleProvider({
  children,
  initialLocale,
}: PropsWithChildren<{ initialLocale?: PreviewLocale }>) {
  const [locale, setLocale] = useState<PreviewLocale>(initialLocale ?? initialLanguage)
  useEffect(() => {
    document.documentElement.lang = locale === 'zh' ? 'zh-CN' : 'en'
    document.title = 'ZooWorkDesign — React components for tools & agents'
    try {
      localStorage.setItem(PREVIEW_LOCALE_STORAGE_KEY, locale)
    } catch {
      /* Optional persistence. */
    }
  }, [locale])
  const value = useMemo(
    () => ({ locale, setLocale, t: (message: string, values?: Values) => translatePreview(locale, message, values) }),
    [locale],
  )
  return <PreviewLocaleContext.Provider value={value}>{children}</PreviewLocaleContext.Provider>
}

export function usePreviewLocale() {
  return useContext(PreviewLocaleContext)
}

/** Keep an already visible notification in sync with the page language. */
export function PreviewMessage({ message }: { message: string }) {
  return usePreviewLocale().t(message)
}
