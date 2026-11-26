# 跨仓库接入

[20 个常用组件](COMPONENTS.md) · [主题配置与排错](THEMING.md) · [支持范围](SUPPORT.md)

## 适用范围

React Web 组件库，支持 React 19（Chat UI 要求 React/React DOM >=19.2.7）和 Tailwind CSS 4。Vue、原生 iOS 不能直接运行这些 React 组件，可以参考 token 和视觉规范。没有 Tailwind 的项目需先配置 Tailwind 4，CSS 中包含需要编译的 `@theme` 和 `@utility`。

## 安装

两个组件包使用 npmjs.org 公开分发，消费者无需 npm 登录、组织权限或读取 Token。

```bash
pnpm add @zooclaw/zooworkdesign@latest
# 仅需要聊天 UI 时添加，alpha API 仍会调整
pnpm add @zooclaw/zooworkdesign-chat@next
```

PR 交付成功后，可安装两个 `@preview` 包，或读取固定预览的 `preview-version.json` 安装其中记录的准确版本。Chat UI 精确依赖同次发布的基础库。要复现指定 PR，可使用 `@pr-N` 标签；要复现某次构建，应固定版本号而非移动标签。升级已有项目后提交自己的 lockfile。

本地开发也可下载 CI 的 `npm-packages` artifact，或 `pnpm pack:release` 生成 tgz；将两个 tgz 放入消费项目的 vendor 目录后用 `pnpm add ./vendor/…tgz` 安装。配套基础库尚未发布时，需在消费者 `pnpm.overrides` 中将 `@zooclaw/zooworkdesign` 指向对应 tgz。切回 registry 时去掉此覆盖。

## 样式与主题

在全局 CSS 的其他规则之前导入：

```css
@import 'tailwindcss';
@import '@zooclaw/zooworkdesign/tailwind.css';
@import '@zooclaw/zooworkdesign/brand.css';
/* 官网导航、页脚等组件需要 */
@import '@zooclaw/zooworkdesign/marketing.css';
/* 仅安装了 chat-ui 时需要 */
@import '@zooclaw/zooworkdesign-chat/tailwind.css';
```

`tailwind.css` 的 `@source './dist/**/*.js'` 相对已安装包解析，因此不要求消费者硬编码 node_modules 路径。Tailwind 默认不扫描 node_modules，漏掉这一步会导致按钮、布局等失去样式。

`brand.css` 包含本地字体资源与品牌排版。所有资源都随 npm 包提供，不依赖外部产品的 public 目录。

```html
<html data-brand-theme="paper-focus">
```

深色模式用 `<html class="dark" data-brand-theme="paper-focus">`。React 与 React DOM 由消费项目提供，两个版本应一致。

## Vite

安装 Tailwind 4 和 `@tailwindcss/vite`，在 Vite plugins 中注册 `tailwindcss()`；在主入口 import 上述 CSS。无需设置组件源码 alias。导入组件来自 `@zooclaw/zooworkdesign` / `@zooclaw/zooworkdesign-chat`。

## Next.js App Router

使用 Tailwind 4 的 `@tailwindcss/postcss` 插件。在根 layout 导入 globals.css 并设置根节点主题属性。

有事件处理、useState、聊天输入等交互的消费组件需要 `"use client"`。包的交互组件保留自己的 client 边界；无需将整个应用变成 client component。默认无需 transpilePackages，npm 包已经输出 JavaScript 和类型声明。

```tsx
'use client'

import { useState } from 'react'
import { Button, FocusModalityProvider } from '@zooclaw/zooworkdesign'

export default function Example() {
  const [count, setCount] = useState(0)
  return <FocusModalityProvider>
    <Button onClick={() => setCount(count + 1)}>已创建 {count} 个</Button>
  </FocusModalityProvider>
}
```

## 组件、业务逻辑与聊天配置

组件提供视觉和交互。请求接口、鉴权、文件上传、消息发送、路由和持久化由消费项目接入。聊天渲染使用 `ChatUiProvider` 注入翻译、Markdown 等宿主能力；生产用法与类型定义在组件预览和包的 `.d.ts` 中可查。

## 可运行的最小示例

仓库的 [`web/fixtures/consumer`](../web/fixtures/consumer) 是同时覆盖 Vite 与 Next.js App Router 的实际消费示例，包括 Button 点击、Tabs、主题/CSS、品牌资源及 `ChatUiProvider` / `ChatComposer` 的发送回调。查看 [`app/demo.tsx`](../web/fixtures/consumer/app/demo.tsx)、[`app/globals.css`](../web/fixtures/consumer/app/globals.css) 和两个框架配置即可复用接入方式。

该目录是验证模板，包版本由验证脚本注入，不要直接在模板里安装或把它作为新的 workspace 应用。要运行完整示例，从仓库 `web/` 执行 `pnpm build && pnpm pack:release && pnpm verify:consumer`；脚本在临时项目中安装本次两个 tgz，并验证真实交互、样式与 SSR。临时测试中用覆盖指向配套基础包，避免意外连接另一个 registry 版本。

## 升级与兼容性

新功能或修复在设计系统仓库修改，通过 CI 后发布新版本。业务项目使用 `pnpm up @zooclaw/zooworkdesign@<版本>` 显式升级，提交自己的 lockfile。不要直接改 node_modules，也不要长期复制组件到业务仓库。

若消费项目启用了 pnpm `minimumReleaseAge`，刚发布的版本可能暂时被阻止。按该项目的依赖策略选择等待或对这次安装明确允许新版本，不全局关闭保护。
