import { fireEvent, render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { App } from './App'

describe('preview App', () => {
  it('switches themes with an icon-only segmented ButtonGroup', () => {
    render(<App />)

    const group = screen.getByRole('group', { name: 'Color scheme' })
    const lightButton = within(group).getByRole('button', { name: 'Light mode' })
    const darkButton = within(group).getByRole('button', { name: 'Dark mode' })

    expect(group).toHaveAttribute('data-variant', 'segmented')
    expect(lightButton).toHaveAttribute('aria-pressed', 'true')
    expect(darkButton).toHaveAttribute('aria-pressed', 'false')
    expect(lightButton).toHaveTextContent('')
    expect(darkButton).toHaveTextContent('')
    expect(lightButton.querySelector('svg')).not.toBeNull()
    expect(darkButton.querySelector('svg')).not.toBeNull()

    fireEvent.click(darkButton)

    expect(document.documentElement).toHaveClass('dark')
    expect(lightButton).toHaveAttribute('aria-pressed', 'false')
    expect(darkButton).toHaveAttribute('aria-pressed', 'true')

    fireEvent.click(lightButton)
    expect(document.documentElement).not.toHaveClass('dark')
  })

  it('renders an unversioned product title and a versioned changelog', () => {
    const { container } = render(<App />)

    expect(container.querySelector('.pv-logo')).toHaveTextContent('ZooWorkDesign')
    expect(container.querySelector('.pv-logo')).not.toHaveTextContent('2.1')
    expect(screen.getByRole('heading', { name: 'Surfaces' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Interaction colors' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Changelog' })).toBeInTheDocument()
    expect(within(container.querySelector('#changelog')!).getByText('Unreleased')).toBeInTheDocument()
    expect(within(container.querySelector('#changelog')!).queryByRole('link', { name: /PR #/ })).not.toBeInTheDocument()
    expect(container.querySelector('#changelog')).toHaveTextContent('distinct public package names')
    expect(screen.getByRole('link', { name: 'Component patterns' })).toHaveAttribute('href', '/?view=patterns&lang=en')
    expect(screen.getByRole('link', { name: 'Credits & licenses' })).toHaveAttribute('href', '/assets/licenses/index.html')
    expect(container.querySelector('.pv-surface-preview')).not.toBeNull()
    expect(container.querySelector('.pv-type-scale-card')).not.toBeNull()
    expect(container.querySelector('.pv-space-diagram')).not.toBeNull()
    expect(container.querySelector('.pv-shadow-stage')).not.toBeNull()
    expect(container.querySelector('.pv-shell-diagram')).not.toBeNull()
    expect(within(container.querySelector('#slider')!).getByRole('slider', { name: 'Thinking effort · Max' })).toHaveAttribute('aria-valuetext', 'Max')
  })

  it('removes the retired Liquid Glass language from the preview', () => {
    const { container } = render(<App />)

    expect(screen.queryByRole('heading', { name: /Liquid Glass/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: /Glass tiers/i })).not.toBeInTheDocument()
    expect(container.querySelector('.pv-glass-tier-stage')).toBeNull()
  })

  it('opens with an introduction, a content-aligned physics canvas, and a text-width nav marker', () => {
    const { container } = render(<App />)

    const main = container.querySelector<HTMLElement>('.pv-main')
    const hero = container.querySelector<HTMLElement>('[data-slot="component-physics-hero"]')
    const purposeLink = screen.getByRole('link', { name: 'Purpose' })

    expect(main).toContainElement(hero)
    expect(hero?.closest('#purpose')).not.toBeNull()
    expect(container.querySelector('.pv-hero-wrap')).toBeNull()
    expect(purposeLink).toHaveAttribute('aria-current', 'location')
    expect(purposeLink.querySelector('.pv-na-label > .pv-nav-marker')).not.toBeNull()
    expect(screen.getByRole('link', { name: 'Principles' })).toHaveAttribute('href', '#principles')
    expect(screen.getByRole('link', { name: 'Styling' })).toHaveAttribute('href', '#styling')
    expect(screen.getByRole('link', { name: 'Motion' })).toHaveAttribute('href', '#motion')
    expect(container.querySelector('#motion .pv-motion-sample')).not.toBeNull()
  })

  it('documents the ZooWork product principles before the foundations', () => {
    const { container } = render(<App />)

    expect(screen.getByRole('heading', { name: /trustworthy ai interfaces/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Neutral by default' })).toBeInTheDocument()
    expect(screen.getByText(/Product UI stays quiet so content and agent state remain primary/i)).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Brand with intent' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Motion explains' })).toBeInTheDocument()
    expect(container.querySelector('#purpose')?.compareDocumentPosition(container.querySelector('#color')!))
      .toBe(Node.DOCUMENT_POSITION_FOLLOWING)
  })

  it('uses ZooWork consistently across user-facing preview copy', () => {
    const { container } = render(<App />)
    const accessibleCopy = Array.from(
      container.querySelectorAll<HTMLElement>('[aria-label], [placeholder], [value], [title], [alt]'),
    ).map((element) => [
      element.getAttribute('aria-label'),
      element.getAttribute('placeholder'),
      element.getAttribute('value'),
      element.getAttribute('title'),
      element.getAttribute('alt'),
    ].filter(Boolean).join(' '))
    const renderedBrandSurface = [container.textContent, ...accessibleCopy].join(' ')

    expect(renderedBrandSurface).toContain('ZooWork')
    // Package import paths retain their published namespace; visible product branding does not.
    expect(renderedBrandSurface.replace(/@zooclaw\/[\w-]+/g, '')).not.toMatch(/ZooClaw/i)
    expect(screen.getByPlaceholderText('name@zoowork.ai')).toBeInTheDocument()
  })

  it('documents Button through a live configurator and behavior-oriented sections', () => {
    const { container } = render(<App />)
    const buttonSection = container.querySelector<HTMLElement>('#button')!
    const section = within(buttonSection)

    expect(section.getByText('Live component')).toBeInTheDocument()
    expect(section.getByRole('heading', { name: 'Anatomy' })).toBeInTheDocument()
    expect(section.getByRole('heading', { name: 'States and behavior' })).toBeInTheDocument()
    expect(section.getByRole('heading', { name: 'Composition' })).toBeInTheDocument()
    expect(section.getByRole('heading', { name: 'Usage' })).toBeInTheDocument()
  })

  it('keeps ButtonGroup with Button and uses neutral semantic borders in layout demos', () => {
    const { container } = render(<App />)
    const buttonSection = container.querySelector<HTMLElement>('#button')!
    const buttonGroupSection = container.querySelector<HTMLElement>('#button-group')!
    const formSection = container.querySelector<HTMLElement>('#form')!
    const buttonGroupNav = screen.getByRole('link', { name: 'ButtonGroup' })
    const scrollArea = container.querySelector<HTMLElement>('#scroll-area [data-slot="scroll-area"]')!

    expect(buttonSection.compareDocumentPosition(buttonGroupSection)).toBe(Node.DOCUMENT_POSITION_FOLLOWING)
    expect(buttonGroupSection.compareDocumentPosition(formSection)).toBe(Node.DOCUMENT_POSITION_FOLLOWING)
    expect(buttonGroupNav.closest('.pv-group')?.querySelector('.pv-ng')).toHaveTextContent('General')
    expect(scrollArea).toHaveClass('border-border', 'rounded-md')
  })

  it('documents notification dots and adaptive quantity badges', () => {
    const { container } = render(<App />)
    const badgeSection = within(container.querySelector<HTMLElement>('#badge')!)

    expect(badgeSection.getByLabelText('Unread messages')).toHaveAttribute('data-shape', 'dot')
    expect(badgeSection.getByLabelText('8 unread messages')).toHaveAttribute('data-variant', 'notification')
    expect(badgeSection.getByText('99+')).toHaveAttribute('data-shape', 'count')
    expect(badgeSection.getByText('24 completed')).toHaveAttribute('data-variant', 'success')
  })

  it('lets people configure the live Button variant, size, shape, icon, and availability states', () => {
    const { container } = render(<App />)
    const lab = container.querySelector<HTMLElement>('.pv-button-lab')!
    const controls = within(lab)
    const preview = controls.getByRole('button', { name: 'Create agent' })

    fireEvent.click(controls.getByRole('radio', { name: 'Outline' }))
    fireEvent.click(controls.getByRole('radio', { name: 'Small' }))
    fireEvent.click(controls.getByRole('radio', { name: 'Pill' }))
    fireEvent.click(controls.getByRole('radio', { name: 'Leading' }))

    expect(preview).toHaveAttribute('data-variant', 'outline')
    expect(preview).toHaveAttribute('data-size', 'sm')
    expect(preview).toHaveClass('rounded-full')
    expect(preview.querySelector('[data-icon="inline-start"]')).not.toBeNull()

    fireEvent.click(controls.getByRole('switch', { name: 'Loading' }))
    expect(preview).toBeDisabled()
    expect(preview).toHaveAttribute('aria-busy', 'true')
  })
})
