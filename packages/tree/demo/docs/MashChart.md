```js
chart = getTreeChart({
  container, // 图形渲染的容器
  chartType: 'mash',
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
  datasets: {
    nodes: {
      tooltipText?: string; // hover时展示的文本
      label?: string; // 节点的标题
      labelColor?: string; // 标题文字颜色，默认#000
      fontSize?: number; // 标题的文字大小
      bgType?: 'bg' | 'none'; // 是否应用背景色
      bgColor?: string; // 背景色
      x: number; // 节点坐标
      y: number;
      type: 'rect' | 'circularFlow'; // 节点类型，当type为'rect'，可以配置rect属性；当type为'circularFlow'，可以配置circularFlow属性
      width?: number; // 节点大小
      height?: number;
      rect?: {
        // 节点的圆角大小
        rx?: number; // 默认为 height / 2
        ry?: number; // 默认为 height / 2
      };
      circularFlow?: {
        innerRadius?: number; // 配置环形的内径
        outerRadius?: number; // 配置环形的外径
        arrowHeight?: number; // 配置箭头定点到底部的高度
        arrowWidth?: number; // 默认为 (outerRadius - innerRadius) + 30
        data: { // 流程图圆环的数据集合
          label?: string;  // 标题
          fontSize?: number; // 字体大小
          backgroundColor?: string; // 背景色
          tooltipText?: string; // hover时展示的文本
        }[];
      }[];
    }

    edges: {
      type?: 'straight' | 'round' | 'poly'; // 连线的方式: 直连 | 圆弯角 | 折线带弯角
      endType?: 'arrow' | 'none'; // 终点类型: 箭头 | 无。当endType为'arrow'可以配置arrow属性；当endType为'poly'可以配置poly属性
      arrow?: {
        strokeWidth?: number; // 箭头线的宽度
        color?: string; // 箭头的颜色
      };
      poly?: {
        // normal情况下，折线都是由父元素引出来，连接到子元素
        // 也可以设置为reverse，由子元素引出来，连接到父元素
        direction?: 'normal' | 'reverse';
        /**
         * intersectionPointX设置折线路径的交叉点坐标，控制多条poly如何相交
         * 默认情况下是按照 (x1 + x2) / 2 中点想交
         */
        intersectionPointX?: number;
      };
      radius?: number; // 圆角半径。type: 'round' | 'poly' 时有效
      points: number[][]; // 指定连线的起始点坐标
    }[];
  }
})
```
