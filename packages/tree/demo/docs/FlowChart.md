```js
chart = getTreeChart({
  container, // 图形渲染的容器
  chartType: 'flow',
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
  nodeHeight?: number; // 节点的大小
  nodeWidth?: number;
  datasets: {
    nodes: {
      tooltipText?: string; // hover时展示的文本
      label: string; // label可以用/n自动换行，第一个元素作为标题加粗展示
      bgType?: 'linearGradient' | 'bg' | 'none'; // 背景渐变 | 纯背景 | 无背景
      x: number; // 节点坐标
      y: number;
      fontSize?: number; // 标题的文字大小
      fontColor?: string; // 字体颜色，默认 rgba(0, 0, 0, 0.5)
      rx?: number; // 矩形圆角，默认30
      ry?: number; // 矩形圆角，默认30
      bgColor?: string; // bgType='bg'时生效。设置背景颜色，默认''
      strokeColor?: string; // 设置边框颜色，默认#1976d2
    }[];

    edges: {
      type?: 'straight' | 'round' | 'poly'; // 连线的方式: 直连 | 圆弯角 | 折线带弯角
      endType?: 'arrow' | 'none'; // 终点类型: 箭头 | 无
      radius?: number; // type: 'round' | 'poly' 时有效，圆角半径
      points: number[][]; // 指定连线的起始点坐标
      roundPosition?: 'start' | 'end'; // type: 'round' 时有效，圆角位置
      poly?: {
        // type: 'poly' 时有效
        direction?: 'normal' | 'reverse';
        /**
         * intersectionPointX设置折线路径的交叉点坐标，控制多条poly如何相交
         * 默认情况下是按照 (x1 + x2) / 2 中点想交
         */
        intersectionPointX?: number;
      };
      arrow?: {
        strokeWidth?: number;
        color?: string;
      };
      label?: { // 设置线上文本
        text: string;
        pos?: 'auto' | 'manual'; // 设置标签位置，auto表示自动计算中点位置，默认auto;
        startOffset?: number; // pos='manual'时生效。用于设置标签相对于起点的期望偏移量，默认0；标签过长时会在整条真实路径上自动调整
        dir?: 'horizontal' | 'parallel'; // 标签方向，默认 parallel，沿edge路径自适应。当手动设置startOffset时生效
        fontColor?: string; // 字体颜色，默认 rgba(0, 0, 0, 0.5)
      };
    }[];
  }
})
```

### 线上文字排版

`dir: 'parallel'` 使用 SVG `textPath` 让文字沿连线排列。对于折线或圆角连线，标签会根据整条真实路径的可用窗口动态计算字体大小，必要时减少字距，但不会使用 `textLength` 拉伸字形；路径本身的圆角和方向保持不变。`dir: 'horizontal'` 仍用于明确要求水平文字的场景。

节点的单行、多行文本以及连线标签都会使用传入的 `fontColor`。需要跟随宿主主题时，可以传入宿主提供的颜色，或使用 `var(--text-color, rgba(0, 0, 0, 0.5))` 这类 CSS 颜色值。
