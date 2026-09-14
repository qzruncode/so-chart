import type {
  BarChartInstance,
  BarChartType,
  BarDatasetWithStack,
  BaseBarChartInstance,
  CircleStackBarInstance,
  TrendBarInstance,
} from '@so-chart/types/bar';
import { ExposedData, MessageData } from '../listener';
import { drawChoosedBar } from '../draw/drawBar';
import { drawTooltip } from '@so-chart/tooltip';
import { drawChoosedTrendBar } from '../draw/drawTrendBar';
import { presentCanvasFrame } from '@so-chart/utils';

function getExposedDataAndDraw(chart: BaseBarChartInstance & { chartType: BarChartType }, evtData: MessageData) {
  const { chartType, tooltip } = chart;
  if (chartType === 'bar') {
    const currentChart = chart as BarChartInstance;
    const { offscreenCanvas } = currentChart;
    const context = offscreenCanvas.getContext('2d');
    if (context) {
      context.imageSmoothingEnabled = true;
      const [x] = evtData.position;
      let indexPaths: [number, number] | undefined;
      let nearestBar: { indexPaths: [number, number]; distance: number } | undefined;
      currentChart.barPos?.forEach((pos, i) => {
        const hit = findNearestBar(pos, x);
        if (hit == undefined) return;
        if (hit.inside) {
          indexPaths = [i, hit.index];
        }
        if (nearestBar == undefined || hit.distance < nearestBar.distance) {
          nearestBar = { indexPaths: [i, hit.index], distance: hit.distance };
        }
      });
      if (indexPaths == undefined && nearestBar && nearestBar.distance <= currentChart.xScaleFunc.bandwidth() / 2) {
        indexPaths = nearestBar.indexPaths;
      }
      drawChoosedBar({
        chart: currentChart,
        indexPaths,
        eventName: evtData.eventName,
      });
      let exposedDatas;
      if (indexPaths != undefined) {
        exposedDatas = getBarChartExposedData(currentChart, indexPaths);
      }
      const tooltipParams = {
        chart,
        data: evtData,
        exposedData: exposedDatas?.data ?? [],
        xData: exposedDatas?.xData,
      };
      if (tooltip?.show) {
        drawTooltip(tooltipParams);
      }
      return tooltipParams.exposedData;
    }
  } else if (chartType === 'circleStackBar') {
    const currentChart = chart as CircleStackBarInstance;
    const { offscreenCanvas, animate, canvas } = currentChart;
    const context = offscreenCanvas.getContext('2d');
    if (context) {
      context.imageSmoothingEnabled = true;

      const exposedDatas = getCircleStackBarChartExposedData(currentChart, evtData.position);
      const previousIndex = currentChart.exposedDatas?.[0]?.index;
      const nextIndex = exposedDatas[0]?.index;
      const isSelectionChanged = previousIndex !== nextIndex;
      currentChart.exposedDatas = exposedDatas;

      if (animate.progress === 1 && isSelectionChanged) {
        // 没有动画此时在执行，必须手动render
        animate.draw();
        presentCanvasFrame(canvas, offscreenCanvas);
      }

      const tooltipParams = { chart, data: evtData, exposedData: exposedDatas };
      if (tooltip?.show) {
        drawTooltip(tooltipParams);
      }
    }
  } else if (chartType === 'trend') {
    const currentChart = chart as TrendBarInstance;
    const [x] = evtData.position;
    const hit = currentChart.barHitTree?.find(x, 0, currentChart.xScaleFunc.bandwidth() / 2);
    const index = hit?.index;

    drawChoosedTrendBar({
      chart: currentChart,
      index,
      eventName: evtData.eventName,
    });

    let exposedDatas;
    if (index != undefined) {
      exposedDatas = getTrendBarChartExposedData(currentChart, index);
    }

    const tooltipParams = {
      chart,
      data: evtData,
      exposedData: exposedDatas?.data ?? [],
      xData: exposedDatas?.xData,
    };

    if (tooltip?.show) {
      drawTooltip(tooltipParams);
    }
    return tooltipParams.exposedData;
  }
}

export default getExposedDataAndDraw;

