export type ColorSystem =
  | 'blue'
  | 'red'
  | 'gold'
  | 'green'
  | 'orange'
  | 'pink'
  | 'violet'
  | 'purple'
  | 'gray'
  | 'cyan'
  | 'tangerine'
  | 'lightblue'
  | 'slate'
  | 'yellow'
  | 'bluegray'
  | 'grassgreen';

export type Layout = {
  height?: number;
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
  // width 由容器的宽度自适应
};

export type ManagedMessageChannel = MessageChannel & {
  cleanup: () => void;
};

export type ResizeChannel = ManagedMessageChannel;

export type CrossOptions = {
  showXLine?: boolean; // 是否展示水平线
  showYLine?: boolean; // 是否展示垂直线
  showHint?: boolean; // 是否展示提示文字
  hintSize?: number; // 提示文字大小
  lineColor?: string; // 水平线和垂直线的颜色
  lineWidth?: number; // 水平线和垂直线的宽度
  lineDash?: number[]; // 水平线和垂直线的虚线样式
  showDots?: boolean; // 是否展示选中的点
  voronoiColor?: string; // voronoi选中的字体颜色，默认 rgba(0, 0, 0, 0.5)
};

export type Animate = {
  ease?: 'linear' | 'cubicIn' | 'cubicOut' | 'cubicInOut' | 'bounceIn' | 'bounceOut' | 'bounceInOut';
  duration?: number;
  switch?: 'on' | 'off';
};

export type BaseOptions = {
  className?: string;
  style?: { [name: string]: number | string };
  cs?: ColorSystem; // color system
  animate?: Animate;
};

export type TooltipOptions = {
  show?: boolean;
  formatter?: (v: number | string | Date) => typeof v;
  index?: number; // 设置tooltip默认展示的数据索引
  fixed?: boolean; // 是否固定tooltip位置，目前只支持固定在右上角，后续可以拓展
  drag?: boolean; // 是否可以拖拽tooltip
  extra?: {
    text?: string;
    func?: (index: number) => void;
  };
};

export type MarkOption = ((
  | (({ type: 'line'; x: number | Date } | { type: 'line'; y: number }) & {
      lineColor?: string;
      lineWidth?: number;
      lineDash?: number[];
    })
  | ({
      type: 'point';
      x: number | Date;
      y: number;
    } & {
      dotType?: 'fill' | 'stroke';
      dotSize?: number;
      dotColor?: string;
    })
) & { message?: (container: HTMLDivElement) => void; click?: () => void })[];

export type RequiredMarkOption = ((
  | (({ type: 'line'; x: number | Date } | { type: 'line'; y: number }) & {
      lineColor: string;
      lineWidth: number;
      lineDash: number[];
    })
  | ({
      type: 'point';
      x: number | Date;
      y: number;
    } & {
      dotType: 'fill' | 'stroke';
      dotSize: number;
      dotColor: string;
    })
) & { message?: (container: HTMLDivElement) => void; click?: () => void })[];

export type LabelsOptions = {
  show?: boolean;
  selectionMode?: 'single' | 'multiple';
  data?: string[];
  type?: 'circle' | 'rect' | 'path';
  path?: string;
  orient?: 'vertical' | 'horizontal' | 'flex';
  position?: 'top' | 'left' | 'right' | 'bottom' | 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';
  dataMap?: { [label: string]: string }; // data中的label 和 额外需要展示文本的 映射
  extraTextType?: 'vertical' | 'horizontal';
  extraTextColor?: string;
  extraTextSize?: number;
  fontColor?: string;
  fontSize?: number;
  maxHeight?: number; // 最大高度
};

export type MouseEventName = 'touchstart' | 'touchmove' | 'touchend' | 'mouseenter' | 'mousemove' | 'mouseleave';
export type ClickEventName = 'click' | 'dblclick';
export type EventName = MouseEventName | ClickEventName;

export type DeepRequired<T> = T extends object ? { [P in keyof T]-?: DeepRequired<T[P]> } : T;
