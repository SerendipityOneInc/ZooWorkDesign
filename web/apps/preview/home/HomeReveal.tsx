import { useEffect, useRef, type ReactNode } from 'react'

/** Content stays visible without IntersectionObserver; reveal once, then stop observing. */
export function HomeReveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const element = ref.current
    if (!element || !('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    // Only arm below-fold content, so initial render and deep links never flash invisible.
    if (element.getBoundingClientRect().top < window.innerHeight) return
    element.dataset.reveal = 'waiting'
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) { element.dataset.reveal = 'visible'; observer.disconnect() }
    }, { rootMargin: '0px 0px 32px 0px', threshold: 0 })
    observer.observe(element)
    const revealFocused = () => { element.dataset.reveal = 'visible'; observer.disconnect() }
    element.addEventListener('focusin', revealFocused)
    return () => { observer.disconnect(); element.removeEventListener('focusin', revealFocused) }
  }, [])
  return <div className={`home-reveal ${className}`} ref={ref}>{children}</div>
}
