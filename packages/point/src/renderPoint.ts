import type { PointChartInstance, PointOptions } from '@so-chart/types/point';
import { computeXAixs, computeYAixs, drawXAxis, drawYAxis } from './pointAxis';
import { drawPoint } from './drawPoint';
import { setWidth } from './size';
import { applyAnimate, applyCross, applyLabels, applyTooltip } from '@so-chart/utils';
import { applyPointChartDatasets, applyXAxis, applyYAxis } from './normal';
import { destroyTabs, drawTabs } from '@so-chart/tabs';

export default function renderPoint(chart: PointChartInstance, options: PointOptions) {
  const { xAxis, yAxis, datasets, labels, cross, tooltip, animate } = options;
  chart.animate = applyAnimate(animate);
  chart.xAxis = applyXAxis(xAxis);
  chart.yAxis = applyYAxis(yAxis, datasets);
  computeXAixs(chart);
  computeYAixs(chart);
  chart.animate = applyAnimate(animate);
  chart.datasets = applyPointChartDatasets(datasets, chart.cs);
  chart.cross = applyCross(cross);
  chart.tooltip = applyTooltip(tooltip);
  chart.labels = applyLabels({
    labels,
    defaultLableData: options.datasets.map(d => d.label ?? ''),
  });
  if (chart.labels.show) {
    drawTabs(chart);
  } else {
    destroyTabs(chart.svg);
  }

  chart.refreshDots = () => {
    computeYAixs(chart); // 选择了tab，切换其他线，需要重新计算y轴
    chart.render();
  };

  chart.resize = () => {
    setWidth.call(chart);
    chart.labels.resize?.();
    computeXAixs(chart); // 宽度发生了变化，x轴需要重新计算
    if (chart.layout.width > 0) {
      chart.render();
    }
  };

  chart.animate.draw = () => {
    drawXAxis(chart);
    drawYAxis(chart);
    drawPoint(chart);
  };
}
