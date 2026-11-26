import clsx from 'clsx'

import type { ChatUiLabels } from './types'

export interface FormatTimestampOptions {
  locale?: string
  timeZone?: string
}

export function cx(...values: Parameters<typeof clsx>) {
  return clsx(...values)
}

export const DEFAULT_LABELS: Required<ChatUiLabels> = {
  attach: 'Attach files',
  assistant: 'Assistant',
  emptyTitle: 'Start a conversation',
  emptyDescription: 'Send a message to begin.',
  inputPlaceholder: 'Type a message...',
  uploadingAttachment: 'Uploading',
  removeAttachment: 'Remove attachment',
  retryAttachment: 'Retry attachment',
  send: 'Send',
  stop: 'Stop generating',
  system: 'System',
  user: 'You',
}

export function mergeLabels(labels: ChatUiLabels | undefined): Required<ChatUiLabels> {
  const overrides = Object.fromEntries(
    Object.entries(labels ?? {}).filter(([, value]) => value !== undefined),
  ) as Partial<ChatUiLabels>

  return { ...DEFAULT_LABELS, ...overrides }
}

export function normalizeComposerValue(value: string): string {
  return value.trim()
}

export function formatTimestamp(
  value: string | Date | undefined,
  options: FormatTimestampOptions = {},
): string | null {
  if (!value) return null
  const date = typeof value === 'string' ? new Date(value) : value
  if (Number.isNaN(date.getTime())) return null
  const formatOptions: Intl.DateTimeFormatOptions = {
    hour: 'numeric',
    minute: '2-digit',
  }
  if (options.timeZone) {
    formatOptions.timeZone = options.timeZone
  }
  return new Intl.DateTimeFormat(options.locale ?? 'en-US', formatOptions).format(date)
}

export function formatFileSize(size: number | undefined): string | null {
  if (typeof size !== 'number' || !Number.isFinite(size) || size < 0) return null
  if (size < 1024) return `${size} B`
  if (size < 1024 * 1024) return `${Math.round(size / 1024)} KB`
  return `${(size / (1024 * 1024)).toFixed(1)} MB`
}

/** Copy text to clipboard. Returns true on success. */
export async function copyToClipboard(content: string, logger?: { warn: (message: string) => void }): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(content)
    return true
  } catch {
    logger?.warn('Failed to copy to clipboard')
    return false
  }
}
