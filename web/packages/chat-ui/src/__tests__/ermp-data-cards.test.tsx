import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import { AudioCard } from '../ermp/cards/AudioCard'
import { FileCard } from '../ermp/cards/FileCard'
import { KVCard } from '../ermp/cards/KVCard'
import { TableCard } from '../ermp/cards/TableCard'
import { VideoCard } from '../ermp/cards/VideoCard'

afterEach(cleanup)

describe('ermp data cards', () => {
  it('renders FileCard as a download link with the ERMP file size', () => {
    const { container } = render(
      <FileCard
        card={{
          _card: 'file',
          src: 'https://example.com/archive.zip',
          name: 'archive.zip',
          size: 2 * 1024 ** 3,
        }}
      />,
    )

    screen.getByText('archive.zip')
    screen.getByText('2.0 GB')
    const link = container.querySelector('a')
    expect(link?.getAttribute('href')).toBe('https://example.com/archive.zip')
    expect(link?.getAttribute('download')).toBe('')
    expect(link?.getAttribute('target')).toBe('_blank')
  })

  it('renders TableCard columns and rows', () => {
    render(
      <TableCard
        card={{
          _card: 'table',
          columns: [
            { key: 'name', label: 'Name' },
            { key: 'total', label: 'Total', align: 'right' },
          ],
          rows: [{ name: 'Alice', total: 42 }],
        }}
      />,
    )

    screen.getByText('Name')
    screen.getByText('Total')
    screen.getByText('Alice')
    screen.getByText('42')
  })

  it('renders KVCard key/value items', () => {
    render(
      <KVCard
        card={{
          _card: 'kv',
          items: [
            { key: 'Region', value: 'US-East' },
            { key: 'Status', value: 'Running', tag: 'success' },
          ],
        }}
      />,
    )

    screen.getByText('Region')
    screen.getByText('US-East')
    screen.getByText('Status')
    screen.getByText('Running')
  })

  it('sets AudioCard source type through browserMimeType', () => {
    const { container } = render(
      <AudioCard card={{ _card: 'audio', src: 'https://example.com/song.mp3', mimeType: 'AUDIO/MPEG' }} />,
    )

    expect(container.querySelector('audio source')?.getAttribute('type')).toBe('audio/mpeg')
  })

  it('sets VideoCard source type through browserMimeType', () => {
    const { container } = render(
      <VideoCard card={{ _card: 'video', src: 'https://example.com/clip.mp4', mimeType: 'VIDEO/MP4' }} />,
    )

    expect(container.querySelector('video source')?.getAttribute('type')).toBe('video/mp4')
  })
})
