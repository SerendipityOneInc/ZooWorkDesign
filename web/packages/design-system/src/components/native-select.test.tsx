import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { NativeSelect, NativeSelectOptGroup, NativeSelectOption } from './native-select'

describe('NativeSelect', () => {
  it('renders wrapper with data-slot="native-select-wrapper"', () => {
    render(
      <NativeSelect aria-label="Choose city">
        <NativeSelectOption value="beijing">Beijing</NativeSelectOption>
      </NativeSelect>,
    )
    const wrapper = screen.getByRole('combobox', { name: 'Choose city' }).parentElement
    expect(wrapper).toHaveAttribute('data-slot', 'native-select-wrapper')
  })

  it('renders select with data-slot="native-select"', () => {
    render(
      <NativeSelect aria-label="Choose city">
        <NativeSelectOption value="shanghai">Shanghai</NativeSelectOption>
      </NativeSelect>,
    )
    const select = screen.getByRole('combobox', { name: 'Choose city' })
    expect(select).toHaveAttribute('data-slot', 'native-select')
    expect(select).toHaveClass(
      'cursor-pointer',
      'border-input',
      'bg-control-background',
      'hover:bg-hover',
      'focus-visible:ring-2',
      'focus-visible:ring-ring/25',
      'dark:[color-scheme:dark]',
    )
    expect(select).not.toHaveClass('focus-visible:ring-3')
  })

  it('renders the chevron icon with data-slot="native-select-icon"', () => {
    const { container } = render(
      <NativeSelect aria-label="Currency">
        <NativeSelectOption value="cny">CNY</NativeSelectOption>
      </NativeSelect>,
    )
    expect(container.querySelector('[data-slot="native-select-icon"]')).toBeInTheDocument()
  })

  it('renders sm size variant', () => {
    render(
      <NativeSelect aria-label="Size" size="sm">
        <NativeSelectOption value="xs">Small</NativeSelectOption>
      </NativeSelect>,
    )
    expect(screen.getByRole('combobox', { name: 'Size' })).toHaveAttribute('data-size', 'sm')
  })

  it('renders NativeSelectOption with data-slot="native-select-option"', () => {
    const { container } = render(
      <NativeSelect aria-label="Color">
        <NativeSelectOption value="red">Red</NativeSelectOption>
      </NativeSelect>,
    )
    const option = container.querySelector('[data-slot="native-select-option"]')
    expect(option).toBeInTheDocument()
    expect(option).toHaveClass(
      'bg-popover',
      'text-popover-foreground',
      'checked:bg-hover',
      'checked:text-foreground',
    )
  })

  it('renders NativeSelectOptGroup with data-slot="native-select-optgroup"', () => {
    const { container } = render(
      <NativeSelect aria-label="Region">
        <NativeSelectOptGroup label="North">
          <NativeSelectOption value="bj">Beijing</NativeSelectOption>
        </NativeSelectOptGroup>
      </NativeSelect>,
    )
    expect(container.querySelector('[data-slot="native-select-optgroup"]')).toBeInTheDocument()
  })
})
