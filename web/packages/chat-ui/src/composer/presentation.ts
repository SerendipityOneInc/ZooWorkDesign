import { cn } from '@zooclaw/zooworkdesign'
import type { ChatComposerClassNames } from '../types'

export const chatComposerSurfaceClassName =
  'relative flex flex-col rounded-[var(--brand-composer-radius,22px)] border border-[color:var(--brand-composer-border,var(--input,var(--chat-ui-border,#d4d4d4)))] bg-[color:var(--chat-ui-card,var(--chat-ui-assistant-bg,#ffffff))] shadow-[var(--brand-composer-shadow,0_12px_32px_rgba(0,0,0,0.02))] transition-[border-color,box-shadow]'
export const chatComposerEditorClassName = 'flex-1 text-[15px] font-normal leading-6 tracking-normal'

// Product variants share editor insets; session uses a shorter default height.
export function getProductComposerPresentation(surface: 'new-chat' | 'session', classNames?: ChatComposerClassNames) {
  return {
    variant: 'launcher' as const,
    classNames: {
      root: cn(surface === 'session' && 'shrink-0 pt-0 pb-2', classNames?.root),
      content: cn(surface === 'session' && 'px-6', classNames?.content),
      card: cn(
        'flex flex-col',
        surface === 'session'
          ? '[--chat-ui-composer-default-height:118px]'
          : '[--chat-ui-composer-default-height:168px] sm:[--chat-ui-composer-default-height:190px]',
        classNames?.card,
      ),
      editor: cn(
        'chat-session-scrollbar chat-composer-scrollbar flex-1',
        surface === 'session' && 'min-h-[60px]! pb-1!',
        classNames?.editor,
      ),
      toolbar: classNames?.toolbar,
      toolbarStart: classNames?.toolbarStart,
      toolbarEnd: classNames?.toolbarEnd,
      sendButton: classNames?.sendButton,
      attachments: cn('px-5 pb-2', classNames?.attachments),
    },
  }
}
