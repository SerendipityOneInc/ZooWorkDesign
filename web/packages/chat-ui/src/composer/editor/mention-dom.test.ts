import { afterEach, describe, expect, it } from 'vitest'
import type { MentionReference } from '@zooclaw/zooworkdesign'
import { decorateEditorMentions, editorSelection, readEditorMentions, setEditorSelection } from './mention-dom'
import { editorToMarkdown, renderMarkdownIntoEditor } from './markdown-dom'

const editors: HTMLElement[] = []
afterEach(() => {
  editors.splice(0).forEach((editor) => editor.remove())
  window.getSelection()?.removeAllRanges()
})
function mount(text: string, mentions: MentionReference[]) {
  const editor = document.createElement('div')
  editor.setAttribute('contenteditable', 'true')
  document.body.append(editor)
  editors.push(editor)
  renderMarkdownIntoEditor(editor, text, {})
  decorateEditorMentions(editor, { text, mentions })
  return editor
}

describe('rich chat mention DOM', () => {
  it('keeps explicit same-name identities separate from ordinary @text', () => {
    const text = '@Alex @Alex @Alex'
    const mentions: MentionReference[] = [
      { id: 'agent', kind: 'agent', label: 'Alex', start: 6, end: 11 },
      { id: 'person', kind: 'person', label: 'Alex', start: 12, end: 17 },
    ]
    const editor = mount(text, mentions)
    expect(editor.querySelectorAll('[contenteditable="false"]')).toHaveLength(2)
    expect(editorToMarkdown(editor)).toBe(text)
    expect(readEditorMentions(editor)).toEqual(mentions)
    editor.prepend(document.createTextNode('👋 '))
    expect(readEditorMentions(editor).map((item) => item.start)).toEqual([9, 15])
  })

  it('maps the caret around chips after media markdown and on new lines', () => {
    const text = 'Read [report](https://example.com/report)\n@Alex and @Lynn'
    const mentions: MentionReference[] = [
      { id: 'a', kind: 'agent', label: 'Alex', start: text.indexOf('@Alex'), end: text.indexOf('@Alex') + 5 },
      { id: 'l', kind: 'person', label: 'Lynn', start: text.indexOf('@Lynn'), end: text.length },
    ]
    const editor = mount(text, mentions)
    expect(editor.querySelectorAll('.rich-text-media')).toHaveLength(1)
    expect(readEditorMentions(editor)).toEqual(mentions)
    for (const offset of [0, mentions[0].start, mentions[0].end, mentions[1].start, text.length]) {
      setEditorSelection(editor, offset)
      expect(editorSelection(editor)).toEqual({ start: offset, end: offset })
    }
    setEditorSelection(editor, mentions[0].start, mentions[0].end)
    window.getSelection()!.getRangeAt(0).deleteContents()
    expect(readEditorMentions(editor)).toEqual([
      { ...mentions[1], start: mentions[1].start - 5, end: mentions[1].end - 5 },
    ])
  })

  it('updates identity-only changes and removes decoration without changing plain text or the caret', () => {
    const mention: MentionReference = { id: 'a', kind: 'agent', label: 'Alex', start: 0, end: 5 }
    const editor = mount('@Alex hello', [mention])
    setEditorSelection(editor, 7)
    decorateEditorMentions(editor, { text: '@Alex hello', mentions: [{ ...mention, id: 'b', kind: 'person' }] })
    expect(readEditorMentions(editor)[0].id).toBe('b')
    expect(editorSelection(editor)).toEqual({ start: 7, end: 7 })
    decorateEditorMentions(editor, { text: '@Alex hello', mentions: [] })
    expect(editor.querySelector('[data-mention-id]')).toBeNull()
    expect(editorToMarkdown(editor)).toBe('@Alex hello')
    expect(editorSelection(editor)).toEqual({ start: 7, end: 7 })
  })
})
