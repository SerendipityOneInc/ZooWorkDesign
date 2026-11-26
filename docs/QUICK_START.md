# 把仓库链接和需求交给 AI

在 Codex 或 Claude Code 中打开你的项目文件夹，将 [ZooWork Design System 仓库](https://github.com/SerendipityOneInc/ZooWorkDesign) 的链接和页面需求一起发给 AI。AI 根据仓库的 README 和 [跨仓库接入文档](CONSUMING.md)，检查环境、安装真实组件包、配置主题并搭建页面。

## 新建项目：复制这段话

```text
请使用这个 ZooWork 组件库：https://github.com/SerendipityOneInc/ZooWorkDesign
先阅读仓库 README 和 docs/CONSUMING.md，按接入文档安装并引用真实组件包。

在当前文件夹下新建一个团队任务看板项目，包含左侧导航、搜索、
任务统计、任务卡片、状态筛选和新建任务弹窗。
请检查运行环境，读取组件实际 API 和类型后实现，先用明确标注的示例数据。
完成后验证构建和交互，启动本地预览并给我实际访问地址。
```

## 已有项目：复制这段话

```text
请使用这个 ZooWork 组件库：https://github.com/SerendipityOneInc/ZooWorkDesign
先阅读仓库 README 和 docs/CONSUMING.md，并检查当前项目的技术栈与路由。

在这个项目中增加成员管理页面，包含成员列表、搜索、角色筛选和邀请成员弹窗。
请按接入文档复用真实组件包，遵循现有项目的配置及数据接入方式。
完成后验证构建和新增交互，并告诉我如何预览。
```

后续需求直接说：“继续使用 ZooWork 组件，在刚才的页面增加批量选择和删除确认弹窗。”

## 同事需要准备什么

- 源码与 npm 包均面向公开使用，安装无需组织权限或 npm Token。
- 让 AI 检查项目环境并处理依赖和样式接入；依赖配置不足时按它指出的具体权限完成授权，不分享发布 Token。
- 这是 React Web 组件库。AI 应先检查兼容性；真实接口、鉴权和部署按业务需求接入。Chat UI 目前为施工中 / alpha，使用聊天功能时保持这一说明。

无需安装额外 Skill。[组件预览](https://serendipityoneinc.github.io/ZooWorkDesign/)可帮助选样式：将组件名称、链接或截图附到需求即可。

## English

Open your project in Codex or Claude Code and send the repository URL with your request:

> Use https://github.com/SerendipityOneInc/ZooWorkDesign to build a team task board with navigation, search, statistics, task cards, status filters and a create-task dialog. Read the repository README and docs/CONSUMING.md first, install and import the actual component packages, inspect their APIs, use clearly labelled sample data, validate the build and interactions, and run a local preview. For an existing project, inspect its stack and routes and follow its configuration.

The source and npm packages are public; installation requires no organization membership or npm token. This is a React Web library, and Chat UI remains under construction / alpha. No additional Skill is required.
