import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { RadioGroup, RadioGroupItem } from './radio-group'

describe('RadioGroup', () => {
  it('renders with data-slot="radio-group"', () => {
    render(
      <RadioGroup data-testid="rg">
        <RadioGroupItem value="a" aria-label="Option A" />
      </RadioGroup>,
    )
    expect(screen.getByTestId('rg')).toHaveAttribute('data-slot', 'radio-group')
  })

  it('renders RadioGroupItem with data-slot="radio-group-item" unchecked by default', () => {
    render(
      <RadioGroup>
        <RadioGroupItem value="a" aria-label="Option A" />
      </RadioGroup>,
    )
    const item = screen.getByRole('radio', { name: 'Option A' })
    expect(item).toHaveAttribute('data-slot', 'radio-group-item')
    expect(item).toHaveAttribute('data-state', 'unchecked')
  })

  it('fires onValueChange and sets checked state when item clicked', () => {
    const onValueChange = vi.fn()
    render(
      <RadioGroup onValueChange={onValueChange}>
        <RadioGroupItem value="cat" aria-label="Cat" />
        <RadioGroupItem value="dog" aria-label="Dog" />
      </RadioGroup>,
    )
    fireEvent.click(screen.getByRole('radio', { name: 'Dog' }))
    expect(onValueChange).toHaveBeenCalledWith('dog')
    expect(screen.getByRole('radio', { name: 'Dog' })).toHaveAttribute('data-state', 'checked')
  })
})
