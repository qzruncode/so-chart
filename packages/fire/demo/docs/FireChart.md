# 蜡烛火焰

`@so-chart/fire` 使用 Three.js 绘制单根蜡烛：火苗带有平滑尖端、暗色内焰和蓝色根部，灯芯略微弯曲，蜡体包含凹陷蜡池。`fire.airflowAmplitude` 控制连续气流对火苗与烛光位置的影响。

## 页面示例

`/chart/fire` 平铺两个示例：基础版单根蜡烛只创建 Fire 图表；高阶版把桌子、果篮和水果模型加入 Fire 的共享场景。高阶示例复用其他包的模型和贴图，Fruit、Basket、Table3D 不是 Fire 运行时的组成部分。两个图表分别创建画布，并在卸载时各自释放。

## 完整配置示例

```ts
import getFireChart from '@so-chart/fire';

const chart = getFireChart({
  container,
  chartType: 'fire',
  layout: { height: 460 }, // 图表容器高度
});

chart.setOption({
  quality: 'medium', // medium：像素比上限 1.5，阴影贴图默认 1024
  backgroundColor: '#050403', // 场景背景；设为 null 可输出透明画布
  fire: {
    color: '#ffb34b', // 火焰外缘色调，内焰和蓝色根部由材质单独表现
    width: 0.028, // 火腹宽度，Three.js 世界单位
    height: 0.08, // 静止火苗高度，世界单位
    depth: 0.028, // 火苗纵深，世界单位
    speed: 1, // 动画速度倍率；0 会暂停火苗和烛光闪动
    airflowAmplitude: 0.32, // 气流摆动幅度，范围 0..1；0 表示无气流摆动
  },
  candle: {
    show: true, // 显示蜡体、灯芯、点光源和蜡烛组内地面
    position: [0, 0, 0], // 蜡烛底面在共享场景中的世界坐标
    bodyColor: '#f0e3c8', // 蜡体颜色
    bodyRadius: 0.024, // 蜡体半径，世界单位
    bodyHeight: 0.22, // 蜡体高度，世界单位
    wickColor: '#17100b', // 灯芯颜色
    wickRadius: 0.002, // 灯芯半径，世界单位
    wickHeight: 0.02, // 从蜡池起算的灯芯高度，世界单位
    light: {
      show: true, // 创建随火苗闪动的烛光点光源
      color: '#ffac4c', // 点光源颜色
      intensity: 0.3, // 点光源强度；动画时会轻微闪动
      distance: 1.6, // 点光源影响距离，世界单位
      decay: 2, // 光线随距离衰减的指数
      castShadow: true, // 开启动态点光阴影；每次更新需渲染六个方向
    },
  },
  lighting: {
    hemisphere: {
      show: true, // 启用柔和的环境补光
      skyColor: '#dde5ff', // 半球光的天空侧颜色
      groundColor: '#1e1410', // 半球光的地面侧颜色
      intensity: 0.16, // 半球光强度
    },
    fill: {
      show: true, // 启用方向补光
      color: '#ffefd8', // 方向补光颜色
      intensity: 0.3, // 方向补光强度
      position: [-3, 3.5, 4], // 相对蜡烛底面的光源位置
      castShadow: false, // 关闭方向光投影，避免和烛光阴影叠加
    },
  },
  shadow: {
    enabled: true, // 阴影总开关；还需由对应灯光开启 castShadow
    mapSize: 1024, // 阴影贴图边长，像素；越大越清晰也越耗资源
    radius: 4, // PCF 阴影采样半径，值越大边缘越柔
    intensity: 1, // 阴影强度，范围 0..1
    bias: 0, // 深度偏移，用于缓解阴影痤疮
    normalBias: 0.012, // 法线偏移，用于缓解自阴影伪影
    refreshRate: 24, // 动态点光阴影最高刷新频率，单位 Hz
  },
  ground: {
    show: true, // 显示 Fire 自带地面；背景透明时需显式开启
    color: '#29231c', // 地面颜色
    roughness: 0.95, // 地面粗糙度，范围 0..1
    size: 200, // 正方形地面边长，世界单位
    receiveShadow: true, // 允许地面接收阴影
  },
  environment: { show: false, intensity: 0.8 }, // 是否生成室内环境反射及其强度
  bloom: {
    show: true, // 启用辉光后处理
    strength: 0.24, // 辉光强度
    radius: 0.18, // 辉光扩散范围
    threshold: 0.94, // 触发辉光的亮度阈值
  },
  camera: {
    autoFrame: true, // 按蜡烛尺寸自动取景；启用时忽略手动 position/target
    fov: 36, // 透视视野角度
    near: 0.03, // 相机近裁剪面
    far: 10, // 相机远裁剪面
    // position: [0, 0.2, 0.8], // 可手动指定相机位置；同时将 autoFrame 设为 false
    // target: [0, 0.1, 0], // 手动相机观察目标，也是旋转中心
  },
  controls: {
    enabled: true, // OrbitControls 总开关
    damping: true, // 开启拖拽后的阻尼惯性
    autoRotate: false, // 是否持续自动旋转
    autoRotateSpeed: 0.7, // 自动旋转速度
    enableRotate: true, // 允许鼠标拖拽或单指滑动旋转
    enableZoom: true, // 允许滚轮或双指缩放
    enablePan: false, // 禁止平移
    minDistance: 0.38, // 相机最近距离，世界单位
    maxDistance: 1.4, // 相机最远距离，世界单位
    rotateSpeed: 0.58, // 旋转速度
    zoomSpeed: 0.75, // 缩放速度
    panSpeed: 0.8, // 平移速度
  },
  renderer: { pixelRatio: 1.35 }, // 像素比上限；不会超过设备 devicePixelRatio
});

chart.updateOptions({ fire: { airflowAmplitude: 0.2 } }); // 合并更新气流幅度，不重置其他选项
// 容器尺寸变化后调用 chart.resize()；组件卸载时调用 chart.dispose()。
```

