import { fireEvent, render, screen, within } from '@testing-library/react'
import { useState } from 'react'
import { expect, it, vi } from 'vitest'
import { AppearanceSelector, type AppearanceValue } from './appearance-selector'

it('selects through the label and reports the controlled value', () => {
  const changed = vi.fn()
  function Example() {
    const [value, setValue] = useState<AppearanceValue>('system')
    return <AppearanceSelector value={value} onValueChange={next => { setValue(next); changed(next) }} />
  }
  render(<Example />)
  expect(screen.getByRole('radio', { name: 'Follow System' })).toBeChecked()
  fireEvent.click(screen.getByText('Dark'))
  expect(changed).toHaveBeenCalledExactlyOnceWith('dark')
  expect(screen.getByRole('radio', { name: 'Dark' })).toBeChecked()
  expect(screen.getByRole('radio', { name: 'Follow System' })).not.toBeChecked()
})

it('keeps native radio groups independent across multiple instances', () => {
  render(<><AppearanceSelector groupLabel="First" value="light" onValueChange={vi.fn()} />
    <AppearanceSelector groupLabel="Second" value="dark" onValueChange={vi.fn()} /></>)
  const first = within(screen.getByRole('group', { name: 'First' })).getAllByRole('radio')
  const second = within(screen.getByRole('group', { name: 'Second' })).getAllByRole('radio')
  expect(new Set(first.map(input => input.getAttribute('name'))).size).toBe(1)
  expect(first[0].getAttribute('name')).not.toBe(second[0].getAttribute('name'))
  expect(first[0]).toBeChecked()
  expect(second[1]).toBeChecked()
})

it('uses localized labels and disables every option without changing the value', () => {
  const changed = vi.fn()
  render(<AppearanceSelector groupLabel="外观" labels={{ light: '浅色', dark: '深色', system: '跟随系统' }} value="light" onValueChange={changed} disabled />)
  const group = screen.getByRole('group', { name: '外观' })
  for (const input of within(group).getAllByRole('radio')) expect(input).toBeDisabled()
  fireEvent.click(screen.getByText('深色'))
  expect(changed).not.toHaveBeenCalled()
  expect(screen.getByRole('radio', { name: '浅色' })).toBeChecked()
})
