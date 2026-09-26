# 仿真 3D 桌子

这个示例使用 Three.js 的 `ExtrudeGeometry` 生成带倒角的圆形桌面，用 `CylinderGeometry` 组合中央支柱、底座和连接环，再通过 `MeshPhysicalMaterial`、`RoomEnvironment`、方向光阴影和 `GTAOPass` 模拟木桌在室内环境中的外观。桌子尺寸使用世界坐标表达，示例按米级比例设置，但组件不会把数值强制解释成真实米制。组件也支持宿主传入自己的环境贴图，默认的 `RoomEnvironment` 只作为开箱即用的回退方案。

## 完整配置示例

下面的示例覆盖圆桌、材质、地面、环境、灯光、后处理、相机、控制器和渲染器配置。每个配置属性都在行尾说明，方便复制后按需删改。`shape: 'round'` 和 `shape: 'rectangular'` 是互斥的几何配置，方桌写法见示例后的切换片段。

```ts
import getTable3DChart, { type Table3DOptions } from '@so-chart/table3d';

const chart = getTable3DChart({
  container,
  chartType: 'table3d',
  layout: { height: 480 }, // 画布高度，宽度跟随容器
});

const options: Table3DOptions = {
  table: {
    shape: 'round', // round 或 rectangular
    support: 'pedestal', // 圆桌可用 pedestal 或 legs
    diameter: 3.6, // 圆桌面直径，世界单位
    height: 1.5, // 桌面离地总高度，世界单位
    topThickness: 0.18, // 桌面板厚度
    edgeRadius: 0.08, // 圆桌面倒角半径
    edgeSegments: 5, // 倒角分段数，越高越平滑
    radialSegments: 72, // 圆桌面圆周分段数
    supportSegments: 56, // 圆柱支撑分段数
    baseRadius: 0.76, // 柱式底座半径
    baseHeight: 0.14, // 柱式底座高度
    pedestalRadius: 0.28, // 中央支柱半径
    pedestalHeight: 1.04, // 中央支柱高度
    collarRadius: 0.42, // 桌面下连接环半径
    collarHeight: 0.14, // 连接环高度
  },
  material: {
    color: '#8b5a36', // 桌腿、围板和未覆盖桌面材质的颜色
    roughness: 0.44, // 粗糙度，范围 0..1
    metalness: 0, // 金属度，范围 0..1
    clearcoat: 0.24, // 清漆层强度，范围 0..1
    clearcoatRoughness: 0.28, // 清漆层粗糙度，范围 0..1
    envMapIntensity: 0.9, // 环境反射强度
  },
  tabletopMaterial: {
    color: '#ffffff', // 桌面专用颜色
    roughness: 0.94, // 桌面粗糙度
    clearcoat: 0.04, // 桌面清漆层强度
    clearcoatRoughness: 0.82, // 桌面清漆层粗糙度
    envMapIntensity: 0.35, // 桌面环境反射强度
    // map: diffuseTexture, // 可选：颜色贴图
    // normalMap: normalTexture, // 可选：法线贴图
    // roughnessMap: roughnessTexture, // 可选：粗糙度贴图
    // normalScale: [0.3, 0.3], // 法线强度的 X/Y 倍率
  },
  floor: {
    show: true, // 是否显示接收阴影的地面
    color: '#27231f', // 地面颜色
    roughness: 0.74, // 地面粗糙度
    metalness: 0, // 地面金属度
  },
  environment: {
    show: true, // 是否使用环境光
    intensity: 0.72, // 环境光强度
    // texture: environmentTexture, // 可选：宿主准备好的 Texture
    background: false, // 是否把传入的环境贴图显示为背景
    rotation: [0, Math.PI * 0.18, 0], // 环境贴图 XYZ 旋转，单位是弧度
  },
  lighting: {
    show: true, // 是否创建示例灯光
    color: '#fff3dc', // 方向光和填充光颜色
    intensity: 3.5, // 主方向光强度
    fillIntensity: 1.3, // 半球填充光强度
    shadowMapSize: 1024, // 阴影贴图尺寸，会归一到 256/512/1024/2048
    shadowBias: -0.0002, // 阴影深度偏移
    shadowNormalBias: 0.025, // 阴影法线偏移
  },
  postprocessing: {
    show: true, // 是否启用后处理
    ambientOcclusion: true, // 是否启用 GTAO 环境光遮蔽
    ambientOcclusionIntensity: 1.15, // 接触阴影强度
    ambientOcclusionRadius: 0.3, // 环境光遮蔽半径，世界单位
  },
  backgroundColor: '#171513', // 场景背景色；null 表示透明背景
  camera: {
    position: [5.8, 4.2, 6.4], // 相机初始位置
    target: [0, 0.7, 0], // 相机旋转中心
    fov: 38, // 透视视野角，单位是度
    near: 0.01, // 近裁剪面
    far: 100, // 远裁剪面
  },
  controls: {
    enabled: true, // 相机交互总开关
    damping: true, // 是否开启相机惯性
    autoRotate: false, // 是否自动旋转
    autoRotateSpeed: 0.35, // 自动旋转速度
    enableRotate: true, // 是否允许旋转
    enableZoom: true, // 是否允许缩放
    enablePan: false, // 是否允许平移
    minDistance: 3.2, // 相机最小距离
    maxDistance: 12, // 相机最大距离
    minPolarAngle: 0.2, // 垂直旋转下限，单位是弧度
    maxPolarAngle: Math.PI * 0.84, // 垂直旋转上限，单位是弧度
    rotateSpeed: 0.62, // 旋转速度
    zoomSpeed: 0.8, // 缩放速度
    panSpeed: 0.8, // 平移速度
  },
  renderer: {
    pixelRatio: 1.5, // 1 更省 GPU，2 更适合高分屏
    shadows: true, // 是否启用阴影渲染
    toneMappingExposure: 1.05, // 色调映射曝光度
  },
};

chart.setOption(options); // setOption 是完整配置替换
chart.resize(); // 容器尺寸改变时调用
chart.dispose(); // 组件卸载时释放全部 Three.js 资源
```

