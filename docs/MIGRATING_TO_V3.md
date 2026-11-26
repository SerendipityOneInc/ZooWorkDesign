# 3.0 候选版迁移

此候选版清理首版公开素材，并把产品账号从通用营销组件中移出。这会改变已有资源路径与默认行为，因此基础包版本基线改为 **3.0.0**，不是 2.x 补丁。公开分发采用新包名 `@zooclaw/zooworkdesign` 与 `@zooclaw/zooworkdesign-chat`。既有私有包及历史版本不变；Chat UI 继续 Alpha。

## 素材路径

47 个资源文件及相应 `SOURCE_ASSETS` 条目已移除，完整路径见 [removed-assets.json](release/removed-assets.json)。检索消费项目对这些路径、目录和目录条目的使用，替换为项目自己获得授权的素材，或本包保留的通用图形。不要简单恢复认证标识作为默认示例。

`assets/**` 的通配导出仍存在，但不保证被删除的具体路径能继续导入。保留文件与许可见 [视觉素材清单](release/visual-assets.md) 和 [原创素材授权](../DESIGN_ASSETS.md)。ZooWork 标识没有获得 CC BY 通用复用授权。

## 营销页脚链接

`MARKETING_SOCIAL_LINKS` 仍导出，但默认值为空。`MarketingSocialLinks` 不再自动提供产品社交账号；`MarketingFooter` 默认不显示社交链接。

```tsx
import { MarketingSocialLinks } from '@zooclaw/zooworkdesign'

<MarketingSocialLinks links={[
  { label: 'Community', href: 'https://example.com/community' },
  { label: 'Guides', href: 'https://example.com/guides', icon: '/my-licensed-icon.svg' },
]} />
```

`MarketingFooter` 使用同样的数组传入 `socialLinks`。`label` 同时作为可访问名称；不传 `icon` 时使用已有的通用地球图标。URL 和可选图标由接入方维护。

## 配套更新

两包使用同次构建的版本；Chat 包依赖会在发布时写入精确基础库版本。升级前运行项目构建，并检查页脚、资源导入及主题表现。常用组件交互 API 未因本次素材清理改名，20 个示例见 [COMPONENTS.md](COMPONENTS.md)。
