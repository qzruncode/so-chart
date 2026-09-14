import type { BaseGuageInstance, CircleGuageInstance, GuageChartType, GuageInstance, SingleGuageInstance } from '@so-chart/types/guage';
import type { Layout } from '@so-chart/types/common';
import GuageChart from './chart';
import { resolveCspNonce } from '@so-chart/utils';

export type * from '@so-chart/types/guage';
export type { Layout } from '@so-chart/types/common';

function getGuageChart(params: { container: HTMLElement; chartType: 'circle'; nonce?: string; layout?: Layout }): CircleGuageInstance;
function getGuageChart(params: { container: HTMLElement; chartType: 'single'; nonce?: string; layout?: Layout }): SingleGuageInstance;
function getGuageChart(params: { container: HTMLElement; chartType: 'guage'; nonce?: string; layout?: Layout }): GuageInstance;
function getGuageChart(params: { container: HTMLElement; chartType: GuageChartType; nonce?: string; layout?: Layout }): BaseGuageInstance {
  const { container, chartType, nonce, layout } = params;
  clearDom(container);
  const chart = new GuageChart();
  chart.chartType = chartType;
  chart.nonce = resolveCspNonce(nonce);
  chart.init(container, layout);
  return chart;
}

export default getGuageChart;

function clearDom(container: HTMLElement) {
  const canvas = container.querySelector(`[id^='so-chart_canvas']`);
  const svg = container.querySelector(`[id^='so-chart_svg']`);
  if (canvas) container.removeChild(canvas);
  if (svg) container.removeChild(svg);
}
