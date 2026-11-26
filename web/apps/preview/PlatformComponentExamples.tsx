import {
  AppearanceSelector, Button, CreditAmountSelector, Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
  Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogBody, DialogFooter,
  WorkspacePageHeader, type AppearanceValue,
} from '@zooclaw/zooworkdesign'
import { useState } from 'react'
import { usePreviewLocale } from './locale'

function useCopy() {
  const { locale } = usePreviewLocale()
  return (en: string, zh: string) => locale === 'en' ? en : zh
}

export function CreditAmountSelectorExample() {
  const c = useCopy()
  const [amount, setAmount] = useState('20')
  return <Dialog>
    <DialogTrigger asChild><Button variant="outline">{c('Credit amount example', '充值金额示例')}</Button></DialogTrigger>
    <DialogContent scrollable closeLabel={c('Close', '关闭')}>
      <DialogHeader>
        <DialogTitle>{c('Add funds', '充值')}</DialogTitle>
        <DialogDescription>{c('Shared input and preset controls. This example does not create a payment.', '共享金额输入和快捷选项；此示例不会创建支付。')}</DialogDescription>
      </DialogHeader>
      <DialogBody>
        <CreditAmountSelector value={amount} onValueChange={setAmount}
          label={c('Enter amount', '输入金额')} presetsLabel={c('Credit amount', '充值金额')}
          currencySymbol="$" currencyCode="USD"
          presets={[{ value: '5', label: '$5.00' }, { value: '20', label: '$20.00' }, { value: '100', label: '$100.00' }]}
          hint={c('Limits and validation are supplied by the application.', '限额和金额校验由接入应用提供。')} />
      </DialogBody>
      <DialogFooter><Button className="w-full" size="lg" disabled>{c('Preview only', '仅作预览')}</Button></DialogFooter>
    </DialogContent>
  </Dialog>
}

export function AppearanceSelectorExample() {
  const c = useCopy()
  const [value, setValue] = useState<AppearanceValue>('system')
  const labels = { light: c('Light', '浅色'), dark: c('Dark', '深色'), system: c('Follow System', '跟随系统') }
  return <div className="mt-8 space-y-4">
    <h3 className="text-sm font-semibold">{c('Appearance selector', '外观选择器')}</h3>
    <p className="pv-sd">{c('Native radio keys choose the preview theme. Saving and applying the theme belong to the application.', '使用原生单选方向键切换示例主题；主题应用和保存由接入应用负责。')}</p>
    <AppearanceSelector value={value} onValueChange={setValue} labels={labels} groupLabel={c('Preview appearance', '预览外观')} />
    <p role="status" className="text-sm text-muted-foreground">{c('Selected: ', '当前选择：')}{labels[value]}</p>
    <AppearanceSelector value="system" onValueChange={() => {}} labels={labels} groupLabel={c('Disabled appearance', '禁用的外观选择')} disabled />
  </div>
}

export function WorkspacePageHeaderExamples() {
  const c = useCopy()
  const [notice, setNotice] = useState(false)
  return <div className="my-8 space-y-8">
    <h3 className="text-sm font-semibold">{c('Section and page headers', '区块与页面标题')}</h3>
    <WorkspacePageHeader title={c('Project credentials', '项目凭据')} description={c('Default section heading retains the existing compact layout.', '默认区块标题保留既有紧凑布局。')} />
    <WorkspacePageHeader size="page" headingLevel={1} title={c('API keys', 'API 密钥')}
      description={c('Page headings share a 24px title and actions that move below the text on narrow screens.', '页面标题使用统一的 24px 字号，窄屏操作移动到文字下方。')}
      actions={<Button onClick={() => setNotice(true)}>{c('Create key example', '创建密钥示例')}</Button>} />
    {notice && <p role="status" className="text-sm text-muted-foreground">{c('Example action selected. No credentials are created.', '已选择示例操作，不会创建真实凭据。')}</p>}
  </div>
}

export function ScrollableTableExample() {
  const c = useCopy()
  return <div className="mt-8 min-w-0 max-w-96 space-y-3">
    <h3 className="text-sm font-semibold">{c('Keyboard-scrollable wide table', '支持键盘滚动的宽表格')}</h3>
    <p className="text-sm text-muted-foreground">{c('Tab to the named region, then use Left / Right to scroll. The table keeps its own accessible name.', 'Tab 聚焦命名区域后，使用左右方向键滚动；表格保留独立的可访问名称。')}</p>
    <Table scrollLabel={c('Agent usage table scroll area', '智能体用量表格滚动区域')} aria-label={c('Agent usage data', '智能体用量数据')} className="min-w-[720px]">
      <TableHeader><TableRow>
        {[c('Agent', '智能体'), c('Project', '项目'), c('Requests', '请求数'), c('Status', '状态'), c('Last active', '最近活跃')].map(label => <TableHead scope="col" key={label}>{label}</TableHead>)}
      </TableRow></TableHeader>
      <TableBody>{['Atlas', 'Nova'].map((agent, index) => <TableRow key={agent}>
        <TableCell>{agent}</TableCell><TableCell>{c('Research workspace', '研究工作区')}</TableCell>
        <TableCell>{index ? 8 : 42}</TableCell><TableCell>{c('Active', '活跃')}</TableCell><TableCell>2026-10-16 09:30</TableCell>
      </TableRow>)}</TableBody>
    </Table>
  </div>
}
