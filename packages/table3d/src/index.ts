import type { Layout } from '@so-chart/types/common';
import type { Group } from 'three';
import { Table3DChart } from './chart';
import { createTableScene } from './scene';
import { normalizeOptions } from './normal';
import type { Table3DChartInstance, Table3DOptions } from './types';
export { disposeObject3D } from './dispose';

export type * from './types';

/** Builds the table and optional floor for composition in a host Three.js scene. */
export function createTableObject(options: Table3DOptions): Group {
  return createTableScene(normalizeOptions(options));
}

export function getTable3DChart(params: {
  container: HTMLElement;
  chartType: 'table3d';
  layout?: Layout;
}): Table3DChartInstance {
  const chart = new Table3DChart();
  chart.init(params.container, params.layout);
  return chart;
}

export default getTable3DChart;
