```js
chart = getChart({
  container, // 图形渲染的容器
  chartType: 'slider',
  layout?: { // 设置图形布局，可选（宽度是自适应不需要传递）
    height?: number; // 高度
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
  backgroudColor?: string; // 背景色，不传则从cs种取第一个
  rx?: number; // x 方向圆角，默认 5
  ry?: number; // y 方向圆角，默认 5
  slider?: { // 设置滑块的属性
    rx?: number; // x 方向圆角，默认 3
    ry?: number; // y 方向圆角，默认 3
    width?: number; // 设置滑块的宽度
  };
  linearGradient?: { // 渐变色，不传则用 backgroudColor
    stopColor: string;
    stopOpacity: number;
    offset: string;
  }[];
  data: {
    value: number; // 当前进度值
    start?: number; // 起始位置对应的值，默认为 0
    end: number; // 结束位置对应的值
  };
})
```
