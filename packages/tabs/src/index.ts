import type { LabelsOptions, Layout } from '@so-chart/types/common';

export type CommonChart = {
  nonce?: string;
  scale: number;
  svg: SVGSVGElement;
  chartId: string;
  chartType: 'bar' | 'circleStackBar' | 'line' | 'point' | 'pie' | 'radar';
  datasets: {
    show: boolean;
    lineColor?: string;
    backgroundColor?: string;
    dotColor?: string;
    data: (null | undefined | number)[] | (number | null | undefined);
  }[];
  yAxis?: { data: { start: number; end: number } | { start: Date; end: Date } | Array<number> | Array<Date> | Array<string> };
  labels: Required<LabelsOptions> & { resize?: () => void };
  layout: Required<Layout & { width: number }>;
  refreshLine?: () => void;
  refreshBar?: () => void;
  refreshDots?: () => void;
  refreshPie?: () => void;
  refreshRadar?: () => void;
};

export { destroyTabs, drawTabs } from './drawTabs';
export type { TabsController } from './Tabs';
