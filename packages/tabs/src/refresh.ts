import { extent } from 'd3';
import { CommonChart } from '.';

export function refreshChartWithAxis(
  index: number | undefined,
  chart: CommonChart,
  _range: { start: number; end: number } | { start: Date; end: Date } | Array<number> | Array<Date> | Array<string>
) {
  const { datasets, yAxis } = chart;
  if (index === undefined) {
    datasets.forEach(d => (d.show = true));
    yAxis!.data = _range;
  } else {
    if (chart.chartType === 'radar') {
      const dataset = datasets[index];
      dataset.show = !dataset.show;
      const visibleDatasets = datasets.filter(d => d.show);
      if (visibleDatasets.length > 0) {
        const extentValues = [] as number[];
        visibleDatasets.forEach(d => {
          const data = (d.data as (null | undefined | number)[]).filter(v => v != null) as number[];
          extentValues.push(...(extent(data) as [number, number]));
        });
        const [start, end] = extent(extentValues) as [number, number];
        if (start !== end) {
          yAxis!.data = { start: 0, end };
        } else {
          if (start === 0) {
            // 开始和结束都是0
            yAxis!.data = { start: 0, end: 100 };
          } else {
            // 开始和结束一样，但不为0
            yAxis!.data = { start: 0, end };
          }
        }
      }
      //
    } else {
      const dataset = datasets[index];
      const data = (dataset.data as (null | undefined | number)[]).filter(d => d != null) as number[];
      if (datasets.length > 1) {
        // datasets有元素才重新计算y轴范围
        const [start, end] = extent(data) as [number, number];
        if (start !== end) {
          yAxis!.data = { start, end };
        } else {
          if (start === 0) {
            // 开始和结束都是0
            yAxis!.data = { start: 0, end: 100 };
          } else {
            // 开始和结束一样，但不为0
            yAxis!.data = { start: 0, end };
          }
        }
      }
      datasets.forEach(d => (d.show = false));
      dataset.show = true;
    }
  }

  if (chart.chartType === 'line') {
    chart.refreshLine?.();
  }
  if (chart.chartType === 'bar' || chart.chartType === 'circleStackBar') {
    chart.refreshBar?.();
  }
  if (chart.chartType === 'point') {
    chart.refreshDots?.();
  }
  if (chart.chartType === 'radar') {
    chart.refreshRadar?.();
  }
}

export function refreshChartWithoutAxis(index: number | undefined, chart: CommonChart) {
  const { datasets } = chart;
  if (index === undefined) {
    datasets.forEach(d => (d.show = true));
  } else {
    const dataset = datasets[index];
    dataset.show = !dataset.show;
  }
  if (chart.chartType === 'pie') {
    chart.refreshPie?.();
  }
}
