import type { Layout } from '@so-chart/types/common';
import type { BaseRadarInstance, RadarChartType, RadarInstance } from '@so-chart/types/radar';
import RadarChart from './chart';
import { resolveCspNonce } from '@so-chart/utils';

export type * from '@so-chart/types/radar';
export type { Layout } from '@so-chart/types/common';

function getRadarChart(params: { container: HTMLElement; chartType: 'radar'; nonce?: string; layout?: Layout }): RadarInstance;
function getRadarChart(params: { container: HTMLElement; chartType: RadarChartType; nonce?: string; layout?: Layout }): BaseRadarInstance {
  const { container, chartType, nonce, layout } = params;
  clearDom(container);
  const chart = new RadarChart();
  chart.chartType = chartType;
  chart.nonce = resolveCspNonce(nonce);
  chart.init(container, layout);
  return chart;
}

export default getRadarChart;

function clearDom(container: HTMLElement) {
  const canvas = container.querySelector(`[id^='so-chart_canvas']`);
  const svg = container.querySelector(`[id^='so-chart_svg']`);
  if (canvas) container.removeChild(canvas);
  if (svg) container.removeChild(svg);
}
