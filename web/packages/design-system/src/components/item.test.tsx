import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemGroup,
  ItemHeader,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from './item'

describe('Item', () => {
  it('renders with data-slot="item" and default variant/size', () => {
    render(<Item>Content</Item>)
    const el = screen.getByText('Content')
    expect(el).toHaveAttribute('data-slot', 'item')
    expect(el).toHaveAttribute('data-variant', 'default')
    expect(el).toHaveAttribute('data-size', 'default')
  })

  it('outline variant applies border-border', () => {
    render(<Item variant="outline">Outlined</Item>)
    expect(screen.getByText('Outlined')).toHaveClass('border-border')
  })

  it('muted variant applies the subtle opaque surface', () => {
    render(<Item variant="muted">Muted</Item>)
    expect(screen.getByText('Muted')).toHaveClass('bg-surface-subtle')
  })

  it('renders ItemGroup as role="list"', () => {
    render(<ItemGroup><Item>List item</Item></ItemGroup>)
    expect(screen.getByRole('list')).toHaveAttribute('data-slot', 'item-group')
  })

  it('renders ItemTitle with font-medium', () => {
    render(<ItemTitle>Title</ItemTitle>)
    expect(screen.getByText('Title')).toHaveClass('font-medium')
  })

  it('renders ItemDescription with muted-foreground', () => {
    render(<ItemDescription>Description text</ItemDescription>)
    expect(screen.getByText('Description text')).toHaveClass('text-muted-foreground')
  })

  it('renders full item composite', () => {
    render(
      <ItemGroup>
        <Item>
          <ItemMedia variant="icon" />
          <ItemContent>
            <ItemTitle>User name</ItemTitle>
            <ItemDescription>User description</ItemDescription>
          </ItemContent>
          <ItemActions>
            <button>Action</button>
          </ItemActions>
        </Item>
        <ItemSeparator />
        <Item>
          <ItemHeader>
            <ItemTitle>Header title</ItemTitle>
          </ItemHeader>
          <ItemFooter>
            <span>Footer info</span>
          </ItemFooter>
        </Item>
      </ItemGroup>,
    )
    expect(screen.getByText('User name')).toBeInTheDocument()
    expect(screen.getByText('User description')).toBeInTheDocument()
    expect(screen.getByText('Header title')).toBeInTheDocument()
  })
})
