// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import {
  NewTaskStarter,
  type NewTaskStarterCategory,
  type NewTaskStarterLabels,
  type NewTaskStarterTemplate,
} from '../starters'

afterEach(cleanup)

const labels: NewTaskStarterLabels = {
  samplePrompts: 'Sample prompts',
  chooseTemplate: 'Choose a template',
  more: 'More',
  addAndUse: 'Add & Use',
  useTemplate: 'Use this template',
  closeTemplatePreview: 'Close preview',
  templateBestFor: 'Best for',
  previewTemplate: 'Preview',
}

const specialist = {
  id: 'ppt-master',
  displayName: 'PPT Master',
  avatar: <span data-testid="ppt-avatar">P</span>,
}

const categories: NewTaskStarterCategory[] = [
  {
    id: 'builder',
    label: 'Build Agents',
    icon: <span aria-hidden="true">B</span>,
    prompts: [
      {
        id: 'builder-reviewer',
        title: 'Build a store reviewer',
        prompt: 'Build a specialist that reviews storefronts.',
        agent: specialist,
      },
    ],
  },
  {
    id: 'slides',
    label: 'Create Slides',
    icon: <span aria-hidden="true">S</span>,
    prompts: [
      {
        id: 'slides-launch',
        title: 'Create a launch deck',
        prompt: 'Create a launch deck for a new product.',
        agent: specialist,
      },
    ],
  },
]

const template: NewTaskStarterTemplate = {
  id: '8-bit-orbit',
  name: '8-Bit Orbit',
  thumbnailUrl: '/orbit.png',
  previewUrls: ['/orbit-1.png', '/orbit-2.png'],
  themeLabel: 'DARK',
  metaLabel: '10 slides',
  description: 'Pixel-art neon arcade aesthetic.',
  tags: ['retro-tech', 'playful'],
  bestFor: 'Gaming pitches and product launches.',
  agent: specialist,
}

function renderStarter(
  overrides: Partial<React.ComponentProps<typeof NewTaskStarter>> = {},
) {
  const props: React.ComponentProps<typeof NewTaskStarter> = {
    categories,
    activeCategoryId: 'builder',
    labels,
    onCategoryChange: vi.fn(),
    onPromptSelect: vi.fn(),
    ...overrides,
  }
  return { ...render(<NewTaskStarter {...props} />), props }
}

