import type { TrendBarInstance } from '@so-chart/types/bar';
import { extent, scaleBand, scaleLinear } from 'd3';

export function computeXAixs(chart: TrendBarInstance) {
  const range = [chart.layout.left, chart.layout.width - chart.layout.right] as const;
  const domain = chart.datasets.data.map((_d, i) => i);
  const { scaleFunc, intervalData } = initXAxis(domain, range);
  chart.xScaleFunc = scaleFunc;
  chart.xIntervalData = intervalData;
}

export function computeYAixs(chart: TrendBarInstance) {
  const range = [chart.layout.height - chart.layout.bottom, chart.layout.top] as const;
  const values = extent<number>(chart.datasets.data.filter(({ data: d }) => d != undefined || d != null).map(d => d.data) as number[]);
  const domain = [0, values[1] ?? 100];

  const { scaleFunc, intervalData } = initYAxis(domain, range);
  chart.yScaleFunc = scaleFunc;
  chart.yIntervalData = intervalData;
}

function initXAxis(axisData: number[], range: readonly [number, number]) {
  const domain = axisData;
  const intervalData = axisData;
  const scaleFunc = scaleBand<number>();
  scaleFunc.domain(domain);
  scaleFunc.range(range);
  return {
    scaleFunc,
    intervalData,
  };
}

function initYAxis(axisData: number[], range: readonly [number, number]) {
  const domain = axisData;
  const intervalData = axisData;

  const scaleFunc = scaleLinear<number, number>();
  scaleFunc.domain(domain);
  scaleFunc.range(range);
  scaleFunc.nice();
  return {
    scaleFunc,
    intervalData,
  };
}
