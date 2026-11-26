'use client'

import type React from 'react'
import { useRef } from 'react'
import { chatComposerSurfaceClassName, chatComposerEditorClassName } from './presentation'

import type {
  ChatComposerAttachmentAction,
  ChatComposerBanner,
  ChatComposerClassNames,
  ChatComposerQuote,
  ChatComposerSendButtonVariant,
  ChatComposerStatus,
  ChatComposerSubmit,
  ChatComposerTestIds,
  ChatComposerVariant,
  ChatUiAttachment,
  ChatUiAttachmentIconRenderer,
  ChatUiFileReferenceIconFactory,
  ChatUiLabels,
} from '../types'
import { cx, mergeLabels, normalizeComposerValue } from '../utils'
import { RichTextInput, type RichTextInputHandle, type RichTextInputProps } from './editor/RichTextInput'
import { ComposerAttachments } from './parts/ComposerAttachments'
import { ComposerNotices } from './parts/ComposerNotices'
import { ComposerQuote } from './parts/ComposerQuote'
import { ComposerToolbar } from './parts/ComposerToolbar'

export interface ChatComposerProps {
  value: string
  onChange: (value: string) => void
  onSubmit: (payload: ChatComposerSubmit) => void
  labels?: ChatUiLabels
  /** Accessible name for the rich-text editor. Defaults to labels.inputPlaceholder. */
  inputAriaLabel?: string
  disabled?: boolean
  submitDisabled?: boolean
  attachDisabled?: boolean
  isGenerating?: boolean
  isUploading?: boolean
  attachments?: ChatUiAttachment[]
  /** App-supplied file-type icon for attachments without an image preview. */
  renderAttachmentTypeIcon?: ChatUiAttachmentIconRenderer
  /** App-supplied DOM icon for file references rendered inside the rich-text editor. */
  getUploadPreview?: (placeholderUrl: string) => string | undefined
  createFileReferenceIcon?: ChatUiFileReferenceIconFactory
  onAttachFiles?: (files: File[]) => void
  onOpenAttachment?: (id: string) => void
  onRemoveAttachment?: (id: string) => void
  onRetryAttachment?: (id: string) => void
  onStop?: () => void
  acceptFileTypes?: string
  maxInlinePasteCharacters?: number
  banner?: ChatComposerBanner
  status?: ChatComposerStatus
  quote?: ChatComposerQuote
  onClearQuote?: () => void
  beforeCard?: React.ReactNode
  attachmentAction?: ChatComposerAttachmentAction
  toolbarEndAction?: React.ReactNode
  submitIcon?: React.ReactNode
  stopIcon?: React.ReactNode
  variant?: ChatComposerVariant
  sendButtonVariant?: ChatComposerSendButtonVariant
  /** Override --chat-ui-composer-default-height on the card to customize its baseline; the cap stays 2×. */
  classNames?: ChatComposerClassNames
  testIds?: ChatComposerTestIds
  /** Optional rich editor integration; the surrounding product composer stays unchanged. */
  renderEditor?: (props: RichTextInputProps) => React.ReactNode
  editorRef?: React.Ref<HTMLDivElement>
  editorCommandRef?: React.Ref<RichTextInputHandle>
  /** Backward-compatible root class. Prefer classNames.root for new consumers. */
  className?: string
}

// Variants own spacing; the composer surface stays the same in every context.
// Product design: editor focus keeps the resting card appearance on every surface.
// Do not add focus rings or border changes to this card; toolbar controls own their focus styles.
const VARIANT_CLASS_NAMES: Record<
  ChatComposerVariant,
  Required<Pick<ChatComposerClassNames, 'root' | 'content' | 'card' | 'editor'>>
> = {
  shell: {
    root: 'border-t border-[color:var(--chat-ui-border,#d4d4d4)] bg-[color:var(--background)] p-4',
    content: '',
    card: 'p-2',
    editor:
      'min-h-11 w-full bg-transparent px-2 py-2 text-[color:var(--foreground)] outline-none placeholder:text-[color:var(--chat-ui-muted-foreground,#737373)]',
  },
  main: {
    root: 'shrink-0 px-6 pt-3 pb-8',
    content: 'mx-auto max-w-3xl',
    card: 'px-6 py-5',
    editor:
      'min-h-[32px] w-full border-0 bg-transparent text-[color:var(--foreground)] outline-none placeholder:text-[color:var(--chat-ui-muted-foreground,#737373)]',
  },
  compact: {
    root: '',
    content: '',
    card: 'p-3',
    editor:
      'min-h-[32px] w-full border-0 bg-transparent text-[color:var(--foreground)] outline-none placeholder:text-[color:var(--chat-ui-muted-foreground,#737373)]',
  },
  launcher: {
    root: '',
    content: '',
    card: '',
    editor:
      'min-h-[84px] w-full bg-transparent px-5 pt-5 pb-2 text-[color:var(--foreground)] outline-none placeholder:text-[color:var(--chat-ui-muted-foreground,#737373)]',
  },
}

