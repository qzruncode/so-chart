```js
chart = getChart({
  container, // 图形渲染的容器
  chartType: 'progress',
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
  data: {
    value: number; // 当前进度值
    start?: number; // 起始位置对应的值，默认为 0
    end: number; // 结束位置对应的值
  };
})
```

图表实例属于命令式资源，组件卸载或重新创建前应调用 `chart.dispose()`；示例会在主题重绘和卸载时释放旧实例。

进度图动画只保留一个活动的 requestAnimationFrame，并缓存 easing 函数；动画完成后不会继续提交空帧，销毁时会取消未完成的动画和 ResizeObserver。
