/**
 * Editor-local DOM factories for the inline chips (image / video / link) rendered inside
 * the RichTextInput contentEditable. React-free; interaction callbacks are
 * passed explicitly instead of closed over component props.
 * Extracted from RichTextInput.tsx (arch-review F20).
 */
import type { ChatUiFileReferenceIconFactory } from '../../types'
import { appendImageChipPreview } from './image-chip-preview'
import { inlineAttachmentChipStyles } from '../../primitives/attachment-chip-styles'

export interface ChipCallbacks {
  getUploadPreview?: (placeholderUrl: string) => string | undefined
  /** Clicking a chip that has a URL opens a preview. */
  onImagePreview?: (url: string) => void
  /** Clicking an image chip with no URL triggers an upload. */
  onEmptyImageClick?: (alt: string) => void
  /** Visible status for a non-image file whose URL is still an upload placeholder. */
  uploadingAttachmentLabel?: string
  /** App-owned file-type icon used by file references in the editor. */
  createFileReferenceIcon?: ChatUiFileReferenceIconFactory
  removeAttachmentLabel?: string
  onRemoveChip?: (chip: HTMLElement) => void
}

const CHIP_BASE_CLASS =
  `rich-text-media ${inlineAttachmentChipStyles.root} [&+.rich-text-media]:ml-1`

function appendRemoveButton(chip: HTMLElement, callbacks: ChipCallbacks) {
  if (!callbacks.onRemoveChip) return
  const button = document.createElement('button')
  button.type = 'button'
  button.className = inlineAttachmentChipStyles.action
  button.setAttribute('data-chip-remove', 'true')
  button.setAttribute('aria-label', callbacks.removeAttachmentLabel ?? 'Remove attachment')
  button.title = `${callbacks.removeAttachmentLabel ?? 'Remove attachment'}: ${chip.dataset.alt ?? ''}`
  const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  icon.setAttribute('viewBox', '0 0 16 16')
  icon.setAttribute('fill', 'none')
  icon.setAttribute('stroke', 'currentColor')
  icon.setAttribute('stroke-width', '1.5')
  icon.setAttribute('aria-hidden', 'true')
  icon.setAttribute('class', 'size-3 pointer-events-none')
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
  path.setAttribute('d', 'M4 4l8 8M12 4l-8 8')
  path.setAttribute('stroke-linecap', 'round')
  icon.appendChild(path)
  button.appendChild(icon)
  button.addEventListener('click', event => {
    event.preventDefault()
    event.stopPropagation()
    callbacks.onRemoveChip?.(chip)
  })
  chip.appendChild(button)
}

function appendChipText(span: HTMLElement, text: string): void {
  const textSpan = document.createElement('span')
  textSpan.className = `${inlineAttachmentChipStyles.name} select-none pointer-events-none`
  textSpan.title = text
  textSpan.setAttribute('data-chip-label', 'true')
  textSpan.textContent = text
  span.appendChild(textSpan)
}

function looksLikeFilename(label: string): boolean {
  const filename = label.trim().split(/[\\/]/).at(-1) ?? ''
  const dotIndex = filename.lastIndexOf('.')
  if (dotIndex <= 0 || dotIndex === filename.length - 1) return false
  return /^[a-z0-9]{1,10}$/i.test(filename.slice(dotIndex + 1))
}

function fileExtensionLabel(filename: string): string {
  const normalized = filename.trim().split(/[\\/]/).at(-1) ?? ''
  const dotIndex = normalized.lastIndexOf('.')
  if (dotIndex <= 0 || dotIndex === normalized.length - 1) return 'FILE'
  return normalized
    .slice(dotIndex + 1)
    .toUpperCase()
    .slice(0, 4)
}

function appendFileReferenceContents(
  element: HTMLElement,
  display: string,
  isUploading: boolean,
  callbacks: ChipCallbacks,
): void {
  const suppliedIcon = callbacks.createFileReferenceIcon?.(display)
  const iconContainer = document.createElement('span')
  iconContainer.className = inlineAttachmentChipStyles.icon
  iconContainer.setAttribute('aria-hidden', 'true')

  if (suppliedIcon) {
    iconContainer.setAttribute('data-file-type-icon', 'true')
    iconContainer.appendChild(suppliedIcon)
  } else {
    iconContainer.className += ' bg-muted text-[8px] font-semibold tracking-tight text-muted-foreground'
    iconContainer.setAttribute('data-file-type-badge', 'true')
    iconContainer.textContent = fileExtensionLabel(display)
  }
  element.appendChild(iconContainer)

  appendChipText(element, display)
  element.lastElementChild!.setAttribute('data-file-name', 'true')

  if (!isUploading) return

  const status = document.createElement('span')
  status.className = 'flex shrink-0 items-center text-muted-foreground'
  status.setAttribute('data-upload-status', 'true')
  status.setAttribute('aria-hidden', 'true')

  const spinner = document.createElement('span')
  spinner.className = 'size-3 animate-spin rounded-full border-2 border-muted-foreground/30 border-t-muted-foreground'
  spinner.setAttribute('aria-hidden', 'true')
  status.appendChild(spinner)
  element.appendChild(status)
}

