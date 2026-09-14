```js
chart = getChart({
  container, // 图形渲染的容器
  chartType: 'trend',
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
  bar?: {
    maxBarWidth?: number, // 柱子的最大宽度，默认25px；会根据绘图区域和数据量自适应
    barGap?: number, // 柱子间的期望间距，默认4px；数据密集时会自动压缩
  },
  datasets: {
    label?: string, // 数据的展示文本
    data: { data: null | undefined | number; label: string }[];
    backgroundColor?: string, // 柱子的背景颜色，不提供则自动生成
    dotColor?: string, // 当前选中柱子的点色，用于 tooltip。（趋势图会嵌入多种场景，用于区分）
  },
  tooltip?: {
    show?: boolean, // 是否展示tooltip，默认true
    formatter?: (v: number | string | Date) => typeof v, // 数据格式化函数，默认 v => v
  },
});
```

趋势柱状图会以每个 `scaleBand` 的带宽计算实际柱宽：`maxBarWidth` 只作为上限，`barGap` 不会在数据密集时把柱子压缩成不可见的细线。hover 命中使用 D3 的 `quadtree.find` 在当前带宽范围内查找最近柱位，因此鼠标经过柱子之间的像素间隙时 Tooltip 不会反复隐藏和显示；普通 Tooltip 与命中点保持约 12px 屏幕间距，靠近边缘时自动换向，并按浏览器帧率合并位置更新以跟随快速移动；上下方向切换使用约 120ms 缓动。
