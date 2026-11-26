import { useEffect, useLayoutEffect, useRef, useState } from 'react'

import type { ChipCallbacks } from '../chip-elements'
import {
  detectAndConvertUrlAtCursor,
  editorToMarkdown,
  insertMarkdownAtCursor,
  renderMarkdownIntoEditor,
  tryUpdateUploadingMedia,
} from '../markdown-dom'

interface UseRichTextEditorParams {
  value: string
  onChange: (markdown: string) => void
  placeholder?: string
  disabled?: boolean
  onCompositionStart?: () => void
  onCompositionEnd?: () => void
  chipCallbacks: ChipCallbacks
}

interface ExternalMarkdownInsertOptions {
  ensureBoundarySpaces?: boolean
}

function addBoundarySpaces(text: string, range: Range, editor: HTMLElement): string {
  if (!text) return text

  const beforeRange = range.cloneRange()
  beforeRange.selectNodeContents(editor)
  beforeRange.setEnd(range.startContainer, range.startOffset)

  const afterRange = range.cloneRange()
  afterRange.selectNodeContents(editor)
  afterRange.setStart(range.endContainer, range.endOffset)

  const before = beforeRange.toString()
  const after = afterRange.toString()
  const prefix = before && !/\s$/.test(before) && !/^\s/.test(text) ? ' ' : ''
  const suffix = after && !/^\s/.test(after) && !/\s$/.test(text) ? ' ' : ''
  return `${prefix}${text}${suffix}`
}

/**
 * Owns the rich-text editor lifecycle: the editor ref, IME composition
 * tracking, the controlled-`value` ↔ DOM sync effect, the placeholder
 * attribute, and input serialization back to markdown.
 */
export function useRichTextEditor({
  value,
  onChange,
  placeholder,
  disabled = false,
  onCompositionStart,
  onCompositionEnd,
  chipCallbacks,
}: UseRichTextEditorParams) {
  const editorRef = useRef<HTMLDivElement>(null)
  const savedSelectionRef = useRef<Range | null>(null)
  const [isFocused, setIsFocused] = useState(false)
  const isComposingRef = useRef(false) // tracks IME composition state
  const previousDisabledRef = useRef(disabled)
  const onChangeRef = useRef(onChange)
  useLayoutEffect(() => { onChangeRef.current = onChange })

  const callbacks: ChipCallbacks = {
    ...chipCallbacks,
    onRemoveChip: disabled ? undefined : chip => {
      const editor = editorRef.current
      if (!editor?.contains(chip) || editor.contentEditable === 'false') return
      const range = document.createRange()
      range.setStartBefore(chip)
      range.collapse(true)
      chip.remove()
      editor.focus({ preventScroll: true })
      const selection = window.getSelection()
      selection?.removeAllRanges()
      selection?.addRange(range)
      savedSelectionRef.current = range.cloneRange()
      onChangeRef.current(editorToMarkdown(editor))
    },
  }

  // Handle editor input events
  const handleInput = () => {
    if (!editorRef.current) return

    // Auto-convert URL → link chip when user types a space after a URL
    if (!isComposingRef.current) {
      detectAndConvertUrlAtCursor()
    }

    const markdown = editorToMarkdown(editorRef.current)
    onChange(markdown)
  }

  // Insert a markdown string (possibly containing media/link syntax) at the cursor
  const insertMediaMarkdown = (text: string) => {
    insertMarkdownAtCursor(text, callbacks)
    handleInput()
  }

  const selectionBelongsToEditor = (range: Range, editor: HTMLElement): boolean =>
    (range.startContainer === editor || editor.contains(range.startContainer)) &&
    (range.endContainer === editor || editor.contains(range.endContainer))

  const captureSelection = () => {
    const editor = editorRef.current
    const selection = window.getSelection()
    if (!editor || !selection || selection.rangeCount === 0) return
    const range = selection.getRangeAt(0)
    if (selectionBelongsToEditor(range, editor)) savedSelectionRef.current = range.cloneRange()
  }

  const restoreSelection = (editor: HTMLElement) => {
    const selection = window.getSelection()
    if (!selection) return
    const usableRange =
      savedSelectionRef.current && selectionBelongsToEditor(savedSelectionRef.current, editor)
        ? savedSelectionRef.current
        : null
    const range = usableRange ?? document.createRange()
    if (!usableRange) {
      range.selectNodeContents(editor)
      range.collapse(false)
    }
    selection.removeAllRanges()
    selection.addRange(range)
  }

  const insertExternalMarkdown = (text: string, options: ExternalMarkdownInsertOptions = {}) => {
    const editor = editorRef.current
    if (!editor) return
    if (document.activeElement === editor) captureSelection()
    editor.focus()
    restoreSelection(editor)
    const selection = window.getSelection()
    const range = selection && selection.rangeCount > 0 ? selection.getRangeAt(0) : null
    const insertion = options.ensureBoundarySpaces && range ? addBoundarySpaces(text, range, editor) : text
    insertMarkdownAtCursor(insertion, callbacks)
    handleInput()
    captureSelection()
  }

  // Sync editor DOM when the controlled `value` changes externally
  // renderMarkdownIntoEditor etc. read only refs and stable module functions
  useLayoutEffect(() => {
    if (!editorRef.current) return

    const currentMarkdown = editorToMarkdown(editorRef.current)
    const disabledChanged = previousDisabledRef.current !== disabled
    previousDisabledRef.current = disabled
    if (currentMarkdown !== value || disabledChanged) {
      // Prefer incremental update for uploading chips to avoid cursor jump
      if (isComposingRef.current || (!disabledChanged && tryUpdateUploadingMedia(editorRef.current, value, callbacks))) {
        // During IME composition or after a successful incremental update: skip full rebuild
        if (isComposingRef.current) return
        const updatedMarkdown = editorToMarkdown(editorRef.current)
        if (updatedMarkdown === value) return
      }
      savedSelectionRef.current = null
      renderMarkdownIntoEditor(editorRef.current, value, callbacks)
    }
  }, [value, disabled])

  // Show/hide the placeholder attribute based on content and focus state
  useEffect(() => {
    if (!editorRef.current) return
    const isEmpty =
      !editorRef.current.textContent && editorRef.current.querySelectorAll('.rich-text-media').length === 0

    if (isEmpty) {
      editorRef.current.setAttribute('data-placeholder', placeholder || '')
    } else {
      editorRef.current.removeAttribute('data-placeholder')
    }
  }, [value, isFocused, placeholder])

  const handleFocus = () => setIsFocused(true)
  const handleBlur = () => {
    captureSelection()
    setIsFocused(false)
  }

  const handleCompositionStart = () => {
    isComposingRef.current = true
    onCompositionStart?.()
  }

  const handleCompositionEnd = () => {
    isComposingRef.current = false
    onCompositionEnd?.()
  }

  return {
    editorRef,
    isComposingRef,
    handleInput,
    insertMediaMarkdown,
    insertExternalMarkdown,
    handleFocus,
    handleBlur,
    handleCompositionStart,
    handleCompositionEnd,
  }
}
