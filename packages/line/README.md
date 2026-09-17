# @so-chart/line

基于 Canvas 绘制的折线图组件，支持平滑曲线、面积、堆叠、缺失值处理、交叉线、Voronoi 命中和 Tooltip。

## 安装

```bash
pnpm add @so-chart/line
```

## 最小用法

下面示例假设 `container` 是承载图表的 `HTMLElement`：

```ts
import getLineChart, { type LineOptions } from '@so-chart/line';

const chart = getLineChart({
  container,
  chartType: 'line',
  layout: { height: 320 },
});

const options: LineOptions = {
  xAxis: { type: 'value', data: [0, 1, 2] },
  yAxis: { type: 'value', data: { start: 0, end: 100 } },
  datasets: [{ label: 'Series', data: [20, 45, 80] }],
  smooth: true,
  tooltip: { show: true },
};

chart.setOption(options);
```

`area`、`stack`、`showPoint`、`voronoi`、`cross`、`mark` 和 `labels` 都是 `LineOptions` 的可选配置。数据中的 `null`/`undefined` 可配合 `missing` 选择断线、直线连接或归零处理。Tooltip 支持 `fixed: true` 与 `drag: true` 固定并拖拽提示框。

图例默认使用 `labels.selectionMode: 'single'`：点击一项后只显示对应曲线，再次点击恢复全部。设置为 `multiple` 后，每次点击只切换对应曲线，允许同时隐藏或显示多条曲线，也允许全部隐藏。

## 生命周期、主题与 CSP

组件卸载或重新创建图表前，请调用 `chart.dispose()`，以释放动画帧、Canvas、事件通道和 ResizeObserver。图表包不会持有宿主主题状态；主题变化后应重新执行 `setOption` 并传入新的颜色配置。

创建图表时可以传入 `nonce`。解析优先级为显式 `nonce`、宿主页面已有资源 nonce，最后兼容 `globalThis.__CSP_NONCE__`。

## TypeScript 类型

折线图选项和实例类型由包入口直接导出：

```ts
import getLineChart, { type LineOptions, type LineChartInstance } from '@so-chart/line';
```

## 示例与说明

- 可运行示例：[`demo/examples`](./demo/examples)
- 配置与行为说明：[`demo/docs`](./demo/docs)
- 预览站和包独立 Demo 都从 [`demo/manifest.ts`](./demo/manifest.ts) 读取示例关系；宿主接入仍以本 README、包入口和导出类型为准。
