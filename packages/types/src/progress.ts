import type { Animate, BaseOptions, ColorSystem, Layout, ResizeChannel } from './common';

export type ProgressChartType = 'slider' | 'progress';

export type BaseProgressInstance = {
  nonce?: string;
  chartId: string;
  chartType: ProgressChartType;
  container: HTMLElement;
  svg: SVGSVGElement;
  layout: Required<Layout & { width: number }>;
  cs?: ColorSystem;
  channel?: ResizeChannel;
  animate: Required<Animate> & { draw: () => void; progress: number };
  rid?: number;
  init: (container: HTMLElement, layout?: Layout) => void;
  setOption: (options: BaseOptions) => void;
  setLayout: () => void;
  render: () => void;
  resize: () => void;
  dispose: () => void;
};

export type SliderInstance = {
  backgroundColor: string;
  rx: number;
  ry: number;
  linearGradient: SliderOptions['linearGradient'];
  data: Required<SliderOptions['data']>;
  slider: NonNullable<Required<SliderOptions['slider']>>;
  setOption: (options: SliderOptions) => void;
} & BaseProgressInstance;

export type SliderOptions = {
  backgroudColor?: string;
  rx?: number;
  ry?: number;
  slider?: {
    rx?: number;
    ry?: number;
    width?: number;
  };
  linearGradient?: {
    stopColor: string;
    stopOpacity: number;
    offset: string;
  }[];
  data: {
    value: number;
    start?: number;
    end: number;
  };
} & BaseOptions;

export type ProgressInstance = {
  backgroundColor: string;
  rx: number;
  ry: number;
  data: Required<ProgressOptions['data']>;
  setOption: (options: ProgressOptions) => void;
} & BaseProgressInstance;

export type ProgressOptions = {
  backgroudColor?: string;
  rx?: number;
  ry?: number;
  data: {
    value: number;
    start?: number;
    end: number;
  };
} & BaseOptions;
