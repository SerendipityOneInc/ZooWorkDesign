import { fireEvent, render, screen, within, waitFor, cleanup } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { App } from './App'
import { PREVIEW_LOCALE_STORAGE_KEY } from './locale'
import { sonnerToast } from '@zooclaw/zooworkdesign'
import { CATALOG_ITEMS } from './catalog'

function renderedCopy() {
  const attributes = Array.from(
    document.body.querySelectorAll('[aria-label], [placeholder], [title], [alt], input, textarea'),
  ).map(
    (element) =>
      ['aria-label', 'placeholder', 'title', 'alt'].map((name) => element.getAttribute(name) ?? '').join(' ') +
      ('value' in element ? String(element.value) : ''),
  )
  return [document.body.textContent, ...attributes].join('\n')
}

function openMenu(button: HTMLElement) {
  fireEvent(button, new MouseEvent('pointerdown', { bubbles: true, button: 0 }))
}

beforeEach(() => {
  localStorage.clear()
  document.documentElement.classList.remove('dark')
})
afterEach(() => {
  sonnerToast.dismiss()
  cleanup()
  localStorage.clear()
})

describe('preview localization', { timeout: 20000 }, () => {
  it('renders the complete English catalog without built-in Chinese copy, including open menus', async () => {
    render(<App initialLocale="en" />)
    expect(Array.from(document.querySelectorAll('.pv-main > .pv-section')).map(section => section.id))
      .toEqual(CATALOG_ITEMS.map(item => item.id))
    expect(renderedCopy().match(/[^\n]*\p{Script=Han}[^\n]*/gu)).toBeNull()
    const language = within(document.querySelector('.pv-topbar')!).getByRole('button', { name: 'EN — English. Switch to Chinese (Simplified).' })
    expect(language.querySelector('svg')).toBeInTheDocument()
    expect(language).not.toHaveTextContent('EN')
    openMenu(screen.getByRole('button', { name: 'Switch agent: Market Brief' }))
    expect(await screen.findByRole('menuitem', { name: 'Research Assistant' })).toBeInTheDocument()
    expect(renderedCopy()).not.toMatch(/\p{Script=Han}/u)
    fireEvent.keyDown(screen.getByRole('menu'), { key: 'Escape' })
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())
    fireEvent.click(screen.getByRole('button', { name: 'Product interface' }))
    fireEvent.click(screen.getByRole('button', { name: 'Update agent' }))
    expect(renderedCopy()).not.toMatch(/\p{Script=Han}/u)
    fireEvent.click(screen.getByRole('button', { name: 'Zero activity' }))
    expect(screen.getByRole('img', { name: 'Zero activity gradient line' })).toBeInTheDocument()
    expect(renderedCopy()).not.toMatch(/\p{Script=Han}/u)
  })

  it('updates an already visible notification when the page language changes', async () => {
    render(<App initialLocale="en" />)
    fireEvent.click(screen.getByRole('button', { name: 'Default toast' }))
    expect(await screen.findByText('Changes saved')).toBeInTheDocument()
    fireEvent.click(within(document.querySelector('.pv-topbar')!).getByRole('button', { name: 'EN — English. Switch to Chinese (Simplified).' }))
    expect(await screen.findByText('更改已保存')).toBeInTheDocument()
    expect(screen.queryByText('Changes saved')).not.toBeInTheDocument()
  })

  it('places language selection after the theme control, switches all sections, and preserves theme and edited specimens', async () => {
    const { container, unmount } = render(<App initialLocale="en" />)
    const theme = within(document.querySelector('.pv-topbar')!).getByRole('group', { name: 'Color scheme' })
    const language = within(document.querySelector('.pv-topbar')!).getByRole('button', { name: 'EN — English. Switch to Chinese (Simplified).' })
    expect(theme.compareDocumentPosition(language) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    fireEvent.click(within(document.querySelector('.pv-topbar')!).getByRole('button', { name: 'Dark mode' }))
    fireEvent.change(screen.getByLabelText('Display text'), { target: { value: 'My own display sample' } })
    fireEvent.click(within(document.querySelector('.pv-topbar')!).getByRole('button', { name: 'EN — English. Switch to Chinese (Simplified).' }))
    await waitFor(() => expect(document.documentElement.lang).toBe('zh-CN'))
    expect(language.querySelector('svg')).toBeInTheDocument()
    expect(language).toHaveAttribute('aria-label', 'ZH — 简体中文。切换为英文。')
    expect(document.documentElement).toHaveClass('dark')
    expect(within(document.getElementById('brand')!).getByRole('heading', { name: 'ZooWork 的视觉表达' })).toBeInTheDocument()
    expect(within(document.querySelector('.pv-side')!).getByRole('link', { name: '字体排版' })).toBeInTheDocument()
    expect(within(container.querySelector('#changelog')!).getByText('待发布')).toBeInTheDocument()
    expect(within(container.querySelector('#changelog')!).queryByText('Unreleased')).not.toBeInTheDocument()
    expect(
      within(container.querySelector('#connector-cards')!).getAllByRole('button', { name: '连接' }).length,
    ).toBeGreaterThan(0)
    expect(screen.getByLabelText('展示文字')).toHaveValue('让你的专业，\n成为随时待命的智能体。')
    fireEvent.change(screen.getByLabelText('展示文字'), { target: { value: '我的中文样张' } })
    fireEvent.click(within(document.querySelector('.pv-topbar')!).getByRole('button', { name: 'ZH — 简体中文。切换为英文。' }))
    await waitFor(() => expect(document.documentElement.lang).toBe('en'))
    expect(screen.getByLabelText('Display text')).toHaveValue('My own display sample')
    expect(renderedCopy()).not.toMatch(/\p{Script=Han}/u)
    fireEvent.click(within(document.querySelector('.pv-topbar')!).getByRole('button', { name: 'EN — English. Switch to Chinese (Simplified).' }))
    expect(screen.getByLabelText('展示文字')).toHaveValue('我的中文样张')
    expect(localStorage.getItem(PREVIEW_LOCALE_STORAGE_KEY)).toBe('zh')
    unmount()
    render(<App />)
    expect(within(document.querySelector('.pv-topbar')!).getByRole('button', { name: 'ZH — 简体中文。切换为英文。' })).toBeInTheDocument()
    expect(document.title).toBe('ZooWorkDesign — React components for tools & agents')
  // This integration test renders every catalog section several times. The
  // GitHub runner takes ~24s; keep all state/localization assertions intact.
  }, 60000)

  it('localizes dialog actions and their accessible close label in Chinese', () => {
    render(<App initialLocale="zh" />)
    fireEvent.click(screen.getByRole('button', { name: '打开对话框' }))
    const dialog = within(screen.getByRole('dialog'))
    expect(dialog.getByRole('heading', { name: '编辑智能体' })).toBeInTheDocument()
    expect(dialog.getByRole('button', { name: '关闭' })).toBeInTheDocument()
    expect(dialog.getByRole('button', { name: '保存更改' })).toBeInTheDocument()
  })
})
