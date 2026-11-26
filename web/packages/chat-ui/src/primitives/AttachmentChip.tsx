import { ArrowPathIcon, ExclamationTriangleIcon, XMarkIcon } from '@heroicons/react/24/outline'

import type {
  ChatUiAttachment,
  ChatUiAttachmentIconRenderer,
  ChatUiAttachmentPresentation,
  ChatUiLabels,
} from '../types'
import { cx, formatFileSize, mergeLabels } from '../utils'
import { inlineAttachmentChipStyles } from './attachment-chip-styles'

function extensionLabel(filename: string): string {
  const dot = filename.lastIndexOf('.')
  return dot > 0 ? filename.slice(dot + 1).toUpperCase() : ''
}

export interface AttachmentChipProps {
  attachment: ChatUiAttachment
  presentation?: ChatUiAttachmentPresentation
  labels?: ChatUiLabels
  /** Renders the file-type icon shown when the attachment has no image preview. */
  renderTypeIcon?: ChatUiAttachmentIconRenderer
  onOpen?: (id: string) => void
  onRemove?: (id: string) => void
  onRetry?: (id: string) => void
  className?: string
  testId?: string
  removeTestId?: string
  retryTestId?: string
}

export function AttachmentChip({
  attachment,
  presentation = 'inline',
  labels,
  renderTypeIcon,
  onOpen,
  onRemove,
  onRetry,
  className,
  testId,
  removeTestId,
  retryTestId,
}: AttachmentChipProps) {
  const mergedLabels = mergeLabels(labels)
  const size = formatFileSize(attachment.size)
  const status = attachment.status ?? 'ready'
  const extension = extensionLabel(attachment.name)
  const openAttachment = onOpen && attachment.canOpen !== false ? () => onOpen(attachment.id) : undefined
  const typeIcon = attachment.previewUrl ? null : renderTypeIcon?.({ attachment, presentation })

  if (presentation === 'thumbnail') {
    return (
      <div data-testid={testId} className={cx('relative shrink-0', className)}>
        <div
          className={cx(
            'border-border bg-muted overflow-hidden rounded-[10px] border',
            openAttachment && 'hover:border-ecap-primary cursor-pointer transition-colors',
          )}
          onClick={openAttachment}
          onKeyDown={
            openAttachment
              ? (event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault()
                    openAttachment()
                  }
                }
              : undefined
          }
          role={openAttachment ? 'button' : undefined}
          tabIndex={openAttachment ? 0 : undefined}
          aria-label={openAttachment ? `Preview ${attachment.name}` : undefined}
        >
          {attachment.previewUrl ? (
            <div className="h-[88px] w-[88px]">
              <img src={attachment.previewUrl} alt={attachment.name} className="h-[88px] w-[88px] object-cover" />
            </div>
          ) : (
            <div className="flex h-[88px] w-[88px] flex-col justify-between p-2.5" title={attachment.name}>
              <span
                className={cx(
                  'text-foreground text-[11px] leading-snug break-all',
                  typeIcon ? 'line-clamp-1' : 'line-clamp-3',
                )}
              >
                {attachment.name}
              </span>
              {typeIcon ? (
                <span
                  data-attachment-type-icon="true"
                  className="flex min-h-0 flex-1 items-center justify-center"
                  aria-hidden="true"
                >
                  {typeIcon}
                </span>
              ) : null}
              {extension ? (
                <span className="border-border text-muted-foreground bg-card w-fit rounded-[4px] border px-1.5 py-0.5 text-[10px] font-semibold">
                  {extension}
                </span>
              ) : null}
            </div>
          )}
        </div>
        {status === 'uploading' ? (
          <div
            data-attachment-uploading="true"
            className="absolute inset-0 flex items-center justify-center rounded-[10px] bg-black/40"
          >
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
          </div>
        ) : null}
        {status === 'error' ? (
          <div className="bg-destructive/40 absolute inset-0 flex flex-col items-center justify-center gap-1 rounded-[10px]">
            <ExclamationTriangleIcon className="h-4 w-4 text-white" />
            {attachment.canRetry !== false && onRetry ? (
              <button
                type="button"
                className="flex items-center gap-0.5 rounded bg-white/20 px-1.5 py-0.5 text-[9px] text-white hover:bg-white/30"
                aria-label={mergedLabels.retryAttachment}
                data-testid={retryTestId}
                onClick={(event) => {
                  event.stopPropagation()
                  onRetry(attachment.id)
                }}
              >
                <ArrowPathIcon className="h-3 w-3" />
                {attachment.statusLabel ?? mergedLabels.retryAttachment}
              </button>
            ) : (
              <span className="px-1 text-center text-[9px] leading-tight text-white">
                {attachment.statusLabel ?? 'Error'}
              </span>
            )}
          </div>
        ) : null}
        {onRemove ? (
          <button
            type="button"
            className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
            aria-label={mergedLabels.removeAttachment}
            data-testid={removeTestId}
            onClick={(event) => {
              event.stopPropagation()
              onRemove(attachment.id)
            }}
          >
            <XMarkIcon className="h-3 w-3" />
          </button>
        ) : null}
      </div>
    )
  }

  const content = <>
    <span className={inlineAttachmentChipStyles.icon} data-attachment-type-icon={typeIcon ? 'true' : undefined}>
      {attachment.previewUrl ? <img src={attachment.previewUrl} alt={attachment.name} className="size-5 object-cover" />
        : typeIcon ?? <span aria-hidden="true" className="text-[8px] font-semibold tracking-tight text-muted-foreground">{extension.slice(0, 4) || 'FILE'}</span>}
    </span>
    <span className={inlineAttachmentChipStyles.name}>{attachment.name}</span>
  </>

  return <div data-testid={testId} className={cx(inlineAttachmentChipStyles.root, className)}
    data-attachment-status={status} aria-busy={status === 'uploading' || undefined}
    title={`${attachment.name}${size ? ` · ${size}` : ''}`}>
    {openAttachment ? <button type="button" className="inline-flex min-w-0 items-center gap-1.5 rounded hover:bg-border focus-visible:outline-2 focus-visible:outline-ring"
      onClick={openAttachment} aria-label={`Preview ${attachment.name}`}>{content}</button> : content}
    {size && <span className="sr-only">{size}</span>}
    {status !== 'ready' && <>
      <span className="sr-only">{attachment.statusLabel ?? (status === 'uploading' ? mergedLabels.uploadingAttachment : 'Error')}</span>
      {status === 'uploading' ? <span aria-hidden="true" data-attachment-uploading="true" className="size-3 shrink-0 animate-spin rounded-full border-2 border-muted-foreground/30 border-t-muted-foreground" />
        : <ExclamationTriangleIcon aria-hidden="true" className="size-3 shrink-0 text-destructive" />}
    </>}
    {status === 'error' && attachment.canRetry !== false && onRetry && <button type="button" className={inlineAttachmentChipStyles.action}
      aria-label={mergedLabels.retryAttachment} data-testid={retryTestId} onClick={event => { event.stopPropagation(); onRetry(attachment.id) }}><ArrowPathIcon className="size-3" /></button>}
    {onRemove && <button type="button" className={inlineAttachmentChipStyles.action} aria-label={mergedLabels.removeAttachment}
      data-testid={removeTestId} onClick={event => { event.stopPropagation(); onRemove(attachment.id) }}><XMarkIcon className="size-3" /></button>}
  </div>
}
