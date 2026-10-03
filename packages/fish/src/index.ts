import type { Layout } from '@so-chart/types/common';
import { FishChart } from './chart.js';
import type { FishChartInstance } from './types.js';

export { FISH_NAMES, FISH_TYPES } from './types.js';
export { createFishObject } from './object.js';
export type * from './types.js';

export function getFishChart(params: { container: HTMLElement; chartType: 'fish'; layout?: Layout }): FishChartInstance {
  const chart = new FishChart();
  chart.init(params.container, params.layout);
  return chart;
}

export default getFishChart;
