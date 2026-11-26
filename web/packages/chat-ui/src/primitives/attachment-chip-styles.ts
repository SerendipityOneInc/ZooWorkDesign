/** Shared by React attachment lists and the contentEditable's DOM chips. */
export const inlineAttachmentChipStyles = {
  root: 'inline-flex h-7 max-w-full items-center gap-1.5 rounded-[6px] bg-border/60 pl-1 pr-2 py-0.5 align-middle transition-colors duration-150',
  icon: 'relative flex size-5 shrink-0 items-center justify-center overflow-hidden rounded bg-muted [&>svg]:size-5',
  name: 'min-w-0 max-w-20 truncate text-xs text-muted-foreground',
  action: 'inline-flex size-4 shrink-0 items-center justify-center rounded text-muted-foreground hover:bg-border hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring',
} as const
