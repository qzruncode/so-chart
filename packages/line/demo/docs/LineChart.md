```js
chart = getChart({
  container, // 图形渲染的容器
  chartType: 'line',
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
  xAxis: {
    /**
     * type为 'mapping'，则data只能传入string[]，此时x轴的比例尺就是线性一对一的关系。
     *  用于x轴坐标系是字符串的情况。
     *  此时必须确保data中的数据个数和datasets中的数据个数一致，否则无法确立一一对应关系导致代码报错
     * type为 'date'，data可以传入 { start: Date, end: Date } ｜ Date[]。
     *  用于x轴坐标系是Date的情况
     * type为 'value'，data可以传入 { start: number, end: number } ｜ number[]。
     *  用于x轴坐标系是number的情况
    */
    type: 'date' | 'value' | 'mapping',
    /** data说明
     * 1. 如果传入的是对象，设置start和end可以动态控制图形在坐标系中的高度。
     *    由于数据需要和坐标系的点进行一一对应，所以内部会存在一个intervalData数组
     *    此时指定interval，会根据start和end动态生成一个intervalData，控制坐标系粒度
     * 2. 如果传入的数组，表明是用户指定坐标系的点。
     *    此时内部的intervalData就是此数组，interval此时无效
    */
    data: { start: number, end: number } | { start: Date, end: Date } | number[] | Date[] | string[],
    interval?: number, // 默认 1000
    /**
     * format说明
     * 1. 如果type为 'mapping'，format默认值为 ''
     * 2. 如果type为 'date'，format默认值为 '%H:%M:%S'
     * 3. 如果type为 'value'，format默认值为 '~s'。比如 "1500" 会自动转化成 "1.5k"
    */
    format?: string, // 使用 https://d3js.org/d3-format 格式化数据
    ticks?: number, // 展示的坐标系tick个数，只是一个hint，会自动生成合适的个数（type不是'mapping'，默认5）
    lineColor?: string, // 线条颜色，默认 rgba(0, 0, 0, 0.1)
    lineWidth?: number, // 线条宽度，默认 1
    lineDash?: number[], // 虚线样式，默认 [3, 3]
    tickSize?: number, // tick线的长度（超出坐标系的那段线条），默认6
    fontColor?: string, // 字体颜色，默认 rgba(0, 0, 0, 0.5)
    fontSize?: number, // 字体大小，默认 12
    showAixsText?: boolean, // 是否展示坐标系文字，默认 true
    showSplitLine?: boolean, // 是否展示坐标系线条，默认 true
  },
  yAxis: {
    type: 'value',
    data?: { start: number, end: number } | Array<number>, // 不传，根据数据自动计算
    format?: string, // 使用d3的format格式化数据，默认 '~s'
    unitText?: string, // 坐标系单位，默认 ''
    title?: {
      text?: string, // 坐标系小标题，默认 ''
      fontColor?: string,
      fontSize?: number,
    };
    interval?: number, // 默认1000
    // 以下配置参考xAxis
    ticks?: number,
    lineColor?: string,
    lineWidth?: number,
    lineDash?: number[],
    tickSize?: number,
    fontColor?: string,
    fontSize?: number,
    showAixsText?: boolean,
    showSplitLine?: boolean,
  },
  datasets: {
    label?: string,
    data: (null | undefined | number)[],
    /**
     * missing说明
     * 1. miss 表示缺失的数据不做任何处理，空着
     * 2. straight 表示缺失的数据直线链接
     *  此时missingType指定为 dotted 会使用 lineDash 配置进行虚线绘制；solid 表示实线绘制
     * 3. zero 表示跌零处理
    */
    missing?: 'miss' | 'straight' | 'zero',
    missingType?: 'dotted' | 'solid',
    dotSize?: number, // 线条拐角的点的大小，默认 2
    lineDash?: number[], // 模拟连接线的虚线样式，默认 [1, 3]
    lineWidth?: number, // 线条宽度，默认 1
    lineColor?: string, // 线条颜色，不提供则自动生成
    show?: boolean, // 是否展示这条数据，默认 true
  }[],
  showPoint?: boolean, // 是否展示线条拐角的点
  voronoi?: boolean, // 当线条很多时，开启此配置，hover线条可以展示对应的label
  stack?: boolean, // 是否堆叠图
  area?: boolean, // 是否面积图
  smooth?: boolean, // 是否平滑曲线
  labels?: {
    show?: boolean, // 默认true，是否展示
    data?: string[], // 如果指定，则其中的数据必须根datasets中索引保持一致
    type?: 'circle' | 'rect' | 'path', // 设置label的样式，默认circle。如果指定为path，则需要提供path参数
    path?: string, // 任意一段path路径
    orient?: 'vertical' | 'horizontal' | 'flex', // label是水平排列 | 垂直排列 | 自动换行
    position?: 'top' | 'left' | 'right' | 'bottom' | 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight', // 默认bottom
    fontColor?: string, // 默认 rgba(0, 0, 0, 0.5)
    fontSize?: number, // 默认 12
    maxHeight?: number, // 最大高度，默认 100
    dataMap?: { [label: string]: string }, // 有的需求需要将原始的data中的数据，转化成其他形式。 dataMap提供 data中的数据 和 额外需要展示文本的 映射
    // 以下extra开头的配置都是设置dataMap中需要展示数据的样式
    extraTextType?: 'vertical' | 'horizontal', // 默认 horizontal
    extraTextColor?: string, // 默认 rgba(0, 0, 0, 0.5)
    extraTextSize?: number, // 默认 12
    /** 一个配置例子
      data: ['服务调用', '算力资源', '存储资源'],
      dataMap: {
        服务调用: '服务调用额外的文本',
      },
      extraTextType: 'vertical',
      extraTextColor: '#2D364D',
    */
  },
  cross?: {
    showXLine?: boolean, // 是否展示水平线，默认 true
    showYLine?: boolean, // 是否展示垂直线，默认 true
    showHint?: boolean, // 是否展示提示文字，默认 true
    hintSize?: number, // 提示文字大小，默认 10
    lineColor?: string, // 水平线和垂直线的颜色，默认 red
    lineWidth?: number, // 水平线和垂直线的宽度，默认 1
    lineDash?: number[], // 水平线和垂直线的虚线样式，默认 [3, 3]
    showDots?: boolean, // 是否展示选中的点，默认 true
    voronoiColor?: string; // voronoi选中的字体颜色，默认 rgba(0, 0, 0, 0.5)
  },
  tooltip?: {
    show?: boolean, // 是否展示tooltip，默认 true
    formatter?: (v: number | string | Date) => typeof v, // 数据格式化函数，默认 v => v
    index?: number, // 设置tooltip默认展示的数据索引，默认 -1
    fixed?: boolean; // 是否固定tooltip位置，目前只支持固定在右上角，后续可以拓展
    drag?: boolean; // 是否可以拖拽tooltip
    extra?: {
      text?: string; // 额外的点击按钮，如 “详情“
      func?: (index: number) => void; // 传入点击函数，参数为点击的索引
    };
  },
  /**
   * 指定标记位，可选水平、垂直线或者点标记
   * mark传入数组
   *  type为line时，传入x坐标为垂直线，传入y坐标为水平线
   *    此时可以配置lineColor、lineWidth、lineDash
   *  type为point时，传入x坐标和y坐标
   *    此时可以配置dotType、dotSize、dotColor
   *  共同配置
   *    message：用于用户将自定义渲染内容到hover的提示框中
   *    click：当提示框内容太多，无法展示时，可以配置click，点击线条触发自定义的其他展示形式
  */
  mark?: (
    (({
      type: 'line';
      x: number | Date
    } | {
      type: 'line';
      y: number
    }) & {
      lineColor?: string;
      lineWidth?: number;
      lineDash?: number[];
    }) |
    ({
      type: 'point';
      x: number | Date;
      y: number;
    } & {
      dotType?: 'fill' | 'stroke';
      dotSize?: number;
      dotColor?: string;
    })
    & { message?: (container: HTMLDivElement) => void; click?: () => void })[]
})
```

