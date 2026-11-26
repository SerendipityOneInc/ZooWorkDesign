import { inlineAttachmentChipStyles } from '../../primitives/attachment-chip-styles'

/** Native popovers escape the contentEditable scroll container without a portal. */
function attachHoverPreview(chip: HTMLElement, url: string, name: string): void {
  const preview = document.createElement('span')
  preview.setAttribute('popover', 'manual')
  preview.setAttribute('aria-hidden', 'true')
  preview.setAttribute('data-image-hover-preview', 'true')
  preview.className =
    'm-0 overflow-hidden rounded-[17px] border border-border bg-background p-1 shadow-lg pointer-events-none'
  const image = document.createElement('img')
  image.alt = name
  image.className = 'block max-h-[280px] max-w-[240px] rounded-[12px] object-contain'
  preview.appendChild(image)
  chip.appendChild(preview)
  chip.tabIndex = 0
  const show = () => {
    if (!preview.showPopover) return
    image.src = url
    const bounds = chip.getBoundingClientRect()
    preview.style.left = `${Math.max(8, Math.min(bounds.left, window.innerWidth - 256))}px`
    preview.style.top = 'auto'
    preview.style.bottom = `${window.innerHeight - bounds.top + 8}px`
    preview.showPopover()
  }
  const hide = () => preview.hidePopover?.()
  chip.addEventListener('mouseenter', show)
  chip.addEventListener('mouseleave', hide)
  chip.addEventListener('focus', show)
  chip.addEventListener('blur', hide)
  chip.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') hide()
  })
}

export function appendImageChipPreview(chip: HTMLElement, name: string, url: string | undefined, uploading: boolean) {
  const thumbnail = document.createElement('span')
  thumbnail.className = inlineAttachmentChipStyles.icon
  if (url) {
    const image = document.createElement('img')
    image.src = url
    image.alt = name
    image.className = 'size-5 object-cover object-center pointer-events-none'
    thumbnail.appendChild(image)
  }
  if (uploading) {
    const overlay = document.createElement('span')
    overlay.setAttribute('data-upload-status', 'true')
    overlay.setAttribute('aria-hidden', 'true')
    overlay.className = 'absolute inset-0 flex items-center justify-center rounded bg-black/30'
    const spinner = document.createElement('span')
    spinner.className = 'size-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white'
    overlay.appendChild(spinner)
    thumbnail.appendChild(overlay)
  }
  chip.appendChild(thumbnail)
  if (url) attachHoverPreview(chip, url, name)
}
