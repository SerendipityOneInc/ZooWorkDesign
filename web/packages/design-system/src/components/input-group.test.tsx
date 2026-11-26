import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from './input-group'

describe('InputGroup', () => {
  it('renders with data-slot="input-group" and role="group"', () => {
    render(<InputGroup><InputGroupInput placeholder="Search" /></InputGroup>)
    const el = screen.getByRole('group')
    expect(el).toHaveAttribute('data-slot', 'input-group')
  })

  it('uses the lighter form-control focus halo', () => {
    render(<InputGroup><InputGroupInput placeholder="Search" /></InputGroup>)
    expect(screen.getByRole('group')).toHaveClass(
      'has-[[data-slot=input-group-control]:focus-visible]:ring-3',
      'has-[[data-slot=input-group-control]:focus-visible]:ring-ring/35',
    )
    expect(screen.getByRole('group')).not.toHaveClass(
      'has-[[data-slot=input-group-control]:focus-visible]:ring-ring/50',
    )
  })

  it('InputGroupInput gets data-slot="input-group-control"', () => {
    const { container } = render(
      <InputGroup><InputGroupInput placeholder="Search" /></InputGroup>,
    )
    expect(container.querySelector('[data-slot="input-group-control"]')).toBeInTheDocument()
  })

  it('InputGroupAddon renders with correct data-align', () => {
    const { container } = render(
      <InputGroup>
        <InputGroupAddon align="inline-start"><span>¥</span></InputGroupAddon>
        <InputGroupInput placeholder="Amount" />
      </InputGroup>,
    )
    const addon = container.querySelector('[data-slot="input-group-addon"]')
    expect(addon).toHaveAttribute('data-align', 'inline-start')
  })

  it('InputGroupText renders span with muted-foreground class', () => {
    render(<InputGroup><InputGroupText>Prefix</InputGroupText></InputGroup>)
    expect(screen.getByText('Prefix')).toHaveClass('text-muted-foreground')
  })

  it('InputGroupButton renders ghost variant button', () => {
    render(
      <InputGroup>
        <InputGroupInput placeholder="Search" />
        <InputGroupAddon align="inline-end">
          <InputGroupButton>Clear</InputGroupButton>
        </InputGroupAddon>
      </InputGroup>,
    )
    expect(screen.getByText('Clear')).toBeInTheDocument()
  })

  it('InputGroupTextarea renders with data-slot="input-group-control"', () => {
    const { container } = render(
      <InputGroup><InputGroupTextarea placeholder="Notes" /></InputGroup>,
    )
    const ctrl = container.querySelector('[data-slot="input-group-control"]')
    expect(ctrl?.tagName.toLowerCase()).toBe('textarea')
  })

  it('clicking an addon focuses the input control', () => {
    render(
      <InputGroup>
        <InputGroupAddon align="inline-start" data-testid="addon"><span>¥</span></InputGroupAddon>
        <InputGroupInput placeholder="Amount" />
      </InputGroup>,
    )
    const input = screen.getByPlaceholderText('Amount')
    expect(input).not.toHaveFocus()
    fireEvent.click(screen.getByTestId('addon'))
    expect(input).toHaveFocus()
  })

  it('clicking an addon focuses the textarea control (previously skipped)', () => {
    render(
      <InputGroup>
        <InputGroupAddon align="block-start" data-testid="addon"><span>Note</span></InputGroupAddon>
        <InputGroupTextarea placeholder="Notes" />
      </InputGroup>,
    )
    const textarea = screen.getByPlaceholderText('Notes')
    expect(textarea).not.toHaveFocus()
    fireEvent.click(screen.getByTestId('addon'))
    expect(textarea).toHaveFocus()
  })

  it('clicking a button inside an addon does not steal focus to the control', () => {
    render(
      <InputGroup>
        <InputGroupInput placeholder="Search" />
        <InputGroupAddon align="inline-end">
          <InputGroupButton>Clear</InputGroupButton>
        </InputGroupAddon>
      </InputGroup>,
    )
    const input = screen.getByPlaceholderText('Search')
    fireEvent.click(screen.getByText('Clear'))
    // the button-guard short-circuits the focus helper
    expect(input).not.toHaveFocus()
  })
})
