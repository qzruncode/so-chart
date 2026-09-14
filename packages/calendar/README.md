# @so-chart/calendar

基于 SVG 的日历热力图组件，支持按日期区间展示单行或多行热力图。

## 安装

```bash
pnpm add @so-chart/calendar
```

## 最小用法

下面示例假设 `container` 是承载图表的 `HTMLElement`：

```ts
import getCalendarChart, { type CalendarHeatmapOptions } from '@so-chart/calendar';

const chart = getCalendarChart({
  container,
  chartType: 'heatmap',
  layout: { height: 220 },
});

const options: CalendarHeatmapOptions = {
  rangeData: { start: new Date('2026-01-01'), end: new Date('2026-01-31') },
  datasets: [{ date: new Date('2026-01-08'), data: 42 }],
  tooltip: ({ date, data }) => `${date}: ${data}`,
};

chart.setOption(options);
```

## 日期方块交互

日期方块支持 hover 高亮：每个方块有略大于视觉尺寸的透明命中区，独立的 hover 标记会平滑跟随当前日期方块，避免小方块导致鼠标样式跳动；配置 `tooltip` 后，提示内容会跟随当前日期方块。Tooltip 与命中点保持 12px 屏幕间距，靠近边缘时自动换向，并使用 40ms 短过渡。触控设备点按日期方块时也会显示高亮。

`tooltip` 回调返回的字符串会作为 HTML 插入，属于可信内容边界；如果内容来自用户输入，请先在宿主侧转义或清洗。

## 生命周期与 CSP

组件卸载或重新创建实例前，请调用 `chart.dispose()`，以清理 Tooltip、hover 标记和 SVG 过渡监听。创建图表时可传入 `nonce`；显式值优先于宿主页面已有资源的 nonce，并兼容 `globalThis.__CSP_NONCE__`。

## TypeScript 类型

日历热力图选项和实例类型由包入口直接导出：

```ts
import getCalendarChart, { type CalendarHeatmapOptions, type CalendarHeatmapInstance } from '@so-chart/calendar';
```

## 示例与说明

- 可运行示例：[`demo/examples`](./demo/examples)
- 配置与行为说明：[`demo/docs`](./demo/docs)
- 预览站和包独立 Demo 都从 [`demo/manifest.ts`](./demo/manifest.ts) 读取示例关系；宿主接入仍以本 README、包入口和导出类型为准。
