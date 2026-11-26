/**
 * Pure string utilities for the rich-text editor — no DOM, no React.
 * Extracted from RichTextInput.tsx (arch-review F20,
 * docs/superpowers/specs/2026-06-12-rich-text-input-decomposition.md).
 */

/** Regex for bare http(s) URLs. */
const URL_PATTERN = /https?:\/\/[^\s<>'")\]]+/

/** Truncate filename keeping start + extension: "very-long-name.pdf" → "very-lo…me.pdf" */
export function truncateFilename(name: string, maxLen = 20): string {
  if (name.length <= maxLen) return name
  const dotIdx = name.lastIndexOf('.')
  if (dotIdx <= 0) return name.slice(0, maxLen - 1) + '…'
  const ext = name.slice(dotIdx) // ".pdf"
  const base = name.slice(0, dotIdx)
  const keep = maxLen - ext.length - 1 // 1 for ellipsis
  if (keep < 4) return name.slice(0, maxLen - 1) + '…'
  const head = base.slice(0, Math.ceil(keep * 0.6))
  const tail = base.slice(-(keep - head.length))
  return head + '…' + tail + ext
}

/** Returns true if the string contains a bare http(s) URL. */
export function containsUrl(text: string): boolean {
  return URL_PATTERN.test(text)
}

/** Convert all bare URLs in a string to markdown link syntax [display](url). */
export function convertUrlsToLinkMarkdown(text: string): string {
  return text.replace(new RegExp(URL_PATTERN, 'g'), (url) => `[${url}](${url})`)
}

/** Returns true if the string contains any markdown media/link syntax. */
export function containsMediaMarkdown(text: string): boolean {
  return /!\[[^\]]*\]\([^)]*\)|\[video:[^\]]*\]\([^)]*\)|\[[^\]]*\]\([^)]*\)/.test(text)
}

/** Returns true if the file's MIME type matches the comma-separated accept list. */
export function isFileTypeAccepted(file: File, acceptFileTypes: string): boolean {
  if (!acceptFileTypes) return true

  const acceptedTypes = acceptFileTypes.split(',').map((t) => t.trim())

  for (const type of acceptedTypes) {
    if (type === '*/*') return true
    if (type.endsWith('/*')) {
      // Wildcard match e.g. image/*
      const category = type.slice(0, -2)
      if (file.type.startsWith(category)) return true
    } else if (type.startsWith('.')) {
      // Extension match e.g. .doc, .pdf
      if (file.name.toLowerCase().endsWith(type.toLowerCase())) return true
    } else {
      if (file.type === type) return true
    }
  }

  return false
}
