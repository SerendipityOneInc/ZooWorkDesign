import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { ComposerEffortPanel, type ComposerEffortLevel } from '../composer/ComposerEffortPanel'

const model = { id: 'test-model', label: 'Test model', description: 'Test model capabilities' }
const levels: ComposerEffortLevel[] = ['low', 'medium', 'high', 'max']
let reducedMotion = false
beforeEach(() => {
  reducedMotion = false
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches: reducedMotion, media: query, onchange: null,
    addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {}, dispatchEvent: () => false,
  }))
})
afterEach(() => { cleanup(); vi.unstubAllGlobals() })

const base = { model, levels, value: 'medium' as const, onBack: vi.fn() }

describe('ComposerEffortPanel', () => {
  it('returns to models without submitting a host form', () => {
    const submit = vi.fn(event => event.preventDefault())
    render(<form onSubmit={submit}><ComposerEffortPanel {...base} onSave={vi.fn()} /></form>)
    fireEvent.click(screen.getByRole('button', { name: 'Select model' }))
    expect(submit).not.toHaveBeenCalled()
  })
  it('previews a pointer drag and saves once when the pointer is released', async () => {
    class TestPointerEvent extends MouseEvent {
      pointerId: number
      constructor(type: string, init: PointerEventInit = {}) { super(type, init); this.pointerId = init.pointerId ?? 1 }
    }
    vi.stubGlobal('PointerEvent', TestPointerEvent)
    const save = vi.fn().mockResolvedValue(true)
    render(<ComposerEffortPanel {...base} onSave={save} />)
    const root = screen.getByTestId('composer-effort-slider')
    vi.spyOn(root, 'getBoundingClientRect').mockReturnValue(new DOMRect(0, 0, 300, 40))
    let captured = false
    vi.spyOn(root, 'setPointerCapture').mockImplementation(() => { captured = true })
    vi.spyOn(root, 'hasPointerCapture').mockImplementation(() => captured)
    vi.spyOn(root, 'releasePointerCapture').mockImplementation(() => { captured = false })
    fireEvent.pointerDown(root, { button: 0, pointerId: 1, clientX: 200, clientY: 20 })
    fireEvent.pointerMove(root, { pointerId: 1, clientX: 300, clientY: 20 })
    expect(screen.getByRole('slider')).toHaveAttribute('aria-valuetext', 'Max')
    expect(save).not.toHaveBeenCalled()
    fireEvent.pointerUp(root, { button: 0, pointerId: 1, clientX: 300, clientY: 20 })
    await waitFor(() => expect(save).toHaveBeenCalledExactlyOnceWith('max'))
  })

  it('focuses the slider and saves keyboard choices while keeping the panel open', async () => {
    const save = vi.fn().mockResolvedValue(true)
    render(<ComposerEffortPanel {...base} onSave={save} />)
    const slider = screen.getByRole('slider', { name: 'Thinking effort' })
    expect(slider).toHaveFocus()
    expect(slider).toHaveAttribute('aria-valuetext', 'Medium')
    fireEvent.keyDown(slider, { key: 'End' })
    await waitFor(() => expect(save).toHaveBeenCalledExactlyOnceWith('max'))
    expect(screen.getByRole('status')).toHaveTextContent('Max')
    expect(screen.getByRole('group', { name: 'Thinking effort' })).toBeVisible()
    fireEvent.click(screen.getByRole('button', { name: 'Select model' }))
    expect(base.onBack).toHaveBeenCalled()
  })

  it('skips unsupported stops and does not save on mount or while disabled', async () => {
    const save = vi.fn().mockResolvedValue(true)
    const { rerender } = render(<ComposerEffortPanel {...base} levels={['low', 'high']} value="low" onSave={save} />)
    expect(save).not.toHaveBeenCalled()
    fireEvent.keyDown(screen.getByRole('slider'), { key: 'ArrowRight' })
    await waitFor(() => expect(save).toHaveBeenCalledExactlyOnceWith('high'))
    rerender(<ComposerEffortPanel {...base} disabled onSave={save} />)
    fireEvent.keyDown(screen.getByRole('slider'), { key: 'Home' })
    expect(save).toHaveBeenCalledTimes(1)
  })

  it.each(['off', undefined] as const)('preserves the saved %s value until the user chooses a stop', async value => {
    const save = vi.fn().mockResolvedValue(true)
    render(<ComposerEffortPanel {...base} value={value} onSave={save} />)
    expect(save).not.toHaveBeenCalled()
    expect(screen.getByRole('slider')).toHaveAttribute('aria-valuetext', value === 'off' ? 'Off' : 'Auto')
    fireEvent.keyDown(screen.getByRole('slider'), { key: 'Home' })
    await waitFor(() => expect(save).toHaveBeenCalledExactlyOnceWith('low'))
  })

  it('blocks duplicate saves and restores the persisted value when saving fails', async () => {
    let finish!: (saved: boolean) => void
    const save = vi.fn(() => new Promise<boolean>(resolve => { finish = resolve }))
    render(<ComposerEffortPanel {...base} onSave={save} />)
    fireEvent.keyDown(screen.getByRole('slider'), { key: 'End' })
    expect(screen.getByRole('slider')).toHaveAttribute('data-disabled')
    fireEvent.keyDown(screen.getByRole('slider'), { key: 'Home' })
    expect(save).toHaveBeenCalledTimes(1)
    await act(async () => finish(false))
    expect(screen.getByRole('slider')).toHaveAttribute('aria-valuetext', 'Medium')
    expect(screen.getByRole('slider')).not.toHaveAttribute('data-disabled')
  })

  it('rolls back rejected saves and reports the error to the host', async () => {
    const error = new Error('Save failed')
    const onSaveError = vi.fn()
    render(<ComposerEffortPanel {...base} onSave={vi.fn().mockRejectedValue(error)} onSaveError={onSaveError} />)
    fireEvent.keyDown(screen.getByRole('slider'), { key: 'End' })
    // The host callback runs before React commits the rollback to the DOM.
    await waitFor(() => {
      expect(onSaveError).toHaveBeenCalledWith(error)
      expect(screen.getByRole('slider')).toHaveAttribute('aria-valuetext', 'Medium')
      expect(screen.getByRole('slider')).not.toHaveAttribute('data-disabled')
    })
  })

  it('honors updated persisted values and localized labels', () => {
    const { rerender } = render(<ComposerEffortPanel {...base} onSave={vi.fn()} />)
    rerender(<ComposerEffortPanel {...base} value="high" onSave={vi.fn()} labels={{ title: '思考强度', selectModel: '选择模型', high: '高' }} />)
    expect(screen.getByRole('slider', { name: '思考强度' })).toHaveAttribute('aria-valuetext', '高')
    expect(screen.getByRole('button', { name: '选择模型' })).toHaveTextContent('Test model')
  })

  it('shows the Max effect only when motion is allowed and never bursts on mount', async () => {
    const { unmount } = render(<ComposerEffortPanel {...base} value="max" onSave={vi.fn()} />)
    expect(await screen.findByTestId('effort-slider-max-motion')).toBeInTheDocument()
    expect(screen.queryByTestId('effort-slider-max-burst')).not.toBeInTheDocument()
    unmount()
    reducedMotion = true
    render(<ComposerEffortPanel {...base} value="max" onSave={vi.fn()} />)
    expect(screen.getByRole('slider')).toHaveAttribute('aria-valuetext', 'Max')
    expect(screen.queryByTestId('effort-slider-max-motion')).not.toBeInTheDocument()
  })
})
