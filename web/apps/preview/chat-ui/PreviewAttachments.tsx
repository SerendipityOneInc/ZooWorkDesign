import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@zooclaw/zooworkdesign'
import { AttachmentGallery, AudioAttachment, FileAttachment, ImageAttachment, VideoAttachment, type AttachmentView } from './source'
import { demoImage, useChatCopy } from './shared'

export const previewReportText = 'Weekly research summary\n\n24 tasks completed. Three sources reviewed.\nNext step: share the findings with the team.'
export const previewReport: AttachmentView = { id: 'report', kind: 'file', name: 'weekly-report.txt', mimeType: 'text/plain', size: new TextEncoder().encode(previewReportText).length, url: `data:text/plain;charset=utf-8,${encodeURIComponent(previewReportText)}`, previewable: true }
const previewCsvText = 'source,status\nresearch,reviewed'
export const previewCsv: AttachmentView = { id: 'sources', kind: 'file', name: 'sources.csv', mimeType: 'text/csv', size: new TextEncoder().encode(previewCsvText).length, url: `data:text/csv;charset=utf-8,${encodeURIComponent(previewCsvText)}`, previewable: true }
export const previewImage: AttachmentView = { id: 'image', kind: 'image', name: 'preview-image.png', mimeType: 'image/png', url: demoImage }

/** Catalog adapter only: message and attachment geometry remain owned by the package. */
export function PreviewAttachments({ items, onPreview, align = 'end' }: {
  items: AttachmentView[]; onPreview: (view: AttachmentView) => void; align?: 'start' | 'end'
}) {
  return <AttachmentGallery items={items} align={align} size="small" renderItem={item => {
    const view = items.find(candidate => candidate.id === item.id)!
    if (view.kind === 'image') return <ImageAttachment view={view} size="small" onPreview={onPreview} />
    if (view.kind === 'audio') return <AudioAttachment view={view} />
    if (view.kind === 'video') return <VideoAttachment view={view} onPreview={onPreview} />
    return <FileAttachment view={view} onPreview={onPreview} />
  }} />
}

export function AttachmentPreviewDialog({ view, onClose }: { view: AttachmentView | null; onClose: () => void }) {
  const { c } = useChatCopy()
  return <Dialog open={view !== null} onOpenChange={open => { if (!open) onClose() }}><DialogContent closeLabel={c('Close attachment preview', '关闭附件预览')}>
    <DialogTitle>{view?.name}</DialogTitle><DialogDescription>{c('Attachment in this local preview. No file is uploaded to a server.', '当前本地预览中的附件，文件不会上传到服务器。')}</DialogDescription>
    {view?.kind === 'image' ? <img src={view.url ?? undefined} alt={view.name} className="max-h-[65vh] w-full object-contain" /> :
      view?.kind === 'video' ? <video src={view.url ?? undefined} controls className="w-full" /> :
      view?.url === previewReport.url ? <pre className="whitespace-pre-wrap text-sm">{previewReportText}</pre> :
      view?.url === previewCsv.url ? <pre className="whitespace-pre-wrap text-sm">{previewCsvText}</pre> :
      view?.url ? <a className="underline underline-offset-4" href={view.url} download={view.name}>{c('Download attachment', '下载附件')}</a> : null}
  </DialogContent></Dialog>
}
