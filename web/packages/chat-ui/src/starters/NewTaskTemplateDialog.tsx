'use client'

import { XMarkIcon } from '@heroicons/react/24/outline'
import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@zooclaw/zooworkdesign'

import type { NewTaskStarterLabels, NewTaskStarterTemplate } from './NewTaskStarter'

export interface NewTaskTemplateDialogProps {
  template: NewTaskStarterTemplate | null
  labels: NewTaskStarterLabels
  onOpenChange: (open: boolean) => void
  onSelect: (template: NewTaskStarterTemplate) => void
}

export function NewTaskTemplateDialog({
  template,
  labels,
  onOpenChange,
  onSelect,
}: NewTaskTemplateDialogProps) {
  return (
    <Dialog open={template !== null} onOpenChange={onOpenChange}>
      {template ? (
        <DialogContent
          showCloseButton={false}
          className="grid max-h-[calc(100vh-2rem)] w-[calc(100%-2rem)] max-w-4xl gap-0 overflow-hidden p-0 sm:max-w-4xl md:grid-cols-[minmax(0,1.2fr)_minmax(19rem,0.8fr)]"
        >
          <div className="bg-muted flex min-h-0 flex-col gap-2 overflow-y-auto p-3 md:max-h-[min(42rem,calc(100vh-2rem))]">
            {template.previewUrls.map((url, index) => (
              <img
                key={url}
                src={url}
                alt={`${template.name} ${index + 1}`}
                loading="lazy"
                className="border-border block aspect-video w-full rounded-lg border object-cover"
              />
            ))}
          </div>

          <div className="relative flex min-h-0 flex-col p-6 pt-14">
            <DialogClose asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label={labels.closeTemplatePreview}
                className="absolute top-3 right-3"
              >
                <XMarkIcon />
              </Button>
            </DialogClose>

            <p className="text-muted-foreground text-xs font-semibold tracking-[0.14em] uppercase">
              {template.themeLabel} · {template.metaLabel}
            </p>
            <DialogTitle className="mt-2 text-2xl">{template.name}</DialogTitle>
            <DialogDescription className="mt-3">
              {template.description ?? `${template.themeLabel} · ${template.metaLabel}`}
            </DialogDescription>

            {template.tags && template.tags.length > 0 ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {template.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-muted text-muted-foreground rounded-md px-2 py-1 text-[11px] font-medium tracking-wide uppercase"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}

            {template.bestFor ? (
              <div className="mt-8">
                <p className="text-muted-foreground text-xs font-semibold tracking-[0.14em] uppercase">
                  {labels.templateBestFor}
                </p>
                <p className="text-foreground/75 mt-2 text-sm leading-6">{template.bestFor}</p>
              </div>
            ) : null}

            <Button
              type="button"
              className="mt-8 w-full md:mt-auto"
              onClick={() => {
                onSelect(template)
                onOpenChange(false)
              }}
            >
              {labels.useTemplate}
            </Button>
          </div>
        </DialogContent>
      ) : null}
    </Dialog>
  )
}
