import type { Layout } from '@so-chart/types/common';
import type { PointChartType, PointChartInstance, BasePointChartInstance } from '@so-chart/types/point';
import PointChart from './chart';
import { resolveCspNonce } from '@so-chart/utils';

export type * from '@so-chart/types/point';
export type { Layout } from '@so-chart/types/common';

function getPointChart(params: { container: HTMLElement; chartType: 'point'; nonce?: string; layout?: Layout }): PointChartInstance;
function getPointChart(params: { container: HTMLElement; chartType: PointChartType; nonce?: string; layout?: Layout }): BasePointChartInstance {
  const { container, chartType, nonce, layout } = params;
  clearDom(container);
  const chart = new PointChart();
  chart.chartType = chartType;
  chart.nonce = resolveCspNonce(nonce);
  chart.init(container, layout);
  return chart;
}

export default getPointChart;

function clearDom(container: HTMLElement) {
  const canvas = container.querySelector(`[id^='so-chart_canvas']`);
  const svg = container.querySelector(`[id^='so-chart_svg']`);
  if (canvas) {
    container.removeChild(canvas);
  }
  if (svg) {
    container.removeChild(svg);
  }
}
