```js
chart = getChart({
  container, // 图形渲染的容器
  chartType: 'single',
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
  value: number, // 仪表盘当前占比 (0 - 1)
  showText?: string, // 中间展示的文本
  radius?: [number, number], // 仪表盘的内外径，默认 [70, 90]
  cornerRadius?: number; // 圆角弧度，默认 5
  fontSize?: number, // 默认 12
  fontColor?: string; // 字体颜色，默认 rgba(0, 0, 0, 0.5)
  startAngle?: number, // 控制仪表盘的角度，默认 -Math.PI / 2
  endAngle?: number, // 控制仪表盘的角度，默认 +Math.PI / 2
  backgroundColor?: string; // 背景色，默认 #E5EAF5
  valueBackgroundColor?: string; // 占比的背景色，默认去 cs 色系的第一个颜色
  tick?: {
    show?: boolean; // 是否展示 tick，默认 false
    tickSize?: number; // tick长度，默认 5
    steps?: number; // 一共展示几个刻度，默认 7
    lineWidth?: number; // tick的线宽，默认 1
    lineColor?: string; // tick的颜色，默认 black
  };
  tooltip?: () => string; // 返回可信 HTML；用户输入需先转义或清洗
})
```

仪表盘 Tooltip 与鼠标保持约 12px 屏幕间距，靠近容器边缘时自动换向，并按浏览器帧率合并位置更新，避免高频移动时卡顿。默认样式包含内边距、边框、背景色和阴影；自定义 HTML 仍可继续扩展内容。
