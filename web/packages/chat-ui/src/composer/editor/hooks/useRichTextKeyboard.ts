import type { MutableRefObject, RefObject } from 'react'

interface UseRichTextKeyboardParams {
  editorRef: RefObject<HTMLDivElement | null>
  isComposingRef: MutableRefObject<boolean>
  /** Re-serialize editor content after a chip is removed via keyboard. */
  onContentChange: () => void
  onSubmit?: () => void
  onKeyDown?: (e: React.KeyboardEvent) => void
}

/** Returns true if the node is a chip element. */
function isChipElement(node: Node | null | undefined): boolean {
  return Boolean(node && (node as HTMLElement).classList?.contains('rich-text-media'))
}

/**
 * Rich-text editor keyboard behavior: chip-aware Backspace/Delete, editor-scoped
 * Cmd/Ctrl+A select-all, and Enter-to-submit with IME composition guard
 * (Shift+Enter falls through to insert a newline).
 *
 * Plain Enter never inserts a newline: when `onSubmit` is absent (submit blocked
 * while generating / empty / disabled) the key is swallowed rather than adding a
 * stray blank line. IME composition Enter is exempt — it still reaches the IME.
 */
export function useRichTextKeyboard({
  editorRef,
  isComposingRef,
  onContentChange,
  onSubmit,
  onKeyDown,
}: UseRichTextKeyboardParams) {
  // Some IMEs report Enter-to-commit as keyCode/which 229 after isComposing has reset.
  const isImeComposing = (e: React.KeyboardEvent<HTMLDivElement>): boolean =>
    isComposingRef.current ||
    e.nativeEvent.isComposing ||
    e.keyCode === 229 ||
    e.which === 229 ||
    e.nativeEvent.keyCode === 229

  // Find the chip adjacent to a collapsed cursor: before it for Backspace,
  // after it for Delete. Returns null when the neighbor is not a chip.
  const findAdjacentChip = (range: Range, direction: 'before' | 'after'): Node | null => {
    const node = range.startContainer

    if (node.nodeType === Node.TEXT_NODE) {
      if (direction === 'before' && range.startOffset === 0) {
        const prevSibling = node.previousSibling
        if (isChipElement(prevSibling)) return prevSibling
      }
      if (direction === 'after' && range.startOffset === node.textContent?.length) {
        const nextSibling = node.nextSibling
        if (isChipElement(nextSibling)) return nextSibling
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as HTMLElement
      const child = element.childNodes[direction === 'before' ? range.startOffset - 1 : range.startOffset]
      if (isChipElement(child)) return child
    }

    return null
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    // Native chip action buttons own Enter/Space; these keys must never send a message.
    if (e.target instanceof Element && e.target.closest('button')) return
    // A rendered URL is a real nested link. Let Enter activate it instead of
    // submitting the composer, while editor shortcuts still reach the editor.
    if (e.key === 'Enter' && e.target instanceof Element && e.target.closest('a[href]')) return

    // Cmd+A / Ctrl+A: select all within the editor (not the whole page)
    if ((e.metaKey || e.ctrlKey) && e.key === 'a') {
      e.preventDefault()
      e.stopPropagation()

      if (editorRef.current) {
        const range = document.createRange()
        range.selectNodeContents(editorRef.current)
        const selection = window.getSelection()
        selection?.removeAllRanges()
        selection?.addRange(range)
      }
      return
    }

    // Backspace / Delete: remove an adjacent chip as a single unit
    if (e.key === 'Backspace' || e.key === 'Delete') {
      const selection = window.getSelection()
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0)
        if (range.collapsed) {
          const chip = findAdjacentChip(range, e.key === 'Backspace' ? 'before' : 'after')
          if (chip) {
            e.preventDefault()
            ;(chip as ChildNode).remove()
            onContentChange()
            return
          }
        }
      }
    }

    // Enter: submit (Shift+Enter inserts a newline instead)
    // Note: debounce is handled by the parent — onSubmit is already debounced at call site
    if (e.key === 'Enter' && !e.shiftKey && !isImeComposing(e)) {
      // Always swallow the newline, including when submit is unavailable (a response is
      // streaming, the composer is empty/disabled). Letting Enter fall through would
      // silently insert a blank line, which users read as "my message failed to send".
      // The composer's existing status/typing notice already explains the wait.
      e.preventDefault()
      if (onSubmit) {
        onSubmit()
        return
      }
    }

    if (onKeyDown) {
      onKeyDown(e)
    }
  }

  return { handleKeyDown }
}
