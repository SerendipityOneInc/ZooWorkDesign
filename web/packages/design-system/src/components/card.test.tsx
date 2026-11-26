import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './card'

describe('Card', () => {
  it('renders Card as a flat bordered surface', () => {
    render(<Card>content</Card>)
    const card = screen.getByText('content').closest('[data-slot="card"]')
    expect(card).toBeInTheDocument()
    expect(card).toHaveClass('bg-card')
    expect(card).toHaveClass('rounded-md', 'border', 'border-border')
    expect(card?.className).not.toMatch(/shadow-|rounded-xl/)
  })

  it('renders all sub-parts with their data-slot attributes', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Title</CardTitle>
          <CardDescription>Desc</CardDescription>
          <CardAction>Action</CardAction>
        </CardHeader>
        <CardContent>Body</CardContent>
        <CardFooter>Footer</CardFooter>
      </Card>,
    )
    expect(document.querySelector('[data-slot="card-header"]')).toBeInTheDocument()
    expect(document.querySelector('[data-slot="card-title"]')).toBeInTheDocument()
    expect(document.querySelector('[data-slot="card-description"]')).toBeInTheDocument()
    expect(document.querySelector('[data-slot="card-action"]')).toBeInTheDocument()
    expect(document.querySelector('[data-slot="card-content"]')).toBeInTheDocument()
    expect(document.querySelector('[data-slot="card-footer"]')).toBeInTheDocument()
  })

  it('forwards className to Card', () => {
    render(<Card className="test-custom">x</Card>)
    expect(document.querySelector('[data-slot="card"]')).toHaveClass('test-custom')
  })

  it('applies data-size="sm" when size prop is sm', () => {
    render(<Card size="sm">x</Card>)
    expect(document.querySelector('[data-slot="card"]')).toHaveAttribute('data-size', 'sm')
  })
})
