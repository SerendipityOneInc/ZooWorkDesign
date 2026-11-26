# 首版支持范围

| 项目 | 当前范围 |
| --- | --- |
| UI 框架 | React Web；基础包 React 19；Chat UI 的 peer 范围以包声明为准，当前要求 React/React DOM >=19.2.7 |
| 样式 | Tailwind CSS 4；需要消费项目编译，支持 Paper Focus 浅色/深色 |
| 真实安装验证 | Vite 7.3.7、Next.js 15.5.29 App Router；测试实际 tgz 和独立依赖树 |
| 浏览器验证 | 核心预览流程已在 Chrome、Firefox 和 WebKit 验证；窄视口不等于真实 iOS 设备验证 |
| 基础组件 | 3.0 候选版；素材及营销链接兼容性变化见 [迁移指南](MIGRATING_TO_V3.md) |
| Chat UI | Alpha，API 和视觉仍可能调整；请固定版本并核对 Changelog |
| Figma | 对应视觉、变量与组件属性；浏览器行为以 React 实现为准 |
| 暂不支持 | 在 Vue 或原生 iOS/Android 中直接运行 React 组件；可复用适用的设计规范和 tokens |

React 与 React DOM 使用匹配版本。Node 24 / pnpm 10.26.2 是本仓库开发验证环境，不意味着浏览器需要 Node。

## 当前弃用项

- Button 的 `variant="primary"` 是 `default` 的视觉别名，新代码使用 `default`。
- Alert 的 `icon` 旧属性使用首个 SVG 子节点替代；常见提示可使用 `status`。
- 旧 `FieldProps`、`BadgeProps`、`AlertProps` 优先改用 `React.ComponentProps<typeof Component>`。
- 旧 Toast API 保留兼容，新接入优先使用 Sonner / sonnerToast。

这些弃用说明不指定未经确认的移除日期。组件更新查 Changelog，消费项目显式升级并提交 lockfile。

## 首发前剩余验收

对最终素材和配置执行真实安装、主题、键盘焦点、移动端和 Figma 复制复用检查；正式公开后再从无内部权限的账号验证安装和链接。实际公开分发以匿名安装验收结果为准。
