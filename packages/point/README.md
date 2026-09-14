# @so-chart/point

基于 Canvas 绘制的散点图组件，支持数值、日期或映射 x 轴，交叉线、标签、Tooltip 和高频点位命中。

## 安装

```bash
pnpm add @so-chart/point
```

## 最小用法

下面示例假设 `container` 是承载图表的 `HTMLElement`：

```ts
import getPointChart, { type PointOptions } from '@so-chart/point';

const chart = getPointChart({
  container,
  chartType: 'point',
  layout: { height: 320 },
});

const options: PointOptions = {
  xAxis: { type: 'value', data: { start: 0, end: 3 } },
  yAxis: { type: 'value', data: { start: 0, end: 100 } },
  datasets: [{ label: 'Series', data: [20, 45, 80] }],
  tooltip: { show: true },
};

chart.setOption(options);
```

`xAxis.type` 也可以使用 `date` 或 `mapping`；`cross` 控制十字线与点提示，`dotType`、`dotSize` 和 `dotColor` 控制点样式。组件卸载或重新创建图表前，请调用 `chart.dispose()`。

## CSP nonce 与类型

创建图表时可以传入 `nonce`。图表包不会生成 nonce，解析优先级为显式 `nonce`、宿主页面已有资源 nonce，最后兼容 `globalThis.__CSP_NONCE__`。

散点图选项和实例类型由包入口直接导出：

```ts
import getPointChart, { type PointOptions, type PointChartInstance } from '@so-chart/point';
```

## 示例与说明

- 可运行示例：[`demo/examples`](./demo/examples)
- 配置与行为说明：[`demo/docs`](./demo/docs)
- 预览站和包独立 Demo 都从 [`demo/manifest.ts`](./demo/manifest.ts) 读取示例关系；宿主接入仍以本 README、包入口和导出类型为准。
