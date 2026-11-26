# 样式与主题配置

先按 [接入指南](CONSUMING.md)安装 React 19、Tailwind CSS 4 和组件包。当前生产主题为 Paper Focus。

## 一次性导入

```css
@import 'tailwindcss';
@import '@zooclaw/zooworkdesign/tailwind.css';
@import '@zooclaw/zooworkdesign/brand.css';
/* 仅使用营销组件时 */
@import '@zooclaw/zooworkdesign/marketing.css';
/* 仅安装并使用 Chat UI 时 */
@import '@zooclaw/zooworkdesign-chat/tailwind.css';
```

基础包的 tailwind.css 已包含 tokens.css、zoowork-theme.css 和 dist 的扫描路径；不要再重复导入这两个 CSS。brand.css 提供随包字体；消费项目仍需负责 Tailwind 编译。

## 明暗模式

在 HTML 根节点设置 `data-brand-theme="paper-focus"`，通过根节点的 `dark` class 切换。Portal 弹层也会继承根节点主题；只给局部容器设置变量，会让挂载到 body 的弹层与页面颜色不一致。

```tsx
// 由消费项目的主题状态/持久化逻辑调用；不要在服务端执行 document。
function applyAppearance(dark: boolean) {
  document.documentElement.dataset.brandTheme = 'paper-focus'
  document.documentElement.classList.toggle('dark', dark)
}
```

Next.js 的根 layout 先渲染确定的主题属性；若按系统主题或本地存储选择，在消费项目处理首屏闪烁和 hydration 一致性。组件库不会替应用保存用户主题偏好。

## 覆盖主题

将覆盖放在上述 imports **之后**，使用同等或更高特异性的根选择器。不要只覆盖 Tailwind 的 `--color-*` 别名；多数组件读取语义变量。

```css
:root[data-brand-theme='paper-focus'] {
  --primary: #234e40;
  --primary-foreground: #ffffff;
  --primary-hover: #1b3e32;
  --primary-active: #153328;
  --ring: #234e40;
}
:root.dark[data-brand-theme='paper-focus'] {
  --primary: #b4dec9;
  --primary-foreground: #10271c;
  --primary-hover: #c5e8d8;
  --primary-active: #a2d2ba;
  --ring: #b4dec9;
}
```

这只是按钮/焦点覆盖示例，不代表完整第二套品牌已经验收。Product、Marketing、Chat 中仍有专用 `--brand-*`、`--landing-*`、`--chat-ui-*` 和历史 `--ecap-*` 变量，按实际使用组件核对浅深色、悬停、禁用和错误状态。文字、背景和边框应成组调整，保留键盘焦点可见性。

| 场景 | 常用变量 |
| --- | --- |
| 页面与正文 | --background、--foreground、--muted-foreground |
| 卡片与弹层 | --card、--card-foreground、--popover、--popover-foreground |
| 控件与焦点 | --primary、--primary-foreground、--input、--border、--ring |
| 品牌及聊天形状 | --brand-card-radius、--brand-composer-radius、--brand-display-font |

## 故障排查

- 没有样式：检查 Tailwind 插件及基础包 tailwind.css；只有 tokens.css 不会扫描组件 class。
- 弹层主题不一致：把主题属性放到 html；不要只作用于业务内容 div。
- CSS 覆盖无效：检查加载顺序与 `:root.dark[data-brand-theme='paper-focus']` 的特异性。
- 字体或图片 404：保留 bundler 处理后的相对 URL，核对部署 base path，避免把源码资源路径写死成站点根目录。
- 组件显示正常但业务动作没有发生：请求、路由、存储、错误处理由宿主实现，组件只调用所提供的回调。
