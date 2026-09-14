# @so-chart/progress

SVG 进度组件包，提供线性滑块（`slider`）和环形进度图（`progress`）。

## 安装

```bash
pnpm add @so-chart/progress
```

## 最小用法

下面示例假设 `container` 是承载图表的 `HTMLElement`：

```ts
import getProgressChart, { type ProgressOptions } from '@so-chart/progress';

const chart = getProgressChart({
  container,
  chartType: 'progress',
  layout: { height: 160 },
});

const options: ProgressOptions = {
  data: { start: 0, value: 60, end: 100 },
};

chart.setOption(options);
```

需要线性滑块时，将 `chartType` 改为 `slider` 并使用 `SliderOptions`，可以进一步配置 `slider`、圆角和线性渐变。组件卸载或重新创建图表前，请调用 `chart.dispose()`，以释放动画帧、ResizeObserver 和事件监听器。

## CSP nonce 与类型

创建图表时可以传入 `nonce`。图表包不会生成 nonce，解析优先级为显式 `nonce`、宿主页面已有资源 nonce，最后兼容 `globalThis.__CSP_NONCE__`。

进度图选项和实例类型由包入口直接导出：

```ts
import getProgressChart, { type ProgressOptions, type SliderOptions, type ProgressInstance } from '@so-chart/progress';
```

## 示例与说明

- 可运行示例：[`demo/examples`](./demo/examples)
- 配置与行为说明：[`demo/docs`](./demo/docs)
- 预览站和包独立 Demo 都从 [`demo/manifest.ts`](./demo/manifest.ts) 读取示例关系；宿主接入仍以本 README、包入口和导出类型为准。