describe('NewTaskStarter', () => {
  it('renders nothing when no categories are available', () => {
    const { container } = render(
      <NewTaskStarter
        categories={[]}
        activeCategoryId={null}
        labels={labels}
        onCategoryChange={vi.fn()}
        onPromptSelect={vi.fn()}
      />,
    )

    expect(container.firstChild).toBeNull()
  })

  it('exposes a controlled category button group and returns category changes', () => {
    const onCategoryChange = vi.fn()
    const { rerender } = render(
      <NewTaskStarter
        categories={categories}
        activeCategoryId="builder"
        labels={labels}
        onCategoryChange={onCategoryChange}
        onPromptSelect={vi.fn()}
      />,
    )

    const builderTab = screen.getByRole('button', { name: 'Build Agents' })
    const slidesTab = screen.getByRole('button', { name: 'Create Slides' })
    expect(builderTab).toHaveAttribute('aria-pressed', 'true')
    expect(slidesTab).toHaveAttribute('aria-pressed', 'false')

    fireEvent.click(slidesTab)
    expect(onCategoryChange).toHaveBeenCalledWith('slides')

    rerender(
      <NewTaskStarter
        categories={categories}
        activeCategoryId="slides"
        labels={labels}
        onCategoryChange={onCategoryChange}
        onPromptSelect={vi.fn()}
      />,
    )
    expect(screen.getByRole('button', { name: 'Create Slides' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: /Create a launch deck/ })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Build a store reviewer/ })).not.toBeInTheDocument()
  })

  it('shows the selection check only on the active category', () => {
    const { rerender, props } = renderStarter()

    const builderTab = screen.getByRole('button', { name: 'Build Agents' })
    const slidesTab = screen.getByRole('button', { name: 'Create Slides' })
    expect(builderTab.querySelector('[data-slot="starter-category-check"]')).toBeInTheDocument()
    expect(slidesTab.querySelector('[data-slot="starter-category-check"]')).not.toBeInTheDocument()

    rerender(<NewTaskStarter {...props} activeCategoryId="slides" />)
    expect(
      screen
        .getByRole('button', { name: 'Build Agents' })
        .querySelector('[data-slot="starter-category-check"]'),
    ).not.toBeInTheDocument()
    expect(
      screen
        .getByRole('button', { name: 'Create Slides' })
        .querySelector('[data-slot="starter-category-check"]'),
    ).toBeInTheDocument()
  })

  it('applies the shared landing appearance and selected-category indicator', () => {
    renderStarter({
      appearance: 'landing',
      selectedCategoryIndicator: <img data-testid="landing-selection-indicator" src="/landing-check.svg" alt="" />,
    })

    expect(screen.getByTestId('new-task-starter')).toHaveAttribute(
      'data-new-task-starter-appearance',
      'landing',
    )
    expect(
      within(screen.getByRole('button', { name: 'Build Agents' })).getByTestId(
        'landing-selection-indicator',
      ),
    ).toBeInTheDocument()
    expect(
      within(screen.getByRole('button', { name: 'Create Slides' })).queryByTestId(
        'landing-selection-indicator',
      ),
    ).not.toBeInTheDocument()
  })

  it('returns the full prompt and specialist without submitting anything itself', () => {
    const onPromptSelect = vi.fn()
    renderStarter({ activeCategoryId: 'slides', onPromptSelect })

    const promptButton = screen.getByRole('button', { name: /Create a launch deck/ })
    expect(within(promptButton).getByText('PPT Master')).toBeInTheDocument()
    fireEvent.click(promptButton)

    expect(onPromptSelect).toHaveBeenCalledWith(categories[1].prompts[0])
  })

  it('marks the selected prompt and disables interactions while busy', () => {
    renderStarter({
      activeCategoryId: 'slides',
      selectedPromptId: 'slides-launch',
      disabled: true,
    })

    const promptButton = screen.getByRole('button', { name: /Create a launch deck/ })
    expect(promptButton).toHaveAttribute('aria-pressed', 'true')
    expect(promptButton).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Build Agents' })).toBeDisabled()
  })

  it('supports arrow-key category navigation', () => {
    const onCategoryChange = vi.fn()
    renderStarter({ onCategoryChange })

    fireEvent.keyDown(screen.getByRole('button', { name: 'Build Agents' }), { key: 'ArrowRight' })
    expect(onCategoryChange).toHaveBeenCalledWith('slides')
    fireEvent.keyDown(screen.getByRole('button', { name: 'Build Agents' }), { key: 'ArrowLeft' })
    expect(onCategoryChange).toHaveBeenCalledWith('slides')
  })

  it('renders More as an explicit action', () => {
    const onMore = vi.fn()
    renderStarter({ onMore })

    fireEvent.click(screen.getByRole('button', { name: 'More' }))
    expect(onMore).toHaveBeenCalledOnce()
  })

  it('renders configured More options and reports the selected option', async () => {
    const onMoreSelect = vi.fn()
    renderStarter({
      moreOptions: [{ id: 'marketing', label: 'Marketing' }],
      onMoreSelect,
    })

    fireEvent.keyDown(screen.getByRole('button', { name: 'More' }), { key: 'ArrowDown', code: 'ArrowDown' })
    fireEvent.click(await screen.findByRole('menuitem', { name: 'Marketing' }))

    expect(onMoreSelect).toHaveBeenCalledWith('marketing')
  })

  it('exposes the active More option as the selected category control', () => {
    renderStarter({
      activeCategoryId: 'marketing',
      moreOptions: [
        {
          id: 'marketing',
          label: 'Plan Marketing',
          prompts: [
            {
              id: 'marketing-launch',
              title: 'Plan a launch',
              prompt: 'Plan a product launch.',
              agent: specialist,
            },
          ],
        },
      ],
      onMoreSelect: vi.fn(),
    })

    expect(screen.getByRole('group', { name: 'Sample prompts' })).toBeInTheDocument()
    const marketingButton = screen.getByRole('button', { name: 'Plan Marketing' })
    expect(marketingButton).toHaveAttribute('aria-pressed', 'true')
    expect(marketingButton.querySelector('[data-slot="starter-category-check"]')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Plan a launch/ })).toBeInTheDocument()
  })

  it('keeps the adaptive landing appearance on the portaled More menu', async () => {
    renderStarter({
      appearance: 'landing-adaptive',
      moreOptions: [{ id: 'marketing', label: 'Marketing' }],
      onMoreSelect: vi.fn(),
    })

    expect(screen.getByTestId('new-task-starter')).toHaveAttribute(
      'data-new-task-starter-appearance',
      'landing-adaptive',
    )

    fireEvent.keyDown(screen.getByRole('button', { name: 'More' }), {
      key: 'ArrowDown',
      code: 'ArrowDown',
    })

    expect(await screen.findByRole('menu')).toHaveAttribute(
      'data-new-task-starter-appearance',
      'landing-adaptive',
    )
  })

  it('shows templates only for the configured category', () => {
    const { rerender, props } = renderStarter({
      templates: [template],
      templateCategoryId: 'slides',
    })
    expect(screen.queryByText('8-Bit Orbit')).not.toBeInTheDocument()

    rerender(<NewTaskStarter {...props} activeCategoryId="slides" />)
    expect(screen.getByText('8-Bit Orbit')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Add & Use 8-Bit Orbit' })).toBeInTheDocument()
  })

  it('previews a template and emits Add & Use from the dialog', async () => {
    const onTemplateSelect = vi.fn()
    renderStarter({
      activeCategoryId: 'slides',
      templates: [template],
      templateCategoryId: 'slides',
      onTemplateSelect,
    })

    const previewButton = screen.getByRole('button', { name: 'Preview 8-Bit Orbit' })
    previewButton.focus()
    fireEvent.click(previewButton)

    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveClass('sm:max-w-4xl')
    expect(dialog).toHaveTextContent('8-Bit Orbit')
    expect(dialog).toHaveTextContent('Gaming pitches and product launches.')
    expect(within(dialog).getAllByRole('img')).toHaveLength(2)

    fireEvent.click(within(dialog).getByRole('button', { name: 'Use this template' }))
    expect(onTemplateSelect).toHaveBeenCalledWith(template)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    await waitFor(() => expect(previewButton).toHaveFocus())
  })

  it('closes the template preview with Escape', () => {
    renderStarter({
      activeCategoryId: 'slides',
      templates: [template],
      templateCategoryId: 'slides',
      onTemplateSelect: vi.fn(),
    })

    fireEvent.click(screen.getByRole('button', { name: 'Preview 8-Bit Orbit' }))
    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' })
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
