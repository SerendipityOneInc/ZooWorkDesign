import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './preview.css'
import { resolveCatalogLocation } from './catalog-location'
import { resolvePreviewView } from './preview-view'

document.documentElement.dataset.brandTheme = 'paper-focus'
document.documentElement.dataset.brandSystem = 'zoowork'
const destination = resolveCatalogLocation(window.location.search, window.location.hash)
if (destination) window.history.replaceState(null, '', `${window.location.pathname}${destination}`)
const view = resolvePreviewView(window.location.search, window.location.hash)
const language = new URLSearchParams(window.location.search).get('lang')
const initialLocale = language === 'en' || language === 'zh' ? language : undefined
if (view === 'patterns') {
  void import('./PatternsShowcase').then(({ PatternsShowcaseApp }) => {
    createRoot(document.getElementById('root')!).render(<StrictMode><PatternsShowcaseApp /></StrictMode>)
  })
} else if (view === 'components') {
  void import('./App').then(({ App }) => {
    createRoot(document.getElementById('root')!).render(<StrictMode><App initialLocale={initialLocale} /></StrictMode>)
  })
} else {
  void import('./home/HomePage').then(({ HomePage }) => {
    createRoot(document.getElementById('root')!).render(<StrictMode><HomePage initialLocale={initialLocale} /></StrictMode>)
  })
}
