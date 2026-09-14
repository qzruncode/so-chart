```js
chart = getChart({
  container, // 图形渲染的容器
  chartType: 'bar',
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
  stack?: boolean, // 是否堆叠，默认false
  xAxis: {
    type: 'category',
    data: string[],
    ticks?: number, // 展示的坐标系tick个数，只是一个hint，会自动生成合适的个数（默认5）。边界处理 max(ticks,data.length)
    lineColor?: string, // 线条颜色，默认 rgba(0, 0, 0, 0.1)
    lineWidth?: number, // 线条宽度，默认 1
    lineDash?: number[], // 虚线样式，默认 [3, 3]
    tickSize?: number, // tick线的长度（超出坐标系的那段线条），默认6
    fontColor?: string, // 字体颜色，默认 rgba(0, 0, 0, 0.5)
    fontSize?: number, // 字体大小，默认 12
    showAixsText?: boolean, // 是否展示坐标系文字，默认 true
    showSplitLine?: boolean, // 是否展示坐标系线条，默认 true
  },
  yAxis: {
    type: 'value',
    data?: { start: number; end: number }, // 设置start和end可以动态控制图形在坐标系中的高度。不传，根据数据自动计算
    interval?: number, // 默认100
    format?: string, // 使用 https://d3js.org/d3-format 格式化数据，默认 '~s'。 比如 "1500" 会自动转化成 "1.5k"
    unitText?: string, // 坐标系单位，默认 ''
    title?: {
      text?: string, // 坐标系小标题，默认 ''
      fontColor?: string,
      fontSize?: number,
    };
    // 以下配置参考xAxis
    ticks?: number,
    lineColor?: string,
    lineWidth?: number,
    lineDash?: number[],
    tickSize?: number,
    fontColor?: string,
    fontSize?: number,
    showAixsText?: boolean,
    showSplitLine?: boolean,
  },
  bar?: {
    maxBarWidth?: number, // 指定柱子的最大就宽度，默认25。内部会根据绘图区域自动缩放
    barGap?: number, // 柱子跟柱子之间的距离，默认4
    groupGap?: number, // 分组之间的距离，默认4
  },
  datasets: Array<{
    label?: string, // 数据的展示文本
    data: (null | undefined | number)[],
    show?: boolean, // 是否展示这条数据，默认true
    backgroundColor?: string, // 柱子的背景颜色，不提供则自动生成
  }>,
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
  /**
   * 指定标记位，可选水平、垂直线或者点标记
   * mark传入数组
   *  type为line时，传入x坐标为垂直线，传入y坐标为水平线
   *    此时可以配置lineColor、lineWidth、lineDash
   *  type为point时，传入x坐标和y坐标
   *    此时可以配置dotType、dotSize、dotColor
   *  共同配置
   *    message：用于用户将自定义渲染内容到hover的提示框中
   *    click：当提示框内容太多，无法展示时，可以配置click，点击线条触发自定义的其他展示形式
  */
  mark?: (
    (({
      type: 'line';
      x: number | Date
    } | {
      type: 'line';
      y: number
    }) & {
      lineColor?: string;
      lineWidth?: number;
      lineDash?: number[];
    }) |
    ({
      type: 'point';
      x: number | Date;
      y: number;
    } & {
      dotType?: 'fill' | 'stroke';
      dotSize?: number;
      dotColor?: string;
    })
    & { message?: (container: HTMLDivElement) => void; click?: () => void })[]
});
```

### 分组柱状图 hover

基础分组柱状图会在每个 x 轴分组的柱间空白区域命中最近的柱位，因此鼠标从一组 bar 移向另一组 bar 时，组间短暂经过的空白不会让 Tooltip 闪烁或隐藏；离开图表区域后 Tooltip 才会隐藏。普通 hover Tooltip 会与命中点保留约 12px 的屏幕间距，靠近边缘时自动切换到可用方向，并按浏览器帧率合并位置更新以跟随鼠标；上下方向切换使用约 120ms 缓动。

动画过程会复用 easing、Canvas presenter 和分组命中几何；柱间 hover 的高频事件按浏览器帧合并，只有命中柱发生变化时才重绘高亮。业务侧无需调整配置，销毁图表时会释放 ResizeObserver、事件通道和动画帧。
