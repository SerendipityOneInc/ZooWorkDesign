import { fireEvent, render, screen } from '@testing-library/react'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { EffortSlider, type EffortSliderLevel } from '../index'

describe('EffortSlider public component', () => {
  it('works without a model panel and does not steal focus on mount', () => {
    const commit = vi.fn()
    function Example() {
      const [value, setValue] = useState<EffortSliderLevel | undefined>('medium')
      return <EffortSlider value={value} onValueChange={setValue} onValueCommit={commit} />
    }
    render(<Example />)
    const slider = screen.getByRole('slider', { name: 'Thinking effort' })
    expect(slider).not.toHaveFocus()
    expect(slider).toHaveAttribute('aria-valuetext', 'Medium')
    fireEvent.keyDown(slider, { key: 'End' })
    expect(slider).toHaveAttribute('aria-valuetext', 'Max')
    expect(commit).toHaveBeenCalledExactlyOnceWith('max')
  })

  it('skips unsupported effort levels and blocks disabled interaction', () => {
    const commit = vi.fn()
    const { rerender } = render(<EffortSlider value="low" levels={['low', 'high']} onValueCommit={commit} />)
    fireEvent.keyDown(screen.getByRole('slider'), { key: 'ArrowRight' })
    expect(commit).toHaveBeenCalledExactlyOnceWith('high')
    rerender(<EffortSlider value="low" disabled onValueCommit={commit} />)
    fireEvent.keyDown(screen.getByRole('slider'), { key: 'End' })
    expect(commit).toHaveBeenCalledTimes(1)
  })
})
