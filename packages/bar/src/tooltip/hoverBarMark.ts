import { MessageData } from '../listener';
import { hoverMark } from '@so-chart/tooltip';
import type { BarChartInstance, BarChartType, BaseBarChartInstance } from '@so-chart/types/bar';

export function hoverBarMark(chart: BaseBarChartInstance & { chartType: BarChartType }, data: MessageData) {
  const { chartType } = chart;
  if (chartType === 'bar') {
    const currentChart = chart as BarChartInstance;
    if (currentChart.mark.length > 0) {
      hoverMark(currentChart, data);
    }
  }
}
