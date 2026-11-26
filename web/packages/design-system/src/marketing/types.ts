export interface LandingNavLink {
  label: string
  href: string
  external?: boolean
  newTab?: boolean
  dropdownTrigger?: boolean
  dropdown?: LandingNavLink[]
  dropdownGroups?: { label: string; href: string; links: LandingNavLink[] }[]
  comingSoon?: boolean
  badge?: string
  onClick?: () => void
}

export interface LandingFooterLink {
  label: string
  href?: string
  external?: boolean
  newTab?: boolean
  comingSoon?: boolean
  onClick?: () => void
}

export interface LandingFooterColumn {
  title: string
  links: LandingFooterLink[]
}
