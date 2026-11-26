# @zooclaw/zooworkdesign

ZooWork React Web 设计系统。公开 npm 包，提供编译后的 ESM、TypeScript 类型、主题和品牌资源。安装 `@latest` 获取合并后的发布版本；`@preview` 为配套公开预览的 PR 版本。

安装后在 Tailwind CSS 4 全局入口导入：

```css
@import 'tailwindcss';
@import '@zooclaw/zooworkdesign/tailwind.css';
@import '@zooclaw/zooworkdesign/brand.css';
```

根节点设置 `data-brand-theme="paper-focus"`。从 `@zooclaw/zooworkdesign` 导入 Button、Tabs、Splitter 等组件。React 19 由宿主提供。

独立思考强度滑块（使用包含此 API 的配套版本）：

```tsx
import { EffortSlider } from '@zooclaw/zooworkdesign'

<EffortSlider value={effort} onValueChange={setEffort} onValueCommit={saveEffort} />
```

支持 `low / medium / high / max`，`levels` 可限制可用档位，`labels` 可传入中文。拖动时更新显示，松手时调用 `onValueCommit`；保存由项目负责。独立使用默认不抢焦点，Max 动效会适配减少动态效果设置。

包内提供的侧边栏与账户组件：

```tsx
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup,
  DropdownMenuRadioItem, DropdownMenuAction, DropdownMenuTrigger,
  WorkspaceSwitcherTrigger, WorkspaceMonogram,
} from '@zooclaw/zooworkdesign'

<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <WorkspaceSwitcherTrigger
      name={project.name}
      avatar={<WorkspaceMonogram name={project.name} />}
      layout="primary-nav"
      hideNameOnMobile={false}
    />
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuRadioGroup value={project.id} onValueChange={selectProject}>
      {projects.map(item => <DropdownMenuRadioItem key={item.id} value={item.id} indicator="check">
        <WorkspaceMonogram name={item.name} />{item.name}
      </DropdownMenuRadioItem>)}
    </DropdownMenuRadioGroup>
    <DropdownMenuAction onSelect={createProject}>Create project</DropdownMenuAction>
  </DropdownMenuContent>
</DropdownMenu>
```

`WorkspaceSwitcherTrigger.layout` 默认 `workspace`，保留 Agent 工作区的头像和移动端隐藏名称规则；`primary-nav` / `secondary-nav` 对齐各自导航的图标和文字列。`WorkspaceMonogram` 使用 20px 中性色底及名称首字。未传 `indicator` 的 RadioItem 仍使用圆点。`DropdownMenuAction` 的 `variant` 复用 Button（例如 outline）；省略时保持 default。

`PrimaryNavFooter` 放在 `PrimaryNavigation.footer` 插槽中，提供账户区域间距和 Paper Focus 顶部分隔线。内部使用 `PrimaryNavAccountMenu` 的 `open/onOpenChange` 控制状态，并通过 children 传入账户内容；`label/profileLabel/menuLabel` 可本地化。它管理弹层定位、Escape 与外部点击关闭，关闭后恢复到实际触发入口；外部交互保留用户的新焦点。floating 表面在短视口使用 Radix 可用高度和内部滚动，Paper Focus 的旧 inline 菜单定位/裁切规则不会覆盖它。`AccountMenuItem asChild` 支持宿主的链接组件。

Paper Focus 下，`PrimaryNavUserCard` 的透明底、文字和入口样式由组件自身承载；不依赖 `side-nav` 祖先，也不受 768px 桌面断点限制。独立组件与完整导航的外观应一致。接入与视觉验收仍使用完整 `PrimaryNavigation.footer → PrimaryNavFooter → PrimaryNavAccountMenu` 组合，短视口仅改变可用高度与滚动，不另造账户菜单布局。

导航组合规则：全局 Profile 入口只放在一级导航。Settings / Agent 二级导航保留返回入口和场景菜单，不重复全局 Profile；Settings 的 Account / General 内容页入口继续保留。没有账户 Footer 时不额外添加底部分隔线。`WorkspaceLayout.navigationFooter` 是通用插槽，仍可承载场景相关内容；此规则不删除 API，也不在运行时过滤调用方传入的内容。

