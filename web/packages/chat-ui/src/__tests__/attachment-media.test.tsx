// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { AudioAttachment, ImageAttachment, VideoAttachment } from '../attachments'
import type { AttachmentView } from '../attachments'

afterEach(cleanup)

const view = (over: Partial<AttachmentView> = {}): AttachmentView => ({
  id: 'f1', kind: 'image', url: 'blob:img', name: 'a.png', mimeType: 'image/png', ...over,
})

describe('attachment media renderers', () => {
  it('renders an image and fires onPreview on click', () => {
    const onPreview = vi.fn()
    render(<ImageAttachment view={view()} onPreview={onPreview} />)
    const img = screen.getByTestId('genclaw-mm-image-attachment') as HTMLImageElement
    expect(img.getAttribute('src')).toBe('blob:img')
    fireEvent.click(img)
    expect(onPreview).toHaveBeenCalledTimes(1)
  })

  it('shows the image loading placeholder when url is null', () => {
    render(<ImageAttachment view={view({ url: null })} />)
    screen.getByTestId('genclaw-mm-image-attachment-loading') // throws if absent
    expect(screen.queryByTestId('genclaw-mm-image-attachment')).toBeNull()
  })

  it('renders a video card and fires onPreview', () => {
    const onPreview = vi.fn()
    render(<VideoAttachment view={view({ kind: 'video', url: 'blob:vid', name: 'v.mp4', mimeType: 'video/mp4' })} onPreview={onPreview} />)
    const btn = screen.getByRole('button')
    fireEvent.click(btn)
    expect(onPreview).toHaveBeenCalledTimes(1)
  })

  it('renders video as a non-interactive shell (no button) when onPreview is omitted', () => {
    render(<VideoAttachment view={view({ kind: 'video', url: 'blob:vid', name: 'v.mp4', mimeType: 'video/mp4' })} />)
    expect(screen.queryByRole('button')).toBeNull()
    screen.getByTestId('genclaw-mm-video-attachment') // the <video> still renders
  })

  it('renders an audio player with a source when resolved', () => {
    render(<AudioAttachment view={view({ kind: 'audio', url: 'blob:aud', name: 's.mp3', mimeType: 'audio/mpeg', size: 2048 })} />)
    const audio = screen.getByTestId('genclaw-mm-audio-attachment')
    expect(audio.querySelector('source')?.getAttribute('src')).toBe('blob:aud')
  })
})
