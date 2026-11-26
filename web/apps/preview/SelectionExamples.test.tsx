import { fireEvent, render, screen, within } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { PreviewLocaleProvider } from './locale'
import { SelectionExamples } from './SelectionExamples'
import { CatalogSearch } from './CatalogSearch'
import { CATALOG_ITEMS } from './catalog'

describe('Tabs / Segmented family', () => {
  it('keeps content panels and filter values independent in the same section', () => {
    render(<PreviewLocaleProvider initialLocale="en"><SelectionExamples /></PreviewLocaleProvider>)
    fireEvent.mouseDown(screen.getByRole('tab', { name: 'Analytics' }), { button: 0, ctrlKey: false })
    const scope = within(screen.getByRole('radiogroup', { name: 'Agent scope' }))
    fireEvent.click(scope.getByRole('radio', { name: 'My agents' }))
    fireEvent.click(screen.getByRole('button', { name: 'Filled' }))
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Analytics panel')
    expect(scope.getByRole('radio', { name: 'My agents' })).toHaveAttribute('aria-checked', 'true')
    expect(screen.getByRole('status')).toHaveTextContent('Current filter: My agents')
    expect(CATALOG_ITEMS.filter(item => /Tabs|Segmented/.test(item.label))).toHaveLength(1)
  })

  it.each(['Tabs', 'Segmented', '选项卡', '分段选择器'])('finds the same catalog entry for %s', async query => {
    const navigate = vi.fn()
    render(<PreviewLocaleProvider initialLocale="en"><CatalogSearch onNavigate={navigate} /></PreviewLocaleProvider>)
    fireEvent.click(screen.getByRole('button', { name: 'Search components' }))
    fireEvent.change(screen.getByRole('combobox', { name: 'Search components' }), { target: { value: query } })
    const option = await screen.findByRole('option', { name: 'Tabs / Segmented' })
    expect(screen.getAllByRole('option', { name: 'Tabs / Segmented' })).toHaveLength(1)
    fireEvent.click(option)
    expect(navigate).toHaveBeenCalledWith('tabs')
  })
})
