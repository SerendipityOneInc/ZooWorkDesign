'use client'

import { useEffect, useImperativeHandle, useLayoutEffect } from 'react'
import type { HTMLAttributes } from 'react'
import type { MentionReference, MentionsValue } from '@zooclaw/zooworkdesign'
import { decorateEditorMentions, readEditorMentions } from './mention-dom'

import type { ChatUiFileReferenceIconFactory } from '../../types'
import { useRichTextClipboard } from './hooks/useRichTextClipboard'
import { useRichTextEditor } from './hooks/useRichTextEditor'
import { useRichTextKeyboard } from './hooks/useRichTextKeyboard'
import { moveCursorToEnd } from './markdown-dom'

export interface RichTextInputProps {
  value: string // markdown string
  onChange: (markdown: string) => void
  onKeyDown?: (e: React.KeyboardEvent) => void
  onSubmit?: () => void // called on Enter (Shift+Enter inserts newline)
  placeholder?: string
  /** Accessible name for the textbox. Falls back to the visible placeholder. */
  ariaLabel?: string
  disabled?: boolean
  className?: string
  onCompositionStart?: () => void
  onCompositionEnd?: () => void
  onImagePreview?: (url: string) => void
  onEmptyImageClick?: (alt: string) => void // called when clicking an image chip with no URL
  onFileDrop?: (files: File[]) => void // called when files are dropped
  acceptFileTypes?: string // accepted file types e.g. "image/*,video/*"
  /** Plain-text pastes above this length are offered as a .txt file. */
  maxInlinePasteCharacters?: number
  /** Visible status shown inside non-image file placeholders while they upload. */
  uploadingAttachmentLabel?: string
  removeAttachmentLabel?: string
  /** App-owned file-type icon used by file references in the editor. */
  getUploadPreview?: (placeholderUrl: string) => string | undefined
  createFileReferenceIcon?: ChatUiFileReferenceIconFactory
  /** Optional external ref for focus restoration by an application shell. */
  inputRef?: React.Ref<HTMLDivElement>
  commandRef?: React.Ref<RichTextInputHandle>
  testId?: string
  /** Optional chat-only mention extension. Ordinary composers keep their existing behavior. */
  mentionReferences?: readonly MentionReference[]
  onMentionValueChange?: (value: MentionsValue) => void
  onBeforeKeyDown?: (event: React.KeyboardEvent<HTMLDivElement>) => void
  onSelectionChange?: () => void
  onBlur?: React.FocusEventHandler<HTMLDivElement>
  editorAttributes?: Pick<
    HTMLAttributes<HTMLDivElement>,
    | 'id'
    | 'role'
    | 'aria-autocomplete'
    | 'aria-haspopup'
    | 'aria-expanded'
    | 'aria-controls'
    | 'aria-activedescendant'
    | 'aria-describedby'
  >
}

export interface RichTextInputHandle {
  focus: () => void
  focusAtEnd: () => void
  insertMarkdown: (markdown: string, options?: RichTextInputInsertOptions) => void
}

export interface RichTextInputInsertOptions {
  /** Add spaces when inserted text would otherwise join adjacent words. */
  ensureBoundarySpaces?: boolean
}

/**
 * Rich text input component
 * - Renders image/video/link chips inline within the editor
 * - Supports keyboard deletion and cursor positioning around chips
 * - Input and output are both in markdown format
 *
 * Composition layer only — editor lifecycle, keyboard, and clipboard concerns
 * live beside this component in editor/ (see
 * docs/superpowers/specs/2026-06-12-rich-text-input-decomposition.md).
 */
