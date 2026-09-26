# 3D 水果图表

`@so-chart/fruit` 使用 Three.js 绘制独立的 3D 水果场景，不包含果篮或其他容器。内置苹果、香蕉、梨子、牛油果、猕猴桃、柠檬、青柠、石榴和荔枝模型；模型随包提供，运行时不请求外部资源。

## 数据格式

```ts
type FruitType = 'apple' | 'banana' | 'pear' | 'avocado' | 'kiwi' | 'lemon' | 'lime' | 'pomegranate' | 'lychee';

type FruitVector3 = readonly [number, number, number];

type FruitItemOptions = {
  type: FruitType;
  id?: string;
  position?: FruitVector3;
  rotation?: FruitVector3;
  scale?: number;
};
```

`FruitType`、`FruitVector3` 和 `FruitItemOptions` 均由包入口导出。位置使用三维场景坐标；旋转按 XYZ 欧拉角解释，单位为弧度。`id` 用于在事件中识别水果实例。

## 完整配置示例

```ts
import getFruitChart from '@so-chart/fruit';

const chart = getFruitChart({
  container,
  chartType: 'fruit',
  layout: { height: 520 }, // 高度单位为像素；默认 400
});

chart.setOption({
  fruits: [
    {
      id: 'apple-main', // 可选实例标识；同一列表内应唯一
      type: 'apple',
      position: [-1, 0, 0], // 未设置时自动排布
      rotation: [0, 0, 0], // XYZ 欧拉角，单位为弧度
      scale: 1.1, // 模型大小倍率，范围 0.25..2.5
    },
    { id: 'banana-main', type: 'banana' },
    { id: 'pear-main', type: 'pear' },
    { id: 'avocado-main', type: 'avocado', position: [1, 0, 0] },
  ],
  backgroundColor: '#e9e4dd', // 颜色字符串或十六进制数值；null 为透明背景
  floor: {
    show: true, // 显示地面
    color: '#ded7ce',
    roughness: 0.88, // 粗糙度范围 0.05..1
  },
  lighting: {
    show: true, // 半球补光和方向主光
    color: '#fff3dc',
    intensity: 2.8, // 主光强度，范围 0..20
    fillIntensity: 1.8, // 补光强度，范围 0..10
  },
  camera: {
    position: [0, 5.8, 5], // 相机位置
    target: [0, 0.32, 0], // 观察目标
    fov: 44, // 视野角，单位为度，范围 20..100
    autoFit: true, // 加载完成和容器尺寸变化时自动取景
  },
  controls: {
    enabled: true, // 控制器总开关
    damping: true, // 开启阻尼；惯性结束后暂停渲染
    autoRotate: false,
    autoRotateSpeed: 0.35,
    enableRotate: true,
    enableZoom: true,
    minDistance: 3.2,
    maxDistance: 12,
    minPolarAngle: 0.18, // 单位为弧度
    maxPolarAngle: Math.PI * 0.86, // 单位为弧度
    rotateSpeed: 0.65,
    zoomSpeed: 0.8,
  },
  renderer: {
    pixelRatio: 1.5, // 上限范围 1..2，且不超过浏览器 devicePixelRatio
    shadows: true,
    toneMappingExposure: 1.05, // 曝光范围 0.1..3
  },
  onError: error => console.error('Fruit model failed to load', error),
});
```

## 参数说明

