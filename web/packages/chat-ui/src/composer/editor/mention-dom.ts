import type { MentionReference, MentionsValue } from '@zooclaw/zooworkdesign'
import { validMentions } from '@zooclaw/zooworkdesign'
import { editorToMarkdown } from './markdown-dom'

const selector = '[data-mention-id]'
const serialize = (fragment: DocumentFragment | Node) => {
  const container = document.createElement('div')
  container.appendChild(fragment.cloneNode(true))
  return editorToMarkdown(container)
}

/** Markdown offsets, including media tokens; DOM textContent offsets are insufficient. */
export function editorSelection(editor: HTMLElement) {
  const selection = window.getSelection()
  if (!selection?.rangeCount) return null
  const range = selection.getRangeAt(0)
  if (!editor.contains(range.startContainer) || !editor.contains(range.endContainer)) return null
  const prefix = document.createRange()
  prefix.selectNodeContents(editor)
  prefix.setEnd(range.startContainer, range.startOffset)
  const start = serialize(prefix.cloneContents()).length
  prefix.setEnd(range.endContainer, range.endOffset)
  return { start, end: serialize(prefix.cloneContents()).length }
}

function positionAt(editor: HTMLElement, target: number): { node: Node; offset: number } {
  let offset = 0
  let found: { node: Node; offset: number } | undefined
  const visit = (node: Node) => {
    if (found) return
    if (node.nodeType === Node.TEXT_NODE) {
      const length = node.textContent?.length ?? 0
      if (target <= offset + length) found = { node, offset: Math.max(0, target - offset) }
      offset += length
      return
    }
    if (!(node instanceof HTMLElement)) return
    const index = Array.from(node.parentNode!.childNodes).findIndex((child) => child === node)
    if (node.matches(selector) || node.classList.contains('rich-text-media') || node.tagName === 'BR') {
      const length = serialize(node).length
      if (target <= offset + length) {
        found = { node: node.parentNode!, offset: index + (target > offset ? 1 : 0) }
      }
      offset += length
      return
    }
    if (node.tagName === 'DIV') {
      if (target <= offset) found = { node: node.parentNode!, offset: index }
      offset++
    }
    node.childNodes.forEach(visit)
  }
  editor.childNodes.forEach(visit)
  return found ?? { node: editor, offset: editor.childNodes.length }
}

export function setEditorSelection(editor: HTMLElement, start: number, end = start) {
  const a = positionAt(editor, start),
    b = positionAt(editor, end)
  const range = document.createRange()
  range.setStart(a.node, a.offset)
  range.setEnd(b.node, b.offset)
  const selection = window.getSelection()
  selection?.removeAllRanges()
  selection?.addRange(range)
}

/** Read identities from actual atomic chips, never guess them from names or pasted text. */
export function readEditorMentions(editor: HTMLElement): MentionReference[] {
  const text = editorToMarkdown(editor)
  const mentions = Array.from(editor.querySelectorAll<HTMLElement>(selector), (chip) => {
    const prefix = document.createRange()
    prefix.selectNodeContents(editor)
    prefix.setEndBefore(chip)
    const start = serialize(prefix.cloneContents()).length
    return {
      id: chip.dataset.mentionId ?? '',
      kind: chip.dataset.mentionKind as MentionReference['kind'],
      label: chip.dataset.mentionLabel ?? '',
      start,
      end: start + (chip.textContent?.length ?? 0),
    }
  })
  return validMentions({ text, mentions })
}

/** Real inline boxes keep padding, selection, line wrapping and the caret in one layout. */
export function decorateEditorMentions(editor: HTMLElement, value: MentionsValue) {
  const desired = validMentions(value)
  if (JSON.stringify(readEditorMentions(editor)) === JSON.stringify(desired)) return
  const selection = editorSelection(editor)
  editor
    .querySelectorAll<HTMLElement>(selector)
    .forEach((chip) => chip.replaceWith(document.createTextNode(chip.textContent ?? '')))
  for (const mention of [...desired].reverse()) {
    const a = positionAt(editor, mention.start),
      b = positionAt(editor, mention.end)
    const range = document.createRange()
    range.setStart(a.node, a.offset)
    range.setEnd(b.node, b.offset)
    range.deleteContents()
    const chip = document.createElement('span')
    chip.setAttribute('contenteditable', 'false')
    chip.className = 'zc-mention-token chat-ui-mention'
    chip.dataset.mentionId = mention.id
    chip.dataset.mentionKind = mention.kind
    chip.dataset.mentionLabel = mention.label
    chip.textContent = `@${mention.label}`
    range.insertNode(chip)
  }
  if (selection) setEditorSelection(editor, selection.start, selection.end)
}

export function editorCaretRect(editor: HTMLElement | null): DOMRect {
  if (!editor) return new DOMRect()
  const selection = window.getSelection()
  if (selection?.rangeCount && editor.contains(selection.getRangeAt(0).endContainer)) {
    const range = selection.getRangeAt(0).cloneRange()
    range.collapse(false)
    const rect = range.getBoundingClientRect?.()
    if (rect?.height) return rect
  }
  const rect = editor.getBoundingClientRect()
  return new DOMRect(rect.left, rect.top, 0, parseFloat(getComputedStyle(editor).lineHeight) || 24)
}
