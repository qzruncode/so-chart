import { color } from 'd3';
import type { RadarInstance, RadarOptions, RadarDataset, RadarHoverOptions } from '@so-chart/types/radar';
import type { ColorSystem } from '@so-chart/types/common';
import { applyTooltip, D, S, getColor } from '@so-chart/utils';

export function applyRadarChart(chart: RadarInstance, options: RadarOptions) {
  const { radius, textPadding, hover, tooltip, datasets } = options;
  D<RadarInstance, 'radius'>(chart, 'radius', radius);
  D<RadarInstance, 'textPadding'>(chart, 'textPadding', textPadding ?? 10);
  S<RadarInstance, 'radius'>(chart, 'radius');
  S<RadarInstance, 'textPadding'>(chart, 'textPadding');
  chart.hover = applyRadarHover(hover);
  chart.tooltip = applyTooltip(tooltip);
  chart.datasets = applyRadarChartDatasets(datasets, chart.cs);
}

function applyRadarHover(hover?: RadarHoverOptions) {
  const newHover = (hover ? Object.assign({}, hover) : {}) as Required<RadarHoverOptions>;
  D<Required<RadarHoverOptions>, 'opacity'>(newHover, 'opacity', 0.24);
  D<Required<RadarHoverOptions>, 'lineWidth'>(newHover, 'lineWidth', 3);
  D<Required<RadarHoverOptions>, 'color'>(newHover, 'color', '');
  if (!Number.isFinite(newHover.opacity)) {
    newHover.opacity = 0.24;
  }
  newHover.opacity = Math.max(0, Math.min(1, newHover.opacity));
  if (!Number.isFinite(newHover.lineWidth) || newHover.lineWidth < 0) {
    newHover.lineWidth = 3;
  }
  S<Required<RadarHoverOptions>, 'lineWidth'>(newHover, 'lineWidth');
  return newHover;
}

function applyRadarChartDatasets(datasets: RadarDataset[], cs?: ColorSystem) {
  const newDatasets: Required<RadarDataset>[] = [];
  datasets?.forEach((d, i) => {
    const nd = Object.assign({}, d) as Required<RadarDataset>;
    const colorStr = getColor({ i, cs });
    D<Required<RadarDataset>, 'lineColor'>(nd, 'lineColor', colorStr);
    const bc = nd.backgroundColor ?? colorStr;
    const bg = color(bc);
    if (bg) {
      bg.opacity = 0.5;
    }
    nd.backgroundColor = bg ? bg.formatHex8() : bc;
    D<Required<RadarDataset>, 'label'>(nd, 'label', '');
    D<Required<RadarDataset>, 'show'>(nd, 'show', true);
    D<Required<RadarDataset>, 'lineWidth'>(nd, 'lineWidth', 2);
    S<Required<RadarDataset>, 'lineWidth'>(nd, 'lineWidth');
    newDatasets.push(nd);
  });
  return newDatasets;
}
