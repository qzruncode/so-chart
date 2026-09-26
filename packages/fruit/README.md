# @so-chart/fruit

独立的 Three.js 3D 水果图表，直接展示苹果、香蕉、梨子、牛油果、猕猴桃、柠檬、青柠、石榴和荔枝模型，不依赖果篮或容器。水果可以重复添加、单独定位、旋转和缩放；省略位置时会自动排布，支持继续通过模型目录扩展更多水果。模型以 CC0 授权随包提供，运行时不请求外部资源。

## 安装

```bash
pnpm add @so-chart/fruit three
```

## 使用

```ts
import getFruitChart from '@so-chart/fruit';

const chart = getFruitChart({
  container,
  chartType: 'fruit',
  layout: { height: 520 },
});

const unsubscribe = chart.on('click', ({ fruitId, fruitType }) => {
  console.log(`Selected ${fruitType}: ${fruitId}`);
});

chart.setOption({
  fruits: [
    { id: 'apple-main', type: 'apple', position: [-0.9, 0, 0], scale: 1.1 },
    { type: 'banana' },
    { type: 'pear', position: [0.9, 0, 0] },
    { type: 'avocado', position: [1.8, 0, 0] },
  ],
  controls: { enabled: true, damping: true, enableRotate: true, enableZoom: true },
  onError: error => console.error('Fruit model failed to load', error),
});

chart.resize();
unsubscribe();
chart.dispose();
```

`fruits` 支持 `apple`、`banana`、`pear`、`avocado`、`kiwi`、`lemon`、`lime`、`pomegranate`、`lychee`；省略该字段时默认仍显示苹果、香蕉、梨子各一个，传 `fruits: []` 可隐藏水果。水果可用 `id` 标识；点击和悬停事件通过 `chart.on()` 订阅，返回的函数用于取消订阅。`camera.autoFit` 可让视角随水果范围和容器宽高比自动适配。位置和旋转均使用三维坐标，旋转单位为弧度；水果大小倍率范围是 `0.25..2.5`。`setOption` 会用本次选项替换当前配置，省略字段恢复默认值。完整默认值、单位和边界处理见包内 [Handbook](demo/docs/FruitChart.md)，可运行示例为 [FruitChart.tsx](demo/examples/FruitChart.tsx)。仓库内可用 `pnpm --filter @so-chart/fruit dev` 启动包独立示例；预览站路由为 `/chart/fruit`。

扩展新的内置水果时，在 `src/types.ts` 的 `FRUIT_TYPES` 添加类型，在 `src/scene.ts` 的 `FRUIT_MODEL_ASSETS` 注册本地模型，并在 `src/normal.ts` 补充默认朝向；同步包内示例、Handbook 和资产来源表。模型作者、来源和许可证见 [ASSETS.md](ASSETS.md)。
