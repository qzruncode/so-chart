import type { ScaleLinear, ScaleTime } from 'd3-scale';
import type {
  Layout,
  TooltipOptions,
  ColorSystem,
  Animate,
  MouseEventName,
  ClickEventName,
  LabelsOptions,
  CrossOptions,
  BaseOptions,
  EventName,
  ManagedMessageChannel,
  ResizeChannel,
} from './common';

export type PointChartType = 'point';

export type ExposedData = {
  x: number;
  y: number;
  index: number;
  data: PointDataset;
};

export type Listeners = {
  [eventName in EventName]?: ((exposedDatas: ExposedData[]) => void)[];
};

export type BasePointChartInstance = {
  nonce?: string;
  chartId: string;
  chartType: PointChartType;
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
    (eventName: MouseEventName | ClickEventName, event: (exposedDatas: ExposedData[]) => void): void;
  };
  resize: () => void;
};

export type PointChartInstance = {
  xAxis: Required<PointXAxisOptions>;
  yAxis: Required<PointYAxisOptions>;
  xScaleFunc: ScaleTime<Date, number> | ScaleLinear<number, number>;
  yScaleFunc: ScaleLinear<number, number>;
  xIntervalData: number[] | Date[];
  yIntervalData: number[] | Date[];
  labels: Required<LabelsOptions> & { resize?: () => void };
  datasets: Array<Required<PointDataset>>;
  cross: Required<CrossOptions>;
  setOption: (options: PointOptions) => void;
  refreshDots: () => void;
} & BasePointChartInstance;

export type PointDataset = {
  label?: string;
  data: (null | undefined | number)[];
  dotType?: 'fill' | 'stroke';
  dotSize?: number;
  dotColor?: string;
  lineWidth?: number;
  show?: boolean;
};

export type PointOptions = {
  xAxis: PointXAxisOptions;
  yAxis: PointYAxisOptions;
  labels?: LabelsOptions;
  datasets: Array<PointDataset>;
  cross?: CrossOptions;
  tooltip?: Omit<TooltipOptions, 'index'>;
} & BaseOptions;

export type PointXAxisOptions = {
  type: 'date' | 'value' | 'mapping';
  format?: string; // 使用d3的format格式化数据
  interval?: number;
  ticks?: number;
  lineColor?: string;
  lineWidth?: number;
  lineDash?: number[];
  tickSize?: number;
  fontColor?: string;
  fontSize?: number;
  data: { start: number; end: number } | { start: Date; end: Date } | Array<number> | Array<Date> | Array<string>;
  showAixsText?: boolean;
  showSplitLine?: boolean;
};

export type PointYAxisOptions = {
  type: 'value';
  format?: string; // 使用d3的format格式化数据
  unitText?: string;
  interval?: number;
  ticks?: number;
  lineColor?: string;
  lineWidth?: number;
  lineDash?: number[];
  tickSize?: number;
  fontColor?: string;
  fontSize?: number;
  data?: { start: number; end: number } | Array<number>;
  showAixsText?: boolean;
  showSplitLine?: boolean;
};
