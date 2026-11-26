# 第三方署名与发布检查

`third-party/inventory.json` 保存 2026-10-30 审核基线的 432 个锁定版本、来源、作者元数据、许可文件及 SHA-256。原始版权、许可和上游 NOTICE / ThirdPartyNoticeText 文本位于 `third-party/licenses/`。作者元数据不替代原始文件中的版权所有者署名。

2026-11-03 为修复测试工具安全告警，将 Vitest 家族的 8 项版本从 4.1.11 更新到 4.1.12。新版本均为 MIT，已从 npm 官方发布 tarball 提取原文并核对 lockfile integrity；总数仍为 432，源码/字体原审核基线保留在 `sourceCommit`，增量记录位于 `dependencyRefresh`。Next.js/Vite 的独立消费者模板版本另外记录在其 package.json，独立安装验证不属于仓库锁文件的 432 项盘点。

2026-11-18 为修复 lint 工具链的 minimatch 安全告警（GHSA-g3hv-75wg-m249），将 `@typescript-eslint/typescript-estree` 使用的 minimatch 从 10.2.6 锁到 11.0.1，并新增其依赖 `@isaacs/nonrecursive-glob-match@1.1.0`。两者均为 BlueOak-1.0.0，已从 npm 官方发布 tarball 提取原文并核对 lockfile integrity；后者包元数据未声明作者和仓库，作者按 npm 发布者记录。总数变为 433，`dependencyRefresh` 改为按日期排列的增量记录列表。两项都是开发依赖，不进入组件发布包的清单。

`THIRD_PARTY_NOTICES.md` 是仓库总清单。两个 npm 包分别包含按实际 dependencies / optionalDependencies / peerDependencies 及 workspace 依赖闭包生成的清单和许可文件；开发依赖不因此进入组件发布包。字体文件和对应 OFL 由 design-system 包提供。复制改写过的 48 个 shadcn/ui 文件及 ProductNavIcon 已在源码头部保留署名，并随编译产物保留。

更新步骤：

1. 依赖变更后，核对新版本的上游许可、版权及 NOTICE；将原文、来源和哈希更新到 `third-party/`。不得直接改锁文件哈希来绕过证据更新。两个仅有明确 MIT 声明的开发依赖保留证据限制，不用通用 MIT 模板替代上游原文。
2. 从 `web/` 运行 `pnpm licenses:sync`，同步仓库和两个包的清单；运行 `pnpm licenses:check` 检查原文和生成文件。
3. 按 AGENTS.md 完成构建与测试，运行 `pnpm pack:release`。打包过程核对真实 tgz 中的许可文件字节、源码署名及 210 个字体文件；缺失或改写会阻止交付。直接 `pnpm pack` 也会执行 prepack 校验。
4. 运行 `pnpm verify:consumer`，验证两个 tgz 的独立安装、类型、交互、CSS、资源和 SSR。
5. 预览的 Vite 构建/开发启动会根据预览运行依赖生成 `public/assets/licenses/`，随网站交付署名页与原文，并由浏览器检查真实链接。静态目录检查在验证阶段复用发布器的既有边界，保持与可信 main 发布器兼容。Figma 及其他分发内容仍需按实际内容携带声明，参考 [Figma 发布清单](FIGMA.md)。

法务状态：已盘点范围的许可证核查已认可，项目原创代码使用 Apache 2.0。`@napi-rs/lzma-linux-x64-gnu@1.5.1`、`stackback@0.0.2` 的 MIT 声明已纳入本次确认，缺少独立 LICENSE 原文的情况继续如实记录；GFS Didot 历史内嵌文字和版本对应限制也保留为技术档案，不再要求法务逐项复核。新增不明许可/来源时再提出具体问题。

授权边界见 [许可范围](../LICENSING.md) 与 [视觉素材清单](release/visual-assets.md)。使用独立公开包名；Chat UI 继续 Alpha。
