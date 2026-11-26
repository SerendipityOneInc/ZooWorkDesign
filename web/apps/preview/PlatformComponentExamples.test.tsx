import { fireEvent, render, screen, within } from '@testing-library/react'
import { expect, it } from 'vitest'
import { AppearanceSelectorExample, ScrollableTableExample, WorkspacePageHeaderExamples } from './PlatformComponentExamples'
import { PreviewLocaleProvider } from './locale'

it('changes the local appearance choice without enabling the disabled specimen', () => {
  render(<AppearanceSelectorExample />)
  const active = within(screen.getByRole('group', { name: 'Preview appearance' }))
  fireEvent.click(active.getByRole('radio', { name: 'Dark' }))
  expect(screen.getByRole('status')).toHaveTextContent('Selected: Dark')
  const disabled = within(screen.getByRole('group', { name: 'Disabled appearance' }))
  expect(disabled.getByRole('radio', { name: 'Follow System' })).toBeChecked()
  expect(disabled.getByRole('radio', { name: 'Dark' })).toBeDisabled()
})

it('localizes the new examples and keeps the header action local', () => {
  render(<PreviewLocaleProvider initialLocale="zh"><>
    <AppearanceSelectorExample /><ScrollableTableExample /><WorkspacePageHeaderExamples />
  </></PreviewLocaleProvider>)
  expect(screen.getByRole('group', { name: '预览外观' })).toBeInTheDocument()
  expect(screen.getByRole('table', { name: '智能体用量数据' })).toBeInTheDocument()
  expect(screen.getByRole('region', { name: '智能体用量表格滚动区域' })).toHaveAttribute('tabindex', '0')
  expect(screen.getByRole('heading', { level: 1, name: 'API 密钥' })).toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: '创建密钥示例' }))
  expect(screen.getByText('已选择示例操作，不会创建真实凭据。')).toBeInTheDocument()
})
