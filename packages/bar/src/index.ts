import type { Layout } from '@so-chart/types/common';
import BarChart from './chart';
import type { BarChartInstance, BarChartType, BaseBarChartInstance, CircleStackBarInstance, TrendBarInstance } from '@so-chart/types/bar';
import { resolveCspNonce } from '@so-chart/utils';

export type * from '@so-chart/types/bar';
export type { Layout } from '@so-chart/types/common';

function getBarChart(params: { container: HTMLElement; chartType: 'trend'; nonce?: string; layout?: Layout }): TrendBarInstance;
function getBarChart(params: { container: HTMLElement; chartType: 'circleStackBar'; nonce?: string; layout?: Layout }): CircleStackBarInstance;
function getBarChart(params: { container: HTMLElement; chartType: 'bar'; nonce?: string; layout?: Layout }): BarChartInstance;
function getBarChart(params: { container: HTMLElement; chartType: BarChartType; nonce?: string; layout?: Layout }): BaseBarChartInstance {
  const { container, chartType, nonce, layout } = params;
  clearDom(container);
  const chart = new BarChart() as BaseBarChartInstance & { chartType: BarChartType };
  chart.chartType = chartType;
  chart.nonce = resolveCspNonce(nonce);
  chart.init(container, layout);
  return chart;
}

export default getBarChart;

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
