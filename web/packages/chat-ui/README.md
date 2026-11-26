# @zooclaw/zooworkdesign-chat

🚧 **施工中 / Alpha**。合并后的版本发布到 `next`，PR 版本发布到 `preview`，API 和视觉细节仍在调整。与预览完全对应的版本见固定站点的 `preview-version.json`。

ZooWork 聊天输入、Mention、消息、附件、活动状态、选择器和交互卡片。与设计系统共享基础组件，宿主注入业务数据和操作。

需要 React/React DOM >=19.2.7、Tailwind CSS 4 和 `@zooclaw/zooworkdesign`。

```css
@import 'tailwindcss';
@import '@zooclaw/zooworkdesign/tailwind.css';
@import '@zooclaw/zooworkdesign-chat/tailwind.css';
```

通过 `ChatUiProvider` 注入翻译和渲染能力。`ChatComposer` 的 `onSubmit` 由宿主连接真实消息接口。

### 模型与思考强度（施工中，使用包含此 API 的配套版本）

`ModelPicker` 负责模型列表、搜索与展开。通过 `modelSettings` 将选择成功后的第二层面板设为 `ComposerEffortPanel`：

```tsx
<ModelPicker
  options={models}
  value={modelId}
  onValueChange={saveModel}
  modelSettings={{
    triggerLabel: '选择模型',
    available: id => Boolean(capabilities[id]?.levels.length),
    render: (model, onBack) => (
      <ComposerEffortPanel
        key={model.id}
        model={model}
        value={savedEfforts[model.id]}
        levels={capabilities[model.id].levels}
        onBack={onBack}
        onSave={level => saveEffort(model.id, level)}
        onSaveError={showError}
      />
    ),
  }}
/>
```

`models`、`capabilities` 和保存函数由项目提供。保存函数成功后更新传入值，失败返回 `false`；请求抛错也会回退并调用 `onSaveError`。不支持 effort 的自动模式应让 `available` 返回 `false`。`labels` 可覆盖思考强度的中英文文案，组件默认英文。

在 `ChatComposer.toolbarEndAction` 中放入这个选择器即可用于聊天工具栏。Max 效果与减少动态效果适配已包含在共享组件中，无需宿主复制样式。

单独使用滑块时，从 `@zooclaw/zooworkdesign` 导入 `EffortSlider`，无需安装或渲染聊天面板。直接展示 `ComposerEffortPanel` 时可省略 `onBack` 并设 `autoFocus={false}`；点击打开的弹出面板仍可自动聚焦。

[完整接入文档](https://github.com/SerendipityOneInc/ZooWorkDesign/blob/main/docs/CONSUMING.md)

## License and attribution

Original component code and CSS: [Apache-2.0](LICENSE). Third-party code and fonts retain their own terms; see [third-party notices](THIRD_PARTY_NOTICES.md) and [licensing scope](LICENSING.md). Visual assets and trademarks are excluded from the code license unless separately stated.
