'use client'
import { SecondaryNavigation, type SecondaryNavigationProps } from './secondary-navigation'
export type { SecondaryNavigationItem, SecondaryNavigationSection } from './secondary-navigation'

export function SecondaryNavigationLayout({
  header, children, wideContent = false, ...navigation
}: SecondaryNavigationProps & {
  header?: React.ReactNode
  children: React.ReactNode
  wideContent?: boolean
}) {
  return (
    <div className="bg-background flex h-full min-h-0 flex-col md:flex-row">
      <SecondaryNavigation {...navigation} />
      <main className="flex min-h-0 min-w-0 flex-1 flex-col">
        {header}
        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-6 md:px-8 md:py-8">
          <div className={wideContent ? 'mx-auto max-w-[1200px]' : 'mx-auto max-w-4xl'}>{children}</div>
        </div>
      </main>
    </div>
  )
}
