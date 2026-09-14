import type { Quadtree } from 'd3-quadtree';
import type { ScaleBand, ScaleLinear, ScaleRadial } from 'd3-scale';
import type {
  Animate,
  BaseOptions,
  ColorSystem,
  DeepRequired,
  EventName,
  LabelsOptions,
  Layout,
  MarkOption,
  ManagedMessageChannel,
  RequiredMarkOption,
  ResizeChannel,
  TooltipOptions,
} from './common';

export type BarChartType = 'bar' | 'circleStackBar' | 'trend';

export type ExposedData = {
  x: number;
  y: number;
  index: number;
  data: BarDataset | CircleStackBarDataset;
};

export type Listeners = {
  [eventName in EventName]?: ((exposedDatas: ExposedData[]) => void)[];
};

export type BaseBarChartInstance = {
  nonce?: string;
  chartId: string;
  container: HTMLElement;
  canvas: HTMLCanvasElement;
  svg: SVGSVGElement;
  offscreenCanvas: OffscreenCanvas;
  layout: Required<Layout & { width: number }>;
  scale: number;
  listeners?: Listeners;
  tooltip?: Required<TooltipOptions>;
  cs?: ColorSystem;
  animate: Required<Animate> & { draw: () => void; progress: number };
  rid?: number;
  channel?: ResizeChannel;
  eventChannel?: ManagedMessageChannel;
  init: (container: HTMLElement, layout?: Layout) => void;
  setOption: (options: BaseOptions) => void;
  setLayout: () => void;
  render: () => void;
  dispose: () => void;
  on: {
    (eventName: EventName, event: (exposedDatas: ExposedData[]) => void): void;
  };
  resize: () => void;
};

export type BarChartInstance = {
  chartType: 'bar';
  xAxis: Required<BarXAxisOptions>;
  yAxis: DeepRequired<BarYAxisOptions>;
  xScaleFunc: ScaleBand<string>;
  yScaleFunc: ScaleLinear<number, number>;
  xIntervalData: string[];
  yIntervalData: number[];
  labels: Required<LabelsOptions> & { resize?: () => void };
  datasets: Array<Required<BarDataset>>;
  stack: boolean;
  barPos: { s: number; e: number }[][];
  bar: Required<NonNullable<BarOptions['bar']>>;
  mark: RequiredMarkOption;
  setOption: (options: BarOptions) => void;
  refreshBar: () => void;
} & BaseBarChartInstance;

// ---Bar---

export type BarDatasetWithStack = Required<BarDataset & { stackData: BarDataset['data'] }>[];

export type BarDataset = {
  label?: string;
  data: (null | undefined | number)[];
  show?: boolean;
  backgroundColor?: string;
};

export type BarOptions = {
  xAxis: BarXAxisOptions;
  yAxis: BarYAxisOptions;
  bar?: {
    maxBarWidth?: number;
    barGap?: number;
    groupGap?: number;
  };
  labels?: LabelsOptions;
  datasets: Array<BarDataset>;
  stack?: boolean;
  tooltip?: Omit<TooltipOptions, 'index'>;
  mark?: MarkOption;
} & BaseOptions;

export type BarXAxisOptions = {
  type: 'category';
  data: string[];
  ticks?: number;
  showSplitLine?: boolean;
  lineColor?: string;
  lineWidth?: number;
  lineDash?: number[];
  tickSize?: number;
  showAixsText?: boolean;
  fontColor?: string;
  fontSize?: number;
};

export type BarYAxisOptions = {
  type: 'value';
  title?: {
    text?: string;
    fontColor?: string;
    fontSize?: number;
  };
  data?: { start: number; end: number };
  interval?: number;
  ticks?: number;
  format?: string; // 使用d3的format格式化数据
  showSplitLine?: boolean;
  lineColor?: string;
  lineWidth?: number;
  lineDash?: number[];
  tickSize?: number;
  showAixsText?: boolean;
  fontColor?: string;
  fontSize?: number;
  unitText?: string;
};

// ---CircleStackBar---

export type CircleStackBarInstance = {
  chartType: 'circleStackBar';
  xAxis: Required<CircleStackBarXAxisOptions>;
  yAxis: Required<CircleStackBarYAxisOptions>;
  datasets: Array<Required<CircleStackBarDataset>>;
  innerRadius?: number;
  innerRadiusValue: number;
  outerRadius?: number;
  outerRadiusValue: number;
  textPadding: number;
  bar: Required<NonNullable<CircleStackBarOptions['bar']>>;
  xScaleFunc: ScaleBand<string>;
  yScaleFunc: ScaleRadial<number, number>;
  xIntervalData: string[];
  yIntervalData: number[];
  labels: Required<LabelsOptions> & { resize?: () => void };
  barPaths: Path2D[][];
  barGeometry: CircleBarGeometry[];
  exposedDatas?: ExposedData[];
  refreshBar: () => void;
  setOption: (options: CircleStackBarOptions) => void;
} & BaseBarChartInstance;

export type CircleStackBarDataset = BarDataset;
export type CircleBarGeometry = {
  index: number;
  slotStartAngle: number;
  slotEndAngle: number;
  startAngle: number;
  endAngle: number;
  centerAngle: number;
};

export type CircleStackBarDatasetsWithStack = Required<
  CircleStackBarDataset & {
    stackData: CircleStackBarDataset['data'];
  }
>[];

export type CircleStackBarOptions = {
  xAxis: CircleStackBarXAxisOptions;
  yAxis: CircleStackBarYAxisOptions;
  labels?: LabelsOptions;
  datasets: Array<CircleStackBarDataset>;
  innerRadius?: number;
  outerRadius?: number;
  textPadding?: number;
  bar?: {
    minWidth?: number;
    maxWidth?: number;
    gap?: number;
  };
  tooltip?: Omit<TooltipOptions, 'index'>;
} & BaseOptions;

export type CircleStackBarYAxisOptions = {
  type: 'radial';
  ticks?: number;
  lineColor?: string;
  fontColor?: string;
  lineWidth?: number;
  lineDash?: number[];
  fontSize?: number;
  interval?: number;
  data: { start: number; end: number };
};

export type CircleStackBarXAxisOptions = {
  type: 'category';
  data: string[];
  tickSize?: number;
  lineColor?: string;
  lineWidth?: number;
  lineDash?: number[];
  fontColor?: string;
  fontSize?: number;
  autoSkip?: boolean;
  maxTicks?: number;
};

// ---Trend---
export type TrendDataset = {
  label?: string;
  data: { data: null | undefined | number; label: string }[];
  show?: boolean;
  backgroundColor?: string;
  dotColor?: string;
};

export type TrendBarHitPoint = {
  x: number;
  y: number;
  index: number;
};

export type TrendBarOptions = {
  bar?: {
    maxBarWidth?: number;
    barGap?: number;
  };
  datasets: TrendDataset;
  tooltip?: Omit<TooltipOptions, 'index'>;
} & BaseOptions;
export type TrendBarInstance = {
  chartType: 'trend';
  xScaleFunc: ScaleBand<number>;
  yScaleFunc: ScaleLinear<number, number>;
  xIntervalData: number[];
  yIntervalData: number[];
  datasets: Required<TrendDataset>;
  bar: Required<NonNullable<TrendBarOptions['bar']>>;
  barPos: { s: number; e: number }[];
  barHitTree?: Quadtree<TrendBarHitPoint>;
  setOption: (options: TrendBarOptions) => void;
  refreshBar: () => void;
} & BaseBarChartInstance;
