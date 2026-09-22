# @so-chart/scatter3d

基于 Three.js 和 WebGL 的 3D 散点图组件，沿用 so-chart 的 `setOption`、`resize`、事件和 `dispose` 生命周期。它适合点云、轨迹、三维实验数据和需要相机旋转的空间数据展示。

## 安装

```bash
pnpm add @so-chart/scatter3d three
```

## 数据格式

```ts
type TuplePoint = [x: number, y: number, z: number];

type ObjectPoint = {
  x: number;
  y: number;
  z: number;
  value?: number; // visualMap.dimension 为 value 时参与颜色映射
  label?: string; // 命中点标题中显示
  color?: string; // 覆盖数据集颜色和 visualMap
};
```

无法转换为有限数字的点会被忽略。没有显式设置坐标轴范围时，组件会根据所有有效点自动计算范围；单值数据会自动增加边距。

## 完整配置示例

下面的示例把三个轴分别展开，`xAxis`、`yAxis`、`zAxis` 都支持同一组轴参数，可以分别设置范围、标题、颜色、刻度数量和格式化函数。每个配置属性的说明都放在属性行尾，方便直接复制后按需删改。

```ts
import getScatter3DChart, { type Scatter3DOptions } from '@so-chart/scatter3d';

const chart = getScatter3DChart({
  container,
  chartType: 'scatter3d',
  layout: { height: 420 },
});

const options: Scatter3DOptions = {
  datasets: [
    {
      label: '螺旋点云', // 系列名称，也会出现在事件数据和 Tooltip 标题中
      data: points, // [x, y, z] 元组或对象点数组
      color: '#38bdf8', // 系列默认颜色
      size: 0.14, // 点尺寸，单位是世界坐标
      opacity: 0.92, // 当前系列透明度，范围 0..1
      symbol: 'circle', // circle 或 square
      show: true, // 是否绘制并参与点位拾取
      line: {
        show: true, // 是否按 data 顺序连接轨迹
        color: '#38bdf8', // 轨迹颜色
        width: 1, // 线宽，WebGL 平台可能限制非 1 像素宽度
        opacity: 0.35, // 轨迹透明度
        dash: 'dashed', // solid、dashed 或 dotted
        dashSize: 0.35, // 虚线段长度，单位是世界坐标
        gapSize: 0.16, // 虚线间隔长度，单位是世界坐标
      },
    },
    {
      label: '环形轨迹', // 第二个数据系列
      data: orbitPoints, // 另一组点位
      color: '#f97316', // 第二个系列颜色
      size: 0.1, // 可以覆盖全局 point.size
      opacity: 0.78, // 可以覆盖全局 point.opacity
      symbol: 'square', // 可以覆盖全局 point.symbol
      line: {
        show: true, // 开启轨迹
        color: '#f97316', // 轨迹颜色
        dash: 'dotted', // 使用点线
        dashSize: 0.06, // 点线段长度
        gapSize: 0.16, // 点线间隔
        opacity: 0.75, // 轨迹透明度
      },
    },
  ],
  backgroundColor: null, // 场景背景色，null 表示透明
  gridColor: '#94a3b8', // 所有网格的统一回退颜色
  axisColor: '#475569', // 所有坐标轴的统一回退颜色
  grid: {
    show: true, // 是否显示网格
    color: '#94a3b8', // 普通网格线颜色
    centerColor: '#e2e8f0', // 网格中心线颜色
    planeColors: {
      xy: '#64748b', // xy 平面的普通网格线颜色
      xz: '#94a3b8', // xz 平面的普通网格线颜色
      yz: '#475569', // yz 平面的普通网格线颜色
    },
    divisions: 10, // 每个平面的分割数量，范围 1..32
    opacity: 0.28, // 网格透明度，范围 0..1
    planes: 'all', // xy、xz、yz 或 all
  },
  axes: {
    show: true, // 是否显示三条轴
    color: '#64748b', // 轴线和刻度线颜色
    labelColor: '#64748b', // 数值标签颜色
    nameColor: '#0f172a', // 轴名称颜色
    showLabel: true, // 是否显示数值标签
    showTick: true, // 是否显示刻度线
    splitNumber: 4, // 默认刻度间隔数量，范围 1..12
    tickSize: 0.12, // 刻度线长度，单位是世界坐标
    fontSize: 11, // 标签字号，范围 8..32
    labelGap: 0.18, // 数值标签与刻度线的距离，单位是世界坐标
    nameGap: 0.34, // 轴名称与轴端点的距离，单位是世界坐标
    formatter: value => value.toFixed(1), // 三条轴的默认刻度格式化函数
    axisLine: {
      show: true, // 是否显示三条轴的主线
      color: '#64748b', // 主线颜色
      width: 1, // 主线宽度
      opacity: 0.75, // 主线透明度
      dash: 'dashed', // solid、dashed 或 dotted
      dashSize: 0.24, // 虚线段长度
      gapSize: 0.14, // 虚线间隔长度
    },
  },
  xAxis: {
    name: 'X', // X 轴名称
    domain: [-4, 4], // X 轴固定范围，倒序会自动交换
    show: true, // 是否显示 X 轴
    color: '#64748b', // 覆盖 axes.color
    labelColor: '#64748b', // 覆盖 axes.labelColor
    nameColor: '#0f172a', // 覆盖 axes.nameColor
    showLabel: true, // 覆盖 axes.showLabel
    showTick: true, // 覆盖 axes.showTick
    splitNumber: 4, // 覆盖 axes.splitNumber
    tickSize: 0.12, // 覆盖 axes.tickSize
    fontSize: 11, // 覆盖 axes.fontSize
    labelGap: 0.2, // 覆盖 axes.labelGap
    nameGap: 0.36, // 覆盖 axes.nameGap
    formatter: value => `${value.toFixed(1)} mm`, // 只格式化 X 轴
  },
  yAxis: {
    name: 'Y', // Y 轴名称
    domain: [-4, 4], // Y 轴固定范围
    color: '#22c55e', // Y 轴颜色
    labelColor: '#16a34a', // Y 轴标签颜色
    nameColor: '#15803d', // Y 轴名称颜色
    showLabel: true, // 显示 Y 轴标签
    showTick: true, // 显示 Y 轴刻度
    splitNumber: 5, // Y 轴使用 5 段刻度
    tickSize: 0.1, // Y 轴刻度长度
    fontSize: 10, // Y 轴标签字号
    labelGap: 0.16, // Y 轴标签距离
    nameGap: 0.3, // Y 轴名称距离
    formatter: value => value.toFixed(2), // 只格式化 Y 轴
  },
  zAxis: {
    name: 'Z', // Z 轴名称
    domain: [-4, 4], // Z 轴固定范围
    color: '#f97316', // Z 轴颜色
    labelColor: '#ea580c', // Z 轴标签颜色
    nameColor: '#c2410c', // Z 轴名称颜色
    showLabel: true, // 显示 Z 轴标签
    showTick: true, // 显示 Z 轴刻度
    splitNumber: 4, // Z 轴刻度数量
    tickSize: 0.12, // Z 轴刻度长度
    fontSize: 11, // Z 轴标签字号
    labelGap: 0.18, // Z 轴标签距离
    nameGap: 0.34, // Z 轴名称距离
    formatter: value => `${value.toFixed(1)} cm`, // 只格式化 Z 轴
  },
  visualMap: {
    dimension: 'z', // 按 x、y、z 或对象点的 value 映射颜色
    min: -4, // 颜色映射下限，省略时自动计算
    max: 4, // 颜色映射上限，省略时自动计算
    colors: ['#38bdf8', '#22c55e', '#facc15', '#f43f5e'], // 两个或更多颜色按区间插值
    clamp: true, // 范围外数据使用首尾颜色
    reverse: false, // 是否反转颜色方向
    outOfRangeColor: '#64748b', // clamp 为 false 时的范围外颜色
  },
  point: {
    size: 0.16, // 未被数据集覆盖时的点尺寸
    opacity: 0.9, // 未被数据集覆盖时的透明度
    symbol: 'circle', // 未被数据集覆盖时的点形状
    sizeAttenuation: true, // 是否随相机距离缩放
    depthTest: true, // 是否参与深度测试
    depthWrite: false, // 是否写入深度缓冲
    blending: 'normal', // normal、additive、subtractive 或 multiply
  },
  emphasis: {
    show: true, // 是否显示命中点高亮
    scale: 2, // 按原点尺寸放大的倍数，范围 1..4
    // color: '#facc15', // 可选：覆盖命中点颜色，默认沿用原点颜色
    // size: 0.34, // 可选：固定高亮尺寸，优先于 scale
    // opacity: 0.85, // 可选：覆盖高亮透明度，默认沿用原点透明度
  },
  fog: {
    color: '#0f172a', // 线性雾颜色
    near: 10, // 开始出现雾的相机距离
    far: 40, // 完全出现雾的相机距离
  },
  camera: {
    position: [7, 5.5, 7], // 相机初始位置
    target: [0, 0, 0], // 相机旋转中心
    zoom: 1, // PerspectiveCamera 缩放
    fov: 45, // 透视视野角，单位是度
    near: 0.1, // 相机近裁剪面
    far: 100, // 相机远裁剪面
  },
  controls: {
    enabled: true, // 相机交互总开关
    damping: false, // 是否开启相机惯性
    autoRotate: false, // 是否自动旋转
    autoRotateSpeed: 1.5, // 自动旋转速度
    enableRotate: true, // 是否允许旋转
    enableZoom: true, // 是否允许缩放
    enablePan: true, // 是否允许平移
    minDistance: 5, // 相机最小距离
    maxDistance: 18, // 相机最大距离
    minPolarAngle: 0.2, // 垂直旋转下限，单位是弧度
    maxPolarAngle: Math.PI - 0.2, // 垂直旋转上限，单位是弧度
    minAzimuthAngle: -Math.PI, // 水平旋转下限，单位是弧度
    maxAzimuthAngle: Math.PI, // 水平旋转上限，单位是弧度
    rotateSpeed: 0.8, // 鼠标旋转速度
    zoomSpeed: 0.9, // 滚轮缩放速度
    panSpeed: 0.8, // 平移速度
    screenSpacePanning: true, // 是否沿屏幕坐标平移
    keyPanSpeed: 7, // 键盘平移速度
  },
  tooltip: {
    show: true, // 是否显示命中点 Tooltip
    fixed: false, // 是否使用公共 Tooltip 的固定位置
    drag: false, // 是否允许拖拽 Tooltip
    formatter: value => (typeof value === 'number' ? value.toFixed(2) : value), // 格式化坐标和值
    extra: { text: '详情', func: index => console.log(index) }, // 公共 Tooltip 扩展操作
  },
  renderer: {
    pixelRatio: 2, // 1 更省 GPU，2 适合高分屏
  },
};

chart.setOption(options);
const unsubscribe = chart.on('click', data => {
  console.log(data.datasetLabel, data.point);
});

// 组件卸载或重新创建图表前调用
unsubscribe();
chart.dispose();
```

