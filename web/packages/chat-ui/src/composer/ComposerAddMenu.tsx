'use client'

import type {
  PlusIcon} from '@heroicons/react/24/outline';
import {
  ArchiveBoxIcon,
  ArrowPathIcon,
  ChevronRightIcon,
  DocumentMinusIcon,
  LinkIcon,
  PaperClipIcon
} from '@heroicons/react/24/outline'
import { FolderIcon } from '@heroicons/react/24/solid'
import {
  ComposerAttachButton,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  ProductSpinner,
} from '@zooclaw/zooworkdesign'
import { useState, type ComponentProps, type ReactNode, type Ref } from 'react'

export interface ComposerRecentFile {
  id: string
  name: string
  icon: ReactNode
  disabled?: boolean
}
export interface ComposerAddMenuLabels {
  trigger: string
  addFromLocalFiles: string
  recentFiles: string
  loadingRecentFiles: string
  recentFilesLoadFailed: string
  retry: string
  noRecentFiles: string
  addFromLibrary: string
  connectors: string
}
export interface ComposerAddMenuProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  disabled?: boolean
  triggerRef?: Ref<HTMLButtonElement>
  rootSide?: 'top' | 'bottom'
  subSide?: 'left' | 'right'
  onCloseAutoFocus?: ComponentProps<typeof DropdownMenuContent>['onCloseAutoFocus']
  labels: ComposerAddMenuLabels
  fileAttachmentsEnabled?: boolean
  recentFiles: ComposerRecentFile[]
  recentError?: boolean
  recentLoading?: boolean
  recentOpen: boolean
  onRecentOpenChange: (open: boolean) => void
  onRecentRetry: () => void
  onRecentFile: (id: string) => void
  onLocalFiles: () => void
  onOpenLibrary: () => void
  onOpenConnectors: () => void
  skillsMenu: ReactNode
}

