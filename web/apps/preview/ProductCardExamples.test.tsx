import { fireEvent, render, screen, within } from '@testing-library/react'
import { expect, it } from 'vitest'
import { ProductCardExamples } from './ProductCardExamples'

it('requires confirmation to disconnect a channel and updates only the local card', () => {
  render(<ProductCardExamples />)
  const card = within(screen.getByRole('group', { name: 'Telegram (@zoowork_demo_bot)' }))
  fireEvent.click(card.getByRole('button', { name: 'Disconnect' }))
  fireEvent.click(within(screen.getByRole('alertdialog')).getByRole('button', { name: 'Cancel' }))
  expect(card.getByText('Connected')).toBeInTheDocument()
  fireEvent.click(card.getByRole('button', { name: 'Disconnect' }))
  fireEvent.click(within(screen.getByRole('alertdialog')).getByRole('button', { name: 'Disconnect' }))
  expect(card.getByText('Disconnected')).toBeInTheDocument()
  expect(within(screen.getByRole('group', { name: 'Discord (ZooWork Demo)' })).getByText('Error')).toBeInTheDocument()
  fireEvent.click(card.getByRole('button', { name: 'Connect' }))
  expect(card.getByText('Connected')).toBeInTheDocument()
})
