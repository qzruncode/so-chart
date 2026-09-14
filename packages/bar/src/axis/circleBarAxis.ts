import type { CircleBarGeometry, CircleStackBarInstance, CircleStackBarXAxisOptions, CircleStackBarYAxisOptions } from '@so-chart/types/bar';
import { D, R, S } from '@so-chart/utils';
import { path, scaleBand, scaleRadial } from 'd3';

export function applyXAxis(axis: CircleStackBarXAxisOptions | undefined) {
  const newAxis = (axis ? Object.assign({}, axis) : {}) as Required<CircleStackBarXAxisOptions>;
  R<Required<CircleStackBarXAxisOptions>, 'data'>(newAxis, 'data', newAxis.data);
  D<Required<CircleStackBarXAxisOptions>, 'lineColor'>(newAxis, 'lineColor', 'rgba(0, 0, 0, 0.1)');
  D<Required<CircleStackBarXAxisOptions>, 'lineWidth'>(newAxis, 'lineWidth', 1);
  S<Required<CircleStackBarXAxisOptions>, 'lineWidth'>(newAxis, 'lineWidth');
  D<Required<CircleStackBarXAxisOptions>, 'lineDash'>(newAxis, 'lineDash', [3, 3]);
  S<Required<CircleStackBarXAxisOptions>, 'lineDash'>(newAxis, 'lineDash');
  D<Required<CircleStackBarXAxisOptions>, 'tickSize'>(newAxis, 'tickSize', 6);
  S<Required<CircleStackBarXAxisOptions>, 'tickSize'>(newAxis, 'tickSize');
  D<Required<CircleStackBarXAxisOptions>, 'fontColor'>(newAxis, 'fontColor', 'rgba(0, 0, 0, 0.5)');
  D<Required<CircleStackBarXAxisOptions>, 'fontSize'>(newAxis, 'fontSize', 12);
  S<Required<CircleStackBarXAxisOptions>, 'fontSize'>(newAxis, 'fontSize');
  D<Required<CircleStackBarXAxisOptions>, 'autoSkip'>(newAxis, 'autoSkip', true);
  D<Required<CircleStackBarXAxisOptions>, 'maxTicks'>(newAxis, 'maxTicks', 12);
  return newAxis;
}

export function applyYAxis(axis: CircleStackBarYAxisOptions | undefined) {
  const newAxis = (axis ? Object.assign({}, axis) : {}) as Required<CircleStackBarYAxisOptions>;
  R<Required<CircleStackBarYAxisOptions>, 'data'>(newAxis, 'data', newAxis.data);
  D<Required<CircleStackBarYAxisOptions>, 'interval'>(newAxis, 'interval', 100);
  D<Required<CircleStackBarYAxisOptions>, 'ticks'>(newAxis, 'ticks', 5);
  D<Required<CircleStackBarYAxisOptions>, 'lineColor'>(newAxis, 'lineColor', 'rgba(0, 0, 0, 0.1)');
  D<Required<CircleStackBarYAxisOptions>, 'lineWidth'>(newAxis, 'lineWidth', 1);
  S<Required<CircleStackBarYAxisOptions>, 'lineWidth'>(newAxis, 'lineWidth');
  D<Required<CircleStackBarYAxisOptions>, 'lineDash'>(newAxis, 'lineDash', [3, 3]);
  S<Required<CircleStackBarYAxisOptions>, 'lineDash'>(newAxis, 'lineDash');
  D<Required<CircleStackBarYAxisOptions>, 'fontColor'>(newAxis, 'fontColor', 'rgba(0, 0, 0, 0.5)');
  D<Required<CircleStackBarYAxisOptions>, 'fontSize'>(newAxis, 'fontSize', 12);
  S<Required<CircleStackBarYAxisOptions>, 'fontSize'>(newAxis, 'fontSize');
  return newAxis;
}

export function computeXAixs(chart: CircleStackBarInstance) {
  const range = [0, 2 * Math.PI] as const;
  const { scaleFunc, intervalData } = initXAxis(chart.xAxis, range);
  chart.xScaleFunc = scaleFunc;
  chart.xIntervalData = intervalData;
}

export function computeYAixs(chart: CircleStackBarInstance) {
  const { scale } = chart;
  const { width, left, right, height, top, bottom } = chart.layout;
  const w = Math.max(width - left - right, 0);
  const h = Math.max(height - top - bottom, 0);
  const availableRadius = Math.min(w, h) / 2;
  const requestedOuterRadius = chart.outerRadius == undefined ? availableRadius : chart.outerRadius * scale;
  const outerRadius = Math.min(Math.max(requestedOuterRadius, 0), availableRadius);
  const minRadialThickness = Math.min(outerRadius, Math.max(32 * scale, outerRadius * 0.25));
  const requestedInnerRadius = chart.innerRadius == undefined ? outerRadius * 0.55 : chart.innerRadius * scale;
  const innerRadius = Math.min(Math.max(requestedInnerRadius, 0), Math.max(outerRadius - minRadialThickness, 0));

  chart.innerRadiusValue = innerRadius;
  chart.outerRadiusValue = outerRadius;

  const range = [innerRadius, outerRadius] as const;
  const { scaleFunc, intervalData } = initYAxis(chart.yAxis, range);
  chart.yScaleFunc = scaleFunc;
  chart.yIntervalData = intervalData;
}

