# @so-chart/basket

基于 Three.js 的 PBR 藤编空篮图表，提供敞口浅藤篮和带盖收纳篮两种模型。包内提供篮子模型与场景资源；运行时不请求外部资源。

## 安装

```bash
pnpm add @so-chart/basket three
```

## 完整配置示例

```ts
import getBasketChart, { type BasketChartOptions } from '@so-chart/basket';

const chart = getBasketChart({
  container,
  chartType: 'basket',
  layout: { height: 520 }, // 图表初始高度，单位为 CSS 像素
});

const options: BasketChartOptions = {
  basket: {
    model: 'open-wicker', // open-wicker / lidded-wicker，默认 open-wicker
    position: [0, 0, 0], // 篮体世界坐标，默认 [0, 0, 0]
    scale: 1, // 篮体缩放倍率，范围 0.3..2.5
    rotationY: 0, // 绕 Y 轴旋转，单位为弧度
  },
  basketMaterial: {
    color: '#ffffff', // 乘到藤编原色上的颜色，白色保留原色
    roughness: 0.84, // 粗糙度，范围 0.05..1
    metalness: 0, // 金属度，范围 0..1
    clearcoat: 0.02, // 清漆强度，范围 0..1
    clearcoatRoughness: 0.7, // 清漆粗糙度，范围 0..1
    envMapIntensity: 0.8, // 环境反射强度，范围 0..5
  },
  floor: {
    show: true, // 是否创建接收阴影的地面
    color: '#ded7ce', // 地面颜色
    roughness: 0.86, // 粗糙度，范围 0.05..1
    metalness: 0, // 金属度，范围 0..1
  },
  environment: {
    show: true, // 是否使用随包摄影棚 HDRI 生成环境反射
    intensity: 0.8, // 环境反射强度，范围 0..5
  },
  lighting: {
    show: true, // 是否创建半球补光和方向主光
    color: '#fff3dc', // 灯光颜色
    intensity: 3, // 方向主光强度，范围 0..20
    fillIntensity: 2, // 半球补光强度，范围 0..10
    shadowMapSize: 1024, // 归一到 256/512/1024/2048 中最近的档位
    shadowBias: -0.0002, // 阴影深度偏移
    shadowNormalBias: 0.025, // 阴影法线偏移，范围 0..1
  },
  postprocessing: {
    show: true, // 是否启用后处理
    ambientOcclusion: true, // 是否启用 GTAO 环境遮蔽
    ambientOcclusionIntensity: 0.65, // 强度，范围 0..3
    ambientOcclusionRadius: 0.18, // 半径，范围 0.01..2
  },
  backgroundColor: '#e9e4dd', // 场景背景色；null 表示透明
  camera: {
    position: [2.5, 2.4, 3.1], // 透视相机位置
    target: [0, 0.24, 0], // 观察点，也是 OrbitControls 旋转中心
    fov: 35, // 视野角，单位为度，范围 20..100
    near: 0.01, // 近裁剪面，最小 0.001
    far: 100, // 远裁剪面，最小 10 且至少比 near 大 0.01
  },
  controls: {
    enabled: true, // 相机交互总开关
    damping: true, // 是否启用惯性阻尼
    autoRotate: false, // 是否自动环绕旋转
    autoRotateSpeed: 0.35, // 自动旋转速度，最小为 0
    enableRotate: true, // 是否允许拖拽旋转
    enableZoom: true, // 是否允许滚轮或双指缩放
    enablePan: false, // 是否允许平移
    minDistance: 2.1, // 最小相机距离，最小为 0.1
    maxDistance: 8, // 最大相机距离，至少为 2.1 且不小于 minDistance
    minPolarAngle: 0.18, // 垂直旋转下限，单位为弧度，范围 0..π
    maxPolarAngle: Math.PI * 0.86, // 垂直旋转上限，单位为弧度，范围 0..π
    rotateSpeed: 0.65, // 旋转速度，最小为 0
    zoomSpeed: 0.8, // 缩放速度，最小为 0
    panSpeed: 0.8, // 平移速度，最小为 0
  },
  renderer: {
    pixelRatio: 1.5, // 限制在 1..2 且不超过设备像素比
    shadows: true, // 是否启用实时阴影
    toneMappingExposure: 1.05, // ACES 曝光，范围 0.1..3
  },
  onError: error => console.error('篮子模型加载失败', error), // 当前篮子模型构建失败时调用
};

chart.setOption(options); // 完整替换当前配置
chart.resize(); // 容器尺寸变化后重新布局
chart.dispose(); // 卸载时释放渲染器、模型和监听器
```

