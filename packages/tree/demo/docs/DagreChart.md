```js
chart = getTreeChart({
  container, // 图形渲染的容器
  chartType: 'dagre', // dagre图类型，目前有 dagre
  layout?: { // 设置图形布局，可选
    height?: number, // 高度
    top?: number, // 上边距
    right?: number, // 右边距
    bottom?: number, // 下边距
    left?: number, // 左边距
  },
  nonce?: string; // 可显式覆盖宿主提供的 CSP nonce
});

chart.setOption({
  linkType?: 'straight' | 'curve', // 设置link的连线样式，默认straight
  graph?: GraphLabel, // 参考 https://github.com/dagrejs/dagre/wiki#configuring-the-layout
  datasets: {
    nodes: {
      id: string,
      html: string, // 设置节点展示的内容
      width?: number, // 默认100
      height?: number, // 默认50
    }[],
    edges: {
      source: string, // 开始节点的id
      target: string, // 结束节点的id
      label?: string, // 线上的标题文字
      color?: string, // 线的颜色，默认black
      dash?: string, // 线的虚线样式
    }[],
  }
})
```

节点的 `html` 和 `setTooltip` 的 `html` 参数会按 HTML 插入，属于可信内容边界；如果内容来自用户输入，请先在宿主侧转义或清洗。组件卸载或重新创建前应调用 `chart.dispose()`。

## 交互

- 节点可直接拖拽，连线和标签会跟随节点更新。
- 图表空白区域可直接拖拽平移，Mac 触控板三指拖拽也可用于平移；节点区域优先拖拽节点。
- 鼠标滚轮可以缩放图形，范围为 `0.5x` 到 `4x`。
- 连线文字可以直接用鼠标拖选，不会被画布平移手势拦截。
- 触摸节点时优先执行节点拖拽，不会同时启动图形缩放，避免拖拽后出现局部线段和放大的节点残留。
- 触控设备和触控板支持不带修饰键的双指或多指 pinch 缩放，图表区域会接管触摸手势，不会再被浏览器页面缩放抢走。
