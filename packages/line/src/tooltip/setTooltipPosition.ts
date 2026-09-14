import type { LineChartInstance } from '@so-chart/types/line';
import { getLineChartExposedData } from './getExposedDataAndDraw';
import { drawCross, drawTooltip } from '@so-chart/tooltip';

export function setTooltipPosition(chart: LineChartInstance) {
  const { tooltip, chartType } = chart;
  if (tooltip?.index > 0 && chartType === 'line') {
    // 目前只有折线图有此需求
    const lineChart = chart as LineChartInstance & { chartType: 'Line' };
    const data = getLineChartExposedData(lineChart, tooltip.index);
    const exposedDatas = data.data;
    const x = data.x;
    const evtData = {
      position: [data.x, 0],
    };
    drawCross({
      chart: lineChart,
      data: evtData,
      exposedDatas,
      x,
    });
    drawTooltip({
      chart: lineChart,
      data: evtData,
      exposedData: exposedDatas,
      xData: data.xData,
    });
  }
}
