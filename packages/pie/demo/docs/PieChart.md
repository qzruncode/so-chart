```js

chart = getChart({
  container, // 图形渲染的容器
  chartType: 'pie',
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
  radius?: number, // 默认 100
  innerRadius?: number, // 默认 0
  startAngle?: number, // 默认 0
  endAngle?: number, // 默认 Math.PI*2
  shadowBlur?: number, // 默认 6
  fontSize?: number, // 默认 12
  datasets: {
    label?: string,
    labelRadius?: number, // 用于label引线端点的半径，控制引线伸出去的长度，默认为 radius*1.1
    data: null | undefined | number,
    show?: boolean, // 是否展示这条数据
    backgroundColor?: string, // 背景色，不传内部生成
  }[],
  /**
   * hoverText说明
   * 1. lead表示提示文字是通过引线画出去的
   * 2. center表示提示文字展示在圆环中间，一般绘制环形图时需要，此时需要配置innerRadius
   *  center的时候，可以配置 unit，用作单位
   *  labelFontSize，可以设置提示文字的字体大小
   *  dataFontSize，可以设置提示数据的字体大小
  */
  hoverText?: {
    type?: 'lead' | 'center';
    unit?: string;
    labelColor?: string; // label 字体颜色，默认 rgba(0, 0, 0, 0.5)
    labelFontSize?: number;
    dataFontSize?: number;
    totalText?: string; // 当用户没有hover时候展示的标题
  },
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
  tooltip?: {
    show?: boolean, // 是否展示tooltip，默认true
    formatter?: (v: number | string | Date) => typeof v, // 数据格式化函数，默认 v => v
  },
  position?: { // 设置饼图在画布中的位置，默认 x 和 y 都是center，如果要精修，可以通过 layout 设置
    x?: 'left' | 'center' | 'right';
    y?: 'top' | 'center' | 'bottom';
  };
})
```

普通 hover Tooltip 与命中点保持约 12px 屏幕间距，靠近边缘时自动换向，并按浏览器帧率合并位置更新以跟随快速移动；上下方向切换使用约 120ms 缓动。

饼图只在当前命中扇区发生变化时重绘高亮，动画 easing、Canvas presenter 和 Tooltip 内容测量会在同一实例内复用；快速移动不会重复生成相同的 Tooltip DOM。
