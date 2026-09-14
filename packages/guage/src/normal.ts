import type {
  CircleGuageInstance,
  CircleGuageOptions,
  GuageDataset,
  GuageInstance,
  GuageOptions,
  SingleGuageInstance,
  SingleGuageOptions,
} from '@so-chart/types/guage';
import type { ColorSystem } from '@so-chart/types/common';
import { D, getColor, S } from '@so-chart/utils';

export function applyGuageChart(chart: GuageInstance, options: GuageOptions) {
  const { datasets, innerRadius, outerRadius, value, fontSize, startAngle, endAngle } = options;
  D<GuageInstance, 'innerRadius'>(chart, 'innerRadius', innerRadius ?? [70, 90]);
  D<GuageInstance, 'outerRadius'>(chart, 'outerRadius', outerRadius ?? [100, 110]);
  D<GuageInstance, 'fontSize'>(chart, 'fontSize', fontSize ?? 12);
  D<GuageInstance, 'fontColor'>(chart, 'fontColor', options.fontColor ?? 'rgba(0, 0, 0, 0.5)');
  D<GuageInstance, 'value'>(chart, 'value', value ?? 0);
  D<GuageInstance, 'startAngle'>(chart, 'startAngle', startAngle ?? -Math.PI / 2);
  D<GuageInstance, 'endAngle'>(chart, 'endAngle', endAngle ?? +Math.PI / 2);
  S<GuageInstance, 'innerRadius'>(chart, 'innerRadius');
  S<GuageInstance, 'outerRadius'>(chart, 'outerRadius');
  S<GuageInstance, 'fontSize'>(chart, 'fontSize');

  chart.datasets = applyGuageChartDatasets(datasets, chart.cs);
}

export function applySingleGuageChart(chart: SingleGuageInstance, options: SingleGuageOptions) {
  const { value, showText, fontSize, startAngle, endAngle, radius, cornerRadius, backgroundColor, valueBackgroundColor } = options;
  chart.tooltip = options.tooltip;
  D<SingleGuageInstance, 'radius'>(chart, 'radius', radius ?? [70, 90]);
  D<SingleGuageInstance, 'cornerRadius'>(chart, 'cornerRadius', cornerRadius ?? 5);
  D<SingleGuageInstance, 'fontSize'>(chart, 'fontSize', fontSize ?? 12);
  D<SingleGuageInstance, 'fontColor'>(chart, 'fontColor', options.fontColor ?? 'rgba(0, 0, 0, 0.5)');
  D<SingleGuageInstance, 'value'>(chart, 'value', value ?? 0);
  D<SingleGuageInstance, 'showText'>(chart, 'showText', showText ?? '');
  D<SingleGuageInstance, 'startAngle'>(chart, 'startAngle', startAngle ?? -Math.PI / 2);
  D<SingleGuageInstance, 'endAngle'>(chart, 'endAngle', endAngle ?? +Math.PI / 2);
  D<SingleGuageInstance, 'backgroundColor'>(chart, 'backgroundColor', backgroundColor ?? '#E5EAF5');
  D<SingleGuageInstance, 'valueBackgroundColor'>(chart, 'valueBackgroundColor', valueBackgroundColor ?? getColor({ i: 0, cs: chart.cs }));
  S<SingleGuageInstance, 'radius'>(chart, 'radius');
  S<SingleGuageInstance, 'cornerRadius'>(chart, 'cornerRadius');
  S<SingleGuageInstance, 'fontSize'>(chart, 'fontSize');
  chart.tick = appleSingleGuageTick(options.tick);
}

export function applyCircleGuageChart(chart: CircleGuageInstance, options: CircleGuageOptions) {
  const { value, startAngle, endAngle, radius, backgroundColor, valueBackgroundColor, hollow } = options;
  D<CircleGuageInstance, 'radius'>(chart, 'radius', radius ?? [70, 90]);
  D<CircleGuageInstance, 'value'>(chart, 'value', value ?? 0);
  D<CircleGuageInstance, 'startAngle'>(chart, 'startAngle', startAngle ?? -Math.PI / 2);
  D<CircleGuageInstance, 'endAngle'>(chart, 'endAngle', endAngle ?? +Math.PI / 2);
  D<CircleGuageInstance, 'backgroundColor'>(chart, 'backgroundColor', backgroundColor ?? '#E5EAF5');
  D<CircleGuageInstance, 'valueBackgroundColor'>(chart, 'valueBackgroundColor', valueBackgroundColor ?? getColor({ i: 0, cs: chart.cs }));
  D<CircleGuageInstance, 'hollow'>(chart, 'hollow', hollow ?? true);
  S<CircleGuageInstance, 'radius'>(chart, 'radius');
}

function applyGuageChartDatasets(datasets: Array<GuageDataset>, cs?: ColorSystem) {
  const newDatasets: Array<Required<GuageDataset>> = [];
  datasets?.forEach((d, i) => {
    const nd = Object.assign({}, d) as Required<GuageDataset>;
    const color = getColor({ i, cs });
    D<Required<GuageDataset>, 'backgroundColor'>(nd, 'backgroundColor', color);
    D<Required<GuageDataset>, 'show'>(nd, 'show', true);
    newDatasets.push(nd);
  });
  return newDatasets;
}

function appleSingleGuageTick(tick: SingleGuageOptions['tick']) {
  type TickOption = Required<NonNullable<SingleGuageOptions['tick']>>;
  const newTick = (tick ? Object.assign({}, tick) : {}) as TickOption;
  D<TickOption, 'show'>(newTick, 'show', false);
  D<TickOption, 'tickSize'>(newTick, 'tickSize', 5);
  D<TickOption, 'steps'>(newTick, 'steps', 7);
  D<TickOption, 'lineWidth'>(newTick, 'lineWidth', 1);
  D<TickOption, 'lineColor'>(newTick, 'lineColor', 'black');
  S<TickOption, 'tickSize'>(newTick, 'tickSize');
  return newTick;
}
