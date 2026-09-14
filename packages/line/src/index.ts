import type { BaseLineChartInstance, LineChartInstance, LineChartType } from '@so-chart/types/line';
import LineChart from './chart';
import type { Layout } from '@so-chart/types/common';
import { resolveCspNonce } from '@so-chart/utils';

export type * from '@so-chart/types/line';
export type { Layout } from '@so-chart/types/common';

function getLineChart(params: { container: HTMLElement; chartType: 'line'; nonce?: string; layout?: Layout }): LineChartInstance;
function getLineChart(params: { container: HTMLElement; chartType: LineChartType; nonce?: string; layout?: Layout }): BaseLineChartInstance {
  const { container, chartType, nonce, layout } = params;
  clearDom(container);
  const chart = new LineChart();
  chart.chartType = chartType;
  chart.nonce = resolveCspNonce(nonce);
  chart.init(container, layout);
  return chart;
}

export default getLineChart;

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
