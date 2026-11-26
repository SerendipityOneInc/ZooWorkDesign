// src/components/field.test.tsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from './field'

describe('Field', () => {
  it('renders a group div with data-slot="field"', () => {
    const { container } = render(
      <Field>
        <input aria-label="test" />
      </Field>,
    )
    const field = container.querySelector('[data-slot="field"]')
    expect(field).toBeInTheDocument()
    expect(field?.getAttribute('role')).toBe('group')
  })

  it('applies orientation data attribute', () => {
    const { container } = render(
      <Field orientation="horizontal">
        <input aria-label="test" />
      </Field>,
    )
    expect(container.querySelector('[data-orientation="horizontal"]')).toBeInTheDocument()
  })
})

describe('FieldLabel', () => {
  it('renders with data-slot="field-label"', () => {
    render(<FieldLabel htmlFor="email">Email</FieldLabel>)
    const el = screen.getByText('Email')
    expect(el).toHaveAttribute('data-slot', 'field-label')
  })
})

describe('FieldDescription', () => {
  it('renders with data-slot="field-description"', () => {
    render(<FieldDescription>Help text</FieldDescription>)
    const el = screen.getByText('Help text')
    expect(el).toHaveAttribute('data-slot', 'field-description')
  })
})

describe('FieldError', () => {
  it('renders children as an alert', () => {
    render(<FieldError>Something went wrong</FieldError>)
    const el = screen.getByRole('alert')
    expect(el).toHaveTextContent('Something went wrong')
    expect(el).toHaveAttribute('data-slot', 'field-error')
  })

  it('renders unique error messages from errors prop', () => {
    render(
      <FieldError
        errors={[
          { message: 'Required' },
          { message: 'Too short' },
          { message: 'Required' }, // duplicate — should be deduplicated
        ]}
      />,
    )
    const alert = screen.getByRole('alert')
    expect(alert).toHaveTextContent('Required')
    expect(alert).toHaveTextContent('Too short')
    // only one "Required" list item
    expect(alert.querySelectorAll('li')).toHaveLength(2)
  })

  it('returns null when no children and no errors', () => {
    const { container } = render(<FieldError />)
    expect(container.querySelector('[role="alert"]')).toBeNull()
  })
})

describe('FieldGroup', () => {
  it('renders with data-slot="field-group"', () => {
    const { container } = render(<FieldGroup />)
    expect(container.querySelector('[data-slot="field-group"]')).toBeInTheDocument()
  })
})

describe('FieldSet', () => {
  it('renders a <fieldset> with data-slot="field-set"', () => {
    const { container } = render(<FieldSet />)
    const el = container.querySelector('fieldset')
    expect(el).toHaveAttribute('data-slot', 'field-set')
  })
})

describe('FieldLegend', () => {
  it('renders a <legend> with data-slot="field-legend"', () => {
    const { container } = render(<FieldLegend>Group title</FieldLegend>)
    const el = container.querySelector('legend')
    expect(el).toHaveAttribute('data-slot', 'field-legend')
    expect(el).toHaveTextContent('Group title')
  })
})

describe('FieldContent', () => {
  it('renders with data-slot="field-content"', () => {
    const { container } = render(<FieldContent>content</FieldContent>)
    expect(container.querySelector('[data-slot="field-content"]')).toBeInTheDocument()
  })
})

describe('FieldTitle', () => {
  it('renders with data-slot="field-label"', () => {
    render(<FieldTitle>Title</FieldTitle>)
    expect(screen.getByText('Title')).toHaveAttribute('data-slot', 'field-label')
  })
})

describe('FieldSeparator', () => {
  it('renders with data-slot="field-separator"', () => {
    const { container } = render(<FieldSeparator />)
    expect(container.querySelector('[data-slot="field-separator"]')).toBeInTheDocument()
  })

  it('renders children when provided', () => {
    render(<FieldSeparator>or</FieldSeparator>)
    expect(screen.getByText('or')).toBeInTheDocument()
  })
})
