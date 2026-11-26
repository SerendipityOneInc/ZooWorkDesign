/**
 * Pure rich-text editor utilities.
 */

/**
 * Find the real (non-uploading) URL for a media element by its alt text in a markdown string.
 * Returns the first non-uploading URL found, or null.
 */
export function findUploadedMediaUrl(
  markdown: string,
  alt: string,
  mediaType: 'image' | 'video' | 'link',
): string | null {
  const escapedAlt = alt.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const regex =
    mediaType === 'video'
      ? new RegExp(`\\[video:${escapedAlt}\\]\\(([^)]*)\\)`, 'g')
      : mediaType === 'link'
        ? new RegExp(`(?<!!)\\[${escapedAlt}\\]\\(([^)]*)\\)`, 'g')
        : new RegExp(`!\\[${escapedAlt}\\]\\(([^)]*)\\)`, 'g')

  for (const match of markdown.matchAll(regex)) {
    if (!match[1].startsWith('uploading:')) {
      return match[1]
    }
  }
  return null
}

/**
 * Determine the sync strategy when the editor markdown differs from the incoming value.
 *
 * Returns:
 * - 'skip'    → no DOM rebuild needed (IME composing or partial update matched)
 * - 'rebuild' → full markdownToEditor rebuild required
 */
export function determineSyncStrategy(options: {
  isComposing: boolean
  hasUploadingElements: boolean
  partialUpdateSucceeded: boolean
  markdownAfterPartialUpdate: string
  targetValue: string
}): 'skip' | 'rebuild' {
  const { isComposing, hasUploadingElements, partialUpdateSucceeded, markdownAfterPartialUpdate, targetValue } = options

  // IME composing: always skip to avoid breaking input method state
  if (isComposing) return 'skip'

  // If there were uploading elements and partial update succeeded,
  // check if the result matches the target
  if (hasUploadingElements && partialUpdateSucceeded) {
    if (markdownAfterPartialUpdate === targetValue) return 'skip'
  }

  return 'rebuild'
}
