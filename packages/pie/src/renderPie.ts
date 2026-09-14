import type { PieChartInstance, PieOptions } from '@so-chart/types/pie';
import { drawPie } from './drawPie';
import { setWidth } from './size';
import { applyAnimate, applyLabels, applyTooltip } from '@so-chart/utils';
import { applyPieChart } from './normal';
import { destroyTabs, drawTabs } from '@so-chart/tabs';

export default function renderPie(chart: PieChartInstance, options: PieOptions) {
  const { labels, tooltip, animate } = options;
  applyPieChart(chart, options);
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

  chart.refreshPie = () => {
    chart.render();
  };

  chart.resize = () => {
    setWidth.call(chart);
    chart.labels.resize?.();
    if (chart.layout.width > 0) {
      chart.render();
    }
  };

  chart.animate.draw = () => {
    drawPie(chart);
  };
}
