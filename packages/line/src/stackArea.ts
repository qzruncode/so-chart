import getPartIndexs from './utils';
import { area, color, curveLinear, curveMonotoneX, map } from 'd3';
import type { LineChartInstance, LineDatasetsWithStack } from '@so-chart/types/line';

export function getStackAreasPath(
  chart: LineChartInstance,
  missLinesDatasets: LineDatasetsWithStack,
  straightLinesDatasets: LineDatasetsWithStack,
  zeroLinesDatasets: LineDatasetsWithStack
) {
  const { xScaleFunc, yScaleFunc, xIntervalData, smooth } = chart;
  const areaInstance = area<LineDatasetsWithStack[number]['stackData'][number]>();
  areaInstance.defined(d => d != null && !isNaN(d));
  areaInstance.x((_d, i) => xScaleFunc(xIntervalData[i]));
  areaInstance.y1(d => yScaleFunc(d as number));
  if (smooth) {
    areaInstance.curve(curveMonotoneX);
  }

  const missLinesPaths = missLinesDatasets.map(missLine => {
    const data = missLine.data.slice(0, missLine.data.length);
    const stackData = missLine.stackData.slice(0, missLine.stackData.length);
    areaInstance.y0((d, i) => yScaleFunc((d ?? 0) - (data[i] ?? 0)));
    const path = areaInstance(stackData);
    if (typeof path === 'string') {
      const path2D = new Path2D(path);
      return path2D;
    }
  });
  const straightLinesPaths = straightLinesDatasets.map(straightLine => {
    const data = straightLine.data.slice(0, straightLine.data.length);
    const stackData = straightLine.stackData.slice(0, straightLine.stackData.length);
    const I = map(stackData, (_d, i) => i);
    const D = map(data, d => d != null && !isNaN(d));
    const areaInstance = area<number>();
    areaInstance.defined(i => D[i]);
    areaInstance.x(i => xScaleFunc(xIntervalData[i]));
    areaInstance.y1(i => yScaleFunc(stackData[i] ?? 0));
    areaInstance.y0(i => yScaleFunc((stackData[i] ?? 0) - (data[i] ?? 0)));
    areaInstance.curve(smooth ? curveMonotoneX : curveLinear);
    const nonEmptyPath = areaInstance(I);
    areaInstance.curve(curveLinear);
    const partIndexs = getPartIndexs(I, D);
    const emptyPaths = new Path2D();
    if (partIndexs.length > 0) {
      partIndexs.forEach(indexs => {
        const path = areaInstance(indexs);
        if (path) {
          emptyPaths.addPath(new Path2D(path));
        }
      });
    }
    if (typeof nonEmptyPath === 'string') {
      return [new Path2D(nonEmptyPath), emptyPaths];
    }
  });
  areaInstance.defined(() => true);
  areaInstance.x((_d, i) => xScaleFunc(xIntervalData[i]));
  areaInstance.y1(d => yScaleFunc(d ?? 0));
  const zeroLinesPaths = zeroLinesDatasets.map(zeroLine => {
    const data = zeroLine.data.slice(0, zeroLine.data.length);
    const stackData = zeroLine.stackData.slice(0, zeroLine.stackData.length);
    areaInstance.y0((d, i) => yScaleFunc((d ?? 0) - (data[i] ?? 0)));
    const path = areaInstance(stackData);
    if (typeof path === 'string') {
      const path2D = new Path2D(path);
      return path2D;
    }
  });

  return { missLinesPaths, straightLinesPaths, zeroLinesPaths };
}

export function drawMissLinesOrZeroLinesPathWithStack(
  context: OffscreenCanvasRenderingContext2D,
  dataset: LineDatasetsWithStack,
  paths: (Path2D | undefined)[],
  progress: number
) {
  context.save();
  context.lineCap = 'round';
  context.lineJoin = 'round';
  dataset.forEach((d, i) => {
    const path = paths[i];
    const colorInstance = color(d.lineColor);
    if (colorInstance) {
      colorInstance.opacity = colorInstance.opacity * progress;
      context.fillStyle = colorInstance.formatHex8();
      if (path) {
        context.fill(path);
      }
    }
  });
  context.restore();
}

export function drawStraightLinesPathWithStack(
  context: OffscreenCanvasRenderingContext2D,
  dataset: LineDatasetsWithStack,
  paths: (Path2D[] | undefined)[],
  progress: number
) {
  context.save();
  context.lineCap = 'round';
  context.lineJoin = 'round';
  dataset.forEach((d, i) => {
    const colorInstance = color(d.lineColor);
    if (colorInstance) {
      colorInstance.opacity = colorInstance.opacity * progress;
      context.fillStyle = colorInstance.formatHex8();

      const pathArr = paths[i];
      if (pathArr) {
        const [path, pathDot] = pathArr;
        context.fill(path);
        const colorInstance = color(d.lineColor);
        if (colorInstance) {
          colorInstance.opacity = colorInstance.opacity * 0.5;
          context.fillStyle = colorInstance.formatHex8();
          context.fill(pathDot);
        }
      }
    }
  });
  context.restore();
}
