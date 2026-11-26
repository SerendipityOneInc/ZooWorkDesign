export { browserMimeType } from '../attachments/utils'

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  const units = ['KB', 'MB', 'GB', 'TB']
  let value = bytes
  for (const unit of units) {
    value /= 1024
    if (value < 1024 || unit === 'TB') {
      return `${value.toFixed(1)} ${unit}`
    }
  }
  return `${bytes} B`
}

export function formatDuration(seconds: number): string {
  const total = Math.floor(seconds)
  const m = Math.floor(total / 60)
  const s = total % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}
