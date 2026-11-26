/** Public UI coverage; also indexes source component names in catalog search. */
export const CHAT_UI_COMPONENTS = {
  'chat-composer': ['ChatComposer', 'RichTextInput', 'ComposerAddMenu'],
  'mentions': ['ChatMentionsInput'],
  'chat-pickers': ['AgentPicker', 'ModelPicker', 'ComposerEffortPanel', 'SkillsSubMenu', 'SkillStoreDialog'],
  'chat-messages': ['UserMessage', 'AssistantMessage', 'ReplyArrowIcon'],
  'chat-attachments': ['AttachmentChip', 'AttachmentGallery', 'ScrollableImageRow', 'ImageAttachment', 'FileAttachment', 'VideoAttachment', 'VideoCard', 'AudioAttachment'],
  'chat-activity': ['ChatActivity', 'NeutralChatActivityIcon', 'ClawSpinner', 'MobiusLoadingIcon', 'ToolGroup', 'LoadingDots', 'ActionTooltip', 'ModelDegradationBanner'],
  'chat-cards': ['QuickActionCards', 'InteractiveCards', 'ERMPCardRenderer', 'SpecialistOpenCard', 'SpecialistConsentCard'],
  'chat-session': ['ChatShell', 'ChatThread', 'ChatMessage'],
} as const

/** Product workflows are documented separately from reusable chat controls. */
export const CHAT_PATTERN_COMPONENTS = {
  'chat-starters': ['NewTaskStarter', 'NewTaskStarterCategoryPill', 'NewTaskTemplateDialog'],
} as const

export const CHAT_PREVIEW_COMPONENTS = { ...CHAT_UI_COMPONENTS, ...CHAT_PATTERN_COMPONENTS }

/** The overview, sidebar and document share these task-oriented groups. */
export const CHAT_UI_GROUPS = [
  { title: 'Input & sending', description: 'Compose, mention and choose tools', items: [
    ['chat-composer', 'Chat composer'], ['mentions', 'Mentions'], ['chat-pickers', 'Agent, model & skill pickers'],
  ] },
  { title: 'Messages & content', description: 'See what appears after sending', items: [
    ['chat-messages', 'Message types'], ['chat-attachments', 'Files & images'], ['chat-cards', 'Response cards'],
  ] },
  { title: 'Conversation & states', description: 'Run and complete a conversation', items: [
    ['chat-activity', 'Activity & loading'], ['chat-session', 'Complete conversation'],
  ] },
] as const

type ChatCatalogItem = (typeof CHAT_UI_GROUPS)[number]['items'][number]
export const CHAT_UI_CATALOG_ITEMS = [['chat-overview', 'Chat UI overview'] as const, ...CHAT_UI_GROUPS.flatMap<ChatCatalogItem>(group => group.items)]
export const CHAT_UI_SUBGROUPS: Record<string, string> = Object.fromEntries(CHAT_UI_GROUPS.map(group => [group.items[0][0], group.title]))
