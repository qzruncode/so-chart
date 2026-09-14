```js
chart = getChart({
  container, // 图形渲染的容器
  chartType: 'guage',
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
  datasets: {
    data: null | undefined | number,
    show?: boolean, // 是否展示这条数据
    backgroundColor?: string, // 背景色
  }[],
  value: number, // 仪表盘当前值
  outerRadius: [number, number], // 仪表盘的内外径，默认 [100, 110]
  innerRadius: [number, number], // 值展示的内外径，默认 [70, 90]
  fontSize?: number, // 12
  fontColor?: string; // 字体颜色，默认 rgba(0, 0, 0, 0.5)
  startAngle?: number, // 控制仪表盘的角度，默认 -Math.PI / 2
  endAngle?: number, // 控制仪表盘的角度，默认 +Math.PI / 2
})
```

图表实例属于命令式资源，组件卸载或重新创建前应调用 `chart.dispose()`；示例会在主题重绘和卸载时释放旧实例。

仪表盘 Tooltip 内容和尺寸会在同一实例内缓存，鼠标移动只更新位置帧；动画 easing、Canvas presenter 和 ResizeObserver 也会在实例生命周期内复用，销毁时统一释放。
