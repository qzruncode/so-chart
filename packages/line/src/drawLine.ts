import { drawMissLinesOrZeroLinesPathWithStack, drawStraightLinesPathWithStack, getStackAreasPath } from './stackArea';
import { drawMissLinesOrZeroLinesPath, drawPoints, drawStraightLinesPath, getLinesPath } from './line';
import { drawMissLinesOrZeroLinesAreaPath, drawStraightLinesAreaPath, getLinesAreaPath } from './area';
import type { LineChartInstance, LineDataset, LineDatasetsWithStack } from '@so-chart/types/line';

type LineGeometryCache = {
  datasets: LineChartInstance['datasets'];
  visibilityKey: string;
  xScaleFunc: LineChartInstance['xScaleFunc'];
  yScaleFunc: LineChartInstance['yScaleFunc'];
  xIntervalData: LineChartInstance['xIntervalData'];
  smooth: boolean;
  stack: boolean;
  showDatasets: Required<LineDataset>[];
  missLinesDatasets: Required<LineDataset>[];
  straightLinesDatasets: Required<LineDataset>[];
  zeroLinesDatasets: Required<LineDataset>[];
  linePaths?: ReturnType<typeof getLinesPath>;
  stackPaths?: ReturnType<typeof getStackAreasPath>;
};

const lineGeometryCaches = new WeakMap<LineChartInstance, LineGeometryCache>();

export function drawLine(chart: LineChartInstance) {
  const { offscreenCanvas, stack, area, showPoint, animate, scale, layout } = chart;
  const context = offscreenCanvas.getContext('2d');
  if (context) {
    context.imageSmoothingEnabled = true;
    const geometry = getLineGeometryCache(chart);
    if (stack) {
      const { missLinesDatasets, straightLinesDatasets, zeroLinesDatasets } = geometry as LineGeometryCache & {
        missLinesDatasets: LineDatasetsWithStack;
        straightLinesDatasets: LineDatasetsWithStack;
        zeroLinesDatasets: LineDatasetsWithStack;
      };
      geometry.stackPaths ??= getStackAreasPath(chart, missLinesDatasets, straightLinesDatasets, zeroLinesDatasets);
      const { missLinesPaths, straightLinesPaths, zeroLinesPaths } = geometry.stackPaths;
      drawMissLinesOrZeroLinesPathWithStack(context, missLinesDatasets, missLinesPaths, animate.progress);
      drawStraightLinesPathWithStack(context, straightLinesDatasets, straightLinesPaths, animate.progress);
      drawMissLinesOrZeroLinesPathWithStack(context, zeroLinesDatasets, zeroLinesPaths, animate.progress);
    } else {
      const { missLinesDatasets, straightLinesDatasets, zeroLinesDatasets } = geometry;
      geometry.linePaths ??= getLinesPath(chart, missLinesDatasets, straightLinesDatasets, zeroLinesDatasets);
      {
        const { missLinesPaths, straightLinesPaths, zeroLinesPaths } = geometry.linePaths;
        drawMissLinesOrZeroLinesPath({
          context,
          dataset: missLinesDatasets,
          paths: missLinesPaths,
          progress: animate.progress,
          scale,
        });
        drawStraightLinesPath({
          context,
          dataset: straightLinesDatasets,
          paths: straightLinesPaths,
          progress: animate.progress,
          scale,
        });
        drawMissLinesOrZeroLinesPath({
          context,
          dataset: zeroLinesDatasets,
          paths: zeroLinesPaths,
          progress: animate.progress,
          scale,
        });
        if (showPoint) {
          drawPoints(chart, context, geometry.showDatasets);
        }
      }
      if (area) {
        {
          const { missLinesPaths, straightLinesPaths, zeroLinesPaths } = getLinesAreaPath(
            chart,
            missLinesDatasets,
            straightLinesDatasets,
            zeroLinesDatasets
          );
          drawMissLinesOrZeroLinesAreaPath({
            context,
            dataset: missLinesDatasets,
            paths: missLinesPaths,
            progress: animate.progress,
            height: layout.height,
          });
          drawStraightLinesAreaPath({
            context,
            dataset: straightLinesDatasets,
            paths: straightLinesPaths,
            progress: animate.progress,
            height: layout.height,
          });
          drawMissLinesOrZeroLinesAreaPath({
            context,
            dataset: zeroLinesDatasets,
            paths: zeroLinesPaths,
            progress: animate.progress,
            height: layout.height,
          });
        }
      }
    }
  }
}

function getLineGeometryCache(chart: LineChartInstance) {
  const { datasets, xScaleFunc, yScaleFunc, xIntervalData, smooth, stack } = chart;
  const visibilityKey = datasets.map(dataset => (dataset.show ? '1' : '0')).join('');
  const cached = lineGeometryCaches.get(chart);
  if (
    cached &&
    cached.datasets === datasets &&
    cached.visibilityKey === visibilityKey &&
    cached.xScaleFunc === xScaleFunc &&
    cached.yScaleFunc === yScaleFunc &&
    cached.xIntervalData === xIntervalData &&
    cached.smooth === smooth &&
    cached.stack === stack
  ) {
    return cached;
  }

  const showDatasets = datasets.filter(d => d.show === true);
  const { missLinesDatasets, straightLinesDatasets, zeroLinesDatasets } = getLinesData(showDatasets);
  const nextCache: LineGeometryCache = {
    datasets,
    visibilityKey,
    xScaleFunc,
    yScaleFunc,
    xIntervalData,
    smooth,
    stack,
    showDatasets,
    missLinesDatasets,
    straightLinesDatasets,
    zeroLinesDatasets,
  };
  lineGeometryCaches.set(chart, nextCache);
  return nextCache;
}

function getLinesData(datasets: Required<LineDataset>[]): {
  missLinesDatasets: Required<LineDataset>[];
  straightLinesDatasets: Required<LineDataset>[];
  zeroLinesDatasets: Required<LineDataset>[];
} {
  const missLinesDatasets: Required<LineDataset>[] = [],
    straightLinesDatasets: Required<LineDataset>[] = [],
    zeroLinesDatasets: Required<LineDataset>[] = [];
  datasets.forEach(d => {
    switch (d.missing) {
      case 'miss':
        missLinesDatasets.push(d);
        break;
      case 'straight':
        straightLinesDatasets.push(d);
        break;
      case 'zero':
        zeroLinesDatasets.push(d);
        break;
    }
  });
  return { missLinesDatasets, straightLinesDatasets, zeroLinesDatasets };
}
