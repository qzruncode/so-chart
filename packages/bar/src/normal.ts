import type {
  BarDataset,
  BarOptions,
  BarYAxisOptions,
  CircleStackBarDataset,
  CircleStackBarInstance,
  CircleStackBarOptions,
  TrendBarOptions,
  TrendDataset,
} from '@so-chart/types/bar';
import type { ColorSystem } from '@so-chart/types/common';
import { D, getColor, S } from '@so-chart/utils';

export function applyBarChartBarOptions(bar?: BarOptions['bar']) {
  type BarChartBarOptions = Required<NonNullable<BarOptions['bar']>>;
  const newBar = (bar ? Object.assign({}, bar) : {}) as BarChartBarOptions;
  D<BarChartBarOptions, 'maxBarWidth'>(newBar, 'maxBarWidth', 25);
  D<BarChartBarOptions, 'barGap'>(newBar, 'barGap', 4);
  D<BarChartBarOptions, 'groupGap'>(newBar, 'groupGap', 4);

  S<BarChartBarOptions, 'maxBarWidth'>(newBar, 'maxBarWidth');
  S<BarChartBarOptions, 'barGap'>(newBar, 'barGap');
  S<BarChartBarOptions, 'groupGap'>(newBar, 'groupGap');
  return newBar;
}

export function applyBarChartDatasets(datasets: Array<BarDataset>, cs?: ColorSystem) {
  const newDatasets: Array<Required<BarDataset>> = [];
  datasets?.forEach((d, i) => {
    const nd = Object.assign({}, d) as Required<BarDataset>;
    const color = getColor({
      i,
      cs,
    });
    D<Required<BarDataset>, 'label'>(nd, 'label', '');
    D<Required<BarDataset>, 'backgroundColor'>(nd, 'backgroundColor', color);
    D<Required<BarDataset>, 'show'>(nd, 'show', true);
    newDatasets.push(nd);
  });
  return newDatasets;
}

export function applyCircleStackBarChart(chart: CircleStackBarInstance, options: CircleStackBarOptions) {
  const { innerRadius, outerRadius, textPadding, datasets, bar } = options;
  D<CircleStackBarInstance, 'innerRadius'>(chart, 'innerRadius', innerRadius);
  D<CircleStackBarInstance, 'outerRadius'>(chart, 'outerRadius', outerRadius);
  D<CircleStackBarInstance, 'textPadding'>(chart, 'textPadding', textPadding ?? 10);
  S<CircleStackBarInstance, 'textPadding'>(chart, 'textPadding');
  chart.bar = applyCircleStackBarBarOptions(bar);
  chart.datasets = applyCircleStackBarChartDatasets(datasets, chart.cs);
}

function applyCircleStackBarBarOptions(bar?: CircleStackBarOptions['bar']) {
  type CircleStackBarBarOptions = Required<NonNullable<CircleStackBarOptions['bar']>>;
  const newBar = (bar ? Object.assign({}, bar) : {}) as CircleStackBarBarOptions;
  D<CircleStackBarBarOptions, 'minWidth'>(newBar, 'minWidth', 2);
  D<CircleStackBarBarOptions, 'maxWidth'>(newBar, 'maxWidth', 24);
  D<CircleStackBarBarOptions, 'gap'>(newBar, 'gap', 2);

  S<CircleStackBarBarOptions, 'minWidth'>(newBar, 'minWidth');
  S<CircleStackBarBarOptions, 'maxWidth'>(newBar, 'maxWidth');
  S<CircleStackBarBarOptions, 'gap'>(newBar, 'gap');
  return newBar;
}

function applyCircleStackBarChartDatasets(datasets: Array<CircleStackBarDataset>, cs?: ColorSystem) {
  const newDatasets: Array<Required<CircleStackBarDataset>> = [];
  datasets?.forEach((d, i) => {
    const nd = Object.assign({}, d) as Required<CircleStackBarDataset>;
    const color = getColor({ i, cs });
    D<Required<CircleStackBarDataset>, 'label'>(nd, 'label', '');
    D<Required<CircleStackBarDataset>, 'backgroundColor'>(nd, 'backgroundColor', color);
    D<Required<CircleStackBarDataset>, 'show'>(nd, 'show', true);
    newDatasets.push(nd);
  });
  return newDatasets;
}

export function applyTrendBarChartBarOptions(bar?: TrendBarOptions['bar']) {
  type TrendBarChartBarOptions = Required<NonNullable<TrendBarOptions['bar']>>;
  const newBar = (bar ? Object.assign({}, bar) : {}) as TrendBarChartBarOptions;
  D<TrendBarChartBarOptions, 'maxBarWidth'>(newBar, 'maxBarWidth', 25);
  D<TrendBarChartBarOptions, 'barGap'>(newBar, 'barGap', 4);

  S<TrendBarChartBarOptions, 'maxBarWidth'>(newBar, 'maxBarWidth');
  S<TrendBarChartBarOptions, 'barGap'>(newBar, 'barGap');
  return newBar;
}

export function applyTrendBarChartDatasets(datasets: TrendDataset, cs?: ColorSystem) {
  const newDatasets = Object.assign({}, datasets) as Required<TrendDataset>;
  const color = getColor({
    i: 0,
    cs,
  });
  D<Required<TrendDataset>, 'label'>(newDatasets, 'label', '');
  D<Required<TrendDataset>, 'backgroundColor'>(newDatasets, 'backgroundColor', color);
  D<Required<TrendDataset>, 'dotColor'>(newDatasets, 'dotColor', color);
  D<Required<TrendDataset>, 'show'>(newDatasets, 'show', true);
  return newDatasets;
}

export function applyYAxisTitle(title: BarYAxisOptions['title']) {
  type TitleOption = Required<NonNullable<BarYAxisOptions['title']>>;
  const newTitle = (title ? Object.assign({}, title) : {}) as TitleOption;
  D<TitleOption, 'text'>(newTitle, 'text', '');
  D<TitleOption, 'fontColor'>(newTitle, 'fontColor', 'rgba(0, 0, 0, 0.5)');
  D<TitleOption, 'fontSize'>(newTitle, 'fontSize', 14);
  S<TitleOption, 'fontSize'>(newTitle, 'fontSize');
  return newTitle;
}
