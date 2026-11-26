import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { expect, it } from 'vitest'
import { MobileDrawerExample } from './MobileDrawerExample'

it('portals both the mobile drawer and its backdrop into the preview and restores trigger focus on close', async () => {
  const { container } = render(
    <>
      {/* JSDOM has no CSS animation lifecycle; test the reduced-motion path. */}
      <style>{'[data-vaul-drawer], [data-vaul-overlay] { animation-name: none !important; }'}</style>
      <MobileDrawerExample />
    </>,
  )
  const trigger = screen.getByRole('button', { name: 'Open Drawer' })
  fireEvent.click(trigger)
  const dialog = screen.getByRole('dialog')
  const stage = container.querySelector('.pv-mobile-drawer-stage')!
  expect(stage).toContainElement(dialog)
  expect(stage.querySelector('[data-slot="drawer-overlay"]')).toBeInTheDocument()
  expect(screen.queryByRole('textbox')).toBeNull()
  fireEvent.keyDown(dialog, { key: 'Escape' })
  await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
  await waitFor(() => expect(trigger).toHaveFocus())
})
