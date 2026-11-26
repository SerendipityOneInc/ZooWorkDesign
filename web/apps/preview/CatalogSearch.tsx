import { CHAT_PREVIEW_COMPONENTS } from './chat-ui/registry'
import { ConstructionBadge } from './ConstructionBadge'
import { useEffect, useRef, useState } from 'react'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { Button, Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList,
  Dialog, DialogContent, DialogTitle, DialogDescription, Kbd } from '@zooclaw/zooworkdesign'
import { CATALOG, type CatalogId } from './catalog'
import { usePreviewLocale, translatePreview } from './locale'

export function CatalogSearch({ onNavigate }: { onNavigate: (id: CatalogId) => void }) {
  const { locale, t } = usePreviewLocale()
  const [open, setOpen] = useState(false)
  const trigger = useRef<HTMLButtonElement>(null)
  const label = locale === 'en' ? 'Search components' : '搜索组件'
  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setOpen(value => !value)
      }
    }
    document.addEventListener('keydown', listener)
    return () => document.removeEventListener('keydown', listener)
  }, [])
  return <>
    <Button ref={trigger} variant="outline" className="pv-catalog-search" aria-label={label} onClick={() => setOpen(true)}>
      <MagnifyingGlassIcon /><span>{label}</span><Kbd>⌘K / Ctrl K</Kbd>
    </Button>
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent closeLabel={t('Close')} className="flex h-[560px] max-h-[calc(100dvh-2rem)] flex-col gap-0 overflow-hidden p-0 sm:max-w-xl"
        onCloseAutoFocus={event => { event.preventDefault(); trigger.current?.focus() }}>
        <DialogTitle className="sr-only">{label}</DialogTitle>
        <DialogDescription className="sr-only">
          {locale === 'en' ? 'Search by name, then press Enter to jump to a component.' : '输入组件名称，按回车跳转到组件。'}
        </DialogDescription>
        <Command label={label} className="min-h-0 flex-1">
          <div className="shrink-0 pr-10"><CommandInput placeholder={label} aria-label={label} /></div>
          <CommandList className="min-h-0 max-h-none flex-1">
            <CommandEmpty>{locale === 'en' ? 'No components found.' : '没有找到组件。'}</CommandEmpty>
            {CATALOG.map(group => <CommandGroup key={group.group} heading={t(group.group)}>
              {group.items.map(([id, name]) => <CommandItem key={id} value={id}
                keywords={[...(CHAT_PREVIEW_COMPONENTS[id as keyof typeof CHAT_PREVIEW_COMPONENTS] ?? []), translatePreview('en', name), translatePreview('zh', name),
                  ...(id === 'tabs' ? ['Tabs', 'Segmented', '选项卡', '分段选择器', '分段控制器', '切换控件'] : []),
                  ...(id === 'slider' ? ['EffortSlider', 'Effort', 'Thinking', 'Max', '思考强度', '滑块'] : []),
                  ...(id === 'statistic' ? ['Sparkline', 'Trend', 'Dashboard', '趋势线', '迷你折线图', '数据看板'] : []),
                  ...(id === 'chat-composer' ? ['Composer', 'Chat input', 'Message', 'Send', '聊天', '输入框', '消息', '发送'] : []),
                  ...(id === 'chat-attachments' ? ['Attachment', 'Upload', 'File', 'Image', '发送前', '发送后', '附件', '上传', '添加文件', '添加图片'] : []),
                  ...(id === 'chat-messages' ? ['Text message', 'Image message', 'Quoted reply', '消息', '图文', '纯文字', '引用回复', '发送后'] : []),
                  ...(id === 'chat-session' ? ['Edit Agent', 'Chat session', 'Send', '编辑智能体', '完整会话', '聊天', '发送'] : []),
                  ...(id === 'mentions' ? ['Mention', '@', 'Chat', 'Agent', 'Teammate', '提及', '同事', '智能体', '聊天'] : []),
                  ...(id === 'loading' ? ['Skeleton', 'Spinner', 'Spin', 'Progress', '骨架屏', '加载', '进度'] : []),
                  ...(id === 'global-alert' ? ['Notification', 'Banner', 'GlobalAlert', '全局通知', '固定通知', '公告', '横幅'] : []),
                  ...(id === 'card' ? ['Connector', 'Agent', 'Skill', '连接卡片'] : [])]}
                onSelect={() => { setOpen(false); onNavigate(id) }}>
                <span className="min-w-0 flex-1">{t(name)}</span>
                {group.group === 'Chat UI' && <ConstructionBadge compact />}
              </CommandItem>)}
            </CommandGroup>)}
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  </>
}
