# @so-chart/guage

仪表盘组件包，提供多段仪表盘、单值仪表盘和环形仪表盘。包名中的 `guage` 拼写与现有 npm 入口保持一致。

## 安装

```bash
pnpm add @so-chart/guage
```

## 最小用法

下面示例假设 `container` 是承载图表的 `HTMLElement`：

```ts
import getGuageChart, { type SingleGuageOptions } from '@so-chart/guage';

const chart = getGuageChart({
  container,
  chartType: 'single',
  layout: { height: 240 },
});

const options: SingleGuageOptions = {
  value: 72,
  tooltip: () => '当前值：72',
};

chart.setOption(options);
```

`chartType` 支持 `guage`、`single` 和 `circle`；多段仪表盘使用 `GuageOptions`，环形仪表盘使用 `CircleGuageOptions`。组件卸载或重新创建图表前，请调用 `chart.dispose()`，以释放动画帧、ResizeObserver 和事件监听器。

## Tooltip 与安全边界

仪表盘 Tooltip 与鼠标保持 12px 屏幕间距，靠近容器边缘时自动换向，并按浏览器帧率合并位置更新。`tooltip` 回调返回的内容属于可信 HTML，传入用户输入前请先转义或清洗。

## CSP nonce

创建图表时可以传入 `nonce`。图表包不会生成 nonce，解析优先级为显式 `nonce`、宿主页面已有资源 nonce，最后兼容 `globalThis.__CSP_NONCE__`。

## TypeScript 类型

仪表盘选项和实例类型由包入口直接导出：

```ts
import getGuageChart, { type GuageOptions, type SingleGuageOptions, type GuageInstance } from '@so-chart/guage';
```

## 示例与说明

- 可运行示例：[`demo/examples`](./demo/examples)
- 配置与行为说明：[`demo/docs`](./demo/docs)
- 预览站和包独立 Demo 都从 [`demo/manifest.ts`](./demo/manifest.ts) 读取示例关系；宿主接入仍以本 README、包入口和导出类型为准。
