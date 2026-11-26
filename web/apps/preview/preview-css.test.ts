import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { describe, expect, it } from 'vitest'

const previewRoot = dirname(fileURLToPath(import.meta.url))
const previewCss = readFileSync(join(previewRoot, 'preview.css'), 'utf8')

const cssBlock = (selector: string) => {
  const escaped = selector.replaceAll('.', '\\.')
  return previewCss.match(new RegExp(`${escaped}\\s*\\{[^}]*\\}`))?.[0] ?? ''
}

describe('preview 2.0 styling contract', () => {
  it('uses an opaque split shell without topbar or sidebar dividers', () => {
    expect(cssBlock('.pv-shell')).toContain('grid-template-columns: 248px minmax(0, 1fr)')
    expect(cssBlock('.pv-shell')).toContain('min-height: calc(100vh - 56px)')
    expect(cssBlock('.pv-topbar')).not.toContain('border-bottom')
    expect(cssBlock('.pv-side')).not.toContain('border-right')
    expect(cssBlock('.pv-side')).not.toContain('border-radius')
    expect(cssBlock('.pv-main')).not.toContain('box-shadow')
    expect(cssBlock('.pv-main')).not.toContain('backdrop-filter')
  })

  it('keeps the introductory hero free of hard framing lines', () => {
    expect(cssBlock('.pv-physics-hero')).not.toContain('border: 1px solid')
    expect(cssBlock('.pv-intro-purpose')).toContain('border-bottom: 0')
  })

  it('uses only the brush marker for active navigation emphasis', () => {
    expect(previewCss).toContain(".pv-na:not([aria-current='location']):hover")
    expect(previewCss).not.toContain(".pv-na[aria-current='location'] { background")
  })

  it('uses explicit sample stages for abstract foundation demos', () => {
    for (const selector of [
      '.pv-surface-preview',
      '.pv-type-scale-card',
      '.pv-space-diagram',
      '.pv-shadow-stage',
      '.pv-shell-diagram',
    ]) {
      expect(cssBlock(selector), `${selector} should have preview CSS`).not.toBe('')
    }
  })

  it('keeps the shadow demo clean so elevation tokens do not stack with fake floor shadows', () => {
    expect(previewCss).not.toContain('pv-shadow-floor')
    expect(cssBlock('.pv-shadow-stage')).not.toContain('radial-gradient')
    expect(cssBlock('.pv-shadow-stage')).toContain('background: var(--surface-subtle)')
  })

  it('does not recreate retired glass effects in preview chrome', () => {
    expect(previewCss).not.toContain('backdrop-filter')
    expect(previewCss).not.toContain('radial-gradient')
    expect(previewCss).not.toContain('--glass-')
    expect(previewCss).not.toContain('--lg-blur')
  })

  it('wraps the nested button-group demo on very narrow screens', () => {
    expect(cssBlock('.pv-button-group-demo')).toContain('flex-wrap: wrap')
    expect(cssBlock('.pv-button-group-demo')).toContain('width: 100%')
  })
})
