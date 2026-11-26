import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { MarketingNavigation } from './marketing-navigation'
import { MarketingLanguageSelector, MarketingSocialLinks } from './marketing-footer'

describe('marketing source interactions', () => {
  it('switches hover panels, closes outside and restores the Escape trigger', () => {
    render(
      <MarketingNavigation
        navLinks={[
          {
            label: 'Products',
            href: '#products',
            dropdownTrigger: true,
            dropdown: [{ label: 'Builder', href: '#builder' }],
          },
          {
            label: 'Resources',
            href: '#resources',
            dropdownTrigger: true,
            dropdown: [{ label: 'Docs', href: '#docs' }],
          },
        ]}
      />,
    )
    const products = screen.getByRole('button', { name: 'Products' })
    fireEvent.mouseEnter(products.parentElement!)
    expect(products).toHaveAttribute('aria-expanded', 'true')
    const resources = screen.getByRole('button', { name: 'Resources' })
    fireEvent.mouseEnter(resources.parentElement!)
    expect(products).toHaveAttribute('aria-expanded', 'false')
    fireEvent.keyDown(resources, { key: 'Escape' })
    expect(resources).toHaveFocus()
    expect(resources).toHaveAttribute('aria-expanded', 'false')
    fireEvent.click(products)
    fireEvent.click(document.body)
    expect(products).toHaveAttribute('aria-expanded', 'false')
  })

  it('supports language keyboard navigation, selection callback and focus return', async () => {
    const onChange = vi.fn()
    render(
      <MarketingLanguageSelector
        locale="en"
        onLocaleChange={onChange}
        label="Language"
        languages={[
          { code: 'en', label: 'English' },
          { code: 'zh', label: 'Chinese' },
        ]}
      />,
    )
    const trigger = screen.getByRole('button', { name: 'Language: English' })
    fireEvent.keyDown(trigger, { key: 'ArrowDown' })
    const english = screen.getByRole('menuitemradio', { name: 'English' })
    await waitFor(() => expect(english).toHaveFocus())
    fireEvent.keyDown(english, { key: 'End' })
    const chinese = screen.getByRole('menuitemradio', { name: 'Chinese' })
    expect(chinese).toHaveFocus()
    fireEvent.click(chinese)
    expect(onChange).toHaveBeenCalledWith('zh')
    await waitFor(() => expect(trigger).toHaveFocus())
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
  })

  it('names social controls and isolates external destinations', () => {
    render(<MarketingSocialLinks links={[{ label: 'Community', href: 'https://example.com/community' }, { label: 'Guides', href: 'https://example.com/guides', icon: '/guide.svg' }]} />)
    expect(screen.getAllByRole('link')).toHaveLength(2)
    for (const link of screen.getAllByRole('link')) {
      expect(link).toHaveAccessibleName()
      expect(link).toHaveAttribute('rel', 'noopener noreferrer')
      expect(link).toHaveAttribute('target', '_blank')
    }
  })

  it('does not send consumers to product-specific social accounts by default', () => {
    render(<MarketingSocialLinks />)
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
  })
})
