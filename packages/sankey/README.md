# @so-chart/sankey

基于 SVG 的数据流图组件，以 Sankey 布局展示节点与链接之间的流量关系。

## 安装

```bash
pnpm add @so-chart/sankey
```

## 最小用法

下面示例假设 `container` 是承载图表的 `HTMLElement`：

```ts
import getSankeyChart, { type DataflowOptions } from '@so-chart/sankey';

const chart = getSankeyChart({
  container,
  chartType: 'dataflow',
  layout: { height: 320 },
});

const options: DataflowOptions = {
  datasets: {
    nodes: [{ name: 'Input' }, { name: 'Output' }],
    links: [{ source: 0, target: 1, value: 100 }],
  },
};

chart.setOption(options);
```

`style` 可以配置节点宽度、间距、字体和链接 hover 的颜色、透明度、最小宽度及命中宽度。图表实例提供统一的 `dispose()` 生命周期；组件卸载或重新创建图表前请调用它，以停止链接 hover 监听和 SVG 过渡。

## CSP nonce 与类型

创建图表时可以传入 `nonce`。图表包不会生成 nonce，解析优先级为显式 `nonce`、宿主页面已有资源 nonce，最后兼容 `globalThis.__CSP_NONCE__`。

数据流图选项和实例类型由包入口直接导出：

```ts
import getSankeyChart, { type DataflowOptions, type DataflowInstance } from '@so-chart/sankey';
```

## 示例与说明

- 可运行示例：[`demo/examples`](./demo/examples)
- 配置与行为说明：[`demo/docs`](./demo/docs)
- 预览站和包独立 Demo 都从 [`demo/manifest.ts`](./demo/manifest.ts) 读取示例关系；宿主接入仍以本 README、包入口和导出类型为准。
