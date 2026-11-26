import { useState } from 'react'
import {
  AvatarEditButton,
  Button,
  ComposerAttachButton,
  ComposerSendButton,
  ComposerStopButton,
  Dialog,
  DialogContent,
  DialogTitle,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Input,
  MoreIconButton,
  ProductSendIcon,
  SettingsPanelToggleButton,
  SidebarToggleButton,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  UpdateActionButton,
  UpdateAvailableBadge,
  PromotionBadge,
} from '@zooclaw/zooworkdesign'
import { usePreviewLocale } from './locale'
import { previewAsset } from './preview-assets'

export function ProductActionExamples() {
  const { t } = usePreviewLocale()
  const [draft, setDraft] = useState('')
  const [running, setRunning] = useState(false)
  const [sidebar, setSidebar] = useState(true)
  const [panel, setPanel] = useState(true)
  const [avatarOpen, setAvatarOpen] = useState(false)
  const [avatar, setAvatar] = useState('owl')
  const [notice, setNotice] = useState('')
  const [updating, setUpdating] = useState(false)
  return (
    <div className="pv-source-controls" id="product-icon-buttons">
      <h3>{t('Product icon buttons')}</h3>
      <p className="pv-sd">
        {t(
          'Original product controls, shared with the app: attachment 36px, send/stop 32px, avatar 36px, panel 32px and More 28px. Each example keeps its own interaction; business actions are local demonstrations.',
        )}
      </p>
      <div className="pv-action-grid">
        <div>
          <h4>{t('Attach · send · stop')}</h4>
          <form
            className="pv-action-composer"
            onSubmit={(event) => {
              event.preventDefault()
              if (draft.trim() && !running) setRunning(true)
            }}
          >
            <Input
              aria-label={t('Example message')}
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder={t('Type to enable sending')}
            />
            <div className="flex items-center justify-between pt-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <ComposerAttachButton aria-label={t('Add attachment')} />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onSelect={() => setNotice('Attachment selected in preview')}>
                    {t('Upload file')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              {running ? (
                <ComposerStopButton aria-label={t('Stop example generation')} onClick={() => setRunning(false)} />
              ) : (
                <ComposerSendButton aria-label={t('Send example message')} disabled={!draft.trim()}>
                  <ProductSendIcon />
                </ComposerSendButton>
              )}
            </div>
          </form>
          <div className="mt-3 flex gap-3">
            <ComposerAttachButton aria-label={t('Attachment unavailable')} disabled />
            <ComposerSendButton aria-label={t('Sending unavailable')} disabled>
              <ProductSendIcon />
            </ComposerSendButton>
          </div>
        </div>
        <div>
          <h4>{t('Edit avatar')}</h4>
          <Dialog open={avatarOpen} onOpenChange={setAvatarOpen}>
            <AvatarEditButton aria-label={t('Choose example avatar')} onClick={() => setAvatarOpen(true)}>
              <img className="size-9 rounded-full" src={previewAsset(`product-source/avatars/${avatar}.png`)} alt="" />
            </AvatarEditButton>
            <DialogContent closeLabel={t('Close')} aria-describedby={undefined}>
              <DialogTitle>{t('Choose example avatar')}</DialogTitle>
              <div className="flex gap-4">
                {['owl', 'fox'].map((name) => (
                  <Button
                    key={name}
                    variant="ghost"
                    aria-label={name}
                    onClick={() => {
                      setAvatar(name)
                      setAvatarOpen(false)
                    }}
                  >
                    <img className="size-9 rounded-full" src={previewAsset(`product-source/avatars/${name}.png`)} alt="" />
                  </Button>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <div>
          <h4>{t('Sidebar · settings panel')}</h4>
          <div className="flex items-center gap-6">
            <div className="group/collapse group/expand">
              <SidebarToggleButton
                expanded={sidebar}
                aria-label={t(sidebar ? 'Collapse example sidebar' : 'Expand example sidebar')}
                aria-controls="action-sidebar-example"
                onClick={() => setSidebar(!sidebar)}
              />
            </div>
            <SettingsPanelToggleButton
              open={panel}
              aria-label={t(panel ? 'Hide example panel' : 'Show example panel')}
              aria-controls="action-panel-example"
              onClick={() => setPanel(!panel)}
            />
          </div>
          <div className="pv-panel-mini">
            <div id="action-sidebar-example" hidden={!sidebar}>
              {t('Navigation')}
            </div>
            <div id="action-panel-example" hidden={!panel}>
              {t('Settings')}
            </div>
          </div>
        </div>
        <div>
          <h4>{t('More actions')}</h4>
          <div className="flex gap-4">
            {(['horizontal', 'vertical'] as const).map((orientation) => (
              <DropdownMenu key={orientation}>
                <DropdownMenuTrigger asChild>
                  <MoreIconButton
                    orientation={orientation}
                    aria-label={t(orientation === 'horizontal' ? 'Horizontal more actions' : 'Vertical more actions')}
                  />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onSelect={() => setNotice('Rename selected in preview')}>
                    {t('Rename')}
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setNotice('Copy selected in preview')}>
                    {t('Copy')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ))}
          </div>
        </div>
      </div>
      <p className="bv-note" role="status">
        {notice ? t(notice) : t('Try the controls. Menus close with Escape and return focus to their trigger.')}
      </p>
      <h3 id="update-action">{t('Update action')}</h3>
      <p className="pv-sd">
        {t(
          'Purple is reserved for a version update action. Pending state keeps the button width and prevents repeat submission. It is not a subscription upgrade.',
        )}
      </p>
      <div className="pv-demo">
        <UpdateActionButton
          size="xs"
          updating={updating}
          label={t('Update')}
          loadingLabel={t('Updating')}
          onClick={() => setUpdating(true)}
        />
        <UpdateActionButton updating={false} label={t('Update')} loadingLabel={t('Updating')} disabled />
        {updating && (
          <Button size="sm" variant="outline" onClick={() => setUpdating(false)}>
            {t('Finish local update')}
          </Button>
        )}
      </div>
    </div>
  )
}

export function SourceBadgeExamples() {
  const { t } = usePreviewLocale()
  return (
    <div className="pv-source-controls" id="source-badges">
      <h3>{t('Update indicator & promotion')}</h3>
      <div className="pv-badge-comparison">
        <div className="group/agent inline-flex items-center gap-2">
          <span>{t('Agent name')}</span>
          <Tooltip>
            <TooltipTrigger asChild>
              <UpdateAvailableBadge tabIndex={0} label={t('New version available')} />
            </TooltipTrigger>
            <TooltipContent>{t('New version available')}</TooltipContent>
          </Tooltip>
        </div>
        <div data-marketing-surface className="inline-flex items-center gap-2">
          <span>{t('Website promotion')}</span>
          <PromotionBadge>{t('70% OFF')}</PromotionBadge>
        </div>
      </div>
      <p className="bv-note">
        {t(
          'The 16px circular arrow identifies an available agent update. The 14px pill identifies a website promotion; its text is campaign data, not a permanent product label.',
        )}
      </p>
    </div>
  )
}
