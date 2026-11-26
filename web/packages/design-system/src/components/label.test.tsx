// src/components/label.test.tsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Label } from './label'

describe('Label', () => {
  it('renders a <label> with data-slot and htmlFor', () => {
    render(<Label htmlFor="email">Email</Label>)
    const el = screen.getByText('Email')
    expect(el.tagName).toBe('LABEL')
    expect(el).toHaveAttribute('for', 'email')
    expect(el).toHaveAttribute('data-slot', 'label')
  })
})
