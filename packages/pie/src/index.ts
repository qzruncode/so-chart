import type { BasePieChartInstance, PieChartInstance, PieChartType } from '@so-chart/types/pie';
import type { Layout } from '@so-chart/types/common';
import PieChart from './chart';
import { resolveCspNonce } from '@so-chart/utils';

export type * from '@so-chart/types/pie';
export type { Layout } from '@so-chart/types/common';

function getPieChart(params: { container: HTMLElement; chartType: 'pie'; nonce?: string; layout?: Layout }): PieChartInstance;
function getPieChart(params: { container: HTMLElement; chartType: PieChartType; nonce?: string; layout?: Layout }): BasePieChartInstance {
  const { container, chartType, nonce, layout } = params;
  clearDom(container);
  const chart = new PieChart();
  chart.chartType = chartType;
  chart.nonce = resolveCspNonce(nonce);
  chart.init(container, layout);
  return chart;
}

export default getPieChart;

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