## 参数定义与说明

下面是公开类型的可读版。类型联合使用 TypeScript 代码表达，避免在 Markdown 表格中转义 `|` 造成显示问题。

```ts
type Scatter3DLineOptions = {
  show?: boolean; // 是否绘制按点顺序连接的轨迹
  color?: string; // 轨迹颜色
  width?: number; // 线宽，WebGL 可能限制非 1 像素宽度
  opacity?: number; // 轨迹透明度，范围 0..1
  dash?: 'solid' | 'dashed' | 'dotted'; // 实线、虚线或点线
  dashSize?: number; // 虚线段长度，单位是世界坐标
  gapSize?: number; // 虚线间隔长度，单位是世界坐标
};

type Scatter3DDataset = {
  label?: string; // 系列名称
  data: readonly Scatter3DPoint[]; // 点位数据
  color?: string; // 系列默认颜色
  size?: number; // 系列点尺寸
  opacity?: number; // 系列透明度
  symbol?: 'circle' | 'square'; // 系列点形状
  show?: boolean; // 是否绘制该系列
  line?: Scatter3DLineOptions; // 系列轨迹配置
};

type Scatter3DGridOptions = {
  show?: boolean; // 是否显示网格
  color?: string; // 普通网格线颜色
  centerColor?: string; // 中心线颜色
  planeColors?: Partial<Record<Scatter3DGridPlane, string>>; // xy、xz、yz 的独立颜色
  divisions?: number; // 分割数量，范围 1..32
  opacity?: number; // 网格透明度
  planes?: readonly Scatter3DGridPlane[] | 'all'; // 要绘制的平面
};

type Scatter3DAxesOptions = {
  show?: boolean; // 是否显示三条轴
  color?: string; // 轴线和刻度线颜色
  labelColor?: string; // 数值标签颜色
  nameColor?: string; // 轴名称颜色
  showLabel?: boolean; // 是否显示数值标签
  showTick?: boolean; // 是否显示刻度线
  axisLine?: Scatter3DAxisLineOptions; // 三条轴的主线样式
  splitNumber?: number; // 刻度间隔数量，范围 1..12
  tickSize?: number; // 刻度线长度，单位是世界坐标
  fontSize?: number; // 标签字号，范围 8..32
  labelGap?: number; // 标签距离，单位是世界坐标
  nameGap?: number; // 轴名称距离，单位是世界坐标
  formatter?: (value: number) => string; // 默认刻度格式化函数
};

type Scatter3DAxisLineOptions = {
  show?: boolean; // 是否显示主线
  color?: string; // 主线颜色
  width?: number; // 主线宽度
  opacity?: number; // 主线透明度
  dash?: 'solid' | 'dashed' | 'dotted'; // 主线样式
  dashSize?: number; // 虚线段长度
  gapSize?: number; // 虚线间隔长度
};

type Scatter3DAxisOptions = Scatter3DAxesOptions & {
  domain?: readonly [number, number]; // 当前轴的固定范围
  name?: string; // 当前轴名称
};

type Scatter3DVisualMapOptions = {
  dimension?: 'x' | 'y' | 'z' | 'value'; // 颜色映射维度
  min?: number; // 映射下限，省略时自动计算
  max?: number; // 映射上限，省略时自动计算
  colors?: readonly string[]; // 两个或更多颜色色标
  clamp?: boolean; // 是否将范围外数据限制到首尾色
  reverse?: boolean; // 是否反转色标方向
  outOfRangeColor?: string; // clamp 为 false 时的范围外颜色
};

type Scatter3DEmphasisOptions = {
  show?: boolean; // 是否显示命中点高亮
  scale?: number; // 按原点尺寸放大的倍数，范围 1..4，默认 1.8
  color?: string; // 可选：覆盖高亮颜色，默认沿用命中点颜色
  size?: number; // 可选：固定高亮尺寸，优先于 scale
  opacity?: number; // 可选：覆盖高亮透明度，默认沿用命中点透明度
};
```

