// ZooClaw Design System — public API.
// Consumers import tokens once in their CSS entry:
// `@import "@zooclaw/zooworkdesign/tokens.css"`.
import type { ComponentProps } from 'react'

import { Alert } from './components/alert'
import { Badge } from './components/badge'
import { Field } from './components/field'

export { cn } from './lib/cn'
export { FocusModalityProvider } from './components/focus-modality'
export { Button, buttonVariants } from './components/button'
export type { ButtonProps } from './components/button'
export { Input } from './components/input'
export { Textarea } from './components/textarea'
export { MentionText, getMentionRecipients } from './components/mentions'
export type { MentionOption, MentionKind, MentionReference, MentionsValue, MentionsLabels } from './components/mentions'
export { Label } from './components/label'
export {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from './components/field'
/** @deprecated the Field API changed in radix-nova; infer with `React.ComponentProps<typeof Field>`. */
export type FieldProps = ComponentProps<typeof Field>
export { Checkbox } from './components/checkbox'
export { Switch } from './components/switch'
export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './components/tooltip'
export {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuAction,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from './components/dropdown-menu'
export * from './components/appearance-selector'
export {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from './components/dialog'
export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from './components/select'
export { Badge, badgeVariants } from './components/badge'
/** @deprecated infer with `React.ComponentProps<typeof Badge>`. */
export type BadgeProps = ComponentProps<typeof Badge>
export { Tag, TagAction, TagMeta, TagText, tagVariants } from './components/tag'
export type { TagProps } from './components/tag'
export { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './components/card'
export { Tabs, TabsContent, TabsList, tabsListVariants, TabsTrigger } from './components/tabs'
export { Sparkline, type SparklineProps, type SparklinePoint } from './components/sparkline'
export { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from './components/accordion'
export { Alert, AlertAction, AlertDescription, AlertTitle } from './components/alert'
export type { AlertStatus } from './components/alert'
export * from './components/global-alert'
export * from './components/marketing-layout'
export * from './components/workspace-layout'
/** @deprecated infer with `React.ComponentProps<typeof Alert>`. */
export type AlertProps = ComponentProps<typeof Alert>

// Toasts. `Sonner` (modern, recommended) is exported as Sonner/sonnerToast so
// it does not collide with the existing Toaster/toast names. The hand-rolled
// Radix toast is retained for back-compat and is @deprecated (see toast.tsx).
export { Toaster as Sonner, toast as sonnerToast } from './components/sonner'
export {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
  Toaster,
  toast,
  dismiss,
  clearToasts,
  useToast,
} from './components/toast'
export type { ToastItem, ToastOptions } from './components/toast'

// ── Command ──
export {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from './components/command'

// ── Drawer ──
export {
  Drawer,
  DrawerBody,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerPortal,
  DrawerTitle,
  DrawerTrigger,
} from './components/drawer'

// ── InputOTP ──
export { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from './components/input-otp'

// ── Alert Dialog ──
export {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './components/alert-dialog'

// ── Aspect Ratio ──
export { AspectRatio } from './components/aspect-ratio'

// ── Avatar ──
export {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from './components/avatar'

// ── Breadcrumb ──
export {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from './components/breadcrumb'

// ── Button Group ──
export {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
  buttonGroupVariants,
} from './components/button-group'

// ── Collapsible ──
export { Collapsible, CollapsibleContent, CollapsibleTrigger } from './components/collapsible'

// ── Context Menu ──
export {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuPortal,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from './components/context-menu'

// ── Empty ──
export {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from './components/empty'

// ── Hover Card ──
export { HoverCard, HoverCardContent, HoverCardTrigger } from './components/hover-card'

// ── Input Group ──
export {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from './components/input-group'

// ── Item ──
export {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemGroup,
  ItemHeader,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from './components/item'

// ── Kbd ──
export { Kbd, KbdGroup } from './components/kbd'

// ── Menubar ──
export {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarGroup,
  MenubarItem,
  MenubarLabel,
  MenubarMenu,
  MenubarPortal,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from './components/menubar'

// ── Native Select ──
export {
  NativeSelect,
  NativeSelectOptGroup,
  NativeSelectOption,
} from './components/native-select'

// ── Navigation Menu ──
export {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
} from './components/navigation-menu'

// ── Pagination ──
export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from './components/pagination'

// ── Popover ──
export {
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from './components/popover'

// ── Progress ──
export { Progress } from './components/progress'

// ── Radio Group ──
export { RadioGroup, RadioGroupItem } from './components/radio-group'

// ── Scroll Area ──
export { ScrollArea, ScrollBar } from './components/scroll-area'

// ── Separator ──
export { Separator } from './components/separator'

// ── Sheet ──
export {
  Sheet,
  SheetBody,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './components/sheet'

// ── Skeleton ──
export { Skeleton } from './components/skeleton'

// ── Slider ──
export { Slider } from './components/slider'
export { EffortSlider } from './components/effort-slider'
export type { EffortSliderProps, EffortSliderLabels, EffortSliderLevel } from './components/effort-slider'

// ── Spinner ──
export { Spinner } from './components/spinner'

// ── Table ──
export {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from './components/table'

// ── Toggle ──
export { Toggle, toggleVariants } from './components/toggle'

// ── Toggle Group ──
export { ToggleGroup, ToggleGroupItem } from './components/toggle-group'

// ── Version history ──
export {
  CHANGELOG_ENTRIES,
  DESIGN_SYSTEM_VERSION,
  type ChangelogCategory,
  type ChangelogEntry,
  type ChangelogLink,
} from './changelog'

// ZooWork product components — shared with web/app. See SOURCE_MAP.md.
export { SecondaryNavItem, SecondaryNavBack, type SecondaryNavItemProps } from './product-patterns/secondary-nav'

export * from './product-patterns/product-button'

export * from './product-patterns/plugin-search'

export * from './product-patterns/plugin-tab-styles'

export * from './product-patterns/workspace-page-header'

export * from './product-patterns/connector-provider-card'

export * from './product-patterns/connector-toolbar'

export * from './product-patterns/connector-types'

export * from './product-patterns/primary-nav-item'

export * from './product-patterns/primary-nav-logo'

export * from './product-patterns/secondary-navigation-layout'

export * from './product-patterns/primary-navigation'

export * from './product-patterns/primary-nav-agent-section'

export * from './product-patterns/primary-nav-user-card'

export * from './product-patterns/account-menu-surface'
export * from './product-patterns/primary-nav-account-menu'
export * from './product-patterns/primary-nav-footer'
export * from './product-patterns/account-credits'

export * from './product-patterns/workspace-navigation'

export * from './product-patterns/workspace-agent-switcher'
export * from './product-patterns/workspace-switcher-trigger'

export * from './product-patterns/workspace-session-row'

export {
  AlertDialog as ProductAlertDialog,
  AlertDialogAction as ProductAlertDialogAction,
  AlertDialogCancel as ProductAlertDialogCancel,
  AlertDialogCloseButton as ProductAlertDialogCloseButton,
  AlertDialogContent as ProductAlertDialogContent,
  AlertDialogDescription as ProductAlertDialogDescription,
  AlertDialogTitle as ProductAlertDialogTitle
} from './product-patterns/product-alert-dialog'

export * from './product-patterns/product-spinner'

export * from './product-patterns/product-nav-icon'

export * from './product-patterns/primary-nav-agent-icon'

export * from './product-patterns/primary-nav-item-icon'

export { SecondaryNavigation, type SecondaryNavigationProps } from './product-patterns/secondary-navigation'

export { BRAND_ASSETS } from './brand'

export * from './product-patterns/composer-action-buttons'
export * from './product-patterns/product-icon-buttons'
export * from './product-patterns/sidebar-toggle-button'
export * from './product-patterns/update-controls'
export * from './product-patterns/product-cards'

export * from './product-patterns/state-illustration'
export * from './product-patterns/plugin-empty-state'

export * from './marketing/marketing-navigation'
export * from './marketing/marketing-footer'
export * from './marketing/marketing-content'
export * from './marketing/promotion-badge'
export type { LandingNavLink, LandingFooterColumn, LandingFooterLink } from './marketing/types'

export { sourceAssets } from './source-assets'

export * from './marketing/marketing-mobile-navigation'

export * from './marketing/marketing-header'

export * from './marketing/marketing-cta-actions'

export * from './components/segmented'
export * from './components/splitter'
export * from './components/layout-grid'
export * from './components/calendar'
export * from './components/carousel'
export * from './components/statistic'

export { findMentionQuery, replaceMentionRange, validMentions } from './components/mention-value'

export { CreditAmountSelector } from './product-patterns/credit-amount-selector'
export type { CreditAmountSelectorProps } from './product-patterns/credit-amount-selector'
