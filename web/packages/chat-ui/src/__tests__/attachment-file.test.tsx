// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { FileAttachment } from '../attachments'
import type { AttachmentView } from '../attachments'

afterEach(cleanup)

const fileView = (over: Partial<AttachmentView> = {}): AttachmentView => ({
  id: 'f1', kind: 'file', url: null, name: 'report.pdf', mimeType: 'application/pdf', ...over,
})

describe('FileAttachment', () => {
  it('shows the ext label and fires onDownload without triggering preview', () => {
    const onDownload = vi.fn()
    const onPreview = vi.fn()
    render(<FileAttachment view={fileView()} onDownload={onDownload} onPreview={onPreview} />)
    expect(screen.getByText('PDF')).toBeTruthy()
    fireEvent.click(screen.getByRole('button')) // the download button
    expect(onDownload).toHaveBeenCalledTimes(1)
    expect(onPreview).not.toHaveBeenCalled()
  })

  it('fires onPreview when previewable and a handler is provided', () => {
    const onPreview = vi.fn()
    const { container } = render(
      <FileAttachment view={fileView({ previewable: true })} onPreview={onPreview} />,
    )
    const card = container.querySelector('[role="button"][tabindex="0"]') as HTMLElement
    fireEvent.click(card)
    expect(onPreview).toHaveBeenCalledTimes(1)
  })

  it('is not previewable without the previewable flag', () => {
    const { container } = render(<FileAttachment view={fileView({ previewable: false })} onPreview={vi.fn()} />)
    expect(container.querySelector('[role="button"][tabindex="0"]')).toBeNull()
  })

  it('renders no download button when onDownload is omitted (no dead affordance)', () => {
    const { container } = render(<FileAttachment view={fileView()} />)
    expect(container.querySelector('button')).toBeNull()
  })
})
