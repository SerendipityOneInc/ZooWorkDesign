import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { groupModelPickerOptions, MODEL_PICKER_PRIMARY_LIMIT } from '../composer/model-picker-groups'
import { ModelPicker, type ModelPickerOption } from '../composer/ModelPicker'

function option(id: string, extra: Partial<ModelPickerOption> = {}): ModelPickerOption {
  return { id, label: `Model ${id}`, description: `${id} description`, ...extra }
}

const ids = (items: ModelPickerOption[]) => items.map((item) => item.id)

function openPicker() {
  fireEvent.keyDown(screen.getByTestId('model-picker-trigger'), { key: 'ArrowDown', code: 'ArrowDown' })
}

function renderedOptionIds() {
  return screen.queryAllByRole('menuitemradio').map((item) => item.getAttribute('data-model-picker-option'))
}

describe('chat-ui/composer/groupModelPickerOptions', () => {
  it('keeps a tier-1 catalog that fits the limit entirely primary', () => {
    const catalog = Array.from({ length: MODEL_PICKER_PRIMARY_LIMIT }, (_, index) => option(`m${index}`))
    const groups = groupModelPickerOptions(catalog, 'm7')

    expect(groups.primary).toEqual(catalog)
    expect(groups.more).toEqual([])
  })

  it('caps an untiered catalog at eight rows and promotes the selected last model', () => {
    const catalog = Array.from({ length: 10 }, (_, index) => option(`m${index}`))

    expect(ids(groupModelPickerOptions(catalog, 'm0').more)).toEqual(['m8', 'm9'])

    const groups = groupModelPickerOptions(catalog, 'm9')
    expect(ids(groups.primary)).toEqual(['m0', 'm1', 'm2', 'm3', 'm4', 'm5', 'm6', 'm9'])
    expect(ids(groups.more)).toEqual(['m7', 'm8'])
  })

  it('fills eight primary slots with tier-1 models in API order and moves tier 2 and overflow to More', () => {
    const catalog = [
      option('t2-a', { displayTier: 2 }),
      ...Array.from({ length: 9 }, (_, index) => option(`t1-${index}`)),
      option('t2-b', { displayTier: 2 }),
    ]
    const groups = groupModelPickerOptions(catalog, '')

    expect(ids(groups.primary)).toEqual(['t1-0', 't1-1', 't1-2', 't1-3', 't1-4', 't1-5', 't1-6', 't1-7'])
    expect(ids(groups.more)).toEqual(['t2-a', 't1-8', 't2-b'])
    expect(groups.primary).toHaveLength(MODEL_PICKER_PRIMARY_LIMIT)
  })

  it('pins a selected secondary model and pushes the last primary candidate into More', () => {
    const catalog = [
      ...Array.from({ length: 8 }, (_, index) => option(`t1-${index}`)),
      option('old', { displayTier: 2 }),
    ]

    const before = groupModelPickerOptions(catalog, 't1-0')
    expect(ids(before.more)).toEqual(['old'])

    const after = groupModelPickerOptions(catalog, 'old')
    expect(ids(after.primary)).toEqual(['t1-0', 't1-1', 't1-2', 't1-3', 't1-4', 't1-5', 't1-6', 'old'])
    expect(ids(after.more)).toEqual(['t1-7'])
  })

  it('never changes option objects, so selectability and metadata survive promotion', () => {
    const retired = option('retired', { displayTier: 2, selectable: false, statusLabel: 'No longer selectable' })
    const catalog = [option('a'), retired]
    const groups = groupModelPickerOptions(catalog, 'retired')

    expect(groups.primary).toContain(retired)
    expect(retired.selectable).toBe(false)
    expect([...groups.primary, ...groups.more]).toHaveLength(catalog.length)
  })
})

