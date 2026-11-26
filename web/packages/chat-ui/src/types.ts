import type React from 'react'

export type ChatUiRole = 'user' | 'assistant' | 'system'
export type ChatUiMessageStatus = 'pending' | 'streaming' | 'complete' | 'error'
export type ChatUiAttachmentStatus = 'uploading' | 'ready' | 'error'

export interface ChatUiAttachment {
  id: string
  name: string
  mimeType?: string
  size?: number
  status?: ChatUiAttachmentStatus
  previewUrl?: string
  canOpen?: boolean
  statusLabel?: string
  canRetry?: boolean
}

export type ChatUiAttachmentPresentation = 'inline' | 'thumbnail'

export interface ChatUiAttachmentIconContext {
  attachment: ChatUiAttachment
  presentation: ChatUiAttachmentPresentation
}

/**
 * Slot for the file-type icon of a non-image attachment. The package owns the layout,
 * the application owns the extension → icon mapping, so chat-ui stays app-agnostic.
 */
export type ChatUiAttachmentIconRenderer = (context: ChatUiAttachmentIconContext) => React.ReactNode

/**
 * DOM factory for file references rendered inside the contentEditable composer.
 * The application supplies the icon so these inline cards can match its attachment UI.
 */
export type ChatUiFileReferenceIconFactory = (filename: string) => HTMLElement | null

export interface ChatUiMessage {
  id: string
  role: ChatUiRole
  content: string
  createdAt?: string | Date
  status?: ChatUiMessageStatus
  attachments?: ChatUiAttachment[]
}

export interface ChatUiLabels {
  attach?: string
  assistant?: string
  emptyTitle?: string
  emptyDescription?: string
  inputPlaceholder?: string
  uploadingAttachment?: string
  removeAttachment?: string
  retryAttachment?: string
  send?: string
  stop?: string
  system?: string
  user?: string
}

export interface ChatUiClassNames {
  root?: string
  header?: string
  thread?: string
  message?: string
  composer?: string
}

export interface ChatMessageRenderContext {
  message: ChatUiMessage
  labels: Required<ChatUiLabels>
}

export interface ChatComposerSubmit {
  value: string
}

export type ChatComposerVariant = 'shell' | 'main' | 'compact' | 'launcher'
export type ChatComposerSendButtonVariant = 'default' | 'zoowork'

export interface ChatComposerBanner {
  title: string
  description: string
}

export interface ChatComposerStatus {
  kind: 'connection' | 'typing'
  text: string
  announce?: boolean
  icon?: React.ReactNode
  textClassName?: string
  tone?: 'caution' | 'neutral'
}

export interface ChatComposerQuote {
  text: string
  label?: string
  clearLabel?: string
  icon?: React.ReactNode
}

export interface ChatComposerClassNames {
  root?: string
  content?: string
  card?: string
  editor?: string
  toolbar?: string
  toolbarStart?: string
  toolbarEnd?: string
  sendButton?: string
  attachments?: string
}

export interface ChatComposerTestIds {
  root?: string
  fileInput?: string
  attachments?: string
  attachment?: string
  attachmentRemove?: string
  attachmentRetry?: string
  editor?: string
  attachButton?: string
  submitButton?: string
  stopButton?: string
  banner?: string
  status?: string
  quote?: string
  card?: string
  toolbarStart?: string
  toolbarEnd?: string
}

export interface ChatComposerAttachmentActionProps {
  openFilePicker: () => void
  disabled: boolean
  isUploading: boolean
}

export type ChatComposerAttachmentAction =
  | React.ReactNode
  | ((props: ChatComposerAttachmentActionProps) => React.ReactNode)

export type ChatMessageRenderer = (context: ChatMessageRenderContext) => React.ReactNode

export interface ToolStep {
  id: string
  name: string
  phase: 'running' | 'done' | 'error' | 'cancelled'
  startedAt: number
  runId?: string
  /** Allowlisted non-sensitive action projected by the transport adapter. */
  action?: string
  inputSummary?: string
  /** Runtime-authored terminal summary. Never synthesized by chat-ui. */
  summary?: string
  /** Runtime-authored in-flight progress. Never synthesized by chat-ui. */
  progressText?: string
  status?: string
  itemId?: string
  itemKind?: string
  output?: string
  durationMs?: number
  errorMessage?: string
}

export interface InteractiveCardButton {
  /** Mattermost post-action id — the `{action_id}` for `doPostAction`. */
  actionId: string
  label: string
  style: 'primary' | 'danger' | 'default'
}

export interface InteractiveCardSelectOption {
  label: string
  value: string
}

export interface InteractiveCardMultiSelectOption {
  /** Mattermost post-action id of the toggle button. */
  actionId: string
  /** Human label with the `✓ ` state prefix already stripped. */
  label: string
  /** Server-authoritative checked state derived from the `✓ ` name prefix. */
  checked: boolean
}

export type InteractiveCardView =
  | { kind: 'buttons'; text: string; buttons: InteractiveCardButton[] }
  | { kind: 'select'; text: string; actionId: string; placeholder: string; options: InteractiveCardSelectOption[] }
  | {
      kind: 'multiselect'
      text: string
      options: InteractiveCardMultiSelectOption[]
      submitActionId: string
      submitLabel: string
    }
  | { kind: 'banner'; text: string }

export type TurnStatusPhase = 'queued' | 'thinking' | 'tool' | 'compacting' | 'responding' | 'done' | 'error'
export type TurnStatusState = 'executing' | 'done' | 'error' | 'unknown'

export interface TurnStatusView {
  turnId: string
  userPostId: string
  channelId: string
  rootId?: string
  sessionKey?: string
  runId?: string
  phase: TurnStatusPhase
  state: TurnStatusState
  seq: number
  terminal: boolean
  updatedAt: number
  heartbeatAt: number
  startedAt?: number
  detail?: string
  toolName?: string
  errorMessage?: string
}
