```js
chart = getChart({
  container, // 图形渲染的容器
  chartType: 'point',
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
    /**
     * type为 'mapping'，则data只能传入string[]，此时x轴的比例尺就是线性一对一的关系。用于x轴坐标系是字符串的情况
     * type为 'date'，data可以传入 { start: Date, end: Date } ｜ Date[]。用于x轴坐标系是Date的情况
     * type为 'value'，data可以传入 { start: number, end: number } ｜ number[]。用于x轴坐标系是number的情况
     *
    */
    type: 'date' | 'value' | 'mapping',
    /** data说明
     * 1. 如果传入的是对象，设置start和end可以动态控制图形在坐标系中的高度。
     *    由于数据需要和坐标系的点进行一一对应，所以内部会存在一个intervalData数组
     *    此时指定interval，会根据start和end动态生成一个intervalData，控制坐标系粒度
     * 2. 如果传入的数组，表明是用户指定坐标系的点。
     *    此时内部的intervalData就是此数组，interval此时无效
    */
    data: { start: number, end: number } | { start: Date, end: Date } | number[] | Date[] | string[],
    interval?: number, // 默认 1000
    /**
     * format说明
     * 1. 如果type为 'mapping'，format默认值为 ''
     * 2. 如果type为 'date'，format默认值为 '%H:%M:%S'
     * 3. 如果type为 'value'，format默认值为 '~s'。比如 "1500" 会自动转化成 "1.5k"
    */
    format?: string, // 使用 https://d3js.org/d3-format 格式化数据
    ticks?: number, // 展示的坐标系tick个数，只是一个hint，会自动生成合适的个数（type不是'mapping'，默认5）
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
    data?: { start: number, end: number } | Array<number>, // 不传，根据数据自动计算
    format?: string, // 使用d3的format格式化数据，默认 '~s'
    unitText?: string, // 坐标系单位，默认 ''
    interval?: number, // 默认1000
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
  datasets: {
    label?: string,
    data: (null | undefined | number)[],
    dotType?: 'fill' | 'stroke', // 点是实心的(fill)还是空心的(stroke)，如果是空心的设置 lineWidth 控制描边线条宽度
    dotColor?: string, // 点的颜色
    dotSize?: number, // 线条拐角的点的大小，默认 2
    lineWidth?: number, // 线条宽度，默认 1
    show?: boolean, // 是否展示这条数据，默认 true
  }[],
  labels?: {
    show?: boolean, // 默认true，是否展示
    data?: string[], // 如果指定，则其中的数据必须根datasets中索引保持一致
    type?: 'circle' | 'rect' | 'path', // 设置label的样式，默认circle。如果指定为path，则需要提供path参数
    path?: string, // 任意一段path路径
    orient?: 'vertical' | 'horizontal' | 'flex', // label是水平排列 | 垂直排列 | 自动换行
    position?: 'top' | 'left' | 'right' | 'bottom' | 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight', // 默认bottom
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
  cross?: {
    showXLine?: boolean, // 是否展示水平线，默认 true
    showYLine?: boolean, // 是否展示垂直线，默认 true
    showHint?: boolean, // 是否展示提示文字，默认 true
    hintSize?: number, // 提示文字大小，默认 10
    lineColor?: string, // 水平线和垂直线的颜色，默认 red
    lineWidth?: number, // 水平线和垂直线的宽度，默认 1
    lineDash?: number[], // 水平线和垂直线的虚线样式，默认 [3, 3]
    showDots?: boolean, // 是否展示选中的点，默认 true
  },
  tooltip?: {
    show?: boolean, // 是否展示tooltip，默认 true
    formatter?: (v: number | string | Date) => typeof v, // 数据格式化函数，默认 v => v
  },
})
```

普通 hover Tooltip 与命中点保持约 12px 屏幕间距，靠近边缘时自动换向，并按浏览器帧率合并位置更新以跟随快速移动；上下方向切换使用约 120ms 缓动。

点图的指针移动按浏览器帧合并，只保留当前帧最新位置；动画 easing、Canvas presenter 和 Tooltip 内容测量按图表实例缓存，避免快速移动时重复执行相同工作。
