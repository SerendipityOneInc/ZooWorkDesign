import { ScrollableDialogExample } from './ScrollableDialogExample'
import { AppearanceSelectorExample, CreditAmountSelectorExample, ScrollableTableExample } from './PlatformComponentExamples'
import { ChatStarterExamples } from './chat-ui/StarterExamples'
import { ChatOverviewExamples } from './chat-ui/OverviewExamples'
import { ChatSessionExamples } from './chat-ui/SessionExamples'
import { CHAT_UI_SUBGROUPS } from './chat-ui/registry'
import { ChatCardExamples } from './chat-ui/CardExamples'
import { ChatActivityExamples } from './chat-ui/ActivityExamples'
import { ChatAttachmentExamples } from './chat-ui/AttachmentExamples'
import { ChatMessageExamples } from './chat-ui/MessageExamples'
import { ChatPickerExamples } from './chat-ui/PickerExamples'
import { MarketingLayoutExamples, WorkspaceLayoutExamples } from './LayoutExamples'
import { AlertExamples, GlobalAlertExamples } from './AlertExamples'
import { CATALOG as NAV, CatalogContent } from './catalog'
import { CatalogSearch } from './CatalogSearch'
import { ConstructionBadge } from './ConstructionBadge'
import { useCatalogNavigation } from './useCatalogNavigation'
import { SelectionExamples } from './SelectionExamples'
import { ChatComposerExamples } from './ChatComposerExamples'
import { SliderExamples } from './SliderExamples'
import { MentionsExamples } from './MentionsExamples'
import { SplitterExamples, LayoutExamples, CalendarExamples, CarouselExamples, StatisticExamples, TooltipExamples, LoadingExamples, ToastExamples } from './PlatformExamples'
import { ProductCardExamples } from './ProductCardExamples'
import { MobileDrawerExample } from './MobileDrawerExample'
import { IconCatalog, IllustrationCatalog, SourceEmptyExamples } from './SourceAssetGallery'
import { ProductActionExamples, SourceBadgeExamples } from './ProductActionExamples'
import { MarketingNavigationExample, MarketingFooterExample } from './MarketingExamples'
import { PreviewLocaleProvider, usePreviewLocale, type PreviewLocale } from './locale'
import { LanguageSelector } from './LanguageSelector'
import { SiteBrand } from './SiteBrand'
import { GitHubLink } from './GitHubLink'
import { ProductCardSection, ProductNavigationSection, ConnectorPatternSection } from './ProductPatterns'
import { BrandIdentity, BrandColorRules, BrandTypography } from './BrandFoundations'
// preview/App.tsx — ZooWork Design System docs site (preview chrome).
import {
  ArrowPathIcon,
  ArrowUpIcon,
  ArrowUpRightIcon,
  Bars3Icon,
  ChevronDownIcon,
  EnvelopeIcon,
  ExclamationTriangleIcon,
  InboxIcon,
  ListBulletIcon,
  MagnifyingGlassIcon,
  MoonIcon,
  PlusIcon,
  SunIcon,
  Squares2X2Icon,
  TagIcon,
  UserCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { CheckIcon } from '@heroicons/react/16/solid'
import { Fragment, useState } from 'react'

import { ComponentPhysicsHero } from './hero/ComponentPhysicsHero'
import { RoughNavMarker } from './RoughNavMarker'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AspectRatio,
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  Badge,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Button,
  ButtonGroup,
  ButtonGroupText,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Checkbox,
  CHANGELOG_ENTRIES,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DESIGN_SYSTEM_VERSION,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
  FocusModalityProvider,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
  Kbd,
  KbdGroup,
  Label,
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
  NativeSelect,
  NativeSelectOption,
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
  RadioGroup,
  RadioGroupItem,
  ScrollArea,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
  Separator,
  Sheet,
  SheetBody,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  Slider,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tag,
  TagAction,
  TagMeta,
  TagText,
  Textarea,
  Sonner,
  Toggle,
  ToggleGroup,
  ToggleGroupItem,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@zooclaw/zooworkdesign'


const COLOR_GROUPS = [
  {
    title: 'Core palette',
    colors: [
      {
        name: 'ink',
        value: '#181818',
        darkValue: '#F4F4F4',
        usage: 'primary text',
        background: 'var(--zc-ink)',
      },
      {
        name: 'ink-2',
        value: '#666666',
        darkValue: '#B5B5B5',
        usage: 'secondary text',
        background: 'var(--zc-ink-2)',
      },
      {
        name: 'ink-3',
        value: '#8A8A8A',
        darkValue: '#858585',
        usage: 'muted labels',
        background: 'var(--zc-ink-3)',
      },
      {
        name: 'brand',
        value: '#5755C6',
        usage: 'brand identity only',
        background: 'var(--zc-brand)',
      },
      {
        name: 'success',
        value: '#168A55',
        darkValue: '#4CC58A',
        usage: 'success state',
        background: 'var(--zc-success)',
      },
      {
        name: 'warning',
        value: '#B46808',
        darkValue: '#E6A34A',
        usage: 'warning state',
        background: 'var(--zc-warning)',
      },
    ],
  },
  {
    title: 'Neutral surfaces',
    colors: [
      {
        name: 'canvas',
        value: '#FAFAFA',
        darkValue: '#111111',
        usage: 'page background',
        background: 'var(--zc-canvas)',
      },
      {
        name: 'sidebar',
        value: '#F5F5F5',
        darkValue: '#161616',
        usage: 'navigation region',
        background: 'var(--zc-sidebar)',
      },
      {
        name: 'paper',
        value: '#FFFFFF',
        darkValue: '#1A1A1A',
        usage: 'cards / panels',
        background: 'var(--zc-paper)',
      },
      {
        name: 'surface-subtle',
        value: '#F3F3F3',
        darkValue: '#202020',
        usage: 'grouped background',
        background: 'var(--zc-surface-subtle)',
      },
    ],
  },
  {
    title: 'Interaction colors',
    colors: [
      {
        name: 'action',
        value: '#181818',
        darkValue: '#F4F4F4',
        usage: 'primary controls and selected indicators',
        background: 'var(--zc-action)',
      },
      {
        name: 'hover',
        value: '#F6F6F6',
        darkValue: '#242424',
        usage: 'pointer and keyboard hover',
        background: 'var(--zc-hover)',
      },
      {
        name: 'selected',
        value: '#F6F6F6',
        darkValue: '#242424',
        usage: 'persistent selection with indicator',
        background: 'var(--zc-selected)',
      },
      {
        name: 'line-subtle',
        value: '#EEEEEE',
        darkValue: '#242424',
        usage: 'quiet separators',
        background: 'var(--zc-line-subtle)',
      },
      {
        name: 'line',
        value: '#E5E5E5',
        darkValue: '#2E2E2E',
        usage: 'default boundaries',
        background: 'var(--zc-line)',
      },
      {
        name: 'line-strong',
        value: '#D4D4D4',
        darkValue: '#3B3B3B',
        usage: 'major region boundaries',
        background: 'var(--zc-line-strong)',
      },
    ],
  },
] as const

const COLOR_USAGE_RULES = [
  {
    role: 'Page background',
    token: 'background / canvas',
    utility: 'bg-background',
    rule: 'Use only for the app or page canvas; do not use it as a card surface.',
    background: 'var(--background)',
  },
  {
    role: 'Raised surface',
    token: 'card / paper',
    utility: 'bg-card',
    rule: 'Use for cards, panels, popovers, and selected pills that need a distinct surface.',
    background: 'var(--card)',
  },
  {
    role: 'Muted fill',
    token: 'muted / wash',
    utility: 'bg-muted',
    rule: 'Use for static grouped backgrounds, secondary fills, and disabled surfaces; not hover.',
    background: 'var(--muted)',
  },
  {
    role: 'Hover feedback',
    token: 'hover / accent',
    utility: 'hover:bg-hover',
    rule: 'Use only for transient hover or focus feedback on interactive rows and controls.',
    background: 'var(--hover)',
  },
  {
    role: 'Hairline',
    token: 'border / line',
    utility: 'border-border',
    rule: 'Default control, table, accordion, and section borders.',
    background: 'var(--border)',
  },
  {
    role: 'Strong divider',
    token: 'separator',
    utility: 'border-separator',
    rule: 'Reserve for major region boundaries; avoid using it between every row.',
    background: 'var(--separator)',
  },
] as const

const PRODUCT_TYPE_SCALE = [
  { name: 'ui-xs', value: '11px', usage: 'kbd text / micro hints', style: { fontSize: 'var(--text-ui-xs)' } },
  { name: 'ui-sm', value: '12px', usage: 'quiet metadata', style: { fontSize: 'var(--text-ui-sm)' } },
  { name: 'ui-md', value: '13px', usage: 'chips / controls', style: { fontSize: 'var(--text-ui-md)' } },
  {
    name: 'ui-lg',
    value: '14px',
    usage: 'body / navigation',
    style: { fontSize: 'var(--text-ui-lg)', fontWeight: 500 },
  },
  {
    name: 'title-sm',
    value: '16px / 600',
    usage: 'panel and card title',
    style: { fontSize: 'var(--text-title-sm)', fontWeight: 600 },
  },
  {
    name: 'title-md',
    value: '18px / 600',
    usage: 'section heading',
    style: { fontSize: 'var(--text-title-md)', fontWeight: 600 },
  },
] as const

const SPACING_TOKENS = [
  { name: 'control-y', value: '8px', usage: 'control vertical padding', size: 'var(--space-control-y)' },
  { name: 'control-x', value: '12px', usage: 'control horizontal padding', size: 'var(--space-control-x)' },
  { name: 'card', value: '16px', usage: 'card padding', size: 'var(--space-card)' },
  { name: 'panel', value: '24px', usage: 'panel sides', size: 'var(--space-panel)' },
  { name: 'section', value: '40px', usage: 'section breaks', size: 'var(--space-section)' },
] as const

const RADIUS_TOKENS = [
  { name: 'xs', value: '4px', usage: 'small indicators', size: 'var(--radius-xs)' },
  { name: 'sm', value: '6px', usage: 'tags and compact items', size: 'var(--radius-sm)' },
  { name: 'md', value: '8px', usage: 'controls and cards', size: 'var(--radius-md)' },
  { name: 'lg', value: '10px', usage: 'large cards', size: 'var(--radius-lg)' },
  { name: 'xl', value: '12px', usage: 'dialogs and drawers', size: 'var(--radius-xl)' },
] as const

const CHANGELOG_LABELS = {
  added: 'Added',
  changed: 'Changed',
  removed: 'Removed',
  fixed: 'Fixed',
  deprecated: 'Deprecated',
} as const

type ButtonLabVariant = 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive'
type ButtonLabSize = 'xs' | 'sm' | 'default' | 'lg'
type ButtonLabShape = 'rectangle' | 'pill'
type ButtonLabIcon = 'none' | 'leading' | 'trailing'

const BUTTON_LAB_VARIANTS: ReadonlyArray<{ label: string; value: ButtonLabVariant }> = [
  { label: 'Default', value: 'default' },
  { label: 'Secondary', value: 'secondary' },
  { label: 'Outline', value: 'outline' },
  { label: 'Ghost', value: 'ghost' },
  { label: 'Destructive', value: 'destructive' },
]

const BUTTON_LAB_SIZES: ReadonlyArray<{ label: string; value: ButtonLabSize }> = [
  { label: 'Extra small', value: 'xs' },
  { label: 'Small', value: 'sm' },
  { label: 'Medium', value: 'default' },
  { label: 'Large', value: 'lg' },
]

function ButtonLab() {
  const { t } = usePreviewLocale()
  const [variant, setVariant] = useState<ButtonLabVariant>('default')
  const [size, setSize] = useState<ButtonLabSize>('default')
  const [shape, setShape] = useState<ButtonLabShape>('rectangle')
  const [icon, setIcon] = useState<ButtonLabIcon>('none')
  const [loading, setLoading] = useState(false)
  const [disabled, setDisabled] = useState(false)

  const codeProps = [
    variant !== 'default' && `variant="${variant}"`,
    size !== 'default' && `size="${size}"`,
    shape === 'pill' && 'className="rounded-full"',
    loading && 'loading',
    disabled && 'disabled',
  ].filter(Boolean)
  const codeContent =
    icon === 'leading'
      ? '<PlusIcon data-icon="inline-start" /> Create agent'
      : icon === 'trailing'
        ? 'Create agent <ArrowUpRightIcon data-icon="inline-end" />'
        : 'Create agent'
  const codeSample = `<Button${codeProps.length > 0 ? ` ${codeProps.join(' ')}` : ''}>${codeContent}</Button>`

  return (
    <div className="pv-button-lab">
      <div className="pv-button-lab-stage">
        <div className="pv-button-lab-kicker">
          <span aria-hidden="true" /> {t('Live component')}
        </div>
        <div className="pv-button-lab-preview">
          <Button
            type="button"
            variant={variant}
            size={size}
            loading={loading}
            disabled={disabled}
            className={shape === 'pill' ? 'rounded-full' : undefined}
          >
            {icon === 'leading' && <PlusIcon data-icon="inline-start" />}
            {t('Create agent')}
            {icon === 'trailing' && <ArrowUpRightIcon data-icon="inline-end" />}
          </Button>
          <p>{t('Hover, press, or use Tab to inspect the interaction states.')}</p>
        </div>
        <code className="pv-button-lab-code">{codeSample}</code>
      </div>

      <div className="pv-button-lab-controls" aria-label={t('Button configuration')}>
        <fieldset className="pv-button-lab-field">
          <legend>{t('Appearance')}</legend>
          <div className="pv-button-lab-options">
            {BUTTON_LAB_VARIANTS.map((option) => (
              <label key={option.value} className="pv-button-lab-option">
                <input
                  type="radio"
                  name="button-lab-variant"
                  value={option.value}
                  checked={variant === option.value}
                  onChange={() => setVariant(option.value)}
                />
                <span>{t(option.label)}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="pv-button-lab-field">
          <legend>{t('Size')}</legend>
          <div className="pv-button-lab-options">
            {BUTTON_LAB_SIZES.map((option) => (
              <label key={option.value} className="pv-button-lab-option">
                <input
                  type="radio"
                  name="button-lab-size"
                  value={option.value}
                  checked={size === option.value}
                  onChange={() => setSize(option.value)}
                />
                <span>{t(option.label)}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="pv-button-lab-field">
          <legend>{t('Shape')}</legend>
          <div className="pv-button-lab-options">
            {(
              [
                { label: 'Rectangle', value: 'rectangle' },
                { label: 'Pill', value: 'pill' },
              ] as const
            ).map((option) => (
              <label key={option.value} className="pv-button-lab-option">
                <input
                  type="radio"
                  name="button-lab-shape"
                  value={option.value}
                  checked={shape === option.value}
                  onChange={() => setShape(option.value)}
                />
                <span>{t(option.label)}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="pv-button-lab-field">
          <legend>{t('Icon')}</legend>
          <div className="pv-button-lab-options">
            {(
              [
                { label: 'None', value: 'none' },
                { label: 'Leading', value: 'leading' },
                { label: 'Trailing', value: 'trailing' },
              ] as const
            ).map((option) => (
              <label key={option.value} className="pv-button-lab-option">
                <input
                  type="radio"
                  name="button-lab-icon"
                  value={option.value}
                  checked={icon === option.value}
                  onChange={() => setIcon(option.value)}
                />
                <span>{t(option.label)}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="pv-button-lab-switches">
          <div className="pv-button-lab-switch-row">
            <div>
              <Label htmlFor="button-lab-loading">{t('Loading')}</Label>
              <span>{t('Preserves intent and prevents another action.')}</span>
            </div>
            <Switch id="button-lab-loading" aria-label={t('Loading')} checked={loading} onCheckedChange={setLoading} />
          </div>
          <div className="pv-button-lab-switch-row">
            <div>
              <Label htmlFor="button-lab-disabled">{t('Disabled')}</Label>
              <span>{t('Unavailable until its prerequisite is met.')}</span>
            </div>
            <Switch
              id="button-lab-disabled"
              aria-label={t('Disabled')}
              checked={disabled}
              onCheckedChange={setDisabled}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export function App({ initialLocale }: { initialLocale?: PreviewLocale } = {}) {
  return (
    <PreviewLocaleProvider initialLocale={initialLocale}>
      <PreviewApp />
    </PreviewLocaleProvider>
  )
}

function PreviewApp() {
  const { t, locale } = usePreviewLocale()
  const [dark, setDark] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [agentScope, setAgentScope] = useState<'mine' | 'shared'>('mine')
  const [agentView, setAgentView] = useState<'grid' | 'list'>('list')
  const { activeSection, navigate, sidebarRef } = useCatalogNavigation()
  const setTheme = (next: boolean) => {
    setDark(next)
    document.documentElement.classList.toggle('dark', next)
  }


  return (
    <FocusModalityProvider>
      <>
        <div className="pv-bg" />

        <div className="pv-topbar">
          <a className="pv-logo" href={`${import.meta.env.BASE_URL}?lang=${locale}`} aria-label={t('ZooWorkDesign home')}>
            <SiteBrand />
          </a>
          <span className="pv-platform-label">React · Web</span>
          <CatalogSearch onNavigate={navigate} />
          <div className="pv-topbar-actions">
            <ButtonGroup aria-label={t('Color scheme')}>
              <Button
                aria-label={t('Light mode')}
                aria-pressed={!dark}
                onClick={() => setTheme(false)}
                size="icon-sm"
                variant="ghost"
              >
                <SunIcon />
              </Button>
              <Button
                aria-label={t('Dark mode')}
                aria-pressed={dark}
                onClick={() => setTheme(true)}
                size="icon-sm"
                variant="ghost"
              >
                <MoonIcon />
              </Button>
            </ButtonGroup>
            <LanguageSelector />
            <GitHubLink />
          </div>
        </div>

        <div className="pv-shell">
          <aside className="pv-side" ref={sidebarRef} aria-label={t('Component catalog')}>
            {NAV.map((g) => (
              <div key={g.group} className="pv-group">
                <div className="pv-ng">{t(g.group)}</div>
                {g.items.map(([id, label]) => (
                  <Fragment key={id}>
                  {g.group === 'Chat UI' && CHAT_UI_SUBGROUPS[id] && <div className="pv-chat-nav-subgroup">{t(CHAT_UI_SUBGROUPS[id])}</div>}
                  <a
                    className={g.group === 'Chat UI' ? 'pv-na pv-na-construction' : 'pv-na'}
                    href={`#${id}`}
                    aria-current={activeSection === id ? 'location' : undefined}
                    onClick={(event) => {
                      event.preventDefault()
                      navigate(id)
                    }}
                  >
                    <span className="pv-na-label">
                      {t(label)}
                      {activeSection === id && <RoughNavMarker />}
                    </span>
                    {g.group === 'Chat UI' && <ConstructionBadge compact />}
                  </a>
                  </Fragment>
                ))}
              </div>
            ))}
            <a className="pv-na" href={`${import.meta.env.BASE_URL}assets/licenses/index.html`}>
              <span className="pv-na-label">{t('Credits & licenses')}</span>
            </a>
          </aside>

          <main className="pv-main">
            <CatalogContent sections={{
              'purpose': (<section className="pv-section pv-intro-purpose" id="purpose">
              <p className="pv-intro-eyebrow">ZooWorkDesign · React Web</p>
              <h1>{t('A system for building trustworthy AI interfaces.')}</h1>
              <p className="pv-intro-lede">
                {t(
                  'ZooWork gives agent products a shared visual and behavioral foundation, so teams can focus on what an agent is doing instead of rebuilding interaction rules.',
                )}
              </p>
              <Button asChild variant="outline" size="sm">
                <a href={import.meta.env.BASE_URL + '?view=patterns&lang=' + locale}>{t('组件组合示例')}</a>
              </Button>
              <ComponentPhysicsHero />
            </section>),
              'principles': (<section className="pv-section pv-intro-section" id="principles">
              <div className="pv-intro-heading">
                <p className="pv-intro-eyebrow">{t('Introduction · Principles')}</p>
                <h2>{t('Designed to make intelligent systems feel clear.')}</h2>
              </div>
              <div className="pv-principle-list">
                <article className="pv-principle">
                  <span className="pv-principle-index">01</span>
                  <h3>{t('Neutral by default')}</h3>
                  <p>{t('Product UI stays quiet so content and agent state remain primary.')}</p>
                </article>
                <article className="pv-principle">
                  <span className="pv-principle-index">02</span>
                  <h3>{t('Brand with intent')}</h3>
                  <p>{t('ZooWork purple identifies the system and expressive moments, never routine controls.')}</p>
                </article>
                <article className="pv-principle">
                  <span className="pv-principle-index">03</span>
                  <h3>{t('Motion explains')}</h3>
                  <p>{t('Movement communicates hierarchy, causality, and state without slowing interaction.')}</p>
                </article>
              </div>
            </section>),
              'styling': (<section className="pv-section pv-intro-section" id="styling">
              <div className="pv-intro-heading">
                <p className="pv-intro-eyebrow">{t('Introduction · Styling')}</p>
                <h2>{t('Quiet structure, purposeful expression.')}</h2>
                <p className="pv-sd">
                  {t(
                    'Opaque surfaces define structure. Compact radii keep controls precise. Neutral actions preserve attention. ZooWork purple is reserved for identity and expressive moments.',
                  )}
                </p>
              </div>
              <div className="pv-styling-rules" aria-label={t('Styling rules')}>
                <span>{t('Opaque surfaces')}</span>
                <span>{t('Compact radii')}</span>
                <span>{t('Neutral actions')}</span>
                <span>{t('Intentional brand color')}</span>
              </div>
            </section>),
              'brand': (<BrandIdentity />),
              'color': (<section className="pv-section" id="color">
              <h2>{t('Color')}</h2>
              <p className="pv-sd">
                {t(
                  'Brand identity is separated from neutral component actions, surfaces, interaction states, and semantic feedback.',
                )}
              </p>
              <BrandColorRules />
              <div className="pv-color-groups">
                {COLOR_GROUPS.map((group) => (
                  <div className="pv-color-group" key={group.title}>
                    <h3 className="pv-color-heading">{t(group.title)}</h3>
                    <div className="pv-color-grid">
                      {group.colors.map((color) => (
                        <Card className="pv-color-token" key={color.name} size="sm">
                          <CardContent className="pv-color-token-content">
                            <div className="pv-color-chip" style={{ background: color.background }} />
                            <div>
                              <div className="pv-color-name">{t(color.name)}</div>
                              <div className="pv-color-value">
                                {t(dark && 'darkValue' in color ? color.darkValue : color.value)}
                              </div>
                              <div className="pv-color-usage">{t(color.usage)}</div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                ))}
                <div className="pv-color-group">
                  <div className="pv-color-heading">{t('Semantic usage')}</div>
                  <div className="border-border overflow-hidden rounded-lg border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>{t('Role')}</TableHead>
                          <TableHead>{t('Token / utility')}</TableHead>
                          <TableHead>{t('Rule')}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {COLOR_USAGE_RULES.map((item) => (
                          <TableRow key={item.role}>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <span
                                  aria-hidden="true"
                                  className="border-border size-6 shrink-0 rounded-md border"
                                  style={{ background: item.background }}
                                />
                                <span className="font-medium">{t(item.role)}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="grid gap-0.5">
                                <code className="text-xs">{item.token}</code>
                                <code className="text-muted-foreground text-xs">{item.utility}</code>
                              </div>
                            </TableCell>
                            <TableCell className="text-muted-foreground max-w-[420px] text-xs">
                              {t(item.rule)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>
            </section>),
              'type': (<section className="pv-section" id="type">
              <h2>{t('Typography')}</h2>
              <p className="pv-sd">
                {t('展示标题使用 GFS Didot，中文配对 Noto Serif SC；正文与功能界面使用 Inter 和 Noto Sans SC。')}
              </p>

              <BrandTypography />

              {/* type scale */}
              <div className="border-border mt-8 flex flex-col gap-6 border-t pt-6">
                <div>
                  <div className="pv-swatch-label">{t('h1 · sans · 36 / 600')}</div>
                  <div className="text-foreground text-4xl font-semibold text-balance">{t('Build with ZooWork')}</div>
                </div>
                <div>
                  <div className="pv-swatch-label">{t('h2 · sans · 30 / 600 · bottom rule')}</div>
                  <div className="border-border text-foreground border-b pb-2 text-3xl font-semibold">
                    {t('Components, not constraints')}
                  </div>
                </div>
                <div>
                  <div className="pv-swatch-label">{t('h3 · sans · 24 / 600')}</div>
                  <div className="text-foreground text-2xl font-semibold">{t('A token-driven system')}</div>
                </div>
                <div>
                  <div className="pv-swatch-label">{t('h4 · sans · 20 / 600')}</div>
                  <div className="text-foreground text-xl font-semibold">{t('Designed for clarity')}</div>
                </div>
                <div>
                  <div className="pv-swatch-label">{t('Lead · sans · 20 · muted')}</div>
                  <p className="text-muted-foreground max-w-prose text-xl">
                    {t('A compact product design system built on shadcn radix-nova and ZooWork semantic tokens.')}
                  </p>
                </div>
                <div>
                  <div className="pv-swatch-label">{t('Paragraph · sans · 16 · leading-7')}</div>
                  <p className="text-foreground max-w-prose leading-7">
                    {t(
                      'Body text uses Inter at a comfortable reading measure with relaxed line height. The quick brown fox jumps over the lazy dog, then routes the goal to the right specialist.',
                    )}
                  </p>
                </div>
                <div>
                  <div className="pv-swatch-label">{t('Blockquote · sans · left rule')}</div>
                  <blockquote className="border-primary text-foreground border-l-2 pl-6 text-lg">
                    {t('“Structure carries the interface; color clarifies the action.”')}
                  </blockquote>
                </div>
                <div>
                  <div className="pv-swatch-label">{t('List · disc · indented')}</div>
                  <ul className="text-foreground ml-6 list-disc [&>li]:mt-2">
                    <li>{t('Tokens flow from one source of truth.')}</li>
                    <li>{t('Components reference semantic utilities only.')}</li>
                    <li>{t('Brand purple identifies ZooWork; components use neutral interaction colors.')}</li>
                  </ul>
                </div>
                <div>
                  <div className="pv-swatch-label">{t('Inline code · mono · muted chip')}</div>
                  <p className="text-foreground leading-7">
                    {t('Merge classes with')}
                    {t(' ')}
                    <code className="bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-medium">
                      cn()
                    </code>
                    {t(' ')}
                    {t('before passing them down.')}
                  </p>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="pv-swatch-label">{t('Large / Small / Muted · sans')}</div>
                  <div className="text-foreground text-lg font-semibold">{t('Large — emphasis without a heading')}</div>
                  <div className="text-foreground text-sm leading-none font-medium">{t('Small — dense metadata')}</div>
                  <div className="text-muted-foreground text-sm">{t('Muted — secondary, low-emphasis text')}</div>
                </div>
                <div>
                  <div className="pv-swatch-label">{t('Table · sans · ruled rows')}</div>
                  <table className="w-full max-w-md border-collapse text-sm">
                    <thead>
                      <tr className="border-border border-b text-left">
                        <th className="text-foreground py-2 pr-4 font-medium">{t('Token')}</th>
                        <th className="text-foreground py-2 font-medium">{t('Role')}</th>
                      </tr>
                    </thead>
                    <tbody className="text-muted-foreground">
                      <tr className="border-border border-b">
                        <td className="text-foreground py-2 pr-4 font-mono">{t('--primary')}</td>
                        <td className="py-2">{t('Neutral ink · primary component action')}</td>
                      </tr>
                      <tr className="border-border border-b">
                        <td className="text-foreground py-2 pr-4 font-mono">{t('--foreground')}</td>
                        <td className="py-2">{t('Ink · fills & text')}</td>
                      </tr>
                      <tr>
                        <td className="text-foreground py-2 pr-4 font-mono">{t('--surface')}</td>
                        <td className="py-2">{t('Opaque component surfaces')}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div>
                  <div className="pv-swatch-label" style={{ marginBottom: 8 }}>
                    {t('Product UI scale · compact efficiency-first hierarchy')}
                  </div>
                  <div className="pv-token-grid">
                    {PRODUCT_TYPE_SCALE.map((type) => (
                      <Card key={type.name} size="sm">
                        <CardContent className="pv-token-card pv-type-scale-card">
                          <div>
                            <div className="pv-token-name">{t(type.name)}</div>
                            <div className="pv-token-value">{t(type.value)}</div>
                          </div>
                          <div className="pv-type-specimen" style={type.style}>
                            {t(type.usage)}
                          </div>
                          <div className="pv-type-baseline">
                            <span />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </section>),
              'spacing': (<section className="pv-section" id="spacing">
              <h2>{t('Spacing')}</h2>
              <p className="pv-sd">
                {t('A 4px-based rhythm: compact controls, 16px cards, 24px panels, and 40px section breaks.')}
              </p>
              <div className="pv-token-grid">
                {SPACING_TOKENS.map((space) => (
                  <Card key={space.name} size="sm">
                    <CardContent className="pv-token-card">
                      <div>
                        <div className="pv-token-name">{t(space.name)}</div>
                        <div className="pv-token-value">{t(space.value)}</div>
                        <div className="pv-token-usage">{t(space.usage)}</div>
                      </div>
                      <div className="pv-space-diagram" style={{ padding: space.size }}>
                        <div className="pv-space-diagram-inner">{t(space.value)}</div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>),
              'radius': (<section className="pv-section" id="radius">
              <h2>{t('Radius')}</h2>
              <p className="pv-sd">
                {t('A restrained 4px to 12px scale. The 8px radius is the default for controls and cards.')}
              </p>
              <div className="pv-token-grid">
                {RADIUS_TOKENS.map((radius) => (
                  <Card key={radius.name} size="sm">
                    <CardContent className="pv-token-card">
                      <div className="pv-radius-sample" style={{ borderRadius: radius.size }} />
                      <div>
                        <div className="pv-token-name">{t(radius.name)}</div>
                        <div className="pv-token-value">{t(radius.value)}</div>
                        <div className="pv-token-usage">{t(radius.usage)}</div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>),
              'shadow': (<section className="pv-section" id="shadow">
              <h2>{t('Elevation')}</h2>
              <p className="pv-sd">
                {t('Borders define structure. Shadows are reserved for overlays, raised panels, and dialogs.')}
              </p>
              <div className="pv-token-grid">
                {[
                  ['card', 'var(--elevation-card)', 'optional low lift for repeated cards'],
                  ['overlay', 'var(--elevation-overlay)', 'menus, selects, and popovers'],
                  ['raised', 'var(--elevation-raised)', 'sheets and floating panels'],
                  ['dialog', 'var(--elevation-dialog)', 'modal dialogs and confirmations'],
                ].map(([name, shadow, usage]) => (
                  <Card key={name} size="sm">
                    <CardContent className="pv-token-card">
                      <div className="pv-shadow-stage">
                        <div className="pv-shadow-sample" style={{ boxShadow: shadow }} />
                      </div>
                      <div>
                        <div className="pv-token-name">{t(name)}</div>
                        <div className="pv-token-value">{t(usage)}</div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>),
              'surfaces': (<section className="pv-section" id="surfaces">
              <h2>{t('Surfaces')}</h2>
              <p className="pv-sd">
                {t('Opaque surfaces define page regions with color and one-pixel boundaries, never blur.')}
              </p>
              <div className="pv-token-grid">
                {[
                  ['canvas', 'var(--background)', 'application canvas'],
                  ['sidebar', 'var(--sidebar)', 'navigation region'],
                  ['surface', 'var(--surface)', 'cards and overlay panels'],
                  ['subtle', 'var(--surface-subtle)', 'grouped controls and muted regions'],
                ].map(([name, background, usage]) => (
                  <Card key={name} size="sm">
                    <CardContent className="pv-token-card">
                      <div className="pv-surface-preview" style={{ background }}>
                        <span>{t(name)}</span>
                      </div>
                      <div>
                        <div className="pv-token-name">{t(name)}</div>
                        <div className="pv-token-value">{t(usage)}</div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>),
              'icons': (<section className="pv-section" id="icons">
              <h2>{t('Iconography')}</h2>
              <IconCatalog />
            </section>),
              'illustrations': (<IllustrationCatalog />),
              'motion': (<section className="pv-section" id="motion">
              <h2>{t('Motion')}</h2>
              <p className="pv-sd">
                {t(
                  'Shared duration and easing tokens keep controls crisp, layout changes calm, and expressive strokes deliberate.',
                )}
              </p>
              <div className="pv-motion-grid">
                {[
                  ['fast', '120ms', 'Hover and press feedback'],
                  ['normal', '180ms', 'Control state changes'],
                  ['emphasis', '250ms', 'Entrances and disclosure'],
                  ['layout', '350ms', 'Panels and spatial shifts'],
                  ['drawn', '800ms', 'Hand-drawn brand marks'],
                ].map(([name, duration, usage]) => (
                  <Card key={name} size="sm">
                    <CardContent className="pv-motion-card">
                      <div className="pv-motion-track">
                        <span className={`pv-motion-sample motion-${name}`} />
                      </div>
                      <div>
                        <div className="pv-token-name">
                          {t(name)} · {t(duration)}
                        </div>
                        <div className="pv-token-value">{t(usage)}</div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>),
              'button': (<section className="pv-section" id="button">
              <div className="pv-component-heading">
                <p className="pv-intro-eyebrow">{t('Buttons · Action')}</p>
                <h2>{t('Button')}</h2>
                <p className="pv-sd">
                  {t(
                    'Triggers an immediate action. Appearance describes hierarchy; state communicates whether the action is ready, in progress, or unavailable.',
                  )}
                </p>
              </div>

              <ButtonLab />
              <ProductActionExamples />

              <div className="pv-button-docs">
                <div className="pv-button-subsection">
                  <div className="pv-button-subsection-heading">
                    <h3>{t('Anatomy')}</h3>
                    <p>
                      {t(
                        'Keep the control easy to scan: one clear verb, an optional supporting icon, and a stable container.',
                      )}
                    </p>
                  </div>
                  <div className="pv-button-anatomy">
                    <div className="pv-button-anatomy-preview">
                      <Button size="lg">
                        <PlusIcon data-icon="inline-start" /> {t('Create agent')}
                      </Button>
                    </div>
                    <ol className="pv-button-anatomy-parts">
                      <li>
                        <span>01</span>
                        <div>
                          <strong>{t('Container')}</strong>
                          <small>{t('28–40px product control scale')}</small>
                        </div>
                      </li>
                      <li>
                        <span>02</span>
                        <div>
                          <strong>{t('Label')}</strong>
                          <small>{t('Sentence case, direct action verb')}</small>
                        </div>
                      </li>
                      <li>
                        <span>03</span>
                        <div>
                          <strong>{t('Icon')}</strong>
                          <small>{t('Optional reinforcement, never the only name')}</small>
                        </div>
                      </li>
                    </ol>
                  </div>
                </div>

                <div className="pv-button-subsection">
                  <div className="pv-button-subsection-heading">
                    <h3>{t('Variants')}</h3>
                    <p>{t('Choose by action hierarchy and consequence, not by decorative color preference.')}</p>
                  </div>
                  <div className="pv-button-variant-grid">
                    <div>
                      <Button>{t('Default')}</Button>
                      <span>{t('Primary action in a region')}</span>
                    </div>
                    <div>
                      <Button variant="secondary">{t('Secondary')}</Button>
                      <span>{t('Supporting action')}</span>
                    </div>
                    <div>
                      <Button variant="outline">{t('Outline')}</Button>
                      <span>{t('Quiet action on a surface')}</span>
                    </div>
                    <div>
                      <Button variant="ghost">{t('Ghost')}</Button>
                      <span>{t('Toolbar or compact action')}</span>
                    </div>
                    <div>
                      <Button variant="link">{t('Link')}</Button>
                      <span>{t('Low-emphasis navigation')}</span>
                    </div>
                    <div>
                      <Button variant="destructive">{t('Delete')}</Button>
                      <span>{t('Irreversible consequence')}</span>
                    </div>
                  </div>
                </div>

                <div className="pv-button-subsection">
                  <div className="pv-button-subsection-heading">
                    <h3>{t('Sizes')}</h3>
                    <p>
                      {t('Text and icon-only buttons share the same control scale so mixed toolbars stay aligned.')}
                    </p>
                  </div>
                  <div className="pv-button-size-list">
                    {(
                      [
                        ['xs', 'icon-xs', '28px', 'Dense utility'],
                        ['sm', 'icon-sm', '32px', 'Compact product UI'],
                        ['default', 'icon', '36px', 'Default action'],
                        ['lg', 'icon-lg', '40px', 'Prominent action'],
                      ] as const
                    ).map(([textSize, iconSize, pixels, usage]) => (
                      <div className="pv-button-size-row" key={textSize}>
                        <code>{textSize}</code>
                        <div>
                          <Button size={textSize} variant="outline">
                            {t('Create agent')}
                          </Button>
                          <Button
                            size={iconSize}
                            variant="outline"
                            aria-label={t('Create agent, {size}', { size: pixels })}
                          >
                            <PlusIcon />
                          </Button>
                        </div>
                        <span>{t(pixels)}</span>
                        <small>{t(usage)}</small>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pv-button-subsection">
                  <div className="pv-button-subsection-heading">
                    <h3>{t('States and behavior')}</h3>
                    <p>
                      {t(
                        'Feedback is immediate and quiet. Loading preserves intent; disabled communicates unmet prerequisites.',
                      )}
                    </p>
                  </div>
                  <div className="pv-button-state-table">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>{t('State')}</TableHead>
                          <TableHead>{t('Default')}</TableHead>
                          <TableHead>{t('Outline')}</TableHead>
                          <TableHead>{t('Contract')}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>{t('Rest')}</TableCell>
                          <TableCell>
                            <Button size="sm">{t('Run agent')}</Button>
                          </TableCell>
                          <TableCell>
                            <Button size="sm" variant="outline">
                              {t('Run agent')}
                            </Button>
                          </TableCell>
                          <TableCell>{t('Ready for input')}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>{t('Hover')}</TableCell>
                          <TableCell>
                            <Button size="sm" className="bg-primary-hover">
                              {t('Run agent')}
                            </Button>
                          </TableCell>
                          <TableCell>
                            <Button
                              size="sm"
                              variant="outline"
                              className="bg-hover border-[var(--button-outline-border-hover)]"
                            >
                              {t('Run agent')}
                            </Button>
                          </TableCell>
                          <TableCell>{t('120ms surface response')}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>{t('Pressed')}</TableCell>
                          <TableCell>
                            <Button size="sm" className="bg-primary-active scale-[0.98]">
                              {t('Run agent')}
                            </Button>
                          </TableCell>
                          <TableCell>
                            <Button size="sm" variant="outline" className="bg-hover scale-[0.98]">
                              {t('Run agent')}
                            </Button>
                          </TableCell>
                          <TableCell>{t('0.98 scale, no bounce')}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>{t('Focus')}</TableCell>
                          <TableCell>
                            <Button size="sm" className="border-ring ring-ring/35 ring-3">
                              {t('Run agent')}
                            </Button>
                          </TableCell>
                          <TableCell>
                            <Button size="sm" variant="outline" className="border-ring ring-ring/35 ring-3">
                              {t('Run agent')}
                            </Button>
                          </TableCell>
                          <TableCell>{t('Keyboard-visible halo')}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>{t('Loading')}</TableCell>
                          <TableCell>
                            <Button size="sm" loading>
                              {t('Run agent')}
                            </Button>
                          </TableCell>
                          <TableCell>
                            <Button size="sm" variant="outline" loading>
                              {t('Run agent')}
                            </Button>
                          </TableCell>
                          <TableCell>
                            <code>aria-busy</code>
                            {t(', no repeat action')}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>{t('Disabled')}</TableCell>
                          <TableCell>
                            <Button size="sm" disabled>
                              {t('Run agent')}
                            </Button>
                          </TableCell>
                          <TableCell>
                            <Button size="sm" variant="outline" disabled>
                              {t('Run agent')}
                            </Button>
                          </TableCell>
                          <TableCell>{t('Unavailable prerequisite')}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </div>

                <div className="pv-button-subsection">
                  <div className="pv-button-subsection-heading">
                    <h3>{t('Composition')}</h3>
                    <p>
                      {t(
                        'Buttons can carry icons, shortcuts, tooltips, grouped actions, or render another interactive element.',
                      )}
                    </p>
                  </div>
                  <div className="pv-button-composition-grid">
                    <div>
                      <span>{t('Icon placement')}</span>
                      <div className="pv-demo">
                        <Button variant="outline">
                          <PlusIcon data-icon="inline-start" /> {t('New task')}
                        </Button>
                        <Button variant="outline">
                          {t('Continue ')}
                          <ArrowUpRightIcon data-icon="inline-end" />
                        </Button>
                      </div>
                    </div>
                    <div>
                      <span>{t('Shortcut')}</span>
                      <Button variant="outline">
                        {t('Open command ')}
                        <Kbd>{t('⌘ K')}</Kbd>
                      </Button>
                    </div>
                    <div>
                      <span>{t('Icon-only with tooltip')}</span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="outline" size="icon" aria-label={t('Add agent')}>
                              <PlusIcon />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>{t('Add agent')}</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <div>
                      <span>{t('Attached actions')}</span>
                      <ButtonGroup variant="attached">
                        <Button variant="outline">{t('Archive')}</Button>
                        <Button variant="outline" size="icon" aria-label={t('More archive actions')}>
                          <ChevronDownIcon />
                        </Button>
                      </ButtonGroup>
                    </div>
                    <div>
                      <span>{t('Render as link')}</span>
                      <Button asChild variant="outline">
                        <a href="#button">{t('View guidelines')}</a>
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="pv-button-subsection">
                  <div className="pv-button-subsection-heading">
                    <h3>{t('Usage')}</h3>
                    <p>{t('Hierarchy should remain understandable before color, motion, or icons are added.')}</p>
                  </div>
                  <div className="pv-button-usage">
                    <div>
                      <strong>{t('Use')}</strong>
                      <ul>
                        <li>{t('Start labels with a specific action: “Create agent,” not “Continue.”')}</li>
                        <li>{t('Keep one default button per decision region.')}</li>
                        <li>{t('Use loading only while the same action is still in progress.')}</li>
                      </ul>
                    </div>
                    <div>
                      <strong>{t('Avoid')}</strong>
                      <ul>
                        <li>{t('Using brand purple for routine product actions.')}</li>
                        <li>{t('Replacing a visible label with an icon without an accessible name.')}</li>
                        <li>{t('Using disabled styling to represent active work.')}</li>
                      </ul>
                    </div>
                  </div>
                  <p className="pv-button-accessibility-note">
                    {t(
                      'Icon-only buttons require an accessible name. Loading buttons keep their original name, expose',
                    )}
                    <code> aria-busy="true"</code>
                    {t(', and respect reduced-motion preferences.')}
                  </p>
                </div>
              </div>
            </section>),
              'button-group': (<section className="pv-section" id="button-group">
              <h2>{t('ButtonGroup')}</h2>
              <p className="pv-sd">
                {t(
                  'Segmented controls use a quiet track and a white selected segment. Use aria-pressed for state; the attached variant remains available for connected actions.',
                )}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                <div>
                  <div className="pv-swatch-label" style={{ marginBottom: 8 }}>
                    {t('Text segments')}
                  </div>
                  <ButtonGroup aria-label={t('Agent ownership')}>
                    <Button
                      variant="ghost"
                      size="sm"
                      aria-pressed={agentScope === 'mine'}
                      onClick={() => setAgentScope('mine')}
                    >
                      {t('Mine')}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      aria-pressed={agentScope === 'shared'}
                      onClick={() => setAgentScope('shared')}
                    >
                      {t('Shared with me')}
                    </Button>
                  </ButtonGroup>
                </div>
                <div>
                  <div className="pv-swatch-label" style={{ marginBottom: 8 }}>
                    {t('Icon segments')}
                  </div>
                  <ButtonGroup aria-label={t('Agent view')}>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label={t('Grid view')}
                      aria-pressed={agentView === 'grid'}
                      onClick={() => setAgentView('grid')}
                    >
                      <Squares2X2Icon />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label={t('List view')}
                      aria-pressed={agentView === 'list'}
                      onClick={() => setAgentView('list')}
                    >
                      <ListBulletIcon />
                    </Button>
                  </ButtonGroup>
                </div>
                <div>
                  <div className="pv-swatch-label" style={{ marginBottom: 8 }}>
                    {t('Attached compatibility')}
                  </div>
                  <ButtonGroup variant="attached">
                    <ButtonGroupText>
                      <ArrowPathIcon />
                    </ButtonGroupText>
                    <Button variant="outline">{t('Previous')}</Button>
                    <Button variant="outline">{t('Next')}</Button>
                  </ButtonGroup>
                </div>
              </div>
            </section>),
              'chat-pickers': (<ChatPickerExamples />),
              'chat-overview': (<ChatOverviewExamples />),
              'chat-session': (<ChatSessionExamples />),
              'chat-messages': (<ChatMessageExamples />),
              'chat-attachments': (<ChatAttachmentExamples />),
              'chat-activity': (<ChatActivityExamples />),
              'chat-cards': (<ChatCardExamples />),
              'chat-starters': (<ChatStarterExamples />),
              'chat-composer': (<ChatComposerExamples />),
              'mentions': (<MentionsExamples />),
              'form': (<section className="pv-section" id="form">
              <h2>{t('Inputs · Field')}</h2>
              <p className="pv-sd">
                {t(
                  'Text / email / password / file inputs · Field composition (label + description + error) · required, disabled, and invalid states. Invalid uses red; focus uses a soft neutral halo.',
                )}
              </p>
              <div style={{ maxWidth: 380, display: 'flex', flexDirection: 'column', gap: 16 }}>
                <Field>
                  <FieldLabel htmlFor="pv-email">{t('Email')}</FieldLabel>
                  <Input id="pv-email" type="email" placeholder={t('name@zoowork.ai')} />
                  <FieldDescription>{t('We never share it.')}</FieldDescription>
                </Field>
                <Field>
                  <FieldLabel htmlFor="pv-name">
                    {t('Full name ')}
                    <span className="text-muted-foreground">{t('(required)')}</span>
                  </FieldLabel>
                  <Input id="pv-name" required placeholder={t('Ada Lovelace')} />
                </Field>
                <Field data-invalid="true">
                  <FieldLabel htmlFor="pv-pw">{t('Password')}</FieldLabel>
                  <Input id="pv-pw" type="password" aria-invalid defaultValue="123" />
                  <FieldError>{t('Must be at least 8 characters.')}</FieldError>
                </Field>
                <Field data-disabled="true">
                  <FieldLabel htmlFor="pv-dis">{t('Workspace')}</FieldLabel>
                  <Input id="pv-dis" disabled placeholder={t('Disabled')} />
                </Field>
                <Field>
                  <FieldLabel htmlFor="pv-file">{t('Avatar')}</FieldLabel>
                  <Input id="pv-file" type="file" />
                </Field>
                <Field orientation="horizontal">
                  <Input aria-label={t('Search agents')} placeholder={t('Search agents…')} />
                  <Button variant="outline">{t('Search')}</Button>
                </Field>
                <Field>
                  <FieldLabel htmlFor="pv-msg">{t('Message')}</FieldLabel>
                  <Textarea id="pv-msg" placeholder={t('Message…')} />
                  <FieldDescription>{t('Markdown supported.')}</FieldDescription>
                </Field>
              </div>
            </section>),
              'input-group': (<section className="pv-section" id="input-group">
              <h2>{t('InputGroup')}</h2>
              <p className="pv-sd">
                {t('Input composition: leading icon + control + trailing button, with a compound focus ring.')}
              </p>
              <div style={{ maxWidth: 320 }}>
                <InputGroup>
                  <InputGroupAddon align="inline-start">
                    <MagnifyingGlassIcon />
                  </InputGroupAddon>
                  <InputGroupInput placeholder={t('Search agents…')} />
                </InputGroup>
              </div>
            </section>),
              'input-otp': (<section className="pv-section" id="input-otp">
              <h2>{t('InputOTP')}</h2>
              <p className="pv-sd">
                {t(
                  'One-time password input — grouped slots with a separator, auto-advances focus on each keystroke. Pair with a 6-digit maxLength and two groups of 3 slots.',
                )}
              </p>
              <div className="pv-demo">
                <InputOTP maxLength={6}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
            </section>),
              'checkbox': (<section className="pv-section" id="checkbox">
              <h2>{t('Checkbox')}</h2>
              <p className="pv-sd">
                {t('Checked uses neutral ink. Includes default, checked, disabled, and labelled-card patterns.')}
              </p>
              <div className="pv-demo" style={{ alignItems: 'center' }}>
                <Label className="flex items-center gap-2 font-normal">
                  <Checkbox /> {t('Default')}
                </Label>
                <Label className="flex items-center gap-2 font-normal">
                  <Checkbox defaultChecked /> {t('Checked')}
                </Label>
                <Label className="flex items-center gap-2 font-normal opacity-50">
                  <Checkbox disabled /> {t('Disabled')}
                </Label>
              </div>
              <Label className="border-border mt-3 flex max-w-sm items-start gap-3 rounded-lg border p-3 font-normal">
                <Checkbox defaultChecked />
                <span className="grid gap-1">
                  <span className="text-foreground font-medium">{t('Accept terms and conditions')}</span>
                  <span className="text-muted-foreground text-sm">
                    {t('By clicking this checkbox, you agree to the terms.')}
                  </span>
                </span>
              </Label>
            </section>),
              'switch': (<section className="pv-section" id="switch">
              <h2>{t('Switch')}</h2>
              <p className="pv-sd">
                {t('On state uses neutral ink. Default and small sizes share the same neutral off state.')}
              </p>
              <div className="pv-demo" style={{ alignItems: 'center' }}>
                <Label className="flex items-center gap-2 font-normal">
                  <Switch /> {t('Airplane Mode')}
                </Label>
                <Label className="flex items-center gap-2 font-normal">
                  <Switch defaultChecked /> {t('Notifications')}
                </Label>
                <Label className="flex items-center gap-2 font-normal">
                  <Switch size="sm" defaultChecked /> {t('Small')}
                </Label>
                <Label className="text-muted-foreground flex items-center gap-2 font-normal">
                  <Switch disabled /> {t('Disabled')}
                </Label>
              </div>
            </section>),
              'radio-group': (<section className="pv-section" id="radio-group">
              <h2>{t('RadioGroup')}</h2>
              <p className="pv-sd">{t('Radio control group with neutral selection and keyboard-visible focus.')}</p>
              <div className="pv-demo">
                <RadioGroup defaultValue="pro" style={{ gap: 8 }}>
                  <label className="text-foreground flex items-center gap-2 text-sm">
                    <RadioGroupItem value="starter" /> {t('Starter')}
                  </label>
                  <label className="text-foreground flex items-center gap-2 text-sm">
                    <RadioGroupItem value="pro" /> {t('Pro')}
                  </label>
                  <label className="text-foreground flex items-center gap-2 text-sm">
                    <RadioGroupItem value="ultra" /> {t('Ultra')}
                  </label>
                </RadioGroup>
              </div>
              <AppearanceSelectorExample />
            </section>),
              'slider': (<SliderExamples />),
              'toggle': (<section className="pv-section" id="toggle">
              <h2>{t('Toggle · Toggle Group')}</h2>
              <p className="pv-sd">
                {t('Toggleable buttons and multi-select groups — outline variant and compact spacing supported.')}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div className="pv-demo">
                  <Toggle aria-label={t('Bold')}>{t('B')}</Toggle>
                  <Toggle variant="outline" aria-label={t('Italic')}>
                    {t('I')}
                  </Toggle>
                </div>
                <div className="pv-demo">
                  <ToggleGroup type="multiple" variant="outline">
                    <ToggleGroupItem value="left">{t('Left')}</ToggleGroupItem>
                    <ToggleGroupItem value="center">{t('Center')}</ToggleGroupItem>
                    <ToggleGroupItem value="right">{t('Right')}</ToggleGroupItem>
                  </ToggleGroup>
                </div>
              </div>
            </section>),
              'native-select': (<section className="pv-section" id="native-select">
              <h2>{t('Native Select')}</h2>
              <p className="pv-sd">
                {t(
                  'System-native fallback. The trigger follows ZooWork form styling; the operating system owns the popup highlight. Use Select when menu states must match the Design System exactly.',
                )}
              </p>
              <div className="grid max-w-44 gap-2">
                <Label htmlFor="native-plan">{t('Plan')}</Label>
                <NativeSelect id="native-plan" defaultValue="pro" className="w-full">
                  <NativeSelectOption value="starter">{t('Starter')}</NativeSelectOption>
                  <NativeSelectOption value="pro">{t('Pro')}</NativeSelectOption>
                  <NativeSelectOption value="ultra">{t('Ultra')}</NativeSelectOption>
                </NativeSelect>
              </div>
            </section>),
              'dropdown': (<section className="pv-section" id="dropdown">
              <h2>{t('Dropdown Menu')}</h2>
              <p className="pv-sd">
                {t('Opaque elevated menu with compact rows, predictable hover states, and nested submenus.')}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                <div>
                  <div className="pv-swatch-label" style={{ marginBottom: 8 }}>
                    {t('Default menu surface')}
                  </div>
                  <div className="pv-demo">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline">
                          {t('Actions ')}
                          <ChevronDownIcon data-icon="inline-end" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem>{t('New agent')}</DropdownMenuItem>
                        <DropdownMenuItem>{t('Duplicate')}</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem variant="destructive">{t('Delete')}</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                <div>
                  <div className="pv-swatch-label" style={{ marginBottom: 8 }}>
                    {t('Composer surface · 213px popover + 35px rows')}
                  </div>
                  <div className="pv-demo">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label={t('Add files and more')}
                          className="rounded-[8px]"
                        >
                          <PlusIcon />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent surface="composer">
                        <DropdownMenuItem density="composer">
                          <PlusIcon /> {t('Upload file')}
                        </DropdownMenuItem>
                        <DropdownMenuItem density="composer">
                          <MagnifyingGlassIcon /> {t('Browse knowledge')}
                        </DropdownMenuItem>
                        <DropdownMenuSub>
                          <DropdownMenuSubTrigger density="composer">
                            <TagIcon /> {t('Recent views')}
                          </DropdownMenuSubTrigger>
                          <DropdownMenuSubContent surface="composer">
                            <DropdownMenuItem density="composer">{t('ZooWork brief')}</DropdownMenuItem>
                            <DropdownMenuItem density="composer">{t('Agent launch notes')}</DropdownMenuItem>
                          </DropdownMenuSubContent>
                        </DropdownMenuSub>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            </section>),
              'dialog': (<section className="pv-section" id="dialog">
              <h2>{t('Dialog')}</h2>
              <p className="pv-sd">
                {t('Modal dialog — solid elevated surface, restrained backdrop, and focused actions.')}
              </p>
              <div className="pv-demo">
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline">{t('Open Dialog')}</Button>
                  </DialogTrigger>
                  <DialogContent closeLabel={t('Close')}>
                    <DialogHeader>
                      <DialogTitle>{t('Edit agent')}</DialogTitle>
                      <DialogDescription>{t('Update how this agent appears across your workspace.')}</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-2">
                      <Label htmlFor="dialog-agent-name">{t('Agent name')}</Label>
                      <Input id="dialog-agent-name" defaultValue="Atlas" />
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setDialogOpen(false)}>
                        {t('Cancel')}
                      </Button>
                      <Button onClick={() => setDialogOpen(false)}>{t('Save changes')}</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <ScrollableDialogExample />
                <CreditAmountSelectorExample />
              </div>
            </section>),
              'select': (<section className="pv-section" id="select">
              <h2>{t('Select')}</h2>
              <p className="pv-sd">
                {t(
                  'Single-value selection with an opaque menu that prefers the space below the trigger and repositions or constrains its height when the viewport requires it.',
                )}
              </p>
              <div className="pv-demo" style={{ maxWidth: 260 }}>
                <Select defaultValue="pro">
                  <SelectTrigger aria-label={t('Plan')}>
                    <SelectValue placeholder={t('Select plan…')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>{t('Plans')}</SelectLabel>
                      <SelectItem value="starter">{t('Starter')}</SelectItem>
                      <SelectItem value="pro">{t('Pro')}</SelectItem>
                      <SelectSeparator />
                      <SelectItem value="ultra">{t('Ultra')}</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </section>),
              'tooltip': (<TooltipExamples />),
              'popover': (<section className="pv-section" id="popover">
              <h2>{t('Popover')}</h2>
              <p className="pv-sd">{t('Click-triggered opaque panel for compact supporting content and actions.')}</p>
              <div className="pv-demo">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline">{t('Open Popover')}</Button>
                  </PopoverTrigger>
                  <PopoverContent>
                    <PopoverHeader>
                      <PopoverTitle>{t('Agent settings')}</PopoverTitle>
                      <PopoverDescription>{t('Adjust the runtime parameters for this agent.')}</PopoverDescription>
                    </PopoverHeader>
                    <Button size="sm" className="mt-1">
                      {t('Save')}
                    </Button>
                  </PopoverContent>
                </Popover>
              </div>
            </section>),
              'hover-card': (<section className="pv-section" id="hover-card">
              <h2>{t('HoverCard')}</h2>
              <p className="pv-sd">{t('Hover to reveal a concise opaque detail card without changing navigation.')}</p>
              <div className="pv-demo">
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <Button variant="link">{t('@atlas')}</Button>
                  </HoverCardTrigger>
                  <HoverCardContent>
                    <div className="flex items-center gap-3">
                      <UserCircleIcon className="text-muted-foreground size-8" />
                      <div>
                        <div className="text-sm font-medium">{t('Atlas')}</div>
                        <div className="text-muted-foreground text-xs">{t('Orchestrator agent')}</div>
                      </div>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              </div>
            </section>),
              'context-menu': (<section className="pv-section" id="context-menu">
              <h2>{t('ContextMenu')}</h2>
              <p className="pv-sd">
                {t('Right-click menu with the same rows, separators, shortcuts, and states as Dropdown Menu.')}
              </p>
              <div className="pv-demo">
                <ContextMenu>
                  <ContextMenuTrigger asChild>
                    <div className="border-border text-muted-foreground flex h-20 w-40 items-center justify-center rounded-lg border border-dashed text-sm">
                      {t('Right-click here')}
                    </div>
                  </ContextMenuTrigger>
                  <ContextMenuContent>
                    <ContextMenuItem>{t('Copy')}</ContextMenuItem>
                    <ContextMenuItem>{t('Paste')}</ContextMenuItem>
                    <ContextMenuSeparator />
                    <ContextMenuItem variant="destructive">{t('Delete')}</ContextMenuItem>
                  </ContextMenuContent>
                </ContextMenu>
              </div>
            </section>),
              'alert-dialog': (<section className="pv-section" id="alert-dialog">
              <h2>{t('AlertDialog')}</h2>
              <p className="pv-sd">
                {t(
                  'Confirmation dialog for destructive actions — requires an explicit user response, cannot be dismissed by clicking outside.',
                )}
              </p>
              <div className="pv-demo">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">{t('Delete agent')}</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>{t('Confirm delete?')}</AlertDialogTitle>
                      <AlertDialogDescription>
                        {t(
                          'This action is irreversible. The agent and all its configuration will be permanently deleted.',
                        )}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>{t('Cancel')}</AlertDialogCancel>
                      <AlertDialogAction variant="destructive">{t('Confirm delete')}</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </section>),
              'sheet': (<section className="pv-section" id="sheet">
              <h2>{t('Sheet')}</h2>
              <p className="pv-sd">{t('Slide-in side panel — supports right / left / top / bottom directions.')}</p>
              <div className="pv-demo">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline">
                      <Bars3Icon /> {t('Open sidebar')}
                    </Button>
                  </SheetTrigger>
                  <SheetContent closeLabel={t('Close')}>
                    <SheetHeader>
                      <SheetTitle>{t('Agent configuration')}</SheetTitle>
                      <SheetDescription>{t('Update identity and response behavior for this agent.')}</SheetDescription>
                    </SheetHeader>
                    <SheetBody className="grid content-start gap-5">
                      <div className="grid gap-2">
                        <Label htmlFor="sheet-agent-name">{t('Agent name')}</Label>
                        <Input id="sheet-agent-name" defaultValue="Atlas" />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="sheet-agent-instructions">{t('Instructions')}</Label>
                        <Textarea id="sheet-agent-instructions" defaultValue={t('Be concise, practical, and clear.')} />
                      </div>
                      <div className="grid gap-3">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="sheet-creativity">{t('Creativity')}</Label>
                          <span className="text-foreground/60 text-xs">{t('Balanced')}</span>
                        </div>
                        <Slider id="sheet-creativity" defaultValue={[50]} />
                      </div>
                    </SheetBody>
                    <SheetFooter>
                      <SheetClose asChild>
                        <Button variant="outline">{t('Cancel')}</Button>
                      </SheetClose>
                      <SheetClose asChild>
                        <Button>{t('Save changes')}</Button>
                      </SheetClose>
                    </SheetFooter>
                  </SheetContent>
                </Sheet>
              </div>
            </section>),
              'command': (<section className="pv-section" id="command">
              <h2>{t('Command')}</h2>
              <p className="pv-sd">
                {t(
                  'Keyboard-driven command palette — search, grouped items, keyboard shortcuts. Renders inline or inside a Dialog via CommandDialog.',
                )}
              </p>
              <div style={{ maxWidth: 360 }}>
                {/* An unmatched initial value prevents cmdk from selecting and scrolling an off-screen item on mount. */}
                <Command defaultValue="__preview_idle__">
                  <CommandInput placeholder={t('Search commands...')} />
                  <CommandList aria-label={t('Suggestions')}>
                    <CommandEmpty>{t('No results found.')}</CommandEmpty>
                    <CommandGroup heading={t('Agents')}>
                      <CommandItem>
                        {t('New agent')}
                        <CommandShortcut>{t('⌘N')}</CommandShortcut>
                      </CommandItem>
                      <CommandItem>
                        {t('Duplicate agent')}
                        <CommandShortcut>{t('⌘D')}</CommandShortcut>
                      </CommandItem>
                    </CommandGroup>
                    <CommandGroup heading={t('Actions')}>
                      <CommandItem>
                        {t('Run workflow')}
                        <CommandShortcut>{t('⌘R')}</CommandShortcut>
                      </CommandItem>
                      <CommandItem>
                        {t('Export results')}
                        <CommandShortcut>{t('⌘E')}</CommandShortcut>
                      </CommandItem>
                    </CommandGroup>
                  </CommandList>
                </Command>
              </div>
            </section>),
              'drawer': (<section className="pv-section" id="drawer">
              <h2>{t('Drawer')}</h2>
              <p className="pv-sd">
                {t('Mobile bottom sheet shown in a contained viewport. This is a primitive demo; desktop panels are in Sheet.')}
              </p>
              <MobileDrawerExample />
            </section>),
              'badge': (<section className="pv-section" id="badge">
              <h2>{t('Badge')}</h2>
              <SourceBadgeExamples />
              <p className="pv-sd">
                {t(
                  'Compact status, notification, and quantity indicators. Counts stay circular when short and expand into pills as content grows.',
                )}
              </p>
              <p className="pv-sd">{t('Status labels')}</p>
              <div className="pv-demo">
                <Badge>{t('New')}</Badge>
                <Badge variant="secondary">{t('Beta')}</Badge>
                <Badge variant="destructive">{t('Error')}</Badge>
                <Badge variant="outline">{t('Draft')}</Badge>
              </div>
              <p className="pv-sd" style={{ marginTop: 20 }}>
                {t('Message notifications')}
              </p>
              <div className="pv-demo" style={{ alignItems: 'center', marginTop: 12 }}>
                <div className="border-border bg-background text-muted-foreground relative inline-flex size-10 items-center justify-center rounded-md border">
                  <EnvelopeIcon className="size-5" />
                  <Badge
                    aria-label={t('Unread messages')}
                    className="ring-background absolute -top-0.5 -right-0.5 ring-2"
                    shape="dot"
                    variant="notification"
                  />
                </div>
                <div className="border-border bg-background text-muted-foreground relative inline-flex size-10 items-center justify-center rounded-md border">
                  <InboxIcon className="size-5" />
                  <Badge
                    aria-label={t('8 unread messages')}
                    className="ring-background absolute -top-2 -right-2 ring-2"
                    shape="count"
                    variant="notification"
                  >
                    8
                  </Badge>
                </div>
                <Badge shape="count" variant="notification">
                  99+
                </Badge>
              </div>
              <p className="pv-sd" style={{ marginTop: 20 }}>
                {t('Quantities')}
              </p>
              <div className="pv-demo" style={{ alignItems: 'center', marginTop: 12 }}>
                <Badge shape="count" variant="secondary">
                  4
                </Badge>
                <Badge shape="count" variant="info">
                  {t('12 queued')}
                </Badge>
                <Badge shape="count" variant="success">
                  {t('24 completed')}
                </Badge>
                <Badge shape="count" variant="warning">
                  {t('3 waiting')}
                </Badge>
                <Badge shape="count" variant="danger">
                  {t('2 blocked')}
                </Badge>
              </div>
            </section>),
              'tag': (<section className="pv-section" id="tag">
              <h2>{t('Tag')}</h2>
              <p className="pv-sd">
                {t(
                  "Compact rounded-rectangle labels for keywords and lightweight status. Supports pure text and icon + text without using Badge's pill shape.",
                )}
              </p>
              <p className="pv-sd">{t('Pure text keyword tags')}</p>
              <div className="pv-demo">
                <Tag>{t('Planning')}</Tag>
                <Tag>{t('Delegation')}</Tag>
                <Tag>{t('Research')}</Tag>
                <Tag variant="outline">{t('Draft')}</Tag>
              </div>
              <p className="pv-sd" style={{ marginTop: 12 }}>
                {t('Small status tags')}
              </p>
              <div className="pv-demo" style={{ marginTop: 12 }}>
                <Tag size="sm">{t('Official')}</Tag>
                <Tag size="sm" variant="danger">
                  {t('New')}
                </Tag>
                <Tag size="sm" variant="success">
                  {t('Hired')}
                </Tag>
                <Tag size="sm" variant="warning">
                  {t('Pending')}
                </Tag>
                <Tag size="sm" variant="info">
                  {t('Beta')}
                </Tag>
              </div>
              <p className="pv-sd" style={{ marginTop: 12 }}>
                {t('Icon + text tags')}
              </p>
              <div className="pv-demo" style={{ marginTop: 12 }}>
                <Tag variant="success">
                  <CheckIcon />
                  {t('Hired')}
                </Tag>
                <Tag variant="info">
                  <CheckIcon />
                  {t('Verified')}
                </Tag>
                <Tag>
                  <CheckIcon />
                  {t('Done')}
                </Tag>
                <Tag size="sm" variant="danger">
                  <ExclamationTriangleIcon />
                  {t('New')}
                </Tag>
              </div>
              <p className="pv-sd" style={{ marginTop: 12 }}>
                {t('Attachment tags · filename / size / remove')}
              </p>
              <div className="pv-demo" style={{ marginTop: 12 }}>
                <Tag variant="attachment">
                  <TagText>{t('gensmo-1778055162350.png')}</TagText>
                  <TagMeta>{t('50 KB')}</TagMeta>
                  <TagAction aria-label={t('Remove attachment')}>
                    <XMarkIcon className="h-3.5 w-3.5" />
                  </TagAction>
                </Tag>
                <Tag variant="attachment">
                  <TagText>{t('campaign-brief.pdf')}</TagText>
                  <TagMeta>{t('128 KB')}</TagMeta>
                  <TagAction aria-label={t('Remove attachment')}>
                    <XMarkIcon className="h-3.5 w-3.5" />
                  </TagAction>
                </Tag>
              </div>
            </section>),
              'card': (<section className="pv-section" id="card">
              <h2>{t('Card')}</h2>
              <p className="pv-sd">{t('Card primitives and source-derived product cards. Each family preserves its own spacing, radius, and actions.')}</p>
              <h3 className="mb-4 text-base font-semibold">{t('Card primitive')}</h3>
              <div className="pv-card-samples">
                <Card>
                  <CardHeader>
                    <CardTitle>{t('Agent Pack')}</CardTitle>
                    <CardDescription>
                      {t('A set of collaborative agents that automate end-to-end task completion.')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm">
                      {t(
                        'Configure a trigger and Atlas will automatically delegate sub-tasks to the right specialists.',
                      )}
                    </p>
                  </CardContent>
                  <CardContent className="flex items-center gap-2">
                    <Button size="sm">{t('Enable')}</Button>
                    <Button variant="ghost" size="sm">
                      {t('Learn more')}
                    </Button>
                  </CardContent>
                </Card>
                <Card size="sm" style={{ maxWidth: 280 }}>
                  <CardHeader>
                    <CardTitle>{t('Sage')}</CardTitle>
                    <CardDescription>{t('Research, fact-checking, and synthesis.')}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-1.5">
                      <Tag>{t('Research')}</Tag>
                      <Tag>{t('Fact-check')}</Tag>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <ProductCardExamples />
              <ProductCardSection />
            </section>),
              'avatar': (<section className="pv-section" id="avatar">
              <h2>{t('Avatar')}</h2>
              <p className="pv-sd">
                {t('User avatar — image with letter fallback, supports badge overlays and stacked groups.')}
              </p>
              <div className="pv-demo" style={{ alignItems: 'center' }}>
                <Avatar>
                  <AvatarFallback aria-label="Example user">EX</AvatarFallback>
                </Avatar>
                <Avatar>
                  <AvatarFallback>{t('AT')}</AvatarFallback>
                </Avatar>
                <AvatarGroup>
                  <Avatar>
                    <AvatarFallback>{t('A1')}</AvatarFallback>
                  </Avatar>
                  <Avatar>
                    <AvatarFallback>{t('A2')}</AvatarFallback>
                  </Avatar>
                  <AvatarGroupCount>+3</AvatarGroupCount>
                </AvatarGroup>
              </div>
            </section>),
              'table': (<section className="pv-section" id="table">
              <h2>{t('Table')}</h2>
              <p className="pv-sd">{t('Data table — row hover highlight, selected state, bold headers.')}</p>
              <div style={{ maxWidth: 480 }}>
                <Table>
                  <TableHeader>
                    <tr>
                      <TableHead>{t('Agent')}</TableHead>
                      <TableHead>{t('Status')}</TableHead>
                      <TableHead>{t('Tasks')}</TableHead>
                    </tr>
                  </TableHeader>
                  <TableBody>
                    <tr>
                      <TableCell>{t('Atlas')}</TableCell>
                      <TableCell>
                        <Badge>{t('Running')}</Badge>
                      </TableCell>
                      <TableCell>42</TableCell>
                    </tr>
                    <tr>
                      <TableCell>{t('Nova')}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{t('Idle')}</Badge>
                      </TableCell>
                      <TableCell>8</TableCell>
                    </tr>
                  </TableBody>
                </Table>
              </div>
              <ScrollableTableExample />
            </section>),
              'item': (<section className="pv-section" id="item">
              <h2>{t('Item')}</h2>
              <p className="pv-sd">
                {t(
                  'List item composition: icon + title + description + actions — outline and muted variants supported.',
                )}
              </p>
              <div style={{ maxWidth: 420 }}>
                <ItemGroup>
                  <Item variant="outline">
                    <ItemMedia variant="icon">
                      <UserCircleIcon />
                    </ItemMedia>
                    <ItemContent>
                      <ItemTitle>{t('Atlas')}</ItemTitle>
                      <ItemDescription>
                        {t('Orchestrator agent — handles task dispatch and result aggregation.')}
                      </ItemDescription>
                    </ItemContent>
                    <ItemActions>
                      <Badge>{t('Running')}</Badge>
                    </ItemActions>
                  </Item>
                  <Item variant="outline">
                    <ItemMedia variant="icon">
                      <InboxIcon />
                    </ItemMedia>
                    <ItemContent>
                      <ItemTitle>{t('Nova')}</ItemTitle>
                      <ItemDescription>
                        {t('Data processing specialist, expert in structured analysis.')}
                      </ItemDescription>
                    </ItemContent>
                    <ItemActions>
                      <Badge variant="secondary">{t('Idle')}</Badge>
                    </ItemActions>
                  </Item>
                </ItemGroup>
              </div>
            </section>),
              'empty': (<section className="pv-section" id="empty">
              <h2>{t('Empty')}</h2>
              <SourceEmptyExamples />
            </section>),
              'kbd': (<section className="pv-section" id="kbd">
              <h2>{t('Kbd')}</h2>
              <p className="pv-sd">
                {t('Keyboard shortcut labels — single keys and chords, auto-inverted inside tooltips.')}
              </p>
              <div className="pv-demo" style={{ alignItems: 'center' }}>
                <Kbd>⌘</Kbd>
                <Kbd>{t('K')}</Kbd>
                <KbdGroup>
                  <Kbd>⌘</Kbd>
                  <Kbd>⇧</Kbd>
                  <Kbd>{t('P')}</Kbd>
                </KbdGroup>
              </div>
            </section>),
              'product-navigation': (<ProductNavigationSection />),
              'marketing-navigation': (<MarketingNavigationExample />),
              'marketing-footer': (<MarketingFooterExample />),
              'tabs': (<SelectionExamples />),
              'breadcrumb': (<section className="pv-section" id="breadcrumb">
              <h2>{t('Breadcrumb')}</h2>
              <p className="pv-sd">
                {t('Breadcrumb navigation — current page highlighted, supports ellipsis collapse.')}
              </p>
              <div className="pv-demo">
                <Breadcrumb aria-label={t('Breadcrumb navigation')}>
                  <BreadcrumbList>
                    <BreadcrumbItem>
                      <BreadcrumbLink href="#">{t('Home')}</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbLink href="#">{t('Agents')}</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage>{t('Atlas')}</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
            </section>),
              'pagination': (<section className="pv-section" id="pagination">
              <h2>{t('Pagination')}</h2>
              <p className="pv-sd">{t('Pagination control: previous / page numbers / ellipsis / next.')}</p>
              <div className="pv-demo">
                <Pagination aria-label={t('pagination')}>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious text={t('Previous')} aria-label={t('Go to previous page')} href="#" />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#" isActive>
                        1
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#">2</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationEllipsis label={t('More pages')} />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationNext text={t('Next')} aria-label={t('Go to next page')} href="#" />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </section>),
              'nav-menu': (<section className="pv-section" id="nav-menu">
              <h2>{t('NavigationMenu')}</h2>
              <p className="pv-sd">{t('Top navigation menu — supports dropdown content panels and link lists.')}</p>
              <div className="pv-demo">
                <NavigationMenu viewport={false}>
                  <NavigationMenuList>
                    <NavigationMenuItem>
                      <NavigationMenuTrigger>{t('Product')}</NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <div style={{ minWidth: 160, padding: 4 }}>
                          <NavigationMenuLink href="#">{t('Agents')}</NavigationMenuLink>
                          <NavigationMenuLink href="#">{t('Workflows')}</NavigationMenuLink>
                          <NavigationMenuLink href="#">{t('Analytics')}</NavigationMenuLink>
                        </div>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                      <NavigationMenuLink href="#">{t('Pricing')}</NavigationMenuLink>
                    </NavigationMenuItem>
                  </NavigationMenuList>
                </NavigationMenu>
              </div>
            </section>),
              'menubar': (<section className="pv-section" id="menubar">
              <h2>{t('Menubar')}</h2>
              <p className="pv-sd">{t('Desktop-style menu bar — linked menus, fully keyboard accessible.')}</p>
              <div className="pv-demo">
                <Menubar>
                  <MenubarMenu>
                    <MenubarTrigger>{t('File')}</MenubarTrigger>
                    <MenubarContent>
                      <MenubarItem>{t('New')}</MenubarItem>
                      <MenubarItem>{t('Open')}</MenubarItem>
                      <MenubarSeparator />
                      <MenubarItem>{t('Quit')}</MenubarItem>
                    </MenubarContent>
                  </MenubarMenu>
                  <MenubarMenu>
                    <MenubarTrigger>{t('Edit')}</MenubarTrigger>
                    <MenubarContent>
                      <MenubarItem>{t('Undo')}</MenubarItem>
                      <MenubarItem>{t('Redo')}</MenubarItem>
                    </MenubarContent>
                  </MenubarMenu>
                </Menubar>
              </div>
            </section>),
              'accordion': (<section className="pv-section" id="accordion">
              <h2>{t('Accordion')}</h2>
              <p className="pv-sd">{t('Collapsible FAQ list — single-select mode, items can be collapsed.')}</p>
              <div style={{ maxWidth: 480 }}>
                <Accordion type="single" collapsible>
                  <AccordionItem value="faq-1">
                    <AccordionTrigger>{t('What is a ZooWork Agent Pack?')}</AccordionTrigger>
                    <AccordionContent>
                      {t(
                        'An Agent Pack is a set of pre-configured collaborative agents that automate the full workflow from task decomposition to result aggregation.',
                      )}
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="faq-2">
                    <AccordionTrigger>{t('How do I add a new team member?')}</AccordionTrigger>
                    <AccordionContent>
                      {t('Go to the Members page, click Invite, and enter an email address to send the invitation.')}
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="faq-3">
                    <AccordionTrigger>{t('What is the billing cycle?')}</AccordionTrigger>
                    <AccordionContent>
                      {t('Billed monthly with automatic renewal. Cancel anytime from the billing page.')}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </section>),
              'alert': (<AlertExamples />),
              'global-alert': (<GlobalAlertExamples />),
              'sonner': (<ToastExamples />),
              'app-shell': (<section className="pv-section" id="app-shell">
              <h2>{t('Application shell sample')}</h2>
              <p className="pv-sd">
                {t(
                  'A compact composition of the extracted sidebar, search, task card, chip, kbd, and composer patterns.',
                )}
              </p>
              <div className="pv-app-shell pv-shell-diagram">
                <Card className="pv-shell-sidebar" size="sm">
                  <CardContent className="pv-shell-sidebar-content">
                    <div className="pv-shell-org">
                      <span className="pv-shell-badge">{t('MG')}</span>
                      <div>
                        <div className="pv-shell-org-name">{t('Meridian Goods')}</div>
                        <div className="pv-shell-muted">{t('Scale · Cross-Border')}</div>
                      </div>
                    </div>
                    <div className="pv-shell-search">
                      <MagnifyingGlassIcon />
                      <span>{t('Search')}</span>
                      <Kbd>{t('⌘K')}</Kbd>
                    </div>
                    <div className="pv-shell-nav">
                      {['New Chat', 'Workbench', 'Task Center', 'Library'].map((item, index) => (
                        <div className={index === 0 ? 'pv-shell-nav-item is-active' : 'pv-shell-nav-item'} key={item}>
                          <span className="pv-icon-well">{index === 0 ? <PlusIcon /> : <InboxIcon />}</span>
                          {t(item)}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                <div className="pv-shell-main">
                  <div className="pv-shell-task-grid">
                    {[
                      ['Plan my week', 'Atlas drafts priorities and assigns specialists.'],
                      ['Operations brief', 'Sales, ads, inventory, and reviews in one page.'],
                      ['Investigate Buy Box', 'Dispatch Pulse and Max to diagnose the SKU.'],
                    ].map(([title, body]) => (
                      <Card className="pv-task-card" key={title} size="sm">
                        <CardContent className="pv-task-card-content">
                          <Tag>{t(title)}</Tag>
                          <div className="pv-task-title">{t(title)}</div>
                          <div className="pv-task-body">{t(body)}</div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  <Card className="pv-composer-card" size="sm">
                    <CardContent className="pv-composer-content">
                      <div>
                        <div className="pv-composer-title">{t('Atlas · Chief of staff')}</div>
                        <div className="pv-composer-placeholder">
                          {t('Ask Atlas to plan my week across all marketplaces…')}
                        </div>
                      </div>
                      <div className="pv-composer-actions">
                        <Tag variant="outline">{t('Attach')}</Tag>
                        <Tag variant="outline">{t('Mention')}</Tag>
                        <span className="pv-shell-muted">
                          <Kbd>↩</Kbd> {t('to send')}
                        </span>
                        <Button variant="composerSend" size="composerIcon" aria-label={t('Send')}>
                          <ArrowUpIcon />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </section>),
              'separator': (<section className="pv-section" id="separator">
              <h2>{t('Separator')}</h2>
              <p className="pv-sd">
                {t('Divider — horizontal and vertical orientations, semantic role configurable as decorative.')}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 300 }}>
                <Separator />
                <div className="text-muted-foreground flex h-6 items-center gap-3 text-sm">
                  <span>{t('Left')}</span>
                  <Separator orientation="vertical" />
                  <span>{t('Right')}</span>
                </div>
              </div>
            </section>),
              'aspect-ratio': (<section className="pv-section" id="aspect-ratio">
              <h2>{t('AspectRatio')}</h2>
              <p className="pv-sd">
                {t('Fixed aspect-ratio container — commonly used for image/video previews to prevent layout shift.')}
              </p>
              <div style={{ maxWidth: 280 }}>
                <AspectRatio ratio={16 / 9}>
                  <div className="bg-muted text-muted-foreground flex size-full items-center justify-center rounded-lg text-sm">
                    16 : 9
                  </div>
                </AspectRatio>
              </div>
            </section>),
              'scroll-area': (<section className="pv-section" id="scroll-area">
              <h2>{t('ScrollArea')}</h2>
              <p className="pv-sd">
                {t('Custom scroll area — unified scrollbar styling, consistent across platforms.')}
              </p>
              <div style={{ maxWidth: 280 }}>
                <ScrollArea className="border-border bg-surface h-40 rounded-md border p-3">
                  {Array.from({ length: 12 }, (_, i) => (
                    <div key={i} className="text-muted-foreground py-1 text-sm">
                      {t('Agent log line ')}
                      {i + 1}
                    </div>
                  ))}
                </ScrollArea>
              </div>
            </section>),
              'collapsible': (<section className="pv-section" id="collapsible">
              <h2>{t('Collapsible')}</h2>
              <p className="pv-sd">{t('Collapsible content area — click to expand/collapse, uncontrolled.')}</p>
              <div style={{ maxWidth: 320 }}>
                <Collapsible>
                  <CollapsibleTrigger asChild>
                    <Button variant="outline" size="sm">
                      <ChevronDownIcon /> {t('Expand advanced settings')}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="text-muted-foreground mt-2 rounded-lg border p-3 text-sm">
                      {t('Advanced settings: timeout, concurrency limit, retry policy…')}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            </section>),
              'connector-pattern': (<ConnectorPatternSection />),
              'changelog': (<section className="pv-section" id="changelog">
              <div className="pv-release-heading">
                <div>
                  <h2>{t('Changelog')}</h2>
                  <p className="pv-sd">{t('Versioned additions, changes, removals, fixes, and migration notes.')}</p>
                </div>
                <Badge variant="secondary">
                  {t('Current ')}
                  {t(DESIGN_SYSTEM_VERSION)}
                </Badge>
              </div>
              <div className="pv-changelog-list">
                {CHANGELOG_ENTRIES.map((entry) => (
                  <article className="pv-changelog-entry" key={entry.version}>
                    <header className="pv-changelog-header">
                      <div>
                        <div className="pv-changelog-version">{t(entry.version)}</div>
                        <div className="pv-changelog-date">{t(entry.date)}</div>
                      </div>
                      <div className="pv-changelog-links">
                        {entry.pr ? (
                          <a href={entry.pr.href} target="_blank" rel="noreferrer">
                            {t(entry.pr.label)}
                          </a>
                        ) : (
                          <span>{t('PR pending')}</span>
                        )}
                        {entry.revision && <a href={entry.revision.href} target="_blank" rel="noreferrer">
                          {t(entry.revision.label)}
                        </a>}
                      </div>
                    </header>
                    <div className="pv-changelog-groups">
                      {Object.entries(entry.changes).map(([category, items]) => (
                        <div className="pv-changelog-group" key={category}>
                          <h3>{t(CHANGELOG_LABELS[category as keyof typeof CHANGELOG_LABELS])}</h3>
                          <ul>
                            {items?.map((item) => (
                              <li key={item}>{t(item)}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            </section>),
              'splitter': (<SplitterExamples />),
              'marketing-layout': (<MarketingLayoutExamples />),
              'workspace-layout': (<WorkspaceLayoutExamples />),
              'layout-grid': (<LayoutExamples />),
              'calendar': (<CalendarExamples />),
              'carousel': (<CarouselExamples />),
              'statistic': (<StatisticExamples />),
              'loading': (<LoadingExamples />),
            }} />
          </main>
        </div>
        <Sonner position="bottom-right" containerAriaLabel={t('Notifications {shortcut}', { shortcut: 'alt+T' })} />
      </>
    </FocusModalityProvider>
  )
}
