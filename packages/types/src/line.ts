import type { ScaleLinear, ScaleTime } from 'd3-scale';
import type {
  Layout,
  TooltipOptions,
  ColorSystem,
  Animate,
  MouseEventName,
  ClickEventName,
  CrossOptions,
  LabelsOptions,
  BaseOptions,
  EventName,
  DeepRequired,
  MarkOption,
  ManagedMessageChannel,
  RequiredMarkOption,
  ResizeChannel,
} from './common';

export type LineChartType = 'line';

export type ExposedData = {
  x: number;
  y: number;
  index: number;
  data: LineDataset;
};

export type Listeners = {
  [eventName in EventName]?: ((exposedDatas: ExposedData[]) => void)[];
};

export type BaseLineChartInstance = {
  nonce?: string;
  chartId: string;
  chartType: LineChartType;
  container: HTMLElement;
  canvas: HTMLCanvasElement;
  svg: SVGSVGElement;
  offscreenCanvas: OffscreenCanvas;
  layout: Required<Layout & { width: number }>;
  scale: number;
  listeners?: Listeners;
  tooltip?: Required<TooltipOptions> & {
    x?: number;
    y?: number;
  };
  cs?: ColorSystem;
  animate: Required<Animate> & { draw: () => void; progress: number };
  rid?: number;
  channel?: ResizeChannel;
  eventChannel?: ManagedMessageChannel;
  mark: RequiredMarkOption;
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

export type LineDataset = {
  label?: string;
  data: (null | undefined | number)[];
  missing?: 'miss' | 'straight' | 'zero';
  missingType?: 'dotted' | 'solid';
  lineDash?: number[];
  lineWidth?: number;
  dotSize?: number;
  lineColor?: string;
  show?: boolean;
};

export type LineDatasetsWithStack = Required<LineDataset & { stackData: LineDataset['data'] }>[];

export type LineChartInstance = {
  xAxis: Required<LineXAxisOptions>;
  xScaleFunc: ScaleTime<Date, number> | ScaleLinear<number, number>;
  yAxis: DeepRequired<LineYAxisOptions>;
  yScaleFunc: ScaleLinear<number, number>;
  datasets: Array<Required<LineDataset>>;
  stack: boolean;
  area: boolean;
  showPoint: boolean;
  voronoi: boolean;
  xIntervalData: number[] | Date[];
  smooth: boolean;
  yIntervalData: number[];
  cross: Required<CrossOptions>;
  labels: Required<LabelsOptions> & { resize?: () => void };
  setOption: (options: LineOptions) => void;
  refreshLine: () => void;
} & BaseLineChartInstance & {
    tooltip: NonNullable<BaseLineChartInstance['tooltip']>;
  };

export type LineOptions = {
  xAxis: LineXAxisOptions;
  yAxis: LineYAxisOptions;
  datasets: Array<LineDataset>;
  stack?: boolean;
  area?: boolean;
  smooth?: boolean;
  showPoint?: boolean;
  voronoi?: boolean;
  labels?: LabelsOptions;
  cross?: CrossOptions;
  tooltip?: TooltipOptions;
  mark?: MarkOption;
} & BaseOptions;

export type LineXAxisOptions = {
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

export type LineYAxisOptions = {
  type: 'value';
  title?: {
    text?: string;
    fontColor?: string;
    fontSize?: number;
  };
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
