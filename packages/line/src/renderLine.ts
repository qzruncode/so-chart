import type { LineChartInstance, LineOptions } from '@so-chart/types/line';
import { computeXAixs, computeYAixs, drawXAxis, drawYAxis } from './lineAxis';
import { drawLine } from './drawLine';
import { setWidth } from './size';
import getStackDatasets from './getStackDatasets';
import { applyLineChart, applyLineChartDatasets, applyMark, applyXAxis, applyYAxis } from './normal';
import { applyAnimate, applyCross, applyLabels, applyTooltip } from '@so-chart/utils';
import { destroyTabs, drawTabs } from '@so-chart/tabs';
import { setTooltipPosition } from './tooltip/setTooltipPosition';
import { drawMark } from '@so-chart/tooltip';
import { drawVoronoi } from './drawVoronoi';

export default function renderLine(chart: LineChartInstance, options: LineOptions) {
  const { xAxis, yAxis, datasets, labels, cross, tooltip, animate, mark } = options;
  applyLineChart(chart, options);
  if (chart.stack) {
    getStackDatasets(options); // 堆叠图需要提前累加计算
  }
  chart.xAxis = applyXAxis(xAxis);
  chart.yAxis = applyYAxis(yAxis, datasets);
  chart.animate = applyAnimate(animate);
  computeXAixs(chart);
  computeYAixs(chart);
  chart.datasets = applyLineChartDatasets(datasets, chart.cs);
  chart.cross = applyCross(cross);
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

  chart.refreshLine = () => {
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
    setTooltipPosition(chart); // 用户指定了tooltip.index则需要设置位置
    if (chart.layout.width > 0) {
      chart.render();
    }
  };

  chart.animate.draw = () => {
    drawXAxis(chart);
    drawYAxis(chart);
    drawMark(chart);
    drawLine(chart);
    if (chart.voronoi) {
      drawVoronoi(chart);
    }
  };
}
