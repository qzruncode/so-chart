import type { BarChartInstance, BarDataset, BarXAxisOptions, BarYAxisOptions } from '@so-chart/types/bar';
import { D, S } from '@so-chart/utils';
import { extent, scaleBand, scaleLinear, ticks } from 'd3';
import { applyYAxisTitle } from '../normal';
import type { DeepRequired } from '@so-chart/types/common';

export function applyXAxis(axis: BarXAxisOptions | undefined) {
  const newAxis = (axis ? Object.assign({}, axis) : {}) as Required<BarXAxisOptions>;
  D<Required<BarXAxisOptions>, 'ticks'>(newAxis, 'ticks', 5);
  D<Required<BarXAxisOptions>, 'showSplitLine'>(newAxis, 'showSplitLine', true);
  D<Required<BarXAxisOptions>, 'lineColor'>(newAxis, 'lineColor', 'rgba(0, 0, 0, 0.1)');
  D<Required<BarXAxisOptions>, 'lineWidth'>(newAxis, 'lineWidth', 1);
  S<Required<BarXAxisOptions>, 'lineWidth'>(newAxis, 'lineWidth');
  D<Required<BarXAxisOptions>, 'lineDash'>(newAxis, 'lineDash', [3, 3]);
  S<Required<BarXAxisOptions>, 'lineDash'>(newAxis, 'lineDash');
  D<Required<BarXAxisOptions>, 'tickSize'>(newAxis, 'tickSize', 6);
  S<Required<BarXAxisOptions>, 'tickSize'>(newAxis, 'tickSize');
  D<Required<BarXAxisOptions>, 'showAixsText'>(newAxis, 'showAixsText', true);
  D<Required<BarXAxisOptions>, 'fontColor'>(newAxis, 'fontColor', 'rgba(0, 0, 0, 0.5)');
  D<Required<BarXAxisOptions>, 'fontSize'>(newAxis, 'fontSize', 12);
  S<Required<BarXAxisOptions>, 'fontSize'>(newAxis, 'fontSize');
  return newAxis;
}

export function applyYAxis(axis: BarYAxisOptions | undefined, datasets: BarDataset[]) {
  const newAxis = (axis ? Object.assign({}, axis) : {}) as DeepRequired<BarYAxisOptions>;
  newAxis.title = applyYAxisTitle(newAxis.title);
  D<Required<BarYAxisOptions>, 'interval'>(newAxis, 'interval', 100);
  D<Required<BarYAxisOptions>, 'ticks'>(newAxis, 'ticks', 5);
  D<Required<BarYAxisOptions>, 'format'>(newAxis, 'format', '~s');
  D<Required<BarYAxisOptions>, 'showSplitLine'>(newAxis, 'showSplitLine', true);
  D<Required<BarYAxisOptions>, 'lineColor'>(newAxis, 'lineColor', 'rgba(0, 0, 0, 0.1)');
  D<Required<BarYAxisOptions>, 'lineWidth'>(newAxis, 'lineWidth', 1);
  S<Required<BarYAxisOptions>, 'lineWidth'>(newAxis, 'lineWidth');
  D<Required<BarYAxisOptions>, 'lineDash'>(newAxis, 'lineDash', [3, 3]);
  S<Required<BarYAxisOptions>, 'lineDash'>(newAxis, 'lineDash');
  D<Required<BarYAxisOptions>, 'tickSize'>(newAxis, 'tickSize', 6);
  S<Required<BarYAxisOptions>, 'tickSize'>(newAxis, 'tickSize');
  D<Required<BarYAxisOptions>, 'showAixsText'>(newAxis, 'showAixsText', true);
  D<Required<BarYAxisOptions>, 'fontColor'>(newAxis, 'fontColor', 'rgba(0, 0, 0, 0.5)');
  D<Required<BarYAxisOptions>, 'fontSize'>(newAxis, 'fontSize', 12);
  S<Required<BarYAxisOptions>, 'fontSize'>(newAxis, 'fontSize');
  D<Required<BarYAxisOptions>, 'unitText'>(newAxis, 'unitText', '');

  // 自动缩放y轴范围
  const [min = 0, max = 0] = extent<number>(
    datasets
      .map(d => d.data)
      .flat(1)
      .filter(d => d != undefined || d != null) as number[]
  );
  D<Required<BarYAxisOptions>, 'data'>(newAxis, 'data', {
    start: Math.min(min, 0),
    end: max === min ? max + 1 : max,
  });
  return newAxis;
}

export function computeXAixs(chart: BarChartInstance) {
  const range = [chart.layout.left, chart.layout.width - chart.layout.right] as const;
  const { scaleFunc, intervalData } = initXAxis(chart.xAxis, range);
  chart.xScaleFunc = scaleFunc;
  chart.xIntervalData = intervalData;
}

export function computeYAixs(chart: BarChartInstance) {
  const range = [chart.layout.height - chart.layout.bottom, chart.layout.top] as const;
  const { scaleFunc, intervalData } = initYAxis(chart.yAxis, range);
  chart.yScaleFunc = scaleFunc;
  chart.yIntervalData = intervalData;
}

