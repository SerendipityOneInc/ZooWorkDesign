import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { ProductButton } from '../product-patterns/product-button'
import { Button as SharedButton } from './button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './dropdown-menu'
import { FocusModalityProvider } from './focus-modality'
import { Input } from './input'
import { Popover, PopoverTrigger } from './popover'

const tokensCss = readFileSync(resolve(process.cwd(), 'tokens.css'), 'utf8')
// Exercise the shipped pointer selectors against composed DOM. jsdom cannot
// compile Tailwind, so provide only a representative keyboard focus baseline.
const pointerCss = [...tokensCss.matchAll(/([^{}]+)\{([^{}]+)\}/g)]
  .filter(([, selector]) => selector.includes('data-zc-focus-modality') && !selector.includes('input-group'))
  .map(([rule]) => rule)
  .join('\n')

describe.each([
  ['Button', SharedButton],
  ['ProductButton', ProductButton],
] as const)('composed %s pointer focus', (_name, Button) => {
  let styles: HTMLStyleElement

  beforeEach(() => {
    styles = document.createElement('style')
    styles.textContent = `
      :is(button, a):focus-visible { border-color: black; outline: 2px solid black; }
      [aria-invalid=true] { border-color: red; box-shadow: 0 0 0 3px red; }
      ${pointerCss}
    `
    document.head.append(styles)
  })

  afterEach(() => styles.remove())

  it('preserves the keyboard focus border after a cancelled outside pointer interaction', () => {
    render(
      <FocusModalityProvider>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost">Details</Button>
          </PopoverTrigger>
        </Popover>
        <div onPointerDown={(event) => event.preventDefault()}>Resize handle</div>
      </FocusModalityProvider>,
    )
    const trigger = screen.getByRole('button', { name: 'Details' })
    fireEvent.keyDown(document, { key: 'Tab' })
    trigger.focus()
    expect(getComputedStyle(trigger).borderColor).toBe('black')

    fireEvent.pointerDown(screen.getByText('Resize handle'))

    expect(trigger).toHaveFocus()
    expect(getComputedStyle(trigger).borderColor).toBe('black')
    expect(getComputedStyle(trigger).outline).toBe('2px solid black')
  })

  it.each([Button, Input])(
    'preserves invalid control borders and validation rings during pointer focus (%#)',
    (Control) => {
      render(
        <FocusModalityProvider>
          <Control aria-label="Invalid control" aria-invalid="true" />
        </FocusModalityProvider>,
      )
      const control = screen.getByLabelText('Invalid control')
      fireEvent.pointerDown(control)
      control.focus()
      expect(getComputedStyle(control).borderColor).toBe('red')
      expect(getComputedStyle(control).boxShadow).toBe('0 0 0 3px red')
    },
  )

  it('keeps group validation styles while its valid control receives pointer focus', () => {
    // CSS contract fixture without Tailwind classes: jsdom's :has matcher
    // cannot parse slash-containing class names when evaluating group styles.
    const groupRules = [...tokensCss.matchAll(/([^{}]+)\{([^{}]+)\}/g)]
      .filter(([, selector]) => selector.includes('data-zc-focus-modality'))
      .map(([rule]) => rule)
      .join('\n')
    styles.textContent = `
      [data-slot=input-group]:has([aria-invalid=true]) { border-color: red; box-shadow: 0 0 0 3px red; }
      ${groupRules}
    `
    render(
      <FocusModalityProvider>
        <div data-slot="input-group" data-testid="invalid-group">
          <input data-slot="input-group-control" aria-label="Current field" />
          <input data-slot="input-group-control" aria-label="Invalid field" aria-invalid="true" />
        </div>
      </FocusModalityProvider>,
    )
    const control = screen.getByLabelText('Current field')
    fireEvent.pointerDown(control)
    control.focus()
    expect(getComputedStyle(screen.getByTestId('invalid-group')).borderColor).toBe('red')
    expect(getComputedStyle(screen.getByTestId('invalid-group')).boxShadow).toBe('0 0 0 3px red')
  })

  it('resets the border after a pointer-opened menu restores focus to its composed trigger', async () => {
    render(
      <FocusModalityProvider>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost">Switch agent</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Current agent</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </FocusModalityProvider>,
    )
    const trigger = screen.getByRole('button', { name: 'Switch agent' })
    // jsdom's PointerEvent lacks the button property; the real Radix handler
    // also accepts MouseEvent for this pointerdown contract.
    fireEvent(trigger, new MouseEvent('pointerdown', { bubbles: true, button: 0 }))
    const item = await screen.findByRole('menuitem', { name: 'Current agent' })
    act(() => item.focus())
    fireEvent.pointerDown(item)
    fireEvent.click(item)

    await waitFor(() => expect(trigger).toHaveFocus())
    expect(trigger).toHaveAttribute('data-slot', 'dropdown-menu-trigger')
    expect(getComputedStyle(trigger).borderColor).toBe('transparent')

    fireEvent.keyDown(trigger, { key: 'Tab' })
    expect(trigger).not.toHaveAttribute('data-zc-focus-modality')
    expect(getComputedStyle(trigger).borderColor).toBe('black')
  })

  it.each(['ghost', 'outline'] as const)('keeps the %s Button border correct inside a Popover trigger', (variant) => {
    render(
      <FocusModalityProvider>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant={variant}>Details</Button>
          </PopoverTrigger>
        </Popover>
      </FocusModalityProvider>,
    )
    const trigger = screen.getByRole('button', { name: 'Details' })
    fireEvent.pointerDown(trigger)
    trigger.focus()

    expect(trigger).toHaveAttribute('data-slot', 'popover-trigger')
    expect(getComputedStyle(trigger).borderColor).toBe(
      variant === 'outline'
        ? Button === ProductButton
          ? 'var(--border)'
          : 'var(--button-outline-border)'
        : 'transparent',
    )
  })

  it('retains pointer border handling when Button itself renders as a link', () => {
    render(
      <FocusModalityProvider>
        <Button asChild variant="ghost" data-slot="navigation-link">
          <a href="#agents">Agents</a>
        </Button>
      </FocusModalityProvider>,
    )
    const link = screen.getByRole('link', { name: 'Agents' })
    fireEvent.pointerDown(link)
    link.focus()

    expect(getComputedStyle(link).borderColor).toBe('transparent')
  })
})
