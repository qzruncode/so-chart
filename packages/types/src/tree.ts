import type { EdgeLabel, GraphLabel, NodeLabel, graphlib } from '@dagrejs/dagre';
import type { Layout, MouseEventName, ClickEventName, BaseOptions, EventName, DeepRequired, ManagedMessageChannel, ResizeChannel } from './common';

export type Listeners = {
  [eventName in EventName]?: ((position: [number, number], nodeId: string) => void)[];
};

export type TreeChartType = 'dagre' | 'flow' | 'mash';
export type BaseTreeInstance = {
  nonce?: string;
  chartId: string;
  chartType: TreeChartType;
  container: HTMLElement;
  svg: SVGSVGElement;
  layout: Required<Layout & { width: number }>;
  scale: number;
  listeners?: Listeners;
  channel?: ResizeChannel;
  eventChannel?: ManagedMessageChannel;
  init: (container: HTMLElement, layout?: Layout) => void;
  setLayout: (width?: number) => void;
  setOption: (options: Omit<BaseOptions, 'cs' | 'animate'>) => void;
  setTooltip: (params: { html: string; nodeId: string }) => void;
  dispose: () => void;
  on: {
    (eventName: MouseEventName, event: (position: [number, number], nodeId: string) => void): void;
    (eventName: ClickEventName, event: (position: [number, number], nodeId: string) => void): void;
  };
  resize: () => void;
};

// ----- Dagre Tree Chart Types -----
export type DagreInstance = {
  graphOption: GraphLabel;
  graph: graphlib.Graph<GraphLabel, DagreNode, DagreEdge>;
  datasets: RequiredDagreTreeDataset;
  linkType: DagreTreeLinkType;
  setOption: (options: DagreTreeOptions) => void;
} & BaseTreeInstance;

export type DagreNode = NodeLabel & {
  nodeId: string;
  html: string;
};

export type DagreEdge = EdgeLabel & {
  color: string;
  dash: string;
  label: string;
};

export type DagreTreeDataset = {
  nodes: { id: string; html: string; parent?: string; width?: number; height?: number }[];
  edges: { source: string; target: string; label?: string; color?: string; dash?: string; minlen?: number }[];
};

export type RequiredDagreTreeDataset = {
  nodes: Required<DagreTreeDataset['nodes'][number]>[];
  edges: Required<DagreTreeDataset['edges'][number]>[];
};

export type DagreTreeLinkType = 'straight' | 'curve';

export type DagreTreeOptions = {
  linkType?: DagreTreeLinkType;
  graph?: GraphLabel;
  datasets: DagreTreeDataset;
} & Omit<BaseOptions, 'cs' | 'animate'>;

// ----- Flow Chart Types -----
export type FlowInstance = {
  nodeHeight: number;
  nodeWidth: number;
  datasets: DeepRequired<FlowDataset>;
  setOption: (options: FlowOptions) => void;
} & BaseTreeInstance;

export type FlowOptions = {
  datasets: FlowDataset;
  nodeHeight?: number;
  nodeWidth?: number;
} & Omit<BaseOptions, 'cs' | 'animate'>;

export type FlowDataset = {
  nodes: {
    tooltipText?: string;
    label: string;
    bgType?: 'linearGradient' | 'bg' | 'none';
    x: number;
    y: number;
    fontSize?: number; // 标题的文字大小
    fontColor?: string; // 字体颜色，默认 rgba(0, 0, 0, 0.5)
    rx?: number; // 矩形圆角，默认30
    ry?: number; // 矩形圆角，默认30
    bgColor?: string; // bgType='bg'时生效。设置背景颜色，默认''
    strokeColor?: string; // 设置边框颜色，默认#1976d2
  }[];
  edges: {
    type?: 'straight' | 'round' | 'poly';
    endType?: 'arrow' | 'none'; // 终点类型
    radius?: number; // type: 'round' | 'poly' 时有效，圆角半径
    points: number[][];
    roundPosition?: 'start' | 'end'; // type: 'round' 时有效，圆角位置
    poly?: {
      // type: 'poly' 时有效
      direction?: 'normal' | 'reverse';
      /**
       * intersectionPointX设置折线路径的交叉点坐标，控制多条poly如何相交
       * 默认情况下是按照 (x1 + x2) / 2 中点想交
       */
      intersectionPointX?: number;
    };
    arrow?: {
      strokeWidth?: number;
      color?: string;
    };
    label?: {
      text: string;
      pos?: 'auto' | 'manual'; // 设置标签位置，auto表示自动计算中点位置，默认auto;
      startOffset?: number; // pos='manual'时生效。用于设置标签相对于起点的期望偏移量，默认0；标签过长时会在整条真实路径上自动调整
      dir?: 'horizontal' | 'parallel'; // 标签方向，默认 parallel，沿edge路径自适应。当手动设置startOffset时生效
      fontColor?: string; // 字体颜色，默认 rgba(0, 0, 0, 0.5)
    };
  }[];
};

// ----- Mash Chart Types -----
export type MashInstance = {
  datasets: DeepRequired<MashDataset>;
  setOption: (options: MashOptions) => void;
} & BaseTreeInstance;

export type MashOptions = {
  datasets: MashDataset;
} & Omit<BaseOptions, 'cs' | 'animate'>;

export type MashDataset = {
  nodes: {
    tooltipText?: string;
    label?: string;
    labelColor?: string; // 标题文字颜色，默认#000
    fontSize?: number; // 标题的文字大小
    bgType?: 'bg' | 'none';
    bgColor?: string;
    x: number;
    y: number;
    type: 'rect' | 'circularFlow';
    width?: number;
    height?: number;
    rect?: {
      rx?: number; // 默认为 height / 2
      ry?: number; // 默认为 height / 2
    };
    circularFlow?: {
      innerRadius?: number;
      outerRadius?: number;
      arrowHeight?: number;
      arrowWidth?: number; // 默认为 (outerRadius - innerRadius) + 30
      data: {
        label?: string;
        fontSize?: number;
        backgroundColor?: string;
        tooltipText?: string;
      }[];
    };
  }[];
  edges: {
    type?: 'straight' | 'round' | 'poly';
    endType?: 'arrow' | 'none'; // 终点类型
    arrow?: {
      strokeWidth?: number;
      color?: string;
    };
    poly?: {
      // type: 'poly' 时有效
      direction?: 'normal' | 'reverse';
      /**
       * intersectionPointX设置折线路径的交叉点坐标，控制多条poly如何相交
       * 默认情况下是按照 (x1 + x2) / 2 中点想交
       */
      intersectionPointX?: number;
    };
    radius?: number; // 圆角半径。type: 'round' | 'poly' 时有效
    points: number[][];
  }[];
};
