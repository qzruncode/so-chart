# @so-chart/utils

So Chart 的共享工具包，提供 CSP nonce 解析、Tooltip 定位、Canvas/动画缓存、事件通道、尺寸计算和通用绘制辅助函数。

## 安装

```bash
pnpm add @so-chart/utils
```

## Tooltip 定位

`getTooltipPosition` 根据命中点、Tooltip 尺寸和容器尺寸计算屏幕坐标：默认与命中点保持 12px 间距，靠近边缘时自动换向，在两侧都不足时选择空间更大的一侧，并将结果限制在容器内。

```ts
import { getTooltipPosition, TOOLTIP_GAP } from '@so-chart/utils';

const position = getTooltipPosition({
  x: 280,
  y: 120,
  width: 160,
  height: 80,
  containerWidth: 640,
  containerHeight: 320,
  gap: TOOLTIP_GAP,
});
```

`TOOLTIP_TRANSITION_DURATION` 可供自定义渲染器使用；共享 Tooltip 会自行处理按帧跟随和方向切换动画。

## CSP nonce

`resolveCspNonce(nonce?)` 用于统一解析宿主提供的 CSP nonce，优先级为显式参数、宿主页面已有 `script`/`style`/`link` 资源 nonce，最后兼容 `globalThis.__CSP_NONCE__`。工具包不会生成 nonce，也不会修改宿主 CSP 策略。

## 基础图表高频渲染

基础 Canvas 图表共享按帧合并的指针调度、动画 easing 缓存和 bitmap renderer 上下文缓存；折线图的 Voronoi 命中区域与静态路径也会在数据、坐标或尺寸未变化时复用。Tooltip 的 HTML、动态样式和拖拽/点击监听器只在内容或配置真正变化时更新。图表销毁时应释放帧调度、事件通道和 Canvas presenter 缓存。

## TypeScript 类型依赖

工具包对 `@so-chart/types` 的引用只存在于声明阶段，不会把共享类型包引入运行时 bundle。包发布由 Changesets 管理；公共发布由 GitHub Actions 使用 GitHub Secrets 或 npm Trusted Publishing 完成，包自身不内置 registry 地址。
