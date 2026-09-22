import type { BaseOptions, ColorSystem, Layout, TooltipOptions } from '@so-chart/types/common';

export type Scatter3DPoint =
  | readonly [number, number, number]
  | {
      x: number;
      y: number;
      z: number;
      value?: number;
      label?: string;
      color?: string;
    };

export type Scatter3DLineOptions = {
  show?: boolean;
  color?: string;
  width?: number;
  opacity?: number;
  dash?: 'solid' | 'dashed' | 'dotted';
  dashSize?: number;
  gapSize?: number;
};

export type Scatter3DAxisLineOptions = {
  show?: boolean;
  color?: string;
  width?: number;
  opacity?: number;
  dash?: 'solid' | 'dashed' | 'dotted';
  dashSize?: number;
  gapSize?: number;
};

export type Scatter3DDataset = {
  label?: string;
  data: readonly Scatter3DPoint[];
  color?: string;
  size?: number;
  opacity?: number;
  symbol?: 'circle' | 'square';
  show?: boolean;
  line?: Scatter3DLineOptions;
};

export type Scatter3DGridPlane = 'xy' | 'xz' | 'yz';

export type Scatter3DGridOptions = {
  show?: boolean;
  color?: string;
  centerColor?: string;
  planeColors?: Partial<Record<Scatter3DGridPlane, string>>;
  divisions?: number;
  opacity?: number;
  planes?: readonly Scatter3DGridPlane[] | 'all';
};

export type Scatter3DAxesOptions = {
  show?: boolean;
  color?: string;
  labelColor?: string;
  nameColor?: string;
  showLabel?: boolean;
  showTick?: boolean;
  axisLine?: Scatter3DAxisLineOptions;
  splitNumber?: number;
  tickSize?: number;
  fontSize?: number;
  labelGap?: number;
  nameGap?: number;
  formatter?: (value: number) => string;
};

export type Scatter3DAxisOptions = Scatter3DAxesOptions & {
  domain?: readonly [number, number];
  name?: string;
};

export type Scatter3DVisualMapOptions = {
  dimension?: 'x' | 'y' | 'z' | 'value';
  min?: number;
  max?: number;
  colors?: readonly string[];
  clamp?: boolean;
  reverse?: boolean;
  outOfRangeColor?: string;
};

export type Scatter3DEmphasisOptions = {
  show?: boolean;
  scale?: number;
  color?: string;
  size?: number;
  opacity?: number;
};

export type Scatter3DFogOptions = {
  color?: string;
  near?: number;
  far?: number;
};

export type Scatter3DOptions = {
  datasets: readonly Scatter3DDataset[];
  xAxis?: Scatter3DAxisOptions;
  yAxis?: Scatter3DAxisOptions;
  zAxis?: Scatter3DAxisOptions;
  backgroundColor?: string | null;
  fog?: Scatter3DFogOptions;
  tooltip?: Omit<TooltipOptions, 'index'>;
  grid?: boolean | Scatter3DGridOptions;
  axes?: boolean | Scatter3DAxesOptions;
  gridColor?: string;
  axisColor?: string;
  point?: {
    size?: number;
    opacity?: number;
    symbol?: 'circle' | 'square';
    sizeAttenuation?: boolean;
    depthTest?: boolean;
    depthWrite?: boolean;
    blending?: 'normal' | 'additive' | 'subtractive' | 'multiply';
  };
  visualMap?: Scatter3DVisualMapOptions;
  emphasis?: Scatter3DEmphasisOptions;
  renderer?: {
    pixelRatio?: number;
  };
  camera?: {
    position?: readonly [number, number, number];
    target?: readonly [number, number, number];
    zoom?: number;
    fov?: number;
    near?: number;
    far?: number;
  };
  controls?: {
    enabled?: boolean;
    damping?: boolean;
    autoRotate?: boolean;
    autoRotateSpeed?: number;
    enableRotate?: boolean;
    enableZoom?: boolean;
    enablePan?: boolean;
    minDistance?: number;
    maxDistance?: number;
    minPolarAngle?: number;
    maxPolarAngle?: number;
    minAzimuthAngle?: number;
    maxAzimuthAngle?: number;
    rotateSpeed?: number;
    zoomSpeed?: number;
    panSpeed?: number;
    screenSpacePanning?: boolean;
    keyPanSpeed?: number;
  };
} & BaseOptions;

export type Scatter3DEventName = 'mouseenter' | 'mousemove' | 'mouseleave' | 'click';

