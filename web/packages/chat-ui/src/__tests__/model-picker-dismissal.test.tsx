import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { ModelPicker } from '../composer/ModelPicker'

const option = { id: 'reasoning', label: 'Reasoning model', description: 'Model details' }

describe('ModelPicker dismissal during its exit animation', () => {
  let animationStyles: HTMLStyleElement

  beforeEach(() => {
    animationStyles = document.createElement('style')
    animationStyles.textContent = `
      [data-testid="model-picker-menu"][data-state="open"] { animation-name: picker-enter; }
      [data-testid="model-picker-menu"][data-state="closed"] { animation-name: picker-exit; }
    `
    document.head.append(animationStyles)

    // Browsers return live computed styles. jsdom returns a snapshot, which would
    // otherwise make Radix remove the closing menu before the regression can occur.
    const computedStyle = window.getComputedStyle.bind(window)
    vi.spyOn(window, 'getComputedStyle').mockImplementation((element, pseudoElement) => {
      const styles = computedStyle(element, pseudoElement)
      if (element.getAttribute('data-testid') === 'model-picker-menu') {
        Object.defineProperty(styles, 'animationName', {
          get: () => computedStyle(element, pseudoElement).animationName,
        })
      }
      return styles
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
    animationStyles.remove()
  })

  function openPicker() {
    fireEvent.keyDown(screen.getByTestId('model-picker-trigger'), { key: 'ArrowDown', code: 'ArrowDown' })
  }

  it.each(['outside pointer', 'Escape'])('dismisses settings with %s without switching back to models', async method => {
    render(<ModelPicker options={[option]} value={option.id} onValueChange={async () => true}
      modelSettings={{ available: () => true, render: () => <div>Effort settings</div> }} />)
    openPicker()
    fireEvent.click(await screen.findByTestId('model-picker-option-reasoning'))
    await screen.findByText('Effort settings')
    await waitFor(() => expect(screen.queryByTestId('model-picker-option-reasoning')).not.toBeInTheDocument())
    const menu = screen.getByTestId('model-picker-menu')

    if (method === 'Escape') fireEvent.keyDown(menu, { key: 'Escape', code: 'Escape' })
    else fireEvent.pointerDown(document.body, { pointerType: 'mouse', button: 0 })

    // Assert while the *real* Radix menu is still mounted for exit, not after it
    // disappears: resetting the layer here previously refocused a model row.
    await waitFor(() => expect(menu).toHaveAttribute('data-state', 'closed'))
    expect(menu).toBeInTheDocument()
    expect(within(menu).getByText('Effort settings')).toBeInTheDocument()
    expect(within(menu).queryByTestId('model-picker-option-reasoning')).not.toBeInTheDocument()
    expect(screen.queryByTestId('model-picker-details')).not.toBeInTheDocument()

    openPicker()
    expect(await screen.findByTestId('model-picker-option-reasoning')).toBeVisible()
    await waitFor(() => expect(screen.queryByText('Effort settings')).not.toBeInTheDocument())
  })

  it('ignores row focus and hover after the model list starts closing', async () => {
    render(<ModelPicker options={[option]} value={option.id} onValueChange={async () => true} />)
    openPicker()
    const row = await screen.findByTestId('model-picker-option-reasoning')
    fireEvent.focus(row)
    expect(await screen.findByTestId('model-picker-details')).toBeVisible()

    const menu = screen.getByTestId('model-picker-menu')
    fireEvent.pointerDown(document.body, { pointerType: 'mouse', button: 0 })
    await waitFor(() => expect(menu).toHaveAttribute('data-state', 'closed'))
    fireEvent.focus(row)
    fireEvent.pointerEnter(row, { pointerType: 'mouse' })
    expect(screen.queryByTestId('model-picker-details')).not.toBeInTheDocument()
  })
})