### 固定 Tooltip 拖拽

将 `tooltip.fixed` 和 `tooltip.drag` 都设置为 `true` 时，Tooltip 会固定在图表右上角，并可从 Tooltip 内容区域拖动到图表内的其他位置。开启拖拽后，Tooltip 自身会接收鼠标或触摸事件；普通 hover Tooltip 仍会穿透鼠标事件，不会遮挡图表交互。

普通 hover Tooltip 与命中点保持约 12px 屏幕间距，靠近边缘时自动换向，并按浏览器帧率合并位置更新以跟随快速移动；上下方向切换使用约 120ms 缓动。

### 动画与高频交互

动画帧会复用未变化的折线几何、Voronoi 命中区域和 Canvas presenter；鼠标移动只处理每个浏览器帧内的最新位置，Tooltip 的 HTML、样式和监听器也只在数据或配置变化时更新。上述优化没有新增配置项，`chart.dispose()` 会释放相关帧和监听资源。

### 宿主主题切换

预览示例会在宿主主题属性变化后重新读取图表容器上的 CSS 变量，再重绘坐标轴和交互线颜色。宿主可以提供 `--text-secondary-color` 和 `--chart-crossline-color`，不要把主题颜色缓存到模块级配置对象中。

### TypeScript 类型

图表包入口直接导出折线图的公开类型，业务代码可以让示例和实际配置共享同一份契约：

```ts
import getLineChart, { type LineOptions } from '@so-chart/line';

const options: LineOptions = {
  datasets: [],
};

const chart = getLineChart({ container, chartType: 'line' });
chart.setOption(options);
```

跨图表复用类型时仍可从 `@so-chart/types/line` 导入；类型包只提供声明，不注入运行时代码。折线实例公开的 scale 类型按需解析 `@types/d3-scale`，不会额外引入完整的 `@types/d3` 聚合类型包。
