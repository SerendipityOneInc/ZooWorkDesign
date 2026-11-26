import { useEffect, useState, type ReactNode } from 'react'
import {
  AgentCatalogCard, AgentSummaryCard, AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
  Badge, Button, ChannelConnectionCard, Dialog, DialogContent,
  DialogDescription, DialogTitle, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
  MoreIconButton, ProjectResumeCard, SkillResourceCard, Tag, UpdateActionButton, UpdateAvailableBadge,
  sourceAssets,
} from '@zooclaw/zooworkdesign'
import { usePreviewLocale } from './locale'
import { previewAsset } from './preview-assets'

function Asset({ name, size }: { name: string; size: number }) {
  return <img src={sourceAssets.find((asset) => asset.name === name)?.src} alt="" width={size} height={size} className="object-contain" />
}
function Avatar({ size = 40 }: { size?: number }) {
  return <img src={previewAsset('product-source/avatars/owl.png')} alt="" width={size} height={size} className="shrink-0 rounded-full" />
}
function Family({ id, title, source, children }: { id: string; title: string; source: string; children: ReactNode }) {
  const { t } = usePreviewLocale()
  return (
    <div id={id} className="pv-card-family">
      <h3>{t(title)}</h3>
      <p className="bv-note"><code>{source}</code></p>
      <div className="pv-card-samples">{children}</div>
    </div>
  )
}
export function ProductCardExamples() {
  const { t } = usePreviewLocale()
  const [notice, setNotice] = useState('')
  const [hired, setHired] = useState(false)
  const [updating, setUpdating] = useState(false)
  const [channelDialog, setChannelDialog] = useState<'setup' | 'disconnect' | null>(null)
  const [connected, setConnected] = useState(true)
  const [selectedAgent, setSelectedAgent] = useState('Market Brief')
  useEffect(() => {
    if (!updating) return
    const timer = setTimeout(() => { setUpdating(false); setNotice('Local update complete') }, 1200)
    return () => clearTimeout(timer)
  }, [updating])
  const menu = (name: string) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild><MoreIconButton aria-label={t('Manage card', { name: t(name) })} /></DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onSelect={() => setNotice('Rename selected in preview')}>{t('Rename')}</DropdownMenuItem>
        <DropdownMenuItem onSelect={() => setNotice('Copy selected in preview')}>{t('Copy')}</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
  const description = t('Research, fact-checking, and synthesis.')
  return (
    <>
      <Family id="agent-summary-cards" title="Agent management cards" source="agents/components/AgentDefinitionCard.tsx">
        <AgentSummaryCard name={t('Market Brief')} description={description} avatar={<Avatar />} actions={menu('Market Brief')} href="#agent-summary-cards" />
        <AgentSummaryCard name={t('Content review')} description={description} avatar={<Avatar />} actions={menu('Content review')} indicator={<UpdateAvailableBadge label={t('New version available')} />} href="#agent-summary-cards" />
      </Family>
      <Family id="catalog-cards" title="Marketplace cards" source="components/agent-catalog/MarketplaceAgentCard.tsx">
        <AgentCatalogCard name={t('Sage')} description={description} avatar={<Avatar size={44} />}
          badge={<Tag size="sm">{t('Official')}</Tag>} href="#catalog-cards"
          skills={<div className="mt-3 flex max-h-6 gap-1.5 overflow-hidden"><Tag>{t('Research')}</Tag><Tag>{t('Fact-check')}</Tag></div>}
          actions={<Button size="sm" variant={hired ? 'outline' : 'default'} onClick={() => { setHired(!hired); setNotice('Card action completed locally') }}>{hired ? t('Hired') : '+ ' + t('Hire')}</Button>} />
        <AgentCatalogCard name={t('Market Brief')} description={description} avatar={<Avatar size={44} />}
          badge={<Tag size="sm">{t('Community')}</Tag>} href="#catalog-cards" updating={updating} updatingLabel={t('Updating')}
          skills={<div className="mt-3 flex max-h-6 gap-1.5 overflow-hidden"><Tag>{t('Research')}</Tag></div>}
          actions={<><UpdateActionButton updating={updating} label={t('Update')} loadingLabel={t('Updating')} onClick={() => setUpdating(true)} />{menu('Market Brief')}</>} />
      </Family>
      <Family id="skill-cards" title="Skill resource cards" source="components/skill-registry/RegistrySkillCard.tsx">
        <SkillResourceCard name={t('Research')} description={description} icon={<Asset name="skill-lightning" size={32} />} actions={menu('Research')} />
        <SkillResourceCard name={t('Content review')} description={description} icon={<Asset name="skill-lightning" size={32} />} status={<Badge variant="outline">{t('Disabled')}</Badge>} actions={menu('Content review')} />
      </Family>
      <Family id="channel-cards" title="External channel cards" source="components/agent-channels/components/channels/EngineChannelCard.tsx">
        <ChannelConnectionCard name="Telegram" account="@zoowork_demo_bot" icon={<Asset name="telegram" size={36} />}
          status={<Tag variant={connected ? 'success' : 'default'} className="h-6 rounded-full px-2 text-xs">{t(connected ? 'Connected' : 'Disconnected')}</Tag>}
          agentLabel={t('Target agent')} agentName={t(selectedAgent)} agentAvatar={<Avatar size={24} />} onSelectAgent={() => setChannelDialog('setup')}
          actions={<>
            <Button variant="outline" className="h-9 min-w-32 flex-1 rounded-[8px]" onClick={() => setChannelDialog('setup')}><Asset name="setup-bot" size={16} />{t('Set up bot')}</Button>
            <Button variant="outline" className="h-9 min-w-32 flex-1 rounded-[8px]" onClick={() => connected ? setChannelDialog('disconnect') : setConnected(true)}><Asset name="disconnect" size={16} />{t(connected ? 'Disconnect' : 'Connect')}</Button>
          </>} />
        <ChannelConnectionCard name="Discord" account="ZooWork Demo" icon={<Asset name="discord" size={36} />}
          status={<Tag variant="danger">{t('Error')}</Tag>}
          agentLabel={t('Target agent')} agentName={t(selectedAgent)} agentAvatar={<Avatar size={24} />} onSelectAgent={() => setChannelDialog('setup')}
          actions={<Button variant="outline" className="h-9 min-w-32 flex-1 rounded-[8px]" onClick={() => setChannelDialog('setup')}><Asset name="setup-bot" size={16} />{t('Set up bot')}</Button>} />
      </Family>
      <Dialog open={channelDialog === 'setup'} onOpenChange={(open) => { if (!open) setChannelDialog(null) }}>
        <DialogContent>
          <DialogTitle>{t('Target agent')}</DialogTitle>
          <DialogDescription>{t('This changes only the preview. No account or service is modified.')}</DialogDescription>
          <div className="flex flex-col gap-2">
            {['Market Brief', 'Content review'].map((name) => <Button key={name} variant="outline" onClick={() => { setSelectedAgent(name); setChannelDialog(null) }}>{t(name)}</Button>)}
          </div>
        </DialogContent>
      </Dialog>
      <AlertDialog open={channelDialog === 'disconnect'} onOpenChange={(open) => { if (!open) setChannelDialog(null) }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('Disconnect channel')}</AlertDialogTitle>
            <AlertDialogDescription>{t('This changes only the preview. No account or service is modified.')}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('Cancel')}</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={() => setConnected(false)}>{t('Disconnect')}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Family id="project-cards" title="Project cards & compact rows" source="agent-builder/AgentBuilderProjectCard.tsx">
        <ProjectResumeCard name={t('Market Brief')} status={<Badge variant="secondary">{t('Draft')}</Badge>} updatedLabel={t('Updated today')} resumeLabel={t('Resume')} href="#project-cards" />
        <ProjectResumeCard variant="row" name={t('Market Brief')} status={<Badge variant="secondary">{t('Draft')}</Badge>} updatedLabel={t('Updated today')} resumeLabel={t('Resume')} href="#project-cards" />
      </Family>
      <p className="bv-note" role="status">{notice ? t(notice) : t('Card structures come from product source. Data and actions here are local examples.')}</p>
    </>
  )
}
