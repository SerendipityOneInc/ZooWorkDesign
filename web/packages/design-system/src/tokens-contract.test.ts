import { readdirSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { describe, expect, it } from 'vitest'

// Guards the radix-nova base CSS layer (tokens.css). The ported components use
// custom utilities (cn-*) and keyframe animations that Tailwind silently drops
// when undefined — the build still passes, so a green build does NOT prove the
// classes resolve. This test derives the utilities the components actually use
// and asserts tokens.css defines each, so the contract can't regress unnoticed.

const pkgRoot = join(dirname(fileURLToPath(import.meta.url)), '..')
const tokensCss = readFileSync(join(pkgRoot, 'tokens.css'), 'utf8')
const componentsDir = join(pkgRoot, 'src', 'components')

// Strip comments so we scan real class usage only (e.g. not "shadcn-shaped").
const stripComments = (src: string) =>
  src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '')

const componentSource = readdirSync(componentsDir)
  .filter((f) => f.endsWith('.tsx') && !f.endsWith('.test.tsx'))
  .map((f) => stripComments(readFileSync(join(componentsDir, f), 'utf8')))
  .join('\n')

describe('tokens.css radix-nova base layer contract', () => {
  it('imports tw-animate-css (the animate-in/out/fade/slide/zoom family)', () => {
    expect(tokensCss).toMatch(/@import\s+['"]tw-animate-css['"]/)
  })

  it('defines an @utility for every cn-* class the components use', () => {
    const used = [...new Set([...componentSource.matchAll(/\bcn-[a-z][a-z-]*/g)].map((m) => m[0]))]
    expect(used.length).toBeGreaterThan(0)
    for (const util of used) {
      expect(tokensCss, `tokens.css must define @utility ${util}`).toContain(`@utility ${util}`)
    }
  })

  it('defines theme var + @keyframes for every custom keyframe animation used', () => {
    // tw-animate-css covers the enter/exit family; these are the extra ones.
    for (const name of ['accordion-down', 'accordion-up', 'caret-blink']) {
      if (!componentSource.includes(`animate-${name}`)) continue
      expect(tokensCss, `--animate-${name} theme var`).toContain(`--animate-${name}:`)
      expect(tokensCss, `@keyframes ${name}`).toContain(`@keyframes ${name}`)
    }
  })

  it('documents the 2.0 product UI typography, spacing, radius, and elevation tokens', () => {
    for (const token of [
      '--text-ui-xs',
      '--text-ui-sm',
      '--text-ui-md',
      '--text-ui-lg',
      '--text-title-sm',
      '--text-title-md',
      '--space-control-y',
      '--space-control-x',
      '--space-card',
      '--space-panel',
      '--space-section',
      '--radius-control',
      '--radius-chip',
      '--radius-item',
      '--radius-xs',
      '--radius-sm',
      '--radius-md',
      '--radius-lg',
      '--radius-xl',
      '--elevation-card',
      '--elevation-overlay',
      '--elevation-raised',
      '--elevation-dialog',
    ]) {
      expect(tokensCss, `${token} should be present in tokens.css`).toContain(`${token}:`)
    }
  })

  it('keeps #5755C6 as brand identity while component actions remain neutral', () => {
    expect(tokensCss.match(/--zc-brand:\s*#5755c6/gi)).toHaveLength(2)
    expect(tokensCss).toContain('--zc-action: #181818')
    expect(tokensCss).toContain('--zc-action: #f4f4f4')
    expect(tokensCss).toContain('--primary: var(--zc-action)')
    expect(tokensCss).toContain('--ring: var(--zc-focus)')
    expect(tokensCss).not.toContain('--primary: var(--zc-brand)')
    expect(tokensCss).not.toContain('--ring: var(--zc-brand-focus)')
    expect(componentSource).not.toContain('zc-brand')
  })

  it('exposes the 2.0 brand color as a semantic expressive-motion color', () => {
    expect(tokensCss).toContain('--brand-ink: var(--zc-brand)')
    expect(tokensCss).toContain('--color-brand-ink: var(--brand-ink)')
  })

  it('publishes semantic motion durations, easing curves, and utilities', () => {
    for (const token of [
      '--motion-duration-fast: 120ms',
      '--motion-duration-normal: 180ms',
      '--motion-duration-emphasis: 250ms',
      '--motion-duration-layout: 350ms',
      '--motion-duration-drawn: 800ms',
      '--motion-duration-ambient: 1200ms',
      '--motion-ease-swift: cubic-bezier(0.23, 0.88, 0.26, 0.92)',
      '--motion-ease-enter: cubic-bezier(0.16, 1, 0.3, 1)',
      '--motion-ease-exit: cubic-bezier(0.4, 0, 1, 1)',
    ]) {
      expect(tokensCss, `${token} should be present in tokens.css`).toContain(`${token};`)
    }
    for (const utility of ['motion-fast', 'motion-normal', 'motion-emphasis', 'motion-layout', 'motion-drawn']) {
      expect(tokensCss).toContain(`@utility ${utility}`)
    }
    expect(tokensCss).toContain('--default-transition-duration: var(--duration-normal)')
    expect(tokensCss).toContain('--default-transition-timing-function: var(--ease-swift)')
    expect(tokensCss).toContain('@media (prefers-reduced-motion: reduce)')
    expect(tokensCss).toContain('animation-iteration-count: 1 !important')
  })

  it('keeps dark neutrals on a neutral charcoal scale without a blue cast', () => {
    for (const [token, value] of [
      ['--zc-paper', '#1a1a1a'],
      ['--zc-canvas', '#111111'],
      ['--zc-sidebar', '#161616'],
      ['--zc-surface-subtle', '#202020'],
      ['--zc-hover', '#242424'],
      ['--zc-selected', '#242424'],
      ['--zc-line', '#2e2e2e'],
      ['--zc-line-strong', '#3b3b3b'],
    ]) {
      expect(tokensCss, `${token} should avoid blue-tinted dark neutrals`).toContain(`${token}: ${value}`)
    }
  })

  it('separates layout surfaces while keeping hover and selection feedback consistent', () => {
    expect(tokensCss).toContain('--zc-canvas: #fafafa')
    expect(tokensCss).toContain('--zc-sidebar: #f5f5f5')
    expect(tokensCss).toContain('--zc-surface-subtle: #f3f3f3')
    expect(tokensCss).toContain('--zc-hover: #f6f6f6')
    expect(tokensCss).toContain('--zc-selected: #f6f6f6')
    expect(tokensCss).toContain('--zc-line: #e5e5e5')
    expect(tokensCss).toContain('--hover: var(--zc-hover)')
    expect(tokensCss).toContain('--selected: var(--zc-selected)')
    expect(tokensCss).toContain('--accent: var(--zc-hover)')
    expect(tokensCss).toContain('--color-hover: var(--hover)')
    expect(tokensCss).toContain('--color-selected: var(--selected)')
  })

  it('uses a quiet neutral focus color for form controls', () => {
    expect(tokensCss).toContain('--zc-focus: #b3b3b3')
    expect(tokensCss).toContain('--zc-focus: #737373')
  })

  it('keeps the entire neutral palette achromatic', () => {
    const neutralPattern =
      /--zc-(?:action(?:-hover|-active)?|focus|ink(?:-2|-3)?|paper|canvas|sidebar|surface-subtle|hover|selected|line(?:-subtle|-strong)?|tooltip-bg):\s*#([0-9a-f]{6})/gi
    const values = [...tokensCss.matchAll(neutralPattern)].map((match) => match[1])

    expect(values.length).toBeGreaterThanOrEqual(30)
    for (const value of values) {
      expect(new Set(value.match(/.{2}/g)).size, `#${value} should be achromatic`).toBe(1)
    }
  })

  it('keeps the legacy wash token as an opaque neutral surface alias', () => {
    expect(tokensCss).toContain('--zc-wash: var(--zc-surface-subtle)')
  })

  it('maps the old glass vocabulary to opaque compatibility surfaces', () => {
    for (const [token, value] of [
      ['--lg-glass-panel', 'var(--surface)'],
      ['--lg-glass-card', 'var(--surface)'],
      ['--lg-glass-task', 'var(--surface-subtle)'],
      ['--lg-glass-control', 'var(--control-background)'],
      ['--lg-glass-composer', 'var(--surface)'],
      ['--lg-glass-border', 'var(--border)'],
      ['--lg-glass-border-subtle', 'var(--separator)'],
      ['--lg-blur-panel', '0px'],
      ['--lg-blur-card', '0px'],
    ]) {
      expect(tokensCss).toContain(`${token}: ${value}`)
    }

    expect(tokensCss).not.toMatch(/--lg-glass-(?:panel|composer):\s*linear-gradient/)
  })

  it('uses flat elevations without glass inset highlights', () => {
    expect(tokensCss).toContain('--elevation-card: 0 1px 2px rgb(0 0 0 / 0.04)')
    expect(tokensCss).toContain('--elevation-overlay: 0 8px 24px rgb(0 0 0 / 0.1)')
    expect(tokensCss).toContain('--elevation-dialog: 0 20px 48px rgb(0 0 0 / 0.16)')
    expect(tokensCss).toContain('--lg-surface-inset-highlight: none')
    expect(tokensCss).toContain('--surface-inset-highlight: none')
  })

  it('does not override component-owned focus outlines or validation rings globally', () => {
    // Unlayered global focus declarations override Tailwind's outline-none,
    // including the borderless contenteditable inside ChatComposer.
    expect(tokensCss).not.toMatch(/(?:^|})\s*:focus-visible\s*\{/m)
    expect(tokensCss).not.toMatch(/--tw-ring(?:-offset)?-shadow\s*:/)
    for (const [, value] of tokensCss.matchAll(/outline(?:-color|-offset)?\s*:([^;]+);/g)) {
      expect(value.trim()).toMatch(/^none(?: !important)?$/)
    }
  })

  it('keeps pointer-restored focus quiet while preserving keyboard focus styles', () => {
    expect(tokensCss).toContain("[data-zc-focus-modality='pointer']:focus-visible")
    expect(tokensCss).not.toContain(":root[data-zc-input-modality='pointer'] :focus-visible {")
    expect(tokensCss).toContain(
      "[data-slot='input-group-control'][data-zc-focus-modality='pointer']:focus-visible",
    )
  })

  it('provides dedicated Switch tokens with a neutral on state', () => {
    for (const token of [
      '--switch-track-off',
      '--switch-track-on',
      '--switch-thumb-off',
      '--switch-thumb-on',
      '--switch-track-disabled',
      '--switch-thumb-disabled',
    ]) {
      expect(tokensCss, `${token} should be present in tokens.css`).toContain(`${token}:`)
    }

    expect(tokensCss).toContain('--switch-track-off: var(--zc-line-strong)')
    expect(tokensCss).toContain('--switch-track-on: var(--primary)')
    expect(tokensCss).toContain('--switch-thumb-on: #ffffff')
  })

  it('provides dedicated outline Button border tokens for flat surfaces', () => {
    for (const token of ['--button-outline-border', '--button-outline-border-hover']) {
      expect(tokensCss, `${token} should be present in tokens.css`).toContain(`${token}:`)
    }

    expect(tokensCss).toContain('--button-outline-border: var(--zc-line)')
    expect(tokensCss).toContain('--button-outline-border-hover: var(--zc-line-strong)')
  })
})
