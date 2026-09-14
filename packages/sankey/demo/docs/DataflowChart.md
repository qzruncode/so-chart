```js
chart = getSankeyChart({
  container, // 图形渲染的容器
  chartType: 'dataflow', // 桑基图类型，目前有 dataflow
  layout?: { // 设置图形布局，可选
    height?: number; // 高度
    top?: number; // 上边距
    right?: number; // 右边距
    bottom?: number; // 下边距
    left?: number; // 左边距
  },
  nonce?: string; // 可显式覆盖宿主提供的 CSP nonce
});

chart.setOption({
  cs?: 'pink', // 色系，使用项目内置色板
  animate?: { // 设置出场动画
    ease?: 'linear' | 'cubicIn' | 'cubicOut' | 'cubicInOut' | 'bounceIn' | 'bounceOut' | 'bounceInOut', // 默认 linear
    duration?: number, // 动画持续时间，默认 300 ms
    switch?: 'on' | 'off', // 是否应用动画，默认 on
  },
  style?: { // 图形样式，可选
    nodeWidth?: number; // 节点宽度，默认 30
    nodePadding?: number; // 节点之间的最小距离，默认 20
    fontSize?: number; // 字体大小，默认 10
    fontColor?: string; // 字体颜色，默认 rgba(0, 0, 0, 0.5)
    textMargin?: number; // 文字距离节点左边距，默认 6
    linkHoverColor?: string; // band 悬停颜色，默认 #2a72dc
    linkHoverOpacity?: number; // band 悬停透明度，默认 0.35
    linkHoverWidth?: number; // band 悬停时的最小宽度，默认 2.5
    linkHoverHitWidth?: number; // band 悬停命中区域宽度，默认 14
  }
  datasets: {
    nodes: { name: string; color?: string }[],
    links: { source: number; target: number; value: number; color?: string }[]
    // 其中 source 和 target 为 nodes 中的索引
  },
});
```

`style.fontColor` 和 `style.linkHoverColor` 应在宿主主题变化时重新提供；预览示例会从当前图表容器读取主题变量，避免数据流图继续使用切换前的颜色。

实例提供 `dispose()`；组件卸载或主题重绘前应调用 `dispose()`，以清理链接 hover 监听和 SVG 过渡。