export function computeCircleBarGeometry(chart: CircleStackBarInstance) {
  const { xScaleFunc, xIntervalData, innerRadiusValue, outerRadiusValue, bar } = chart;
  const bandwidth = xScaleFunc.bandwidth();
  const radius = Math.max((innerRadiusValue + outerRadiusValue) / 2, 1);
  const slotWidth = radius * bandwidth;
  const preferredGap = Math.max(bar.gap, 0);
  const adaptiveGap = Math.min(preferredGap, slotWidth * 0.35);
  const minimumWidth = Math.min(slotWidth, Math.max(bar.minWidth, 1));
  const availableWidth = Math.max(slotWidth - adaptiveGap, 0);
  const barWidth = Math.max(minimumWidth, Math.min(Math.max(bar.maxWidth, minimumWidth), availableWidth));
  const barBandwidth = Math.min(bandwidth, barWidth / radius);

  const geometry: CircleBarGeometry[] = xIntervalData.map((tick, index) => {
    const slotStartAngle = xScaleFunc(tick) ?? 0;
    const centerAngle = slotStartAngle + bandwidth / 2;
    return {
      index,
      slotStartAngle,
      slotEndAngle: slotStartAngle + bandwidth,
      startAngle: centerAngle - barBandwidth / 2,
      endAngle: centerAngle + barBandwidth / 2,
      centerAngle,
    };
  });

  chart.barGeometry = geometry;
  return geometry;
}

export function initXAxis(axis: Required<CircleStackBarXAxisOptions>, range: readonly [number, number]) {
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

export function initYAxis(axis: Required<CircleStackBarYAxisOptions>, range: readonly [number, number]) {
  let domain, intervalData;
  if (Array.isArray(axis.data)) {
    domain = [axis.data[0], axis.data[axis.data.length - 1]];
    intervalData = axis.data;
  } else {
    domain = [axis.data.start, axis.data.end];
    intervalData = generateIntervalData(axis.data.start, axis.data.end, axis.interval);
  }
  const scaleFunc = scaleRadial();
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

export function drawXAxis(chart: CircleStackBarInstance) {
  const { offscreenCanvas, xScaleFunc, xAxis, layout, innerRadiusValue, textPadding, barGeometry } = chart;
  const context = offscreenCanvas.getContext('2d');
  if (context) {
    context.imageSmoothingEnabled = true;
    const ticks = xAxis.data;
    const { height, width } = layout;
    const viewboxCenter_x = width / 2;
    const viewboxCenter_y = height / 2;
    const bandwidth = xScaleFunc.bandwidth();
    const tickStep = xAxis.autoSkip ? Math.max(1, Math.ceil(ticks.length / Math.max(1, xAxis.maxTicks))) : 1;

    ticks.forEach((tick, index) => {
      if (index % tickStep !== 0) {
        return;
      }

      const pathInstance = path();
      pathInstance.moveTo(0, 0);
      pathInstance.lineTo(-xAxis.tickSize, 0);
      const path2D = new Path2D(pathInstance.toString());
      context.save();
      context.translate(viewboxCenter_x, viewboxCenter_y);
      context.strokeStyle = xAxis.lineColor;
      context.fillStyle = xAxis.fontColor;
      context.lineWidth = xAxis.lineWidth;
      context.setLineDash(xAxis.lineDash);
      context.font = `${xAxis.fontSize}px auto`;

      const angle = barGeometry?.[index]?.centerAngle ?? (xScaleFunc(tick) ?? 0) + bandwidth / 2;
      context.rotate(angle);
      context.translate(innerRadiusValue, 0);
      context.stroke(path2D);
      const textWidth = context.measureText(tick).width;
      context.textBaseline = 'middle';
      if (angle > Math.PI / 2 && angle < (Math.PI * 3) / 2) {
        context.rotate(Math.PI);
        context.fillText(tick, textPadding, 0);
      } else {
        context.rotate(0);
        context.fillText(tick, -(textWidth + textPadding), 0);
      }
      context.restore();
    });
  }
}

export function drawYAxis(chart: CircleStackBarInstance) {
  const { offscreenCanvas, layout, yAxis, yScaleFunc } = chart;
  const { height, width } = layout;
  const context = offscreenCanvas.getContext('2d');
  if (context) {
    context.imageSmoothingEnabled = true;
    const ticks = yScaleFunc.ticks(yAxis.ticks);
    const viewboxCenter_x = width / 2;
    const viewboxCenter_y = height / 2;
    ticks.forEach(d => {
      const pathInstance = path();
      const r = yScaleFunc(d);
      pathInstance.arc(0, 0, r, 0, Math.PI * 2);
      const path2D = new Path2D(pathInstance.toString());
      context.save();
      context.translate(viewboxCenter_x, viewboxCenter_y);
      context.strokeStyle = yAxis.lineColor;
      context.fillStyle = yAxis.fontColor;
      context.lineWidth = yAxis.lineWidth;
      context.setLineDash(yAxis.lineDash);
      context.textBaseline = 'bottom';
      context.textAlign = 'center';
      context.font = `${yAxis.fontSize}px auto`;
      context.stroke(path2D);
      context.fillText(d.toString(), 0, -r);
      context.restore();
    });
  }
}
