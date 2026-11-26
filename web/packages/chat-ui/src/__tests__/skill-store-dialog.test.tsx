import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { SkillStoreDialog, type SkillStoreDialogItem, type SkillStoreDialogProps } from '../composer/SkillStoreDialog'

const VIDEO_SKILL: SkillStoreDialogItem = {
  author: 'ZooClaw',
  icon: <span data-testid="video-skill-icon">video icon</span>,
  id: 'skill-video',
  name: 'Video Generator',
  slug: 'video-generator',
  summary: 'Create production-ready videos from a concise brief.',
}

const WRITING_SKILL: SkillStoreDialogItem = {
  author: 'ZooClaw',
  icon: <span data-testid="writing-skill-icon">writing icon</span>,
  id: 'skill-writing',
  name: 'Writing Assistant',
  slug: 'writing-assistant',
  summary: 'Turn rough notes into a clear, polished draft.',
}

const LABELS: SkillStoreDialogProps['labels'] = {
  title: 'Skill Store',
  description: 'Choose a Skill, then confirm to add it to this message.',
  loading: 'Loading Skill Store',
  loadFailedTitle: 'Could not load Skill Store',
  loadFailedDescription: 'Please try again.',
  retry: 'Retry',
  emptyTitle: 'No Skills available',
  emptyDescription: 'New community Skills will appear here when they are available.',
  loadingMore: 'Loading…',
  loadMore: 'Load more',
  selectOne: 'Select one Skill to continue',
  cancel: 'Cancel',
  addToMessage: 'Add to message',
}

const defaultProps: SkillStoreDialogProps = {
  items: [VIDEO_SKILL, WRITING_SKILL],
  labels: LABELS,
  onConfirm: () => {},
  onOpenChange: () => {},
  open: true,
}

afterEach(cleanup)