/** The product add menu. Data access and dialog ownership stay with the host. */
export function ComposerAddMenu({
  open,
  onOpenChange,
  disabled,
  triggerRef,
  rootSide = 'top',
  subSide = 'right',
  onCloseAutoFocus,
  labels,
  fileAttachmentsEnabled = true,
  recentFiles,
  recentError = false,
  recentLoading = false,
  recentOpen,
  onRecentOpenChange,
  onRecentRetry,
  onRecentFile,
  onLocalFiles,
  onOpenLibrary,
  onOpenConnectors,
  skillsMenu,
}: ComposerAddMenuProps) {
  const [tooltipOpen, setTooltipOpen] = useState(false)
  return (
    <DropdownMenu
      open={open}
      onOpenChange={(next) => {
        setTooltipOpen(false)
        onOpenChange(next)
      }}
    >
      <Tooltip open={!open && tooltipOpen}>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <ComposerAttachButton
              ref={triggerRef}
              type="button"
              disabled={disabled}
              aria-label={labels.trigger}
              onBlur={() => setTooltipOpen(false)}
              onFocus={() => setTooltipOpen(false)}
              onPointerMove={() => setTooltipOpen(true)}
              onPointerOut={() => setTooltipOpen(false)}
              data-menu-open={open}
              data-keyboard-focus-shape="rounded-rectangle"
              data-testid="composer-add-trigger"
            />
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent side="top" align="center" sideOffset={8} className="rounded-md">
          {labels.trigger}
        </TooltipContent>
      </Tooltip>

      <DropdownMenuContent
        side={rootSide}
        align="start"
        surface="composer"
        className="w-[213px] overflow-hidden"
        data-composer-menu-surface="true"
        data-testid="composer-add-menu"
        onCloseAutoFocus={onCloseAutoFocus}
      >
        <>
          {fileAttachmentsEnabled ? (
            <>
              <MenuRow
                icon={PaperClipIcon}
                label={labels.addFromLocalFiles}
                onSelect={onLocalFiles}
                testId="composer-add-local"
              />
              <DropdownMenuSub open={recentOpen} onOpenChange={onRecentOpenChange}>
                <DropdownMenuSubTrigger
                  onPointerMove={(event) => {
                    if (event.pointerType !== 'touch') onRecentOpenChange(true)
                  }}
                  data-testid="composer-add-recent"
                  className="h-[35px] gap-1.5 rounded-[4px] px-2.5 py-2.5 text-xs leading-[15px] font-medium tracking-normal [&>svg]:size-[15px]"
                >
                  <DocumentMinusIcon />
                  <span className="min-w-0 flex-1">{labels.recentFiles}</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent
                    surface="composer"
                    data-preferred-side={subSide}
                    sideOffset={4}
                    className="w-[213px] overflow-hidden"
                    data-composer-menu-surface="true"
                    data-testid="composer-add-recent-menu"
                  >
                    <RecentView
                      labels={labels}
                      files={recentFiles}
                      isError={recentError}
                      isLoading={recentLoading}
                      onOpenLibrary={onOpenLibrary}
                      onRecentFile={onRecentFile}
                      onRetry={onRecentRetry}
                    />
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
            </>
          ) : null}
          {skillsMenu}
          <MenuRow
            icon={LinkIcon}
            label={labels.connectors}
            onSelect={onOpenConnectors}
            testId="composer-add-connectors"
          />
        </>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function RecentView({
  files,
  labels,
  isError,
  isLoading,
  onOpenLibrary,
  onRecentFile,
  onRetry,
}: {
  files: ComposerRecentFile[]
  labels: ComposerAddMenuLabels
  isError: boolean
  isLoading: boolean
  onOpenLibrary: () => void
  onRecentFile: (id: string) => void
  onRetry: () => void
}) {
  return (
    <>
      {isLoading ? (
        <div
          role="status"
          aria-live="polite"
          aria-label={labels.loadingRecentFiles}
          className="flex h-[71px] items-center justify-center"
        >
          <ProductSpinner className="size-4 animate-spin" />
        </div>
      ) : isError ? (
        <>
          <div role="status" aria-live="polite" className="text-muted-foreground px-3 pt-4 pb-2 text-center text-xs">
            {labels.recentFilesLoadFailed}
          </div>
          <DropdownMenuItem
            onSelect={(event) => {
              event.preventDefault()
              onRetry()
            }}
            data-testid="composer-add-recent-retry"
            className="mx-auto mb-3 h-8 w-fit justify-center px-3"
          >
            <ArrowPathIcon />
            {labels.retry}
          </DropdownMenuItem>
        </>
      ) : files.length === 0 ? (
        <div
          role="status"
          aria-live="polite"
          className="flex h-[71px] flex-col items-center justify-center gap-2 px-3 text-center"
        >
          <FolderIcon className="text-muted-foreground/30 size-6" data-testid="composer-recent-empty-icon" />
          <span className="text-muted-foreground/65 text-[12px] leading-[15px] font-medium">
            {labels.noRecentFiles}
          </span>
        </div>
      ) : (
        // 4.5 rows of 35px, so a partial row signals there is more to scroll through.
        <div
          className="max-h-[158px] overflow-x-hidden overflow-y-auto overscroll-contain"
          data-testid="composer-add-recent-scroll"
        >
          {files.map((file) => (
            <DropdownMenuItem
              key={file.id}
              disabled={file.disabled}
              onSelect={(event) => {
                event.preventDefault()
                onRecentFile(file.id)
              }}
              title={file.name}
              className="h-[35px] gap-1.5 rounded-[4px] px-2.5 py-2.5 text-xs leading-[15px] font-medium tracking-normal"
            >
              {file.icon}
              <span className="min-w-0 flex-1 truncate">{file.name}</span>
            </DropdownMenuItem>
          ))}
        </div>
      )}

      <DropdownMenuSeparator className="mx-0 mt-0 mb-1" />
      <MenuRow
        icon={ArchiveBoxIcon}
        label={labels.addFromLibrary}
        onSelect={onOpenLibrary}
        testId="composer-add-library"
      />
    </>
  )
}

function MenuRow({
  className = 'h-[35px] gap-1.5 rounded-[4px] px-2.5 py-2.5 text-xs leading-[15px] font-medium tracking-normal [&>svg:first-child]:size-[15px]',
  icon: Icon,
  itemRef,
  label,
  next = false,
  onSelect,
  testId,
}: {
  className?: string
  icon: typeof PlusIcon
  itemRef?: Ref<HTMLDivElement>
  label: string
  next?: boolean
  onSelect: ComponentProps<typeof DropdownMenuItem>['onSelect']
  testId: string
}) {
  return (
    <DropdownMenuItem ref={itemRef} onSelect={onSelect} data-testid={testId} className={className}>
      <Icon />
      <span className="min-w-0 flex-1">{label}</span>
      {next && <ChevronRightIcon />}
    </DropdownMenuItem>
  )
}
