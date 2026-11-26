'use client'

import { ArchiveBoxIcon, EllipsisHorizontalIcon, PencilIcon } from '@heroicons/react/24/outline'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../components/dropdown-menu'
import { useEffect, useRef, useState } from 'react'

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from './product-alert-dialog'
import { ProductButton as Button } from './product-button'
import { cn } from '../lib/cn'

export const defaultSessionLabels = {
  renameSession: 'Rename',
  sessionActions: 'Session actions',
  archiveSession: 'Archive',
  archiveSessionTitle: 'Archive conversation?',
  archiveSessionDescription: 'This conversation will be moved to the archive.',
  cancel: 'Cancel',
}

export interface WorkspaceSessionRowProps {
  labels?: typeof defaultSessionLabels
  onError?: () => void
  sessionId: string
  title: string
  isActive: boolean
  className?: string
  disabled?: boolean
  testId?: string
  focusRef?: { current: HTMLButtonElement | null }
  onOpen: () => void
  onArchive?: () => Promise<void>
  onRename?: (nextTitle: string) => Promise<void>
}

export function WorkspaceSessionRow({
  labels = defaultSessionLabels,
  onError,
  sessionId,
  title,
  isActive,
  focusRef,
  className,
  disabled = false,
  testId,
  onOpen,
  onArchive,
  onRename,
}: WorkspaceSessionRowProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isActionsOpen, setIsActionsOpen] = useState(false)
  const [draftTitle, setDraftTitle] = useState(title)
  const [isSaving, setIsSaving] = useState(false)
  const [isArchiveOpen, setIsArchiveOpen] = useState(false)
  const [isArchiving, setIsArchiving] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const titleButtonRef = useRef<HTMLButtonElement>(null)
  const isComposingRef = useRef(false)
  const restoreTitleFocusRef = useRef(false)
  const saveInFlightRef = useRef(false)

  useEffect(() => {
    if (!isEditing) return
    const input = inputRef.current
    input?.focus()
    input?.select()
  }, [isEditing])

  useEffect(() => {
    if (isEditing || !restoreTitleFocusRef.current) return
    restoreTitleFocusRef.current = false
    titleButtonRef.current?.focus()
  }, [isEditing])

  const startRename = () => {
    setDraftTitle(title)
    setIsSaving(false)
    isComposingRef.current = false
    restoreTitleFocusRef.current = false
    setIsEditing(true)
  }

  const exitRename = (restoreTitleFocus: boolean) => {
    restoreTitleFocusRef.current = restoreTitleFocus
    setIsEditing(false)
  }

  const cancelRename = (restoreTitleFocus = false) => {
    setDraftTitle(title)
    exitRename(restoreTitleFocus)
  }

  const commitRename = async (restoreTitleFocus = false) => {
    if (saveInFlightRef.current || !onRename) return
    const nextTitle = draftTitle.trim()
    if (!nextTitle) return
    if (nextTitle === title.trim()) {
      exitRename(restoreTitleFocus)
      return
    }
    saveInFlightRef.current = true
    setIsSaving(true)
    try {
      await onRename(nextTitle)
      const inputStillOwnsFocus = document.activeElement === inputRef.current
      exitRename(restoreTitleFocus && inputStillOwnsFocus)
    } catch {
      onError?.()
    } finally {
      saveInFlightRef.current = false
      setIsSaving(false)
    }
  }

  const confirmArchive = async () => {
    if (isArchiving || !onArchive) return
    setIsArchiving(true)
    try {
      await onArchive()
      setIsArchiveOpen(false)
    } catch {
      onError?.()
    } finally {
      setIsArchiving(false)
    }
  }

  if (isEditing) {
    return (
      <div className={cn('flex h-[31px] w-full items-center px-2 py-1.5', className)}>
        <input
          ref={inputRef}
          data-session-rename-input=""
          data-testid={`nav-agent-session-rename-input-${sessionId}`}
          aria-label={labels.renameSession}
          aria-busy={isSaving || undefined}
          value={draftTitle}
          readOnly={isSaving}
          maxLength={80}
          onChange={(event) => {
            if (!saveInFlightRef.current) setDraftTitle(event.target.value)
          }}
          onCompositionStart={() => {
            isComposingRef.current = true
          }}
          onCompositionEnd={() => {
            isComposingRef.current = false
          }}
          onKeyDown={(event) => {
            const isImeConfirmation =
              isComposingRef.current ||
              event.nativeEvent.isComposing ||
              event.keyCode === 229 ||
              event.which === 229 ||
              event.nativeEvent.keyCode === 229 ||
              event.nativeEvent.which === 229

            if (saveInFlightRef.current) {
              if (event.key === 'Enter' || event.key === 'Escape') event.preventDefault()
              return
            }
            if (event.key === 'Enter' && !isImeConfirmation) {
              event.preventDefault()
              void commitRename(true)
            } else if (event.key === 'Escape') {
              event.preventDefault()
              cancelRename(true)
            }
          }}
          onBlur={() => {
            if (saveInFlightRef.current) return
            if (!draftTitle.trim()) {
              cancelRename()
              return
            }
            void commitRename()
          }}
          className="text-foreground h-[19px] min-w-0 flex-1 border-0 bg-transparent px-0 text-[13px] leading-[18.571px] outline-none selection:bg-[var(--ecap-session-rename-selection)]"
        />
      </div>
    )
  }

  return (
    <div
      className={cn(
        `group/session text-foreground relative flex h-[31px] w-full items-center rounded px-2 py-1.5 text-[13px] leading-[18.571px] transition-colors ${
          isActive
            ? 'bg-background hover:bg-background focus-within:bg-background'
            : `hover:bg-sidebar-accent focus-within:bg-sidebar-accent ${isActionsOpen ? 'bg-sidebar-accent' : ''}`
        }`,
        className,
      )}
    >
      <button
        ref={(element) => {
          titleButtonRef.current = element
          if (focusRef) focusRef.current = element
        }}
        type="button"
        data-testid={testId ?? `nav-agent-session-${sessionId}`}
        title={title}
        disabled={disabled}
        aria-current={isActive ? 'page' : undefined}
        onClick={onOpen}
        className={`focus-visible:ring-ring min-w-0 flex-1 truncate rounded text-left outline-none group-focus-within/session:mr-5 group-hover/session:mr-5 focus-visible:ring-2 [@media(pointer:coarse)]:mr-5 ${isActionsOpen ? 'mr-5' : ''}`}
      >
        {title}
      </button>

      <div
        className={`absolute top-1/2 right-1 flex h-6 w-[18px] -translate-y-1/2 items-center transition-opacity group-focus-within/session:pointer-events-auto group-focus-within/session:opacity-100 group-hover/session:pointer-events-auto group-hover/session:opacity-100 [@media(pointer:coarse)]:pointer-events-auto [@media(pointer:coarse)]:opacity-100 ${isActionsOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}`}
      >
        <DropdownMenu open={isActionsOpen} onOpenChange={setIsActionsOpen}>
          {(onRename || onArchive) && (
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                data-testid={`nav-agent-session-more-${sessionId}`}
                disabled={disabled}
                aria-label={labels.sessionActions}
                className={`focus-visible:ring-ring flex h-6 w-[18px] items-center justify-center rounded-sm focus-visible:ring-2 focus-visible:outline-none ${isActionsOpen ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              >
                <EllipsisHorizontalIcon className="h-[18px] w-[18px]" />
              </button>
            </DropdownMenuTrigger>
          )}
          <DropdownMenuContent
            data-session-more-menu=""
            align="end"
            sideOffset={4}
            className="w-max min-w-32 p-1 whitespace-nowrap"
          >
            {onRename && (
              <DropdownMenuItem
                data-session-more-item=""
                data-testid={`nav-agent-session-rename-${sessionId}`}
                onSelect={startRename}
                className="gap-2 px-3 py-2 text-xs"
              >
                <PencilIcon className="h-4 w-4" />
                {labels.renameSession}
              </DropdownMenuItem>
            )}
            {onArchive && (
              <DropdownMenuItem
                variant="destructive"
                data-session-more-item=""
                data-session-more-danger=""
                data-testid={`nav-agent-session-archive-${sessionId}`}
                onSelect={() => setIsArchiveOpen(true)}
                className="gap-2 px-3 py-2 text-xs"
              >
                <ArchiveBoxIcon className="h-4 w-4" />
                {labels.archiveSession}
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {onArchive && (
        <AlertDialog open={isArchiveOpen} onOpenChange={(open) => !isArchiving && setIsArchiveOpen(open)}>
          <AlertDialogContent>
            <div className="p-6">
              <AlertDialogTitle>{labels.archiveSessionTitle}</AlertDialogTitle>
              <AlertDialogDescription className="mt-2">{labels.archiveSessionDescription}</AlertDialogDescription>
            </div>
            <div className="border-border flex justify-end gap-3 border-t p-5">
              <AlertDialogCancel asChild>
                <Button type="button" variant="secondary" disabled={isArchiving}>
                  {labels.cancel}
                </Button>
              </AlertDialogCancel>
              <Button type="button" variant="destructive" disabled={isArchiving} onClick={() => void confirmArchive()}>
                {labels.archiveSession}
              </Button>
            </div>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  )
}