方桌使用圆角方形桌面、四条桌腿和四块围板；TypeScript 会禁止传入圆桌专属字段：

```ts
chart.setOption({
  table: {
    shape: 'rectangular', // 方桌必须显式声明形状
    support: 'legs', // 方桌只支持四条桌腿
    width: 4.4, // X 方向尺寸，世界单位
    depth: 2.4, // Z 方向尺寸，世界单位
    height: 1.35, // 桌面离地总高度
    topThickness: 0.18, // 桌面板厚度
    cornerRadius: 0.1, // 桌面圆角半径
    cornerSegments: 7, // 桌面圆角分段数
    legWidth: 0.22, // 桌腿边长
    legInset: 0.24, // 桌腿从边缘向内的距离
    apronHeight: 0.22, // 桌面下围板高度
    apronInset: 0.14, // 围板从边缘向内的距离
  },
});
```

## 参数说明

- `table.shape` 支持 `round` 和 `rectangular`，默认是 `round`。圆桌使用圆形轮廓和倒角桌面；方桌使用圆角方桌面、四条桌腿和四块围板。
- `table.support` 控制支撑结构。圆桌默认使用 `pedestal`，生成底座、中央支柱和连接环，也可以使用 `legs`；方桌固定使用 `legs`。
- `table.diameter` 是圆桌直径，默认 `2.6`，范围 `0.5..20`；`table.width` 和 `table.depth` 是方桌尺寸，默认分别为 `2.2` 和 `1.2`，范围 `0.3..20`。
- `table.height` 是桌面离地总高度，默认 `1.05`，范围 `0.3..8`；`topThickness` 默认 `0.12`，不能超过桌高的 `40%`。
- 圆桌的 `edgeRadius` 默认 `0.055`，会按桌面厚度和直径限制；`edgeSegments` 默认 `4`，范围 `1..8`；`radialSegments` 默认 `64`，范围 `16..128`。分段数越高，轮廓越平滑，也越耗几何体顶点。
- 圆柱支撑的 `supportSegments` 默认 `48`，范围 `12..96`；`baseRadius`、`baseHeight`、`pedestalRadius`、`pedestalHeight`、`collarRadius` 和 `collarHeight` 控制柱式底座、支柱和连接环的尺寸，省略时会按桌面尺寸自动计算。
- 方桌的 `legWidth` 默认 `0.16`，`legInset` 默认 `0.16`；`apronHeight` 默认 `0.18`，`apronInset` 默认 `0.1`；`cornerRadius` 默认 `0.06`，`cornerSegments` 默认 `5`，范围 `1..12`。这些值会按桌面短边、桌高和桌面厚度自动限制。
- `material` 使用 Three.js `MeshPhysicalMaterial`，默认颜色为 `#8b5a36`，`roughness` 为 `0.48`，`metalness` 为 `0`，`clearcoat` 为 `0.18`，`clearcoatRoughness` 为 `0.32`，`envMapIntensity` 为 `0.85`；数值会限制在各自的有效范围内。
- `tabletopMaterial` 只覆盖桌面材质。没有指定的字段从 `material` 继承；贴图字段传 `null` 可以清除继承值。`map` 是颜色贴图，使用 `THREE.SRGBColorSpace`；`normalMap` 和 `roughnessMap` 保持线性颜色空间；`normalScale` 默认是 `[1, 1]`。
- 创建桌体时，组件会复制材质贴图供内部材质使用；图表或 `disposeObject3D` 只释放内部副本，调用方传入的原始贴图仍由调用方管理。
- `floor.show` 默认开启，地面只接收阴影，不参与桌体尺寸计算。`floor.color` 默认 `#27231f`，`roughness` 默认 `0.7`，`metalness` 默认 `0`。
- `environment.show` 默认开启，`intensity` 默认 `0.7`。没有传入 `environment.texture` 时，组件使用 Three.js `RoomEnvironment` 生成 PMREM 环境；传入宿主准备好的 `Texture` 后直接使用，不会复制或释放它。
- `environment.background` 只有在传入环境贴图时才会把贴图显示为背景；`rotation` 是 XYZ 欧拉角，单位为弧度，默认 `[0, 0, 0]`。
- `lighting.show` 默认开启；`intensity` 默认 `3.2`，`fillIntensity` 默认 `1.4`，`color` 默认 `#fff3dc`。`shadowMapSize` 默认 `1024`，可用值会归一到 `256`、`512`、`1024` 或 `2048`；`shadowBias` 和 `shadowNormalBias` 用于降低阴影 acne 与 Peter Panning。
- `postprocessing.show` 和 `ambientOcclusion` 默认开启；`ambientOcclusionIntensity` 默认 `1.1`，`ambientOcclusionRadius` 默认 `0.28`。低性能设备可以关闭后处理或 GTAO，以减少 GPU 开销。
- `backgroundColor` 默认是 `#171513`；传入 `null` 可以保留透明背景，适合嵌入已有 Three.js 场景或页面背景。
- `camera.position` 和 `camera.target` 是三元素世界坐标；`fov` 默认 `38`，单位是度；`near` 默认 `0.01`，`far` 会至少保持为场景最大尺寸的四倍。
- `controls` 使用 Three.js `OrbitControls`。默认开启阻尼、旋转和缩放，关闭平移；`minDistance`、`maxDistance` 限制距离，`minPolarAngle`、`maxPolarAngle` 限制垂直旋转角度，角度值使用弧度。
- `controls.damping` 或 `autoRotate` 开启时会保留渲染循环；两者都关闭时，组件只在配置、尺寸或控制器变化后渲染。
- `renderer.pixelRatio` 默认上限为 `1.5`，会取设备像素比和配置上限中的较小值，并限制在 `1..2`；`renderer.shadows` 默认开启；`toneMappingExposure` 默认 `1`，范围 `0.1..3`。

