# @so-chart/tree

```js
const chart = getTreeChart({
  container: dom, // 容器dom元素
  chartType: 'dagre', // 使用dagre布局
  layout: Layout, // 详见底部
});

chart.setOption({
  datasets: treeData,
  graph: graphlib.Graph<{ // 参考 https://github.com/dagrejs/dagre/wiki#configuring-the-layout
    nodeId: string;
    html: string;
  }>,
  linkType: 'straight' | 'curve' // 连线为 直线 or 曲线
});
```

# Layout

```js
Layout = {
  height?: number;
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
};
```

# 交互

Dagre 图支持节点拖拽、空白区域平移、连线文字选择、鼠标滚轮缩放，以及触控设备和触控板上的无修饰键双指/多指 pinch 缩放。缩放范围限制为 `0.5x` 到 `4x`，避免图形放大到视口外后只留下局部线段；空白区域可直接拖拽平移，触摸或鼠标落在节点上时优先执行节点拖拽，不会同时启动图形缩放，连线文字的选择交给浏览器处理。Tree 包入口运行时只公开默认工厂，类型导出除外，DOM 清理函数属于内部实现。

节点数据中的 `html` 和 `setTooltip` 的 `html` 参数会按 HTML 插入，属于可信内容边界；包含用户输入时应由宿主先转义或清洗。实例销毁时请调用 `chart.dispose()`。

# Flow 线上标签

Flow 图的 `label.dir` 默认为 `parallel`，标签通过 SVG `textPath` 沿连线排列。折线或圆角连线上的标签会根据整条真实路径的可用窗口动态计算字体大小，必要时减少字距，但不会使用 `textLength` 拉伸字形；连线的圆角和方向保持不变。需要明确水平显示时，可设置 `dir: 'horizontal'`。

Flow 节点的单行和多行文本都会使用节点的 `fontColor`。未显式设置时，默认值为 `var(--text-color, rgba(0, 0, 0, 0.5))`，因此宿主可以通过 CSS 变量让 SVG 文本跟随主题切换。

## TypeScript 类型

树图选项和实例类型由包入口直接导出；Dagre 类型仍通过声明依赖保持可解析：

```ts
import getTreeChart, { type DagreTreeOptions, type DagreInstance } from '@so-chart/tree';
```

## 示例与说明

- 可运行示例：[`demo/examples`](./demo/examples)
- 配置与行为说明：[`demo/docs`](./demo/docs)
- 预览站和包独立 Demo 都从 [`demo/manifest.ts`](./demo/manifest.ts) 读取示例关系；宿主接入仍以本 README、包入口和导出类型为准。
