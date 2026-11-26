import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { afterEach, expect, it, vi } from 'vitest'
import type { ReactNode } from 'react'
import * as source from './source'
import { CHAT_PREVIEW_COMPONENTS } from './registry'
import { ChatComposerExamples } from '../ChatComposerExamples'
import { ChatCardExamples } from './CardExamples'
import { ChatStarterExamples } from './StarterExamples'
import { ChatMessageExamples } from './MessageExamples'
import { ChatActivityExamples } from './ActivityExamples'
import { ChatPickerExamples } from './PickerExamples'
import { EditAgentSessionExample } from './EditAgentSessionExample'
import { ChatSessionExamples } from './SessionExamples'
import { ChatAttachmentExamples } from './AttachmentExamples'
import { PreviewLocaleProvider } from '../locale'
import { CATALOG_ITEMS } from '../catalog'

afterEach(cleanup)
const mount = (children: ReactNode) => render(<PreviewLocaleProvider initialLocale="en">{children}</PreviewLocaleProvider>)

it('opens the session composer model menu above the input and reaches its effort panel', async () => {
  mount(<ChatComposerExamples />)
  fireEvent.keyDown(screen.getByTestId('model-picker-trigger'), { key: 'ArrowDown' })
  const menu = await screen.findByRole('menu')
  expect(menu).toHaveAttribute('data-side', 'top')
  fireEvent.click(screen.getByTestId('model-picker-option-terra'))
  const slider = await screen.findByRole('slider', { name: 'Thinking effort' })
  expect(screen.getByTestId('model-picker-trigger')).toHaveTextContent(/^Select model$/)
  fireEvent.keyDown(slider, { key: 'End' })
  await waitFor(() => expect(slider).toHaveAttribute('aria-valuetext', 'Max'))
  fireEvent.click(screen.getByRole('button', { name: 'Select model' }))
  expect(await screen.findByTestId('model-picker-option-terra')).toBeVisible()
})

it('disables model changes when the composer preview is read only', () => {
  mount(<ChatComposerExamples />)
  fireEvent.click(screen.getByRole('radio', { name: 'Read only' }))
  expect(screen.getByTestId('model-picker-trigger')).toBeDisabled()
})

it('shows effort panels immediately while keeping a separate click-through example', () => {
  mount(<ChatPickerExamples />)
  expect(screen.getAllByRole('slider')).toHaveLength(2)
  expect(screen.getByRole('slider', { name: 'Thinking effort · Max' })).toHaveAttribute('aria-valuetext', 'Max')
  expect(screen.getByRole('heading', { name: 'Click-through example' })).toBeVisible()
  expect(screen.getByTestId('model-picker-trigger')).toHaveAttribute('aria-expanded', 'false')
  expect(document.activeElement).toBe(document.body)
})

it('previews model selection, effort changes and back navigation', async () => {
  mount(<ChatPickerExamples />)
  fireEvent.keyDown(screen.getByTestId('model-picker-trigger'), { key: 'ArrowDown' })
  fireEvent.click(await screen.findByTestId('model-picker-option-terra'))
  const slider = await screen.findByRole('slider', { name: 'Thinking effort' })
  fireEvent.keyDown(slider, { key: 'End' })
  await waitFor(() => expect(screen.getByText('Saved GPT-5.6 Terra · Max.')).toBeVisible())
  fireEvent.click(screen.getByRole('button', { name: 'Select model' }))
  expect(await screen.findByTestId('model-picker-option-terra')).toBeVisible()
})

it('restores the saved effort when the preview simulates a failed save', async () => {
  mount(<ChatPickerExamples />)
  fireEvent.click(screen.getByRole('radio', { name: 'Save fails' }))
  fireEvent.keyDown(screen.getByTestId('model-picker-trigger'), { key: 'ArrowDown' })
  fireEvent.click(await screen.findByTestId('model-picker-option-terra'))
  fireEvent.keyDown(await screen.findByRole('slider'), { key: 'Home' })
  await waitFor(() => expect(screen.getByText('Could not save. The previous effort has been restored.')).toBeVisible())
  expect(screen.getByRole('slider')).toHaveAttribute('aria-valuetext', 'Medium')
})

