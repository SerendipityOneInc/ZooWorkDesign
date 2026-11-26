import { fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { ComponentPhysicsHero } from './ComponentPhysicsHero'

describe('ComponentPhysicsHero', () => {
  afterEach(() => vi.restoreAllMocks())

  it('builds the pile from real, non-interactive ZooWork components', () => {
    const { container } = render(<ComponentPhysicsHero />)

    expect(screen.getByRole('region', { name: /interactive zoowork component physics canvas/i })).toBeInTheDocument()
    expect(screen.queryByRole('heading')).not.toBeInTheDocument()
    expect(container.querySelector('[data-slot="button"]')).toBeDisabled()
    expect(container.querySelector('[data-slot="badge"]')).not.toBeNull()
    expect(container.querySelector('[data-slot="tag"]')).not.toBeNull()
    expect(container.querySelector('[data-slot="card"]')).not.toBeNull()
    expect(container.querySelector('[data-slot="component-physics-scene"]')).toHaveAttribute('aria-hidden', 'true')
  })

  it('scatters the pile when the empty stage is clicked', () => {
    const { container } = render(<ComponentPhysicsHero />)
    const hero = container.querySelector('[data-slot="component-physics-hero"]')

    expect(hero).toHaveAttribute('data-scatter', '0')
    fireEvent.click(hero!)
    expect(hero).toHaveAttribute('data-scatter', '1')
  })

  it('uses a static composition when reduced motion is requested', () => {
    vi.spyOn(window, 'matchMedia').mockImplementation((query) => ({
      matches: query.includes('prefers-reduced-motion'),
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }))

    const { container } = render(<ComponentPhysicsHero />)

    expect(container.querySelector('[data-slot="component-physics-hero"]')).toHaveAttribute('data-motion', 'static')
  })
})
