import type { RadarInstance, RadarOptions } from '@so-chart/types/radar';
import { applyAnimate, applyLabels } from '@so-chart/utils';
import { setWidth } from './size';
import { drawRadar } from './drawRadar';
import { applyXAxis, applyYAxis, computeXAixs, computeYAixs, drawXAxis, drawYAxis } from './axis';
import { applyRadarChart } from './normal';
import { destroyTabs, drawTabs } from '@so-chart/tabs';
import { computeRadarRegions } from './geometry';
import { bindRadarListener, refreshRadarListener } from './listener';

export default function renderRadar(chart: RadarInstance, options: RadarOptions) {
  const { labels, xAxis, yAxis, animate } = options;
  applyRadarChart(chart, options);
  chart.animate = applyAnimate(animate);
  chart.xAxis = applyXAxis(xAxis);
  chart.yAxis = applyYAxis(yAxis);
  computeXAixs(chart);
  computeYAixs(chart);
  chart.radarRegions = computeRadarRegions(chart);
  bindRadarListener(chart);
  chart.labels = applyLabels({
    labels,
    defaultLableData: options.datasets.map(d => d.label ?? ''),
  });
  if (chart.labels.show) {
    drawTabs(chart);
  } else {
    destroyTabs(chart.svg);
  }

  chart.refreshRadar = () => {
    computeYAixs(chart);
    chart.radarRegions = computeRadarRegions(chart);
    refreshRadarListener(chart);
    chart.render();
    // 切换还有点问题
  };

  chart.resize = () => {
    setWidth.call(chart);
    chart.labels.resize?.();
    computeYAixs(chart);
    chart.radarRegions = computeRadarRegions(chart);
    refreshRadarListener(chart);
    if (chart.layout.width > 0) {
      chart.render();
    }
  };

  chart.animate.draw = () => {
    drawXAxis(chart);
    drawYAxis(chart);
    drawRadar(chart);
  };
}
