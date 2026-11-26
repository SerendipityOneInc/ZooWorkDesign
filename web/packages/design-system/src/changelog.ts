export { DESIGN_SYSTEM_VERSION } from './version'

export type ChangelogCategory = 'added' | 'changed' | 'removed' | 'fixed' | 'deprecated'

export interface ChangelogLink {
  label: string
  href: string
}

export interface ChangelogEntry {
  version: string
  date: string
  pr: ChangelogLink | null
  revision: ChangelogLink | null
  changes: Partial<Record<ChangelogCategory, readonly string[]>>
}

export const CHANGELOG_ENTRIES: readonly ChangelogEntry[] = [
  {
    version: 'Unreleased',
    date: '2026-11-26',
    pr: null,
    revision: null,
    changes: {
      added: [
        '公开发布 ZooWorkDesign 基础组件与 Chat Alpha，采用独立公开包名',
        '新增面向工具和 Agent 构建者的首页，提供可交互示例、接入说明与组件目录入口',
        '提供 20 个常用组件示例、主题指南与可交互组件组合',
        '提供 Apache 2.0 代码许可、第三方署名及范围明确的 CC BY 4.0 原创素材',
      ],
      changed: [
        '公开包与预览使用同次构建版本，安装无需组织权限',
      ],
      fixed: [
        '修复 Safari 下首页移动导航的 Esc 关闭与焦点返回',
      ],
    },
  },
]
