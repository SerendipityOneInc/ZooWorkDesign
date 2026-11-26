import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { ERMPCardRenderer } from '../index'
import type { CompositeCard, ERMPCard, VideoCard as VideoCardType } from '../index'

afterEach(cleanup)

const onCallback = vi.fn()
const onFormSubmit = vi.fn()

function renderCard(card: ERMPCard) {
  return render(<ERMPCardRenderer card={card} onCallback={onCallback} onFormSubmit={onFormSubmit} />)
}

describe('ermp/ERMPCardRenderer', () => {
  it('dispatches every _card discriminator to its renderer', () => {
    const { container, rerender } = renderCard({ _card: 'audio', src: 'song.mp3' })
    expect(container.querySelector('audio')).not.toBeNull()

    const videoCard: VideoCardType = { _card: 'video', src: 'clip.mp4' }
    rerender(
      <ERMPCardRenderer
        card={videoCard}
        onCallback={onCallback}
        onFormSubmit={onFormSubmit}
      />,
    )
    expect(container.querySelector('video')).not.toBeNull()

    rerender(
      <ERMPCardRenderer
        card={{ _card: 'file', src: 'report.pdf', name: 'report.pdf' }}
        onCallback={onCallback}
        onFormSubmit={onFormSubmit}
      />,
    )
    expect(container.querySelector('a')?.getAttribute('href')).toBe('report.pdf')

    rerender(
      <ERMPCardRenderer
        card={{ _card: 'table', columns: [{ key: 'name', label: 'Name' }], rows: [{ name: 'Alice' }] }}
        onCallback={onCallback}
        onFormSubmit={onFormSubmit}
      />,
    )
    screen.getByText('Alice')

    rerender(
      <ERMPCardRenderer
        card={{ _card: 'kv', items: [{ key: 'Region', value: 'US-East' }] }}
        onCallback={onCallback}
        onFormSubmit={onFormSubmit}
      />,
    )
    screen.getByText('US-East')

    rerender(
      <ERMPCardRenderer
        card={{ _card: 'actions', buttons: [{ label: 'Approve', action: 'callback', value: 'approve' }] }}
        onCallback={onCallback}
        onFormSubmit={onFormSubmit}
      />,
    )
    screen.getByRole('button', { name: 'Approve' })

    rerender(
      <ERMPCardRenderer
        card={{ _card: 'form', fields: [{ name: 'name', label: 'Name', type: 'text' }] }}
        onCallback={onCallback}
        onFormSubmit={onFormSubmit}
      />,
    )
    screen.getByRole('button', { name: 'Submit' })

    rerender(
      <ERMPCardRenderer
        card={{
          _card: 'composite',
          title: 'Summary',
          sections: [{ _card: 'kv', items: [{ key: 'Status', value: 'Ready' }] }],
        }}
        onCallback={onCallback}
        onFormSubmit={onFormSubmit}
      />,
    )
    screen.getByText('Summary')
    screen.getByText('Ready')
  })

  it('renders _fallback for an unknown discriminator', () => {
    renderCard({ _card: 'unknown', _fallback: 'Unsupported card' } as unknown as ERMPCard)

    screen.getByText('Unsupported card')
  })

  it('renders null for an unknown discriminator without _fallback', () => {
    const { container } = renderCard({ _card: 'unknown' } as unknown as ERMPCard)

    expect(container.innerHTML).toBe('')
  })

  it('threads readOnly through a composite into nested actions', () => {
    const card: CompositeCard = {
      _card: 'composite',
      sections: [
        {
          _card: 'actions',
          _id: 'nested-actions',
          buttons: [{ label: 'Approve', action: 'callback', value: 'approve' }],
        },
      ],
    }

    render(
      <ERMPCardRenderer card={card} readOnly onCallback={onCallback} onFormSubmit={onFormSubmit} />,
    )

    const callback = screen.getByRole('button', { name: 'Approve' }) as HTMLButtonElement
    expect(callback.disabled).toBe(true)
  })

  it('threads isSubmitted through a composite into nested actions', () => {
    const card: CompositeCard = {
      _card: 'composite',
      sections: [
        {
          _card: 'actions',
          _id: 'nested-actions',
          buttons: [{ label: 'Approve', action: 'callback', value: 'approve' }],
        },
      ],
    }
    const isSubmitted = vi.fn((cardId?: string) => cardId === 'nested-actions')

    render(
      <ERMPCardRenderer
        card={card}
        isSubmitted={isSubmitted}
        onCallback={onCallback}
        onFormSubmit={onFormSubmit}
      />,
    )

    const submitted = screen.getByRole('button', { name: 'Submitted' }) as HTMLButtonElement
    expect(submitted.disabled).toBe(true)
    expect(isSubmitted).toHaveBeenCalledWith('nested-actions')
  })
})
