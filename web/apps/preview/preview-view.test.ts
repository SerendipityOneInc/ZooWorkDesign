import { describe, expect, it } from 'vitest'
import { resolveCatalogLocation } from './catalog-location'
import { resolvePreviewView } from './preview-view'

describe('public preview entry', () => {
  it('opens the homepage and its shareable sections without taking over component links', () => {
    expect(resolvePreviewView('', '')).toBe('home')
    expect(resolvePreviewView('?lang=zh', '#get-started')).toBe('home')
    expect(resolvePreviewView('', '#home-main')).toBe('home')
    expect(resolvePreviewView('', '#chat-session')).toBe('components')
    expect(resolvePreviewView('', '#purpose')).toBe('components')
    expect(resolvePreviewView('?view=components', '')).toBe('components')
    expect(resolvePreviewView('?view=patterns&lang=zh', '')).toBe('patterns')
  })

  it('routes retired showcase links to the catalog after resolving their destination', () => {
    const destination = resolveCatalogLocation('?showcase=settings&lang=zh', '')!
    const url = new URL(destination, 'https://example.test/preview/')
    expect(resolvePreviewView(url.search, url.hash)).toBe('components')
    expect(url.hash).toBe('#product-navigation')
  })
})
