import type {
  Layout,
  TooltipOptions,
  ColorSystem,
  Animate,
  MouseEventName,
  ClickEventName,
  LabelsOptions,
  BaseOptions,
  EventName,
  DeepRequired,
  ManagedMessageChannel,
  ResizeChannel,
} from './common';

export type PieChartType = 'pie';

export type ExposedData = {
  x: number;
  y: number;
  index: number;
  data: PieDataset;
};

export type Listeners = {
  [eventName in EventName]?: ((exposedDatas: ExposedData[]) => void)[];
};

export type BasePieChartInstance = {
  nonce?: string;
  chartId: string;
  chartType: PieChartType;
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

export type HoverText = {
  type?: 'lead' | 'center';
  unit?: string;
  labelColor?: string; // label 字体颜色，默认 rgba(0, 0, 0, 0.5)
  labelFontSize?: number;
  dataFontSize?: number;
  totalText?: string;
};

export type PieChartInstance = {
  labels: Required<LabelsOptions> & { resize?: () => void };
  datasets: Array<Required<PieDataset>>;
  radius: number;
  innerRadius: number;
  shadowBlur: number;
  fontSize: number;
  startAngle: number;
  endAngle: number;
  arcPaths: Path2D[];
  hoverText: Required<HoverText>;
  chooseIndex?: number;
  position: DeepRequired<NonNullable<PieOptions['position']>>;
  setOption: (options: PieOptions) => void;
  refreshPie: () => void;
} & BasePieChartInstance;

export type PieDataset = {
  label?: string;
  labelRadius?: number; // 用于label引线端点的半径
  data: null | undefined | number;
  show?: boolean;
  backgroundColor?: string;
};

export type PieOptions = {
  labels?: LabelsOptions;
  datasets: Array<PieDataset>;
  radius?: number;
  innerRadius?: number;
  shadowBlur?: number;
  fontSize?: number;
  startAngle?: number;
  endAngle?: number;
  tooltip?: Omit<TooltipOptions, 'index'>;
  hoverText?: HoverText;
  position?: {
    x?: 'left' | 'center' | 'right';
    y?: 'top' | 'center' | 'bottom';
  };
} & BaseOptions;
