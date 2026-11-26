import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { CATALOG_ITEMS, type CatalogId } from './catalog'
import { resolveCatalogLocation } from './catalog-location'

export function useCatalogNavigation() {
  const [activeSection, setActiveSection] = useState<CatalogId>('purpose')
  const sidebarRef = useRef<HTMLElement>(null)
  const destinationRef = useRef<{ id: CatalogId; scrollY: number } | null>(null)
  const navigate = useCallback((id: CatalogId) => {
    setActiveSection(id)
    document.getElementById(id)?.scrollIntoView({ behavior: 'instant', block: 'start' })
    destinationRef.current = { id, scrollY: window.scrollY }
    window.history.replaceState(null, '', '#' + id)
  }, [])

  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const top = document.querySelector('.pv-topbar')?.getBoundingClientRect().bottom ?? 64
      let current: CatalogId = 'purpose'
      let mostVisible = 0
      for (const { id } of CATALOG_ITEMS) {
        const section = document.getElementById(id)
        if (!section) continue
        const rect = section.getBoundingClientRect()
        const visible = Math.max(0, Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, top))
        // Follow the content occupying the viewport, not the trailing edge of the previous section.
        if (visible > mostVisible) { current = id; mostVisible = visible }
      }
      const destination = destinationRef.current
      if (destination && Math.abs(window.scrollY - destination.scrollY) <= 2) current = destination.id
      else destinationRef.current = null
      if (window.scrollY <= 1) current = 'purpose'
      if (window.scrollY > 0 && window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 4)
        current = CATALOG_ITEMS[CATALOG_ITEMS.length - 1].id
      // The active section may already be Purpose before the page reaches the top.
      // Reset here too, so its group heading is restored without a state change.
      if (window.scrollY <= 1 && sidebarRef.current) sidebarRef.current.scrollTop = 0
      setActiveSection(current)
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update) }
    const hash = () => {
      const destination = resolveCatalogLocation(window.location.search, window.location.hash)
      if (destination) window.history.replaceState(null, '', `${window.location.pathname}${destination}`)
      const id = window.location.hash.slice(1)
      if (CATALOG_ITEMS.some(item => item.id === id)) {
        document.getElementById(id)?.scrollIntoView({ behavior: 'instant', block: 'start' })
        destinationRef.current = { id: id as CatalogId, scrollY: window.scrollY }
      }
      schedule()
    }
    const initial = requestAnimationFrame(hash)
    window.addEventListener('hashchange', hash)
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    const observer = new ResizeObserver(schedule)
    const main = document.querySelector('.pv-main')
    if (main) observer.observe(main)
    for (const { id } of CATALOG_ITEMS) {
      const section = document.getElementById(id)
      if (section) observer.observe(section)
    }
    return () => {
      cancelAnimationFrame(initial)
      cancelAnimationFrame(frame)
      observer.disconnect()
      window.removeEventListener('hashchange', hash)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }, [])

  useLayoutEffect(() => {
    const sidebar = sidebarRef.current
    const link = sidebar?.querySelector<HTMLElement>('[aria-current="location"]')
    if (!sidebar || !link) return
    if (activeSection === 'purpose') {
      sidebar.scrollTop = 0
      return
    }
    const container = sidebar.getBoundingClientRect()
    const item = link.getBoundingClientRect()
    // Scroll only the sidebar. scrollIntoView() can also move the document.
    if (item.top < container.top + 16) sidebar.scrollTop += item.top - container.top - 16
    else if (item.bottom > container.bottom - 16) sidebar.scrollTop += item.bottom - container.bottom + 16
  }, [activeSection])

  return { activeSection, navigate, sidebarRef }
}
