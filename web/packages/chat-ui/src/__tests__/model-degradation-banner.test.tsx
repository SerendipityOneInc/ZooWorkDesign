// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { ModelDegradationBanner } from '../banners'
import { ChatUiProvider } from '../provider'

afterEach(cleanup)

const echoT = (key: string) => key
const renderBanner = (ui: React.ReactElement) => render(<ChatUiProvider t={echoT}>{ui}</ChatUiProvider>)

describe('ModelDegradationBanner', () => {
  it('renders the degraded IQ-bar variant', () => {
    renderBanner(<ModelDegradationBanner variant="degraded" onUpgradeClick={vi.fn()} />)
    const banner = screen.getByTestId('genclaw-degradation-banner')
    expect(banner.getAttribute('data-variant')).toBe('degraded')
    expect(banner.textContent).toContain('modelDegradation.degradedTitle')
    expect(banner.textContent).toContain('modelDegradation.boostAI')
    expect(banner).toHaveClass('bg-transparent', 'border-border', 'text-foreground')
    expect(screen.getByRole('button')).toHaveClass('bg-white', 'border', 'border-border', 'text-foreground')
    expect(banner.querySelector<HTMLElement>('.rounded-full')?.style.background).toBe('var(--ecap-iq-bar-gradient)')
  })

  it('renders the expired variant', () => {
    renderBanner(<ModelDegradationBanner variant="expired" onUpgradeClick={vi.fn()} />)
    const banner = screen.getByTestId('genclaw-degradation-banner')
    expect(banner.getAttribute('data-variant')).toBe('expired')
    expect(banner.textContent).toContain('modelDegradation.expired')
  })

  it('renders expiryWarning with interpolated days', () => {
    const logger = { warn: vi.fn(), error: vi.fn() }
    render(
      <ChatUiProvider t={echoT} logger={logger}>
        <ModelDegradationBanner variant="expiryWarning" daysLeft={2} onUpgradeClick={vi.fn()} />
      </ChatUiProvider>,
    )
    const banner = screen.getByTestId('genclaw-degradation-banner')
    expect(banner.getAttribute('data-variant')).toBe('expiryWarning')
    // component does t('modelDegradation.expiryWarning').replace('{days}', ...)
    expect(banner.textContent).toContain('modelDegradation.expiryWarning')
    expect(logger.error).not.toHaveBeenCalled()
  })

  it('logs an error when expiryWarning omits daysLeft', () => {
    const logger = { warn: vi.fn(), error: vi.fn() }
    render(
      <ChatUiProvider t={echoT} logger={logger}>
        <ModelDegradationBanner variant="expiryWarning" onUpgradeClick={vi.fn()} />
      </ChatUiProvider>,
    )

    expect(logger.error).toHaveBeenCalledWith('ModelDegradationBanner: expiryWarning variant requires daysLeft')
  })

  it('fires onUpgradeClick', () => {
    const onUpgradeClick = vi.fn()
    renderBanner(<ModelDegradationBanner variant="expired" onUpgradeClick={onUpgradeClick} />)
    fireEvent.click(screen.getByRole('button'))
    expect(onUpgradeClick).toHaveBeenCalledTimes(1)
  })
})
