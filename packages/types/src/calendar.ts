import type { BaseOptions, Layout } from './common';

export type CalendarChartType = 'heatmap';

export type BaseCalendarInstance = {
  nonce?: string;
  chartId: string;
  chartType: CalendarChartType;
  container: HTMLElement;
  svg: SVGSVGElement;
  layout: Required<Layout & { width: number }>;
  scale: number;
  init: (container: HTMLElement, layout?: Layout) => void;
  setLayout: () => void;
  setOption: (options: Omit<BaseOptions, 'cs' | 'animate'>) => void;
  dispose: () => void;
};

export type CalendarHeatmapInstance = {
  year: Required<NonNullable<CalendarHeatmapOptions['year']>>;
  week: Required<NonNullable<CalendarHeatmapOptions['week']>>;
  month: Required<NonNullable<CalendarHeatmapOptions['month']>>;
  datasets: Required<CalendarHeatmapDataset>[];
  rangeData: { start: Date; end: Date };
  cell: Required<NonNullable<CalendarHeatmapOptions['cell']>>;
  setOption: (options: CalendarHeatmapOptions) => void;
  tooltip?: (data: { date: string; data: number }) => string;
} & BaseCalendarInstance;

export type CalendarHeatmapDataset = {
  date: Date;
  data: number | undefined | null;
};

export type CalendarHeatmapOptions = {
  year?: {
    type?: 'multipleLines' | 'oneLine';
    showTitle?: boolean;
    fontColor?: string;
    fontSize?: number;
    text?: string;
  };
  week?: {
    fontColor?: string;
    fontSize?: number;
    data?: string[];
  };
  month?: {
    fontColor?: string;
    fontSize?: number;
    data?: string[];
  };
  cell?: {
    size?: number;
    cellPadding?: number;
    monthPadding?: number;
    weightType?: 'color' | 'opacity';
    colors?: string[];
    opacityColor?: string;
  };
  rangeData: { start: Date; end: Date };
  datasets: CalendarHeatmapDataset[];
  tooltip?: (data: { date: string; data: number }) => string;
} & Omit<BaseOptions, 'cs' | 'animate'>;
