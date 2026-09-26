import type { Layout } from '@so-chart/types/common';
import { FireChart } from './chart';
import type { FireChartInstance } from './types';

export type * from './types';

export function getFireChart(params: { container: HTMLElement; chartType: 'fire'; layout?: Layout }): FireChartInstance {
  const chart = new FireChart();
  chart.init(params.container, params.layout);
  return chart;
}

export default getFireChart;
