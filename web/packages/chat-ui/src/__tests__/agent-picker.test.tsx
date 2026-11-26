import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { AgentPicker, type AgentPickerOption } from '../composer/AgentPicker'

const options: AgentPickerOption[] = [
  {
    id: 'main',
    displayName: 'Assistant',
    description: 'Anything You Need',
    avatar: <span data-testid="main-avatar">🤖</span>,
  },
  {
    id: 'atlas',
    displayName: 'PPT Master',
    description: 'Presentation Architect',
    avatar: <span data-testid="atlas-avatar">🦊</span>,
  },
]

function openPicker() {
  fireEvent.keyDown(screen.getByTestId('agent-picker-trigger'), { key: 'ArrowDown', code: 'ArrowDown' })
}

describe('AgentPicker', () => {
  it('renders the selected trigger and exact menu rows', async () => {
    render(
      <AgentPicker
        options={options}
        selectedId="atlas"
        side="top"
        onSelect={() => {}}
        onHireMore={() => {}}
      />,
    )

    const trigger = screen.getByTestId('agent-picker-trigger')
    expect(trigger).toHaveTextContent('PPT Master')
    expect(trigger).toHaveClass('h-8')
    expect(trigger).toHaveClass('gap-1.5')
    expect(trigger).toHaveClass('rounded-md')
    expect(trigger).toHaveClass('border-0')
    expect(trigger).toHaveClass('px-2')
    expect(trigger).toHaveClass('text-sm')
    expect(trigger).toHaveClass('font-medium')
    expect(trigger).toHaveClass('focus-visible:bg-accent')
    expect(trigger).toHaveClass('focus-visible:ring-0')
    expect(screen.getByTestId('atlas-avatar')).toBeInTheDocument()
    openPicker()

    const menu = await screen.findByTestId('agent-picker-menu')
    expect(menu).toHaveAttribute('data-side', 'top')
    expect(menu).toHaveAttribute('data-composer-menu-surface', 'true')
    expect(menu).toHaveClass('w-[213px]')
    expect(menu).toHaveClass('rounded-[8px]')
    expect(menu).toHaveClass('border-0')
    expect(menu).toHaveClass('p-1')
    expect(screen.getByTestId('agent-picker-option-main')).toHaveTextContent('Anything You Need')
    expect(screen.getByTestId('agent-picker-option-atlas')).toHaveTextContent('Presentation Architect')
  })

  it('caps long inventories within the available viewport and scrolls the menu', async () => {
    const manyOptions: AgentPickerOption[] = Array.from({ length: 12 }, (_, index) => ({
      id: `agent-${index + 1}`,
      displayName: `Agent ${index + 1}`,
      description: `Specialist ${index + 1}`,
      avatar: <span aria-hidden="true">🤖</span>,
    }))
    render(
      <AgentPicker
        options={manyOptions}
        selectedId="agent-1"
        onSelect={() => {}}
        onHireMore={() => {}}
      />,
    )

    openPicker()

    const menu = await screen.findByTestId('agent-picker-menu')
    expect(menu).toHaveClass('max-h-[min(20.5rem,var(--radix-dropdown-menu-content-available-height))]')
    expect(menu).toHaveClass('overflow-y-auto')
    expect(menu).toHaveClass('overscroll-contain')
    expect(menu).not.toHaveClass('overflow-hidden')
    expect(screen.getByTestId('agent-picker-option-agent-12')).toBeInTheDocument()
  })

  it('can render a Hire Agent action trigger while preserving the selected menu row', async () => {
    render(
      <AgentPicker
        options={options}
        selectedId="atlas"
        triggerLabel="Hire Agent"
        onSelect={() => {}}
        onHireMore={() => {}}
      />,
    )

    expect(screen.getByTestId('agent-picker-trigger')).toHaveTextContent('Hire Agent')
    expect(screen.queryByTestId('atlas-avatar')).not.toBeInTheDocument()

    openPicker()
    expect(await screen.findByTestId('agent-picker-option-atlas')).toHaveAttribute('aria-checked', 'true')
  })

  it('marks the selected row and reports another selection', async () => {
    const onSelect = vi.fn()
    render(<AgentPicker options={options} selectedId="atlas" onSelect={onSelect} onHireMore={() => {}} />)
    openPicker()

    const selected = await screen.findByTestId('agent-picker-option-atlas')
    expect(selected).toHaveAttribute('role', 'menuitemradio')
    expect(selected).toHaveAttribute('aria-checked', 'true')
    expect(selected.querySelector('[data-slot="agent-picker-check"]')).toBeInTheDocument()

    fireEvent.click(screen.getByTestId('agent-picker-option-main'))
    expect(onSelect).toHaveBeenCalledWith('main')
  })

  it('uses the first option consistently when selectedId is stale', async () => {
    render(<AgentPicker options={options} selectedId="removed" onSelect={() => {}} onHireMore={() => {}} />)

    expect(screen.getByTestId('agent-picker-trigger')).toHaveTextContent('Assistant')
    openPicker()

    expect(await screen.findByTestId('agent-picker-option-main')).toHaveAttribute('aria-checked', 'true')
  })

  it('reports Hire more from the final row', async () => {
    const onHireMore = vi.fn()
    render(<AgentPicker options={options} selectedId="main" onSelect={() => {}} onHireMore={onHireMore} />)
    openPicker()

    fireEvent.click(await screen.findByTestId('agent-picker-hire-more'))
    expect(onHireMore).toHaveBeenCalledOnce()
  })

  it('omits the hire footer when no action is provided and still allows Agent selection', async () => {
    const onSelect = vi.fn()
    render(<AgentPicker options={options} selectedId="main" onSelect={onSelect} />)
    openPicker()
    fireEvent.click(await screen.findByTestId('agent-picker-option-atlas'))
    expect(onSelect).toHaveBeenCalledWith('atlas')
    openPicker()
    await screen.findByTestId('agent-picker-option-main')
    expect(screen.queryByTestId('agent-picker-hire-more')).not.toBeInTheDocument()
  })

  it('suppresses the switch tooltip while the menu is open', async () => {
    render(<AgentPicker options={options} selectedId="main" onSelect={() => {}} onHireMore={() => {}} />)
    const trigger = screen.getByTestId('agent-picker-trigger')

    fireEvent.focus(trigger)
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()

    fireEvent.pointerMove(trigger)
    expect(await screen.findByRole('tooltip')).toHaveTextContent('Switch Agent')

    fireEvent.keyDown(trigger, { key: 'ArrowDown', code: 'ArrowDown' })
    expect(await screen.findByTestId('agent-picker-menu')).toBeInTheDocument()
    await waitFor(() => expect(screen.queryByRole('tooltip')).not.toBeInTheDocument())
  })

  it('disables the trigger while loading', () => {
    render(<AgentPicker options={options} selectedId="main" isLoading onSelect={() => {}} onHireMore={() => {}} />)

    expect(screen.getByTestId('agent-picker-trigger')).toBeDisabled()
  })

  it('renders a disabled switch-label trigger for an empty inventory', () => {
    render(
      <AgentPicker
        options={[]}
        switchLabel="Choose specialist"
        onSelect={() => {}}
        onHireMore={() => {}}
      />,
    )

    const trigger = screen.getByTestId('agent-picker-trigger')
    expect(trigger).toBeDisabled()
    expect(trigger).toHaveTextContent('Choose specialist')
  })

  it('renders a static identity without a trigger or menu when read only', () => {
    render(
      <AgentPicker
        options={options}
        selectedId="atlas"
        readOnly
        onSelect={() => {}}
        onHireMore={() => {}}
      />,
    )

    expect(screen.getByTestId('agent-picker-static')).toHaveTextContent('PPT Master')
    expect(screen.getByTestId('atlas-avatar')).toBeInTheDocument()
    expect(screen.queryByTestId('agent-picker-trigger')).not.toBeInTheDocument()
    expect(screen.queryByTestId('agent-picker-menu')).not.toBeInTheDocument()
  })
})
