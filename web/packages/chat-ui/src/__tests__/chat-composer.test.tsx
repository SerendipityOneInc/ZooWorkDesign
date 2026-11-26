// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { ChatComposer, QUOTE_MAX_CHARS, truncateQuoteText, type RichTextInputProps } from '../index'

afterEach(cleanup)

const TEST_IDS = {
  root: 'composer-root',
  fileInput: 'composer-file-input',
  attachments: 'composer-attachments',
  attachment: 'composer-attachment',
  attachmentRemove: 'composer-attachment-remove',
  attachmentRetry: 'composer-attachment-retry',
  editor: 'composer-editor',
  attachButton: 'composer-attach',
  submitButton: 'composer-submit',
  stopButton: 'composer-stop',
  quote: 'composer-quote',
  status: 'composer-status',
  card: 'composer-card',
  banner: 'composer-banner',
  toolbarStart: 'composer-toolbar-start',
  toolbarEnd: 'composer-toolbar-end',
}

describe('ChatComposer controlled presentation contract', () => {
  it('renders application actions in stable toolbar groups without replacing send', () => {
    render(
      <ChatComposer
        value="ready"
        onChange={() => {}}
        onSubmit={() => {}}
        attachmentAction={<button type="button">Add</button>}
        toolbarEndAction={<button type="button">Model</button>}
        testIds={TEST_IDS}
      />,
    )

    expect(screen.getByTestId(TEST_IDS.toolbarStart).textContent).toContain('Add')
    expect(screen.getByTestId(TEST_IDS.toolbarEnd).textContent).toContain('Model')
    expect(screen.getByTestId(TEST_IDS.submitButton)).toBeTruthy()
  })

  it('lets an application style the package-owned send button', () => {
    render(
      <ChatComposer
        value="ready"
        onChange={() => {}}
        onSubmit={() => {}}
        classNames={{ sendButton: 'application-send-button' }}
        testIds={TEST_IDS}
      />,
    )

    expect(screen.getByTestId(TEST_IDS.submitButton).className.split(/\s+/)).toContain('application-send-button')
  })

  it('uses the rich-text editor and emits a normalized submit without owning value state', () => {
    const onChange = vi.fn()
    const onSubmit = vi.fn()

    render(<ChatComposer value="  deploy report  " onChange={onChange} onSubmit={onSubmit} testIds={TEST_IDS} />)

    const editor = screen.getByTestId(TEST_IDS.editor)
    expect(editor.getAttribute('contenteditable')).toBe('true')

    fireEvent.keyDown(editor, { key: 'Enter' })

    expect(onSubmit).toHaveBeenCalledWith({ value: 'deploy report' })
    expect(onChange).not.toHaveBeenCalled()
  })

  it('exposes a caller-defined accessible name for the editor', () => {
    render(
      <ChatComposer
        value=""
        onChange={() => {}}
        onSubmit={() => {}}
        inputAriaLabel="Message ZooClaw"
        labels={{ inputPlaceholder: 'Type here…' }}
        testIds={TEST_IDS}
      />,
    )

    const editor = screen.getByRole('textbox', { name: 'Message ZooClaw' })
    expect(editor.getAttribute('aria-multiline')).toBe('true')
  })

  it('lets the caller explicitly control attachment-only submit eligibility', () => {
    const onSubmit = vi.fn()
    const { rerender } = render(
      <ChatComposer value="" onChange={() => {}} onSubmit={onSubmit} submitDisabled={false} testIds={TEST_IDS} />,
    )

    fireEvent.click(screen.getByTestId(TEST_IDS.submitButton))
    expect(onSubmit).toHaveBeenCalledWith({ value: '' })

    rerender(<ChatComposer value="ready" onChange={() => {}} onSubmit={onSubmit} submitDisabled testIds={TEST_IDS} />)
    fireEvent.click(screen.getByTestId(TEST_IDS.submitButton))
    expect(onSubmit).toHaveBeenCalledTimes(1)
  })

  it('renders banner, status, quote, and pre-card content from props', () => {
    const onClearQuote = vi.fn()

    render(
      <ChatComposer
        value="hello"
        onChange={() => {}}
        onSubmit={() => {}}
        banner={{ title: 'Storage risk', description: 'Only 12% remains' }}
        status={{ kind: 'connection', text: 'Reconnecting' }}
        quote={{ label: 'Reply', text: 'Earlier message', clearLabel: 'Clear reply' }}
        onClearQuote={onClearQuote}
        beforeCard={<div>Quick actions</div>}
      />,
    )

    expect(screen.getByText('Storage risk')).toBeTruthy()
    expect(screen.getByText('Only 12% remains')).toBeTruthy()
    expect(screen.getByText('Reconnecting')).toBeTruthy()
    expect(screen.getByText('Earlier message')).toBeTruthy()
    expect(screen.getByText('Quick actions')).toBeTruthy()

    fireEvent.click(screen.getByRole('button', { name: 'Clear reply' }))
    expect(onClearQuote).toHaveBeenCalledOnce()
  })

  it('truncates the quote preview at the shared quote limit', () => {
    // The preview must equal what the app prepends as a `> ` blockquote on send,
    // so both sides go through truncateQuoteText / QUOTE_MAX_CHARS.
    render(
      <ChatComposer
        value=""
        onChange={() => {}}
        onSubmit={() => {}}
        quote={{ text: 'q'.repeat(QUOTE_MAX_CHARS + 60) }}
        testIds={TEST_IDS}
      />,
    )

    const preview = screen.getByTestId(TEST_IDS.quote).textContent ?? ''
    expect(preview).toContain(truncateQuoteText('q'.repeat(QUOTE_MAX_CHARS + 60)))
    expect(preview).not.toContain('q'.repeat(QUOTE_MAX_CHARS + 1))
  })

  it('keeps astral characters whole when truncating the quote preview', () => {
    render(
      <ChatComposer
        value=""
        onChange={() => {}}
        onSubmit={() => {}}
        quote={{ text: '🙂'.repeat(QUOTE_MAX_CHARS + 10) }}
        testIds={TEST_IDS}
      />,
    )

    const preview = screen.getByTestId(TEST_IDS.quote).textContent ?? ''
    expect(preview).toContain(`${'🙂'.repeat(QUOTE_MAX_CHARS)}…`)
    // A UTF-16 slice would leave a lone surrogate here.
    expect(preview).not.toMatch(/[\uD800-\uDBFF](?![\uDC00-\uDFFF])/)
  })

  it('keeps a composite emoji whole when truncating the quote preview', () => {
    const quote = `${'q'.repeat(QUOTE_MAX_CHARS - 1)}👨‍👩‍👧‍👦tail`
    render(<ChatComposer value="" onChange={() => {}} onSubmit={() => {}} quote={{ text: quote }} testIds={TEST_IDS} />)

    const preview = screen.getByTestId(TEST_IDS.quote).textContent ?? ''
    expect(preview).toContain(`${'q'.repeat(QUOTE_MAX_CHARS - 1)}👨‍👩‍👧‍👦…`)
  })

  it('renders attachment state and forwards open, retry, and remove events', () => {
    const onOpenAttachment = vi.fn()
    const onRetryAttachment = vi.fn()
    const onRemoveAttachment = vi.fn()

    render(
      <ChatComposer
        value=""
        onChange={() => {}}
        onSubmit={() => {}}
        attachments={[
          {
            id: 'file-1',
            name: 'brief.pdf',
            size: 2048,
            status: 'error',
            statusLabel: 'Network failed',
            previewUrl: 'blob:brief-preview',
          },
        ]}
        onOpenAttachment={onOpenAttachment}
        onRetryAttachment={onRetryAttachment}
        onRemoveAttachment={onRemoveAttachment}
        testIds={TEST_IDS}
      />,
    )

    expect(screen.getByTestId(TEST_IDS.attachments)).toBeTruthy()
    expect(screen.getByAltText('brief.pdf')).toBeTruthy()
    expect(screen.getByText('Network failed')).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'Preview brief.pdf' }))
    fireEvent.click(screen.getByTestId(TEST_IDS.attachmentRetry))
    fireEvent.click(screen.getByTestId(TEST_IDS.attachmentRemove))

    expect(onOpenAttachment).toHaveBeenCalledWith('file-1')
    expect(onRetryAttachment).toHaveBeenCalledWith('file-1')
    expect(onRemoveAttachment).toHaveBeenCalledWith('file-1')
  })

  it('lets attachment state disable retry for non-retryable failures', () => {
    render(
      <ChatComposer
        value=""
        onChange={() => {}}
        onSubmit={() => {}}
        attachments={[
          {
            id: 'file-1',
            name: 'expired.txt',
            status: 'error',
            statusLabel: 'Session expired',
            canRetry: false,
          },
        ]}
        onRetryAttachment={() => {}}
      />,
    )

    expect(screen.getByText('Session expired')).toBeTruthy()
    expect(screen.queryByRole('button', { name: 'Retry attachment' })).toBeNull()
  })

  it('renders main attachments as 88px thumbnail cards', () => {
    render(
      <ChatComposer
        value=""
        onChange={() => {}}
        onSubmit={() => {}}
        variant="main"
        attachments={[
          {
            id: 'image-1',
            name: 'status.png',
            size: 2048,
            status: 'ready',
            previewUrl: 'blob:status-preview',
          },
        ]}
        onRemoveAttachment={() => {}}
        testIds={TEST_IDS}
      />,
    )

    const preview = screen.getByAltText('status.png')
    expect(preview.className.split(/\s+/)).toEqual(expect.arrayContaining(['h-[88px]', 'w-[88px]', 'object-cover']))
    expect(screen.queryByText('2 KB')).toBeNull()
    expect(screen.getByTestId(TEST_IDS.attachmentRemove).className.split(/\s+/)).toEqual(
      expect.arrayContaining(['absolute', '-top-1.5', '-right-1.5', 'h-5', 'w-5', 'rounded-full']),
    )
  })

  it('renders main document attachments with the legacy filename and extension tile', () => {
    render(
      <ChatComposer
        value=""
        onChange={() => {}}
        onSubmit={() => {}}
        variant="main"
        attachments={[{ id: 'file-1', name: 'quarterly-report.pdf', status: 'ready', canOpen: true }]}
        onOpenAttachment={() => {}}
        testIds={TEST_IDS}
      />,
    )

    expect(screen.getByText('quarterly-report.pdf').className.split(/\s+/)).toEqual(
      expect.arrayContaining(['text-foreground', 'line-clamp-3', 'text-[11px]', 'leading-snug', 'break-all']),
    )
    expect(screen.getByText('PDF').className.split(/\s+/)).toEqual(
      // `bg-card` (not a hardcoded `bg-white`) so the badge follows the dark theme.
      expect.arrayContaining([
        'border-border',
        'text-muted-foreground',
        'bg-card',
        'rounded-[4px]',
        'text-[10px]',
        'font-semibold',
      ]),
    )
    expect(screen.getByRole('button', { name: 'Preview quarterly-report.pdf' }).className.split(/\s+/)).toEqual(
      expect.arrayContaining(['border-border', 'bg-muted', 'hover:border-ecap-primary']),
    )
  })

  it('renders retryable main attachment failures as a thumbnail overlay', () => {
    const onRetryAttachment = vi.fn()
    render(
      <ChatComposer
        value=""
        onChange={() => {}}
        onSubmit={() => {}}
        variant="main"
        attachments={[
          {
            id: 'file-1',
            name: 'quarterly-report.pdf',
            status: 'error',
            statusLabel: 'Retry',
          },
        ]}
        onRetryAttachment={onRetryAttachment}
        testIds={TEST_IDS}
      />,
    )

    const retry = screen.getByTestId(TEST_IDS.attachmentRetry)
    expect(retry.className.split(/\s+/)).toEqual(
      expect.arrayContaining(['bg-white/20', 'px-1.5', 'py-0.5', 'text-[9px]', 'text-white']),
    )
    expect(screen.getByText('Retry')).toBeTruthy()
    fireEvent.click(retry)
    expect(onRetryAttachment).toHaveBeenCalledWith('file-1')
  })

  it('renders the injected file-type icon inside the main thumbnail tile', () => {
    render(
      <ChatComposer
        value=""
        onChange={() => {}}
        onSubmit={() => {}}
        variant="main"
        attachments={[{ id: 'file-1', name: 'quarterly-report.pdf', status: 'ready' }]}
        renderAttachmentTypeIcon={({ attachment, presentation }) => (
          <span data-testid="type-icon" data-name={attachment.name} data-presentation={presentation} />
        )}
        testIds={TEST_IDS}
      />,
    )

    const icon = screen.getByTestId('type-icon')
    expect(icon.getAttribute('data-name')).toBe('quarterly-report.pdf')
    expect(icon.getAttribute('data-presentation')).toBe('thumbnail')
    expect(icon.parentElement?.className.split(/\s+/)).toEqual(
      expect.arrayContaining(['flex', 'flex-1', 'items-center', 'justify-center']),
    )
    // The extension badge stays as secondary information next to the icon.
    expect(screen.getByText('PDF')).toBeTruthy()
    expect(screen.getByText('quarterly-report.pdf').className.split(/\s+/)).toEqual(
      expect.arrayContaining(['line-clamp-1']),
    )
  })

  it('renders the injected file-type icon in the inline chip preview slot', () => {
    render(
      <ChatComposer
        value=""
        onChange={() => {}}
        onSubmit={() => {}}
        variant="compact"
        attachments={[{ id: 'file-1', name: 'notes.md', status: 'ready' }]}
        renderAttachmentTypeIcon={({ presentation }) => (
          <span data-testid="type-icon" data-presentation={presentation} />
        )}
        testIds={TEST_IDS}
      />,
    )

    const icon = screen.getByTestId('type-icon')
    expect(icon.getAttribute('data-presentation')).toBe('inline')
    expect(icon.parentElement?.className.split(/\s+/)).toEqual(
      expect.arrayContaining(['size-5', 'shrink-0', 'items-center', 'justify-center']),
    )
  })

  it('keeps the image preview instead of a file-type icon when the attachment has one', () => {
    render(
      <ChatComposer
        value=""
        onChange={() => {}}
        onSubmit={() => {}}
        variant="main"
        attachments={[{ id: 'image-1', name: 'status.png', status: 'ready', previewUrl: 'blob:status-preview' }]}
        renderAttachmentTypeIcon={() => <span data-testid="type-icon" />}
        testIds={TEST_IDS}
      />,
    )

    expect(screen.queryByTestId('type-icon')).toBeNull()
    expect(screen.getByAltText('status.png')).toBeTruthy()
  })

  it('keeps the failure overlay legible above the thumbnail file-type icon', () => {
    render(
      <ChatComposer
        value=""
        onChange={() => {}}
        onSubmit={() => {}}
        variant="main"
        attachments={[{ id: 'file-1', name: 'quarterly-report.pdf', status: 'error', statusLabel: 'Retry' }]}
        renderAttachmentTypeIcon={() => <span data-testid="type-icon" />}
        onRetryAttachment={() => {}}
        testIds={TEST_IDS}
      />,
    )

    expect(screen.getByTestId('type-icon')).toBeTruthy()
    const overlay = screen.getByTestId(TEST_IDS.attachmentRetry).parentElement
    expect(overlay?.className.split(/\s+/)).toEqual(
      expect.arrayContaining(['absolute', 'inset-0', 'bg-destructive/40', 'rounded-[10px]']),
    )
  })

  it('renders main attachment upload progress over the thumbnail', () => {
    render(
      <ChatComposer
        value=""
        onChange={() => {}}
        onSubmit={() => {}}
        variant="main"
        attachments={[{ id: 'file-1', name: 'quarterly-report.pdf', status: 'uploading' }]}
        testIds={TEST_IDS}
      />,
    )

    const overlay = screen.getByTestId(TEST_IDS.attachment).querySelector('[data-attachment-uploading="true"]')
    expect(overlay).not.toBeNull()
    expect(overlay?.className.split(/\s+/)).toEqual(
      expect.arrayContaining(['absolute', 'inset-0', 'rounded-[10px]', 'bg-black/40']),
    )
    expect(overlay?.querySelector('.animate-spin')?.className.split(/\s+/)).toEqual(
      expect.arrayContaining(['h-5', 'w-5', 'border-2', 'border-white', 'border-t-transparent']),
    )
  })

  it('only exposes main attachment preview interaction when the attachment is openable', () => {
    const onOpenAttachment = vi.fn()
    render(
      <ChatComposer
        value=""
        onChange={() => {}}
        onSubmit={() => {}}
        variant="main"
        attachments={[
          {
            id: 'image-1',
            name: 'status.png',
            status: 'ready',
            previewUrl: 'blob:status-preview',
            canOpen: false,
          },
        ]}
        onOpenAttachment={onOpenAttachment}
      />,
    )

    expect(screen.queryByRole('button', { name: 'Preview status.png' })).toBeNull()
    fireEvent.click(screen.getByAltText('status.png'))
    expect(onOpenAttachment).not.toHaveBeenCalled()
  })

  it('forwards selected files and resets the hidden input', () => {
    const onAttachFiles = vi.fn()
    render(
      <ChatComposer
        value=""
        onChange={() => {}}
        onSubmit={() => {}}
        onAttachFiles={onAttachFiles}
        acceptFileTypes="image/*,.pdf"
        testIds={TEST_IDS}
      />,
    )

    const file = new File(['brief'], 'brief.pdf', { type: 'application/pdf' })
    const input = screen.getByTestId(TEST_IDS.fileInput) as HTMLInputElement
    expect(input.accept).toBe('image/*,.pdf')
    fireEvent.change(input, { target: { files: [file] } })

    expect(onAttachFiles).toHaveBeenCalledWith([file])
    expect(input.value).toBe('')
  })

  it('lets a custom attachment action open the package-owned file picker', () => {
    const inputClick = vi.spyOn(HTMLInputElement.prototype, 'click').mockImplementation(() => {})

    render(
      <ChatComposer
        value=""
        onChange={() => {}}
        onSubmit={() => {}}
        onAttachFiles={() => {}}
        attachmentAction={({ openFilePicker, disabled }) => (
          <button type="button" disabled={disabled} onClick={openFilePicker}>
            Recent uploads
          </button>
        )}
        testIds={TEST_IDS}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Recent uploads' }))

    expect(inputClick).toHaveBeenCalledOnce()
    inputClick.mockRestore()
  })

  it.each([
    ['Windows', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Edg/141.0', null],
    ['macOS', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)', 'image/*,.zip'],
    ['Android', 'Mozilla/5.0 (Linux; Android 14)', 'image/*,.zip'],
  ])('opens the native picker with the appropriate filter on %s', (_platform, userAgent, expectedAccept) => {
    const userAgentSpy = vi.spyOn(navigator, 'userAgent', 'get').mockReturnValue(userAgent)
    const onAttachFiles = vi.fn()
    const inputClick = vi.spyOn(HTMLInputElement.prototype, 'click').mockImplementation(function (this: HTMLInputElement) {
      // Inspect at click time, when the browser builds the native dialog.
      expect(this.getAttribute('accept')).toBe(expectedAccept)
    })

    try {
      render(
        <ChatComposer
          value=""
          onChange={() => {}}
          onSubmit={() => {}}
          onAttachFiles={onAttachFiles}
          acceptFileTypes="image/*,.zip"
          testIds={TEST_IDS}
        />,
      )

      fireEvent.click(screen.getByTestId(TEST_IDS.attachButton))
      expect(inputClick).toHaveBeenCalledOnce()

      const input = screen.getByTestId(TEST_IDS.fileInput) as HTMLInputElement
      const files = [
        new File(['drawing'], 'drawing.png', { type: 'image/png' }),
        new File(['archive'], 'drawings.zip', { type: 'application/zip' }),
      ]
      fireEvent.change(input, { target: { files } })
      expect(onAttachFiles).toHaveBeenCalledWith(files)
      expect(input.value).toBe('')

      // Selecting the same files again must still open the picker.
      fireEvent.click(screen.getByTestId(TEST_IDS.attachButton))
      expect(inputClick).toHaveBeenCalledTimes(2)
    } finally {
      inputClick.mockRestore()
      userAgentSpy.mockRestore()
    }
  })

  it('guards the package-owned file picker while attachments are disabled', () => {
    const inputClick = vi.spyOn(HTMLInputElement.prototype, 'click').mockImplementation(() => {})

    render(
      <ChatComposer
        value=""
        onChange={() => {}}
        onSubmit={() => {}}
        onAttachFiles={() => {}}
        attachDisabled
        attachmentAction={({ openFilePicker, disabled }) => (
          <button type="button" aria-disabled={disabled} onClick={openFilePicker}>
            Recent uploads
          </button>
        )}
        testIds={TEST_IDS}
      />,
    )

    const action = screen.getByRole('button', { name: 'Recent uploads' })
    expect(action.getAttribute('aria-disabled')).toBe('true')
    fireEvent.click(action)
    expect(inputClick).not.toHaveBeenCalled()
    inputClick.mockRestore()
  })

  it('renders caller-owned toolbar content and swaps submit for stop while generating', () => {
    const onStop = vi.fn()
    const { rerender } = render(
      <ChatComposer
        value="hello"
        onChange={() => {}}
        onSubmit={() => {}}
        attachmentAction={<button type="button">Recent uploads</button>}
        isGenerating
        onStop={onStop}
        testIds={TEST_IDS}
      />,
    )

    expect(screen.getByRole('button', { name: 'Recent uploads' })).toBeTruthy()
    expect(screen.queryByTestId(TEST_IDS.submitButton)).toBeNull()
    fireEvent.click(screen.getByTestId(TEST_IDS.stopButton))
    expect(onStop).toHaveBeenCalledOnce()

    rerender(
      <ChatComposer
        value="hello"
        onChange={() => {}}
        onSubmit={() => {}}
        attachmentAction={<button type="button">Recent uploads</button>}
        testIds={TEST_IDS}
      />,
    )
    expect(screen.getByTestId(TEST_IDS.submitButton)).toBeTruthy()
    expect(screen.queryByTestId(TEST_IDS.stopButton)).toBeNull()
  })

  it('swallows Enter while generating instead of inserting a newline into the editor', () => {
    const onSubmit = vi.fn()
    render(
      <ChatComposer
        value="hello"
        onChange={() => {}}
        onSubmit={onSubmit}
        isGenerating
        onStop={() => {}}
        testIds={TEST_IDS}
      />,
    )

    const editor = screen.getByTestId(TEST_IDS.editor)
    // fireEvent returns false once preventDefault() ran — the browser inserts nothing.
    expect(fireEvent.keyDown(editor, { key: 'Enter' })).toBe(false)
    expect(onSubmit).not.toHaveBeenCalled()
    // Shift+Enter is still a newline, even mid-stream.
    expect(fireEvent.keyDown(editor, { key: 'Enter', shiftKey: true })).toBe(true)
  })

  it('leaves an IME composition Enter untouched while generating', () => {
    const onSubmit = vi.fn()
    render(
      <ChatComposer
        value="你好"
        onChange={() => {}}
        onSubmit={onSubmit}
        isGenerating
        onStop={() => {}}
        testIds={TEST_IDS}
      />,
    )

    const editor = screen.getByTestId(TEST_IDS.editor)
    fireEvent.compositionStart(editor)
    // The IME must keep the commit Enter: preventDefault here would strand preedit text.
    expect(fireEvent.keyDown(editor, { key: 'Enter', isComposing: true })).toBe(true)
    // Some IMEs report the commit as keyCode 229 after isComposing already reset.
    fireEvent.compositionEnd(editor, { data: '你好' })
    expect(fireEvent.keyDown(editor, { key: 'Enter', keyCode: 229, which: 229 })).toBe(true)
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('swallows Enter in a disabled composer without submitting', () => {
    const onSubmit = vi.fn()
    render(<ChatComposer value="hello" onChange={() => {}} onSubmit={onSubmit} disabled testIds={TEST_IDS} />)

    const editor = screen.getByTestId(TEST_IDS.editor)
    expect(editor.getAttribute('contenteditable')).toBe('false')
    expect(fireEvent.keyDown(editor, { key: 'Enter' })).toBe(false)
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('uses the supplied stop icon and handler during generation', () => {
    const onStop = vi.fn()
    render(
      <ChatComposer
        value="hello"
        onChange={() => {}}
        onSubmit={() => {}}
        variant="main"
        isGenerating
        onStop={onStop}
        stopIcon={<span data-testid="main-stop-icon" />}
        testIds={TEST_IDS}
      />,
    )

    const stop = screen.getByTestId(TEST_IDS.stopButton)
    expect(stop).toContainElement(screen.getByTestId('main-stop-icon'))
    expect(stop).not.toHaveTextContent('Stop')
    fireEvent.click(stop)
    expect(onStop).toHaveBeenCalledOnce()
  })

  it('renders the main composer quote with its custom icon and clear action', () => {
    const onClearQuote = vi.fn()
    render(
      <ChatComposer
        value=""
        onChange={() => {}}
        onSubmit={() => {}}
        variant="main"
        quote={{ text: 'Earlier message', icon: <span data-testid="main-quote-icon" /> }}
        onClearQuote={onClearQuote}
        testIds={TEST_IDS}
      />,
    )

    const quote = screen.getByTestId(TEST_IDS.quote)
    expect(quote.textContent).toContain('Earlier message')
    expect(quote.contains(screen.getByTestId('main-quote-icon'))).toBe(true)
    fireEvent.click(screen.getByRole('button', { name: 'Clear reply' }))
    expect(onClearQuote).toHaveBeenCalledOnce()
  })

  it('preserves the main composer connection-warning presentation and icon slot', () => {
    render(
      <ChatComposer
        value=""
        onChange={() => {}}
        onSubmit={() => {}}
        variant="main"
        status={{
          kind: 'connection',
          text: 'Reconnecting',
          icon: <span data-testid="main-connection-icon" />,
          textClassName: 'shimmer-claw',
        }}
        testIds={TEST_IDS}
      />,
    )

    expect(screen.getByTestId(TEST_IDS.status).className.split(/\s+/)).toEqual(
      expect.arrayContaining(['gap-2', 'text-ecap-caution-text']),
    )
    expect(screen.getByText('Reconnecting').className.split(/\s+/)).toEqual(
      expect.arrayContaining(['font-medium', 'shimmer-claw']),
    )
    expect(screen.getByTestId('main-connection-icon')).toBeTruthy()
  })

  it('renders a neutral main connection status without caution coloring', () => {
    render(
      <ChatComposer
        value=""
        onChange={() => {}}
        onSubmit={() => {}}
        variant="main"
        status={{ kind: 'connection', tone: 'neutral', text: 'Preparing Preview' }}
        testIds={TEST_IDS}
      />,
    )

    const status = screen.getByTestId(TEST_IDS.status)
    expect(status.className.split(/\s+/)).toEqual(expect.arrayContaining(['gap-2', 'text-ecap-preview-loading-text']))
    expect(status.className.split(/\s+/)).not.toContain('text-ecap-caution-text')
  })

  it('renders a neutral main typing status with the loading presentation', () => {
    render(
      <ChatComposer
        value=""
        onChange={() => {}}
        onSubmit={() => {}}
        variant="main"
        status={{ kind: 'typing', tone: 'neutral', text: 'Thinking…' }}
        testIds={TEST_IDS}
      />,
    )

    const status = screen.getByTestId(TEST_IDS.status)
    expect(status).toHaveClass('gap-2', 'text-ecap-preview-loading-text')
    expect(status).not.toHaveClass('text-ecap-caution-text')
  })

  it('renders a neutral compact activity status with the loading presentation', () => {
    render(
      <ChatComposer
        value=""
        onChange={() => undefined}
        onSubmit={() => undefined}
        variant="compact"
        status={{ kind: 'typing', text: 'Thinking…', tone: 'neutral', announce: true }}
        testIds={TEST_IDS}
      />,
    )

    expect(screen.getByTestId(TEST_IDS.status)).toHaveClass('text-ecap-preview-loading-text', 'gap-2')
    expect(screen.getByText('Thinking…')).toHaveClass('font-normal')
  })

  it('announces an explicitly opted-in activity status politely', () => {
    render(
      <ChatComposer
        value=""
        onChange={() => {}}
        onSubmit={() => {}}
        variant="main"
        status={{ kind: 'typing', tone: 'neutral', text: 'Thinking…', announce: true }}
        testIds={TEST_IDS}
      />,
    )

    const status = screen.getByTestId(TEST_IDS.status)
    expect(status).toHaveAttribute('role', 'status')
    expect(status).toHaveAttribute('aria-live', 'polite')
  })

  it('does not announce ordinary typing without the opt-in signal', () => {
    render(
      <ChatComposer
        value=""
        onChange={() => {}}
        onSubmit={() => {}}
        status={{ kind: 'typing', text: 'ZooClaw is typing' }}
        testIds={TEST_IDS}
      />,
    )

    const status = screen.getByTestId(TEST_IDS.status)
    expect(status).not.toHaveAttribute('role')
    expect(status).not.toHaveAttribute('aria-live')
  })

  it('keeps connection status as a polite live region', () => {
    render(
      <ChatComposer
        value=""
        onChange={() => {}}
        onSubmit={() => {}}
        status={{ kind: 'connection', text: 'Reconnecting' }}
        testIds={TEST_IDS}
      />,
    )

    const status = screen.getByTestId(TEST_IDS.status)
    expect(status).toHaveAttribute('role', 'status')
    expect(status).toHaveAttribute('aria-live', 'polite')
  })

  it('preserves the main composer typing-indicator color', () => {
    render(
      <ChatComposer
        value=""
        onChange={() => {}}
        onSubmit={() => {}}
        variant="main"
        status={{ kind: 'typing', text: 'ZooClaw is typing' }}
        testIds={TEST_IDS}
      />,
    )

    expect(screen.getByTestId(TEST_IDS.status).className.split(/\s+/)).toEqual(
      expect.arrayContaining(['text-muted-foreground']),
    )
  })

  it.each(['shell', 'main', 'compact', 'launcher'] as const)(
    'maps %s composer theme tokens into package color variables',
    (variant) => {
      render(<ChatComposer value="" onChange={() => {}} onSubmit={() => {}} variant={variant} testIds={TEST_IDS} />)

      const root = screen.getByTestId(TEST_IDS.root)
      expect(root.style.getPropertyValue('--chat-ui-border')).toBe('var(--border, #d4d4d4)')
      expect(root.style.getPropertyValue('--chat-ui-muted')).toBe('var(--muted, #f5f5f5)')
      expect(root.style.getPropertyValue('--chat-ui-muted-foreground')).toBe('var(--muted-foreground, #737373)')
      expect(root.style.getPropertyValue('--chat-ui-card')).toBe('var(--card, var(--chat-ui-assistant-bg, #ffffff))')
      expect(root.style.getPropertyValue('--chat-ui-assistant-bg')).toBe('var(--card, #ffffff)')
    },
  )

  it('keeps the editor and attachment strip together inside the main composer card', () => {
    render(
      <ChatComposer
        value=""
        onChange={() => {}}
        onSubmit={() => {}}
        variant="main"
        attachments={[{ id: 'file-1', name: 'notes.txt', status: 'ready' }]}
        testIds={TEST_IDS}
      />,
    )

    expect(screen.getByTestId(TEST_IDS.card)).toContainElement(screen.getByTestId(TEST_IDS.editor))
    expect(screen.getByTestId(TEST_IDS.card)).toContainElement(screen.getByTestId(TEST_IDS.attachments))
  })

  it('preserves the main composer storage-warning colors', () => {
    render(
      <ChatComposer
        value=""
        onChange={() => {}}
        onSubmit={() => {}}
        variant="main"
        banner={{ title: 'Storage risk', description: 'Only 12% remains' }}
        testIds={TEST_IDS}
      />,
    )

    expect(screen.getByTestId(TEST_IDS.banner).className.split(/\s+/)).toEqual(
      expect.arrayContaining(['border-ecap-warning-border', 'bg-ecap-warning-bg', 'text-ecap-warning-text']),
    )
  })

  it.each(['shell', 'main', 'compact', 'launcher'] as const)(
    'keeps the send action disabled without a message in the %s layout',
    (variant) => {
      const onSubmit = vi.fn()
      render(<ChatComposer value="" onChange={() => {}} onSubmit={onSubmit} variant={variant} testIds={TEST_IDS} />)

      const send = screen.getByRole('button', { name: 'Send' })
      expect(send).toBeDisabled()
      fireEvent.click(send)
      expect(onSubmit).not.toHaveBeenCalled()
    },
  )

  it('preserves the main composer zoowork send-button colors', () => {
    const { rerender } = render(
      <ChatComposer
        value="ready"
        onChange={() => {}}
        onSubmit={() => {}}
        variant="main"
        sendButtonVariant="zoowork"
        testIds={TEST_IDS}
      />,
    )

    expect(screen.getByTestId(TEST_IDS.submitButton).className.split(/\s+/)).toEqual(
      expect.arrayContaining([
        'h-8',
        'w-8',
        'text-white',
        'bg-[color:var(--ecap-agent-builder-send-active,#09090b)]',
        'hover:opacity-90',
      ]),
    )

    rerender(
      <ChatComposer
        value=""
        onChange={() => {}}
        onSubmit={() => {}}
        variant="main"
        sendButtonVariant="zoowork"
        testIds={TEST_IDS}
      />,
    )
    expect(screen.getByTestId(TEST_IDS.submitButton).className.split(/\s+/)).toEqual(
      expect.arrayContaining(['bg-[color:var(--ecap-agent-builder-send-disabled,#d4d4d8)]']),
    )
    expect(screen.getByTestId(TEST_IDS.submitButton)).toBeDisabled()
  })

  it('exposes the editor ref so application navigation can restore focus', () => {
    const editorRef = createRef<HTMLDivElement>()
    render(<ChatComposer value="" onChange={() => {}} onSubmit={() => {}} editorRef={editorRef} testIds={TEST_IDS} />)

    editorRef.current?.focus()
    expect(screen.getByTestId(TEST_IDS.editor)).toBe(document.activeElement)
  })

  it('aligns the launcher placeholder with the padded editor content', () => {
    render(
      <ChatComposer
        value=""
        onChange={() => {}}
        onSubmit={() => {}}
        variant="launcher"
        labels={{ inputPlaceholder: 'Ask your assistant to…' }}
        testIds={TEST_IDS}
      />,
    )

    const editorClasses = screen.getByTestId(TEST_IDS.editor).className.split(/\s+/)
    expect(editorClasses).toEqual(
      expect.arrayContaining([
        'relative',
        'before:inset-0',
        'before:box-border',
        'before:p-[inherit]',
        'before:content-[attr(data-placeholder)]',
      ]),
    )
  })

  it('renders the launcher send button as a 32px rounded rectangle', () => {
    render(<ChatComposer value="ready" onChange={() => {}} onSubmit={() => {}} variant="launcher" testIds={TEST_IDS} />)

    const classes = screen.getByTestId(TEST_IDS.submitButton).className.split(/\s+/)
    expect(classes).toEqual(expect.arrayContaining(['h-8', 'w-8', 'rounded-[8px]']))
    expect(classes).not.toEqual(expect.arrayContaining(['h-11', 'w-11', 'rounded-full']))
  })
})

it('keeps the submit and disabled contract when a caller supplies a mention editor', () => {
  const submit = vi.fn()
  const change = vi.fn()
  const customEditor = (props: RichTextInputProps) => <textarea aria-label={props.ariaLabel} value={props.value} disabled={props.disabled}
    onChange={event => props.onChange(event.target.value)} onKeyDown={event => { if (event.key === 'Enter') props.onSubmit?.() }} />
  const { rerender } = render(<ChatComposer value=" @Atlas help " onChange={change} onSubmit={submit} inputAriaLabel="Mention editor" renderEditor={customEditor} testIds={TEST_IDS} />)
  const editor = screen.getByRole('textbox', { name: 'Mention editor' })
  expect(editor).toHaveValue(' @Atlas help ')
  expect(screen.queryByTestId(TEST_IDS.editor)).toBeNull()
  fireEvent.change(editor, { target: { value: '@Atlas review' } })
  expect(change).toHaveBeenCalledWith('@Atlas review')
  fireEvent.keyDown(editor, { key: 'Enter' })
  expect(submit).toHaveBeenCalledWith({ value: '@Atlas help' })
  submit.mockClear()
  rerender(<ChatComposer value="@Atlas help" onChange={change} onSubmit={submit} inputAriaLabel="Mention editor" renderEditor={customEditor} disabled testIds={TEST_IDS} />)
  expect(editor).toBeDisabled()
  expect(screen.getByTestId(TEST_IDS.submitButton)).toBeDisabled()
  fireEvent.keyDown(editor, { key: 'Enter' })
  expect(submit).not.toHaveBeenCalled()
})
