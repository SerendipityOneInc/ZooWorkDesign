import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from './pagination'

describe('Pagination', () => {
  it('renders nav with role="navigation"', () => {
    render(<Pagination />)
    expect(screen.getByRole('navigation')).toHaveAttribute('data-slot', 'pagination')
  })

  it('PaginationLink with isActive sets aria-current="page"', () => {
    render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationLink href="#" isActive>1</PaginationLink>
          </PaginationItem>
        </PaginationContent>
      </Pagination>,
    )
    const link = screen.getByRole('link', { name: '1' })
    expect(link).toHaveAttribute('aria-current', 'page')
    expect(link).toHaveAttribute('data-active', 'true')
  })

  it('PaginationPrevious renders with aria-label', () => {
    render(
      <Pagination>
        <PaginationContent>
          <PaginationItem><PaginationPrevious href="#" /></PaginationItem>
        </PaginationContent>
      </Pagination>,
    )
    expect(screen.getByLabelText('Go to previous page')).toBeInTheDocument()
  })

  it('PaginationNext renders with aria-label', () => {
    render(
      <Pagination>
        <PaginationContent>
          <PaginationItem><PaginationNext href="#" /></PaginationItem>
        </PaginationContent>
      </Pagination>,
    )
    expect(screen.getByLabelText('Go to next page')).toBeInTheDocument()
  })

  it('PaginationEllipsis renders with sr-only text', () => {
    render(<PaginationEllipsis />)
    expect(screen.getByText('More pages')).toHaveClass('sr-only')
  })
})
