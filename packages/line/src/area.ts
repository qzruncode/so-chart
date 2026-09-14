import getPartIndexs from './utils';
import { area, color, curveLinear, curveMonotoneX, map, scaleLinear } from 'd3';
import type { LineChartInstance, LineDataset } from '@so-chart/types/line';

export function getLinesAreaPath(
  chart: LineChartInstance,
  missLinesDatasets: Required<LineDataset>[],
  straightLinesDatasets: Required<LineDataset>[],
  zeroLinesDatasets: Required<LineDataset>[]
) {
  const { xScaleFunc, yScaleFunc, xIntervalData, smooth, animate } = chart;
  const progress = animate.progress;
  const areaInstance = area<LineDataset['data'][number]>();
  areaInstance.defined(d => d != null && !isNaN(d));
  areaInstance.x((_d, i) => xScaleFunc(xIntervalData[i]));
  const s = yScaleFunc(yScaleFunc.domain()[0]);

  areaInstance.y0(s);
  areaInstance.y1(d => {
    const linear = scaleLinear([0, 1], [s, yScaleFunc(d as number)]);
    return linear(progress);
  });
  if (smooth) {
    areaInstance.curve(curveMonotoneX);
  }

  const missLinesPaths = missLinesDatasets.map(missLine => {
    const len = missLine.data.length;
    const data = missLine.data.slice(0, len);
    const path = areaInstance(data);
    if (typeof path === 'string') {
      const path2D = new Path2D(path);
      return path2D;
    }
  });

  const straightLinesPaths = straightLinesDatasets.map(straightLine => {
    const len = straightLine.data.length;
    const data = straightLine.data.slice(0, len);
    const I = map(data, (_d, i) => i);
    const D = map(data, d => d != null && !isNaN(d));
    const areaInstance = area<number>();
    areaInstance.x(i => xScaleFunc(xIntervalData[i]));
    areaInstance.y0(() => yScaleFunc(yScaleFunc.domain()[0]));
    areaInstance.y1(i => {
      const linear = scaleLinear([0, 1], [s, yScaleFunc(data[i] ?? 0)]);
      return linear(progress);
    });
    areaInstance.defined(i => D[i]);
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
  areaInstance.y1(d => {
    const linear = scaleLinear([0, 1], [s, yScaleFunc(d ?? 0)]);
    return linear(progress);
  });
  const zeroLinesPaths = zeroLinesDatasets.map(zeroLine => {
    const len = zeroLine.data.length;
    const data = zeroLine.data.slice(0, len);
    const path = areaInstance(data);
    if (typeof path === 'string') {
      const path2D = new Path2D(path);
      return path2D;
    }
  });

  return { missLinesPaths, straightLinesPaths, zeroLinesPaths };
}

export function drawMissLinesOrZeroLinesAreaPath(params: {
  context: OffscreenCanvasRenderingContext2D;
  dataset: Required<LineDataset>[];
  paths: (Path2D | undefined)[];
  progress: number;
  height: number;
}) {
  const { context, dataset, paths, progress, height } = params;
  context.save();
  context.lineCap = 'round';
  context.lineJoin = 'round';
  dataset.forEach((d, i) => {
    const path = paths[i];
    const gd = getGradient({
      colorStr: d.lineColor,
      context,
      height,
      progress,
    });
    if (gd) {
      context.fillStyle = gd;
      if (path) {
        context.fill(path);
      }
    }
  });
  context.restore();
}

export function drawStraightLinesAreaPath(params: {
  context: OffscreenCanvasRenderingContext2D;
  dataset: Required<LineDataset>[];
  paths: (Path2D[] | undefined)[];
  progress: number;
  height: number;
}) {
  const { context, dataset, paths, progress, height } = params;
  context.save();
  context.lineCap = 'round';
  context.lineJoin = 'round';
  dataset.forEach((d, i) => {
    const pathArr = paths[i];
    if (pathArr) {
      const [path, pathDot] = pathArr;
      {
        const colorInstance = color(d.lineColor);
        if (colorInstance) {
          colorInstance.opacity = colorInstance.opacity * 0.6 * progress;
          const gd = getGradient({
            colorStr: colorInstance.formatHex8(),
            context,
            height,
            progress,
          });
          if (gd) {
            context.fillStyle = gd;
          }
          context.fill(path);
        }
      }
      {
        const colorInstance = color(d.lineColor);
        if (colorInstance) {
          colorInstance.opacity = colorInstance.opacity * 0.3 * progress;
          const gd = getGradient({
            colorStr: colorInstance.formatHex8(),
            context,
            height,
            progress,
          });
          if (gd) {
            context.fillStyle = gd;
          }
          context.fill(pathDot);
        }
      }
    }
  });
  context.restore();
}

function getGradient(params: { colorStr: string; context: OffscreenCanvasRenderingContext2D; height: number; progress: number }) {
  const { colorStr, context, height, progress } = params;
  const sc = color(colorStr);
  const ec = color(colorStr);
  if (sc && ec) {
    const gradient = context.createLinearGradient(0, 0, 0, height);
    sc.opacity = sc.opacity * 0.6 * progress;
    ec.opacity = 0;
    gradient.addColorStop(0, sc.formatHex8()); // 开始颜色
    gradient.addColorStop(1, ec.formatHex8()); // 结束颜色
    return gradient;
  }
}
