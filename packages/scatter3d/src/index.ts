import type { Layout } from '@so-chart/types/common';
import { Scatter3DChart } from './chart';
import type { Scatter3DChartInstance } from './types';

export type * from './types';

export function getScatter3DChart(params: { container: HTMLElement; chartType: 'scatter3d'; layout?: Layout }): Scatter3DChartInstance {
  const chart = new Scatter3DChart();
  chart.init(params.container, params.layout);
  return chart;
}

export default getScatter3DChart;