export function RichTextInput({
  value,
  onChange,
  onKeyDown,
  onSubmit,
  placeholder,
  ariaLabel,
  disabled,
  className = '',
  onCompositionStart,
  onCompositionEnd,
  onImagePreview,
  onEmptyImageClick,
  onFileDrop,
  acceptFileTypes = 'image/*,video/*',
  maxInlinePasteCharacters = 4000,
  uploadingAttachmentLabel = 'Uploading',
  removeAttachmentLabel = 'Remove attachment',
  createFileReferenceIcon,
  getUploadPreview,
  inputRef,
  commandRef,
  testId = 'rich-text-input',
  mentionReferences,
  onMentionValueChange,
  onBeforeKeyDown,
  onSelectionChange,
  onBlur,
  editorAttributes,
}: RichTextInputProps) {
  const {
    editorRef,
    isComposingRef,
    handleInput,
    insertMediaMarkdown,
    insertExternalMarkdown,
    handleFocus,
    handleBlur,
    handleCompositionStart,
    handleCompositionEnd,
  } = useRichTextEditor({
    value,
    onChange: (markdown) => {
      if (onMentionValueChange && editorRef.current)
        onMentionValueChange({ text: markdown, mentions: readEditorMentions(editorRef.current) })
      onChange(markdown)
    },
    placeholder,
    disabled,
    onCompositionStart,
    onCompositionEnd,
    chipCallbacks: {
      onImagePreview,
      onEmptyImageClick,
      uploadingAttachmentLabel,
      removeAttachmentLabel,
      createFileReferenceIcon,
      getUploadPreview,
    },
  })

  useLayoutEffect(() => {
    if (editorRef.current && mentionReferences && !isComposingRef.current) {
      decorateEditorMentions(editorRef.current, { text: value, mentions: mentionReferences })
    }
  }, [value, mentionReferences, disabled, editorRef, isComposingRef])

  useLayoutEffect(() => {
    editorRef.current?.querySelectorAll<HTMLButtonElement>('[data-chip-remove]').forEach(button => {
      button.setAttribute('aria-label', removeAttachmentLabel)
      button.title = `${removeAttachmentLabel}: ${button.closest('[data-alt]')?.getAttribute('data-alt') ?? ''}`
    })
  }, [value, removeAttachmentLabel, editorRef])

  useEffect(() => {
    if (!onSelectionChange) return
    const notify = () => {
      if (document.activeElement === editorRef.current) onSelectionChange()
    }
    document.addEventListener('selectionchange', notify)
    return () => document.removeEventListener('selectionchange', notify)
  }, [onSelectionChange, editorRef])

  useImperativeHandle(inputRef, () => editorRef.current as HTMLDivElement)
  useImperativeHandle(commandRef, () => ({
    focus: () => editorRef.current?.focus(),
    focusAtEnd: () => {
      const editor = editorRef.current
      if (!editor) return
      editor.focus()
      moveCursorToEnd(editor)
    },
    insertMarkdown: insertExternalMarkdown,
  }))

  const { handleKeyDown } = useRichTextKeyboard({
    editorRef,
    isComposingRef,
    onContentChange: handleInput,
    onSubmit,
    onKeyDown,
  })

  const { handlePaste, handleDragOver, handleDrop } = useRichTextClipboard({
    acceptFileTypes,
    maxInlinePasteCharacters,
    insertMediaMarkdown,
    onContentChange: handleInput,
    onFileDrop,
  })

  return (
    <div
      ref={editorRef}
      contentEditable={!disabled}
      role="textbox"
      {...editorAttributes}
      aria-multiline="true"
      aria-label={ariaLabel ?? placeholder}
      aria-disabled={disabled || undefined}
      data-testid={testId}
      onInput={handleInput}
      onKeyDown={(event) => {
        onBeforeKeyDown?.(event)
        if (!event.defaultPrevented) handleKeyDown(event)
      }}
      onKeyUp={onSelectionChange}
      onClick={onSelectionChange}
      onPaste={handlePaste}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onFocus={() => {
        handleFocus()
        onSelectionChange?.()
      }}
      onBlur={(event) => {
        handleBlur()
        onBlur?.(event)
      }}
      onCompositionStart={handleCompositionStart}
      onCompositionEnd={handleCompositionEnd}
      className={`${className} relative overflow-y-auto pb-8 break-words whitespace-pre-wrap outline-none before:pointer-events-none before:absolute before:inset-0 before:box-border before:overflow-hidden before:p-[inherit] before:leading-[inherit] before:break-words before:whitespace-pre-wrap before:text-[color:var(--chat-ui-muted-foreground,#737373)] before:content-[attr(data-placeholder)]`}
      data-placeholder={placeholder}
      suppressContentEditableWarning
    />
  )
}