// Empty card geometry: one-line editor + toolbar + variant padding and border.
const DEFAULT_CARD_HEIGHT: Record<ChatComposerVariant, number> = {
  shell: 122,
  main: 138,
  compact: 122,
  launcher: 138,
}

const COMPOSER_THEME_STYLE = {
  '--chat-ui-border': 'var(--border, #d4d4d4)',
  '--chat-ui-muted': 'var(--muted, #f5f5f5)',
  '--chat-ui-muted-foreground': 'var(--muted-foreground, #737373)',
  '--chat-ui-card': 'var(--card, var(--chat-ui-assistant-bg, #ffffff))',
  '--chat-ui-assistant-bg': 'var(--card, #ffffff)',
} as React.CSSProperties

export function ChatComposer({
  value,
  onChange,
  onSubmit,
  labels,
  inputAriaLabel,
  disabled = false,
  submitDisabled,
  attachDisabled = false,
  isGenerating = false,
  isUploading = false,
  attachments = [],
  renderAttachmentTypeIcon,
  createFileReferenceIcon,
  getUploadPreview,
  onAttachFiles,
  onOpenAttachment,
  onRemoveAttachment,
  onRetryAttachment,
  onStop,
  acceptFileTypes,
  maxInlinePasteCharacters,
  banner,
  status,
  quote,
  onClearQuote,
  beforeCard,
  attachmentAction,
  toolbarEndAction,
  submitIcon,
  stopIcon,
  variant = 'shell',
  sendButtonVariant = 'default',
  classNames,
  testIds,
  renderEditor,
  editorRef,
  editorCommandRef,
  className,
}: ChatComposerProps) {
  const mergedLabels = mergeLabels(labels)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const normalizedValue = normalizeComposerValue(value)
  const blockedByContent = submitDisabled === undefined ? normalizedValue.length === 0 : submitDisabled
  const canSubmit = !disabled && !isGenerating && !blockedByContent
  const variantClassNames = VARIANT_CLASS_NAMES[variant]

  const submit = () => {
    if (!canSubmit) return
    onSubmit({ value: normalizedValue })
  }

  const editorProps: RichTextInputProps = {
    value, onChange, placeholder: mergedLabels.inputPlaceholder,
    ariaLabel: inputAriaLabel ?? mergedLabels.inputPlaceholder, disabled,
    onFileDrop: onAttachFiles, acceptFileTypes, maxInlinePasteCharacters,
    uploadingAttachmentLabel: mergedLabels.uploadingAttachment,
    removeAttachmentLabel: mergedLabels.removeAttachment,
    createFileReferenceIcon, getUploadPreview,
    onSubmit: canSubmit ? submit : undefined,
    className: cx(chatComposerEditorClassName, variantClassNames.editor, classNames?.editor),
    inputRef: editorRef, commandRef: editorCommandRef,
    testId: testIds?.editor ?? 'chat-composer-input',
  }

  return (
    <form
      className={cx(variantClassNames.root, className, classNames?.root)}
      data-testid={testIds?.root}
      data-variant={variant}
      style={COMPOSER_THEME_STYLE}
      onSubmit={(event) => {
        event.preventDefault()
        submit()
      }}
    >
      <div className={cx('pointer-events-auto', variantClassNames.content, classNames?.content)}>
        <ComposerNotices banner={banner} status={status} testIds={testIds} variant={variant} />
        {beforeCard}
        <ComposerQuote quote={quote} variant={variant} onClearQuote={onClearQuote} testIds={testIds} />

        <div
          className={cx(chatComposerSurfaceClassName, variantClassNames.card, classNames?.card)}
          data-chat-composer-card
          style={{
            minHeight: `var(--chat-ui-composer-default-height, ${DEFAULT_CARD_HEIGHT[variant]}px)`,
            maxHeight: `calc(var(--chat-ui-composer-default-height, ${DEFAULT_CARD_HEIGHT[variant]}px) * 2)`,
          }}
          data-testid={testIds?.card}
        >
          <ComposerAttachments
            attachments={attachments}
            variant={variant}
            labels={labels}
            classNames={classNames}
            testIds={testIds}
            renderAttachmentTypeIcon={renderAttachmentTypeIcon}
            onOpenAttachment={onOpenAttachment}
            onRemoveAttachment={onRemoveAttachment}
            onRetryAttachment={onRetryAttachment}
          />

          {renderEditor ? renderEditor(editorProps) : <RichTextInput {...editorProps} />}

          <ComposerToolbar
            acceptFileTypes={acceptFileTypes}
            attachmentAction={attachmentAction}
            attachDisabled={disabled || attachDisabled}
            canSubmit={canSubmit}
            classNames={classNames}
            fileInputRef={fileInputRef}
            isGenerating={isGenerating}
            isUploading={isUploading}
            labels={labels}
            onAttachFiles={onAttachFiles}
            onStop={onStop}
            sendButtonVariant={sendButtonVariant}
            stopIcon={stopIcon}
            submitIcon={submitIcon}
            testIds={testIds}
            toolbarEndAction={toolbarEndAction}
            variant={variant}
          />
        </div>
      </div>
    </form>
  )
}
