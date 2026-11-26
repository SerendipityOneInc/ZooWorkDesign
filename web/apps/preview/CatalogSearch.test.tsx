import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, expect, it, vi } from 'vitest'
import { CatalogSearch } from './CatalogSearch'
import { PreviewLocaleProvider } from './locale'
import { LanguageSelector } from './LanguageSelector'

afterEach(cleanup)

it('finds the standalone effort control under Slider', async () => {
  const navigate = vi.fn()
  render(<PreviewLocaleProvider initialLocale="en"><CatalogSearch onNavigate={navigate} /></PreviewLocaleProvider>)
  fireEvent.click(screen.getByRole('button', { name: 'Search components' }))
  fireEvent.change(screen.getByRole('combobox', { name: 'Search components' }), { target: { value: 'EffortSlider' } })
  fireEvent.click(await screen.findByRole('option', { name: /^Slider$/ }))
  expect(navigate).toHaveBeenCalledExactlyOnceWith('slider')
})

it('opens with the shortcut, finds a component by Chinese name, and navigates without changing language', async () => {
  const navigate = vi.fn()
  render(<PreviewLocaleProvider initialLocale="en"><CatalogSearch onNavigate={navigate} /></PreviewLocaleProvider>)
  fireEvent.keyDown(document, { key: 'k', ctrlKey: true })
  const input = screen.getByRole('combobox', { name: 'Search components' })
  fireEvent.change(input, { target: { value: '骨架屏' } })
  const option = await screen.findByRole('option', { name: 'Loading & progress' })
  expect(screen.queryByRole('option', { name: 'Button' })).not.toBeInTheDocument()
  fireEvent.click(option)
  expect(navigate).toHaveBeenCalledWith('loading')
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  expect(document.documentElement.lang).toBe('en')
})

it('shows the language tooltip on focus and switches directly with one click', async () => {
  render(<PreviewLocaleProvider initialLocale="en"><LanguageSelector /></PreviewLocaleProvider>)
  const button = screen.getByRole('button', { name: 'EN — English. Switch to Chinese (Simplified).' })
  act(() => button.focus())
  expect(await screen.findByRole('tooltip')).toHaveTextContent('Switch to Chinese')
  fireEvent.click(button)
  expect(button).toHaveAttribute('aria-label', 'ZH — 简体中文。切换为英文。')
  expect(screen.queryByRole('menu')).not.toBeInTheDocument()
})
