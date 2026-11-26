// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { QuickActionCards } from '../cards'

afterEach(cleanup)

const items = [
  { id: 'u1', title: 'Draft outreach email', description: 'Sales helper' },
  { id: 'u2', title: 'Summarize reviews', description: 'Research helper', icon: <i data-testid="custom-icon" /> },
]

describe('QuickActionCards', () => {
  it('renders nothing for empty items', () => {
    const { container } = render(<QuickActionCards items={[]} onActionClick={vi.fn()} />)
    expect(container.firstChild).toBeNull()
  })

  it('renders one button per item with title and description', () => {
    render(<QuickActionCards items={items} onActionClick={vi.fn()} />)
    expect(screen.getByText('Draft outreach email')).not.toBeNull()
    expect(screen.getByText('Research helper')).not.toBeNull()
    expect(screen.getByTestId('custom-icon')).not.toBeNull()
  })

  it('fires onActionClick with the item title', () => {
    const onActionClick = vi.fn()
    render(<QuickActionCards items={items} onActionClick={onActionClick} />)
    fireEvent.click(screen.getByText('Draft outreach email'))
    expect(onActionClick).toHaveBeenCalledWith('Draft outreach email')
  })
})
