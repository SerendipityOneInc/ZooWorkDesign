'use client'

import { createContext, useContext, useMemo } from 'react'

export type ChatUiTranslate = (key: string, params?: Record<string, string>) => string

export interface ChatUiMarkdownContext {
  onCardCallback?: (cardId: string | undefined, value: string) => void
  onCardFormSubmit?: (cardId: string | undefined, data: Record<string, unknown>) => void
  onSendMessage?: (text: string) => void
  onOpenSpecialist?: (agentId: string) => void
  suppressSpecialistCards?: boolean
  translate?: ChatUiTranslate
}

export interface ChatUiLogger {
  warn: (message: string) => void
  error: (message: string) => void
}

export interface ChatUiConfig {
  t: ChatUiTranslate
  logger: ChatUiLogger
  locale: string
  renderMarkdown: (content: string, ctx?: ChatUiMarkdownContext) => React.ReactNode
}

const DEFAULT_CONFIG: ChatUiConfig = {
  t: (key) => key,
  logger: { warn: () => undefined, error: () => undefined },
  locale: 'en',
  renderMarkdown: (content) => <span className="whitespace-pre-wrap">{content}</span>,
}

const ChatUiConfigContext = createContext<ChatUiConfig>(DEFAULT_CONFIG)

export function ChatUiProvider({
  children,
  t,
  logger,
  locale,
  renderMarkdown,
}: Partial<ChatUiConfig> & { children: React.ReactNode }) {
  const parent = useContext(ChatUiConfigContext)
  const value = useMemo(
    () => ({
      t: t ?? parent.t,
      logger: logger ?? parent.logger,
      locale: locale ?? parent.locale,
      renderMarkdown: renderMarkdown ?? parent.renderMarkdown,
    }),
    [parent, t, logger, locale, renderMarkdown],
  )
  return <ChatUiConfigContext.Provider value={value}>{children}</ChatUiConfigContext.Provider>
}

export function useChatUiConfig(): ChatUiConfig {
  return useContext(ChatUiConfigContext)
}
