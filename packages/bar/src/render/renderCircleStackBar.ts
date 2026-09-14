import type { CircleStackBarInstance, CircleStackBarOptions } from '@so-chart/types/bar';
import getStackDatasets from '../getStackDatasets';
import { applyCircleStackBarChart } from '../normal';
import { applyAnimate, applyLabels, applyTooltip } from '@so-chart/utils';
import { applyXAxis, applyYAxis, computeCircleBarGeometry, computeXAixs, computeYAixs, drawXAxis, drawYAxis } from '../axis/circleBarAxis';
import { drawCircleBar } from '../draw/drawCircleBar';
import { setWidth } from '../size';
import { destroyTabs, drawTabs } from '@so-chart/tabs';

export default function renderCircleStackBar(chart: CircleStackBarInstance, options: CircleStackBarOptions) {
  const { xAxis, yAxis, tooltip, animate, labels } = options;
  getStackDatasets(options); // 堆叠图需要提前累加计算
  applyCircleStackBarChart(chart, options);
  chart.xAxis = applyXAxis(xAxis);
  chart.yAxis = applyYAxis(yAxis);
  computeXAixs(chart);
  computeYAixs(chart);
  computeCircleBarGeometry(chart);
  chart.animate = applyAnimate(animate);
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

  chart.refreshBar = () => {
    // canvas所有绘制操作都需要重新绘制
    getStackDatasets(chart); // 堆叠图需要提前累加计算
    computeYAixs(chart); // 选择了tab，切换其他线，需要重新计算y轴
    computeCircleBarGeometry(chart);
    chart.render();
  };

  chart.resize = () => {
    setWidth.call(chart);
    chart.labels.resize?.();
    computeXAixs(chart); // 宽度发生了变化，x轴需要重新计算
    computeYAixs(chart); // 宽度发生了变化，环形半径需要重新计算
    computeCircleBarGeometry(chart);
    if (chart.layout.width > 0) {
      chart.render();
    }
  };

  chart.animate.draw = () => {
    drawXAxis(chart);
    drawYAxis(chart);
    drawCircleBar(chart);
  };
}
