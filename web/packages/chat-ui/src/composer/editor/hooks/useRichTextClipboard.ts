import { extractChipMarkdownFromHtml } from '../markdown-dom'
import { containsMediaMarkdown, containsUrl, convertUrlsToLinkMarkdown, isFileTypeAccepted } from '../markdown-text'

// Large plain-text paste threshold — beyond this the paste becomes a .txt
// attachment. Byte rule catches CJK/emoji pastes before the char cap; char
// rule catches ASCII pastes that would otherwise slip past bytes but exceed
// the consumer's inline-message limit.
const PASTE_AS_FILE_BYTES = 5000

interface UseRichTextClipboardParams {
  acceptFileTypes: string
  maxInlinePasteCharacters: number
  /** Insert markdown (possibly with media/link syntax) at the cursor as chips. */
  insertMediaMarkdown: (text: string) => void
  /** Re-serialize editor content after a plain-text insertion. */
  onContentChange: () => void
  onFileDrop?: (files: File[]) => void
}

/**
 * Editor clipboard and drag-drop pipeline: pasted files (and
 * oversized text) are routed to `onFileDrop`, the editor's own markdown/HTML
 * chips are re-inserted as chips, and external HTML is stripped to plain
 * text with bare URLs converted to link chips.
 */
export function useRichTextClipboard({
  acceptFileTypes,
  maxInlinePasteCharacters,
  insertMediaMarkdown,
  onContentChange,
  onFileDrop,
}: UseRichTextClipboardParams) {
  // Insert plain text at the cursor, replacing the current selection
  const insertPlainText = (plainText: string) => {
    const selection = window.getSelection()
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0)
      range.deleteContents()

      const textNode = document.createTextNode(plainText)
      range.insertNode(textNode)

      range.setStartAfter(textNode)
      range.setEndAfter(textNode)
      selection.removeAllRanges()
      selection.addRange(range)

      onContentChange()
    }
  }

  // Handle paste — files (and large text) go through onFileDrop;
  // otherwise strip HTML formatting and keep plain text.
  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    const clipboardData = e.clipboardData

    // Files (images/videos): route through onFileDrop, same as the upload button
    if (clipboardData.files && clipboardData.files.length > 0) {
      const files = Array.from(clipboardData.files)
      const acceptedFiles = files.filter((file) => isFileTypeAccepted(file, acceptFileTypes))

      if (acceptedFiles.length > 0 && onFileDrop) {
        e.preventDefault()
        onFileDrop(acceptedFiles)
        return
      }
      // Unsupported file types: block the default paste to avoid inline display
      e.preventDefault()
      return
    }

    const htmlData = clipboardData.getData('text/html')
    const plainText = clipboardData.getData('text/plain')

    // Large plain-text paste -> .txt attachment
    if (plainText && onFileDrop) {
      const byteSize = new Blob([plainText]).size
      if (byteSize > PASTE_AS_FILE_BYTES || plainText.length > maxInlinePasteCharacters) {
        const pastedFile = new File([plainText], `pasted-${Date.now()}.txt`, { type: 'text/plain' })
        if (isFileTypeAccepted(pastedFile, acceptFileTypes)) {
          e.preventDefault()
          onFileDrop([pastedFile])
          return
        }
      }
    }

    // Plain text contains our own markdown syntax (cut from editor): re-insert as chips
    if (plainText && containsMediaMarkdown(plainText)) {
      e.preventDefault()
      insertMediaMarkdown(plainText)
      return
    }

    // HTML contains our own media chips (cut from editor): extract and re-insert
    if (htmlData && htmlData.includes('rich-text-media')) {
      e.preventDefault()
      insertMediaMarkdown(extractChipMarkdownFromHtml(htmlData))
      return
    }

    // External HTML paste: strip HTML, keep plain text; convert URLs to link chips
    if (htmlData && plainText) {
      e.preventDefault()

      if (containsUrl(plainText)) {
        insertMediaMarkdown(convertUrlsToLinkMarkdown(plainText))
        return
      }

      insertPlainText(plainText)
      return
    }

    // Plain text paste (no HTML): convert URLs to link chips
    if (plainText && containsUrl(plainText)) {
      e.preventDefault()
      insertMediaMarkdown(convertUrlsToLinkMarkdown(plainText))
      return
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()

    if (!onFileDrop) return

    const files = Array.from(e.dataTransfer.files)
    const acceptedFiles = files.filter((file) => isFileTypeAccepted(file, acceptFileTypes))

    if (acceptedFiles.length > 0) {
      onFileDrop(acceptedFiles)
    }
  }

  return { handlePaste, handleDragOver, handleDrop }
}
