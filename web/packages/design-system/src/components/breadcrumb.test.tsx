import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from './breadcrumb'

describe('Breadcrumb', () => {
  it('renders nav with aria-label="breadcrumb"', () => {
    render(<Breadcrumb />)
    expect(screen.getByRole('navigation', { name: 'breadcrumb' })).toHaveAttribute(
      'data-slot',
      'breadcrumb',
    )
  })

  it('BreadcrumbPage has aria-current="page"', () => {
    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem><BreadcrumbPage>Current page</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>,
    )
    expect(screen.getByText('Current page')).toHaveAttribute('aria-current', 'page')
  })

  it('BreadcrumbLink renders with hover class', () => {
    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem><BreadcrumbLink href="/">Home</BreadcrumbLink></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>,
    )
    expect(screen.getByText('Home')).toHaveClass('hover:text-foreground')
  })

  it('BreadcrumbSeparator renders as presentation li', () => {
    const { container } = render(
      <BreadcrumbList>
        <BreadcrumbSeparator />
      </BreadcrumbList>,
    )
    const sep = container.querySelector('[data-slot="breadcrumb-separator"]')
    expect(sep).toHaveAttribute('role', 'presentation')
  })

  it('BreadcrumbEllipsis has sr-only text', () => {
    render(<BreadcrumbEllipsis />)
    expect(screen.getByText('More')).toHaveClass('sr-only')
  })
})