## 参数说明

- 所有尺寸、距离和位置使用 Three.js 世界单位；颜色支持 CSS 颜色字符串或数字。有限数值会按字段边界限制，`NaN` 和无穷值回退为默认值；位置必须是三个有限数值组成的数组，否则回退到默认位置。
- `fire` 的默认值是 `color: '#ffb34b'`、`width/depth: 0.22`、`height: 0.62`、`speed: 1` 和 `airflowAmplitude: 0.65`。宽、深最小 `0.02`，高最小 `0.05`；速度限制在 `0..3`，气流幅度限制在 `0..1`。气流同时推动火苗和烛光点光源；设为 `0` 时火苗仍有基础动画，但不受气流摆动。
- `candle` 默认显示，底面位置为 `[0, 0, 0]`；蜡体默认颜色 `'#f5e8cf'`、半径 `0.32`、高度 `1.25`，灯芯默认颜色 `'#17100b'`、半径 `0.008`、高度 `0.085`。蜡体半径最小 `0.02`、高度最小 `0.08`；灯芯半径最小 `0.002`、高度最小 `0.01`。设 `candle.show: false` 时只保留火苗，不创建蜡体、灯芯、点光源或蜡烛组内地面。
- `candle.light` 默认开启，颜色 `'#ffb55d'`、强度 `0.32`、距离 `7`、衰减指数 `2`；强度限制在 `0..20`，距离最小 `0.1`，衰减指数限制在 `0..4`。点光默认不投影；开启 `castShadow` 后还需 `shadow.enabled: true`，动态阴影随火苗气流刷新。
- `lighting.hemisphere` 默认开启，天空色为 `'#dde5ff'`、地面色为 `'#1e1410'`、强度 `0.22`（`0..5`）。`lighting.fill` 默认开启，颜色 `'#ffefd8'`、强度 `0.65`（`0..20`）、位置 `[-3, 3.5, 4]`，并默认投影；组合烛光点阴影时可关闭方向光投影，避免两套阴影叠加。
- `shadow.enabled` 默认开启；`mapSize` 默认随质量档位取 `low: 256`、`medium: 1024`、`high: 2048`，可显式设为 `128..4096`。`radius` 默认 `3`（`0..64`），`intensity` 默认 `1`（`0..1`），`bias` 默认 `0`（`-0.1..0.1`），`normalBias` 默认 `0.012`（`-1..1`），`refreshRate` 默认 `24 Hz`（`0..60`）；刷新率设为 `0` 后只在首次渲染阴影。
- 动态点光阴影每次刷新要渲染六个方向，增大贴图或刷新频率都会增加 GPU 开销。Fire 只设置自身蜡体、灯芯和地面的阴影；宿主加入 `chart.scene` 的桌子、水果等对象必须由宿主自行设置 `castShadow` 和 `receiveShadow`。
- `ground` 默认在背景非透明时显示，颜色 `'#29231c'`、粗糙度 `0.95`、边长 `200`、接收阴影；粗糙度限制在 `0..1`，边长最小 `0.1`。地面受 `shadow.enabled` 总开关控制；背景设为 `null` 时默认隐藏，也可显式开启。
- `environment` 默认关闭，强度 `0.8`（`0..5`）；开启后用 `RoomEnvironment`/PMREM 提供材质环境反射，不替代实际灯光。`bloom` 默认开启，强度 `0.1`（`0..3`）、半径 `0.15`（`0..1`）、阈值 `0.9`（`0..1`）；低性能场景可关闭。
- `backgroundColor` 默认 `'#100e0c'`；设为 `null` 后画布透明、关闭雾，并默认隐藏地面。`renderer.pixelRatio` 默认由 `quality` 决定：`1 / 1.5 / 2`，显式设置限制在 `1..2`，且不超过设备 `devicePixelRatio`。质量档位只决定像素比和默认阴影贴图大小，不会自动关闭阴影或辉光。
- `camera` 默认根据蜡烛尺寸和位置自动取景，目标为蜡烛内容高度中点。没有手动 `position`/`target` 时 `autoFrame` 默认开启；传入其中任意一项时默认关闭。显式设 `autoFrame: true` 会忽略手动位置和目标。`fov` 默认 `42°`（`20..100`），`near` 默认 `0.1`（最小 `0.01`），`far` 默认 `100`（最小 `10`），并应保证 `far > near`。
- `controls` 使用 `OrbitControls`：默认启用阻尼、旋转和缩放，禁用平移及自动旋转。`autoRotateSpeed` 默认 `0.7`；`rotateSpeed/zoomSpeed/panSpeed` 默认 `0.7/0.8/0.8`，均不能小于 `0`。`minDistance/maxDistance` 默认 `2.4/10` 个世界单位，最小距离至少 `0.1`，最大距离不会小于最小距离。`fire.speed: 0` 只暂停火焰与烛光动画，不会关闭相机控制器。
- `FireOptions` 继承公共 `BaseOptions` 的 `className`、`style`、`cs` 和 `animate` 类型字段；Fire 运行时不读取这些字段。需要控制容器样式时由宿主设置，火焰动画请使用 `fire.speed`。

