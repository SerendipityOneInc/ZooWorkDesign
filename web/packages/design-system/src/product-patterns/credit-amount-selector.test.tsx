import { fireEvent, render, screen } from '@testing-library/react'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'

import { CreditAmountSelector, type CreditAmountSelectorProps } from './credit-amount-selector'

const props: CreditAmountSelectorProps = {
  value: '20', onValueChange: () => {}, label: 'Enter amount', presetsLabel: 'Credit amount',
  currencySymbol: '$', currencyCode: 'USD',
  presets: [{ value: '5', label: '$5' }, { value: '20', label: '$20' }],
  hint: '$5 minimum',
}

function ControlledSelector() {
  const [value, setValue] = useState('20')
  return <CreditAmountSelector {...props} value={value} onValueChange={setValue} />
}

describe('CreditAmountSelector', () => {
  it('preserves raw decimal input and lets a preset restore a valid choice', () => {
    render(<ControlledSelector />)
    const input = screen.getByRole('textbox', { name: 'Enter amount' })
    fireEvent.change(input, { target: { value: '5.' } })
    expect(input).toHaveValue('5.')
    expect(screen.queryAllByRole('radio', { checked: true })).toHaveLength(0)
    fireEvent.click(screen.getByRole('radio', { name: '$5' }))
    expect(input).toHaveValue('5')
    expect(screen.getByRole('radio', { name: '$5' })).toBeChecked()
    fireEvent.click(screen.getByRole('radio', { name: '$5' }))
    expect(input).toHaveValue('5')
  })

  it('allows host normalization without reformatting input or emitting a change', () => {
    const onValueChange = vi.fn()
    render(<CreditAmountSelector {...props} value="20.00" selectedPresetValue="20" onValueChange={onValueChange} />)
    expect(screen.getByRole('textbox')).toHaveValue('20.00')
    expect(screen.getByRole('radio', { name: '$20' })).toBeChecked()
    expect(onValueChange).not.toHaveBeenCalled()
  })

  it('associates host errors and limits with the input and removes stale errors', () => {
    const { rerender } = render(<CreditAmountSelector {...props} error="Minimum amount is $5." />)
    expect(screen.getByRole('textbox')).toHaveAccessibleDescription('$5 minimum Minimum amount is $5.')
    expect(screen.getByRole('textbox')).toBeInvalid()
    expect(screen.getByRole('alert')).toHaveTextContent('Minimum amount is $5.')
    rerender(<CreditAmountSelector {...props} />)
    expect(screen.getByRole('textbox')).toHaveAccessibleDescription('$5 minimum')
    expect(screen.getByRole('textbox')).not.toBeInvalid()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('locks both input and presets while the host is submitting', () => {
    const onValueChange = vi.fn()
    render(<CreditAmountSelector {...props} disabled onValueChange={onValueChange} />)
    expect(screen.getByRole('textbox')).toBeDisabled()
    for (const preset of screen.getAllByRole('radio')) {
      expect(preset).toBeDisabled()
      fireEvent.click(preset)
    }
    expect(onValueChange).not.toHaveBeenCalled()
  })
})
