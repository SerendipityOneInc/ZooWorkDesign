import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@zooclaw/zooworkdesign'
import { useState } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { SkillsSubMenu, type SkillsSubMenuItem, type SkillsSubMenuProps } from '../composer/SkillsSubMenu'

const LABELS: SkillsSubMenuProps['labels'] = {
  trigger: 'Use Skills',
  loading: 'Loading Skills',
  loadFailed: 'Could not load Skills',
  openStore: 'Open Skill Store',
  empty: 'No Skills found',
  createWithZooClaw: 'Create Skill with ZooClaw',
}

const ITEMS: SkillsSubMenuItem[] = [
  {
    name: 'video-generator',
    description: 'Create production-ready videos.',
    icon: <span data-testid="sprite-video-generator" />,
  },
  {
    name: 'document-writer',
    description: 'Draft polished documents.',
    icon: <span data-testid="sprite-document-writer" />,
  },
]

const OVERFLOW_ITEMS: SkillsSubMenuItem[] = [
  { name: 'skill-one', description: 'First installed skill.', icon: <span /> },
  { name: 'skill-two', description: 'Second installed skill.', icon: <span /> },
  { name: 'skill-three', description: 'Third installed skill.', icon: <span /> },
  { name: 'skill-four', description: 'Fourth installed skill.', icon: <span /> },
  { name: 'skill-five', description: 'Fifth installed skill.', icon: <span /> },
  { name: 'skill-six', description: 'Sixth installed skill.', icon: <span /> },
]

type SkillsSubMenuHarnessProps = Pick<
  SkillsSubMenuProps,
  'isError' | 'isLoading' | 'items' | 'labels' | 'onCreateSkill' | 'onInsertSkill' | 'onOpenMarket'
>

function SkillsSubMenuHarness({
  items = ITEMS,
  isLoading = false,
  isError = false,
  labels = LABELS,
  onCreateSkill = () => {},
  onInsertSkill = () => {},
  onOpenMarket = () => {},
}: Partial<SkillsSubMenuHarnessProps>) {
  const [open, setOpen] = useState(false)

  return (
    <DropdownMenu open>
      <DropdownMenuTrigger>Open</DropdownMenuTrigger>
      <DropdownMenuContent>
        <SkillsSubMenu
          items={items}
          isLoading={isLoading}
          isError={isError}
          labels={labels}
          open={open}
          onOpenChange={setOpen}
          subSide="right"
          onCreateSkill={onCreateSkill}
          onInsertSkill={onInsertSkill}
          onOpenMarket={onOpenMarket}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

async function openSkillsSubMenu() {
  fireEvent.pointerMove(screen.getByTestId('composer-add-skills'), { pointerType: 'mouse' })
  return screen.findByTestId('composer-skills-menu')
}

let resizeObserverRecords: Array<{
  callback: ResizeObserverCallback
  observer: ResizeObserver
  targets: Set<Element>
}> = []

beforeEach(() => {
  resizeObserverRecords = []
  vi.stubGlobal(
    'ResizeObserver',
    class {
      private readonly record: (typeof resizeObserverRecords)[number]

      constructor(callback: ResizeObserverCallback) {
        this.record = { callback, observer: this as ResizeObserver, targets: new Set() }
        resizeObserverRecords.push(this.record)
      }

      disconnect() {
        this.record.targets.clear()
      }

      observe(target: Element) {
        this.record.targets.add(target)
      }

      unobserve(target: Element) {
        this.record.targets.delete(target)
      }
    },
  )
})

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})

