import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { describe, expect, it } from 'vitest'

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from './table'

describe('Table', () => {
  it('opts into a named keyboard-scroll region while forwarding table props and ref', () => {
    const ref = createRef<HTMLTableElement>()
    render(<Table ref={ref} scrollLabel="Usage scroll area" aria-label="Usage data" className="min-w-[720px]" id="usage-data">
      <TableBody><TableRow><TableCell>42 requests</TableCell></TableRow></TableBody>
    </Table>)
    const region = screen.getByRole('region', { name: 'Usage scroll area' })
    const table = screen.getByRole('table', { name: 'Usage data' })
    expect(region).toHaveAttribute('tabindex', '0')
    expect(table.parentElement).toBe(region)
    expect(table).toHaveAttribute('id', 'usage-data')
    expect(table).toHaveClass('min-w-[720px]')
    expect(table).not.toHaveAttribute('scrollLabel')
    expect(ref.current).toBe(table)
  })

  it('does not add a landmark or tab stop unless scrollLabel is supplied', () => {
    render(<Table aria-label="Existing table" />)
    expect(screen.queryByRole('region')).not.toBeInTheDocument()
    expect(screen.getByRole('table').parentElement).not.toHaveAttribute('tabindex')
    expect(screen.getByRole('table').parentElement).not.toHaveAttribute('aria-label')
  })
  it('renders table with data-slot="table" inside a container', () => {
    const { container } = render(<Table />)
    expect(container.querySelector('[data-slot="table-container"]')).toBeInTheDocument()
    expect(container.querySelector('[data-slot="table"]')).toBeInTheDocument()
  })

  it('renders a full table structure', () => {
    render(
      <Table>
        <TableCaption>User list</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Role</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Alice</TableCell>
            <TableCell>Admin</TableCell>
          </TableRow>
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell>Total</TableCell>
            <TableCell>1</TableCell>
          </TableRow>
        </TableFooter>
      </Table>,
    )
    expect(screen.getByText('User list')).toHaveAttribute('data-slot', 'table-caption')
    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.getByText('Total')).toBeInTheDocument()
  })

  it('TableHead has text-foreground class', () => {
    render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Column name</TableHead>
          </TableRow>
        </TableHeader>
      </Table>,
    )
    expect(screen.getByText('Column name')).toHaveClass('text-foreground')
  })

  it('TableRow has hover class', () => {
    const { container } = render(
      <Table>
        <TableBody>
          <TableRow><TableCell>Data</TableCell></TableRow>
        </TableBody>
      </Table>,
    )
    const row = container.querySelector('[data-slot="table-row"]')
    expect(row).toHaveClass('hover:bg-hover', 'data-[state=selected]:bg-selected')
  })

  it('uses the design-system border token for table dividers', () => {
    const { container } = render(
      <Table>
        <TableHeader>
          <TableRow><TableHead>Name</TableHead></TableRow>
        </TableHeader>
        <TableBody>
          <TableRow><TableCell>Data</TableCell></TableRow>
        </TableBody>
      </Table>,
    )

    expect(container.querySelector('[data-slot="table-header"]')).toHaveClass('[&_tr]:border-separator')
    expect(container.querySelector('[data-slot="table-row"]')).toHaveClass('border-separator')
  })
})
