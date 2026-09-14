import type { BarChartType, BaseBarChartInstance } from '@so-chart/types/bar';
import { ExposedData, MessageData } from '../listener';
import getBarExposedDataAndDraw from './getExposedDataAndDraw';

export function hoverTooltip(chart: BaseBarChartInstance & { chartType: BarChartType }, data: MessageData) {
  const { listeners } = chart;
  const { eventName } = data;
  const exposedDatas = getBarExposedDataAndDraw(chart, data);
  if (listeners) {
    listeners[eventName]?.forEach(listener => {
      (listener as (exposedDatas?: ExposedData[]) => void)(exposedDatas);
    });
  }
}
