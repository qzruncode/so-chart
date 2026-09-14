import type { RadarInstance, RadarXAxisOptions, RadarYAxisOptions } from '@so-chart/types/radar';
import { D, R, S } from '@so-chart/utils';
import { path, pointRadial, scaleBand, scaleLinear } from 'd3';

export function applyXAxis(axis: RadarXAxisOptions | undefined) {
  const newAxis = (axis ? Object.assign({}, axis) : {}) as Required<RadarXAxisOptions>;
  D<Required<RadarXAxisOptions>, 'lineColor'>(newAxis, 'lineColor', 'rgba(0, 0, 0, 0.1)');
  D<Required<RadarXAxisOptions>, 'fontColor'>(newAxis, 'fontColor', 'rgba(0, 0, 0, 0.5)');
  D<Required<RadarXAxisOptions>, 'lineWidth'>(newAxis, 'lineWidth', 1);
  D<Required<RadarXAxisOptions>, 'lineDash'>(newAxis, 'lineDash', [3, 3]);
  D<Required<RadarXAxisOptions>, 'fontSize'>(newAxis, 'fontSize', 12);
  R<Required<RadarXAxisOptions>, 'data'>(newAxis, 'data', (newAxis as RadarXAxisOptions).data);
  S<Required<RadarXAxisOptions>, 'lineWidth'>(newAxis, 'lineWidth');
  S<Required<RadarXAxisOptions>, 'lineDash'>(newAxis, 'lineDash');
  S<Required<RadarXAxisOptions>, 'fontSize'>(newAxis, 'fontSize');
  return newAxis;
}

export function applyYAxis(axis: RadarYAxisOptions | undefined) {
  const newAxis = (axis ? Object.assign({}, axis) : {}) as Required<RadarYAxisOptions>;
  D<Required<RadarYAxisOptions>, 'ticks'>(newAxis, 'ticks', 5);
  D<Required<RadarYAxisOptions>, 'interval'>(newAxis, 'interval', 100);
  D<Required<RadarYAxisOptions>, 'lineColor'>(newAxis, 'lineColor', 'rgba(0, 0, 0, 0.1)');
  D<Required<RadarYAxisOptions>, 'fontColor'>(newAxis, 'fontColor', 'rgba(0, 0, 0, 0.5)');
  D<Required<RadarYAxisOptions>, 'lineWidth'>(newAxis, 'lineWidth', 1);
  D<Required<RadarYAxisOptions>, 'lineDash'>(newAxis, 'lineDash', [3, 3]);
  D<Required<RadarYAxisOptions>, 'fontSize'>(newAxis, 'fontSize', 12);
  R<Required<RadarYAxisOptions>, 'data'>(newAxis, 'data', (newAxis as RadarYAxisOptions).data);
  S<Required<RadarYAxisOptions>, 'lineWidth'>(newAxis, 'lineWidth');
  S<Required<RadarYAxisOptions>, 'lineDash'>(newAxis, 'lineDash');
  S<Required<RadarYAxisOptions>, 'fontSize'>(newAxis, 'fontSize');
  return newAxis;
}

export function computeXAixs(chart: RadarInstance) {
  const range = [0, 2 * Math.PI] as const;
  const { scaleFunc, intervalData } = initXAxis(chart.xAxis, range);
  chart.xScaleFunc = scaleFunc;
  chart.xIntervalData = intervalData;
}

export function computeYAixs(chart: RadarInstance) {
  const { radius, layout } = chart;
  const { width, left, right } = layout;
  const maxRadius = width - left - right;
  const range = [0, Math.min(radius, maxRadius / 2)] as const;
  const { scaleFunc, intervalData } = initYAxis(chart.yAxis, range);
  chart.yScaleFunc = scaleFunc;
  chart.yIntervalData = intervalData;
}

