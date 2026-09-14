# @so-chart/bar

基于 Canvas 绘制的柱状图包，提供基础分组柱状图、环形堆叠柱状图和趋势柱状图。

## 安装

```bash
pnpm add @so-chart/bar
```

## 最小用法

下面示例假设 `container` 是承载图表的 `HTMLElement`：

```ts
import getBarChart, { type BarOptions } from '@so-chart/bar';

const chart = getBarChart({
  container,
  chartType: 'bar',
  layout: { height: 320 },
});

const options: BarOptions = {
  xAxis: { type: 'category', data: ['A', 'B', 'C'] },
  yAxis: { type: 'value', data: { start: 0, end: 100 } },
  datasets: [{ label: 'Series', data: [20, 45, 80] }],
  tooltip: { show: true },
};

chart.setOption(options);
```

`chartType` 支持 `bar`、`circleStackBar` 和 `trend`，不同类型对应不同的选项类型。组件卸载或重新创建图表前，请调用 `chart.dispose()`。

## 柱宽与 hover 交互

趋势柱状图会根据 `scaleBand` 的实际带宽自适应柱宽。`maxBarWidth` 是最大值，`barGap` 是期望间距；当数据点较密时，间距会自动压缩，避免柱子退化为 1px 细线。Tooltip 命中使用 D3 `quadtree` 查找当前带宽内的最近柱位，鼠标经过柱间空隙时仍保持稳定命中。

基础分组柱状图在组间空白区域也会命中当前 x 轴分组内的最近柱位，鼠标从一组 bar 移向另一组 bar 时不会因为短暂经过空白而隐藏 Tooltip。

## 环形堆叠柱状图自适应

环形堆叠柱状图在未传入 `innerRadius` 或 `outerRadius` 时，会根据可用容器空间重新计算内外半径；显式半径超出可用区域时也会被限制。`bar.minWidth`、`bar.maxWidth` 和 `bar.gap` 控制柱子的切线宽度与间隙，默认值分别为 2px、24px 和 2px；数据点密集时会自动压缩间隙。x 轴标签默认自动降密，Tooltip 与绘制使用同一份角度区间进行命中。

## CSP nonce

创建图表时可以传入 `nonce`。图表包不会生成 nonce，解析优先级为显式 `nonce`、宿主页面已有 `script`/`style`/`link` nonce，最后兼容 `globalThis.__CSP_NONCE__`。

## TypeScript 类型

柱状图选项和实例类型由包入口直接导出：

```ts
import getBarChart, { type BarOptions, type BarChartInstance } from '@so-chart/bar';
```

## 示例与说明

- 可运行示例：[`demo/examples`](./demo/examples)
- 配置与行为说明：[`demo/docs`](./demo/docs)
- 预览站和包独立 Demo 都从 [`demo/manifest.ts`](./demo/manifest.ts) 读取示例关系；宿主接入仍以本 README、包入口和导出类型为准。
