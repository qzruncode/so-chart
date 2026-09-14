```js
chart = getChart({
  container, // 图形渲染的容器
  chartType: 'circle',
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
  radius?: [number, number], // 仪表盘的内外径，默认 [70, 90]
  startAngle?: number, // 控制仪表盘的角度，默认 -Math.PI / 2
  endAngle?: number, // 控制仪表盘的角度，默认 +Math.PI / 2
  backgroundColor?: string; // 背景色，默认 #E5EAF5
  valueBackgroundColor?: string; // 占比的背景色，默认去 cs 色系的第一个颜色
  hollow?: boolean; // 是否空心，默认 true
})
```
