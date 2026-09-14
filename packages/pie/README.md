# @so-chart/pie

基于 Canvas 绘制的饼图和环形图组件，支持标签引线、中心文本、分段 hover 和 Tooltip。

## 安装

```bash
pnpm add @so-chart/pie
```

## 最小用法

下面示例假设 `container` 是承载图表的 `HTMLElement`：

```ts
import getPieChart, { type PieOptions } from '@so-chart/pie';

const chart = getPieChart({
  container,
  chartType: 'pie',
  layout: { height: 320 },
});

const options: PieOptions = {
  datasets: [
    { label: 'A', data: 40 },
    { label: 'B', data: 35 },
    { label: 'C', data: 25 },
  ],
  tooltip: { show: true },
  hoverText: { type: 'center', totalText: 'Total' },
};

chart.setOption(options);
```

通过 `innerRadius` 可以创建环形图；`labels` 控制分段标签，`hoverText.type` 支持 `lead` 和 `center`。组件卸载或重新创建图表前，请调用 `chart.dispose()`，以释放动画帧、Canvas 和事件监听器。

## CSP nonce 与类型

创建图表时可以传入 `nonce`。图表包不会生成 nonce，解析优先级为显式 `nonce`、宿主页面已有资源 nonce，最后兼容 `globalThis.__CSP_NONCE__`。

饼图选项和实例类型由包入口直接导出：

```ts
import getPieChart, { type PieOptions, type PieChartInstance } from '@so-chart/pie';
```

## 示例与说明

- 可运行示例：[`demo/examples`](./demo/examples)
- 配置与行为说明：[`demo/docs`](./demo/docs)
- 预览站和包独立 Demo 都从 [`demo/manifest.ts`](./demo/manifest.ts) 读取示例关系；宿主接入仍以本 README、包入口和导出类型为准。