function findNearestBar(pos: { s: number; e: number }[], x: number) {
  if (pos.length === 0) return;

  let low = 0;
  let high = pos.length - 1;
  while (low <= high) {
    const middle = (low + high) >> 1;
    const candidate = pos[middle];
    if (x < candidate.s) {
      high = middle - 1;
    } else if (x > candidate.e) {
      low = middle + 1;
    } else {
      return { index: middle, distance: 0, inside: true };
    }
  }

  const candidates = [Math.max(0, high), Math.min(pos.length - 1, low)];
  let nearest = candidates[0];
  let distance = distanceToBar(pos[nearest], x);
  for (let i = 1; i < candidates.length; i += 1) {
    const candidate = candidates[i];
    const candidateDistance = distanceToBar(pos[candidate], x);
    if (candidateDistance < distance) {
      nearest = candidate;
      distance = candidateDistance;
    }
  }

  return { index: nearest, distance, inside: false };
}

function distanceToBar(bar: { s: number; e: number }, x: number) {
  return Math.abs(x - (bar.s + bar.e) / 2);
}

function getBarChartExposedData(chart: BarChartInstance, dataPath: [number, number]) {
  const exposedDatas: ExposedData[] = [];
  const [i, j] = dataPath;
  const { xScaleFunc, xIntervalData, datasets, yScaleFunc } = chart;
  const showDatasets = datasets.filter(d => d.show === true);
  const rx = xScaleFunc(xIntervalData[i]);

  if (chart.stack) {
    showDatasets.forEach(d => {
      const dy = (d as BarDatasetWithStack[number]).stackData[j];
      const ry = dy != null ? yScaleFunc(dy) : undefined;
      exposedDatas.push({
        x: rx ?? 0,
        y: ry ?? 0,
        index: j,
        data: d,
      });
    });
  } else {
    const bars = showDatasets[i];
    const dy = bars.data[j];
    const ry = dy != null ? yScaleFunc(dy) : undefined;
    if (ry != undefined) {
      exposedDatas.push({
        x: rx ?? 0,
        y: ry,
        index: j,
        data: bars,
      });
    }
  }

  return { data: exposedDatas, xData: xIntervalData[j], x: rx };
}

function getCircleStackBarChartExposedData(chart: CircleStackBarInstance, positions: number[]) {
  const { layout, datasets, innerRadiusValue, outerRadiusValue, barGeometry } = chart;
  const { height, width } = layout;
  const viewboxCenter_x = width / 2;
  const viewboxCenter_y = height / 2;
  const position = [positions[0] - viewboxCenter_x, positions[1] - viewboxCenter_y];
  const [x, y] = position;
  const radius = Math.hypot(x, y);
  if (radius < innerRadiusValue || radius > outerRadiusValue) {
    return [];
  }

  let angle = Math.atan2(y, x);
  angle = (angle + Math.PI * 2) % (Math.PI * 2);
  const hit = findCircleBarHit(barGeometry, angle);
  if (hit == undefined) {
    return [];
  }

  const exposedDatas: ExposedData[] = [];
  const showDatasets = datasets.filter(d => d.show === true);
  showDatasets.forEach(dataset => {
    exposedDatas.push({
      x,
      y,
      index: hit.index,
      data: dataset,
    });
  });
  return exposedDatas;
}

function findCircleBarHit(barGeometry: CircleStackBarInstance['barGeometry'], angle: number) {
  const hit = barGeometry.find(item => angle >= item.startAngle && angle <= item.endAngle);
  if (hit != undefined) {
    return hit;
  }

  const nearest = barGeometry.reduce<{ item: CircleStackBarInstance['barGeometry'][number]; distance: number } | undefined>((nearestItem, item) => {
    const distance = Math.min(Math.abs(angle - item.centerAngle), Math.PI * 2 - Math.abs(angle - item.centerAngle));
    if (nearestItem == undefined || distance < nearestItem.distance) {
      return { item, distance };
    }
    return nearestItem;
  }, undefined);

  return nearest?.item;
}

function getTrendBarChartExposedData(chart: TrendBarInstance, index: number) {
  const exposedDatas: ExposedData[] = [];
  const { xScaleFunc, xIntervalData, datasets, yScaleFunc } = chart;
  const rx = xScaleFunc(xIntervalData[index]);
  const { data, label } = datasets.data[index];
  const ry = data != null ? yScaleFunc(data) : undefined;
  if (ry != undefined) {
    exposedDatas.push({
      x: rx ?? 0,
      y: ry,
      index,
      data: Object.assign({}, datasets, { data: datasets.data.map(d => d.data) }),
    });
  }

  return { data: exposedDatas, xData: label, x: rx };
}
