# @so-chart/radar

雷达图组件，使用 Canvas 绘制图形，并通过 SVG 交互层支持数据区域 hover。

## Hover 交互

雷达图以每个数据集的填充多边形作为 hover 命中区域。将鼠标移动到整块区域内时，该区域会高亮并展示 tooltip；tooltip 会列出当前数据集的全部维度和值。区域重叠时按绘制顺序优先命中最上层的数据集，图表 resize 后会重新计算区域坐标。

```ts
chart.setOption({
  hover: {
    opacity: 0.24,
    lineWidth: 3,
    color: '#2aaeea',
  },
  tooltip: {
    show: true,
  },
  // xAxis、yAxis、radius、datasets ...
});
```

`hover.opacity` 默认值为 `0.24`，会限制在 `0` 到 `1`；`hover.lineWidth` 默认值为 `3`，单位与图表内部绘制坐标一致；不传 `hover.color` 时会跟随当前数据集的 `lineColor`。`null` 和 `undefined` 在多边形几何中按 0 处理，在 tooltip 中显示为 `—`，以区分缺失值和真实的 0。tooltip 支持公共 tooltip 的 `show`、`fixed`、`drag` 和 `formatter` 配置；普通 hover Tooltip 与命中点保持约 12px 屏幕间距，边缘空间不足时会选择更宽裕的一侧，并按浏览器帧率合并位置更新，垂直方向切换时使用 120ms 缓动。

包入口运行时只公开默认的 `getRadarChart` 工厂，类型导出除外；DOM 清理函数属于内部实现，避免 UMD 产物产生 default 与 named export 混合警告。

## TypeScript 类型

雷达图选项和实例类型由包入口直接导出；运行时仍只有默认图表工厂：

```ts
import getRadarChart, { type RadarOptions, type RadarInstance } from '@so-chart/radar';
```

## 示例与说明

- 可运行示例：[`demo/examples`](./demo/examples)
- 配置与行为说明：[`demo/docs`](./demo/docs)
- 预览站和包独立 Demo 都从 [`demo/manifest.ts`](./demo/manifest.ts) 读取示例关系；宿主接入仍以本 README、包入口和导出类型为准。
