'use client'
import { ChevronUpIcon, DevicePhoneMobileIcon } from '@heroicons/react/24/outline'
import { TooltipArrowUpIcon } from './navigation-icons'
export function PrimaryNavUserCard({
  displayName,
  photoURL,
  statusContent,
  isMenuOpen,
  onMenuToggle,
  onOpenMobileApp,
  className = 'rounded-2xl bg-[var(--sidebar-profile-bg)] hover:opacity-[0.72]',
  mobileAppLabel = 'Get mobile app',
  menuLabel = 'Menu',
  profileLabel,
  menuId,
}: {
  displayName: string
  photoURL?: string | null
  statusContent?: React.ReactNode
  isMenuOpen: boolean
  onMenuToggle: () => void
  onOpenMobileApp?: () => void
  className?: string
  mobileAppLabel?: string
  menuLabel?: string
  profileLabel?: string
  menuId?: string
}) {
  const avatarFallback = displayName.charAt(0).toUpperCase()
  return (
    <div
      data-slot="primary-nav-user-card"
      className={`${className} group/profile flex items-center gap-2.5 px-2.5 py-2 transition-colors in-data-[brand-theme=paper-focus]:py-1`}
    >
      {/* Avatar + Info */}
      <button
        onClick={onMenuToggle}
        data-testid="user-card-toggle"
        type="button"
        aria-label={profileLabel}
        aria-controls={menuId}
        aria-haspopup={menuId ? 'dialog' : undefined}
        aria-expanded={isMenuOpen}
        className="focus-visible:ring-ring flex min-w-0 flex-1 cursor-pointer items-center gap-2.5 rounded-xl focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
      >
        {/* Avatar */}
        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center overflow-hidden rounded-full">
          {photoURL ? (
            <img src={photoURL} alt="User avatar" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
          ) : null}
          {!photoURL && (
            <span className="from-ecap-success-border to-ecap-success-text flex h-full w-full items-center justify-center bg-gradient-to-br text-[11px] font-semibold text-white">
              {avatarFallback}
            </span>
          )}
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1 text-left">
          <div className="text-foreground truncate text-[13px] font-semibold">{displayName}</div>
          {statusContent}
        </div>
      </button>

      {/* Actions */}
      <div className="flex gap-3">
        {/* Temporarily hide the mobile-app entry and its tooltip. */}
        <div className="group/download relative hidden">
          <button
            onClick={() => onOpenMobileApp?.()}
            data-testid="user-card-mobile-app"
            className="text-muted-foreground hover:text-foreground bg-border/60 hover:bg-border glass:bg-white/55 glass:hover:bg-white/75 glass-dark:bg-white/10 glass-dark:hover:bg-white/20 focus-visible:ring-ring flex h-8 w-8 cursor-pointer items-center justify-center rounded-xl transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
            aria-label={mobileAppLabel}
          >
            <DevicePhoneMobileIcon className="h-4 w-4" />
          </button>
          {/* Ant Design tooltip — top */}
          <div className="pointer-events-none absolute bottom-full left-1/2 z-[1070] mb-1.5 -translate-x-1/2 opacity-0 transition-opacity duration-200 group-hover/download:opacity-100">
            <div className="bg-ecap-tooltip-bg rounded-md px-2 py-1.5 text-xs whitespace-nowrap text-white shadow-[0_2px_8px_rgba(0,0,0,0.15)]">
              {mobileAppLabel}
            </div>
            <div className="absolute top-full left-1/2 -translate-x-1/2">
              <TooltipArrowUpIcon />
            </div>
          </div>
        </div>

        {/* Arrow button — rotates when menu is open */}
        <button
          onClick={onMenuToggle}
          data-testid="user-card-arrow"
          type="button"
          aria-controls={menuId}
          aria-haspopup={menuId ? 'dialog' : undefined}
          aria-expanded={isMenuOpen}
          className="text-muted-foreground hover:text-foreground hover:bg-border/60 glass:hover:bg-white/55 glass-dark:hover:bg-white/20 focus-visible:ring-ring cursor-pointer rounded-xl p-2 transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
          aria-label={menuLabel}
        >
          <ChevronUpIcon
            className={`h-4 w-4 transition-transform duration-300 ease-out ${isMenuOpen ? 'rotate-180' : ''} ${!isMenuOpen ? 'group-hover/profile:animate-nudge-up' : ''}`}
          />
        </button>
      </div>
    </div>
  )
}
