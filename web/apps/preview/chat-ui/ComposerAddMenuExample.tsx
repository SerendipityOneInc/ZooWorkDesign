import { useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { DocumentTextIcon } from '@heroicons/react/24/outline'
import { ComposerAddMenu, SkillsSubMenu, SkillStoreDialog, type ChatComposerAttachmentActionProps, type ChatUiAttachment } from './source'
import { useChatCopy } from './shared'

/** The production menu with local data/callbacks, as in the application's attachmentAction slot. */
export function ComposerAddMenuExample({ disabled, openFilePicker, onAttach, onInsert, onAction, triggerLabel, recentFiles }: ChatComposerAttachmentActionProps & {
  onAttach: (file: ChatUiAttachment) => void
  onInsert: (text: string) => void
  onAction: (text: string) => void
  triggerLabel?: string
  recentFiles?: ChatUiAttachment[]
}) {
  const { c } = useChatCopy()
  const [open, setOpen] = useState(false)
  const [recent, setRecent] = useState(false)
  const [skills, setSkills] = useState(false)
  const [store, setStore] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const pendingPrompt = useRef(false)
  const files = recentFiles ?? [{ id: 'report', name: c('Weekly report.pdf', '周报.pdf'), size: 32768, status: 'ready' as const }, { id: 'notes', name: c('Research notes.txt', '研究笔记.txt'), size: 2048, status: 'ready' as const }]
  const changeOpen = (next: boolean) => { setOpen(next); if (!next) { setRecent(false); setSkills(false) } }
  return <>
    <ComposerAddMenu open={open} onOpenChange={changeOpen} disabled={disabled} triggerRef={triggerRef}
      recentFiles={files.map(file => ({ ...file, icon: <DocumentTextIcon className="size-4" /> }))}
      recentOpen={recent} onRecentOpenChange={next => { setRecent(next); if (next) setSkills(false) }} onRecentRetry={() => {}}
      onRecentFile={id => { const file = files.find(file => file.id === id); if (file) onAttach(file); changeOpen(false) }}
      onLocalFiles={openFilePicker}
      onOpenLibrary={() => onAction(c('Resource library selected. Recent files above use local examples.', '已选择资源库。上方最近文件使用本地示例。'))}
      onOpenConnectors={() => onAction(c('Connectors selected. Account connections are managed in the product.', '已选择连接器。账号连接在产品中管理。'))}
      onCloseAutoFocus={event => { if (pendingPrompt.current) { event.preventDefault(); pendingPrompt.current = false; onInsert(c('Help me create a new ZooWork Skill. Start by asking what the Skill should do, then guide me through defining its name, description, instructions, and required tools.', '帮我创建一个新的 ZooWork 技能。请先询问这个技能需要做什么，然后引导我定义它的名称、描述、指令和所需工具。')) } }}
      labels={{ trigger: triggerLabel ?? c('Add files and more', '添加文件及更多内容'), addFromLocalFiles: c('Add from local files', '从本地文件添加'), recentFiles: c('Recent files', '最近文件'), loadingRecentFiles: c('Loading recent files', '正在加载最近文件'), recentFilesLoadFailed: c('Could not load recent files', '无法加载最近文件'), retry: c('Retry', '重试'), noRecentFiles: c('No recent files', '暂无最近文件'), addFromLibrary: c('Add from library', '从资源库添加'), connectors: c('Connectors', '连接器') }}
      skillsMenu={<SkillsSubMenu showSkillList={false} items={[]} isLoading={false} isError={false} open={skills} onOpenChange={next => { setSkills(next); if (next) setRecent(false) }} subSide="right"
        labels={{ trigger: c('Use Skills', '使用技能'), loading: c('Loading Skills', '正在加载技能'), loadFailed: c('Could not load Skills', '无法加载技能'), openStore: c('Open Skill Store', '打开技能商店'), empty: c('No Skills found', '未找到技能'), createWithZooClaw: c('Create Skill with ZooWork', '使用 ZooWork 创建技能') }}
        onCreateSkill={() => { pendingPrompt.current = true; flushSync(() => changeOpen(false)) }} onInsertSkill={name => onInsert(`Use ${name} to…`)}
        onOpenMarket={() => { flushSync(() => changeOpen(false)); requestAnimationFrame(() => setStore(true)) }} />} />
    <SkillStoreDialog open={store} onOpenChange={next => { setStore(next); if (!next) requestAnimationFrame(() => triggerRef.current?.focus()) }}
      items={[{ id: 'research', slug: 'research', name: c('Market research', '市场研究'), author: 'ZooWork', icon: <DocumentTextIcon className="size-5" />, summary: c('Find sources and summarize trends.', '查找来源并总结趋势。') }]}
      isLoading={false} isError={false} onRetry={() => {}}
      onConfirm={item => { setStore(false); requestAnimationFrame(() => onInsert(`Use ${item.name} to…`)) }}
      labels={{ title: c('Skill Store', '技能商店'), description: c('Choose a Skill, then confirm to add it to this message.', '选择一个技能，然后确认将其添加到这条消息中。'), loading: c('Loading Skill Store', '正在加载技能商店'), loadFailedTitle: c('Could not load Skill Store', '无法加载技能商店'), loadFailedDescription: c('Please try again.', '请重试。'), retry: c('Retry', '重试'), emptyTitle: c('No Skills available', '暂无技能'), emptyDescription: c('New community Skills will appear here when they are available.', '新的社区技能会显示在这里。'), loadingMore: c('Loading…', '加载中…'), loadMore: c('Load more', '加载更多'), selectOne: c('Select one Skill to continue', '选择一个技能继续'), cancel: c('Cancel', '取消'), addToMessage: c('Add to message', '添加到消息') }} />
  </>
}
