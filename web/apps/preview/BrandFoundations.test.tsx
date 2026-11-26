import { fireEvent, render, screen } from '@testing-library/react'
import { expect, it } from 'vitest'
import { PreviewLocaleProvider, usePreviewLocale } from './locale'
import { BRAND_ASSETS } from '@zooclaw/zooworkdesign'
import { BrandColorRules, BrandIdentity, BrandTypography } from './BrandFoundations'

it('selects the correct logo asset for each backdrop and offers actual downloads', () => {
  render(<BrandIdentity />)
  expect(screen.getByAltText('ZooWork horizontal wordmark')).toHaveAttribute('src', BRAND_ASSETS.logoDark)
  fireEvent.click(screen.getByRole('button', { name: 'Dark background' }))
  expect(screen.getByAltText('ZooWork horizontal wordmark')).toHaveAttribute('src', BRAND_ASSETS.logoLight)
  fireEvent.click(screen.getByRole('button', { name: 'Standalone symbol' }))
  expect(screen.getByAltText('ZooWork symbol')).toHaveAttribute('src', BRAND_ASSETS.symbol)
  expect(screen.getByRole('link', { name: 'White horizontal PNG' })).toHaveAttribute('href', BRAND_ASSETS.logoLight)
})

it('demonstrates the product update lifecycle without leaking changes into marketing', () => {
  const { container } = render(<BrandColorRules />)
  expect(container.querySelector('[data-zc-surface]')).toHaveAttribute('data-zc-surface', 'marketing')
  fireEvent.click(screen.getByRole('button', { name: 'Product interface' }))
  expect(screen.getByText('Update available')).toBeInTheDocument()
  fireEvent.change(screen.getByLabelText('Work email'), { target: { value: 'team@zoowork.ai' } })
  fireEvent.click(screen.getByRole('button', { name: 'Update agent' }))
  expect(screen.queryByText('Update available')).not.toBeInTheDocument()
  expect(screen.getByRole('status')).toHaveTextContent('Update complete')
  fireEvent.click(screen.getByRole('button', { name: 'Reset example' }))
  expect(screen.getByLabelText('Work email')).toHaveValue('')
  expect(screen.getByText('Update available')).toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: 'Website expression' }))
  expect(screen.queryByLabelText('Work email')).not.toBeInTheDocument()
})

it('keeps bilingual edits independent and applies the chosen Chinese display weight and size', () => {
  const { container } = render(
    <PreviewLocaleProvider initialLocale="en">
      <SpecimenHarness />
    </PreviewLocaleProvider>,
  )
  expect(screen.getByLabelText('Chinese display weight')).toBeDisabled()
  fireEvent.change(screen.getByLabelText('Display text'), { target: { value: 'Your next idea' } })
  fireEvent.click(screen.getByRole('button', { name: '中文' }))
  fireEvent.change(screen.getByLabelText('展示文字'), { target: { value: '让专业成为可能' } })
  fireEvent.change(screen.getByLabelText('中文展示字重'), { target: { value: '500' } })
  fireEvent.change(screen.getByRole('slider'), { target: { value: '64' } })
  const specimen = container.querySelector<HTMLElement>('.bv-type-specimen')!
  expect(specimen).toHaveAttribute('lang', 'zh')
  expect(specimen).toHaveTextContent('让专业成为可能')
  expect(specimen.style.fontWeight).toBe('500')
  expect(specimen.style.getPropertyValue('--specimen-size')).toBe('64px')
  fireEvent.click(screen.getByRole('button', { name: 'English' }))
  expect(specimen).toHaveTextContent('Your next idea')
  expect(specimen.style.fontWeight).toBe('400')
})

function SpecimenHarness() {
  const { setLocale } = usePreviewLocale()
  return (
    <>
      <button onClick={() => setLocale('en')}>English</button>
      <button onClick={() => setLocale('zh')}>中文</button>
      <BrandTypography />
    </>
  )
}
