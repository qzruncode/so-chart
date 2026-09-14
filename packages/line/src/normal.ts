import type { ColorSystem, DeepRequired, MarkOption, RequiredMarkOption } from '@so-chart/types/common';
import type { LineChartInstance, LineDataset, LineOptions, LineXAxisOptions, LineYAxisOptions } from '@so-chart/types/line';
import { D, getColor, S } from '@so-chart/utils';
import { extent } from 'd3';

export function applyLineChart(chart: LineChartInstance, options: LineOptions) {
  const { stack, area, smooth, showPoint, voronoi } = options;
  D<LineChartInstance, 'stack'>(chart, 'stack', !!stack);
  D<LineChartInstance, 'area'>(chart, 'area', !!area);
  D<LineChartInstance, 'smooth'>(chart, 'smooth', !!smooth);
  D<LineChartInstance, 'showPoint'>(chart, 'showPoint', !!showPoint);
  D<LineChartInstance, 'voronoi'>(chart, 'voronoi', !!voronoi);
}

export function applyLineChartDatasets(datasets: Array<LineDataset>, cs?: ColorSystem) {
  const newDatasets: Array<Required<LineDataset>> = [];
  datasets?.forEach((d, i) => {
    const nd = Object.assign({}, d) as Required<LineDataset>;
    const color = getColor({ i, cs });
    D<Required<LineDataset>, 'label'>(nd, 'label', '');
    D<Required<LineDataset>, 'missing'>(nd, 'missing', 'miss');
    D<Required<LineDataset>, 'missingType'>(nd, 'missingType', 'dotted');
    D<Required<LineDataset>, 'lineColor'>(nd, 'lineColor', color);
    D<Required<LineDataset>, 'lineDash'>(nd, 'lineDash', [1, 3]);
    D<Required<LineDataset>, 'lineWidth'>(nd, 'lineWidth', 1);
    D<Required<LineDataset>, 'dotSize'>(nd, 'dotSize', 2);
    D<Required<LineDataset>, 'show'>(nd, 'show', true);
    S<Required<LineDataset>, 'lineDash'>(nd, 'lineDash');
    S<Required<LineDataset>, 'lineWidth'>(nd, 'lineWidth');
    S<Required<LineDataset>, 'dotSize'>(nd, 'dotSize');
    newDatasets.push(nd);
  });
  return newDatasets;
}

export function applyXAxis(axis: LineXAxisOptions) {
  const newAxis = (axis ? Object.assign({}, axis) : {}) as Required<LineXAxisOptions>;
  D<Required<LineXAxisOptions>, 'type'>(newAxis, 'type', 'date');
  const format = newAxis.type === 'mapping' ? '' : newAxis.type === 'date' ? '%H:%M:%S' : '~s';
  D<Required<LineXAxisOptions>, 'format'>(newAxis, 'format', format);
  D<Required<LineXAxisOptions>, 'interval'>(newAxis, 'interval', 1000);
  const ticks = newAxis.type === 'mapping' ? (newAxis.data as Array<string>).length : 5; // mapping类型是一对一映射
  D<Required<LineXAxisOptions>, 'ticks'>(newAxis, 'ticks', ticks);
  D<Required<LineXAxisOptions>, 'lineColor'>(newAxis, 'lineColor', 'rgba(0, 0, 0, 0.1)');
  D<Required<LineXAxisOptions>, 'fontColor'>(newAxis, 'fontColor', 'rgba(0, 0, 0, 0.5)');
  D<Required<LineXAxisOptions>, 'lineWidth'>(newAxis, 'lineWidth', 1);
  D<Required<LineXAxisOptions>, 'lineDash'>(newAxis, 'lineDash', [3, 3]);
  D<Required<LineXAxisOptions>, 'tickSize'>(newAxis, 'tickSize', 6);
  D<Required<LineXAxisOptions>, 'fontSize'>(newAxis, 'fontSize', 12);
  D<Required<LineXAxisOptions>, 'showAixsText'>(newAxis, 'showAixsText', true);
  D<Required<LineXAxisOptions>, 'showSplitLine'>(newAxis, 'showSplitLine', true);
  S<Required<LineXAxisOptions>, 'lineWidth'>(newAxis, 'lineWidth');
  S<Required<LineXAxisOptions>, 'lineDash'>(newAxis, 'lineDash');
  S<Required<LineXAxisOptions>, 'tickSize'>(newAxis, 'tickSize');
  S<Required<LineXAxisOptions>, 'fontSize'>(newAxis, 'fontSize');
  return newAxis;
}

