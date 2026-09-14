import type { BaseCalendarInstance, CalendarHeatmapInstance, CalendarHeatmapOptions } from '@so-chart/types/calendar';
import type { BaseOptions } from '@so-chart/types/common';
import renderHeatmap from './renderHeatmap';

function setOption(this: BaseCalendarInstance, options: BaseOptions): void {
  if (this.chartType === 'heatmap') {
    renderHeatmap(this as CalendarHeatmapInstance, options as CalendarHeatmapOptions);
  }
}

export default setOption;
