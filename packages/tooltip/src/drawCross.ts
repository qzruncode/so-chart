import { color, format, formatSpecifier, select } from 'd3';
import type { LineChartInstance } from '@so-chart/types/line';
import type { PointChartInstance } from '@so-chart/types/point';
import type { EventName } from '@so-chart/types/common';

export type CommonExposedData = { data: { lineColor?: string; dotColor?: string; dotSize?: number }; x: number; y: number };

type Params = {
  chart: LineChartInstance | PointChartInstance;
  data: {
    position: number[];
    eventName?: EventName;
  };
  exposedDatas: CommonExposedData[];
  x: number;
};

export function drawCross(params: Params) {
  const { chart, data, exposedDatas, x } = params;
  const { cross, layout, chartType, yAxis, yScaleFunc } = chart;
  const { eventName, position } = data;
  const { lineColor, lineDash, showXLine, showYLine } = cross;
  const [, y] = position;
  const { width, height, bottom, top, left, right } = layout;
  const ry = Math.max(Math.min(y, height - bottom), top);

  const svg = select(chart.svg);
  let crossGroup = svg.select<SVGGElement>('g.so-chart_cross');
  let dotsGroup = svg.select<SVGGElement>('g.dots');
  let hintContainer = crossGroup.select<SVGTextElement>('text.hint');
  let xCrossContainer = crossGroup.select<SVGLineElement>('line.xcross');
  let yCrossContainer = crossGroup.select<SVGLineElement>('line.ycross');
  // 绘制水平和垂直十字线
  if (crossGroup.empty()) {
    const lineWidth = cross.lineWidth;
    crossGroup = svg.append('g').attr('class', 'so-chart_cross');
    if (showXLine) {
      xCrossContainer = crossGroup.append('line').attr('class', 'xcross');
      xCrossContainer.attr('stroke', lineColor).attr('stroke-width', lineWidth).attr('stroke-dasharray', lineDash.join(','));
    }
    if (showYLine) {
      yCrossContainer = crossGroup.append('line').attr('class', 'ycross');
      yCrossContainer.attr('stroke', lineColor).attr('stroke-width', lineWidth).attr('stroke-dasharray', lineDash.join(','));
    }
  }

  {
    const isMove =
      eventName === 'touchmove' || eventName === 'mousemove' || eventName === 'touchstart' || eventName === 'mouseenter' || eventName == undefined;
    const isShowCross = isMove;
    if (isShowCross) {
      crossGroup.style('display', '');
      if (xCrossContainer) {
        xCrossContainer
          .attr('x1', left)
          .attr('y1', ry)
          .attr('x2', width - right)
          .attr('y2', ry);
      }
      if (yCrossContainer) {
        yCrossContainer
          .attr('x1', x)
          .attr('y1', top)
          .attr('x2', x)
          .attr('y2', height - bottom);
      }
    } else {
      crossGroup.style('display', 'none');
    }
  }

  // 绘制线上当前选中的点
  {
    const { showDots } = cross;
    if (showDots) {
      if (dotsGroup.empty()) {
        dotsGroup = crossGroup.append('g').attr('class', 'dots');
      }
      dotsGroup.selectAll('.dot').remove();
      dotsGroup
        .selectAll('.dot')
        .data(exposedDatas)
        .join('circle')
        .attr('class', 'dot')
        .attr('fill', d => {
          const color = getDotColor(chartType, d);
          return color?.darker(0.4).formatHex() ?? '';
        })
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)
        .attr('r', d => 1.1 * (getDotSize(chartType, d) ?? 0));
    }
  }

  // 坐标提示
  {
    const specifier = formatSpecifier(yAxis.format);
    specifier.precision = 2;
    const formatInstance = format(specifier.toString());
    if (cross.showHint) {
      if (hintContainer.empty()) {
        hintContainer = crossGroup.append('text').attr('class', 'hint');
      }
      const text = formatInstance(yScaleFunc.invert(ry));
      hintContainer
        .attr('fill', lineColor)
        .attr('x', layout.left)
        .attr('y', ry)
        .style('text-align', 'left')
        .style('font', `${cross.hintSize}px auto`)
        .text(text);
    }
  }
}

function getDotColor(chartType: string, d: CommonExposedData) {
  if (chartType === 'line') {
    const data = d.data as { lineColor: string };
    return color(data.lineColor);
  } else if (chartType === 'point') {
    const data = d.data as { dotColor: string };
    return color(data.dotColor);
  }
}

function getDotSize(chartType: string, d: CommonExposedData) {
  if (chartType === 'line') {
    const data = d.data as { dotSize: number };
    return data.dotSize;
  } else if (chartType === 'point') {
    const data = d.data as { dotSize: number };
    return data.dotSize;
  }
}
