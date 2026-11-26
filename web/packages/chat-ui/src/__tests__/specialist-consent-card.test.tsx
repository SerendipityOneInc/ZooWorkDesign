// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { SpecialistConsentCard } from '../specialist/SpecialistConsentCard'

afterEach(cleanup)

describe('SpecialistConsentCard', () => {
  it('renders the provided body and one button per label', () => {
    render(
      <SpecialistConsentCard
        labels={['Yes', 'No']}
        body={<div data-testid="body">hi</div>}
        variant="neutral"
        onButtonClick={vi.fn()}
      />,
    )

    expect(screen.getByTestId('body').textContent).toBe('hi')
    screen.getByTestId('specialist-consent-button-Yes')
    screen.getByTestId('specialist-consent-button-No')
  })

  it('submits and consumes all choices after the first click', () => {
    const onButtonClick = vi.fn()
    render(
      <SpecialistConsentCard
        labels={['Yes', 'No']}
        body={<div>Choose</div>}
        variant="neutral"
        chosenLabelTemplate="Decision: {label}"
        onButtonClick={onButtonClick}
      />,
    )

    fireEvent.click(screen.getByTestId('specialist-consent-button-Yes'))

    expect(onButtonClick).toHaveBeenCalledTimes(1)
    expect(onButtonClick).toHaveBeenCalledWith('Yes')
    expect((screen.getByTestId('specialist-consent-button-Yes') as HTMLButtonElement).disabled).toBe(true)
    expect((screen.getByTestId('specialist-consent-button-No') as HTMLButtonElement).disabled).toBe(true)
    expect(screen.getByTestId('specialist-consent-button-Yes').textContent).toContain('✓ Yes')
    expect(screen.getByTestId('specialist-consent-chosen').textContent).toBe('Decision: Yes')
  })

  it('renders the destructive card and warning banner', () => {
    render(
      <SpecialistConsentCard
        labels={['Delete']}
        body={<div>Choose</div>}
        variant="destructive"
        destructiveBannerLabel="Destructive action"
        onButtonClick={vi.fn()}
      />,
    )

    screen.getByTestId('specialist-consent-card-destructive')
    screen.getByText('⚠️')
    screen.getByText('Destructive action')
  })

  it('renders the neutral card without a warning banner', () => {
    render(
      <SpecialistConsentCard
        labels={['Continue']}
        body={<div>Choose</div>}
        variant="neutral"
        destructiveBannerLabel="Destructive action"
        onButtonClick={vi.fn()}
      />,
    )

    screen.getByTestId('specialist-consent-card-neutral')
    expect(screen.queryByText(/Destructive action/)).toBeNull()
  })

  it('renders nothing when no labels are provided', () => {
    render(
      <SpecialistConsentCard labels={[]} body={<div>Choose</div>} variant="neutral" onButtonClick={vi.fn()} />,
    )

    expect(screen.queryByTestId('specialist-consent-card-neutral')).toBeNull()
  })
})
