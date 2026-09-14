import type { Layout } from '@so-chart/types/common';
import type { BaseTreeInstance, DagreInstance, FlowInstance, MashInstance, TreeChartType } from '@so-chart/types/tree';
import TreeChart from './chart';
import { resolveCspNonce } from '@so-chart/utils';
import { setAutoSize, setSize } from './size';

export type * from '@so-chart/types/tree';
export type { Layout } from '@so-chart/types/common';

function getTreeChart(params: { container: HTMLElement; chartType: 'dagre'; nonce?: string; layout?: Layout }): DagreInstance;
function getTreeChart(params: { container: HTMLElement; chartType: 'flow'; nonce?: string; layout?: Layout }): FlowInstance;
function getTreeChart(params: { container: HTMLElement; chartType: 'mash'; nonce?: string; layout?: Layout }): MashInstance;
function getTreeChart(params: { container: HTMLElement; chartType: TreeChartType; nonce?: string; layout?: Layout }): BaseTreeInstance {
  const { container, chartType, nonce, layout } = params;
  clearDom(container);
  const chart = new TreeChart();
  chart.chartType = chartType;
  chart.setLayout = chartType === 'flow' || chartType === 'mash' ? setAutoSize.bind(chart) : setSize.bind(chart);
  chart.nonce = resolveCspNonce(nonce);
  chart.init(container, layout);
  return chart;
}

export default getTreeChart;

function clearDom(container: HTMLElement) {
  const svg = container.querySelector(`[id^='so-chart_svg']`);
  if (svg) container.removeChild(svg);
}