describe('SkillStoreDialog', () => {
  it('renders the supplied copy and loading state in the viewport-capped dialog surface', () => {
    render(<SkillStoreDialog {...defaultProps} items={[]} isLoading />)

    const dialog = screen.getByTestId('composer-skill-market-dialog')
    expect(dialog).toHaveAttribute('data-viewport-capped', 'true')
    expect(dialog).toHaveClass('w-[calc(100%-2rem)]!')
    expect(dialog).toHaveClass('max-w-[920px]!')
    expect(dialog).toHaveClass('h-[calc(100vh-2rem)]!')
    expect(dialog).toHaveClass('max-h-[680px]!')
    expect(screen.getByRole('heading', { name: 'Skill Store' })).toBeInTheDocument()
    expect(screen.getByText('Choose a Skill, then confirm to add it to this message.')).toBeInTheDocument()
    expect(screen.getByRole('status', { name: 'Loading Skill Store' })).toBeInTheDocument()
  })

  it('renders a retryable error state', () => {
    const onRetry = vi.fn()
    render(<SkillStoreDialog {...defaultProps} items={[]} isError onRetry={onRetry} />)

    const errorTitle = screen.getByText('Could not load Skill Store')
    expect(errorTitle.closest('[data-slot="empty"]')).toBeInTheDocument()
    expect(screen.getByText('Please try again.')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Retry' }))
    expect(onRetry).toHaveBeenCalledOnce()
  })

  it('renders the empty state', () => {
    render(<SkillStoreDialog {...defaultProps} items={[]} />)

    const emptyTitle = screen.getByText('No Skills available')
    expect(emptyTitle.closest('[data-slot="empty"]')).toBeInTheDocument()
    expect(screen.getByText('New community Skills will appear here when they are available.')).toBeInTheDocument()
  })

  it('renders Chinese loading, error, and empty-state copy supplied by the app', () => {
    const labels = {
      ...LABELS,
      title: '技能商店',
      description: '选择一个技能，然后确认将其添加到这条消息中。',
      loading: '正在加载技能商店',
      loadFailedTitle: '无法加载技能商店',
      loadFailedDescription: '请重试。',
      retry: '重试',
      emptyTitle: '暂无可用技能',
      emptyDescription: '新的社区技能上线后会显示在这里。',
    }
    const view = render(<SkillStoreDialog {...defaultProps} items={[]} isLoading labels={labels} />)

    expect(screen.getByRole('heading', { name: labels.title })).toBeInTheDocument()
    expect(screen.getByRole('status', { name: labels.loading })).toBeInTheDocument()

    view.rerender(<SkillStoreDialog {...defaultProps} items={[]} isError labels={labels} />)
    expect(screen.getByText(labels.loadFailedTitle)).toBeInTheDocument()
    expect(screen.getByText(labels.loadFailedDescription)).toBeInTheDocument()

    view.rerender(<SkillStoreDialog {...defaultProps} items={[]} labels={labels} />)
    expect(screen.getByText(labels.emptyTitle)).toBeInTheDocument()
    expect(screen.getByText(labels.emptyDescription)).toBeInTheDocument()
  })

  it('renders the one-two-three-column card grid with passed icon nodes', () => {
    render(<SkillStoreDialog {...defaultProps} />)

    const skill = screen.getByTestId('composer-market-skill-video-generator')
    const grid = screen.getByTestId('composer-skill-market-grid')
    const card = skill.closest('[data-slot="card"]')

    expect(grid).toHaveClass('grid-cols-1', 'sm:grid-cols-2', 'lg:grid-cols-3')
    expect(document.querySelector('[data-slot="scroll-area"]')).toBeInTheDocument()
    expect(card).toHaveAttribute('data-selected', 'false')
    expect(skill).toHaveAttribute('aria-pressed', 'false')
    expect(screen.getByTestId('video-skill-icon')).toBeInTheDocument()
    expect(within(skill).getByText('ZooClaw')).toBeInTheDocument()
    expect(within(skill).getByText(VIDEO_SKILL.summary)).toBeInTheDocument()
  })

  it('selects and confirms the full item before closing', () => {
    const onConfirm = vi.fn()
    const onOpenChange = vi.fn()
    render(<SkillStoreDialog {...defaultProps} onConfirm={onConfirm} onOpenChange={onOpenChange} />)
    const skill = screen.getByTestId('composer-market-skill-video-generator')
    const confirm = screen.getByRole('button', { name: 'Add to message' })

    expect(confirm).toBeDisabled()
    fireEvent.click(skill)

    expect(skill).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByTestId('composer-market-skill-selected-video-generator')).toBeInTheDocument()
    expect(confirm).not.toBeDisabled()
    expect(screen.getByText('Video Generator', { selector: '[data-slot="dialog-footer"] *' })).toBeInTheDocument()

    fireEvent.click(confirm)
    expect(onConfirm).toHaveBeenCalledWith(VIDEO_SKILL)
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it('loads more and reflects the fetching state', () => {
    const onLoadMore = vi.fn()
    const { rerender } = render(
      <SkillStoreDialog {...defaultProps} hasNextPage onLoadMore={onLoadMore} />,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Load more' }))
    expect(onLoadMore).toHaveBeenCalledOnce()

    rerender(<SkillStoreDialog {...defaultProps} hasNextPage isFetchingNextPage onLoadMore={onLoadMore} />)
    const loadingButton = screen.getByText('Loading…').closest('button')
    expect(loadingButton).toBeDisabled()
    expect(loadingButton?.querySelector('[data-slot="spinner"]')).toBeInTheDocument()
  })

  it('resets selection when cancelled', () => {
    const onOpenChange = vi.fn()
    render(<SkillStoreDialog {...defaultProps} onOpenChange={onOpenChange} />)

    fireEvent.click(screen.getByTestId('composer-market-skill-video-generator'))
    expect(screen.getByRole('button', { name: 'Add to message' })).not.toBeDisabled()

    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))
    expect(onOpenChange).toHaveBeenCalledWith(false)
    expect(screen.getByRole('button', { name: 'Add to message' })).toBeDisabled()
    expect(screen.getByText('Select one Skill to continue')).toBeInTheDocument()
  })
})
