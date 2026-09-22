# @so-chart/tabs

图表内置标签栏的底层绘制能力。运行时使用原生 DOM，不依赖 React、React DOM 或 Ant Design。

## 安装

```bash
pnpm add @so-chart/tabs
```

搜索、分页、详情按钮等业务交互不属于图表包。调用方可以根据自己的 UI 框架和状态管理实现这些功能，并通过图表实例公开的 `datasets`、`labels` 和刷新方法控制显示状态。

## 内置 Tabs

`drawTabs(chart)` 是图表包内部使用的 SVG/`foreignObject` 标签栏渲染入口。标签超出可视宽度时才显示无边框滚动箭头，并根据当前滚动位置隐藏不可用方向；图表销毁或将 `labels.show` 更新为 `false` 时由图表包调用 `destroyTabs(svg)` 清理 DOM、事件和 `ResizeObserver`。

带坐标轴图表可通过 `labels.selectionMode` 设置图例点击方式。默认的 `single` 保留“只展示点击项，再次点击恢复全部”的行为；`multiple` 会独立切换每个数据集，允许同时隐藏或展示多项。饼图和雷达图保持原有的逐项切换行为。

## CSP 与类型

标签栏中的内联样式会复用图表实例上的 `nonce`。Tabs 包不会生成 nonce；图表包负责从显式配置、宿主资源或兼容的 `globalThis.__CSP_NONCE__` 中解析它。

公共图表契约由入口导出，类型导入不会产生运行时依赖：

```ts
import { type CommonChart } from '@so-chart/tabs';
```

## 示例与说明

- 可运行示例：[`demo/examples`](./demo/examples)
- 配置与行为说明：[`demo/docs`](./demo/docs)
- 预览站和包独立 Demo 都从 [`demo/manifest.ts`](./demo/manifest.ts) 读取示例关系；宿主接入仍以本 README、包入口和导出类型为准。
