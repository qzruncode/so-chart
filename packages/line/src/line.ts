import getPartIndexs from './utils';
import { curveLinear, curveMonotoneX, line, map, path } from 'd3';
import type { LineChartInstance, LineDataset } from '@so-chart/types/line';
import { calculatePathLength } from '@so-chart/utils';

export function getLinesPath(
  chart: LineChartInstance,
  missLinesDatasets: Required<LineDataset>[],
  straightLinesDatasets: Required<LineDataset>[],
  zeroLinesDatasets: Required<LineDataset>[]
) {
  const { xScaleFunc, yScaleFunc, xIntervalData, smooth } = chart;
  const lineInstance = line<LineDataset['data'][number]>();
  lineInstance.defined(d => d != null && !isNaN(d));
  lineInstance.x((_d, i) => xScaleFunc(xIntervalData[i]));
  lineInstance.y(d => yScaleFunc(d as number));
  if (smooth) {
    lineInstance.curve(curveMonotoneX);
  }

  const missLinesPaths = missLinesDatasets.map(missLine => {
    const len = missLine.data.length;
    const data = missLine.data.slice(0, len);
    const path = lineInstance(data);
    if (typeof path === 'string') {
      return path;
    }
  });

  const straightLinesPaths = straightLinesDatasets.map(straightLine => {
    const len = straightLine.data.length;
    const data = straightLine.data.slice(0, len);
    const I = map(data, (_d, i) => i);
    const D = map(data, d => d != null && !isNaN(d));
    const lineInstance = line<number>();
    lineInstance.defined(i => D[i]);
    lineInstance.x(i => xScaleFunc(xIntervalData[i]));
    lineInstance.y(i => yScaleFunc(data[i] as number));
    lineInstance.curve(smooth ? curveMonotoneX : curveLinear);
    const nonEmptyPath = lineInstance(I);
    lineInstance.curve(curveLinear);
    const partIndexs = getPartIndexs(I, D);
    const emptyPaths = new Path2D();
    if (partIndexs.length > 0) {
      partIndexs.forEach(indexs => {
        const path = lineInstance(indexs);
        if (path) {
          emptyPaths.addPath(new Path2D(path));
        }
      });
    }
    if (typeof nonEmptyPath === 'string') {
      return [nonEmptyPath, emptyPaths] as [string, Path2D];
    }
  });

  lineInstance.defined(() => true);
  lineInstance.y(d => yScaleFunc(d != null && !isNaN(d) ? d : 0));
  const zeroLinesPaths = zeroLinesDatasets.map(zeroLine => {
    const len = zeroLine.data.length;
    const data = zeroLine.data.slice(0, len);
    const path = lineInstance(data);
    if (typeof path === 'string') {
      return path;
    }
  });

  return { missLinesPaths, straightLinesPaths, zeroLinesPaths };
}

export function drawMissLinesOrZeroLinesPath(params: {
  context: OffscreenCanvasRenderingContext2D;
  dataset: Required<LineDataset>[];
  paths: (string | undefined)[];
  progress: number;
  scale: number;
}) {
  const { context, dataset, paths, progress, scale } = params;
  context.save();
  context.lineCap = 'round';
  context.lineJoin = 'round';

  dataset.forEach((d, i) => {
    context.setLineDash(d.missing === 'straight' && d.missingType === 'dotted' ? d.lineDash : []);
    context.lineWidth = d.lineWidth;
    context.strokeStyle = d.lineColor;
    const path = paths[i];
    if (path) {
      const pathLen = calculatePathLength(path) * scale;
      context.setLineDash([pathLen, pathLen]);
      context.lineDashOffset = pathLen - progress * pathLen;
    }
    const path2D = new Path2D(path);
    if (path) {
      context.stroke(path2D);
    }
  });
  context.restore();
}

export function drawStraightLinesPath(params: {
  context: OffscreenCanvasRenderingContext2D;
  dataset: Required<LineDataset>[];
  paths: ([string, Path2D] | undefined)[];
  progress: number;
  scale: number;
}) {
  const { context, dataset, paths, progress, scale } = params;
  context.save();
  context.lineCap = 'round';
  context.lineJoin = 'round';

  dataset.forEach((d, i) => {
    context.lineWidth = d.lineWidth;
    context.strokeStyle = d.lineColor;
    const pathArr = paths[i];
    if (pathArr) {
      const [path, pathDot] = pathArr;
      if (path) {
        context.save();
        const path2D = new Path2D(path);
        const pathLen = calculatePathLength(path) * scale;
        context.setLineDash([pathLen, pathLen]);
        context.lineDashOffset = pathLen - progress * pathLen;
        context.stroke(path2D);
        context.restore();
      }
      if (pathDot) {
        context.setLineDash(d.missing === 'straight' && d.missingType === 'dotted' ? d.lineDash : []);
        context.stroke(pathDot);
      }
    }
  });
  context.restore();
}

export function drawPoints(chart: LineChartInstance, context: OffscreenCanvasRenderingContext2D, dataset: Required<LineDataset>[]) {
  const { xScaleFunc, yScaleFunc, xIntervalData, animate } = chart;
  const progress = animate.progress;
  context.save();
  dataset.forEach(data => {
    context.fillStyle = data.lineColor;
    const pathInstance = path();
    const len = data.data.length;
    const ds = data.data.slice(0, len * progress);

    ds.forEach((d, i) => {
      if (d != null && !isNaN(d)) {
        const x = xScaleFunc(xIntervalData[i]);
        const y = yScaleFunc(d);
        pathInstance.arc(x, y, data.dotSize, 0, Math.PI * 2);
        pathInstance.closePath();
      }
    });
    const path2D = new Path2D(pathInstance.toString());
    context.fill(path2D);
  });
  context.restore();
}
