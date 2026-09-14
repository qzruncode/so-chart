import type { BaseLineChartInstance, LineChartInstance } from '@so-chart/types/line';
import { MessageData } from '../listener';
import { hoverMark } from '@so-chart/tooltip';

export function hoverLineMark(chart: BaseLineChartInstance, data: MessageData) {
  const { chartType, mark } = chart;
  if (mark.length > 0) {
    if (chartType === 'line') {
      const currentChart = chart as LineChartInstance;
      hoverMark(currentChart, data);
    }
  }
}