`xAxis`、`yAxis`、`zAxis` 都使用 `Scatter3DAxisOptions`。轴对象中的同名属性会覆盖 `axes` 的默认值，`domain` 固定该轴的空间范围，`formatter` 只影响当前轴的文本。`gridColor` 和 `axisColor` 是全局回退颜色。

`visualMap` 支持两个或更多色标。点对象自己的 `color` 优先级最高，会跳过 `visualMap`；没有 `value` 的元组点不会参与 `dimension: 'value'` 的映射，仍使用数据集颜色。

`emphasis` 会复用命中点的颜色、圆形或方形和透明度，再按 `scale` 放大；只有显式设置 `color`、`size` 或 `opacity` 时才覆盖原点样式，其中 `size` 优先于 `scale`。

### 点、场景和相机

```ts
type PointOptions = {
  size?: number; // 所有数据集的默认点尺寸
  opacity?: number; // 数据集未单独设置 opacity 时使用
  symbol?: 'circle' | 'square'; // 数据集未单独设置 symbol 时使用
  sizeAttenuation?: boolean; // 点是否随相机距离缩放
  depthTest?: boolean; // 是否参与深度测试
  depthWrite?: boolean; // 是否写入深度缓冲
  blending?: 'normal' | 'additive' | 'subtractive' | 'multiply'; // 混合模式
};

type CameraOptions = {
  position?: readonly [number, number, number]; // 初始位置，默认 [7, 5.5, 7]
  target?: readonly [number, number, number]; // 旋转中心，默认 [0, 0, 0]
  zoom?: number; // PerspectiveCamera 缩放，默认 1
  fov?: number; // 透视视野角，单位是度，默认 45
  near?: number; // 近裁剪面，默认 0.1
  far?: number; // 远裁剪面，默认 100
};

type ControlsOptions = {
  enabled?: boolean; // 交互总开关，默认 true
  damping?: boolean; // 相机惯性，默认 false
  autoRotate?: boolean; // 自动旋转，默认 false
  autoRotateSpeed?: number; // 自动旋转速度，默认 1.5
  enableRotate?: boolean; // 是否允许旋转，默认 true
  enableZoom?: boolean; // 是否允许缩放，默认 true
  enablePan?: boolean; // 是否允许平移，默认 true
  minDistance?: number; // 最小距离，默认 0
  maxDistance?: number; // 最大距离，默认 Infinity
  minPolarAngle?: number; // 垂直旋转下限，单位弧度，默认 0
  maxPolarAngle?: number; // 垂直旋转上限，单位弧度，默认 Math.PI
  minAzimuthAngle?: number; // 水平旋转下限，单位弧度，默认 -Infinity
  maxAzimuthAngle?: number; // 水平旋转上限，单位弧度，默认 Infinity
  rotateSpeed?: number; // 旋转速度，默认 1
  zoomSpeed?: number; // 缩放速度，默认 1
  panSpeed?: number; // 平移速度，默认 1
  screenSpacePanning?: boolean; // 是否沿屏幕坐标平移，默认 true
  keyPanSpeed?: number; // 键盘平移速度，默认 7
};
```

