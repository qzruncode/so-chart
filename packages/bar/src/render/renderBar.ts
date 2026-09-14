import type { BarChartInstance, BarOptions } from '@so-chart/types/bar';
import { applyXAxis, applyYAxis, computeXAixs, computeYAixs, drawXAxis, drawYAxis } from '../axis/barAxis';
import { applyAnimate, applyLabels, applyMark, applyTooltip } from '@so-chart/utils';
import { destroyTabs, drawTabs } from '@so-chart/tabs';
import { drawBar } from '../draw/drawBar';
import { applyBarChartBarOptions, applyBarChartDatasets } from '../normal';
import { setWidth } from '../size';
import getStackDatasets from '../getStackDatasets';
import { drawMark } from '@so-chart/tooltip';

export default function renderBar(chart: BarChartInstance, options: BarOptions) {
  const { xAxis, yAxis, animate, bar, datasets, tooltip, labels, stack, mark } = options;
  chart.stack = !!stack;
  if (chart.stack) {
    getStackDatasets(options); // 堆叠图需要提前累加计算
  }
  chart.xAxis = applyXAxis(xAxis);
  chart.yAxis = applyYAxis(yAxis, datasets);
  computeXAixs(chart);
  computeYAixs(chart);
  chart.animate = applyAnimate(animate);
  chart.bar = applyBarChartBarOptions(bar);
  chart.datasets = applyBarChartDatasets(datasets, chart.cs);
  chart.tooltip = applyTooltip(tooltip);
  chart.labels = applyLabels({
    labels,
    defaultLableData: options.datasets.map(d => d.label ?? ''),
  });
  chart.mark = applyMark({
    mark,
    cs: chart.cs,
  });
  if (chart.labels.show) {
    drawTabs(chart);
  } else {
    destroyTabs(chart.svg);
  }

  chart.refreshBar = () => {
    if (chart.stack) {
      getStackDatasets(chart); // 堆叠图需要提前累加计算
    }
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
    drawMark(chart);
    drawBar(chart);
  };
}
