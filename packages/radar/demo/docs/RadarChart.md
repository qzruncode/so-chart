```js
chart = getRadarChart({
  container, // 图形渲染的容器
  chartType: 'radar', // radar图类型，目前有 radar
  layout?: { // 设置图形布局，可选
    height?: number, // 高度
    top?: number, // 上边距
    right?: number, // 右边距
    bottom?: number, // 下边距
    left?: number, // 左边距
  },
  nonce?: string; // 可显式覆盖宿主提供的 CSP nonce
});

chart.setOption({
  cs?: 'lightblue', // 色系，使用项目内置色板
  animate?: { // 设置出场动画
    ease?: 'linear' | 'cubicIn' | 'cubicOut' | 'cubicInOut' | 'bounceIn' | 'bounceOut' | 'bounceInOut', // 默认 linear
    duration?: number, // 动画持续时间，默认 300 ms
    switch?: 'on' | 'off', // 是否应用动画，默认 on
  },
  xAxis: {
    type: 'category', // 固定
    data: string[],
    lineColor?: string, // 线条颜色，默认 rgba(0, 0, 0, 0.1)
    lineWidth?: number, // 线条宽度，默认 1
    lineDash?: number[], // 虚线样式，默认 [3, 3]
    fontColor?: string, // 字体颜色，默认 rgba(0, 0, 0, 0.5)
    fontSize?: number, // 字体大小，默认 12
  },
  yAxis: {
    type: 'value', // 固定
    data: { start: number; end: number },
    interval?: number; // 指定interval，会根据start和end动态生成一个intervalData，控制坐标系粒度。默认 100
    ticks?: number; // 展示的坐标系tick个数，只是一个hint，会自动生成合适的个数（默认5）
    lineColor?: string, // 线条颜色，默认 rgba(0, 0, 0, 0.1)
    lineWidth?: number, // 线条宽度，默认 1
    lineDash?: number[], // 虚线样式，默认 [3, 3]
    fontColor?: string, // 字体颜色，默认 rgba(0, 0, 0, 0.5)
    fontSize?: number, // 字体大小，默认 10
  },
  radius: number, // 直径
  textPadding?: number, // label和圆周之间的距离，默认 10
  hover?: {
    opacity?: number, // 命中区域的填充透明度，默认 0.24，范围 0~1
    lineWidth?: number, // 命中区域的描边宽度，默认 3
    color?: string, // 命中区域的填充色，默认跟随数据集 lineColor
  },
  tooltip?: {
    show?: boolean, // 是否展示tooltip，默认 true
    fixed?: boolean, // 是否固定tooltip位置
    drag?: boolean, // 固定tooltip时是否允许拖拽
    formatter?: (value: number | string | Date) => number | string | Date, // 格式化点值
  },
  datasets: {
    label?: string,
    data: (null | undefined | number)[],
    show?: boolean, // 是否展示这条数据
    lineWidth?: number, // 线条宽度，默认 2
    lineColor?: string, // 线条颜色，内置默认值
    backgroundColor?: string, // 背景色，不设置则取 lineColor，默认内部添加 0.5 透明度
  }[],
  labels?: {
    show?: boolean, // 默认true，是否展示
    data?: string[], // 如果指定，则其中的数据必须根datasets中索引保持一致
    type?: 'circle' | 'rect' | 'path', // 设置label的样式，默认circle。如果指定为path，则需要提供path参数
    path?: string, // 任意一段path路径
    position?: 'top' | 'left' | 'right' | 'bottom' | 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight', // 默认bottom
    orient?: 'vertical' | 'horizontal' | 'flex', // label是水平排列 | 垂直排列 | 自动换行
    fontColor?: string, // 默认 rgba(0, 0, 0, 0.5)
    fontSize?: number, // 默认 12
    maxHeight?: number, // 最大高度，默认 100
    dataMap?: { [label: string]: string }, // 有的需求需要将原始的data中的数据，转化成其他形式。 dataMap提供 data中的数据 和 额外需要展示文本的 映射
    // 以下extra开头的配置都是设置dataMap中需要展示数据的样式
    extraTextType?: 'vertical' | 'horizontal', // 默认 horizontal
    extraTextColor?: string, // 默认 rgba(0, 0, 0, 0.5)
    extraTextSize?: number, // 默认 12
    /** 一个配置例子
      data: ['服务调用', '算力资源', '存储资源'],
      dataMap: {
        服务调用: '服务调用额外的文本',
      },
      extraTextType: 'vertical',
      extraTextColor: '#2D364D',
    */
  },
})
```

雷达图以每个数据集绘制出的填充多边形作为 hover 命中区域，而不是以数据点作为命中目标。鼠标进入整块区域后，该数据集的多边形会高亮并显示 tooltip；tooltip 会列出该区域对应的全部维度和值，标题为数据集名称。区域重叠时，按绘制顺序优先命中最上层的数据集。命中使用 D3 `polygonContains` 判断，窗口尺寸变化后会重新计算多边形坐标；`null` 和 `undefined` 在区域几何中按 0 处理，在 tooltip 中显示为 `—`，不会额外生成点位交互。普通 hover Tooltip 与命中点保持约 12px 屏幕间距，靠近边缘时自动换向；当上下空间都不足时会选择空间更大的一侧并保持在图表内，位置更新按浏览器帧率合并，方向切换使用 120ms 缓动，避免快速移动时卡顿和突兀跳变。

雷达区域的 Tooltip 数据按区域对象缓存，指针移动按浏览器帧合并；动画 easing、Canvas presenter 和 hover 多边形只在配置、坐标或命中区域变化时更新。
