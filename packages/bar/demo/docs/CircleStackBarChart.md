```js
chart = getChart({
  container, // 图形渲染的容器
  chartType: 'circleStackBar',
  layout?: { // 设置图形布局，可选（宽度是自适应不需要传递）
    height?: number; // 高度
    top?: number; // 上边距
    right?: number; // 右边距
    bottom?: number; // 下边距
    left?: number; // 左边距
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
    type: 'category',
    data: string[],
    tickSize?: number, // tick线的长度（超出坐标系的那段线条），默认6
    lineColor?: string, // 线条颜色，默认 rgba(0, 0, 0, 0.1)
    lineWidth?: number, // 线条宽度，默认 1
    lineDash?: number[], // 虚线样式，默认 [3, 3]
    fontColor?: string, // 字体颜色，默认 rgba(0, 0, 0, 0.5)
    fontSize?: number, // 字体大小，默认 12
    autoSkip?: boolean, // 是否自动减少密集标签，默认 true
    maxTicks?: number, // 自动降密时最多展示的标签数量，默认 12
  },
  yAxis: {
    type: 'radial',
    data: { start: number; end: number }, // 设置start和end可以动态控制图形在坐标系中的高度。
    interval?: number, // 默认100
    ticks?: number, // 展示的坐标系tick个数，只是一个hint，会自动生成合适的个数（默认5）。
    // 以下配置参考xAxis
    lineColor?: string,
    lineWidth?: number,
    lineDash?: number[],
    fontColor?: string,
    fontSize?: number,
  },
  datasets: Array<{
    label?: string, // 数据的展示文本
    data: (null | undefined | number)[],
    show?: boolean, // 是否展示这条数据，默认true
    backgroundColor?: string, // 柱子的背景颜色，不提供则自动生成
  }>,
  innerRadius?: number, // 内圈半径，单位 px；不传则根据容器自动计算，过大时会被限制
  outerRadius?: number, // 外圈半径，单位 px；不传则根据容器自动计算，超出容器时会被限制
  textPadding?: number, // 坐标轴文字距离，默认值 10
  bar?: {
    minWidth?: number, // 柱子的最小切线宽度，单位 px，默认 2
    maxWidth?: number, // 柱子的最大切线宽度，单位 px，默认 24
    gap?: number, // 柱子之间的期望间距，单位 px，默认 2；数据密集时自动压缩
  },
  labels?: {
    show?: boolean, // 默认true，是否展示
    data: string[], // 如果指定，则其中的数据必须根datasets中索引保持一致
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
  tooltip?: {
    show?: boolean, // 是否展示tooltip，默认true
    formatter?: (v: number | string | Date) => typeof v, // 数据格式化函数，默认 v => v
  },
});
```

环形堆叠柱状图会根据容器的可用半径自动计算内外圈，并根据 `scaleBand` 的角度分带和中线半径计算柱子的实际切线宽度。`innerRadius` 和 `outerRadius` 仍可显式覆盖；未传入的半径会随 resize 重新计算。x 轴标签默认自动降密，Tooltip 使用与绘制相同的柱区间命中，避免柱间空隙造成错误命中；普通 hover Tooltip 与命中点保持约 12px 屏幕间距，靠近边缘时自动换向，并按浏览器帧率合并位置更新以跟随快速移动；上下方向切换使用约 120ms 缓动。