it('places the task starter business flow with patterns rather than chat components', () => {
  expect(CATALOG_ITEMS.find(item => item.id === 'chat-starters')?.group).toBe('Patterns')
})

it('returns the caret to the end after attaching multiple files and completing uploads', async () => {
  mount(<EditAgentSessionExample />)
  const query = within(screen.getByRole('region', { name: 'Edit Agent chat session' }))
  const editor = query.getByRole('textbox', { name: 'Edit Agent message' })
  const expectCaretAtEnd = () => {
    expect(document.activeElement).toBe(editor)
    const end = document.createRange()
    end.selectNodeContents(editor)
    end.collapse(false)
    const range = window.getSelection()!.getRangeAt(0)
    expect(range.collapsed).toBe(true)
    expect(range.compareBoundaryPoints(Range.START_TO_START, end)).toBe(0)
  }
  fireEvent.click(query.getByRole('button', { name: 'Add sample document' }))
  fireEvent.click(query.getByRole('button', { name: 'Add sample image' }))
  await waitFor(expectCaretAtEnd)
  expect(editor.querySelectorAll('[aria-busy="true"]')).toHaveLength(2)
  fireEvent.click(query.getByRole('button', { name: 'Complete uploads' }))
  await waitFor(expectCaretAtEnd)
})

it('indexes each public UI component and excludes helpers from gallery coverage', () => {
  const infrastructure = new Set(['ChatUiProvider'])
  const exportedUi = Object.keys(source).filter(name => /^[A-Z]/.test(name) && !/^[A-Z_]+$/.test(name) && !infrastructure.has(name))
  expect(Object.values(CHAT_PREVIEW_COMPONENTS).flat().sort()).toEqual(exportedUi.sort())
})
it('uses the production rich editor and moves from sending to stopping in the preview', () => {
  mount(<ChatComposerExamples />)
  const editor = screen.getByRole('textbox', { name: 'Message' })
  expect(editor).toHaveAttribute('contenteditable', 'true')
  expect(screen.getByRole('button', { name: 'Send message' })).toBeDisabled()
  editor.textContent = 'Review my report'
  fireEvent.input(editor)
  fireEvent.keyDown(editor, { key: 'Enter' })
  expect(screen.getByRole('status')).toHaveTextContent('Review my report')
  fireEvent.click(screen.getByRole('button', { name: 'Stop generation' }))
  expect(screen.getByRole('button', { name: 'Send message' })).toBeDisabled()
  fireEvent.click(screen.getByRole('button', { name: 'Add sample file' }))
  expect(screen.getByText('Weekly report.pdf')).toBeVisible()
})
it('submits a structured form once, then allows reset', async () => {
  mount(<ChatCardExamples />)
  fireEvent.change(screen.getByDisplayValue('Weekly report'), { target: { value: 'October summary' } })
  fireEvent.click(screen.getByRole('button', { name: 'Apply preferences' }))
  await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('October summary'))
  fireEvent.click(screen.getByRole('button', { name: 'Reset card actions' }))
  expect(screen.getByDisplayValue('Weekly report')).toBeVisible()
})
it('selects a real starter prompt and opens the skill store', () => {
  const { unmount } = mount(<ChatStarterExamples />)
  fireEvent.click(screen.getByText('Research the market'))
  expect(screen.getByRole('status')).toHaveTextContent('Compare this week’s market trends')
  unmount()
  mount(<ChatPickerExamples />)
  fireEvent.click(screen.getByRole('button', { name: 'Open skill store' }))
  expect(screen.getByRole('dialog')).toHaveTextContent('Market research')
})


