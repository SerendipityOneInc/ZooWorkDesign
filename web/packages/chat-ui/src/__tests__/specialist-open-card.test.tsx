// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { humanizeAgentId, SpecialistOpenCard } from '../specialist/SpecialistOpenCard'

afterEach(cleanup)

const baseProps = {
  agentId: 'research_analysis',
  displayName: 'Research Analysis',
  greeting: 'Say hi 👋',
  ariaLabel: 'Start chat with Research Analysis',
}

describe('SpecialistOpenCard', () => {
  it('renders the specialist identity, greeting, and accessibility attributes', () => {
    render(<SpecialistOpenCard {...baseProps} onOpen={vi.fn()} />)

    const card = screen.getByTestId('specialist-open-card')
    expect(card.getAttribute('data-agent-id')).toBe('research_analysis')
    expect(card.getAttribute('aria-label')).toBe('Start chat with Research Analysis')
    expect(card.textContent).toContain('Research Analysis')
    expect(card.textContent).toContain('Say hi 👋')
  })

  it('opens the specialist on click', () => {
    const onOpen = vi.fn()
    render(<SpecialistOpenCard {...baseProps} onOpen={onOpen} />)

    fireEvent.click(screen.getByTestId('specialist-open-card'))

    expect(onOpen).toHaveBeenCalledTimes(1)
    expect(onOpen).toHaveBeenCalledWith('research_analysis')
  })

  it.each(['Enter', ' '])('opens the specialist on %s', (key) => {
    const onOpen = vi.fn()
    render(<SpecialistOpenCard {...baseProps} onOpen={onOpen} />)

    fireEvent.keyDown(screen.getByTestId('specialist-open-card'), { key })

    expect(onOpen).toHaveBeenCalledTimes(1)
    expect(onOpen).toHaveBeenCalledWith('research_analysis')
  })

  it('renders an avatar image and falls back to the display-name monogram on error', () => {
    render(<SpecialistOpenCard {...baseProps} avatarUrl="https://example.com/avatar.png" onOpen={vi.fn()} />)

    const card = screen.getByTestId('specialist-open-card')
    const image = card.querySelector('img')
    expect(image?.getAttribute('src')).toBe('https://example.com/avatar.png')

    fireEvent.error(image as HTMLImageElement)

    expect(card.querySelector('img')).toBeNull()
    expect(card.textContent).toContain('RA')
  })

  it('renders the display-name monogram when the avatar URL is absent', () => {
    render(<SpecialistOpenCard {...baseProps} onOpen={vi.fn()} />)

    const card = screen.getByTestId('specialist-open-card')
    expect(card.querySelector('img')).toBeNull()
    expect(card.textContent).toContain('RA')
  })
})

describe('humanizeAgentId', () => {
  it('humanizes underscore- and hyphen-delimited agent IDs', () => {
    expect(humanizeAgentId('research_analysis')).toBe('Research Analysis')
    expect(humanizeAgentId('market-analyst')).toBe('Market Analyst')
  })
})