function initXAxis(axis: Required<RadarXAxisOptions>, range: readonly [number, number]) {
  const domain = axis.data;
  const intervalData = axis.data;
  const scaleFunc = scaleBand();
  scaleFunc.domain(domain);
  scaleFunc.range(range);
  return {
    scaleFunc,
    intervalData,
  };
}

function initYAxis(axis: Required<RadarYAxisOptions>, range: readonly [number, number]) {
  const data = axis.data;
  const domain = [data.start, data.end];
  const intervalData = generateIntervalData(data.start, data.end, axis.interval);

  const scaleFunc = scaleLinear<number, number>();
  scaleFunc.domain(domain);
  scaleFunc.range(range);
  scaleFunc.nice();
  return {
    scaleFunc,
    intervalData,
  };
}

function generateIntervalData(start: number, end: number, interval: number) {
  const xd: number[] = [];
  let sd = start as number;
  const ed = end as number;
  while (sd <= ed) {
    xd.push(sd);
    sd = sd + interval;
  }
  return xd;
}

export function drawXAxis(chart: RadarInstance) {
  const { offscreenCanvas, layout, xIntervalData, xScaleFunc, xAxis, textPadding } = chart;
  const { height, width, left, right } = layout;
  const context = offscreenCanvas.getContext('2d');
  if (context) {
    context.imageSmoothingEnabled = true;
    const viewboxCenter_x = width / 2;
    const viewboxCenter_y = height / 2;
    const maxRadius = width - left - right;
    const radius = Math.min(chart.radius, maxRadius / 2);

    xIntervalData.forEach(d => {
      const angle = xScaleFunc(d) ?? 0;
      const [x, y] = pointRadial(angle, radius);
      context.save();
      context.translate(viewboxCenter_x, viewboxCenter_y);
      context.lineWidth = xAxis.lineWidth;
      {
        context.save();
        const pathInstance = path();
        pathInstance.moveTo(0, 0);
        pathInstance.lineTo(x, y);
        const path2D = new Path2D(pathInstance.toString());
        context.strokeStyle = xAxis.lineColor;
        context.setLineDash(xAxis.lineDash);
        context.stroke(path2D);
        context.restore();
      }

      {
        context.save();
        context.fillStyle = xAxis.fontColor;
        context.font = `${xAxis.fontSize}px auto`;
        context.textBaseline = 'middle';
        context.textAlign = 'center';
        const [tx, ty] = pointRadial(angle, radius + textPadding);
        context.fillText(d, Math.floor(tx), Math.floor(ty));
        context.restore();
      }

      context.restore();
    });
  }
}

export function drawYAxis(chart: RadarInstance) {
  const { offscreenCanvas, layout, yAxis, yScaleFunc, scale } = chart;
  const { height, width } = layout;
  const ticks = yScaleFunc.ticks(yAxis.ticks);
  const context = offscreenCanvas.getContext('2d');
  if (context) {
    context.imageSmoothingEnabled = true;
    const viewboxCenter_x = width / 2;
    const viewboxCenter_y = height / 2;
    ticks.forEach((tick, i) => {
      context.save();
      context.translate(viewboxCenter_x, viewboxCenter_y);
      context.lineWidth = yAxis.lineWidth;
      const r = yScaleFunc(tick);

      {
        context.save();
        const pathInstance = path();
        pathInstance.arc(0, 0, r, 0, Math.PI * 2);
        const path2D = new Path2D(pathInstance.toString());
        context.strokeStyle = yAxis.lineColor;
        context.setLineDash(yAxis.lineDash);
        context.stroke(path2D);
        context.restore();
      }

      {
        context.save();
        context.fillStyle = yAxis.fontColor;
        context.textBaseline = 'bottom';
        context.textAlign = 'left';
        context.font = `${yAxis.fontSize}px auto`;
        if (i < ticks.length - 1) {
          context.fillText(tick.toString(), 2 * scale, -r);
        }
        context.restore();
      }

      context.restore();
    });
  }
}