## 材质贴图与环境贴图

```ts
import * as THREE from 'three';

const diffuseTexture = await new THREE.TextureLoader().loadAsync('/wood-diffuse.jpg');
const normalTexture = await new THREE.TextureLoader().loadAsync('/wood-normal.jpg');
const roughnessTexture = await new THREE.TextureLoader().loadAsync('/wood-roughness.jpg');
const environmentTexture = await new THREE.TextureLoader().loadAsync('/studio-environment.jpg');

diffuseTexture.colorSpace = THREE.SRGBColorSpace;
environmentTexture.mapping = THREE.EquirectangularReflectionMapping;

chart.setOption({
  material: {
    color: '#8b5a36',
    roughness: 0.48,
  },
  tabletopMaterial: {
    color: '#ffffff',
    map: diffuseTexture,
    normalMap: normalTexture,
    roughnessMap: roughnessTexture,
    normalScale: [0.3, 0.3],
    roughness: 0.86,
  },
  environment: {
    show: true,
    texture: environmentTexture,
    intensity: 0.85,
    background: true,
    rotation: [0, Math.PI * 0.25, 0],
  },
});

// chart.dispose() 不会释放上面四张由宿主创建的贴图。
diffuseTexture.dispose();
normalTexture.dispose();
roughnessTexture.dispose();
environmentTexture.dispose();
```

