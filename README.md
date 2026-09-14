# so-chart

基于 D3、Canvas 和 SVG 的可组合图表组件集合，提供独立可安装的 TypeScript 包和在线 Demo。

[在线 Demo](https://qzruncode.github.io/so-chart/) · [贡献指南](./CONTRIBUTING.md) · [安全策略](./SECURITY.md)

## 特性

- 支持 Canvas 和 SVG 图表。
- 统一的 `setOption`、`resize` 和 `dispose` 生命周期。
- 每个图表包可以独立安装和发布。
- 提供公开的 TypeScript 类型。

## 安装

按需安装图表包，例如：

```bash
npm install @so-chart/line
```

## 用法

```tsx
import { useEffect, useRef } from 'react';
import getLineChart from '@so-chart/line';

export function LineChart() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const chart = getLineChart({
      container,
      chartType: 'line',
      layout: { height: 320 },
    });

    chart.setOption({
      xAxis: { type: 'value', data: [0, 1, 2] },
      yAxis: { type: 'value', data: { start: 0, end: 100 } },
      datasets: [{ label: 'Series', data: [20, 45, 80] }],
    });

    return () => chart.dispose();
  }, []);

  return <div ref={containerRef} style={{ height: 320 }} />;
}
```

组件卸载或重新创建图表前，请调用 `dispose()` 释放资源。

## 包列表

| 包                                                                       | 说明                     |
| ------------------------------------------------------------------------ | ------------------------ |
| [`@so-chart/bar`](https://www.npmjs.com/package/@so-chart/bar)           | 柱状图                   |
| [`@so-chart/calendar`](https://www.npmjs.com/package/@so-chart/calendar) | 日历图                   |
| [`@so-chart/guage`](https://www.npmjs.com/package/@so-chart/guage)       | 仪表图                   |
| [`@so-chart/line`](https://www.npmjs.com/package/@so-chart/line)         | 折线图                   |
| [`@so-chart/pie`](https://www.npmjs.com/package/@so-chart/pie)           | 饼图                     |
| [`@so-chart/point`](https://www.npmjs.com/package/@so-chart/point)       | 散点图                   |
| [`@so-chart/progress`](https://www.npmjs.com/package/@so-chart/progress) | 进度图和滑块             |
| [`@so-chart/radar`](https://www.npmjs.com/package/@so-chart/radar)       | 雷达图                   |
| [`@so-chart/sankey`](https://www.npmjs.com/package/@so-chart/sankey)     | 桑基图                   |
| [`@so-chart/tabs`](https://www.npmjs.com/package/@so-chart/tabs)         | 图表标签栏               |
| [`@so-chart/tooltip`](https://www.npmjs.com/package/@so-chart/tooltip)   | Tooltip 和 mark 绘制工具 |
| [`@so-chart/tree`](https://www.npmjs.com/package/@so-chart/tree)         | 树图和流程图             |
| [`@so-chart/types`](https://www.npmjs.com/package/@so-chart/types)       | 共享 TypeScript 类型     |
| [`@so-chart/utils`](https://www.npmjs.com/package/@so-chart/utils)       | 共享工具                 |

`@so-chart/guage` 的包名保留现有拼写。

## 在线 Demo

访问 [qzruncode.github.io/so-chart](https://qzruncode.github.io/so-chart/) 查看所有示例。

## 本地开发

环境要求：Node.js `>=22.22.2 <26`，pnpm 9。

```bash
pnpm install
pnpm dev
```

## 贡献

欢迎提交 Issue 和 Pull Request。请先阅读 [`CONTRIBUTING.md`](./CONTRIBUTING.md)。

## 许可证

本项目使用 [ISC License](./LICENSE)。
