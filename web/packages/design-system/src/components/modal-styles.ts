export const modalOverlayClassName =
  'fixed inset-0 z-50 bg-black/25 motion-normal dark:bg-black/60 data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0'

export const modalContentClassName =
  'fixed top-1/2 left-1/2 z-50 grid w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 gap-5 rounded-xl border border-border bg-popover p-5 text-sm text-popover-foreground shadow-dialog outline-none motion-normal data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95'

export const modalCloseButtonClassName =
  'absolute top-3 right-3 flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-hover hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/35 focus-visible:outline-hidden disabled:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0'

export const modalHeaderClassName = 'flex flex-col gap-1.5 text-left'

export const modalFooterClassName =
  'flex flex-col-reverse gap-2 pt-1 sm:flex-row sm:justify-end'

export const modalTitleClassName = 'text-base leading-6 font-semibold text-foreground'

export const modalDescriptionClassName =
  'text-sm leading-5 text-foreground/65 *:[a]:underline *:[a]:underline-offset-3 *:[a]:hover:text-foreground'
