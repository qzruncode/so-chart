import type { Layout, ColorSystem, Animate, BaseOptions, ResizeChannel } from './common';

export type GuageChartType = 'guage' | 'single' | 'circle';

export type BaseGuageInstance = {
  nonce?: string;
  chartId: string;
  chartType: GuageChartType;
  container: HTMLElement;
  canvas: HTMLCanvasElement;
  svg: SVGSVGElement;
  offscreenCanvas: OffscreenCanvas;
  layout: Required<
    Layout & {
      width: number;
    }
  >;
  scale: number;
  cs?: ColorSystem;
  animate: Required<Animate> & {
    draw: () => void;
    progress: number;
  };
  rid?: number;
  channel?: ResizeChannel;
  init: (container: HTMLElement, layout?: Layout) => void;
  setOption: (options: BaseOptions) => void;
  setLayout: () => void;
  render: () => void;
  resize: () => void;
  dispose: () => void;
};

export type GuageInstance = {
  datasets: Array<Required<GuageDataset>>;
  value: number;
  outerRadius: [number, number]; // 内圈
  innerRadius: [number, number]; // 外圈
  fontSize: number;
  fontColor: string;
  startAngle: number;
  endAngle: number;
  setOption: (options: GuageOptions) => void;
  refreshGuage: () => void;
} & BaseGuageInstance;

export type GuageOptions = {
  datasets: Array<GuageDataset>;
  value: number;
  outerRadius: [number, number]; // 内圈
  innerRadius: [number, number]; // 外圈
  fontSize?: number;
  fontColor?: string; // 字体颜色，默认 rgba(0, 0, 0, 0.5)
  startAngle?: number;
  endAngle?: number;
} & BaseOptions;

export type GuageDataset = {
  data: null | undefined | number;
  show?: boolean;
  backgroundColor?: string;
};

export type SingleGuageInstance = {
  value: number;
  showText: string;
  radius: [number, number];
  cornerRadius: number;
  fontSize: number;
  fontColor: string;
  startAngle: number;
  endAngle: number;
  backgroundColor: string;
  valueBackgroundColor: string;
  tick: NonNullable<Required<SingleGuageOptions['tick']>>;
  setOption: (options: SingleGuageOptions) => void;
  refreshGuage: () => void;
  tooltip?: () => string;
} & BaseGuageInstance;

export type SingleGuageOptions = {
  value: number;
  showText?: string;
  radius?: [number, number];
  cornerRadius?: number;
  fontSize?: number;
  fontColor?: string; // 字体颜色，默认 rgba(0, 0, 0, 0.5)
  startAngle?: number;
  endAngle?: number;
  backgroundColor?: string;
  valueBackgroundColor?: string;
  tick?: {
    show?: boolean; // 是否展示 tick，默认 false
    tickSize?: number; // tick长度，默认 5
    steps?: number; // 一共展示几个刻度，默认 7
    lineWidth?: number; // tick的线宽，默认 1
    lineColor?: string; // tick的颜色，默认 black
  };
  tooltip?: () => string;
} & BaseOptions;

export type CircleGuageInstance = {
  value: number;
  radius: [number, number];
  startAngle: number;
  endAngle: number;
  backgroundColor: string;
  valueBackgroundColor: string;
  hollow: boolean;
  setOption: (options: CircleGuageOptions) => void;
  refreshGuage: () => void;
} & BaseGuageInstance;

export type CircleGuageOptions = {
  value: number;
  radius?: [number, number];
  startAngle?: number;
  endAngle?: number;
  backgroundColor?: string;
  valueBackgroundColor?: string;
  hollow?: boolean; // 是否空心，默认 true
} & BaseOptions;
