/**
 * Editor-local Markdown ↔ contentEditable-DOM conversion, plus the
 * selection-based in-place editing helpers (URL auto-conversion, uploading
 * chip reconciliation). React-free; operates on the editor element and the
 * current window selection. Extracted from RichTextInput.tsx (arch-review F20).
 */
import { createLinkElement, createMediaElement } from './chip-elements'
import type { ChipCallbacks } from './chip-elements'
import { findUploadedMediaUrl } from './utils'

/** Convert editor DOM content to a markdown string. */
export function editorToMarkdown(editor: HTMLElement): string {
  const processNode = (node: Node): string => {
    if (node.nodeType === Node.TEXT_NODE) {
      return node.textContent || ''
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as HTMLElement

      if (element.classList.contains('rich-text-media')) {
        const url = element.getAttribute('data-url') || ''
        const alt = element.getAttribute('data-alt') || ''
        const mediaType = element.getAttribute('data-type') || 'image'
        if (mediaType === 'link') {
          return `[${alt || url}](${url})`
        } else if (mediaType === 'video') {
          return `[video:${alt}](${url})`
        } else {
          return `![${alt}](${url})`
        }
      } else if (element.tagName === 'BR') {
        return '\n'
      } else if (element.tagName === 'DIV') {
        // Newlines in contentEditable produce wrapper DIVs — process recursively
        let divContent = ''
        for (const child of Array.from(element.childNodes)) {
          divContent += processNode(child)
        }
        return '\n' + divContent
      } else {
        let content = ''
        for (const child of Array.from(element.childNodes)) {
          content += processNode(child)
        }
        return content
      }
    }
    return ''
  }

  let markdown = ''
  for (const node of Array.from(editor.childNodes)) {
    markdown += processNode(node)
  }

  return markdown
}

/** Move the cursor to the end of the editor content. */
export function moveCursorToEnd(editor: HTMLElement): void {
  const range = document.createRange()
  const selection = window.getSelection()
  range.selectNodeContents(editor)
  range.collapse(false)
  selection?.removeAllRanges()
  selection?.addRange(range)
}

interface MarkdownPart {
  type: 'text' | 'image' | 'video' | 'link'
  content: string
  alt?: string
  url?: string
}

/** Parse a markdown string into typed parts: text | image | video | link. */
function parseMarkdownParts(markdown: string): MarkdownPart[] {
  const parts: MarkdownPart[] = []
  let cursor = 0
  let textStart = 0
  let lastNonWhitespace = ''
  let imageCount = 0
  let videoCount = 0

  while (cursor < markdown.length) {
    let type: Exclude<MarkdownPart['type'], 'text'> | undefined
    let labelStart = 0

    if (markdown.startsWith('![', cursor)) {
      type = 'image'
      labelStart = cursor + 2
    } else if (markdown.startsWith('[video:', cursor)) {
      type = 'video'
      labelStart = cursor + 7
    } else if (markdown[cursor] === '[' && lastNonWhitespace !== '!') {
      type = 'link'
      labelStart = cursor + 1
    }

    if (!type) {
      const character = markdown[cursor]
      if (character.trim() !== '') lastNonWhitespace = character
      cursor += 1
      continue
    }

    const labelEnd = markdown.indexOf(']', labelStart)
    if (labelEnd === -1) break

    // A closing bracket without an immediately following parenthesis cannot
    // complete this candidate. Advancing past it keeps the scan linear while
    // allowing a later, independent markdown token to match.
    if (markdown[labelEnd + 1] !== '(') {
      cursor = labelEnd + 1
      lastNonWhitespace = ']'
      continue
    }

    const urlStart = labelEnd + 2
    const urlEnd = markdown.indexOf(')', urlStart)
    if (urlEnd === -1) break

    if (cursor > textStart) {
      parts.push({
        type: 'text',
        content: markdown.slice(textStart, cursor),
      })
    }

    const label = markdown.slice(labelStart, labelEnd)
    const url = markdown.slice(urlStart, urlEnd)
    const content = markdown.slice(cursor, urlEnd + 1)

    if (type === 'image') {
      imageCount += 1
      parts.push({
        type: 'image',
        content,
        alt: label || `image${imageCount}`,
        url,
      })
    } else if (type === 'video') {
      videoCount += 1
      parts.push({
        type: 'video',
        content,
        alt: label || `video${videoCount}`,
        url,
      })
    } else {
      parts.push({
        type: 'link',
        content,
        alt: label || url,
        url,
      })
    }

    cursor = urlEnd + 1
    textStart = cursor
    lastNonWhitespace = ')'
  }

  if (textStart < markdown.length) {
    parts.push({
      type: 'text',
      content: markdown.slice(textStart),
    })
  }

  return parts
}