export function applyYAxis(axis: LineYAxisOptions, datasets: Array<LineDataset>) {
  const newAxis = (axis ? Object.assign({}, axis) : {}) as DeepRequired<LineYAxisOptions>;
  newAxis.title = applyYAxisTitle(newAxis.title);
  D<Required<LineYAxisOptions>, 'type'>(newAxis, 'type', 'value');
  D<Required<LineYAxisOptions>, 'format'>(newAxis, 'format', '~s');
  D<Required<LineYAxisOptions>, 'unitText'>(newAxis, 'unitText', '');
  D<Required<LineYAxisOptions>, 'interval'>(newAxis, 'interval', 1000);
  D<Required<LineYAxisOptions>, 'ticks'>(newAxis, 'ticks', 5);
  D<Required<LineYAxisOptions>, 'lineColor'>(newAxis, 'lineColor', 'rgba(0, 0, 0, 0.1)');
  D<Required<LineYAxisOptions>, 'fontColor'>(newAxis, 'fontColor', 'rgba(0, 0, 0, 0.5)');
  D<Required<LineYAxisOptions>, 'lineWidth'>(newAxis, 'lineWidth', 1);
  D<Required<LineYAxisOptions>, 'lineDash'>(newAxis, 'lineDash', [3, 3]);
  D<Required<LineYAxisOptions>, 'tickSize'>(newAxis, 'tickSize', 6);
  D<Required<LineYAxisOptions>, 'fontSize'>(newAxis, 'fontSize', 12);
  D<Required<LineYAxisOptions>, 'showAixsText'>(newAxis, 'showAixsText', true);
  D<Required<LineYAxisOptions>, 'showSplitLine'>(newAxis, 'showSplitLine', true);
  S<Required<LineYAxisOptions>, 'lineWidth'>(newAxis, 'lineWidth');
  S<Required<LineYAxisOptions>, 'lineDash'>(newAxis, 'lineDash');
  S<Required<LineYAxisOptions>, 'tickSize'>(newAxis, 'tickSize');
  S<Required<LineYAxisOptions>, 'fontSize'>(newAxis, 'fontSize');

  // 自动缩放y轴范围
  const [min = 0, max = 0] = extent<number>(
    datasets
      .map(d => d.data)
      .flat(1)
      .filter(d => d != undefined || d != null) as number[]
  );
  D<Required<LineYAxisOptions>, 'data'>(newAxis, 'data', {
    start: Math.min(min, 0),
    end: max === min ? max + 1 : max,
  });

  return newAxis;
}

export function applyMark(params: { mark?: MarkOption; cs?: ColorSystem }) {
  const { mark, cs } = params;
  const newMark: RequiredMarkOption = [];
  mark?.forEach((d, i) => {
    const nd = Object.assign({}, d) as RequiredMarkOption[number];
    const color = getColor({ i, cs });
    if (nd.type === 'line') {
      D<typeof nd, 'lineColor'>(nd, 'lineColor', color);
      D<typeof nd, 'lineWidth'>(nd, 'lineWidth', 1);
      D<typeof nd, 'lineDash'>(nd, 'lineDash', [3, 3]);
      S<typeof nd, 'lineWidth'>(nd, 'lineWidth');
      S<typeof nd, 'lineDash'>(nd, 'lineDash');
    } else if (nd.type === 'point') {
      D<typeof nd, 'dotType'>(nd, 'dotType', 'fill');
      D<typeof nd, 'dotSize'>(nd, 'dotSize', 2);
      D<typeof nd, 'dotColor'>(nd, 'dotColor', color);
      S<typeof nd, 'dotSize'>(nd, 'dotSize');
    }
    newMark.push(nd);
  });
  return newMark;
}

function applyYAxisTitle(title: LineYAxisOptions['title']) {
  type TitleOption = Required<NonNullable<LineYAxisOptions['title']>>;
  const newTitle = (title ? Object.assign({}, title) : {}) as TitleOption;
  D<TitleOption, 'text'>(newTitle, 'text', '');
  D<TitleOption, 'fontColor'>(newTitle, 'fontColor', 'rgba(0, 0, 0, 0.5)');
  D<TitleOption, 'fontSize'>(newTitle, 'fontSize', 14);
  S<TitleOption, 'fontSize'>(newTitle, 'fontSize');
  return newTitle;
}