`fog` 使用 Three.js 线性雾，参数是 `color`、`near` 和 `far`。`backgroundColor: null` 保持场景透明。`renderer.pixelRatio` 会被限制在 `1..3`，并且不会超过浏览器的 `devicePixelRatio`；`1` 更省 GPU，`2` 适合 Retina 等高分屏。

### Tooltip、事件和生命周期

```ts
type TooltipOptions = {
  show?: boolean; // 是否在命中点旁显示 Tooltip
  fixed?: boolean; // 是否使用公共 Tooltip 固定位置行为
  drag?: boolean; // 是否允许拖拽 Tooltip
  formatter?: (value: number | string | Date) => typeof value; // 格式化坐标和值
  extra?: {
    text?: string; // 公共 Tooltip 扩展文本
    func?: (index: number) => void; // 公共 Tooltip 扩展回调
  };
};
```

Tooltip 默认展示系列名称、点序号、X、Y、Z 和对象点的 `value`。支持 `mouseenter`、`mousemove`、`mouseleave`、`click` 四类点位事件，事件数据包含系列索引、点索引、原始点、命中距离和画布内屏幕坐标。

调用 `setOption` 会重新创建当前场景，调用 `resize` 会同步 CSS 尺寸和 WebGL 绘制缓冲区，调用 `dispose()` 会停止渲染循环、移除指针事件、销毁 OrbitControls，并释放场景中的 geometry、material、纹理和 renderer。

点数较多时优先使用元组点和系列级配置，减少每个点单独设置 `color`；关闭 `damping`、`autoRotate` 和不需要的网格平面；把 `renderer.pixelRatio` 设为 `1`。开启 `visualMap` 时颜色会一次性写入 `BufferGeometry`，不会在每次 hover 时重新构建几何体。

## 示例与说明

- 可运行示例：[`demo/examples`](./demo/examples)
- 配置与行为说明：[`demo/docs`](./demo/docs)
- 预览站和包独立 Demo 都从 [`demo/manifest.ts`](./demo/manifest.ts) 读取示例关系。
