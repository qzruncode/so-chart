import type { Layout } from '@so-chart/types/common';
import type { Group } from 'three';
import { BasketChart } from './chart';
import { createBasketScene } from './scene';
import { normalizeObjectOptions } from './normal';
import type { BasketChartInstance, BasketObjectOptions } from './types';
export { disposeObject3D } from './dispose';

export type * from './types';

/** Builds a bundled basket model for composition in a host Three.js scene. */
export function createBasketObject(options: BasketObjectOptions): Promise<Group> {
  return createBasketScene(normalizeObjectOptions(options));
}

export function getBasketChart(params: { container: HTMLElement; chartType: 'basket'; layout?: Layout }): BasketChartInstance {
  const chart = new BasketChart();
  chart.init(params.container, params.layout);
  return chart;
}

export default getBasketChart;
