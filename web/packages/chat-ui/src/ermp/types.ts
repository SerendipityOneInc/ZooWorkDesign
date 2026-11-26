export interface ERMPCardBase {
  _card: string
  _version?: string
  _fallback?: string
  _id?: string
}

export interface AudioCard extends ERMPCardBase {
  _card: 'audio'
  src: string
  mimeType?: string
  duration?: number
  title?: string
  waveform?: number[]
}

export interface VideoCard extends ERMPCardBase {
  _card: 'video'
  src: string
  mimeType?: string
  poster?: string
  duration?: number
  title?: string
  width?: number
  height?: number
}

export interface FileCard extends ERMPCardBase {
  _card: 'file'
  src: string
  name: string
  mimeType?: string
  size?: number
}

export interface TableColumn {
  key: string
  label: string
  align?: 'left' | 'center' | 'right'
}

export interface TableCard extends ERMPCardBase {
  _card: 'table'
  title?: string
  columns: TableColumn[]
  rows: Record<string, unknown>[]
  summary?: string
}

export interface KVItem {
  key: string
  value: string
  tag?: string
}

export interface KVCard extends ERMPCardBase {
  _card: 'kv'
  title?: string
  items: KVItem[]
}

export interface ERMPButton {
  label: string
  action: 'callback' | 'link' | 'copy'
  value: string
  style?: 'primary' | 'secondary' | 'danger'
}

export interface ActionsCard extends ERMPCardBase {
  _card: 'actions'
  title?: string
  description?: string
  buttons: ERMPButton[]
}

export interface FormField {
  name: string
  label: string
  type: 'text' | 'number' | 'select' | 'toggle' | 'textarea'
  options?: string[]
  placeholder?: string
  required?: boolean
  default?: unknown
}

export interface FormCard extends ERMPCardBase {
  _card: 'form'
  title?: string
  fields: FormField[]
  submitLabel?: string
  submitAction?: string
}

export interface CompositeCard extends ERMPCardBase {
  _card: 'composite'
  title?: string
  icon?: string
  sections: ERMPCard[]
}

export type ERMPCard = AudioCard | VideoCard | FileCard | TableCard | KVCard | ActionsCard | FormCard | CompositeCard