## 更新、组合与释放

- `setOption(options)` 使用传入对象完整替换当前配置；省略字段恢复默认值，并重建图表配置。
- `updateOptions(partialOptions)` 在首次 `setOption` 后使用，将传入字段合并到当前配置。常见的气流、速度、颜色、灯光强度、位置、相机和控制器变化会局部更新；尺寸或灯光/阴影结构变化时会重建对应对象，Bloom 变化会重建后处理链。
- `chart.scene` 是可组合的 Three.js 场景。把外部 `THREE.Group` 加入该场景，可共用 Fire 的渲染器、相机和烛光。宿主负责外部网格的投影属性和资源释放；`chart.dispose()` 只释放 Fire 自己创建的资源。
- 容器尺寸改变后调用 `chart.resize()`。组件卸载时调用 `chart.dispose()`；重复调用安全。

## 实现边界与参考

火苗基于单个平滑网格和连续噪声更新，不需要加载外部火焰纹理；蜡体使用 Three.js `SubsurfaceScatteringShader` 实现透光近似。它不求解流体、燃烧化学反应或温度，也不会随时间消耗蜡体。点光阴影是实时 PCF 近似，不等同于火焰面积光源。

- 蜡烛火苗的形变参考 [The Lonely Candle](https://codepen.io/prisoner849/pen/XPVGLp)（MIT），并通过 [three-js-birthday-cake](https://github.com/ascodeasice/three-js-birthday-cake) 的实际复用案例确认来源。
- Three.js 蜡体透光：[SubsurfaceScatteringShader](https://github.com/mrdoob/three.js/blob/dev/examples/jsm/shaders/SubsurfaceScatteringShader.js)。点光阴影细节参考 [Three.js 点光阴影示例](https://github.com/mrdoob/three.js/blob/dev/examples/webgl_shadowmap_pointlight.html)。
- 火焰参数文档的组织方式也参考了 Three.js 体积火焰项目公开的尺寸、质量/性能参数和更新接口说明：[ThreeVolumetricFire](https://github.com/housz/ThreeVolumetricFire)、[THREE.Fire](https://github.com/mattatz/THREE.Fire)。这些项目的 `sliceSpacing`、纹理等字段不属于本包 API。
- 静物示例使用的真实蜡烛照片仅作外观参考：[Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Candle_wick_and_flame_closeup.jpg)。桌面 PBR 木纹来自 [Poly Haven Wood Table 001](https://polyhaven.com/a/wood_table_001)，CC0；贴图来源和作者见 [assets 说明](../../../table3d/demo/assets/wood-table-001/ASSETS.md)。

旧实验版体积火焰使用的 `width`、`height`、`depth` 与当前蜡烛火苗比例不同；当前版本的尺寸直接作用于模型，不再应用旧版 `0.38 / 0.68 / 0.38` 缩放。使用旧配置时应根据新蜡烛比例重新调整尺寸。完整许可见包内 [LICENSE](../../LICENSE)。