/** Append text content to a parent node, converting newlines to <br>. */
function appendTextWithLineBreaks(parent: Node, text: string): void {
  const lines = text.split('\n')
  lines.forEach((line, index) => {
    if (line) {
      parent.appendChild(document.createTextNode(line))
    }
    if (index < lines.length - 1) {
      parent.appendChild(document.createElement('br'))
    }
  })
}

/** Render a markdown string into the editor DOM, preserving focus/cursor where possible. */
export function renderMarkdownIntoEditor(editor: HTMLElement, markdown: string, callbacks: ChipCallbacks): void {
  // A Range is live: clearing the editor relocates its endpoints to offset 0.
  // It cannot be reused after the rebuild, even if it still belongs to editor.
  const hadFocus = document.activeElement === editor

  editor.innerHTML = ''

  parseMarkdownParts(markdown).forEach((part) => {
    if (part.type === 'text') {
      appendTextWithLineBreaks(editor, part.content)
    } else if (part.type === 'image' || part.type === 'video') {
      editor.appendChild(createMediaElement(part.alt!, part.url!, part.type, callbacks))
    } else if (part.type === 'link') {
      editor.appendChild(createLinkElement(part.alt!, part.url!, callbacks))
    }
  })

  // External changes continue after the new content without stealing focus
  // from a menu, file picker or another editor.
  if (hadFocus) moveCursorToEnd(editor)
}

/**
 * Incrementally update uploading media chips in-place to avoid full DOM
 * rebuild (which would break IME state and cursor position).
 */
export function tryUpdateUploadingMedia(editor: HTMLElement, newValue: string, callbacks: ChipCallbacks): boolean {
  const uploadingElements = editor.querySelectorAll('.rich-text-media[data-url^="uploading:"]')
  if (uploadingElements.length === 0) return false

  // Real filenames can repeat. A label-only incremental match would resolve
  // both placeholders to the first uploaded URL; let the normal render keep
  // the distinct URLs and restore the selection in that case.
  const labels = Array.from(editor.querySelectorAll('.rich-text-media'), (chip) => chip.getAttribute('data-alt'))
  if (
    Array.from(uploadingElements).some(
      (chip) => labels.filter((label) => label === chip.getAttribute('data-alt')).length > 1,
    )
  )
    return false

  let anyUpdated = false

  for (const el of Array.from(uploadingElements)) {
    const placeholderUrl = el.getAttribute('data-url')!
    // Still uploading — skip
    if (newValue.includes(placeholderUrl)) continue

    const alt = el.getAttribute('data-alt') || ''
    const mediaType = (el.getAttribute('data-type') || 'image') as 'image' | 'video' | 'link'

    const newUrl = findUploadedMediaUrl(newValue, alt, mediaType)

    if (newUrl) {
      // Upload succeeded: replace placeholder chip with final chip
      const newElement =
        mediaType === 'link'
          ? createLinkElement(alt, newUrl, callbacks)
          : createMediaElement(alt, newUrl, mediaType, callbacks)
      el.parentNode?.replaceChild(newElement, el)
    } else {
      // Upload failed or item was removed
      el.remove()
    }
    anyUpdated = true
  }

  return anyUpdated
}

/**
 * Detect a just-completed URL at the cursor (triggered by typing a space
 * after a URL) and convert it to a link chip in-place.
 *
 * Precondition: operates on the global `window.getSelection()` and assumes
 * the caret currently sits inside the rich-text editor. Only call it from
 * the editor's own input handler (where that holds by construction) — from
 * any other path it would mutate whatever node owns the selection.
 *
 * Performance: exits immediately if the character just before the cursor
 * is not a space, so the regex only runs when there is a real chance of a
 * URL being present.
 */
