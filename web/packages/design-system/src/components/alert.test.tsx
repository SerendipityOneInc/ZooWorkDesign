import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Alert, AlertAction, AlertDescription, AlertTitle } from './alert'

describe('Alert', () => {
  it('renders default variant with data-slot and role=alert', () => {
    render(
      <Alert>
        <AlertTitle>Heads up</AlertTitle>
        <AlertDescription>Something to know.</AlertDescription>
      </Alert>,
    )
    const alert = document.querySelector('[data-slot="alert"]')
    expect(alert).toBeInTheDocument()
    expect(alert).toHaveAttribute('role', 'alert')
    expect(document.querySelector('[data-slot="alert-title"]')).toBeInTheDocument()
    expect(document.querySelector('[data-slot="alert-description"]')).toBeInTheDocument()
  })

  it('default variant does not have destructive class', () => {
    render(<Alert><AlertTitle>Info</AlertTitle></Alert>)
    expect(document.querySelector('[data-slot="alert"]')).not.toHaveClass('text-destructive')
  })

  it('destructive variant applies text-destructive class', () => {
    render(<Alert variant="destructive"><AlertTitle>Error</AlertTitle></Alert>)
    expect(document.querySelector('[data-slot="alert"]')).toHaveClass('text-destructive')
  })

  it('renders AlertAction with data-slot="alert-action"', () => {
    render(
      <Alert>
        <AlertTitle>Notice</AlertTitle>
        <AlertAction>Dismiss</AlertAction>
      </Alert>,
    )
    expect(document.querySelector('[data-slot="alert-action"]')).toBeInTheDocument()
  })

  it('uses card-like spacing and the design-system border token', () => {
    render(
      <Alert>
        <AlertTitle>Payment successful</AlertTitle>
        <AlertDescription>Receipt sent.</AlertDescription>
      </Alert>,
    )
    const alert = document.querySelector('[data-slot="alert"]')
    expect(alert).toHaveClass('border-border')
    expect(alert).toHaveClass('p-4')
    expect(alert).toHaveClass('rounded-md', 'bg-card')
    expect(alert).not.toHaveClass('shadow-glass-card')
  })

  it('supports a leading svg icon layout without the legacy icon prop', () => {
    render(
      <Alert>
        <svg aria-label="status" />
        <AlertTitle>New feature available</AlertTitle>
      </Alert>,
    )
    expect(document.querySelector('[data-slot="alert"]')).toHaveClass('has-[>svg]:grid-cols-[auto_1fr]')
    expect(document.querySelector('[data-slot="alert-title"]')).toHaveClass('group-has-[>svg]/alert:col-start-2')
  })
})