describe('SkillsSubMenu', () => {
  it('opens on non-touch pointer movement and preserves the composer surface contract', async () => {
    render(<SkillsSubMenuHarness />)

    const menu = await openSkillsSubMenu()

    expect(menu).toHaveClass('w-[241px]')
    expect(menu).toHaveAttribute('data-surface', 'composer')
    expect(menu).toHaveAttribute('data-composer-menu-surface', 'true')
  })

  it('keeps the menu usable when ResizeObserver is unavailable', async () => {
    vi.stubGlobal('ResizeObserver', undefined)
    render(<SkillsSubMenuHarness />)

    expect(await openSkillsSubMenu()).toBeInTheDocument()
  })

  it('bottom-aligns the submenu so a tall Skill list opens upward', async () => {
    render(<SkillsSubMenuHarness items={OVERFLOW_ITEMS} />)

    const menu = await openSkillsSubMenu()

    expect(menu).toHaveAttribute('data-align', 'end')
  })

  it('renders passed items and reports the selected Skill name', async () => {
    const onInsertSkill = vi.fn()
    render(<SkillsSubMenuHarness onInsertSkill={onInsertSkill} />)
    await openSkillsSubMenu()

    expect(screen.getByTestId('sprite-video-generator')).toBeInTheDocument()
    expect(screen.getByTestId('composer-skill-result-document-writer')).toHaveTextContent('Draft polished documents.')

    fireEvent.click(screen.getByTestId('composer-skill-result-video-generator'))
    expect(onInsertSkill).toHaveBeenCalledWith('video-generator')
  })

  it('matches the root menu hover radius for Skill rows', async () => {
    render(<SkillsSubMenuHarness />)
    await openSkillsSubMenu()

    expect(screen.getByTestId('composer-add-skills')).toHaveClass('rounded-[4px]')
    expect(screen.getByTestId('composer-skill-result-video-generator')).toHaveClass('rounded-[4px]')
  })

  it('fits four Skill rows without a fade and reserves viewport space for footer actions', async () => {
    render(<SkillsSubMenuHarness items={OVERFLOW_ITEMS.slice(0, 4)} />)
    await openSkillsSubMenu()

    expect(screen.getByTestId('composer-skills-scroll')).toHaveClass(
      'max-h-[min(234px,max(0px,calc(var(--radix-dropdown-menu-content-available-height)-89px)))]',
    )
    expect(screen.queryByTestId('composer-skills-overflow-fade')).not.toBeInTheDocument()
    expect(screen.getByTestId('composer-skill-result-skill-four')).toBeInTheDocument()
  })

  it('shows the overflow fade for five Skills until the list reaches its end', async () => {
    render(<SkillsSubMenuHarness items={OVERFLOW_ITEMS.slice(0, 5)} />)
    await openSkillsSubMenu()

    const scrollViewport = screen.getByTestId('composer-skills-scroll')
    Object.defineProperties(scrollViewport, {
      clientHeight: { configurable: true, value: 234 },
      scrollHeight: { configurable: true, value: 260 },
      scrollTop: { configurable: true, value: 0, writable: true },
    })

    expect(screen.getByTestId('composer-skills-overflow-fade')).toHaveClass(
      'pointer-events-none',
      'bg-linear-to-b',
      'to-popover',
    )
    expect(screen.getByTestId('composer-skills-overflow-fade')).toHaveAttribute('aria-hidden', 'true')

    scrollViewport.scrollTop = 26
    fireEvent.scroll(scrollViewport)
    expect(screen.queryByTestId('composer-skills-overflow-fade')).not.toBeInTheDocument()

    scrollViewport.scrollTop = 8
    fireEvent.scroll(scrollViewport)
    expect(screen.getByTestId('composer-skills-overflow-fade')).toBeInTheDocument()
  })

  it('shows the overflow fade when a short viewport makes four Skills scrollable', async () => {
    render(<SkillsSubMenuHarness items={OVERFLOW_ITEMS.slice(0, 4)} />)
    await openSkillsSubMenu()

    const scrollViewport = screen.getByTestId('composer-skills-scroll')
    Object.defineProperties(scrollViewport, {
      clientHeight: { configurable: true, value: 191 },
      scrollHeight: { configurable: true, value: 208 },
      scrollTop: { configurable: true, value: 0, writable: true },
    })

    act(() => {
      for (const record of resizeObserverRecords) {
        if (record.targets.has(scrollViewport)) record.callback([], record.observer)
      }
    })

    expect(screen.getByTestId('composer-skills-overflow-fade')).toBeInTheDocument()
  })

  it('renders the empty state when no Skills are available', async () => {
    render(<SkillsSubMenuHarness items={[]} />)
    await openSkillsSubMenu()

    expect(screen.getByTestId('composer-skills-empty')).toHaveTextContent('No Skills found')
  })

  it('renders every state label supplied by the app', async () => {
    const labels = {
      trigger: '使用技能',
      loading: '正在加载技能',
      loadFailed: '无法加载技能',
      openStore: '打开技能商店',
      empty: '未找到技能',
      createWithZooClaw: '使用 ZooClaw 创建技能',
    }
    const view = render(<SkillsSubMenuHarness items={[]} isLoading labels={labels} />)

    expect(screen.getByTestId('composer-add-skills')).toHaveTextContent(labels.trigger)
    await openSkillsSubMenu()
    expect(screen.getByRole('status', { name: labels.loading })).toBeInTheDocument()

    view.rerender(<SkillsSubMenuHarness items={[]} labels={labels} />)
    await openSkillsSubMenu()
    expect(screen.getByTestId('composer-skills-empty')).toHaveTextContent(labels.empty)
    expect(screen.getByTestId('composer-add-skill-create')).toHaveTextContent(labels.createWithZooClaw)
    expect(screen.getByTestId('composer-add-skill-market')).toHaveTextContent(labels.openStore)

    view.rerender(<SkillsSubMenuHarness isError labels={labels} />)
    await openSkillsSubMenu()
    expect(screen.getByRole('status')).toHaveTextContent(labels.loadFailed)
    expect(screen.getByTestId('composer-add-skill-error-store')).toHaveTextContent(labels.openStore)
  })

  it('renders the error store action and reports it', async () => {
    const onOpenMarket = vi.fn()
    render(<SkillsSubMenuHarness isError onOpenMarket={onOpenMarket} />)
    await openSkillsSubMenu()

    fireEvent.click(screen.getByTestId('composer-add-skill-error-store'))
    expect(onOpenMarket).toHaveBeenCalledOnce()
  })

  it('reports the create and market actions', async () => {
    const onCreateSkill = vi.fn()
    const onOpenMarket = vi.fn()
    render(<SkillsSubMenuHarness onCreateSkill={onCreateSkill} onOpenMarket={onOpenMarket} />)
    await openSkillsSubMenu()

    fireEvent.click(screen.getByTestId('composer-add-skill-create'))
    expect(onCreateSkill).toHaveBeenCalledOnce()

    await openSkillsSubMenu()
    fireEvent.click(screen.getByTestId('composer-add-skill-market'))
    expect(onOpenMarket).toHaveBeenCalledOnce()
  })
})