## 参数说明

| 参数               | 作用与默认值                                                                                                                                                 |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `basket.model`     | `open-wicker` 敞口浅藤篮（默认）或 `lidded-wicker` 带盖收纳篮；无效值回退到默认篮型。                                                                        |
| `basket.position`  | 篮体世界坐标，默认 `[0, 0, 0]`。                                                                                                                             |
| `basket.scale`     | 篮体缩放，默认 `1`，限制在 `0.3..2.5`。                                                                                                                      |
| `basket.rotationY` | 绕 Y 轴旋转，默认 `0`，单位为弧度。                                                                                                                          |
| `basketMaterial`   | 藤编材质。颜色默认 `#ffffff`；粗糙度 `0.84`（`0.05..1`）；金属度 `0`、清漆强度 `0.02`、清漆粗糙度 `0.7`（后三者均为 `0..1`）；环境反射强度 `0.8`（`0..5`）。 |
| `floor`            | 默认显示 30 × 30 个世界单位的接地平面并接收阴影。粗糙度默认 `0.86`（`0.05..1`），金属度默认 `0`（`0..1`）。                                                  |
| `environment`      | 默认启用随包提供的 Studio Small 08 HDRI，由 Three.js `HDRLoader` 读取，加载失败时回退到 `RoomEnvironment`；强度默认 `0.8`，范围 `0..5`。                     |
| `lighting`         | 默认启用半球补光和方向主光，强度分别为 `2`（`0..10`）和 `3`（`0..20`）。阴影贴图尺寸归一到 `256/512/1024/2048`。                                             |
| `postprocessing`   | 默认启用 GTAO；强度范围 `0..3`，半径范围 `0.01..2`。                                                                                                         |
| `backgroundColor`  | 背景色，默认 `#e9e4dd`；传入 `null` 使用透明背景。                                                                                                           |
| `camera`           | 默认位置 `[2.5, 2.4, 3.1]`、观察点 `[0, 0.24, 0]`、视野角 `35°`。`near` 最小 `0.001`，`far` 最小 `10` 且始终比 `near` 大至少 `0.01`。                        |
| `controls`         | 对应 Three.js `OrbitControls`。距离使用世界坐标，极角使用弧度并限制在 `0..π`；最大角不会小于最小角，最大距离不会小于最小距离。                               |
| `renderer`         | 像素倍率默认 `1.5`，限制在 `1..2` 且不超过设备像素比；曝光默认 `1.05`，范围 `0.1..3`。                                                                       |
| `onError`          | 当前仍有效的篮子模型加载或解析失败时调用一次；图表销毁或配置被替换后，不通知已失效的构建。省略时错误输出到控制台。                                           |

数值越界时限制到有效范围，非有限值回退到默认值。无效的三维坐标元组整体回退到对应默认值。桌面端可拖拽旋转并滚轮缩放；触摸端支持单指旋转和双指缩放。

## 组合到宿主 Three.js 场景

`createBasketObject(options)` 只创建篮子模型和可选地面，不创建渲染器、相机、灯光或环境。加载失败时 Promise reject，由宿主捕获。卸载时先从场景移除对象，再调用 `disposeObject3D(group)`。

```ts
import { createBasketObject, disposeObject3D } from '@so-chart/basket';

const basket = await createBasketObject({
  basket: { model: 'open-wicker', position: [-0.65, 1.05, 0], scale: 0.77 },
  floor: { show: false }, // 地面由宿主统一提供
});
hostChart.scene.add(basket);

hostChart.scene.remove(basket);
disposeObject3D(basket);
```

包内 [Handbook](demo/docs/BasketChart.md) 和可运行的 [BasketChart.tsx](demo/examples/BasketChart.tsx) 平铺展示两种空篮，路由为 `/chart/basket`。资源作者、来源、许可和优化方式见 [ASSETS.md](ASSETS.md)。