it('opens the product add menu before invoking the native file picker', () => {
  const picker = vi.spyOn(HTMLInputElement.prototype, 'click').mockImplementation(() => {})
  try {
    mount(<ChatComposerExamples />)
    fireEvent.keyDown(screen.getByRole('button', { name: 'Add files and more' }), { key: 'ArrowDown', code: 'ArrowDown' })
    expect(screen.getByRole('menuitem', { name: 'Add from local files' })).toBeVisible()
    expect(screen.getByRole('menuitem', { name: 'Recent files' })).toBeVisible()
    expect(screen.getByRole('menuitem', { name: 'Use Skills' })).toBeVisible()
    expect(screen.getByRole('menuitem', { name: 'Connectors' })).toBeVisible()
    expect(picker).not.toHaveBeenCalled()
    fireEvent.click(screen.getByRole('menuitem', { name: 'Add from local files' }))
    expect(picker).toHaveBeenCalledOnce()
  } finally { picker.mockRestore() }
})

it('shows the sent message variants and opens the actual document content', () => {
  mount(<ChatMessageExamples />)
  const gallery = within(screen.getByRole('region', { name: 'Sent message examples' }))
  expect(gallery.getAllByTestId('genclaw-user-message')).toHaveLength(6)
  const imageOnly = within(gallery.getByRole('heading', { name: 'Image only' }).closest('section')!)
  expect(imageOnly.getByTestId('genclaw-mm-image-attachment')).toBeVisible()
  expect(imageOnly.queryByTestId('genclaw-user-message-content')).not.toBeInTheDocument()
  const documentExample = within(gallery.getByRole('heading', { name: 'Document' }).closest('section')!)
  fireEvent.click(documentExample.getByRole('button', { name: /weekly-report.txt/ }))
  expect(screen.getByRole('dialog')).toHaveTextContent('Weekly research summary')
})

it('shows the real session activity and replaces it with connection feedback', () => {
  mount(<ChatActivityExamples />)
  expect(screen.getByTestId('chat-thread-activity')).toHaveTextContent('Thinking')
  expect(screen.getByLabelText('Loading messages')).toBeVisible()
  expect(screen.getAllByTestId('genclaw-loading')).toHaveLength(2)
  fireEvent.click(screen.getByRole('button', { name: 'Reconnecting' }))
  expect(screen.queryByTestId('chat-thread-activity')).not.toBeInTheDocument()
  expect(screen.getByText('Reconnecting…')).toHaveClass('shimmer-neutral')
  fireEvent.click(screen.getByRole('button', { name: 'Reconnecting' }))
  fireEvent.click(screen.getByRole('button', { name: 'Stop generation' }))
  expect(screen.queryByTestId('chat-thread-activity')).not.toBeInTheDocument()
})

it('keeps the Edit Agent quote through an image upload, then sends an image-only reply and can stop', () => {
  mount(<ChatSessionExamples />)
  const session = screen.getByRole('region', { name: 'Edit Agent chat session' })
  const query = within(session)
  fireEvent.click(query.getByRole('button', { name: 'Reply' }))
  expect(query.getByRole('button', { name: 'Clear reply' }).parentElement).toHaveTextContent('Market Brief')
  fireEvent.click(query.getByRole('button', { name: 'Add sample image' }))
  const editor = query.getByRole('textbox', { name: 'Edit Agent message' })
  expect(editor.querySelector('[aria-busy="true"]')).toHaveAccessibleName('preview-image.png, Uploading…')
  expect(query.getByRole('button', { name: 'Send to preview agent' })).toBeDisabled()
  fireEvent.keyDown(editor, { key: 'Enter' })
  expect(query.queryByTestId('genclaw-user-message')).not.toBeInTheDocument()
  fireEvent.click(query.getByRole('button', { name: 'Complete uploads' }))
  expect(editor.querySelector('[aria-busy="true"]')).not.toBeInTheDocument()
  expect(editor.querySelector('[data-image-hover-preview] img')).toHaveAttribute('alt', 'preview-image.png')
  expect(query.getByRole('button', { name: 'Clear reply' })).toBeVisible()
  fireEvent.click(query.getByRole('button', { name: 'Send to preview agent' }))
  expect(query.queryByRole('button', { name: 'Clear reply' })).not.toBeInTheDocument()
  expect(query.getByTestId('genclaw-user-message')).toHaveTextContent('Market Brief')
  expect(query.getByTestId('genclaw-mm-image-attachment')).toHaveAttribute('alt', 'preview-image.png')
  expect(query.getByTestId('chat-thread-activity')).toHaveTextContent('Thinking')
  fireEvent.click(query.getByRole('button', { name: 'Stop preview response' }))
  expect(query.queryByTestId('chat-thread-activity')).not.toBeInTheDocument()
  expect(query.getByRole('button', { name: 'Send to preview agent' })).toBeDisabled()
})

