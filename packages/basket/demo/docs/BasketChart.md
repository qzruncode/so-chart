# Three.js 藤编空篮演示

`/chart/basket` 平铺展示两种独立的空篮模型。包内公开的模型、类型和场景组合 API 只负责篮子，不包含其他物品。示例使用相同相机和布光，每个篮子有独立的 Three.js 图表实例，可单独拖拽旋转和缩放。

- **敞口浅藤篮**（`open-wicker`）：低矮、开口宽的矩形编织篮。
- **带盖收纳篮**（`lidded-wicker`）：带独立篮盖和矮脚的收纳篮。

两种篮子均来自包内的 CC0 模型，不使用程序化篮体几何，也不请求外部资源。卡片卸载时会释放各自的图表实例。资源来源、作者与贴图优化方式见包内 `ASSETS.md`。

## 调用方式

```ts
import getBasketChart, { type BasketChartOptions } from '@so-chart/basket';

const chart = getBasketChart({
  container,
  chartType: 'basket',
  layout: { height: 380 },
});

const options: BasketChartOptions = {
  basket: { model: 'open-wicker', position: [0, 0, 0], scale: 1, rotationY: 0 },
  basketMaterial: {
    color: '#ffffff',
    roughness: 0.84,
    metalness: 0,
    clearcoat: 0.02,
    clearcoatRoughness: 0.7,
    envMapIntensity: 0.8,
  },
  floor: { show: true, color: '#ded7ce', roughness: 0.86, metalness: 0 },
  environment: { show: true, intensity: 0.8 },
  lighting: {
    show: true,
    color: '#fff3dc',
    intensity: 3,
    fillIntensity: 2,
    shadowMapSize: 1024,
    shadowBias: -0.0002,
    shadowNormalBias: 0.025,
  },
  postprocessing: {
    show: true,
    ambientOcclusion: true,
    ambientOcclusionIntensity: 0.65,
    ambientOcclusionRadius: 0.18,
  },
  backgroundColor: '#e9e4dd',
  camera: { position: [2.5, 2.4, 3.1], target: [0, 0.24, 0], fov: 35, near: 0.01, far: 100 },
  controls: {
    enabled: true,
    damping: true,
    autoRotate: false,
    autoRotateSpeed: 0.35,
    enableRotate: true,
    enableZoom: true,
    enablePan: false,
    minDistance: 2.1,
    maxDistance: 8,
    minPolarAngle: 0.18,
    maxPolarAngle: Math.PI * 0.86,
    rotateSpeed: 0.65,
    zoomSpeed: 0.8,
    panSpeed: 0.8,
  },
  renderer: { pixelRatio: 1.5, shadows: true, toneMappingExposure: 1.05 },
  onError: error => console.error('篮子模型加载失败', error),
};

chart.setOption(options);
chart.resize();
chart.dispose();
```

## 参数说明

| 配置              | 字段                               | 默认值与边界                                                                                                                  |
| ----------------- | ---------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `basket`          | `model`                            | `open-wicker` 或 `lidded-wicker`；默认 `open-wicker`，无效值回退到默认篮型。                                                  |
|                   | `position`                         | `[0, 0, 0]`，篮体世界坐标。                                                                                                   |
|                   | `scale`                            | `1`，限制在 `0.3..2.5`。                                                                                                      |
|                   | `rotationY`                        | `0`，绕 Y 轴旋转，单位为弧度。                                                                                                |
| `basketMaterial`  | `color`                            | `#ffffff`，与藤编原色相乘，白色保留原色。                                                                                     |
|                   | `roughness` / `metalness`          | 分别为 `0.84`（`0.05..1`）与 `0`（`0..1`）。                                                                                  |
|                   | `clearcoat` / `clearcoatRoughness` | 分别为 `0.02` 与 `0.7`，范围均为 `0..1`。                                                                                     |
|                   | `envMapIntensity`                  | `0.8`，范围 `0..5`。                                                                                                          |
| `floor`           | `show` / `color`                   | 显示接地平面，默认颜色 `#ded7ce`。                                                                                            |
|                   | `roughness` / `metalness`          | 分别为 `0.86`（`0.05..1`）和 `0`（`0..1`）。                                                                                  |
| `environment`     | `show` / `intensity`               | 默认使用随包 HDRI，由 Three.js `HDRLoader` 读取，失败时回退 `RoomEnvironment`；反射强度 `0.8`，范围 `0..5`。                  |
| `lighting`        | 灯光                               | 默认启用半球光和方向光，强度为 `2` 与 `3`。                                                                                   |
|                   | 阴影                               | 尺寸归一到 `256/512/1024/2048`，偏移默认 `-0.0002` 与 `0.025`。                                                               |
| `postprocessing`  | GTAO                               | 默认启用；强度 `0.65`（`0..3`），半径 `0.18`（`0.01..2`）。                                                                   |
| `backgroundColor` | 场景背景                           | `#e9e4dd`；传入 `null` 表示透明背景。                                                                                         |
| `camera`          | 视角                               | 位置 `[2.5, 2.4, 3.1]`，观察点 `[0, 0.24, 0]`，视野角 `35°`；`near` 最小 `0.001`，`far` 最小 `10` 且至少比 `near` 大 `0.01`。 |
| `controls`        | 交互                               | 使用 Three.js `OrbitControls`；距离单位为世界坐标，极角单位为弧度。最大角、最大距离会归一为不小于对应最小值。                 |
| `renderer`        | 分辨率与曝光                       | 像素倍率 `1.5`，限制在 `1..2` 且不超过设备像素比；曝光 `1.05`，范围 `0.1..3`。                                                |
| `onError`         | 模型错误                           | 当前仍有效的模型加载或解析失败时调用一次；省略时错误输出到控制台。                                                            |

超出范围的数值会限制到有效范围，非有限值回退到默认值。三维坐标元组无效时整体回退到默认值。桌面端支持拖拽旋转和滚轮缩放；触摸端支持单指旋转和双指缩放。

## 场景组合与生命周期

宿主场景可通过 `createBasketObject(options)` 获取 Three.js `Group`。该异步 API 只创建篮子和可选地面，不创建 renderer、相机、灯光或环境。模型加载失败会使 Promise reject，由宿主捕获；移除对象后调用 `disposeObject3D(group)` 释放包内资源。

```ts
import { createBasketObject, disposeObject3D } from '@so-chart/basket';

const basket = await createBasketObject({
  basket: { model: 'lidded-wicker', position: [-0.65, 1.05, 0], scale: 0.77 },
  floor: { show: false },
});
hostChart.scene.add(basket);

hostChart.scene.remove(basket);
disposeObject3D(basket);
```
