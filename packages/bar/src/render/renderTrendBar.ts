import type { TrendBarInstance, TrendBarOptions } from '@so-chart/types/bar';
import { applyAnimate, applyTooltip } from '@so-chart/utils';
import { applyTrendBarChartBarOptions, applyTrendBarChartDatasets } from '../normal';
import { setWidth } from '../size';
import { computeXAixs, computeYAixs } from '../axis/trendBarAxis';
import { drawTrendBar } from '../draw/drawTrendBar';

export default function renderTrendBar(chart: TrendBarInstance, options: TrendBarOptions) {
  const { animate, bar, datasets, tooltip } = options;
  chart.animate = applyAnimate(animate);
  chart.bar = applyTrendBarChartBarOptions(bar);
  chart.datasets = applyTrendBarChartDatasets(datasets, chart.cs);
  chart.tooltip = applyTooltip(tooltip);
  computeXAixs(chart);
  computeYAixs(chart);

  chart.resize = () => {
    setWidth.call(chart);
    computeXAixs(chart); // 宽度发生了变化，x轴需要重新计算
    chart.render();
  };

  chart.animate.draw = () => {
    drawTrendBar(chart);
  };
}