export type Scatter3DExposedData = {
  datasetIndex: number;
  pointIndex: number;
  datasetLabel: string;
  point: Scatter3DPoint;
  distance: number;
  screen: {
    x: number;
    y: number;
  };
};

export type Scatter3DChartInstance = {
  chartType: 'scatter3d';
  container: HTMLElement;
  canvas: HTMLCanvasElement;
  layout: Required<Layout & { width: number }>;
  init: (container: HTMLElement, layout?: Layout) => void;
  setOption: (options: Scatter3DOptions) => void;
  resize: () => void;
  render: () => void;
  dispose: () => void;
  on: (eventName: Scatter3DEventName, listener: (data: Scatter3DExposedData) => void) => () => void;
};

export type NormalizedScatter3DPoint = {
  value: Scatter3DPoint;
  x: number;
  y: number;
  z: number;
  label: string;
  color?: string;
  numericValue?: number;
};

export type NormalizedScatter3DDataset = {
  label: string;
  points: NormalizedScatter3DPoint[];
  color: string;
  opacity: number;
  symbol: 'circle' | 'square';
  size: number;
  show: boolean;
  line: {
    show: boolean;
    color: string;
    width: number;
    opacity: number;
    dash: 'solid' | 'dashed' | 'dotted';
    dashSize: number;
    gapSize: number;
  };
};

export type NormalizedScatter3DAxisLineOptions = {
  show: boolean;
  color: string;
  width: number;
  opacity: number;
  dash: 'solid' | 'dashed' | 'dotted';
  dashSize: number;
  gapSize: number;
};

export type NormalizedScatter3DAxisOptions = {
  show: boolean;
  domain: readonly [number, number];
  name: string;
  color: string;
  labelColor: string;
  nameColor: string;
  showLabel: boolean;
  showTick: boolean;
  axisLine: NormalizedScatter3DAxisLineOptions;
  splitNumber: number;
  tickSize: number;
  fontSize: number;
  labelGap: number;
  nameGap: number;
  formatter?: (value: number) => string;
};

export type NormalizedScatter3DOptions = {
  datasets: NormalizedScatter3DDataset[];
  xDomain: readonly [number, number];
  yDomain: readonly [number, number];
  zDomain: readonly [number, number];
  backgroundColor: string | null;
  fog?: {
    color: string;
    near: number;
    far: number;
  };
  grid: {
    show: boolean;
    color: string;
    centerColor: string;
    planeColors: Partial<Record<Scatter3DGridPlane, string>>;
    divisions: number;
    opacity: number;
    planes: readonly Scatter3DGridPlane[];
  };
  axes: {
    show: boolean;
    color: string;
    labelColor: string;
    nameColor: string;
    showLabel: boolean;
    showTick: boolean;
    axisLine: NormalizedScatter3DAxisLineOptions;
    splitNumber: number;
    tickSize: number;
    fontSize: number;
    labelGap: number;
    nameGap: number;
    formatter?: (value: number) => string;
  };
  xAxis: NormalizedScatter3DAxisOptions;
  yAxis: NormalizedScatter3DAxisOptions;
  zAxis: NormalizedScatter3DAxisOptions;
  tooltip: Required<TooltipOptions>;
  point: {
    size: number;
    opacity: number;
    symbol: 'circle' | 'square';
    sizeAttenuation: boolean;
    depthTest: boolean;
    depthWrite: boolean;
    blending: 'normal' | 'additive' | 'subtractive' | 'multiply';
  };
  visualMap?: {
    dimension: 'x' | 'y' | 'z' | 'value';
    min?: number;
    max?: number;
    colors: readonly string[];
    clamp: boolean;
    reverse: boolean;
    outOfRangeColor?: string;
  };
  emphasis: {
    show: boolean;
    scale: number;
    color?: string;
    size?: number;
    opacity?: number;
  };
  renderer: {
    pixelRatio: number;
  };
  camera: {
    position: readonly [number, number, number];
    target: readonly [number, number, number];
    zoom: number;
    fov: number;
    near: number;
    far: number;
  };
  controls: {
    enabled: boolean;
    damping: boolean;
    autoRotate: boolean;
    autoRotateSpeed: number;
    enableRotate: boolean;
    enableZoom: boolean;
    enablePan: boolean;
    minDistance: number;
    maxDistance: number;
    minPolarAngle: number;
    maxPolarAngle: number;
    minAzimuthAngle: number;
    maxAzimuthAngle: number;
    rotateSpeed: number;
    zoomSpeed: number;
    panSpeed: number;
    screenSpacePanning: boolean;
    keyPanSpeed: number;
  };
};

export type { ColorSystem };
