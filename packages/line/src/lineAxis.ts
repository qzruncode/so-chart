import type { LineChartInstance, LineXAxisOptions, LineYAxisOptions } from '@so-chart/types/line';
import { scaleLinear, scaleTime, ticks } from 'd3';

export function computeXAixs(chart: LineChartInstance) {
  const range = [chart.layout.left, chart.layout.width - chart.layout.right] as const;
  const { scaleFunc, intervalData } = initXAxis(chart.xAxis, range);
  chart.xScaleFunc = scaleFunc;
  chart.xIntervalData = intervalData;
}

export function computeYAixs(chart: LineChartInstance) {
  const range = [chart.layout.height - chart.layout.bottom, chart.layout.top] as const;
  const { scaleFunc, intervalData } = initYAxis(chart.yAxis, range);
  chart.yScaleFunc = scaleFunc;
  chart.yIntervalData = intervalData as number[];
}

function initXAxis(axis: Required<LineXAxisOptions>, range: readonly [number, number]) {
  let domain, intervalData;
  const { type } = axis;

  if (type === 'mapping') {
    // mapping类型，axis数据只能传入字符串数组
    const data = axis.data as Array<string>;
    domain = [0, data.length - 1];
    intervalData = Array.from({ length: data.length }, (_, index) => index);
  } else {
    // 'date' | 'value'，axis数据只能传入 RangeData
    const data = axis.data as Exclude<typeof axis.data, Array<string>>;
    if (Array.isArray(data)) {
      domain = [data[0], data[data.length - 1]];
      intervalData = data;
    } else {
      domain = [data.start, data.end];
      intervalData = generateIntervalData(type, data.start, data.end, axis.interval);
    }
  }

  let scaleFunc;
  if (type === 'date') {
    scaleFunc = scaleTime<Date, number>();
  } else {
    scaleFunc = scaleLinear<number, number>();
  }
  scaleFunc.domain(domain);
  scaleFunc.range(range);
  scaleFunc.nice();
  return {
    scaleFunc,
    intervalData,
  };
}

function initYAxis(axis: Required<LineYAxisOptions>, range: readonly [number, number]) {
  let domain, intervalData;
  const { type } = axis;
  const data = axis.data;
  if (Array.isArray(data)) {
    domain = [data[0], data[data.length - 1]];
    intervalData = data;
  } else {
    domain = [data.start, data.end];
    intervalData = generateIntervalData(type, data.start, data.end, axis.interval);
  }

  const scaleFunc = scaleLinear<number, number>();
  scaleFunc.domain(domain);
  scaleFunc.range(range);
  scaleFunc.nice();
  return {
    scaleFunc,
    intervalData,
  };
}

export function drawXAxis(chart: LineChartInstance) {
  const { offscreenCanvas, layout, xScaleFunc, xAxis } = chart;
  const context = offscreenCanvas.getContext('2d');
  if (context) {
    context.imageSmoothingEnabled = true;
    const ticks = xAxis.type === 'mapping' ? computeXTicksData(chart) : xScaleFunc.ticks(xAxis.ticks);
    const format = xScaleFunc.tickFormat(xAxis.ticks, xAxis.format) as unknown as (d: number | Date) => string;
    const y = layout.height - layout.bottom;
    context.save();
    if (xAxis.showSplitLine === true) {
      context.strokeStyle = xAxis.lineColor;
      context.lineWidth = xAxis.lineWidth;
      context.setLineDash(xAxis.lineDash);
      context.beginPath();
      ticks.forEach(d => {
        context.moveTo(xScaleFunc(d), layout.top);
        context.lineTo(xScaleFunc(d), y + xAxis.tickSize);
      });
      context.stroke();
    }
    if (xAxis.showAixsText === true) {
      context.textAlign = 'center';
      context.textBaseline = 'top';
      context.fillStyle = xAxis.fontColor;
      context.font = `${xAxis.fontSize}px auto`;

      ticks.forEach(d => {
        context.beginPath();
        const text = xAxis.type === 'mapping' ? (xAxis.data as string[])[d as number] : format(d);
        if (text != undefined) {
          context.fillText(text, xScaleFunc(d), y + xAxis.tickSize);
        }
      });
    }
    context.restore();
  }
}

export function drawYAxis(chart: LineChartInstance) {
  const { offscreenCanvas, layout, yScaleFunc, yAxis } = chart;
  const { title, showSplitLine, fontColor, lineColor, fontSize, lineWidth, lineDash, tickSize, unitText, showAixsText } = yAxis;
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

function generateIntervalData(type: 'date' | 'value' | 'radial', start: number | Date, end: number | Date, interval: number) {
  if (type === 'date') {
    const xd: Date[] = [];
    let sd = new Date(start);
    const ed = new Date(end);
    while (sd <= ed) {
      xd.push(new Date(sd));
      sd = new Date(sd.setMilliseconds(sd.getMilliseconds() + interval));
    }
    return xd;
  } else {
    const xd: number[] = [];
    let sd = start as number;
    const ed = end as number;
    while (sd <= ed) {
      xd.push(sd);
      sd = sd + interval;
    }
    return xd;
  }
}

function computeXTicksData(chart: LineChartInstance) {
  type TextObj = {
    tx: number;
    width: number;
  };
  const { offscreenCanvas, xScaleFunc, xAxis } = chart;
  const context = offscreenCanvas.getContext('2d');

  const xAxisData = xAxis.data as string[];
  const xIntervalData = chart.xIntervalData as number[];
  const length = xAxisData.length;
  let ticksData: number[] = [];

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
      ticksData = xIntervalData;
    } else {
      const ticksIndexs = ticks(0, length - 1, ticksCount);
      ticksData = ticksIndexs;
    }

    const textObjs = ticksData.map(d => ({
      tx: Math.floor(xScaleFunc(d) ?? 0),
      width: context.measureText(xAxisData[d] + ' ').width, // measureText是不带scale的
      text: d,
    }));

    for (let i = 0; i < textObjs.length - 1; i++) {
      const t1 = textObjs[i],
        t2 = textObjs[i + 1];
      if (checkOverlap(t1, t2)) {
        getTicksData(context, count + 1);
        break;
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
