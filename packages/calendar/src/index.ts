import type { Layout } from '@so-chart/types/common';
import type { BaseCalendarInstance, CalendarChartType, CalendarHeatmapInstance } from '@so-chart/types/calendar';
import CalendarChart from './chart';
import { select } from 'd3';
import { resolveCspNonce } from '@so-chart/utils';

export type * from '@so-chart/types/calendar';
export type { Layout } from '@so-chart/types/common';

function getCalendarChart(params: { container: HTMLElement; chartType: 'heatmap'; nonce?: string; layout?: Layout }): CalendarHeatmapInstance;
function getCalendarChart(params: { container: HTMLElement; chartType: CalendarChartType; nonce?: string; layout?: Layout }): BaseCalendarInstance {
  const { container, chartType, nonce, layout } = params;
  clearDom(container);
  const chart = new CalendarChart();
  chart.chartType = chartType;
  chart.nonce = resolveCspNonce(nonce);
  chart.init(container, layout);
  return chart;
}

export default getCalendarChart;

function clearDom(container: HTMLElement) {
  const svg = container.querySelector(`[id^='so-chart_svg']`);
  if (svg) {
    select(svg).on('.');
    container.removeChild(svg);
  }
}