// Create a media chip element (image or video)
// lgtm[js/html-constructed-from-input]
export function createMediaElement(
  alt: string,
  url: string,
  mediaType: 'image' | 'video',
  callbacks: ChipCallbacks,
): HTMLSpanElement {
  const span = document.createElement('span')
  const isEmpty = !url || url.trim() === ''
  const isUploading = url.startsWith('uploading:')

  if (isUploading) {
    span.className = CHIP_BASE_CLASS + ' cursor-wait'
    span.setAttribute('aria-busy', 'true')
    span.setAttribute('aria-label', `${alt}, ${callbacks.uploadingAttachmentLabel ?? 'Uploading'}`)
  } else {
    span.className = CHIP_BASE_CLASS + ' cursor-pointer hover:bg-border focus-visible:bg-border'
  }

  span.contentEditable = 'false'
  span.setAttribute('data-url', url)
  span.setAttribute('data-alt', alt)
  span.setAttribute('data-type', mediaType)

  const previewUrl = isUploading ? callbacks.getUploadPreview?.(url) : url
  if (mediaType === 'image') {
    appendImageChipPreview(span, alt, previewUrl, isUploading)
  } else {
    const iconSpan = document.createElement('span')
    iconSpan.className = 'w-4 h-4 flex items-center justify-center text-muted-foreground pointer-events-none'
    iconSpan.textContent = '🎬'
    span.appendChild(iconSpan)
  }

  appendChipText(span, alt)
  appendRemoveButton(span, callbacks)

  // Click handlers — uploading chips have no interaction
  if (!isUploading && isEmpty && callbacks.onEmptyImageClick) {
    // Empty URL: clicking triggers upload
    span.addEventListener('click', (e) => {
      e.preventDefault()
      e.stopPropagation()
      callbacks.onEmptyImageClick?.(alt)
    })
  } else if (!isUploading && !isEmpty && callbacks.onImagePreview) {
    // Has URL: clicking triggers preview
    span.addEventListener('click', (e) => {
      e.preventDefault()
      e.stopPropagation()
      callbacks.onImagePreview?.(url)
    })
  }

  return span
}

// Create a complete, wrapping URL. Keep the rich-text-media marker so the
// editor can still serialize and delete the link as one markdown unit.
export function createLinkElement(display: string, url: string, callbacks: ChipCallbacks = {}): HTMLElement {
  const isWebUrl = /^https?:\/\//i.test(url)
  const isUploading = url.startsWith('uploading:')
  const isFileReference = isUploading || (display !== url && looksLikeFilename(display))
  const element = document.createElement(isWebUrl && !isFileReference ? 'a' : 'span')
  element.className = isFileReference
    ? `${CHIP_BASE_CLASS} ${
        isUploading
          ? 'cursor-wait'
          : 'cursor-pointer hover:bg-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
      }`
    : isWebUrl
      ? 'rich-text-media cursor-pointer break-all text-primary underline underline-offset-2 hover:no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring'
      : 'rich-text-media break-all text-foreground'
  element.contentEditable = 'false'
  element.setAttribute('data-url', url)
  element.setAttribute('data-alt', display)
  element.setAttribute('data-type', 'link')

  if (isFileReference) {
    element.setAttribute('data-file-reference', 'true')
    if (isUploading) {
      element.setAttribute('data-uploading', 'true')
      element.setAttribute('aria-busy', 'true')
      element.setAttribute('aria-label', `${display}, ${callbacks.uploadingAttachmentLabel ?? 'Uploading'}`)
    }
    // Keep the link and remove button as siblings, never nested interactive controls.
    const contents = isWebUrl ? document.createElement('a') : element
    if (contents instanceof HTMLAnchorElement) {
      contents.href = url
      contents.target = '_blank'
      contents.rel = 'noopener noreferrer'
      contents.className = 'inline-flex min-w-0 items-center gap-1.5'
      element.appendChild(contents)
    }
    appendFileReferenceContents(contents, display, isUploading, callbacks)
    appendRemoveButton(element, callbacks)
  } else {
    element.textContent = display
  }

  if (element instanceof HTMLAnchorElement) {
    element.href = url
    element.target = '_blank'
    element.rel = 'noopener noreferrer'
  }

  return element
}
