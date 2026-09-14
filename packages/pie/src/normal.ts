import type { HoverText, PieChartInstance, PieDataset, PieOptions } from '@so-chart/types/pie';
import type { ColorSystem } from '@so-chart/types/common';
import { D, getColor, S } from '@so-chart/utils';

export function applyPieChart(chart: PieChartInstance, options: PieOptions) {
  const { radius, innerRadius, shadowBlur, fontSize, startAngle, endAngle, datasets, hoverText, position } = options;
  D<PieChartInstance, 'radius'>(chart, 'radius', radius ?? 100);
  D<PieChartInstance, 'innerRadius'>(chart, 'innerRadius', innerRadius ?? 0);
  D<PieChartInstance, 'shadowBlur'>(chart, 'shadowBlur', shadowBlur ?? 6);
  D<PieChartInstance, 'fontSize'>(chart, 'fontSize', fontSize ?? 12);
  D<PieChartInstance, 'startAngle'>(chart, 'startAngle', startAngle ?? 0);
  D<PieChartInstance, 'endAngle'>(chart, 'endAngle', endAngle ?? Math.PI * 2);

  S<PieChartInstance, 'radius'>(chart, 'radius');
  S<PieChartInstance, 'innerRadius'>(chart, 'innerRadius');
  S<PieChartInstance, 'shadowBlur'>(chart, 'shadowBlur');
  S<PieChartInstance, 'fontSize'>(chart, 'fontSize');

  chart.datasets = applyPieChartDatasets(datasets, chart.radius, chart.cs);
  chart.hoverText = applyPieChartHoverText(hoverText);
  chart.position = applyPieChartPosition(position);
}

function applyPieChartDatasets(datasets: PieDataset[], radius: number, cs?: ColorSystem) {
  const newDatasets: Array<Required<PieDataset>> = [];
  datasets?.forEach((d, i) => {
    const nd = Object.assign({}, d) as Required<PieDataset>;
    const color = getColor({ i, cs });
    D<Required<PieDataset>, 'label'>(nd, 'label', '');
    D<Required<PieDataset>, 'backgroundColor'>(nd, 'backgroundColor', color);
    D<Required<PieDataset>, 'show'>(nd, 'show', true);
    D<Required<PieDataset>, 'labelRadius'>(nd, 'labelRadius', radius * 1.1);
    newDatasets.push(nd);
  });
  return newDatasets;
}

function applyPieChartHoverText(hoverText?: HoverText) {
  const newAxis = (hoverText ? Object.assign({}, hoverText) : {}) as Required<HoverText>;
  D<Required<HoverText>, 'type'>(newAxis, 'type', 'lead');
  D<Required<HoverText>, 'unit'>(newAxis, 'unit', '');
  D<Required<HoverText>, 'totalText'>(newAxis, 'totalText', '');

  D<Required<HoverText>, 'labelColor'>(newAxis, 'labelColor', 'rgba(0, 0, 0, 0.5)');
  D<Required<HoverText>, 'labelFontSize'>(newAxis, 'labelFontSize', 12);
  D<Required<HoverText>, 'dataFontSize'>(newAxis, 'dataFontSize', 18);
  S<Required<HoverText>, 'labelFontSize'>(newAxis, 'labelFontSize');
  S<Required<HoverText>, 'dataFontSize'>(newAxis, 'dataFontSize');
  return newAxis;
}

function applyPieChartPosition(position?: PieOptions['position']) {
  type Position = PieChartInstance['position'];
  const newPosition = (position ? Object.assign({}, position) : {}) as Position;
  D<Position, 'x'>(newPosition, 'x', 'center');
  D<Position, 'y'>(newPosition, 'y', 'center');

  return newPosition;
}