export function detectAndConvertUrlAtCursor(): void {
  const selection = window.getSelection()
  if (!selection || selection.rangeCount === 0 || !selection.isCollapsed) return

  const range = selection.getRangeAt(0)
  const node = range.startContainer
  if (node.nodeType !== Node.TEXT_NODE) return

  const text = node.textContent || ''
  const cursorOffset = range.startOffset

  // Fast exit: only run the regex when the character before the cursor is a space
  if (cursorOffset === 0 || text[cursorOffset - 1] !== ' ') return

  // Check if the text before the cursor ends with "URL "
  const textBeforeCursor = text.slice(0, cursorOffset)
  const urlMatch = textBeforeCursor.match(/(https?:\/\/[^\s<>'")\]]+)\s$/)
  if (!urlMatch) return

  const url = urlMatch[1]
  const matchStart = urlMatch.index!
  const matchEnd = matchStart + url.length

  // Split the text node: [beforeText][linkChip][ ][afterText]
  const beforeText = text.slice(0, matchStart)
  const afterText = text.slice(matchEnd + 1) // skip the triggering space

  const parent = node.parentNode
  if (!parent) return

  const fragment = document.createDocumentFragment()
  if (beforeText) {
    fragment.appendChild(document.createTextNode(beforeText))
  }

  const linkEl = createLinkElement(url, url)
  fragment.appendChild(linkEl)

  // Keep a space after the chip so the cursor lands in an editable position
  const trailingText = document.createTextNode(' ' + afterText)
  fragment.appendChild(trailingText)

  parent.replaceChild(fragment, node)

  // Place cursor after the space that follows the chip
  const newRange = document.createRange()
  newRange.setStart(trailingText, 1)
  newRange.collapse(true)
  selection.removeAllRanges()
  selection.addRange(newRange)
}

/** Insert a markdown string (possibly containing media/link syntax) at the cursor. */
export function insertMarkdownAtCursor(text: string, callbacks: ChipCallbacks): void {
  const selection = window.getSelection()
  if (!selection || selection.rangeCount === 0) return

  const range = selection.getRangeAt(0)
  range.deleteContents()

  const fragment = document.createDocumentFragment()
  const parts = text.split(/(!\[[^\]]*\]\([^)]*\)|\[video:[^\]]*\]\([^)]*\)|\[[^\]]*\]\([^)]*\))/g)

  parts.forEach((part) => {
    if (!part) return

    const imageMatch = part.match(/^!\[([^\]]*)\]\(([^)]*)\)$/)
    const videoMatch = part.match(/^\[video:([^\]]*)\]\(([^)]*)\)$/)
    const linkMatch = part.match(/^\[([^\]]*)\]\(([^)]*)\)$/)

    if (imageMatch) {
      fragment.appendChild(createMediaElement(imageMatch[1], imageMatch[2], 'image', callbacks))
    } else if (videoMatch) {
      fragment.appendChild(createMediaElement(videoMatch[1], videoMatch[2], 'video', callbacks))
    } else if (linkMatch) {
      fragment.appendChild(createLinkElement(linkMatch[1], linkMatch[2], callbacks))
    } else {
      appendTextWithLineBreaks(fragment, part)
    }
  })

  range.insertNode(fragment)
  range.collapse(false)
  selection.removeAllRanges()
  selection.addRange(range)
}

/**
 * Extract markdown from pasted HTML that contains our own chip elements
 * (cut/copied from the editor): chips become their markdown syntax, other
 * nodes contribute their text content.
 */
export function extractChipMarkdownFromHtml(htmlData: string): string {
  // DOMParser yields an inert document: scripts don't run and resources
  // don't load while we walk the pasted markup for chip attributes.
  const parsedBody = new DOMParser().parseFromString(htmlData, 'text/html').body

  let result = ''
  const walk = (node: Node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      result += node.textContent || ''
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as HTMLElement
      if (element.classList.contains('rich-text-media')) {
        const url = element.getAttribute('data-url') || ''
        const alt = element.getAttribute('data-alt') || ''
        const mediaType = element.getAttribute('data-type') || 'image'
        if (mediaType === 'link') {
          result += `[${alt}](${url})`
        } else if (mediaType === 'video') {
          result += `[video:${alt}](${url})`
        } else {
          result += `![${alt}](${url})`
        }
      } else {
        node.childNodes.forEach(walk)
      }
    }
  }
  parsedBody.childNodes.forEach(walk)

  return result
}