it('completes an Edit Agent response and preserves the draft when a quote is cleared', () => {
  mount(<ChatSessionExamples />)
  const query = within(screen.getByRole('region', { name: 'Edit Agent chat session' }))
  fireEvent.click(query.getByRole('button', { name: 'Reply' }))
  const editor = query.getByRole('textbox', { name: 'Edit Agent message' })
  editor.textContent = 'Look at the weekly trend'
  fireEvent.input(editor)
  fireEvent.click(query.getByRole('button', { name: 'Clear reply' }))
  expect(editor).toHaveTextContent('Look at the weekly trend')
  fireEvent.keyDown(editor, { key: 'Enter' })
  fireEvent.click(query.getByRole('button', { name: 'Complete preview response' }))
  expect(query.queryByTestId('chat-thread-activity')).not.toBeInTheDocument()
  expect(query.getAllByTestId('genclaw-bot-message')).toHaveLength(2)
  expect(query.getByRole('button', { name: 'Send to preview agent' })).toBeDisabled()
})

it('uses a selected local image for the upload chip and sent message, then releases its preview URL', () => {
  const createObjectURL = vi.fn(() => 'blob:local-selected-image')
  const revokeObjectURL = vi.fn()
  class LocalPreviewURL extends URL {
    static createObjectURL = createObjectURL
    static revokeObjectURL = revokeObjectURL
  }
  vi.stubGlobal('URL', LocalPreviewURL)
  try {
    const { unmount } = mount(<ChatSessionExamples />)
    const session = screen.getByRole('region', { name: 'Edit Agent chat session' })
    const query = within(session)
    const file = new File(['image fixture'], 'selected-image.png', { type: 'image/png' })
    fireEvent.change(session.querySelector('input[type="file"]')!, { target: { files: [file] } })
    expect(createObjectURL).toHaveBeenCalledWith(file)
    expect(query.getByRole('textbox', { name: 'Edit Agent message' }).querySelector('[aria-busy="true"]')).toHaveAccessibleName('selected-image.png, Uploading…')
    fireEvent.click(query.getByRole('button', { name: 'Complete uploads' }))
    fireEvent.click(query.getByRole('button', { name: 'Send to preview agent' }))
    expect(query.getByTestId('genclaw-mm-image-attachment')).toHaveAttribute('src', 'blob:local-selected-image')
    expect(revokeObjectURL).not.toHaveBeenCalled()
    unmount()
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:local-selected-image')
  } finally {
    cleanup()
    vi.unstubAllGlobals()
  }
})

