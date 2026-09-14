import type { Layout } from '@so-chart/types/common';
import type { BaseSankeyInstance, SankeyChartType, DataflowInstance } from '@so-chart/types/sankey';
import { select } from 'd3';
import SankeyChart from './chart';
import { resolveCspNonce } from '@so-chart/utils';

export type * from '@so-chart/types/sankey';
export type { Layout } from '@so-chart/types/common';

function getSankeyChart(params: { container: HTMLElement; chartType: 'dataflow'; nonce?: string; layout?: Layout }): DataflowInstance;
function getSankeyChart(params: { container: HTMLElement; chartType: SankeyChartType; nonce?: string; layout?: Layout }): BaseSankeyInstance {
  const { container, chartType, nonce, layout } = params;
  clearDom(container);
  const chart = new SankeyChart();
  chart.chartType = chartType;
  chart.nonce = resolveCspNonce(nonce);
  chart.init(container, layout);
  return chart;
}

export default getSankeyChart;

function clearDom(container: HTMLElement) {
  const svg = container.querySelector(`[id^='so-chart_svg']`);
  if (svg) {
    select(svg).on('.');
    container.removeChild(svg);
  }
}
