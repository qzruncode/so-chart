import type { BaseLineChartInstance, ExposedData, LineChartInstance, LineDatasetsWithStack } from '@so-chart/types/line';
import { MessageData } from '../listener';
import { bisectCenter } from 'd3';
import { drawCross, drawTooltip } from '@so-chart/tooltip';

export function getExposedDataAndDraw(chart: BaseLineChartInstance, evtData: MessageData) {
  // 此函数会触发多次
  let exposedDatas: ExposedData[] = [];
  const { chartType, tooltip } = chart;
  if (chartType === 'line') {
    const currentChart = chart as LineChartInstance;
    const data = getLineChartExposedData(currentChart, evtData.position);
    exposedDatas = data.data;
    const x = data.x;
    drawCross({
      chart: currentChart,
      data: evtData,
      exposedDatas,
      x,
    });
    const tooltipParams = {
      chart: currentChart,
      data: evtData,
      exposedData: exposedDatas,
      xData: data.xData,
    };
    if (tooltip?.show) {
      drawTooltip(tooltipParams);
    }
  }
  return exposedDatas;
}

export function getLineChartExposedData(chart: LineChartInstance, positionsOrXIndex: number[] | number) {
  const exposedDatas: ExposedData[] = [];
  const { xScaleFunc, xIntervalData, datasets, yScaleFunc, xAxis } = chart;
  let di: number; // x轴索引位置
  if (typeof positionsOrXIndex === 'number') {
    di = positionsOrXIndex;
  } else {
    const position = [...positionsOrXIndex];
    const xd = xScaleFunc.invert(position[0]); // 根据x鼠标坐标获取x轴实际数据
    di = bisectCenter(xIntervalData as number[], xd as number); // 获取最近的元素索引
  }
  const xData = xIntervalData[di];
  const rx = xScaleFunc(xData); // 根据元素索引得到x轴实际数据，然后计算得出图中的x坐标
  const format = xScaleFunc.tickFormat(xAxis.ticks, xAxis.format) as unknown as (d: number | Date) => string;
  const showDatasets = datasets.filter(d => d.show === true);
  showDatasets.forEach(d => {
    let dy;
    if ((chart as LineChartInstance).stack === true) {
      const nd = d as LineDatasetsWithStack[number];
      dy = nd.stackData[di];
    } else {
      dy = d.data[di]; // 根据索引获取y轴实际数据
    }
    const ry = dy != null ? yScaleFunc(dy) : undefined; // 计算得出图中的y坐标
    if (ry != undefined) {
      exposedDatas.push({
        x: rx,
        y: ry,
        index: di,
        data: d,
      });
    }
  });

  const title = xAxis.type === 'mapping' ? (xAxis.data as string[])[xData as number] : format(xData);
  return { data: exposedDatas, xData: title, x: rx };
}