颜色贴图、法线贴图和粗糙度贴图会分别影响木纹颜色、表面凹凸和高光宽度；只需要颜色时可以省略后两张。环境贴图只由组件引用，生命周期必须由创建它的宿主管理。

## 组合多个桌体

除独立图表外，包还导出 `createTableObject(options)`，返回可加入其他 Three.js 场景的桌体 `Group`；它不创建画布、相机或灯光。共享场景通常关闭 `floor.show`，避免多个地面重叠。

```ts
import { createTableObject, disposeObject3D } from '@so-chart/table3d';

const roundTable = createTableObject({
  table: { shape: 'round', support: 'pedestal', diameter: 3.3, height: 1.2 },
  floor: { show: false },
});
const rectangularTable = createTableObject({
  table: { shape: 'rectangular', width: 3.8, depth: 2.1, height: 1.1 },
  floor: { show: false },
});

hostScene.add(roundTable, rectangularTable);
// 卸载时先移除桌体，再分别释放几何、材质和内部贴图。
hostScene.remove(roundTable, rectangularTable);
disposeObject3D(roundTable);
disposeObject3D(rectangularTable);
```

`/chart/table3d` 示例会展示三张独立的桌子卡片：圆形桌面配中央柱式支撑、圆形桌面配四条桌腿，以及圆角长方桌面配四条桌腿。每张卡片拥有自己的图表实例和 `OrbitControls`，木材贴图在示例中只加载一次；桌面宽度不足时，卡片会自动从网格变为纵向排列。

## 相机、交互与生命周期

桌面端使用拖拽旋转和滚轮缩放，触摸端使用单指旋转和双指缩放。`resize()` 会同步 CSS 尺寸和 WebGL 绘制缓冲区；容器尺寸改变时应调用它，或使用宿主的尺寸观察器触发调用。

`dispose()` 会停止渲染循环，清理 `ResizeObserver`、窗口监听、`OrbitControls`、环境 PMREM、后处理 Pass 和渲染目标，并释放桌体几何体、材质、内部贴图和 WebGL renderer。重复调用安全。通过 `material`、`tabletopMaterial` 或 `environment.texture` 传入的原始贴图始终由宿主管理。

组件提供的是可复用的静态桌体近似，不包含木材纹理扫描、榫卯结构、布料碰撞或刚体物理求解；如果需要受力、碰撞或倒塌仿真，应在上层接入物理引擎并驱动模型变换。
