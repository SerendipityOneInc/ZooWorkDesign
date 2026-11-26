import { AttachmentChip } from '../../primitives/AttachmentChip'
import type {
  ChatComposerClassNames,
  ChatComposerTestIds,
  ChatComposerVariant,
  ChatUiAttachment,
  ChatUiAttachmentIconRenderer,
  ChatUiLabels,
} from '../../types'
import { cx } from '../../utils'

interface ComposerAttachmentsProps {
  attachments: ChatUiAttachment[]
  variant: ChatComposerVariant
  labels?: ChatUiLabels
  classNames?: ChatComposerClassNames
  testIds?: ChatComposerTestIds
  renderAttachmentTypeIcon?: ChatUiAttachmentIconRenderer
  onOpenAttachment?: (id: string) => void
  onRemoveAttachment?: (id: string) => void
  onRetryAttachment?: (id: string) => void
}

export function ComposerAttachments({
  attachments,
  variant,
  labels,
  classNames,
  testIds,
  renderAttachmentTypeIcon,
  onOpenAttachment,
  onRemoveAttachment,
  onRetryAttachment,
}: ComposerAttachmentsProps) {
  if (attachments.length === 0) return null

  return (
    <div
      className={cx(
        'mb-2 flex shrink-0 gap-2 overflow-x-auto',
        variant === 'launcher' ? 'pt-5' : 'pt-1.5 pr-1.5',
        variant === 'main' && 'scrollbar-none',
        classNames?.attachments,
      )}
      data-testid={testIds?.attachments}
    >
      {attachments.map((attachment) => (
        <AttachmentChip
          key={attachment.id}
          attachment={attachment}
          presentation={variant === 'main' ? 'thumbnail' : 'inline'}
          labels={labels}
          renderTypeIcon={renderAttachmentTypeIcon}
          onOpen={onOpenAttachment}
          onRemove={onRemoveAttachment}
          onRetry={onRetryAttachment}
          testId={testIds?.attachment}
          removeTestId={testIds?.attachmentRemove}
          retryTestId={testIds?.attachmentRetry}
        />
      ))}
    </div>
  )
}
