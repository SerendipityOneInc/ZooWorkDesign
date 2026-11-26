import { ComposerAttachButton, ComposerSendButton, ComposerStopButton } from '@zooclaw/zooworkdesign'
import type React from 'react'

import type {
  ChatComposerAttachmentAction,
  ChatComposerClassNames,
  ChatComposerSendButtonVariant,
  ChatComposerTestIds,
  ChatComposerVariant,
  ChatUiLabels,
} from '../../types'
import { cx, mergeLabels } from '../../utils'

interface ComposerToolbarProps {
  acceptFileTypes?: string
  attachmentAction?: ChatComposerAttachmentAction
  attachDisabled: boolean
  canSubmit: boolean
  classNames?: ChatComposerClassNames
  fileInputRef: React.RefObject<HTMLInputElement | null>
  isGenerating: boolean
  isUploading: boolean
  labels?: ChatUiLabels
  onAttachFiles?: (files: File[]) => void
  onStop?: () => void
  sendButtonVariant: ChatComposerSendButtonVariant
  stopIcon?: React.ReactNode
  submitIcon?: React.ReactNode
  testIds?: ChatComposerTestIds
  toolbarEndAction?: React.ReactNode
  variant: ChatComposerVariant
}

export function ComposerToolbar({
  acceptFileTypes,
  attachmentAction,
  attachDisabled,
  canSubmit,
  classNames,
  fileInputRef,
  isGenerating,
  isUploading,
  labels,
  onAttachFiles,
  onStop,
  sendButtonVariant,
  stopIcon,
  submitIcon,
  testIds,
  toolbarEndAction,
  variant,
}: ComposerToolbarProps) {
  const mergedLabels = mergeLabels(labels)
  const isAttachmentDisabled = attachDisabled || isUploading
  const openFilePicker = () => {
    const input = fileInputRef.current
    if (isAttachmentDisabled || !input) return

    // Work around a reported Windows Chromium hang in the native file-type
    // dropdown. Open with All files; accept is only a picker hint, and the
    // existing upload handler still owns validation. Keep mobile media pickers.
    if (/Windows/i.test(navigator.userAgent)) input.removeAttribute('accept')
    else if (acceptFileTypes) input.setAttribute('accept', acceptFileTypes)
    else input.removeAttribute('accept')
    input.click()
  }
  const resolvedAttachmentAction =
    typeof attachmentAction === 'function'
      ? attachmentAction({ openFilePicker, disabled: isAttachmentDisabled, isUploading })
      : attachmentAction
  const showStop = isGenerating && onStop

  return (
    <>
      {onAttachFiles ? (
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptFileTypes}
          multiple
          className="hidden"
          data-testid={testIds?.fileInput}
          disabled={isAttachmentDisabled}
          onChange={(event) => {
            const files = Array.from(event.currentTarget.files ?? [])
            if (files.length > 0) onAttachFiles(files)
            event.currentTarget.value = ''
          }}
        />
      ) : null}

      <div
        className={cx(
          'flex shrink-0 items-center justify-between gap-2',
          variant === 'launcher' ? 'px-4 pt-1 pb-4' : 'mt-2',
          classNames?.toolbar,
        )}
        data-chat-composer-toolbar
      >
        <div
          className={cx('flex min-w-0 items-center gap-1.5', classNames?.toolbarStart)}
          data-testid={testIds?.toolbarStart}
        >
          {resolvedAttachmentAction ??
            (onAttachFiles ? (
              <ComposerAttachButton
                onClick={openFilePicker}
                disabled={isAttachmentDisabled}
                aria-label={mergedLabels.attach}
                data-testid={testIds?.attachButton}
              >
                {isUploading ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                ) : undefined}
              </ComposerAttachButton>
            ) : null)}
        </div>

        <div
          className={cx('flex min-w-0 items-center justify-end gap-2', classNames?.toolbarEnd)}
          data-testid={testIds?.toolbarEnd}
        >
          {toolbarEndAction}
          {showStop ? (
            <ComposerStopButton
              onClick={onStop}
              className={classNames?.sendButton}
              aria-label={mergedLabels.stop}
              title={mergedLabels.stop}
              data-testid={testIds?.stopButton}
            >
              {stopIcon}
            </ComposerStopButton>
          ) : (
            <ComposerSendButton
              disabled={!canSubmit}
              appearance={sendButtonVariant}
              className={classNames?.sendButton}
              aria-label={mergedLabels.send}
              title={mergedLabels.send}
              data-testid={testIds?.submitButton}
            >
              {submitIcon}
            </ComposerSendButton>
          )}
        </div>
      </div>
    </>
  )
}
