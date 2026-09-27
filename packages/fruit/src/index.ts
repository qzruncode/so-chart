import type { Layout } from '@so-chart/types/common';
import { FruitChart } from './chart';
import type { FruitChartInstance } from './types';

export type * from './types';

export function getFruitChart(params: { container: HTMLElement; chartType: 'fruit'; layout?: Layout }): FruitChartInstance {
  const chart = new FruitChart();
  chart.init(params.container, params.layout);
  return chart;
}

export default getFruitChart;
