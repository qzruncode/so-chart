import type { Layout, ColorSystem, Animate, BaseOptions, LabelsOptions, ResizeChannel, TooltipOptions } from './common';
import type { ScaleBand, ScaleLinear, ScaleTime } from 'd3-scale';
export type RadarChartType = 'radar';

export type BaseRadarInstance = {
  nonce?: string;
  chartId: string;
  chartType: RadarChartType;
  container: HTMLElement;
  canvas: HTMLCanvasElement;
  svg: SVGSVGElement;
  offscreenCanvas: OffscreenCanvas;
  layout: Required<Layout & { width: number }>;
  scale: number;
  cs?: ColorSystem;
  animate: Required<Animate> & { draw: () => void; progress: number };
  rid?: number;
  channel?: ResizeChannel;
  init: (container: HTMLElement, layout?: Layout) => void;
  setOption: (options: BaseOptions) => void;
  setLayout: () => void;
  render: () => void;
  resize: () => void;
  dispose: () => void;
};

export type RadarInstance = {
  labels: Required<LabelsOptions> & { resize?: () => void };
  xAxis: Required<RadarOptions['xAxis']>;
  yAxis: Required<RadarOptions['yAxis']>;
  xScaleFunc: ScaleBand<string>;
  yScaleFunc: ScaleTime<Date, number> | ScaleLinear<number, number>;
  xIntervalData: string[];
  yIntervalData: number[] | Date[];
  radius: number;
  textPadding: number;
  hover: Required<RadarHoverOptions>;
  tooltip: Required<TooltipOptions> & { x?: number; y?: number };
  datasets: Array<Required<RadarDataset>>;
  radarRegions: RadarRegion[];
  hoveredRegion?: RadarRegion;
  setOption: (options: RadarOptions) => void;
  refreshRadar: () => void;
} & BaseRadarInstance;

export type RadarOptions = {
  labels?: LabelsOptions;
  xAxis: RadarXAxisOptions;
  yAxis: RadarYAxisOptions;
  radius: number;
  textPadding?: number;
  hover?: RadarHoverOptions;
  tooltip?: Omit<TooltipOptions, 'index'>;
  datasets: Array<RadarDataset>;
} & BaseOptions;

export type RadarHoverOptions = {
  opacity?: number;
  lineWidth?: number;
  color?: string;
};

export type RadarDataset = {
  label?: string;
  data: (null | undefined | number)[];
  show?: boolean;
  lineWidth?: number;
  lineColor?: string;
  backgroundColor?: string;
};

export type RadarRegion = {
  datasetIndex: number;
  polygon: Array<[number, number]>;
  data: Required<RadarDataset>;
};

export type RadarXAxisOptions = {
  type: 'category';
  data: string[];
  lineColor?: string;
  lineWidth?: number;
  lineDash?: number[];
  fontColor?: string;
  fontSize?: number;
};

export type RadarYAxisOptions = {
  type: 'value';
  data: { start: number; end: number };
  ticks?: number;
  interval?: number;
  lineColor?: string;
  lineWidth?: number;
  lineDash?: number[];
  fontColor?: string;
  fontSize?: number;
};
