import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, expect, it, vi } from 'vitest'
import { useCatalogNavigation } from './useCatalogNavigation'

afterEach(() => { cleanup(); vi.restoreAllMocks(); vi.unstubAllGlobals(); window.history.replaceState(null, '', '/') })

function Harness() {
  const { activeSection, navigate, sidebarRef } = useCatalogNavigation()
  return <>
    <header className="pv-topbar" />
    <aside ref={sidebarRef} data-testid="sidebar">
      {['purpose', 'button', 'splitter'].map(id => <a key={id} href={'#' + id} aria-current={activeSection === id ? 'location' : undefined}
        onClick={event => { event.preventDefault(); navigate(id as 'purpose' | 'button' | 'splitter') }}>{id}</a>)}
    </aside>
    <main className="pv-main">{['purpose', 'button', 'splitter'].map(id => <section key={id} id={id} />)}</main>
  </>
}

it('tracks the section crossing the sticky header and scrolls only the sidebar to expose its active link', async () => {
  let scroll = 0
  vi.spyOn(document.documentElement, 'scrollHeight', 'get').mockReturnValue(5000)
  vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function(this: Element) {
    const base = { x: 0, y: 0, width: 200, height: 40, left: 0, right: 200, toJSON: () => ({}) }
    if (this.tagName === 'HEADER') return { ...base, top: 0, bottom: 56 }
    if (this.tagName === 'ASIDE') return { ...base, top: 56, bottom: 300 }
    if (this.tagName === 'A') return { ...base, top: this.textContent === 'splitter' ? 650 : 100, bottom: this.textContent === 'splitter' ? 690 : 140 }
    const offsets: Record<string, number> = { purpose: 80, button: 800, splitter: 1400 }
    const top = (offsets[this.id] ?? 0) - scroll
    return { ...base, top, bottom: top + 500 }
  })
  const scrollIntoView = vi.spyOn(Element.prototype, 'scrollIntoView')
  render(<Harness />)
  await act(async () => { await new Promise(resolve => setTimeout(resolve, 25)) })
  expect(screen.getByRole('link', { name: 'purpose' })).toHaveAttribute('aria-current', 'location')
  scroll = 1330
  vi.stubGlobal('scrollY', scroll)
  fireEvent.scroll(window)
  await waitFor(() => expect(screen.getByRole('link', { name: 'splitter' })).toHaveAttribute('aria-current', 'location'))
  expect(screen.getByTestId('sidebar').scrollTop).toBe(406)
  expect(scrollIntoView).not.toHaveBeenCalled()
  fireEvent.click(screen.getByRole('link', { name: 'button' }))
  expect(window.location.hash).toBe('#button')
  expect(scrollIntoView).toHaveBeenCalledWith({ behavior: 'instant', block: 'start' })

  scrollIntoView.mockClear()
  scroll = 200
  vi.stubGlobal('scrollY', scroll)
  fireEvent.scroll(window)
  await waitFor(() => expect(screen.getByRole('link', { name: 'purpose' })).toHaveAttribute('aria-current', 'location'))
  expect(screen.getByTestId('sidebar').scrollTop).toBe(0)

  // Purpose stays active while the page finishes scrolling to the top.
  // Its visible link alone must not leave the group heading clipped.
  screen.getByTestId('sidebar').scrollTop = 40
  scroll = 0
  vi.stubGlobal('scrollY', scroll)
  fireEvent.scroll(window)
  await waitFor(() => expect(screen.getByTestId('sidebar').scrollTop).toBe(0))
  expect(screen.getByRole('link', { name: 'purpose' })).toHaveAttribute('aria-current', 'location')
  expect(scrollIntoView).not.toHaveBeenCalled()
})

it('selects the dominant visible section while the preceding section still trails below the header', async () => {
  vi.stubGlobal('scrollY', 1000)
  vi.stubGlobal('innerHeight', 900)
  vi.spyOn(document.documentElement, 'scrollHeight', 'get').mockReturnValue(5000)
  vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function(this: Element) {
    const top = this.id === 'button' ? -200 : this.id === 'splitter' ? 220 : -1000
    const bottom = this.id === 'button' ? 220 : this.id === 'splitter' ? 1100 : -500
    return { x: 0, y: top, top, bottom, width: 200, height: bottom - top, left: 0, right: 200, toJSON: () => ({}) }
  })
  render(<Harness />)
  fireEvent.scroll(window)
  await waitFor(() => expect(screen.getByRole('link', { name: 'splitter' })).toHaveAttribute('aria-current', 'location'))
  // A direct navigation to a short section wins until the document actually moves again.
  fireEvent.click(screen.getByRole('link', { name: 'button' }))
  fireEvent.resize(window)
  await act(async () => { await new Promise(resolve => setTimeout(resolve, 30)) })
  expect(screen.getByRole('link', { name: 'button' })).toHaveAttribute('aria-current', 'location')
  vi.stubGlobal('scrollY', 1020)
  fireEvent.scroll(window)
  await waitFor(() => expect(screen.getByRole('link', { name: 'splitter' })).toHaveAttribute('aria-current', 'location'))
})