全局购买引导（例如首充优惠卡和 Add funds 提醒）同样只放在一级导航，不放入 Settings / Agent 二级导航。Billing 内容页自身的充值按钮仍可保留。引导里的 Add funds 使用 Button，在当前页面上打开共享 `Dialog`，保留背景页、筛选条件和滚动位置；它不是前往 Billing 的导航链接。余额/账单详情链接继续导航到 Billing，外部充值深链接由宿主兼容。弹窗关闭后恢复到原入口；若入口位于已关闭的账户弹层或手机导航，则恢复到对应的账户/导航触发按钮。打开或关闭弹窗本身不创建支付订单。

引导卡的插图使用装饰性语义（空 alt），不与标题争夺层级。使用宿主品牌 token 的柔和底色与可读文字色；渐变可用于填充图形，普通导航及 Button 沿用组件样式。Platform 的紧凑参考组合沿用首页 Agent 卡片的出框图形：48px 礼物半露在顶部边缘，左对齐 16px；组件自身在卡片上方预留 24px，避免被滚动容器裁切或覆盖前一项。卡片用 32px 顶部、16px 水平、12px 底部内边距，16/24px 标题、12/20px 说明，12px 后放置共享 outline Button。高度随内容增长，不固定高度或裁切文字。窄屏允许标题换行，短屏保证导航和账户入口仍可达。此规则描述消费方组合，不新增优惠金额、资格或支付逻辑的组件 API。

**Navigation and purchase guidance:** Global account entry and purchase promotions belong to primary navigation only. Secondary Settings/Agent navigation keeps its back action and contextual items. Page-level Billing actions remain available. An in-app Add funds button opens the shared dialog over the current page without navigating away; balance/history links still navigate to Billing. The host owns external deep links, permissions and payment state. Closing returns focus to the original trigger, or to the account/mobile navigation trigger when its surface was dismissed. Opening the dialog must not create an order. Decorative filled-gradient artwork may use host brand tokens; shared navigation and Button styling remain unchanged. For compact guidance, follow the Home Agent card treatment: a 48px illustration overlaps the top edge by half, with 24px of space reserved above the card. Platform uses 16px horizontal, 32px top and 12px bottom padding, and a 12px gap before the outline action. Allow the card to grow with its text; keep the overlapping artwork inside the scrollable content bounds.

`AccountCreditsSection` / `AccountCreditsRow` 只展示调用方格式化的余额。Row 支持 `href + LinkComponent` 或 `onNavigate`，`onAbout` 是独立说明按钮；`disabled` 显示余额而不提供账单导航。金额单位、权限、账单路由、充值与账户操作由宿主负责。

固定展开的侧栏传 `PrimaryNavLogo isCollapsed={false}` 并省略 `onToggle`；组件会始终显示完整 Logo 且不生成折叠按钮。已有可折叠导航继续同时传入 `isCollapsed` 和 `onToggle`。`darkLogoSrc` 可省略：缺少专用深色资源时，组件对浅色原图应用白色回退滤镜；传入专用深色资源时不改变它。

全站页面的共享组件：

```tsx
import { AppearanceSelector, Table, WorkspacePageHeader } from '@zooclaw/zooworkdesign'

<WorkspacePageHeader size="page" headingLevel={1} title="API keys"
  description="Manage credentials for the selected project." actions={<Button>Create key</Button>} />
<AppearanceSelector value={appearance} onValueChange={setAppearance}
  groupLabel="Appearance" labels={{ light: 'Light', dark: 'Dark', system: 'Follow System' }} />
<Table scrollLabel="Project usage table scroll area" aria-label="Project usage">…</Table>
```

`WorkspacePageHeader` 默认 `size="section"` 的紧凑布局保持不变，page 采用 24px 标题和窄屏操作换行。`AppearanceSelector` 使用每实例独立的原生 radio 组，支持 Tab、方向键、标签点击与 `disabled`；80px 示意块的浅/深颜色固定，选中与键盘焦点使用 ring token，不自动应用或保存主题。

宽表格通过 `scrollLabel` 命名外层 region 并加入 Tab 顺序，聚焦后由浏览器处理左右滚动。未传此属性时不新增 landmark 或 tab stop；`className`、`aria-label`、事件和 ref 仍属于原生 table。

[完整接入文档](https://github.com/SerendipityOneInc/ZooWorkDesign/blob/main/docs/CONSUMING.md) · [仓库](https://github.com/SerendipityOneInc/ZooWorkDesign)

## License and attribution

Original component code and CSS: [Apache-2.0](LICENSE). Third-party code and fonts retain their own terms; see [third-party notices](THIRD_PARTY_NOTICES.md) and [licensing scope](LICENSING.md). Visual assets and trademarks are excluded from the code license unless separately stated.
