import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Progress } from './progress'

describe('Progress', () => {
  it('renders root with data-slot="progress"', () => {
    const { container } = render(<Progress value={50} />)
    expect(container.querySelector('[data-slot="progress"]')).toBeTruthy()
  })

  it('renders indicator with data-slot="progress-indicator"', () => {
    const { container } = render(<Progress value={50} />)
    expect(container.querySelector('[data-slot="progress-indicator"]')).toBeTruthy()
  })

  it('indicator uses the 2.0 neutral primary fill', () => {
    const { container } = render(<Progress value={75} />)
    const indicator = container.querySelector('[data-slot="progress-indicator"]')
    expect(indicator).toHaveClass('bg-primary')
  })

  it('indicator translateX reflects value=0', () => {
    const { container } = render(<Progress value={0} />)
    const indicator = container.querySelector('[data-slot="progress-indicator"]') as HTMLElement
    expect(indicator.style.transform).toBe('translateX(-100%)')
  })

  it('indicator translateX reflects value=100', () => {
    const { container } = render(<Progress value={100} />)
    const indicator = container.querySelector('[data-slot="progress-indicator"]') as HTMLElement
    expect(indicator.style.transform).toMatch(/translateX\(-?0%\)/)
  })

  it('accepts extra className', () => {
    const { container } = render(<Progress value={50} className="my-progress" />)
    expect(container.querySelector('[data-slot="progress"]')).toHaveClass('my-progress')
  })
})
