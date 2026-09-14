# @so-chart/tooltip

So Chart 的共享 Tooltip、交叉线和 mark 绘制能力。它是面向图表包的低层渲染包，不是独立的 React Tooltip 组件；直接调用时需要提供 SVG 图表实例和命中数据契约。

## 安装

```bash
pnpm add @so-chart/tooltip
```

## 导出能力

```ts
import { drawCross, drawMark, drawTooltip, hoverMark } from '@so-chart/tooltip';
```

- `drawTooltip`：绘制普通 hover Tooltip、固定 Tooltip 和可拖拽 Tooltip。
- `drawCross`：绘制折线图/散点图的交叉线、提示文字和命中点。
- `drawMark`、`hoverMark`：绘制与管理 mark 线、mark 点及其扩展提示。

图表包已经封装了这些函数的事件、坐标和生命周期，业务代码通常只需要使用对应的图表入口包。

## Tooltip 行为

共享 Tooltip 支持 line、bar、pie、point、radar、trend 和 circle-stack bar。普通 hover Tooltip 与命中点保持 12px 屏幕间距，靠近边缘时自动选择更合适的一侧；高频指针更新按浏览器帧合并，垂直方向切换使用 120ms 缓动并尊重 `prefers-reduced-motion`。

固定 Tooltip 可通过图表选项启用拖拽：

```ts
tooltip: {
  show: true,
  fixed: true,
  drag: true,
}
```

## 安全边界与 CSP

共享渲染器会转义数据集标签、格式化值、扩展文本和坐标标题，再插入生成的 HTML。日历、仪表盘和树图等自定义 HTML 回调仍属于可信 HTML；宿主传入用户内容前必须自行转义或清洗。

Tooltip 会复用图表实例上的 `nonce`。包自身不会生成 nonce，也不会修改宿主 CSP 策略。

## TypeScript 类型

Tooltip 包对 `@so-chart/types` 使用 type-only 依赖，运行时只保留绘制 Tooltip 所需的工具和 D3 依赖。
