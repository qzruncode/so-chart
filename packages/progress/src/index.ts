import type { Layout } from '@so-chart/types/common';
import type { ProgressChartType, SliderInstance, BaseProgressInstance, ProgressInstance } from '@so-chart/types/progress';
import ProgressChart from './chart';
import { resolveCspNonce } from '@so-chart/utils';

export type * from '@so-chart/types/progress';
export type { Layout } from '@so-chart/types/common';

function getProgressChart(params: { container: HTMLElement; chartType: 'progress'; nonce?: string; layout?: Layout }): ProgressInstance;
function getProgressChart(params: { container: HTMLElement; chartType: 'slider'; nonce?: string; layout?: Layout }): SliderInstance;
function getProgressChart(params: { container: HTMLElement; chartType: ProgressChartType; nonce?: string; layout?: Layout }): BaseProgressInstance {
  const { container, chartType, nonce, layout } = params;
  clearDom(container);
  const chart = new ProgressChart();
  chart.chartType = chartType;
  chart.nonce = resolveCspNonce(nonce);
  chart.init(container, layout);
  return chart;
}

export default getProgressChart;

function clearDom(container: HTMLElement) {
  const svg = container.querySelector(`[id^='so-chart_svg']`);
  if (svg) container.removeChild(svg);
}
