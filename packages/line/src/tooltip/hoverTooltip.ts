import type { BaseLineChartInstance, ExposedData } from '@so-chart/types/line';
import { getExposedDataAndDraw } from './getExposedDataAndDraw';
import { MessageData } from '../listener';

export function hoverTooltip(chart: BaseLineChartInstance, data: MessageData) {
  const { listeners } = chart;
  const { eventName } = data;
  const exposedDatas = getExposedDataAndDraw(chart, data);
  if (listeners) {
    listeners[eventName]?.forEach(listener => {
      (listener as (exposedDatas?: ExposedData[]) => void)(exposedDatas);
    });
  }
}
