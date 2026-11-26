import type { ReactNode } from 'react'
import './globals.css'

export default function Layout({ children }: { children: ReactNode }) {
  return <html lang="zh-CN" data-brand-theme="paper-focus"><body>{children}</body></html>
}
