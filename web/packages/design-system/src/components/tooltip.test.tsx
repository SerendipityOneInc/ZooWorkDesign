import { act, fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip'

describe('Tooltip', () => {
  it('renders trigger with data-slot="tooltip-trigger"', () => {
    render(
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger data-testid="trig">Hover me</TooltipTrigger>
          <TooltipContent>Tip text</TooltipContent>
        </Tooltip>
      </TooltipProvider>,
    )
    expect(screen.getByTestId('trig')).toHaveAttribute('data-slot', 'tooltip-trigger')
  })

  it('reveals the tooltip content on focus', async () => {
    render(
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger data-testid="trig">Hover me</TooltipTrigger>
          <TooltipContent>Tip text</TooltipContent>
        </Tooltip>
      </TooltipProvider>,
    )
    // hidden until the trigger is focused
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
    fireEvent.focus(screen.getByTestId('trig'))
    expect(await screen.findByRole('tooltip')).toHaveTextContent('Tip text')
  })

  it('works without an explicit provider and lets Radix position its directional arrow', async () => {
    render(
      <Tooltip>
        <TooltipTrigger data-testid="trig">Hover me</TooltipTrigger>
        <TooltipContent>Composer hint</TooltipContent>
      </Tooltip>,
    )

    fireEvent.focus(screen.getByTestId('trig'))
    const tooltip = await screen.findByRole('tooltip')
    expect(tooltip).toHaveTextContent('Composer hint')
    const content = tooltip.closest('[data-slot="tooltip-content"]')
    expect(content).toHaveClass('bg-[var(--tooltip-bg)]')
    expect(content).toHaveClass('text-[var(--tooltip-text)]')
    expect(content).toHaveClass('rounded-[6px]')
    expect(content).toHaveClass('px-3')
    expect(content).toHaveClass('py-1.5')

    const arrow = content?.querySelector('[data-slot="tooltip-arrow"]')
    expect(arrow).toBeInTheDocument()
    expect(arrow).toHaveClass('fill-[var(--tooltip-bg)]')
    expect(arrow).toHaveAttribute('width', '10')
    expect(arrow).toHaveAttribute('height', '5')
  })

  it('respects delay configuration from an explicit outer provider', async () => {
    vi.useFakeTimers()
    try {
      render(
        <TooltipProvider delayDuration={500}>
          <Tooltip>
            <TooltipTrigger data-testid="trig">Hover me</TooltipTrigger>
            <TooltipContent>Delayed tip</TooltipContent>
          </Tooltip>
        </TooltipProvider>,
      )

      fireEvent.pointerMove(screen.getByTestId('trig'), { pointerType: 'mouse' })
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()

      await act(async () => vi.advanceTimersByTime(499))
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()

      await act(async () => vi.advanceTimersByTime(1))
      expect(screen.getByRole('tooltip')).toHaveTextContent('Delayed tip')
    } finally {
      vi.useRealTimers()
    }
  })
})
