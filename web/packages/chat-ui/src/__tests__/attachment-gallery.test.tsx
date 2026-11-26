// @vitest-environment jsdom
import { cleanup, render } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import { AttachmentGallery } from '../attachments'
import type { AttachmentGalleryItem } from '../attachments'

afterEach(cleanup)

// No `key` here — the package (ScrollableImageRow / AttachmentGallery) owns keying.
const renderItem = (item: AttachmentGalleryItem) => <div data-testid={`item-${item.id}`} data-kind={item.kind} />

describe('AttachmentGallery', () => {
  it('returns null for no items', () => {
    const { container } = render(<AttachmentGallery items={[]} renderItem={renderItem} />)
    expect(container.firstChild).toBeNull()
  })

  it('puts images/files in the scroll row and stacks audio/video OUTSIDE it', () => {
    const items: AttachmentGalleryItem[] = [
      { id: 'a', kind: 'image' }, { id: 'b', kind: 'file' }, { id: 'c', kind: 'audio' }, { id: 'd', kind: 'video' },
    ]
    const { container } = render(<AttachmentGallery items={items} renderItem={renderItem} />)
    // ScrollableImageRow's inner track carries `overflow-x-auto` — scope to it.
    const row = container.querySelector('.overflow-x-auto')
    expect(row).not.toBeNull()
    // image + file live inside the scroll row
    expect(row!.querySelector('[data-testid="item-a"]')).not.toBeNull()
    expect(row!.querySelector('[data-testid="item-b"]')).not.toBeNull()
    // audio + video are stacked OUTSIDE the row (present in the gallery, absent from the row)
    expect(row!.querySelector('[data-testid="item-c"]')).toBeNull()
    expect(row!.querySelector('[data-testid="item-d"]')).toBeNull()
    expect(container.querySelector('[data-testid="item-c"]')).not.toBeNull()
    expect(container.querySelector('[data-testid="item-d"]')).not.toBeNull()
  })

  it('renders only the media stack (no scroll row) when there are no image/file items', () => {
    const { container } = render(
      <AttachmentGallery items={[{ id: 'c', kind: 'audio' }]} renderItem={renderItem} />,
    )
    expect(container.querySelector('.overflow-x-auto')).toBeNull()
    expect(container.querySelector('[data-testid="item-c"]')).not.toBeNull()
  })
})