export function initXAxis(axis: Required<BarXAxisOptions>, range: readonly [number, number]) {
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

export function initYAxis(axis: Required<BarYAxisOptions>, range: readonly [number, number]) {
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

export function drawXAxis(chart: BarChartInstance) {
  const { offscreenCanvas, layout, xScaleFunc, xAxis, scale } = chart;
  const context = offscreenCanvas.getContext('2d');
  if (context) {
    context.imageSmoothingEnabled = true;
    const ticksData: string[] = computeXTicksData(chart);
    const y = layout.height - layout.bottom;
    context.save();

    if (xAxis.showSplitLine === true) {
      context.strokeStyle = xAxis.lineColor;
      context.lineWidth = xAxis.lineWidth;
      context.setLineDash(xAxis.lineDash);
      context.beginPath();
      xAxis.data.forEach(d => {
        context.moveTo(xScaleFunc(d) ?? 0, layout.top);
        context.lineTo(xScaleFunc(d) ?? 0, y + xAxis.tickSize);
      });
      context.stroke();
    }
    if (xAxis.showAixsText === true) {
      context.textAlign = 'center';
      context.textBaseline = 'top';
      context.fillStyle = xAxis.fontColor;
      context.font = `${xAxis.fontSize}px auto`;

      const leftOffset = xScaleFunc.bandwidth() / 2;
      const maxTextWidth = layout.width;
      const ellipsis = '...';
      ticksData.forEach(d => {
        let truncatedText = d;
        if (context.measureText(d).width * scale > maxTextWidth) {
          while (context.measureText(truncatedText + ellipsis).width * scale > maxTextWidth) {
            truncatedText = truncatedText.slice(0, -1);
          }
          truncatedText = truncatedText + ellipsis;
        }

        context.beginPath();
        context.save();
        const tx = Math.floor((xScaleFunc(d) ?? 0) + leftOffset);
        const ty = Math.floor(y + xAxis.tickSize);
        context.fillText(truncatedText, tx, ty);
        context.restore();
      });
    }
    context.restore();
  }
}

export function drawYAxis(chart: BarChartInstance) {
  const { offscreenCanvas, layout, yScaleFunc, yAxis } = chart;
  const { title, showSplitLine, lineColor, lineDash, lineWidth, tickSize, showAixsText, fontColor, fontSize, unitText } = yAxis;
  const context = offscreenCanvas.getContext('2d');
  if (context) {
    context.imageSmoothingEnabled = true;
    const ticks = yScaleFunc.ticks(yAxis.ticks);
    const format = yScaleFunc.tickFormat(yAxis.ticks, yAxis.format) as unknown as (d: number | Date) => string;
    const x = layout.left;
    context.save();
    if (showSplitLine === true) {
      context.strokeStyle = lineColor;
      context.lineWidth = lineWidth;
      context.setLineDash(lineDash);
      context.beginPath();
      ticks.forEach(d => {
        context.moveTo(x - tickSize, yScaleFunc(d));
        context.lineTo(layout.width - layout.right, yScaleFunc(d));
      });
      context.stroke();
    }
    if (showAixsText === true) {
      context.textAlign = 'right';
      context.textBaseline = 'middle';
      context.fillStyle = fontColor;
      context.font = `${fontSize}px auto`;
      ticks.forEach(d => {
        context.beginPath();
        context.fillText(`${format(d)}${unitText}`, x - tickSize, yScaleFunc(d));
      });
      context.beginPath();
      context.textAlign = 'center';
      context.textBaseline = 'bottom';
      context.fillStyle = title.fontColor;
      context.font = `${title.fontSize}px auto`;
      context.fillText(`${title.text}`, x, layout.top - title.fontSize);
    }
    context.restore();
  }
}

function computeXTicksData(chart: BarChartInstance) {
  type TextObj = {
    tx: number;
    width: number;
  };
  const { offscreenCanvas, xScaleFunc, xAxis } = chart;
  const context = offscreenCanvas.getContext('2d');
  const length = xAxis.data.length;
  let ticksData: string[] = [];

  const checkOverlap = (obj1: TextObj, obj2: TextObj) => {
    const ax1 = obj1.tx;
    const ax2 = obj1.tx + obj1.width;
    const bx1 = obj2.tx;
    const bx2 = obj2.tx + obj2.width;
    return ax1 < bx2 && ax2 > bx1;
  };

  const getTicksData = (context: OffscreenCanvasRenderingContext2D, count: number) => {
    const ticksCount = xAxis.ticks - count;
    if (ticksCount >= length) {
      ticksData = xAxis.data;
    } else {
      const ticksIndexs = ticks(0, length - 1, ticksCount);
      ticksData = ticksIndexs.map(index => xAxis.data[index]);
    }

    const leftOffset = xScaleFunc.bandwidth() / 2;
    const textObjs = ticksData.map(d => ({
      tx: Math.floor((xScaleFunc(d) ?? 0) + leftOffset),
      width: context.measureText(d).width, // measureText是不带scale的
      text: d,
    }));

    for (let i = 0; i < textObjs.length; i++) {
      for (let j = i + 1; j < textObjs.length; j++) {
        if (checkOverlap(textObjs[i], textObjs[j])) {
          getTicksData(context, count + 1);
        }
      }
    }
  };

  if (context) {
    context.save();
    context.imageSmoothingEnabled = true;
    context.textAlign = 'center';
    context.textBaseline = 'top';
    context.fillStyle = xAxis.fontColor;
    context.font = `${xAxis.fontSize}px auto`;
    getTicksData(context, 0);
    context.restore();
  }
  return ticksData;
}
