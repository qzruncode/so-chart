import type { Layout, ColorSystem, Animate, BaseOptions } from './common';

export type SankeyChartType = 'dataflow'; // 支持的图形类型

export type BaseSankeyInstance = {
  nonce?: string;
  chartId: string;
  chartType: SankeyChartType;
  container: HTMLElement;
  svg: SVGSVGElement;
  layout: Required<Layout & { width: number }>;
  scale: number;
  cs?: ColorSystem;
  animate: Required<Animate>;
  init: (container: HTMLElement, layout?: Layout) => void;
  setLayout: () => void;
  setOption: (options: BaseOptions) => void;
  dispose: () => void;
};

export type DataflowInstance = {
  style: Required<DataflowStyle>;
  datasets: RequiredSankeyDataset;
  setOption: (options: DataflowOptions) => void;
} & BaseSankeyInstance;

export type DataflowOptions = {
  style?: DataflowStyle;
  datasets: DataflowDataset;
} & BaseOptions;

export type DataflowStyle = {
  nodeWidth?: number;
  nodePadding?: number;
  fontSize?: number;
  fontColor?: string; // 字体颜色，默认 rgba(0, 0, 0, 0.5)
  textMargin?: number;
  linkHoverColor?: string; // band 悬停颜色，默认 #2a72dc
  linkHoverOpacity?: number; // band 悬停透明度，默认 0.35
  linkHoverWidth?: number; // band 悬停时的最小宽度，默认 2.5
  linkHoverHitWidth?: number; // band 悬停命中区域宽度，默认 14
};

type DataflowDataset = {
  nodes: { name: string; color?: string }[];
  links: { source: number; target: number; value: number | undefined | null; color?: string }[];
};

type RequiredSankeyDataset = {
  nodes: Required<DataflowDataset['nodes'][number]>[];
  links: Required<DataflowDataset['links'][number]>[];
};
