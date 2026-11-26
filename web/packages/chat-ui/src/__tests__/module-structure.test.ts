import {
  AgentPicker as RootAgentPicker,
  AttachmentGallery as RootAttachmentGallery,
  AssistantMessage as RootAssistantMessage,
  ChatComposer as RootChatComposer,
  ChatMessage as RootChatMessage,
  ModelPicker as RootModelPicker,
  ChatShell as RootChatShell,
  AttachmentChip as RootAttachmentChip,
  ChatUiProvider as RootChatUiProvider,
  InteractiveCards as RootInteractiveCards,
  ImageAttachment as RootImageAttachment,
  ModelDegradationBanner as RootModelDegradationBanner,
  QuickActionCards as RootQuickActionCards,
  humanizeAgentId as RootHumanizeAgentId,
  SpecialistConsentCard as RootSpecialistConsentCard,
  SpecialistOpenCard as RootSpecialistOpenCard,
  ToolGroup as RootToolGroup,
  UserMessage as RootUserMessage,
  VideoCard as RootVideoCard,
} from '../index'
import { AttachmentGallery, ImageAttachment, VideoCard } from '../attachments'
import { ModelDegradationBanner } from '../banners'
import { InteractiveCards, QuickActionCards } from '../cards'
import { AgentPicker, ChatComposer, ModelPicker } from '../composer'
import { ChatUiProvider } from '../provider'
import { AttachmentChip } from '../primitives'
import { ChatShell } from '../shell'
import { AssistantMessage, UserMessage } from '../messages'
import { humanizeAgentId, SpecialistConsentCard, SpecialistOpenCard } from '../specialist'
import { ChatMessage } from '../thread'
import { ToolGroup } from '../tools'

describe('chat-ui module structure', () => {
  it('keeps responsibility barrels aligned with the public package entrypoint', () => {
    expect(AgentPicker).toBeTypeOf('function')
    expect(AgentPicker).toBe(RootAgentPicker)
    expect(ChatComposer).toBe(RootChatComposer)
    expect(ModelPicker).toBe(RootModelPicker)
    expect(ChatMessage).toBe(RootChatMessage)
    expect(AttachmentChip).toBe(RootAttachmentChip)
    expect(ChatShell).toBe(RootChatShell)
    expect(ToolGroup).toBe(RootToolGroup)
    expect(InteractiveCards).toBe(RootInteractiveCards)
    expect(QuickActionCards).toBe(RootQuickActionCards)
    expect(ModelDegradationBanner).toBe(RootModelDegradationBanner)
    expect(ChatUiProvider).toBe(RootChatUiProvider)
    expect(AssistantMessage).toBe(RootAssistantMessage)
    expect(UserMessage).toBe(RootUserMessage)
    expect(AttachmentGallery).toBe(RootAttachmentGallery)
    expect(ImageAttachment).toBe(RootImageAttachment)
    expect(VideoCard).toBe(RootVideoCard)
    expect(SpecialistOpenCard).toBe(RootSpecialistOpenCard)
    expect(SpecialistConsentCard).toBe(RootSpecialistConsentCard)
    expect(humanizeAgentId).toBe(RootHumanizeAgentId)
  })
})
