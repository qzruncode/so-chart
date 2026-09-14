import type { PointDataset, PointXAxisOptions, PointYAxisOptions } from '@so-chart/types/point';
import type { ColorSystem } from '@so-chart/types/common';
import { D, getColor, S } from '@so-chart/utils';
import { extent } from 'd3';

export function applyXAxis(axis: PointXAxisOptions) {
  const newAxis = (axis ? Object.assign({}, axis) : {}) as Required<PointXAxisOptions>;
  D<Required<PointXAxisOptions>, 'type'>(newAxis, 'type', 'date');
  const format = newAxis.type === 'mapping' ? '' : newAxis.type === 'date' ? '%H:%M:%S' : '~s';
  D<Required<PointXAxisOptions>, 'format'>(newAxis, 'format', format);
  D<Required<PointXAxisOptions>, 'interval'>(newAxis, 'interval', 1000);
  const ticks = newAxis.type === 'mapping' ? (newAxis.data as Array<string>).length : 5; // mapping类型是一对一映射
  D<Required<PointXAxisOptions>, 'ticks'>(newAxis, 'ticks', ticks);
  D<Required<PointXAxisOptions>, 'lineColor'>(newAxis, 'lineColor', 'rgba(0, 0, 0, 0.1)');
  D<Required<PointXAxisOptions>, 'fontColor'>(newAxis, 'fontColor', 'rgba(0, 0, 0, 0.5)');
  D<Required<PointXAxisOptions>, 'lineWidth'>(newAxis, 'lineWidth', 1);
  D<Required<PointXAxisOptions>, 'lineDash'>(newAxis, 'lineDash', [3, 3]);
  D<Required<PointXAxisOptions>, 'tickSize'>(newAxis, 'tickSize', 6);
  D<Required<PointXAxisOptions>, 'fontSize'>(newAxis, 'fontSize', 12);
  D<Required<PointXAxisOptions>, 'showAixsText'>(newAxis, 'showAixsText', true);
  D<Required<PointXAxisOptions>, 'showSplitLine'>(newAxis, 'showSplitLine', true);
  S<Required<PointXAxisOptions>, 'lineWidth'>(newAxis, 'lineWidth');
  S<Required<PointXAxisOptions>, 'lineDash'>(newAxis, 'lineDash');
  S<Required<PointXAxisOptions>, 'tickSize'>(newAxis, 'tickSize');
  S<Required<PointXAxisOptions>, 'fontSize'>(newAxis, 'fontSize');
  return newAxis;
}

export function applyYAxis(axis: PointYAxisOptions, datasets: PointDataset[]) {
  const newAxis = (axis ? Object.assign({}, axis) : {}) as Required<PointYAxisOptions>;
  D<Required<PointYAxisOptions>, 'type'>(newAxis, 'type', 'value');
  D<Required<PointYAxisOptions>, 'format'>(newAxis, 'format', '~s');
  D<Required<PointYAxisOptions>, 'unitText'>(newAxis, 'unitText', '');
  D<Required<PointYAxisOptions>, 'interval'>(newAxis, 'interval', 1000);
  D<Required<PointYAxisOptions>, 'ticks'>(newAxis, 'ticks', 5);
  D<Required<PointYAxisOptions>, 'lineColor'>(newAxis, 'lineColor', 'rgba(0, 0, 0, 0.1)');
  D<Required<PointYAxisOptions>, 'fontColor'>(newAxis, 'fontColor', 'rgba(0, 0, 0, 0.5)');
  D<Required<PointYAxisOptions>, 'lineWidth'>(newAxis, 'lineWidth', 1);
  D<Required<PointYAxisOptions>, 'lineDash'>(newAxis, 'lineDash', [3, 3]);
  D<Required<PointYAxisOptions>, 'tickSize'>(newAxis, 'tickSize', 6);
  D<Required<PointYAxisOptions>, 'fontSize'>(newAxis, 'fontSize', 12);
  D<Required<PointYAxisOptions>, 'showAixsText'>(newAxis, 'showAixsText', true);
  D<Required<PointYAxisOptions>, 'showSplitLine'>(newAxis, 'showSplitLine', true);
  S<Required<PointYAxisOptions>, 'lineWidth'>(newAxis, 'lineWidth');
  S<Required<PointYAxisOptions>, 'lineDash'>(newAxis, 'lineDash');
  S<Required<PointYAxisOptions>, 'tickSize'>(newAxis, 'tickSize');
  S<Required<PointYAxisOptions>, 'fontSize'>(newAxis, 'fontSize');

  // 自动缩放y轴范围
  const [min = 0, max = 0] = extent<number>(
    datasets
      .map(d => d.data)
      .flat(1)
      .filter(d => d != undefined || d != null) as number[]
  );
  D<Required<PointYAxisOptions>, 'data'>(newAxis, 'data', {
    start: Math.min(min, 0),
    end: max === min ? max + 1 : max,
  });

  return newAxis;
}

export function applyPointChartDatasets(datasets: Array<PointDataset>, cs?: ColorSystem) {
  const newDatasets: Array<Required<PointDataset>> = [];
  datasets?.forEach((d, i) => {
    const nd = Object.assign({}, d) as Required<PointDataset>;
    const color = getColor({ i, cs });
    D<Required<PointDataset>, 'label'>(nd, 'label', '');
    D<Required<PointDataset>, 'dotColor'>(nd, 'dotColor', color);
    D<Required<PointDataset>, 'dotType'>(nd, 'dotType', 'fill');
    D<Required<PointDataset>, 'dotSize'>(nd, 'dotSize', 2);
    D<Required<PointDataset>, 'lineWidth'>(nd, 'lineWidth', 1);
    D<Required<PointDataset>, 'show'>(nd, 'show', true);
    S<Required<PointDataset>, 'dotSize'>(nd, 'dotSize');
    S<Required<PointDataset>, 'lineWidth'>(nd, 'lineWidth');
    newDatasets.push(nd);
  });
  return newDatasets;
}
