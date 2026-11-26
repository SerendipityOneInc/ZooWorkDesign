'use client'
import { cn } from '../lib/cn'
export function PrimaryNavigation({
  isCollapsed,
  isMobile = false,
  isMobileMenuOpen = false,
  onMobileMenuClose,
  logo,
  children,
  footer,
  className,
  navClassName,
  label,
}: {
  isCollapsed: boolean
  isMobile?: boolean
  isMobileMenuOpen?: boolean
  onMobileMenuClose?: () => void
  logo: React.ReactNode
  children: React.ReactNode
  footer: React.ReactNode
  className?: string
  navClassName?: string
  label?: string
}) {
  return (
    <>
      <aside
        data-testid="side-nav"
        inert={isMobile && !isMobileMenuOpen}
        className={cn(
          'bg-sidebar-background md:glass:top-3 md:glass:left-3 md:glass:h-[calc(100vh-24px)] md:glass:rounded-3xl fixed top-0 left-0 z-40 h-full shadow-[var(--sidebar-shadow)] transition-[width,transform] duration-300 motion-reduce:transition-none',
          isMobile
            ? `w-[260px] ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`
            : isCollapsed
              ? 'w-16'
              : 'w-[260px]',
          className,
        )}
      >
        <div className="flex h-full flex-col">
          {logo}
          <nav
            className={cn('flex min-h-0 flex-1 flex-col overflow-hidden px-3 pb-2', navClassName)}
            aria-label={label}
          >
            {children}
          </nav>
          {footer}
        </div>
      </aside>
      {isMobile && isMobileMenuOpen && (
        <button
          type="button"
          tabIndex={-1}
          aria-label="Close navigation"
          className="fixed inset-0 z-30 bg-black/50"
          onClick={onMobileMenuClose}
        />
      )}
    </>
  )
}