describe('chat-ui/composer/ModelPicker grouping', () => {
  const tiered = [
    option('primary-a', { default: true }),
    option('primary-b'),
    option('secondary', { displayTier: 2, multiplier: '0.5x' }),
  ]

  it('renders a short catalog as before: every model, no More toggle, no implicit search', async () => {
    render(<ModelPicker options={[option('a'), option('b')]} value="a" />)
    openPicker()

    expect(await screen.findByTestId('model-picker-option-b')).toBeInTheDocument()
    expect(renderedOptionIds()).toEqual(['a', 'b'])
    expect(screen.queryByTestId('model-picker-more-toggle')).not.toBeInTheDocument()
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
  })

  it('shortens ten untiered models to eight rows without changing the selection', async () => {
    const catalog = Array.from({ length: 10 }, (_, index) => option(`m${index}`, { default: index === 0 }))
    const change = vi.fn()
    render(<ModelPicker options={catalog} value="m9" onValueChange={change} showDefaultBadge />)

    // The trigger still reflects the caller's value, not a reordered or defaulted one.
    expect(screen.getByTestId('model-picker-trigger')).toHaveTextContent('Model m9')
    openPicker()

    await screen.findByTestId('model-picker-more-toggle')
    expect(renderedOptionIds()).toEqual(['m0', 'm1', 'm2', 'm3', 'm4', 'm5', 'm6', 'm9'])
    expect(screen.getByTestId('model-picker-option-m9')).toHaveAttribute('aria-checked', 'true')
    expect(screen.getByTestId('model-picker-option-m0')).toHaveTextContent('Default')

    fireEvent.click(screen.getByTestId('model-picker-more-toggle'))
    expect(renderedOptionIds()).toEqual(['m0', 'm1', 'm2', 'm3', 'm4', 'm5', 'm6', 'm9', 'm7', 'm8'])

    fireEvent.change(screen.getByRole('textbox', { name: 'Search models…' }), { target: { value: 'm8' } })
    expect(renderedOptionIds()).toEqual(['m8'])
    expect(change).not.toHaveBeenCalled()
  })

  it('adds five models per click above a fixed footer, then restores the default list', async () => {
    const catalog = Array.from({ length: 20 }, (_, index) => option(`m${index}`))
    const change = vi.fn()
    render(<ModelPicker options={catalog} value="m0" onValueChange={change} />)
    openPicker()

    const toggle = await screen.findByTestId('model-picker-more-toggle')
    const viewport = screen.getByTestId('model-picker-menu').querySelector('[data-slot="scroll-area-viewport"]')
    expect(renderedOptionIds()).toEqual(ids(catalog.slice(0, 8)))

    fireEvent.click(toggle)
    expect(renderedOptionIds()).toEqual(ids(catalog.slice(0, 13)))
    expect(toggle).toHaveTextContent('Show more')
    expect(toggle).toHaveAttribute('aria-expanded', 'true')
    expect(viewport).not.toContainElement(toggle)
    expect(screen.getByTestId('model-picker-option-m12').compareDocumentPosition(toggle) & Node.DOCUMENT_POSITION_FOLLOWING)
      .toBeTruthy()

    fireEvent.click(toggle)
    expect(renderedOptionIds()).toEqual(ids(catalog.slice(0, 18)))
    expect(toggle).toHaveTextContent('Show more')

    fireEvent.click(toggle)
    expect(renderedOptionIds()).toEqual(ids(catalog))
    expect(toggle).toHaveTextContent('Show less')

    fireEvent.click(toggle)
    expect(renderedOptionIds()).toEqual(ids(catalog.slice(0, 8)))
    expect(toggle).toHaveTextContent('Show more')
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    expect(change).not.toHaveBeenCalled()
  })

  it('uses localized labels for the grouped layout', async () => {
    const catalog = Array.from({ length: 9 }, (_, index) => option(`m${index}`))
    render(
      <ModelPicker
        options={catalog}
        value="m0"
        onValueChange={vi.fn()}
        labels={{ search: '搜索模型…', showMore: '显示更多', showLess: '收起' }}
        emptySearchLabel="未找到匹配模型"
      />,
    )
    openPicker()

    const toggle = await screen.findByTestId('model-picker-more-toggle')
    expect(toggle).toHaveTextContent('显示更多')
    fireEvent.click(toggle)
    expect(toggle).toHaveTextContent('收起')
    fireEvent.change(screen.getByRole('textbox', { name: '搜索模型…' }), { target: { value: 'nothing' } })
    expect(screen.getByRole('status')).toHaveTextContent('未找到匹配模型')
  })

  it('still shows the catalog error and retry instead of groups', async () => {
    const retry = vi.fn()
    const catalog = Array.from({ length: 10 }, (_, index) => option(`m${index}`))
    render(<ModelPicker options={catalog} value="m0" error="Could not load models" onRetry={retry} />)

    expect(screen.getByTestId('model-picker-trigger')).toHaveTextContent('Models unavailable')
    openPicker()
    expect(await screen.findByRole('alert')).toHaveTextContent('Could not load models')
    expect(screen.queryByTestId('model-picker-more-toggle')).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('menuitem', { name: 'Retry' }))
    expect(retry).toHaveBeenCalledOnce()
  })

  it('collapses secondary models by default and expands them without closing the menu', async () => {
    render(<ModelPicker options={tiered} value="primary-a" onValueChange={vi.fn()} />)
    openPicker()

    const toggle = await screen.findByTestId('model-picker-more-toggle')
    expect(toggle).toHaveTextContent('Show more')
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    expect(renderedOptionIds()).toEqual(['primary-a', 'primary-b'])

    fireEvent.click(toggle)
    expect(screen.getByTestId('model-picker-more-toggle')).toHaveAttribute('aria-expanded', 'true')
    expect(renderedOptionIds()).toEqual(['primary-a', 'primary-b', 'secondary'])
  })

  it('searches the complete catalog while More models is collapsed', async () => {
    render(<ModelPicker options={tiered} value="primary-a" onValueChange={vi.fn()} />)
    openPicker()

    fireEvent.change(await screen.findByRole('textbox', { name: 'Search models…' }), { target: { value: 'second' } })

    expect(renderedOptionIds()).toEqual(['secondary'])
    expect(screen.queryByTestId('model-picker-more-toggle')).not.toBeInTheDocument()
  })

  it('selects a collapsed model with its own id and leaves pricing badges intact', async () => {
    const change = vi.fn()
    render(<ModelPicker options={tiered} value="primary-a" onValueChange={change} />)
    openPicker()
    fireEvent.click(await screen.findByTestId('model-picker-more-toggle'))

    const secondary = screen.getByTestId('model-picker-option-secondary')
    expect(secondary).toHaveTextContent('0.5x')
    fireEvent.click(secondary)

    expect(change).toHaveBeenCalledExactlyOnceWith('secondary')
  })

  it('shows a selected unavailable secondary model as primary without making it selectable', async () => {
    const change = vi.fn()
    render(
      <ModelPicker
        options={[option('primary-a'), option('retired', { displayTier: 2, selectable: false })]}
        value="retired"
        onValueChange={change}
      />,
    )
    openPicker()

    const retired = await screen.findByTestId('model-picker-option-retired')
    expect(renderedOptionIds()).toEqual(['primary-a', 'retired'])
    expect(retired).toHaveAttribute('aria-checked', 'true')
    expect(retired).toHaveAttribute('aria-disabled', 'true')
    fireEvent.click(retired)
    expect(change).not.toHaveBeenCalled()
  })

  it('promotes a chosen secondary model and starts collapsed when the menu reopens', async () => {
    const change = vi.fn()
    const catalog = [...tiered, option('legacy', { displayTier: 2 })]
    const { rerender } = render(<ModelPicker options={catalog} value="primary-a" onValueChange={change} />)
    openPicker()
    fireEvent.click(await screen.findByTestId('model-picker-more-toggle'))
    fireEvent.click(screen.getByTestId('model-picker-option-secondary'))
    await waitFor(() => expect(screen.queryByTestId('model-picker-menu')).not.toBeInTheDocument())

    // The caller saves and passes the new value back; the picker never changes it itself.
    rerender(<ModelPicker options={catalog} value="secondary" onValueChange={change} />)
    openPicker()

    expect(await screen.findByTestId('model-picker-more-toggle')).toHaveAttribute('aria-expanded', 'false')
    expect(renderedOptionIds()).toEqual(['primary-a', 'primary-b', 'secondary'])
    expect(change).toHaveBeenCalledExactlyOnceWith('secondary')
  })
})
