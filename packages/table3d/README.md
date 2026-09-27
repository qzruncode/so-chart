# @so-chart/table3d

基于 Three.js 的仿真 PBR 3D 桌面组件。默认使用带倒角的圆形桌面和中央柱式支撑，也支持圆角方桌与四条桌腿；通过物理材质、室内环境、方向光阴影和可选 GTAO 形成可交互的展示。

## 安装

```bash
pnpm add @so-chart/table3d three
```

## 基本用法

```ts
import getTable3DChart from '@so-chart/table3d';

const chart = getTable3DChart({
  container,
  chartType: 'table3d',
  layout: { height: 480 },
});

chart.setOption({
  table: {
    shape: 'round',
    support: 'pedestal',
    diameter: 3.6,
    height: 1.5,
    topThickness: 0.18,
    edgeRadius: 0.08,
    edgeSegments: 5,
    radialSegments: 72,
    supportSegments: 56,
    baseRadius: 0.76,
    baseHeight: 0.14,
    pedestalRadius: 0.28,
    pedestalHeight: 1.04,
    collarRadius: 0.42,
    collarHeight: 0.14,
  },
  material: { color: '#8b5a36', roughness: 0.44, clearcoat: 0.24 },
  environment: { show: true, intensity: 0.72 },
  lighting: { show: true, intensity: 3.5, shadowMapSize: 1024 },
  postprocessing: { show: true, ambientOcclusion: true },
});

// 容器尺寸改变时调用；宿主卸载时释放实例。
chart.resize();
chart.dispose();
```

`setOption` 是完整配置替换，所有尺寸使用世界单位。默认形状为 `round`，桌面直径 `2.6`、总高为 `1.05`；`edgeRadius`、`edgeSegments` 和 `radialSegments` 控制圆桌面的倒角与平滑度，`support` 控制中央柱式支撑或四条桌腿。传入 `shape: 'rectangular'` 后，`width`、`depth`、`cornerRadius` 和 `cornerSegments` 控制方桌；TypeScript 会把圆桌和方桌的专属字段区分开。`material` 使用 `MeshPhysicalMaterial`，`environment` 默认使用 Three.js `RoomEnvironment` 生成 PMREM，也可以传入宿主准备好的环境贴图，`lighting` 提供填充光、方向光和阴影，`postprocessing` 可开启 `GTAOPass`。

`material` 可以接收 Three.js `Texture` 的 `map`、`normalMap`、`roughnessMap` 和二维 `normalScale`；`tabletopMaterial` 可单独覆盖桌面材质并继承未指定的 `material` 字段。输入材质贴图会复制到桌体材质中，释放桌体不会释放调用方的原始贴图；调用方仍需自行释放原始贴图。颜色贴图应设为 `THREE.SRGBColorSpace`，法线和粗糙度贴图保持线性颜色空间。桌面木纹演示使用 [Poly Haven Wood Table 001](https://github.com/qzruncode/so-chart/blob/prod/packages/table3d/demo/assets/wood-table-001/ASSETS.md) 的 CC0 贴图。

如果需要自定义反射环境，可传入已经设置好映射方式的 `Texture` 或 `CubeTexture`。组件只使用它，不会复制或释放它；`background` 会把同一张贴图显示为背景，`rotation` 使用 XYZ 欧拉角，单位为弧度。

```ts
import * as THREE from 'three';

const environmentTexture = await new THREE.TextureLoader().loadAsync('/studio-environment.jpg');
environmentTexture.mapping = THREE.EquirectangularReflectionMapping;

chart.setOption({
  environment: {
    show: true,
    texture: environmentTexture,
    intensity: 0.85,
    background: true,
    rotation: [0, Math.PI * 0.25, 0],
  },
});

// chart.dispose() 不会释放 environmentTexture；由创建它的宿主管理。
environmentTexture.dispose();
```

`controls` 默认使用 `OrbitControls`，允许旋转和缩放，关闭平移；桌面端拖拽/滚轮与触摸端单指旋转/双指缩放均可用。`renderer.pixelRatio` 默认上限为 `1.5`，`renderer.shadows` 默认开启。

需要把桌子放进其他 Three.js 场景时，可从入口导入 `createTableObject(options)` 获得共享场景用的 `Group`，并用 `disposeObject3D(group)` 释放；此 API 不创建额外渲染器、相机或灯光。宿主可以把返回的桌体加入已有场景，并自行管理相机、灯光和其他物体。

这是静态 PBR 视觉近似，组件不求解木材纹理、受力、碰撞或刚体物理。需要物理仿真时，应由宿主接入物理引擎并驱动本组件或上层模型变换。

完整字段、默认值、边界约束、交互和释放说明见包内 [Handbook](demo/docs/Table3DChart.md) 与预览路由 `/chart/table3d`。预览示例会并排展示圆桌柱式支撑、圆桌四腿支撑和长方桌四腿支撑三种桌体配置；移动端会自动纵向排列。
