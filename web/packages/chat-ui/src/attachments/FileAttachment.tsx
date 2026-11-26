'use client'

import { ArrowDownTrayIcon } from '@heroicons/react/24/outline'

import type { AttachmentView } from './types'

export function FileAttachment({
  view,
  onDownload,
  onPreview,
}: {
  view: AttachmentView
  onDownload?: (v: AttachmentView) => void
  onPreview?: (v: AttachmentView) => void
}) {
  const rawExt = view.name.includes('.') ? view.name.split('.').pop()?.toLowerCase() : ''
  const extLabel = rawExt ? rawExt.toUpperCase() : ''
  const canPreview = !!view.previewable && !!onPreview

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation()
    onDownload?.(view)
  }

  const handlePreview = () => {
    if (canPreview) onPreview?.(view)
  }

  return (
    <div className="group/file relative h-[80px] w-[80px] shrink-0">
      <div
        className={`border-border bg-muted flex h-full w-full flex-col justify-between rounded-xl border p-2 ${
          canPreview ? 'hover:border-ecap-primary cursor-pointer transition-colors' : ''
        }`}
        onClick={canPreview ? handlePreview : undefined}
        onKeyDown={
          canPreview
            ? (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  handlePreview()
                }
              }
            : undefined
        }
        role={canPreview ? 'button' : undefined}
        tabIndex={canPreview ? 0 : undefined}
      >
        <span className="text-foreground line-clamp-3 text-[10px] leading-snug break-all">{view.name}</span>
        <div className="flex items-end justify-between">
          {extLabel && (
            <span className="border-border text-muted-foreground w-fit rounded-[3px] border bg-white px-1 py-0.5 text-[9px] font-semibold">
              {extLabel}
            </span>
          )}
          {onDownload && (
            <button
              type="button"
              onClick={handleDownload}
              className="border-border text-muted-foreground hover:text-foreground flex h-[18px] w-[18px] items-center justify-center rounded-[3px] border bg-white opacity-0 transition-opacity group-hover/file:opacity-100"
            >
              <ArrowDownTrayIcon className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