it('uploads a document and sends it with text as a real file attachment', () => {
  mount(<EditAgentSessionExample />)
  const query = within(screen.getByRole('region', { name: 'Edit Agent chat session' }))
  fireEvent.click(query.getByRole('button', { name: 'Add sample document' }))
  const editor = query.getByRole('textbox', { name: 'Edit Agent message' })
  expect(editor.querySelector('[data-file-reference][aria-busy="true"]')).toHaveAccessibleName('weekly-report.txt, Uploading…')
  fireEvent.keyDown(editor, { key: 'Enter' })
  expect(query.queryByTestId('genclaw-user-message')).not.toBeInTheDocument()
  fireEvent.click(query.getByRole('button', { name: 'Complete uploads' }))
  const text = document.createTextNode(' Please review this file.')
  editor.appendChild(text)
  fireEvent.input(editor)
  fireEvent.click(query.getByRole('button', { name: 'Send to preview agent' }))
  const message = query.getByTestId('genclaw-user-message')
  expect(message).toHaveTextContent('weekly-report.txt')
  expect(message).toHaveTextContent('Please review this file.')
  fireEvent.click(within(message).getByRole('button', { name: /weekly-report.txt/ }))
  expect(screen.getByRole('dialog')).toHaveTextContent('Weekly research summary')
})

it('sends the editable document comparison and allows a failed attachment to retry', () => {
  mount(<ChatAttachmentExamples />)
  const documentExample = within(screen.getByRole('heading', { name: 'Document' }).closest('section')!)
  const editor = documentExample.getByRole('textbox', { name: 'Document before sending' })
  editor.appendChild(document.createTextNode(' Please review.'))
  fireEvent.input(editor)
  fireEvent.click(documentExample.getByRole('button', { name: 'Send document example' }))
  expect(documentExample.getByTestId('genclaw-user-message')).toHaveTextContent('Please review.')
  expect(documentExample.getByRole('button', { name: /weekly-report.txt/ })).toBeVisible()
  expect(editor).toHaveTextContent('')
  fireEvent.click(screen.getByRole('button', { name: /Retry attachment/ }))
  expect(screen.queryByRole('button', { name: /Retry attachment/ })).not.toBeInTheDocument()
})

it('removes image and document references directly from the comparison editors', () => {
  mount(<ChatAttachmentExamples />)
  for (const name of ['Image', 'Document']) {
    const sample = within(screen.getByRole('heading', { name }).closest('section')!)
    const editor = sample.getByRole('textbox', { name: `${name} before sending` })
    fireEvent.click(within(editor).getByRole('button', { name: 'Remove attachment' }))
    expect(editor.querySelector('.rich-text-media')).toBeNull()
    expect(sample.getByRole('button', { name: name === 'Image' ? 'Send image example' : 'Send document example' })).toBeDisabled()
  }
})

it('sends mixed image and document attachments, then resets the conversation', () => {
  mount(<ChatSessionExamples />)
  const query = within(screen.getByRole('region', { name: 'Edit Agent chat session' }))
  fireEvent.click(query.getByRole('button', { name: 'Add sample image' }))
  fireEvent.click(query.getByRole('button', { name: 'Add sample document' }))
  const editor = query.getByRole('textbox', { name: 'Edit Agent message' })
  expect(editor.querySelectorAll('[aria-busy="true"]')).toHaveLength(2)
  expect(query.getByRole('button', { name: 'Send to preview agent' })).toBeDisabled()
  fireEvent.click(query.getByRole('button', { name: 'Complete uploads' }))
  fireEvent.click(query.getByRole('button', { name: 'Send to preview agent' }))
  const message = within(query.getByTestId('genclaw-user-message'))
  expect(message.getByTestId('genclaw-mm-image-attachment')).toHaveAttribute('alt', 'preview-image.png')
  expect(message.getByRole('button', { name: /weekly-report.txt/ })).toBeVisible()
  expect(message.queryByTestId('genclaw-user-message-content')).not.toBeInTheDocument()
  fireEvent.click(query.getByRole('button', { name: 'Reset conversation' }))
  expect(query.queryByTestId('genclaw-user-message')).not.toBeInTheDocument()
  expect(query.queryByTestId('chat-thread-activity')).not.toBeInTheDocument()
  expect(query.getByRole('button', { name: 'Send to preview agent' })).toBeDisabled()
})
