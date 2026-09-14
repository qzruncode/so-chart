```js
chart = getCalendarChart({
  container, // 图形渲染的容器
  chartType: 'heatmap', // 日历图类型，目前有 heatmap
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
  year?: {
    /**
     * type 设置年的展示形式
     *  multipleLines表示按年分行展示
     *  oneLine表示一行展示
     * showTitle 设置是否展示年份的标题
    */
    type?: 'multipleLines' | 'oneLine', // 默认 multipleLines
    showTitle?: boolean, // 默认 true
    fontColor?: string, // 默认 rgba(0, 0, 0)
    fontSize?: number, // 默认 14
    text?: string, // 展示年的文字，默认为中文的 年
  };
  week?: {
    fontColor?: string,
    fontSize?: number,
    data?: string[], // 自定义周文字，默认中文，例如 周日、周一
  };
  month?: {
    fontColor?: string,
    fontSize?: number,
    data?: string[], // 自定义月文字，默认中文，例如 一月、二月
  },
  cell?: {
    /**
     * size 设置单元大小，
     * cellPadding 设置单元之间的间隔
     * monthPadding 设置月份之间的间隔
     * weightType 设置权重颜色方式
     *  color 表示按照不同颜色表示权重，可搭配 colors 自定义
     *  opacity 表示按照不同透明度表示权重，可搭配 opacityColor 自定义
    */
    size?: number, // 默认 12
    cellPadding?: number, // 默认 4
    monthPadding?: number, // 默认 10
    weightType?: 'color' | 'opacity', // 默认 color
    colors?: string[], // 内置默认颜色数组
    opacityColor?: string, // 内置默认颜色
  };
  rangeData: {
    start: Date, // 设置日历开始日期，会自动转化此月第一天
    end: Date, // 设置日历开始日期，会自动转化此月最后一天
  },
  datasets: {
    date: Date,
    data: number | undefined | null,
  }[],
  tooltip?: (data: { date: string; data: number }) => string, // 返回可信 HTML 字符串，用户输入需先转义或清洗
});
```

### 日期方块交互

日历中的每个日期方块都支持 hover 反馈。每个方块有略大于视觉尺寸的透明命中区，鼠标移入时由独立的 hover 标记平滑跟随当前日期方块，避免小方块导致鼠标样式跳动；如果配置了 `tooltip`，对应日期的数据提示会同步跟随当前方块，与命中点保持 12px 屏幕间距，靠近边缘时自动换向，并使用 40ms 短过渡。触控设备点按方块时也会使用同样的高亮反馈。

预览站的多行示例使用 `CalendarTooltip` React 组件，并通过 `renderToStaticMarkup` 转成 tooltip 所需的 HTML，适合用作自定义日期数据卡的参考。

实例提供 `dispose()`；组件卸载或主题重绘前应调用 `dispose()`，示例已覆盖该生命周期。
