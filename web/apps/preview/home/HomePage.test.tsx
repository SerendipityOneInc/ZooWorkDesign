import { act, fireEvent, render, screen, within } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { HomePage } from './HomePage'

afterEach(() => { vi.useRealTimers(); vi.unstubAllEnvs() })

describe('builder homepage', () => {
  it('closes mobile navigation on Escape when a pointer click does not focus the trigger', () => {
    render(<HomePage initialLocale="en" />)
    const toggle = screen.getByRole('button', { name: 'Navigation menu' })
    fireEvent.click(toggle)
    expect(toggle).not.toHaveFocus()
    expect(screen.getByRole('navigation', { name: 'Mobile navigation' })).toBeInTheDocument()
    fireEvent.keyDown(document.body, { key: 'Escape' })
    expect(screen.queryByRole('navigation', { name: 'Mobile navigation' })).not.toBeInTheDocument()
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    expect(toggle).toHaveFocus()

    const editor = screen.getByRole('textbox', { name: 'Try the message composer' })
    editor.focus()
    fireEvent.keyDown(editor, { key: 'Escape' })
    expect(editor).toHaveFocus()
  })

  it('keeps catalog links on the deployment path and translates the visible demo', () => {
    vi.stubEnv('BASE_URL', '/ZooWorkDesign/')
    render(<HomePage initialLocale="en" />)
    expect(screen.getByRole('link', { name: 'Explore components' })).toHaveAttribute('href', '/ZooWorkDesign/?view=components&lang=en#button')
    fireEvent.click(screen.getByRole('button', { name: 'EN — English. Switch to Chinese (Simplified).' }))
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('让好想法')
    expect(screen.getByRole('link', { name: '浏览组件' })).toHaveAttribute('href', '/ZooWorkDesign/?view=components&lang=zh#button')
    expect(screen.getByRole('textbox', { name: '试用消息输入框' })).toBeInTheDocument()
    expect(screen.getByText('Figma · 公开发布准备中')).toBeInTheDocument()
  })

  it('runs a local reply, cancels pending replies, and resets the selected conversation', () => {
    vi.useFakeTimers()
    render(<HomePage initialLocale="en" />)
    const demo = within(screen.getByRole('region', { name: 'Interactive agent demo' }))
    const editor = demo.getByRole('textbox', { name: 'Try the message composer' })
    const enter = (text: string) => {
      editor.textContent = text
      fireEvent.input(editor)
      fireEvent.click(demo.getByRole('button', { name: 'Send message' }))
    }
    enter('Build my own tool')
    expect(demo.getByRole('log')).toHaveTextContent('Build my own tool')
    expect(demo.getByRole('button', { name: 'Stop generation' })).toBeInTheDocument()
    fireEvent.click(demo.getByRole('button', { name: 'Stop generation' }))
    act(() => { vi.advanceTimersByTime(2000) })
    expect(demo.queryByText(/this reply is a local demo/)).not.toBeInTheDocument()
    expect(demo.getByRole('status')).toHaveTextContent('Demo reply stopped')
    enter('Try again')
    act(() => { vi.advanceTimersByTime(2000) })
    expect(demo.getByText(/this reply is a local demo/)).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Research notes' }))
    expect(demo.getByRole('log')).toHaveTextContent('user interviews')
    expect(demo.queryByText('Build my own tool')).not.toBeInTheDocument()
  })

  it('lets visitors try the hero palette and controls without changing the page theme', () => {
    render(<HomePage initialLocale="en" />)
    const scene = screen.getByRole('region', { name: 'Interactive component composition' })
    fireEvent.click(within(scene).getByRole('radio', { name: 'Moss' }))
    expect(scene).toHaveClass('home-palette-moss')
    expect(within(scene).getByRole('radio', { name: 'Violet' })).not.toBeChecked()
    const automate = within(scene).getByRole('switch', { name: 'A little automation' })
    fireEvent.click(automate)
    expect(automate).toHaveAttribute('aria-checked', 'false')
    fireEvent.click(within(scene).getByRole('checkbox', { name: 'Give that idea a try' }))
    expect(within(scene).getByRole('checkbox')).toHaveAttribute('aria-checked', 'true')
    expect(screen.getByRole('link', { name: 'ZooWorkDesign home' })).toBeInTheDocument()
  })
})
