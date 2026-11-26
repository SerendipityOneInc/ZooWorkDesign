import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { ModelPicker, type ModelPickerOption } from '../composer/ModelPicker'

const options: ModelPickerOption[] = [
  {
    id: 'claude-sonnet-4-6',
    label: 'Claude Sonnet 4.6',
    description: 'Balanced speed and reasoning for everyday work.',
    multiplier: '2.5x',
    default: true,
    providerIcon: 'claude',
  },
  {
    id: 'claude-sonnet-5',
    label: 'Claude Sonnet 5',
    description: 'Fast, capable reasoning for complex everyday work.',
    multiplier: '1.5x',
    providerIcon: 'claude',
  },
]

function openPicker() {
  fireEvent.keyDown(screen.getByTestId('model-picker-trigger'), { key: 'ArrowDown', code: 'ArrowDown' })
}

describe('ModelPicker', () => {
  it('enters settings only after a successful model save and returns focus to the selected model', async () => {
    let finish!: (saved: boolean) => void
    const change = vi.fn(() => new Promise<boolean>(resolve => { finish = resolve }))
    render(<ModelPicker options={options} value={options[0].id} onValueChange={change}
      triggerDetail="High" modelSettings={{ triggerLabel: 'Select model', available: () => true,
        render: (model, back) => <button onClick={back}>Back from {model.label}</button> }} />)
    openPicker()
    fireEvent.click(await screen.findByTestId(`model-picker-option-${options[0].id}`))
    await waitFor(() => expect(change).toHaveBeenCalledOnce())
    expect(screen.queryByRole('button', { name: /Back from/ })).not.toBeInTheDocument()
    finish(true)
    fireEvent.click(await screen.findByRole('button', { name: 'Back from Claude Sonnet 4.6' }))
    const selected = await screen.findByTestId(`model-picker-option-${options[0].id}`)
    await waitFor(() => expect(selected).toHaveFocus())
    expect(screen.getByTestId('model-picker-trigger')).toHaveTextContent('Claude Sonnet 4.6High')
  })

  it.each(['false', 'reject'])('keeps the model list when saving returns %s', async result => {
    const change = result === 'false' ? vi.fn().mockResolvedValue(false) : vi.fn().mockRejectedValue(new Error('offline'))
    render(<ModelPicker options={options} value={options[0].id} onValueChange={change}
      modelSettings={{ available: () => true, render: () => <div>Effort settings</div> }} />)
    openPicker()
    fireEvent.click(await screen.findByTestId(`model-picker-option-${options[1].id}`))
    await waitFor(() => expect(change).toHaveBeenCalledOnce())
    await waitFor(() => expect(screen.getByTestId(`model-picker-option-${options[1].id}`)).not.toHaveAttribute('aria-disabled', 'true'))
    expect(screen.queryByText('Effort settings')).not.toBeInTheDocument()
  })

  it('does not reopen an obsolete settings panel when a pending selection finishes after Escape', async () => {
    let finish!: (saved: boolean) => void
    const change = vi.fn(() => new Promise<boolean>(resolve => { finish = resolve }))
    render(<ModelPicker options={options} value={options[0].id} onValueChange={change}
      modelSettings={{ available: () => true, render: () => <div>Effort settings</div> }} />)
    openPicker()
    fireEvent.click(await screen.findByTestId(`model-picker-option-${options[1].id}`))
    await waitFor(() => expect(change).toHaveBeenCalledOnce())
    fireEvent.keyDown(screen.getByRole('menu'), { key: 'Escape' })
    await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument())
    finish(true)
    openPicker()
    expect(await screen.findByTestId(`model-picker-option-${options[0].id}`)).toBeVisible()
    expect(screen.queryByText('Effort settings')).not.toBeInTheDocument()
  })

  it('shows the selected default badge when enabled and updates it with the selection', () => {
    const { rerender } = render(<ModelPicker options={options} value="claude-sonnet-4-6" showDefaultBadge />)
    expect(screen.getByTestId('model-picker-trigger')).toHaveTextContent('Claude Sonnet 4.6')
    expect(screen.getByTestId('model-picker-trigger')).toHaveTextContent('Default')

    rerender(<ModelPicker options={options} value="claude-sonnet-5" showDefaultBadge />)
    expect(screen.getByTestId('model-picker-trigger')).toHaveTextContent('Claude Sonnet 5')
    expect(screen.getByTestId('model-picker-trigger')).not.toHaveTextContent('Default')

    rerender(<ModelPicker options={options} value="claude-sonnet-4-6" showDefaultBadge error="Could not load models" />)
    expect(screen.getByTestId('model-picker-trigger')).toHaveTextContent('Models unavailable')
    expect(screen.getByTestId('model-picker-trigger')).not.toHaveTextContent('Default')
  })

  it('keeps the trigger badge hidden unless enabled', () => {
    render(<ModelPicker options={options} value="claude-sonnet-4-6" />)

    expect(screen.getByTestId('model-picker-trigger')).toHaveTextContent('Claude Sonnet 4.6')
    expect(screen.getByTestId('model-picker-trigger')).not.toHaveTextContent('Default')
  })

  it('renders known providers locally and uses a fixed icon for unknown providers', async () => {
    const mixedOptions: ModelPickerOption[] = [
      ...options,
      { id: 'private-model', label: 'Private Model', description: 'Custom model.' },
    ]
    render(<ModelPicker options={mixedOptions} value="claude-sonnet-4-6" />)

    expect(screen.getByTestId('model-picker-trigger').querySelector('[data-model-provider-icon="claude"]')).toBeTruthy()

    openPicker()
    const privateModel = await screen.findByTestId('model-picker-option-private-model')
    expect(privateModel.querySelector('[data-model-provider-icon="unknown"]')).toBeTruthy()
    expect(privateModel.querySelector('img')).toBeNull()
  })

  it('keeps the expired selection visible with a notice while refusing selection', async () => {
    const change = vi.fn()
    render(
      <ModelPicker
        options={[{ ...options[0]!, selectable: false, statusLabel: 'No longer selectable' }, options[1]!]}
        value={options[0]!.id}
        onValueChange={change}
      />,
    )
    openPicker()
    const expired = await screen.findByTestId('model-picker-option-claude-sonnet-4-6')
    expect(expired).toHaveAttribute('aria-checked', 'true')
    expect(expired).toHaveAttribute('aria-disabled', 'true')
    expect(screen.getByText('No longer selectable')).toBeVisible()
    fireEvent.click(expired)
    expect(change).not.toHaveBeenCalled()
  })

  it('uses the PR trigger dimensions without a visible border', () => {
    render(<ModelPicker options={options} value="claude-sonnet-4-6" />)

    const trigger = screen.getByTestId('model-picker-trigger')
    expect(trigger).toHaveClass('h-8')
    expect(trigger).toHaveClass('gap-[7px]')
    expect(trigger).toHaveClass('rounded-[8px]')
    expect(trigger).toHaveClass('border-0')
    expect(trigger).toHaveClass('px-2.5')
    expect(trigger).toHaveClass('text-xs')
    expect(trigger).toHaveClass('font-medium')
    expect(trigger).toHaveClass('focus-visible:ring-0')
    expect(trigger).toHaveClass('hover:bg-[var(--model-picker-hover,#f4f4f5)]')
    expect(trigger).toHaveClass('dark:hover:bg-[var(--model-picker-hover,var(--zc-line))]')
  })

  it('opens the exact PR menu without a hard-coded highlighted row', async () => {
    render(<ModelPicker options={options} value="claude-sonnet-4-6" />)

    openPicker()

    const menu = await screen.findByTestId('model-picker-menu')
    expect(menu).toHaveClass('w-[276px]')
    expect(menu).toHaveClass('border-0')
    expect(menu).toHaveClass('rounded-[8px]')
    expect(menu).toHaveClass('bg-[var(--model-picker-panel,#ffffff)]')
    expect(menu).toHaveClass('dark:bg-[var(--model-picker-panel,var(--zc-wash))]')

    const idleRow = screen.getByTestId('model-picker-option-claude-sonnet-5')
    expect(idleRow).not.toHaveAttribute('data-highlighted', 'true')
    expect(idleRow).not.toHaveAttribute('aria-haspopup')
    expect(idleRow).not.toHaveAttribute('aria-expanded')
    expect(idleRow).not.toHaveAttribute('aria-controls')
    expect(idleRow).toHaveClass('min-h-8')
    expect(idleRow).toHaveClass('rounded-[4px]')
    expect(idleRow).toHaveClass('px-2.5')
    expect(idleRow).toHaveClass('py-1.5')
  })

  it('keeps search outside the scrolling model inventory while expanded models remain reachable', async () => {
    const manyOptions: ModelPickerOption[] = Array.from({ length: 11 }, (_, index) => ({
      id: `model-${index + 1}`,
      label: `Model ${index + 1}`,
      description: `Description ${index + 1}`,
    }))
    render(<ModelPicker options={manyOptions} value="model-1" />)

    openPicker()

    const menu = await screen.findByTestId('model-picker-menu')
    expect(menu).toHaveClass('max-h-[min(20.5rem,var(--radix-dropdown-menu-content-available-height))]')
    expect(menu).not.toHaveClass('overflow-visible')
    const search = screen.getByRole('textbox', { name: 'Search models…' })
    const viewport = menu.querySelector('[data-slot="scroll-area-viewport"]')
    expect(viewport).toBeInTheDocument()
    expect(menu).toContainElement(search)
    expect(viewport).not.toContainElement(search)
    expect(viewport).toContainElement(screen.getByTestId('model-picker-option-model-1'))
    const toggle = screen.getByTestId('model-picker-more-toggle')
    expect(viewport).not.toContainElement(toggle)
    // Rows beyond the eight-model primary list stay reachable with Show more.
    fireEvent.click(toggle)
    expect(viewport).toContainElement(screen.getByTestId('model-picker-option-model-11'))
  })

  it('switches the single detail panel to the pointer-hovered row', async () => {
    render(<ModelPicker options={options} value="claude-sonnet-4-6" />)
    openPicker()

    const secondRow = await screen.findByTestId('model-picker-option-claude-sonnet-5')
    fireEvent.pointerEnter(secondRow)

    const detail = await screen.findByTestId('model-picker-details')
    expect(detail).toHaveClass('w-[213px]')
    expect(detail).toHaveClass('rounded-[8px]')
    expect(detail).toHaveAttribute('role', 'note')
    expect(detail).toHaveAttribute('data-surface', 'composer')
    expect(detail).toHaveAttribute('data-side', 'right')
    expect(detail).toHaveAttribute('data-align', 'start')
    expect(secondRow).toHaveAttribute('aria-describedby', detail.id)
    expect(secondRow).not.toHaveAttribute('aria-haspopup')
    expect(secondRow).not.toHaveAttribute('aria-expanded')
    expect(detail.querySelector('[role="tooltip"]')).not.toBeInTheDocument()
    expect(detail.querySelector('[data-slot="tooltip-arrow"]')).not.toBeInTheDocument()
    expect(detail).toHaveTextContent('Claude Sonnet 5')
    expect(detail).toHaveTextContent('Fast, capable reasoning for complex everyday work.')
    expect(detail).toHaveTextContent('Token consumption rate')
    expect(detail.querySelector('[data-slot="dropdown-menu-model-detail-footer"]')).toHaveClass(
      'border-[var(--model-picker-border,#e4e4e7)]',
    )
    expect(screen.getAllByTestId('model-picker-details')).toHaveLength(1)

    fireEvent.keyDown(screen.getByTestId('model-picker-menu'), { key: 'Escape', code: 'Escape' })
    await waitFor(() => expect(screen.queryByTestId('model-picker-details')).not.toBeInTheDocument())
  })

  it('keeps details open while the pointer moves from the row into the side panel', async () => {
    render(<ModelPicker options={options} value="claude-sonnet-4-6" />)
    openPicker()

    const secondRow = await screen.findByTestId('model-picker-option-claude-sonnet-5')
    fireEvent.pointerEnter(secondRow, { pointerType: 'mouse' })
    const detail = await screen.findByTestId('model-picker-details')

    fireEvent.pointerLeave(secondRow, { pointerType: 'mouse' })
    fireEvent.pointerEnter(detail, { pointerType: 'mouse' })

    await new Promise((resolve) => setTimeout(resolve, 350))
    expect(screen.getByTestId('model-picker-details')).toHaveTextContent('Claude Sonnet 5')
  })

  it('shows and hides the matching detail panel on keyboard focus', async () => {
    render(<ModelPicker options={options} value="claude-sonnet-4-6" />)
    openPicker()

    const secondRow = await screen.findByTestId('model-picker-option-claude-sonnet-5')
    fireEvent.focus(secondRow)
    expect(await screen.findByTestId('model-picker-details')).toHaveTextContent('Claude Sonnet 5')

    fireEvent.blur(secondRow)
    await waitFor(() => expect(screen.queryByTestId('model-picker-details')).not.toBeInTheDocument())
  })

  it('clears the submenu detail when the root menu closes', async () => {
    render(<ModelPicker options={options} value="claude-sonnet-4-6" />)
    openPicker()

    const secondRow = await screen.findByTestId('model-picker-option-claude-sonnet-5')
    fireEvent.pointerEnter(secondRow)
    expect(await screen.findByTestId('model-picker-details')).toHaveTextContent('Claude Sonnet 5')

    fireEvent.keyDown(screen.getByTestId('model-picker-menu'), { key: 'Escape', code: 'Escape' })
    await waitFor(() => expect(screen.queryByTestId('model-picker-details')).not.toBeInTheDocument())
  })

  it('reports selection through the same menuitemradio interaction', async () => {
    const onValueChange = vi.fn()
    render(<ModelPicker options={options} value="claude-sonnet-4-6" onValueChange={onValueChange} />)
    openPicker()

    const secondRow = await screen.findByTestId('model-picker-option-claude-sonnet-5')
    expect(secondRow).toHaveAttribute('role', 'menuitemradio')
    expect(secondRow).toHaveAttribute('aria-checked', 'false')
    fireEvent.click(secondRow)

    expect(onValueChange).toHaveBeenCalledWith('claude-sonnet-5')
  })

  it('allows browsing without changing models when selection is unavailable', async () => {
    render(<ModelPicker options={options} value="claude-sonnet-4-6" />)
    openPicker()

    const secondRow = await screen.findByTestId('model-picker-option-claude-sonnet-5')
    expect(secondRow).toHaveAttribute('aria-disabled', 'true')
    fireEvent.pointerEnter(secondRow)
    expect(await screen.findByTestId('model-picker-details')).toHaveTextContent('Claude Sonnet 5')

    fireEvent.click(secondRow)
    expect(screen.getByTestId('model-picker-menu')).toBeInTheDocument()
  })

  it('keeps an individually locked model browseable in a partially selectable catalog', async () => {
    const onValueChange = vi.fn()
    render(
      <ModelPicker
        options={[{ ...options[0], selectable: false }, options[1]]}
        value="claude-sonnet-4-6"
        onValueChange={onValueChange}
      />,
    )
    openPicker()

    const locked = await screen.findByTestId('model-picker-option-claude-sonnet-4-6')
    expect(locked).toHaveAttribute('aria-disabled', 'true')
    fireEvent.click(locked)
    expect(onValueChange).not.toHaveBeenCalled()
    expect(screen.getByTestId('model-picker-menu')).toBeInTheDocument()

    fireEvent.click(screen.getByTestId('model-picker-option-claude-sonnet-5'))
    expect(onValueChange).toHaveBeenCalledWith('claude-sonnet-5')
  })

  it.each(['Enter', ' '])('selects the focused model with the %s key', async (key) => {
    const onValueChange = vi.fn()
    render(<ModelPicker options={options} value="claude-sonnet-4-6" onValueChange={onValueChange} />)
    openPicker()

    const secondRow = await screen.findByTestId('model-picker-option-claude-sonnet-5')
    fireEvent.focus(secondRow)
    fireEvent.keyDown(secondRow, { key, code: key === ' ' ? 'Space' : 'Enter' })

    expect(onValueChange).toHaveBeenCalledWith('claude-sonnet-5')
    await waitFor(() => expect(screen.queryByTestId('model-picker-menu')).not.toBeInTheDocument())
  })

  it('does not falsely select the first row when the current value is stale', async () => {
    render(<ModelPicker options={options} value="removed-model" />)

    expect(screen.getByTestId('model-picker-trigger')).toHaveTextContent('Select model')
    openPicker()

    const firstRow = await screen.findByTestId('model-picker-option-claude-sonnet-4-6')
    expect(firstRow).toHaveAttribute('aria-checked', 'false')
    expect(firstRow.querySelector('[data-slot="dropdown-menu-model-check"]')).not.toBeInTheDocument()
  })

  it('displays the saved model separately from selectable catalog options', async () => {
    const onValueChange = vi.fn()
    render(
      <ModelPicker
        options={options}
        value="saved-model"
        currentModel={{ id: 'saved-model', label: 'Saved Model', description: 'Current model' }}
        onValueChange={onValueChange}
      />,
    )

    expect(screen.getByTestId('model-picker-trigger')).toHaveTextContent('Saved Model')
    openPicker()
    const firstRow = await screen.findByTestId('model-picker-option-claude-sonnet-4-6')
    expect(firstRow).toHaveAttribute('aria-checked', 'false')
    expect(screen.queryByTestId('model-picker-option-saved-model')).not.toBeInTheDocument()
    fireEvent.click(firstRow)
    expect(onValueChange).toHaveBeenCalledWith('claude-sonnet-4-6')
  })

  it('surfaces the read-only reason when the value resolves to no option', () => {
    // A surface wired without a model source can never resolve a value; "Select model"
    // would invite a choice that silently does nothing.
    render(<ModelPicker options={options} value="" readOnlyReason="Current model is unavailable." />)

    expect(screen.getByTestId('model-picker-trigger')).toHaveTextContent('Current model is unavailable.')
  })

  it('still prompts to select a model when nothing is selected and no reason is given', () => {
    render(<ModelPicker options={options} value="" />)

    expect(screen.getByTestId('model-picker-trigger')).toHaveTextContent('Select model')
  })

  it('keeps the empty-inventory label even when a read-only reason is set', () => {
    render(<ModelPicker options={[]} value="" readOnlyReason="Current model is unavailable." />)

    expect(screen.getByTestId('model-picker-trigger')).toHaveTextContent('No models available')
  })

  it('matches the PR loading and saving trigger states', () => {
    const { rerender } = render(<ModelPicker options={options} value="claude-sonnet-4-6" saving />)

    expect(screen.getByTestId('model-picker-trigger')).toBeDisabled()
    expect(screen.getByTestId('model-picker-trigger').querySelector('[data-slot="spinner"]')).toBeInTheDocument()

    rerender(<ModelPicker options={[]} value="" loading />)
    expect(screen.getByTestId('model-picker-trigger')).toBeDisabled()
    expect(screen.getByTestId('model-picker-trigger')).toHaveTextContent('Loading models…')
  })

  it('matches the PR retryable error state', async () => {
    const onRetry = vi.fn()
    render(<ModelPicker options={[]} value="" error="Could not load models" onRetry={onRetry} />)

    const trigger = screen.getByTestId('model-picker-trigger')
    expect(trigger).not.toBeDisabled()
    expect(trigger).toHaveTextContent('Models unavailable')
    openPicker()

    expect(await screen.findByRole('alert')).toHaveTextContent('Could not load models')
    fireEvent.click(screen.getByRole('menuitem', { name: 'Retry' }))
    expect(onRetry).toHaveBeenCalledOnce()
  })

  it('keeps managed models browseable while explaining that selection is locked', async () => {
    render(<ModelPicker options={options} value="claude-sonnet-4-6" managed />)

    expect(screen.getByTestId('model-picker-trigger')).not.toBeDisabled()
    openPicker()
    expect(await screen.findByTestId('model-picker-option-claude-sonnet-5')).toHaveAttribute('aria-disabled', 'true')

    fireEvent.keyDown(screen.getByTestId('model-picker-menu'), { key: 'Escape', code: 'Escape' })
    const wrapper = screen.getByTestId('model-picker-managed-trigger')
    expect(wrapper).toHaveAttribute('tabindex', '0')
    fireEvent.focus(wrapper)
    expect(await screen.findByRole('tooltip')).toHaveTextContent('This Specialist manages its model.')
  })
})
