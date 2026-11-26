import { usePreviewLocale } from './locale'
import { previewAsset } from './preview-assets'
import { useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import {
  ArrowLeftIcon,
  ArrowRightOnRectangleIcon,
  Cog6ToothIcon,
  PlusIcon,
  UserCircleIcon,
  CreditCardIcon,
  ChartBarIcon,
  KeyIcon,
  BuildingOfficeIcon,
  UsersIcon,
  PencilSquareIcon,
  ArchiveBoxIcon,
  CalendarDaysIcon,
  ChatBubbleLeftRightIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  QuestionMarkCircleIcon,
  GiftIcon,
  DevicePhoneMobileIcon,
  CheckBadgeIcon,
} from '@heroicons/react/24/outline'
import { ProductNavIcon as AnimatedNavIcon } from '@zooclaw/zooworkdesign'
import { PrimaryNavAgentIcon as SideNavAgentIcon } from '@zooclaw/zooworkdesign'
import {
  Button,
  PrimaryNavigation,
  PrimaryNavLogo,
  PrimaryNavItem,
  PrimaryNavAgentSection,
  PrimaryNavAccountMenu,
  PrimaryNavFooter,
  AccountCreditsSection,
  AccountCreditsRow,
  AccountMenuItem,
  SecondaryNavigation,
  SecondaryNavBack,
  SecondaryNavItem,
  WorkspaceAgentSwitcher,
  WorkspaceSessionRow,
  WorkspaceNavigation,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@zooclaw/zooworkdesign'

const MotionSecondaryNavItem = motion.create(SecondaryNavItem)
const agents = [
  'Market Brief',
  '发布片场 LaunchReel',
  '小红书投放日报Agent',
  'Untitled Agent',
  'Untitled Agent',
  'Research Assistant',
  'Writing Assistant',
]
/** Local links preserve the source link semantics without leaving the fixture. */
export function LocalLink({ onClick, ...props }: React.ComponentProps<'a'>) {
  return (
    <a
      {...props}
      onClick={(event) => {
        event.preventDefault()
        onClick?.(event)
      }}
    />
  )
}

export function PreviewAccount({ collapsed, onSettings }: { collapsed: boolean; onSettings: () => void }) {
  const { t } = usePreviewLocale()
  const [open, setOpen] = useState(false)
  const [notice, setNotice] = useState('')
  const showSettings = () => { setOpen(false); onSettings() }
  return (
    <PrimaryNavFooter>
      {collapsed ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              className="bg-muted flex cursor-pointer items-center justify-center rounded-xl p-2.5 hover:opacity-70"
              aria-label={t('Open profile')}
              onClick={onSettings}
            >
              <span className="from-ecap-success-border to-ecap-success-text flex size-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-white">
                {t('L')}
              </span>
            </button>
          </TooltipTrigger>
          <TooltipContent side="right">{t('Lynn Z · 12,000 credits')}</TooltipContent>
        </Tooltip>
      ) : (
        <PrimaryNavAccountMenu
          displayName="Lynn Z"
          label={t('Account menu')}
          profileLabel={t('Open account menu')}
          menuLabel={t('Open account actions')}
          mobileAppLabel={t('Get mobile app')}
          open={open}
          onOpenChange={setOpen}
          statusContent={
            <div className="text-ecap-success-text text-[11px]">
              <CheckBadgeIcon className="mr-0.5 inline size-3" />
              {t('Vertical Plan')}
            </div>
          }
        >
          <button type="button" className="hover:bg-accent flex w-full items-center gap-3 rounded-t-xl p-4 text-left" onClick={showSettings}>
            <div className="from-ecap-success-border to-ecap-success-text flex size-10 items-center justify-center rounded-full bg-gradient-to-br text-white">
              {t('L')}
            </div>
            <div>
              <div className="text-sm font-semibold">{t('Lynn Z')}</div>
              <div className="text-muted-foreground text-xs">{t('Local preview account')}</div>
            </div>
          </button>
          <AccountCreditsSection>
            <p className="text-sm font-bold">{t('Vertical Plan')}</p>
            <div className="border-border my-2 border-t border-dashed" />
            <AccountCreditsRow
              label={t('Credits')}
              balance="12,000"
              onNavigate={showSettings}
              onAbout={() => setNotice('Credits are provided by the consuming application.')}
              aboutLabel={t('About credits')}
            />
          </AccountCreditsSection>
          <div className="py-1">
            <AccountMenuItem onClick={showSettings}>
              <Cog6ToothIcon className="text-muted-foreground size-4" />
              {t('Settings')}
            </AccountMenuItem>
            <AccountMenuItem onClick={() => setNotice('Gift code · local preview')}>
              <GiftIcon className="size-4" />
              {t('Redeem gift code')}
            </AccountMenuItem>
            <div className="border-border my-1 border-t" />
            <AccountMenuItem onClick={() => setNotice('Support · local preview')}>
              <QuestionMarkCircleIcon className="size-4" />
              {t('Feedback & Support')}
            </AccountMenuItem>
            <AccountMenuItem onClick={() => setNotice('Mobile app · local preview')}>
              <DevicePhoneMobileIcon className="size-4" />
              {t('Get mobile app')}
            </AccountMenuItem>
            <div className="border-border my-1 border-t" />
            <AccountMenuItem onClick={() => setOpen(false)}>
              <ArrowRightOnRectangleIcon className="size-4" />
              {t('Log out')}
            </AccountMenuItem>
          </div>
          {notice && <p role="status" className="text-muted-foreground px-4 pb-3 text-xs">{t(notice)}</p>}
        </PrimaryNavAccountMenu>
      )}
    </PrimaryNavFooter>
  )
}

export function SettingsNavigationExample({ onBack }: { onBack?: () => void }) {
  const { t } = usePreviewLocale()
  const [active, setActive] = useState('account')
  const groups = [
    {
      id: 'profile',
      label: 'Personal',
      items: [
        { id: 'account', label: 'General', Icon: UserCircleIcon },
        { id: 'account-usage', label: 'Usage', Icon: ChartBarIcon },
        { id: 'account-billing', label: 'Billing', Icon: CreditCardIcon },
        { id: 'account-api-keys', label: 'API Keys', Icon: KeyIcon },
      ],
    },
    {
      id: 'organization',
      label: 'Organization',
      items: [
        { id: 'organization-general', label: 'General', Icon: BuildingOfficeIcon },
        { id: 'organization-members', label: 'Members', Icon: UsersIcon },
        { id: 'organization-usage', label: 'Usage', Icon: ChartBarIcon },
      ],
    },
  ]
  return (
    <SecondaryNavigation
      title={t('Settings')}
      backLabel={t('Back to workspace')}
      activeTab={active}
      onTabChange={setActive}
      LinkComponent={(props) => <LocalLink {...props} onClick={onBack} />}
      sections={groups.map((group) => ({
        ...group,
        label: t(group.label),
        items: group.items.map((item) => ({
          ...item,
          label: t(item.label),
          icon: <item.Icon className="size-5 shrink-0" />,
        })),
      }))}
    />
  )
}

export function AgentNavigationExample({ onBack }: { onBack?: () => void }) {
  const { t } = usePreviewLocale()
  const [active, setActive] = useState('build')
  const [expanded, setExpanded] = useState(false)
  const [agentName, setAgentName] = useState('Market Brief')
  const reducedMotion = useReducedMotion()
  const [sessions, setSessions] = useState(
    [
      'Weekly market summary',
      'Launch plan',
      'Research sources',
      'Content review',
      'Competitor research',
      'Product notes',
      'Customer feedback',
      'Monthly report',
      'Team update',
      'Project outline',
    ].map((title, i) => ({ id: String(i), title, edited: false })),
  )
  const rows = [
    { id: 'build', label: 'Edit agent', Icon: PencilSquareIcon },
    { id: 'artifacts', label: 'Artifacts', Icon: ArchiveBoxIcon },
    { id: 'scheduled', label: 'Scheduled tasks', Icon: CalendarDaysIcon },
    { id: 'channels', label: 'External channels', Icon: ChatBubbleLeftRightIcon },
  ]
  return (
    <WorkspaceNavigation
      label={t('Agent workspace navigation')}
      back={
        <SecondaryNavBack onClick={onBack} aria-label={t('Back to workspace')}>
          <ArrowLeftIcon className="size-5 shrink-0" />
          <span className="hidden md:inline">{t('Back to workspace')}</span>
        </SecondaryNavBack>
      }
      switcher={
        <WorkspaceAgentSwitcher
          name={t(agentName)}
          labels={{
            switchAgent: t('Switch agent'),
            agents: t('Agents'),
            loading: t('Loading...'),
            unavailable: t('Unable to load agents'),
            retry: t('Retry'),
            showMore: t('Show More'),
          }}
          avatar={<img src={previewAsset('product-source/avatars/owl.png')} alt="" className="size-6 rounded-full md:size-8" />}
          items={['Market Brief', 'LaunchReel', 'Research Assistant'].map((name, i) => ({
            id: String(i),
            name: t(name),
            current: name === agentName,
            href: `#${name}`,
            avatar: (
              <img
                src={previewAsset(`product-source/avatars/${i % 2 ? 'fox' : 'owl'}.png`)}
                alt=""
                className="size-6 rounded-full"
              />
            ),
          }))}
          LinkComponent={(props) => (
            <LocalLink {...props} onClick={() => setAgentName(decodeURIComponent(String(props.href).slice(1)))} />
          )}
        />
      }
      actions={
        <>
          <Button
            variant="outline"
            className="hover:bg-sidebar-hover mb-3 w-full justify-center gap-2"
            onClick={() => setActive('new-task')}
          >
            <PlusIcon className="size-4" />
            <span className="hidden md:inline">{t('New task')}</span>
          </Button>
          {rows.map((row) => (
            <MotionSecondaryNavItem
              initial="rest"
              animate="rest"
              whileHover={reducedMotion ? undefined : 'hover'}
              whileFocus={reducedMotion ? undefined : 'hover'}
              whileTap={reducedMotion ? undefined : 'hover'}
              key={row.id}
              aria-current={active === row.id ? 'page' : undefined}
              title={t(row.label)}
              onClick={() => setActive(row.id)}
            >
              <AnimatedNavIcon name={`workspace-${row.id}`} className="size-5 shrink-0" />
              <span className="hidden md:inline">{t(row.label)}</span>
            </MotionSecondaryNavItem>
          ))}
        </>
      }
    >
      <div className="text-muted-foreground hidden px-3 pt-7 pb-3 text-xs md:block">{t('Recents')}</div>
      {sessions.slice(0, expanded ? sessions.length : 8).map((session) => (
        <WorkspaceSessionRow
          key={session.id}
          sessionId={session.id}
          title={session.edited ? session.title : t(session.title)}
          labels={{
            renameSession: t('Rename'),
            sessionActions: t('Session actions'),
            archiveSession: t('Archive'),
            archiveSessionTitle: t('Archive conversation?'),
            archiveSessionDescription: t('This conversation will be moved to the archive.'),
            cancel: t('Cancel'),
          }}
          isActive={active === session.id}
          onOpen={() => setActive(session.id)}
          className={`hover:bg-card focus-within:bg-card mb-1 rounded-[8px] px-3 ${active === session.id ? 'bg-card' : ''}`}
          onRename={async (title) =>
            setSessions((items) =>
              items.map((item) => (item.id === session.id ? { ...item, title, edited: true } : item)),
            )
          }
          onArchive={async () => setSessions((items) => items.filter((item) => item.id !== session.id))}
        />
      ))}
      <Button
        variant="ghost"
        size="sm"
        aria-expanded={expanded}
        className="hover:bg-sidebar-hover w-full gap-2 px-2"
        onClick={() => setExpanded((value) => !value)}
      >
        {expanded ? <ChevronUpIcon className="size-4" /> : <ChevronDownIcon className="size-4" />}
        <span className="hidden md:inline">{t(expanded ? 'Show Less' : 'Show More')}</span>
      </Button>
    </WorkspaceNavigation>
  )
}
export function PrimaryNavigationExample({ initialCollapsed = false, agentState = 'ready', onAgentStateChange,
  embedded = false, collapsed: controlledCollapsed, onCollapsedChange, initialSelected = 'connector' }: {
  initialCollapsed?: boolean
  agentState?: string
  onAgentStateChange?: (state: string) => void
  embedded?: boolean
  collapsed?: boolean
  onCollapsedChange?: (collapsed: boolean) => void
  initialSelected?: string
}) {
  const { t } = usePreviewLocale()
  const [internalCollapsed, setInternalCollapsed] = useState(initialCollapsed)
  const collapsed = controlledCollapsed ?? internalCollapsed
  const toggleCollapsed = () => { setInternalCollapsed(!collapsed); onCollapsedChange?.(!collapsed) }
  const [selected, setSelected] = useState(initialSelected)
  const [count, setCount] = useState(5)
  const row = (key: string, label: string, icon?: React.ReactNode) => (
    <PrimaryNavItem
      key={key}
      item={{
        key,
        label: t(label),
        href: `#${key}`,
        icon: icon ?? <AnimatedNavIcon name={key} className="size-[18px]" />,
      }}
      isActive={selected === key}
      isCollapsed={collapsed}
      LinkComponent={LocalLink}
      onNavigate={() => setSelected(key)}
    />
  )
  return (
    <div className={embedded ? 'pv-nav-example pv-nav-embedded' : 'pv-nav-example'}>
      <div className={embedded ? 'pv-primary-rail pv-primary-embedded' : 'pv-primary-rail pv-nav-stage'} data-app-shell data-nav-collapsed={collapsed}>
        <PrimaryNavigation
          className="relative"
          isCollapsed={collapsed}
          isMobile={false}
          isMobileMenuOpen={false}
          label={t('Main navigation')}
          logo={
            <PrimaryNavLogo
              isCollapsed={collapsed}
              isMobile={false}
              onToggle={toggleCollapsed}
              labels={{ toggle: t('Toggle navigation'), collapse: t('Collapse'), expand: t('Expand navigation') }}
              LinkComponent={LocalLink}
              lightLogoSrc={previewAsset('product-source/brand/zoowork-horizontal-navy.png')}
              darkLogoSrc={previewAsset('product-source/brand/zoowork-horizontal-white.png')}
              collapsedLogoSrc={previewAsset('product-source/brand/zoowork-symbol.png')}
            />
          }
          footer={<PreviewAccount collapsed={collapsed} onSettings={() => setSelected('settings')} />}
        >
          <div className="shrink-0 space-y-0.5 pt-1 pb-2">
            {row('home', 'Home')}
            {row('agents', 'Agents', <SideNavAgentIcon />)}
            {row('library', 'Artifacts')}
            {row('tasks', 'Tasks')}
          </div>
          <div className="min-h-0 overflow-y-auto overscroll-y-contain" data-testid="nav-agent-scroll">
            <PrimaryNavAgentSection
              expanded={!collapsed}
              labels={{
                agents: t('Agents'),
                loading: t('Loading...'),
                empty: t('No agents yet'),
                unavailable: t('Unable to load agents'),
                retry: t('Retry'),
                showMore: t('Show More'),
                showLess: t('Show Less'),
              }}
              loading={agentState === 'loading'}
              empty={agentState === 'empty'}
              failed={agentState === 'error'}
              onRetry={() => onAgentStateChange?.('ready')}
              hasMore={agentState === 'ready' && count < agents.length}
              showLess={agentState === 'ready' && count > 5}
              onShowMore={() => setCount(agents.length)}
              onShowLess={() => setCount(5)}
              createAction={
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      aria-label={t('Create agent')}
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:bg-foreground/10 hover:text-foreground focus-visible:bg-foreground/10 size-6 rounded-md p-1"
                      onClick={() => {
                        setSelected('new-agent')
                      }}
                    >
                      <PlusIcon className="size-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">{t('Create agent')}</TooltipContent>
                </Tooltip>
              }
            >
              {agentState === 'ready' &&
                agents
                  .slice(0, count)
                  .map((name, i) =>
                    row(
                      `agent-${i}`,
                      name,
                      <img
                        src={previewAsset(`product-source/avatars/${i % 2 ? 'fox' : 'owl'}.png`)}
                        alt=""
                        className="size-6 rounded-full object-cover"
                      />,
                    ),
                  )}
            </PrimaryNavAgentSection>
          </div>
          <div className="mt-5 shrink-0 space-y-0.5" data-testid="nav-plugin-links">
            {row('connector', 'Connector')}
            {row('mcp', 'MCP')}
            {row('skills', 'Skills')}
            {row('knowledge-base', 'Knowledge')}
          </div>
        </PrimaryNavigation>
      </div>
      {!embedded && <p className="pv-example-caption" role="status">
        {t('当前选中：')}
        {t(
          agents[Number(selected.replace('agent-', ''))] ??
            (
              {
                home: 'Home',
                agents: 'Agents',
                library: 'Artifacts',
                tasks: 'Tasks',
                connector: 'Connector',
                mcp: 'MCP',
                skills: 'Skills',
                'knowledge-base': 'Knowledge',
                settings: 'Settings',
                'new-agent': 'New agent',
              } as Record<string, string>
            )[selected] ??
            selected,
        )}
      </p>}
    </div>
  )
}