- `layout.height` 是创建图表时设置的画布高度，单位为像素，默认 `400`；画布宽度随容器宽度变化。
- `fruits` 省略时显示苹果、香蕉和梨子各一个；传入 `[]` 时隐藏水果但保留地面。相同种类可以重复添加，`type` 必须是上方列出的内置类型；无效类型会被跳过。
- `fruits[].id` 用于跨事件识别实例。省略或传入空白字符串时按输入位置生成 `fruit-1`、`fruit-2` 等标识；显式 ID 应在当前列表中保持唯一。需要在重排或替换列表后识别同一实例时，请提供稳定 ID。
- `fruits[].position` 省略时自动排布：最多三个水果排成一行，更多水果按近似方形网格排列，间距为 `0.9` 场景单位。`rotation` 默认为各模型的默认朝向；无效或非有限的三维向量会回退到自动位置或默认朝向。
- `fruits[].scale` 是模型大小倍率，默认 `1`，限制在 `0.25..2.5`；非有限值回退为 `1`。模型载入场景前会按最长边归一化到 `0.82` 场景单位，因此缩放不依赖 GLB 文件的原始尺寸。
- `backgroundColor`、`floor.color` 和 `lighting.color` 支持 CSS 颜色字符串或 Three.js 十六进制数值。`backgroundColor: null` 会清除场景背景并使用透明画布。
- `floor.show` 默认 `true`；`floor.roughness` 默认 `0.88`，限制在 `0.05..1`。关闭地面不会关闭其他场景对象。
- `lighting.show` 默认 `true`，控制显式的半球补光和方向主光；室内环境反射仍由 Three.js 环境提供。`intensity` 默认 `2.8`、限制在 `0..20`；`fillIntensity` 默认 `1.8`、限制在 `0..10`。
- `camera.position` 和 `camera.target` 默认分别为 `[2.5, 3.2, 6.5]`、`[0, 0.32, 0]`，都使用三维场景坐标；无效向量回退到默认值。`camera.fov` 默认 `42` 度，限制在 `20..100`。
- `camera.autoFit` 默认 `false`。启用后，模型加载完成及容器尺寸变化时会按水果包围范围和画布宽高比调整相机距离，保留 `position` 相对 `target` 的观察方向，并将目标移到水果中心。自动计算的距离仍受 `controls.minDistance` 和 `maxDistance` 限制；若距离范围设得过窄，场景可能无法完整适配。
- `controls.enabled` 默认 `true`，关闭后不响应相机操作或控制器动画；`enableRotate`、`enableZoom` 分别控制旋转和缩放，默认均为 `true`。水果图表不提供平移选项。
- `controls.damping` 默认 `true`；交互结束后仅在惯性尚未结束时继续渲染。`autoRotate` 默认 `false`，只有控制器启用且 `autoRotateSpeed` 为正值时才持续旋转和渲染。
- `controls.minDistance` / `maxDistance` 默认 `3.2` / `12`；最小距离不会小于 `0.1`，最大距离不会小于最小距离。`minPolarAngle` / `maxPolarAngle` 默认 `0.18` / `π × 0.86`，单位为弧度并限制在 `0..π`；最大角度小于最小角度时会提升到最小角度。
- `controls.rotateSpeed` / `zoomSpeed` 默认 `0.65` / `0.8`，负值按 `0` 处理。`autoRotateSpeed` 默认 `0.35`，非有限值回退到默认值，负值按 `0` 处理。
- `renderer.pixelRatio` 默认 `1.5`，限制在 `1..2` 且不会超过浏览器 `devicePixelRatio`；`renderer.shadows` 默认 `true`；`toneMappingExposure` 默认 `1.05`，限制在 `0.1..3`。
- 带取值范围的数值参数遇到非有限值时回退到对应默认值，有限值超出范围时会被限制到边界。`position` 和 `rotation` 只校验向量长度及分量是否有限，不会裁剪坐标或角度。

## 拾取事件

命中水果才会触发事件；鼠标和触控屏的点击都映射为 `click`。指针按下后移动超过 `4` CSS 像素会视作拖动，不触发水果点击。

```ts
const unsubscribe = chart.on('click', ({ fruitId, fruitIndex, fruitType, screen }) => {
  console.log(fruitId, fruitIndex, fruitType, screen);
});

chart.on('mouseenter', data => console.log('进入水果', data.fruitId));
chart.on('mousemove', data => console.log('水果上的指针位置', data.screen));
chart.on('mouseleave', data => console.log('离开水果', data.fruitId));

unsubscribe();
```

- `click` 在点击水果时触发，点击空白处不触发。
- `mouseenter` 在指针进入水果或从另一个水果移入时触发；`mouseleave` 在指针离开水果或画布、开始拖动相机或 `setOption()` 替换场景时触发。
- `mousemove` 在水果上的指针位置变化时触发；同一帧内的多次移动会合并。
- 事件数据包含 `fruitId`、输入列表中的零基 `fruitIndex`、`fruitType`、相机射线距离 `distance`（场景单位）和相对画布左上角的 `screen` 坐标（CSS 像素）。`on()` 返回单独退订函数；调用 `dispose()` 后全部监听器都会清理。

## 模型加载错误

`onError(error)` 在当前有效场景构建的模型加载或解析失败时调用；未提供回调时错误会输出到控制台。被后续 `setOption()` 替换或已销毁场景产生的过期错误会忽略；错误回调自身抛出的异常会单独输出到控制台。

```ts
chart.setOption({
  onError: error => {
    showModelError(error instanceof Error ? error.message : String(error));
  },
});
```

## 扩展水果种类

新增包内模型时，在 `src/types.ts` 的 `FRUIT_TYPES` 增加种类，在 `src/scene.ts` 的 `FRUIT_MODEL_ASSETS` 注册打包 URL 和 GLB 节点名称，并在 `src/normal.ts` 补充默认朝向。场景加载、自动排布、相机控制和资源释放由通用图表逻辑处理。模型作者、来源和许可证见 [ASSETS.md](../../ASSETS.md)。

## 生命周期

`setOption()` 会完整替换当前选项，省略字段会恢复默认值。图表容器尺寸由宿主布局改变时调用 `chart.resize()` 更新画布；组件卸载时取消订阅并调用 `chart.dispose()`，以释放模型、贴图、监听器、控制器和渲染器。
