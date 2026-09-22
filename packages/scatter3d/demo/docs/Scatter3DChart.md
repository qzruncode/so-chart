# 3D 散点图

这个示例使用 Three.js 的 `WebGLRenderer` 绘制 Plotly 公开 Iris 实测数据，使用 `OrbitControls` 支持旋转、缩放和平移。三条轴分别表示萼片长度、萼片宽度和花瓣长度，三个数据系列表示物种，点对象的 `value` 表示花瓣宽度。

## 数据格式

```ts
type Point = [number, number, number];

type LabeledPoint = {
  x: number;
  y: number;
  z: number;
  value?: number; // visualMap.dimension 为 value 时使用
  label?: string; // 命中点标题中显示
  color?: string; // 覆盖数据集颜色和 visualMap
};
```

元组点适合大批量、统一样式的数据；对象点可以提供 `value`、`label` 和单点 `color`。没有传入坐标轴范围时，组件根据所有有效点自动计算范围。

示例数据来自 [Plotly datasets 的 iris-data.csv](https://github.com/plotly/datasets/blob/master/iris-data.csv)，按 [MIT License](../data/LICENSE) 保留来源说明。

## 完整配置示例

```ts
chart.setOption({
  datasets: [
    {
      label: '螺旋点云', // 系列名称
      data: points, // [x, y, z] 元组或对象点数组
      color: '#38bdf8', // 系列默认颜色
      size: 0.14, // 点尺寸，单位是世界坐标
      opacity: 0.92, // 系列透明度
      symbol: 'circle', // circle 或 square
      show: true, // 是否绘制并参与拾取
      line: {
        show: true, // 是否绘制轨迹
        color: '#38bdf8', // 轨迹颜色
        width: 1, // 线宽，WebGL 平台可能限制非 1 像素宽度
        opacity: 0.3, // 轨迹透明度
        dash: 'dashed', // solid、dashed 或 dotted
        dashSize: 0.35, // 虚线段长度
        gapSize: 0.16, // 虚线间隔长度
      },
    },
    {
      label: '环形轨迹', // 第二个系列名称
      data: orbitPoints, // 第二组点位
      color: '#f97316', // 第二个系列颜色
      size: 0.1, // 第二个系列点尺寸
      opacity: 0.78, // 第二个系列透明度
      symbol: 'square', // 使用方形点
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
  backgroundColor: null, // null 表示透明背景
  gridColor: '#94a3b8', // 网格统一回退颜色
  axisColor: '#475569', // 坐标轴统一回退颜色
  grid: {
    show: true, // 是否显示网格
    color: '#94a3b8', // 普通网格线颜色
    centerColor: '#e2e8f0', // 中心线颜色
    planeColors: {
      xy: '#64748b', // xy 平面颜色
      xz: '#94a3b8', // xz 平面颜色
      yz: '#475569', // yz 平面颜色
    },
    divisions: 10, // 每个平面的分割数量
    opacity: 0.28, // 网格透明度
    planes: 'all', // 绘制 xy、xz、yz 三个平面
  },
  axes: {
    show: true, // 是否显示三条轴
    color: '#64748b', // 轴线颜色
    labelColor: '#64748b', // 数值标签颜色
    nameColor: '#0f172a', // 轴名称颜色
    showLabel: true, // 是否显示数值标签
    showTick: true, // 是否显示刻度线
    splitNumber: 4, // 默认刻度段数
    tickSize: 0.12, // 刻度线长度
    fontSize: 11, // 标签字号
    labelGap: 0.18, // 标签与刻度线距离
    nameGap: 0.34, // 轴名称与端点距离
    formatter: value => value.toFixed(1), // 三条轴的默认格式化
    axisLine: {
      show: true, // 是否显示三条轴的主线
      color: '#64748b', // 主线颜色
      width: 1, // 主线宽度
      opacity: 0.75, // 主线透明度
      dash: 'dashed', // 使用虚线主轴
      dashSize: 0.24, // 虚线段长度
      gapSize: 0.14, // 虚线间隔长度
    },
  },
  xAxis: {
    name: 'X', // X 轴名称
    domain: [-4, 4], // X 轴范围
    color: '#64748b', // X 轴线颜色
    labelColor: '#64748b', // X 轴标签颜色
    nameColor: '#0f172a', // X 轴名称颜色
    showLabel: true, // 显示 X 轴标签
    showTick: true, // 显示 X 轴刻度
    splitNumber: 4, // X 轴刻度段数
    tickSize: 0.12, // X 轴刻度长度
    fontSize: 11, // X 轴字号
    labelGap: 0.2, // X 轴标签距离
    nameGap: 0.36, // X 轴名称距离
    formatter: value => `${value.toFixed(1)} mm`, // X 轴专用格式化
  },
  yAxis: {
    name: 'Y', // Y 轴名称
    domain: [-4, 4], // Y 轴范围
    color: '#22c55e', // Y 轴线颜色
    labelColor: '#16a34a', // Y 轴标签颜色
    nameColor: '#15803d', // Y 轴名称颜色
    showLabel: true, // 显示 Y 轴标签
    showTick: true, // 显示 Y 轴刻度
    splitNumber: 5, // Y 轴刻度段数
    tickSize: 0.1, // Y 轴刻度长度
    fontSize: 10, // Y 轴字号
    labelGap: 0.16, // Y 轴标签距离
    nameGap: 0.3, // Y 轴名称距离
    formatter: value => value.toFixed(2), // Y 轴专用格式化
  },
  zAxis: {
    name: 'Z', // Z 轴名称
    domain: [-4, 4], // Z 轴范围
    color: '#f97316', // Z 轴线颜色
    labelColor: '#ea580c', // Z 轴标签颜色
    nameColor: '#c2410c', // Z 轴名称颜色
    showLabel: true, // 显示 Z 轴标签
    showTick: true, // 显示 Z 轴刻度
    splitNumber: 4, // Z 轴刻度段数
    tickSize: 0.12, // Z 轴刻度长度
    fontSize: 11, // Z 轴字号
    labelGap: 0.18, // Z 轴标签距离
    nameGap: 0.34, // Z 轴名称距离
    formatter: value => `${value.toFixed(1)} cm`, // Z 轴专用格式化
  },
  point: {
    size: 0.16, // 全局默认点尺寸
    opacity: 0.9, // 全局默认透明度
    symbol: 'circle', // 全局默认点形状
    sizeAttenuation: true, // 点随相机距离缩放
    depthTest: true, // 开启深度测试
    depthWrite: false, // 不写入深度缓冲
    blending: 'normal', // 普通混合
  },
  emphasis: {
    show: true, // 开启命中点高亮
    scale: 2, // 按原点尺寸放大的倍数，范围 1..4
    // color: '#facc15', // 可选：覆盖命中点颜色，默认沿用原点颜色
    // size: 0.34, // 可选：固定高亮尺寸，优先于 scale
    // opacity: 0.85, // 可选：覆盖高亮透明度，默认沿用原点透明度
  },
  camera: {
    position: [7, 5.5, 7], // 相机位置
    target: [0, 0, 0], // 旋转中心
    zoom: 1, // 相机缩放
    fov: 45, // 视野角，单位是度
    near: 0.1, // 近裁剪面
    far: 100, // 远裁剪面
  },
  controls: {
    enabled: true, // 相机交互总开关
    damping: false, // 关闭惯性以降低输入延迟
    autoRotate: false, // 不自动旋转
    enableRotate: true, // 允许旋转
    enableZoom: true, // 允许缩放
    enablePan: true, // 允许平移
    minDistance: 5, // 最小相机距离
    maxDistance: 18, // 最大相机距离
    minPolarAngle: 0.2, // 垂直旋转下限，单位弧度
    maxPolarAngle: Math.PI - 0.2, // 垂直旋转上限，单位弧度
    rotateSpeed: 0.8, // 旋转速度
    zoomSpeed: 0.9, // 缩放速度
    panSpeed: 0.8, // 平移速度
    screenSpacePanning: true, // 沿屏幕坐标平移
    keyPanSpeed: 7, // 键盘平移速度
  },
  tooltip: {
    show: true, // 显示命中点 Tooltip
    formatter: value => (typeof value === 'number' ? value.toFixed(2) : value), // 格式化数值
  },
  renderer: {
    pixelRatio: 2, // 1 更流畅，2 更适合高分屏
  },
});
```

## 参数说明

- `xAxis`、`yAxis`、`zAxis` 都支持 `domain`、`name`、`show`、`color`、`labelColor`、`nameColor`、`showLabel`、`showTick`、`splitNumber`、`tickSize`、`fontSize`、`labelGap`、`nameGap`、`formatter` 和 `axisLine`。轴对象中的值会覆盖 `axes` 的默认值。
- `axisLine` 支持 `solid`、`dashed`、`dotted` 三种主轴线型，以及 `width`、`opacity`、`dashSize`、`gapSize`；示例将三条主轴统一设置为虚线。
- `grid.planes` 支持 `xy`、`xz`、`yz` 或 `all`；`centerColor` 控制中心线，`planeColors` 控制三个平面的普通网格线。
- `datasets[].line.dash` 支持 `solid`、`dashed`、`dotted`；`dashSize` 和 `gapSize` 的单位是三维世界坐标。
- `visualMap` 是可选的；`colors` 支持两个或更多色标，`reverse` 反转方向，`clamp: false` 配合 `outOfRangeColor` 可以突出范围外点。当前示例保留物种颜色，让分类关系更直观。
- `point.symbol` 和 `datasets[].symbol` 支持 `circle`、`square`；数据集上的值优先于全局 `point`。
- `emphasis` 会复用命中点的颜色、圆形或方形和透明度，再按 `scale` 放大；只有显式设置 `color`、`size` 或 `opacity` 时才覆盖原点样式，其中 `size` 优先于 `scale`。
- `controls` 的角度使用弧度，`fov` 使用角度；`rotateSpeed`、`zoomSpeed` 和 `panSpeed` 分别控制旋转、缩放和平移速度。
- `renderer.pixelRatio` 会限制在 `1..3`，并且不会超过浏览器 `devicePixelRatio`；`1` 更省 GPU，`2` 更适合 Retina 屏幕。
- `line.width` 在不同 WebGL 实现上可能受到线宽限制，需要稳定的粗线效果时应使用专门的带宽度线几何方案。

## Tooltip 和交互

Tooltip 命中点后展示系列名称、点序号、X、Y、Z 和对象点的 `value`。通过公共 `tooltip.formatter` 可以统一格式化数值，点对象的 `label` 会追加到标题中。

`mouseenter` 用于更新示例底部的选中点文本，`mouseleave` 清除文本和高亮，`click` 可用于业务选择。拖拽相机期间会暂停 raycast hover，松开后恢复；示例关闭了 `damping`，避免惯性动画持续占用渲染循环。

## 生命周期

在宿主组件卸载时取消事件订阅并调用 `chart.dispose()`。销毁过程会清理 OrbitControls、指针监听、动画循环、网格/坐标轴/点云对象、材质、纹理和 WebGL renderer。
