# 常用组件使用指南

首批 20 个组件。示例使用包的公开导出，完整可运行源码位于 [component-examples.tsx](../web/fixtures/consumer/app/component-examples.tsx)，随真实 tgz 在 Vite 和 Next.js 中编译，并验收关键交互。

先完成[安装与 CSS 接入](CONSUMING.md)及[主题配置](THEMING.md)。下方 JSX 是独立示例；多个示例同页使用时，保持控件 id 唯一。受控用法同时传当前值与更新回调；只需初始值时改用 defaultValue/defaultChecked/defaultOpen，之后不要与受控属性混用。

完整继承属性以已安装包的 TypeScript 声明为准，可用 `React.ComponentProps<typeof Component>` 取得；下表聚焦常用 API 和本库默认值。键盘说明描述既有实现，不能替代你的业务页面无障碍验收。

[Button](#button) · [Input](#input) · [Textarea](#textarea) · [Label](#label) · [Checkbox](#checkbox) · [Switch](#switch) · [RadioGroup](#radiogroup) · [Select](#select) · [Dialog](#dialog) · [DropdownMenu](#dropdownmenu) · [Tooltip](#tooltip) · [Popover](#popover) · [Tabs](#tabs) · [Accordion](#accordion) · [Card](#card) · [Avatar](#avatar) · [Badge](#badge) · [Alert](#alert) · [Empty](#empty) · [Separator](#separator)

## Button

| 项目 | 说明 |
| --- | --- |
| 默认值 | variant=default；size=default；asChild=false；loading=false |
| 常用参数 | variant: default / outline / secondary / ghost / destructive / link / composerSend；primary 是 default 的弃用别名。size: xs / sm / default / lg / icon / icon-xs / icon-sm / icon-lg / composerIcon。 |
| 状态与组合 | loading 或 disabled 会阻止操作；原生 button 的 loading 自动展示 Spinner。asChild 分支由宿主绘制加载内容。 |
| 键盘与可访问性 | Enter/Space 激活原生按钮。纯图标按钮必须给 aria-label；表单中非提交操作显式 type="button"。 |

```tsx
'use client'

import { useState } from 'react'
import { Button } from '@zooclaw/zooworkdesign'

export function ButtonExample() {
  const [saved, setSaved] = useState(false)
  return <Button type="button" variant="outline" onClick={() => setSaved(true)}>
    {saved ? 'Saved example' : 'Save example'}
  </Button>
}
```

## Input

| 项目 | 说明 |
| --- | --- |
| 默认值 | 原生 input 属性；没有自定义 size/variant |
| 常用参数 | value / defaultValue、onChange、type、disabled、required、aria-invalid；高度默认 36px。 |
| 状态与组合 | 受控 value 配 onChange；初始空值使用空字符串，不在 undefined 与字符串之间切换。校验由宿主提供。 |
| 键盘与可访问性 | Label 的 htmlFor 对应 id；错误说明用 aria-describedby。placeholder 不能代替标签。 |

```tsx
'use client'

import { useState } from 'react'
import { Input, Label } from '@zooclaw/zooworkdesign'

export function InputExample() {
  const [value, setValue] = useState('')
  const invalid = value.length > 0 && value.length < 3
  return <div><Label htmlFor="example-name">Project name</Label>
    <Input id="example-name" value={value} onChange={e => setValue(e.target.value)}
      aria-invalid={invalid} aria-describedby="example-name-help" />
    <p id="example-name-help">{invalid ? 'Use at least 3 characters.' : 'Choose a project name.'}</p>
  </div>
}
```

## Textarea

| 项目 | 说明 |
| --- | --- |
| 默认值 | 原生 textarea 属性；默认最小高度 80px |
| 常用参数 | value / defaultValue、onChange、rows、maxLength、disabled、aria-invalid。 |
| 状态与组合 | 原生 onChange 接收事件。默认使用 field-sizing:content，宿主可设置 min/max-height；不要承诺所有浏览器自动增高。 |
| 键盘与可访问性 | Enter 默认换行；不要为了发送消息全局拦截 Enter，聊天场景使用 ChatComposer。 |

```tsx
'use client'

import { useState } from 'react'
import { Textarea, Label } from '@zooclaw/zooworkdesign'

export function TextareaExample() {
  const [value, setValue] = useState('')
  return <div><Label htmlFor="example-description">Description</Label>
    <Textarea id="example-description" value={value} onChange={e => setValue(e.target.value)} rows={3} />
  </div>
}
```

## Label

| 项目 | 说明 |
| --- | --- |
| 默认值 | 透传 Radix Label / HTML label 属性 |
| 常用参数 | htmlFor 对应控件 id；children 是可读名称。 |
| 状态与组合 | Label 不管理输入值、错误、必填校验；这些仍在控件/宿主上设置。 |
| 键盘与可访问性 | 点击 Label 可聚焦或切换关联控件。不要把另一个可交互链接塞进主要标签。 |

```tsx
'use client'

import { Label, Input } from '@zooclaw/zooworkdesign'

export function LabelExample() {
  return <div><Label htmlFor="example-email">Contact email</Label>
    <Input id="example-email" type="email" autoComplete="email" />
  </div>
}
```

## Checkbox

| 项目 | 说明 |
| --- | --- |
| 默认值 | checked/defaultChecked: boolean 或 indeterminate；disabled 默认 false（Radix） |
| 常用参数 | onCheckedChange 接收 true / false / indeterminate，不是 ChangeEvent。可传 name、required、value。 |
| 状态与组合 | 父级全选的半选态使用 checked="indeterminate"。二态示例将回调规范成 v === true。 |
| 键盘与可访问性 | Space 切换；通过 Label/aria-label 命名，不单靠颜色表示选中。 |

```tsx
'use client'

import { useState } from 'react'
import { Checkbox, Label } from '@zooclaw/zooworkdesign'

export function CheckboxExample() {
  const [checked, setChecked] = useState(false)
  return <div className="flex items-center gap-3">
    <Checkbox id="example-agree" checked={checked} onCheckedChange={v => setChecked(v === true)} />
    <Label htmlFor="example-agree">Receive updates</Label>
  </div>
}
```

## Switch

| 项目 | 说明 |
| --- | --- |
| 默认值 | size=default；size 可选 sm |
| 常用参数 | checked / defaultChecked、onCheckedChange(boolean)、disabled、name。 |
| 状态与组合 | 用于立即生效的开关；异步保存、失败回滚和提示由宿主管理。 |
| 键盘与可访问性 | Space 切换；给开关稳定的名称，不随开关状态替换成相反动作。 |

```tsx
'use client'

import { useState } from 'react'
import { Switch, Label } from '@zooclaw/zooworkdesign'

export function SwitchExample() {
  const [checked, setChecked] = useState(false)
  return <div className="flex items-center gap-3">
    <Switch id="example-notify" checked={checked} onCheckedChange={setChecked} size="sm" />
    <Label htmlFor="example-notify">Enable notifications</Label>
  </div>
}
```

## RadioGroup

| 项目 | 说明 |
| --- | --- |
| 默认值 | Root 透传 Radix；Item 必须有唯一 value |
| 常用参数 | value / defaultValue、onValueChange(string)、orientation、disabled、name、required。 |
| 状态与组合 | 单选组使用一个 value；每个 Item 单独关联 Label。 |
| 键盘与可访问性 | Tab 进入组，方向键移动并选择；组本身也要 aria-label 或 aria-labelledby。 |

```tsx
'use client'

import { useState } from 'react'
import { RadioGroup, RadioGroupItem, Label } from '@zooclaw/zooworkdesign'

export function RadioGroupExample() {
  const [value, setValue] = useState('daily')
  return <RadioGroup aria-label="Update frequency" value={value} onValueChange={setValue}>
    <div className="flex items-center gap-3"><RadioGroupItem id="example-daily" value="daily" /><Label htmlFor="example-daily">Daily</Label></div>
    <div className="flex items-center gap-3"><RadioGroupItem id="example-weekly" value="weekly" /><Label htmlFor="example-weekly">Weekly</Label></div>
  </RadioGroup>
}
```

## Select

| 项目 | 说明 |
| --- | --- |
| 默认值 | Trigger size=default；Content position=popper、align=start、side=bottom、sideOffset=4、avoidCollisions=true |
| 常用参数 | Root value / defaultValue、onValueChange(string)、open/onOpenChange、disabled；Trigger size: sm/default。 |
| 状态与组合 | SelectItem 必须使用非空且唯一的 value；空字符串留给 Root 清空及 placeholder。只支持单选，复杂多选另做组合。 |
| 键盘与可访问性 | Enter/Space/方向键打开和选择，Esc 关闭；Trigger 需可读名称。Content 已包含 Portal。 |

```tsx
'use client'

import { useState } from 'react'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem, Label } from '@zooclaw/zooworkdesign'

export function SelectExample() {
  const [value, setValue] = useState('viewer')
  return <div><Label htmlFor="example-role">Project role</Label>
    <Select value={value} onValueChange={setValue}>
      <SelectTrigger id="example-role"><SelectValue placeholder="Choose a role" /></SelectTrigger>
      <SelectContent><SelectItem value="viewer">Viewer</SelectItem><SelectItem value="editor">Editor</SelectItem></SelectContent>
    </Select>
  </div>
}
```

## Dialog

| 项目 | 说明 |
| --- | --- |
| 默认值 | Content scrollable=false、showCloseButton=true、closeLabel=Close |
| 常用参数 | Root open / defaultOpen、onOpenChange；Content overlayClassName；长内容配 scrollable + DialogBody。 |
| 状态与组合 | 异步提交成功后由宿主 setOpen(false)；失败保持打开并显示错误。Trigger/Close asChild 避免嵌套按钮。 |
| 键盘与可访问性 | 必须提供 DialogTitle；说明用 DialogDescription。Esc 关闭并恢复触发器焦点。DialogFooter 内置关闭文字目前固定英文，需本地化时显式组合 DialogClose。 |

```tsx
'use client'

import { useState } from 'react'
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogBody, DialogFooter, DialogClose, Button, Label, Input } from '@zooclaw/zooworkdesign'

export function DialogExample() {
  const [open, setOpen] = useState(false)
  return <Dialog open={open} onOpenChange={setOpen}>
    <DialogTrigger asChild><Button type="button">Edit example project</Button></DialogTrigger>
    <DialogContent scrollable closeLabel="Close project editor">
      <DialogHeader><DialogTitle>Edit project</DialogTitle><DialogDescription>Update the example settings.</DialogDescription></DialogHeader>
      <DialogBody><Label htmlFor="example-dialog-title">Title</Label><Input id="example-dialog-title" defaultValue="Sample project" /></DialogBody>
      <DialogFooter><DialogClose asChild><Button type="button" variant="outline">Cancel editing</Button></DialogClose></DialogFooter>
    </DialogContent>
  </Dialog>
}
```

## DropdownMenu

| 项目 | 说明 |
| --- | --- |
| 默认值 | Content sideOffset=4；Item variant=default、inset 未设置 |
| 常用参数 | Root open/onOpenChange；Item onSelect、disabled、variant: default/destructive；复选项有 checked/onCheckedChange。 |
| 状态与组合 | 操作回调用 onSelect，兼容鼠标和键盘；要保持菜单打开时在回调中 preventDefault。 |
| 键盘与可访问性 | 方向键移动、Enter/Space 执行、Esc 关闭。触发器使用 asChild 包 Button；菜单项不要再嵌套 button。 |

```tsx
'use client'

import { useState } from 'react'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, Button } from '@zooclaw/zooworkdesign'

export function DropdownMenuExample() {
  const [action, setAction] = useState('No action selected')
  return <div><DropdownMenu>
    <DropdownMenuTrigger asChild><Button type="button" variant="outline">Example actions</Button></DropdownMenuTrigger>
    <DropdownMenuContent><DropdownMenuItem onSelect={() => setAction('Example duplicated')}>Duplicate example</DropdownMenuItem></DropdownMenuContent>
  </DropdownMenu><p aria-live="polite">{action}</p></div>
}
```

## Tooltip

| 项目 | 说明 |
| --- | --- |
| 默认值 | Provider delayDuration=0；Content sideOffset=4 |
| 常用参数 | Root open/onOpenChange；Content side、align、sideOffset；统一延迟可在外层包 TooltipProvider。 |
| 状态与组合 | Tooltip 在缺少 Provider 时自动补默认 Provider；用于补充信息，不承载必须点击的表单。 |
| 键盘与可访问性 | 鼠标悬停或键盘焦点显示、Esc 关闭；触发器本身仍须有可访问名称。 |

```tsx
'use client'

import { Tooltip, TooltipTrigger, TooltipContent, Button } from '@zooclaw/zooworkdesign'

export function TooltipExample() {
  return <Tooltip><TooltipTrigger asChild><Button type="button" variant="outline">Preview help</Button></TooltipTrigger>
    <TooltipContent>Examples use local demonstration data.</TooltipContent>
  </Tooltip>
}
```

## Popover

| 项目 | 说明 |
| --- | --- |
| 默认值 | Content align=center、sideOffset=4 |
| 常用参数 | Root open/defaultOpen/onOpenChange；Content side、align；Anchor 可指定定位锚点。 |
| 状态与组合 | 可承载少量交互内容；更重的确认/编辑任务使用 Dialog。Content 已包含 Portal。 |
| 键盘与可访问性 | 触发器 asChild 配 Button；为内容提供名称，Esc 关闭并回到触发器。 |

```tsx
'use client'

import { Popover, PopoverTrigger, PopoverContent, Button, Label, Input } from '@zooclaw/zooworkdesign'

export function PopoverExample() {
  return <Popover><PopoverTrigger asChild><Button type="button" variant="outline">Example filters</Button></PopoverTrigger>
    <PopoverContent aria-label="Example filters"><Label htmlFor="example-filter">Filter by name</Label><Input id="example-filter" /></PopoverContent>
  </Popover>
}
```

## Tabs

| 项目 | 说明 |
| --- | --- |
| 默认值 | Root orientation=horizontal；List variant=default、size=md、block=false、shape=default |
| 常用参数 | Root value/defaultValue/onValueChange；List variant: default/line、size: sm/md/lg、shape: default/round。 |
| 状态与组合 | Trigger 和 Content 的 value 一一对应；选择状态由 Root 管理。切换不会替宿主保存表单或路由。 |
| 键盘与可访问性 | 方向键切换；如内容加载昂贵可使用 Radix activationMode="manual"。TabsList 用 aria-label 标注用途。 |

```tsx
'use client'

import { useState } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@zooclaw/zooworkdesign'

export function TabsExample() {
  const [value, setValue] = useState('design')
  return <Tabs value={value} onValueChange={setValue}>
    <TabsList variant="line" aria-label="Example documentation"><TabsTrigger value="design">Design</TabsTrigger><TabsTrigger value="api">API</TabsTrigger></TabsList>
    <TabsContent value="design">Design guidance</TabsContent><TabsContent value="api">API guidance</TabsContent>
  </Tabs>
}
```

## Accordion

| 项目 | 说明 |
| --- | --- |
| 默认值 | type 必填：single 或 multiple；没有额外 ZooWork 默认选择值 |
| 常用参数 | single 的 value/defaultValue 是 string，multiple 是 string[]；onValueChange 类型与之对应；single 可用 collapsible。 |
| 状态与组合 | 折叠面板的 key/value 唯一；不要把切换按钮嵌到 AccordionTrigger 里。 |
| 键盘与可访问性 | Enter/Space 展开；方向键在触发器之间移动。标题文字要能独立描述内容。 |

```tsx
'use client'

import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@zooclaw/zooworkdesign'

export function AccordionExample() {
  return <Accordion type="single" collapsible defaultValue="install">
    <AccordionItem value="install"><AccordionTrigger>How do I start?</AccordionTrigger>
      <AccordionContent>Install the package and import its Tailwind entry.</AccordionContent>
    </AccordionItem>
  </Accordion>
}
```

## Card

| 项目 | 说明 |
| --- | --- |
| 默认值 | size=default；可选 sm |
| 常用参数 | 组合 Header / Title / Description / Content / Footer / Action；外层支持普通 div 属性。 |
| 状态与组合 | 纯展示组件，可在 Server Component 使用；需要点击请在内容中使用 Button 或链接。 |
| 键盘与可访问性 | CardTitle 渲染 h3；按页面标题层级组织，不把整个卡片 div 冒充按钮。 |

```tsx
'use client'

import { Card, CardHeader, CardTitle, CardContent } from '@zooclaw/zooworkdesign'

export function CardExample() {
  return <Card size="sm"><CardHeader><CardTitle>Example project</CardTitle></CardHeader>
    <CardContent>Project information belongs here.</CardContent>
  </Card>
}
```

## Avatar

| 项目 | 说明 |
| --- | --- |
| 默认值 | size=default（32px）；sm=24px、lg=40px |
| 常用参数 | 组合 AvatarImage(src, alt)、AvatarFallback(delayMs)；支持 AvatarGroup / Badge。 |
| 状态与组合 | 图片加载失败显示 Fallback；示例用原创/自有头像或文字，不依赖远程个人头像。 |
| 键盘与可访问性 | 有意义的头像提供姓名，纯装饰图 alt=""；相邻已有姓名时避免重复朗读。 |

```tsx
'use client'

import { Avatar, AvatarFallback } from '@zooclaw/zooworkdesign'

export function AvatarExample() {
  return <Avatar size="lg" aria-label="Example user"><AvatarFallback>EX</AvatarFallback></Avatar>
}
```

## Badge

| 项目 | 说明 |
| --- | --- |
| 默认值 | variant=default；shape=default；asChild=false |
| 常用参数 | variant: default / secondary / destructive / notification / success / warning / danger / info / outline / ghost / link；shape: default/count/dot。 |
| 状态与组合 | 用于状态或计数，默认 span 不可点击。交互使用 asChild + link/button 的正确语义。 |
| 键盘与可访问性 | 状态同时包含文字；dot 形状必须配 aria-label 或附近文字。 |

```tsx
'use client'

import { Badge } from '@zooclaw/zooworkdesign'

export function BadgeExample() {
  return <Badge variant="success">Ready</Badge>
}
```

## Alert

| 项目 | 说明 |
| --- | --- |
| 默认值 | variant=default；status 未设置；icon 旧属性已弃用 |
| 常用参数 | status: default/info/success/warning/danger；variant: default/destructive；可组合 AlertAction。 |
| 状态与组合 | status 会生成相应图标和语义样式；省略 status 保留原 variant API。图标优先作为首个 SVG 子节点传入。 |
| 键盘与可访问性 | 非 danger 的 status 默认 role=status；danger 或未传 status 默认 role=alert。静态普通说明可由宿主覆盖 role，避免不必要的紧急播报。 |

```tsx
'use client'

import { Alert, AlertTitle, AlertDescription } from '@zooclaw/zooworkdesign'

export function AlertExample() {
  return <Alert status="info"><AlertTitle>Example information</AlertTitle><AlertDescription>Your changes stay in this demo.</AlertDescription></Alert>
}
```

## Empty

| 项目 | 说明 |
| --- | --- |
| 默认值 | Root 是展示容器；EmptyMedia variant=default，可选 icon |
| 常用参数 | 组合 Header / Title / Description / Content / Media；没有内置请求、重试或列表状态。 |
| 状态与组合 | 宿主决定空数据、加载、无权限和错误区别。操作回调由 Button/链接提供。 |
| 键盘与可访问性 | 说明原因和可执行的下一步；插画若为装饰使用空 alt。 |

```tsx
'use client'

import { useState } from 'react'
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription, EmptyContent, Button } from '@zooclaw/zooworkdesign'

export function EmptyExample() {
  const [created, setCreated] = useState(false)
  return created ? <p role="status">Example project created</p> : <Empty>
    <EmptyHeader><EmptyTitle>No projects</EmptyTitle><EmptyDescription>Create a project to get started.</EmptyDescription></EmptyHeader>
    <EmptyContent><Button type="button" onClick={() => setCreated(true)}>Create example project</Button></EmptyContent>
  </Empty>
}
```

## Separator

| 项目 | 说明 |
| --- | --- |
| 默认值 | orientation=horizontal；decorative=true |
| 常用参数 | orientation: horizontal/vertical；decorative 控制是否进入无障碍树。 |
| 状态与组合 | 垂直分隔线需要父级有可用高度；只分割视觉时保留 decorative。 |
| 键盘与可访问性 | 表达语义分组时设置 decorative={false}；它不是可拖动的分栏控件。 |

```tsx
'use client'

import { Separator } from '@zooclaw/zooworkdesign'

export function SeparatorExample() {
  return <div><p>Project details</p><Separator /><p>Project activity</p></div>
}
```

## Chat UI

Chat UI 继续 Alpha，当前完整接入示例见 [demo.tsx](../web/fixtures/consumer/app/demo.tsx)。使用 `ChatUiProvider` 包裹 `ChatComposer`，传入 `value`、`onChange` 和 `onSubmit`；接口请求、流式状态、取消、重试、上传及鉴权由宿主负责。不要把这些 20 个基础组件文档误读为全量 Chat API 已稳定。
