import type { Layout } from '@so-chart/types/common';

import { WaterChart } from './chart.js';
import { createWaterObject } from './scene.js';
import { disposeObject3D } from './dispose.js';
import type { WaterChartInstance } from './types.js';
import { WaterSurface } from './water2.js';

export type * from './types.js';
export type { WaterSurfaceOptions } from './water2.js';
export { WaterSurface, createWaterObject, disposeObject3D };

export function disposeWaterObject(object: WaterSurface): void {
  object.dispose();
}

export function getWaterChart(params: { container: HTMLElement; chartType: 'water'; layout?: Layout }): WaterChartInstance {
  const chart = new WaterChart();
  chart.init(params.container, params.layout);
  return chart;
}

export default getWaterChart;
