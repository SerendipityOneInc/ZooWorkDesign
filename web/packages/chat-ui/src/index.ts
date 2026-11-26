import { VideoCard as AttachmentVideoCard } from './attachments'
import type { VideoCard as ERMPVideoCard } from './ermp'

export { AgentPicker, ChatComposer, ComposerEffortPanel, ModelPicker, RichTextInput, SkillStoreDialog, SkillsSubMenu } from './composer'
export type {
  AgentPickerOption,
  AgentPickerProps,
  ChatComposerProps,
  ComposerEffortPanelProps,
  ComposerEffortLabels,
  ComposerEffortLevel,
  ModelPickerOption,
  ModelPickerProps,
  ModelProviderIconName,
  RichTextInputHandle,
  RichTextInputInsertOptions,
  RichTextInputProps,
  SkillStoreDialogItem,
  SkillStoreDialogLabels,
  SkillStoreDialogProps,
  SkillsSubMenuItem,
  SkillsSubMenuLabels,
  SkillsSubMenuProps,
} from './composer'
export { ActionTooltip, AttachmentChip, LoadingDots } from './primitives'
export type { ActionTooltipProps, AttachmentChipProps, LoadingDotsProps } from './primitives'
export { ChatShell } from './shell'
export type { ChatShellProps } from './shell'
export { NewTaskStarter, NewTaskStarterCategoryPill, NewTaskTemplateDialog } from './starters'
export type {
  NewTaskStarterAppearance,
  NewTaskStarterAgent,
  NewTaskStarterCategory,
  NewTaskStarterCategoryPillProps,
  NewTaskStarterLabels,
  NewTaskStarterMoreOption,
  NewTaskStarterPrompt,
  NewTaskStarterProps,
  NewTaskStarterTemplate,
  NewTaskTemplateDialogProps,
} from './starters'
export { ChatMessage, ChatThread } from './thread'
export type { ChatMessageProps, ChatThreadProps } from './thread'
export type {
  ChatComposerAttachmentAction,
  ChatComposerAttachmentActionProps,
  ChatComposerSubmit,
  ChatComposerBanner,
  ChatComposerClassNames,
  ChatComposerQuote,
  ChatComposerSendButtonVariant,
  ChatComposerStatus,
  ChatComposerTestIds,
  ChatComposerVariant,
  ChatMessageRenderContext,
  ChatMessageRenderer,
  ChatUiAttachment,
  ChatUiAttachmentIconContext,
  ChatUiAttachmentIconRenderer,
  ChatUiAttachmentPresentation,
  ChatUiAttachmentStatus,
  ChatUiFileReferenceIconFactory,
  ChatUiClassNames,
  ChatUiLabels,
  ChatUiMessage,
  ChatUiMessageStatus,
  ChatUiRole,
} from './types'
export type { FormatTimestampOptions } from './utils'
export {
  copyToClipboard,
  cx,
  DEFAULT_LABELS,
  formatFileSize,
  formatTimestamp,
  mergeLabels,
  normalizeComposerValue,
} from './utils'
export { ModelDegradationBanner } from './banners'
export type { ModelDegradationBannerProps } from './banners'
export { InteractiveCards, QuickActionCards } from './cards'
export type { InteractiveCardsProps, QuickActionCardsProps, QuickActionItem } from './cards'
export { SpecialistOpenCard, SpecialistConsentCard, humanizeAgentId } from './specialist'
export type { SpecialistOpenCardProps, SpecialistConsentCardProps } from './specialist'
export { ERMPCardRenderer } from './ermp'
export type {
  ActionsCard,
  AudioCard,
  CompositeCard,
  ERMPButton,
  ERMPCard,
  ERMPCardBase,
  FileCard,
  FormCard,
  FormField,
  KVCard,
  KVItem,
  TableCard,
  TableColumn,
} from './ermp'
export type VideoCard = ERMPVideoCard
export { ChatUiProvider, useChatUiConfig } from './provider'
export type { ChatUiConfig, ChatUiLogger, ChatUiTranslate } from './provider'
export { ToolGroup, toolIdentityDetail, toolLabelKey } from './tools'
export type { ToolLabelKey } from './tools'
export type { InteractiveCardButton, InteractiveCardSelectOption, InteractiveCardView, ToolStep } from './types'
export {
  AssistantMessage,
  buildCardActionMessage,
  buildFormSubmitMessage,
  emojiNameToChar,
  formatMessageTime,
  formatTurnStatusLabel,
  parseQuoteAndReply,
  QUOTE_MAX_CHARS,
  ReplyArrowIcon,
  shouldShowTurnStatusOnUserMessage,
  TURN_STATUS_DETAIL_COMPLETED_WITHOUT_VISIBLE_RESPONSE,
  TURN_STATUS_DETAIL_STOPPED,
  truncateQuoteText,
  turnStatusDotClass,
  UserMessage,
} from './messages'
export type {
  AssistantMessageProps,
  AssistantMessageSlots,
  AssistantMessageView,
  UserMessageProps,
  UserMessageSlots,
  UserMessageView,
} from './messages'
export type { ChatUiMarkdownContext } from './provider/ChatUiProvider'
export type { TurnStatusPhase, TurnStatusState, TurnStatusView } from './types'
export {
  AttachmentGallery,
  AudioAttachment,
  browserMimeType,
  FileAttachment,
  formatAttachmentSize,
  ImageAttachment,
  largeImageBoxStyle,
  ScrollableImageRow,
  VideoAttachment,
} from './attachments'
export type { AttachmentGalleryItem, AttachmentKind, AttachmentView } from './attachments'
export const VideoCard = AttachmentVideoCard

export { getProductComposerPresentation } from './composer/presentation'

export { ComposerAddMenu } from './composer/ComposerAddMenu'
export type { ComposerAddMenuProps, ComposerAddMenuLabels, ComposerRecentFile } from './composer/ComposerAddMenu'

export { ChatActivity } from './activity/ChatActivity'
export { NeutralChatActivityIcon } from './activity/NeutralChatActivityIcon'
export { ClawSpinner } from './activity/ClawSpinner'
export { MobiusLoadingIcon } from './activity/MobiusLoadingIcon'

export { ChatMentionsInput } from './composer/ChatMentionsInput'
export type { ChatMentionsInputProps } from './composer/ChatMentionsInput'
