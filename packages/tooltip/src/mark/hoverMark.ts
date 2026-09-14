import type { EventName, Layout, RequiredMarkOption } from '@so-chart/types/common';
import { easeLinear, ScaleBand, ScaleLinear, ScaleTime, select } from 'd3';
import { getTooltipPosition, TOOLTIP_TRANSITION_DURATION } from '@so-chart/utils';
import { getLinearXScaleFunc } from './drawMark';
import styleClass from '../mark.module.less';
import tooltipStyleText from '../mark.module.less?inline';
import { insertStyle } from '../drawTooltip';

export type CommonChart = {
  nonce?: string;
  svg: SVGSVGElement;
  layout: Required<Layout & { width: number }>;
  container: HTMLElement;
  scale: number;
  mark: RequiredMarkOption;
  xAxis: {
    type: 'date' | 'value' | 'mapping' | 'category';
    data: string[] | { start: number; end: number } | { start: Date; end: Date } | number[] | Date[];
  };
  xScaleFunc: ScaleTime<Date, number, never> | ScaleLinear<number, number, never> | ScaleBand<string>;
  yScaleFunc: ScaleLinear<number, number, never>;
};

export function hoverMark(
  chart: CommonChart,
  data: {
    position: number[];
    eventName?: EventName;
  }
) {
  const { mark, yScaleFunc } = chart;
  const { eventName } = data;
  const isMove = eventName === 'touchmove' || eventName === 'mousemove' || eventName === 'touchstart' || eventName === 'mouseenter';
  const tooltip = select<SVGElement, SVGGElement>('g.so-chart_mark_tooltip');
  const xScaleFunc = getLinearXScaleFunc(chart) as Exclude<ReturnType<typeof getLinearXScaleFunc>, ScaleBand<string>>;

  for (let i = 0; i < mark.length; i++) {
    const m = mark[i];
    if (m.type === 'line') {
      if ('x' in m) {
        const { x, lineWidth } = m;
        const ele = select(`.so-chart_mark_x_line_${i}`);
        const mx = xScaleFunc(x);
        const cx = data.position[0];
        if (isMove && cx >= mx - lineWidth && cx <= mx + lineWidth) {
          ele.attr('stroke-width', lineWidth * 2);
          if (m.message) drawTooltip(chart, data.position, m.message);
          break;
        } else {
          ele.attr('stroke-width', lineWidth);
          tooltip.style('display', 'none');
        }
      } else if ('y' in m) {
        const { y, lineWidth } = m;
        const ele = select(`.so-chart_mark_y_line_${i}`);
        const my = yScaleFunc(y);
        const cy = data.position[1];
        if (isMove && cy >= my - lineWidth && cy <= my + lineWidth) {
          ele.attr('stroke-width', lineWidth * 2);
          if (m.message) drawTooltip(chart, data.position, m.message);
          break;
        } else {
          ele.attr('stroke-width', lineWidth);
          tooltip.style('display', 'none');
        }
      }
    } else if (m.type === 'point') {
      const { x, y, dotSize } = m;
      const ele = select(`.so-chart_mark_point_dot_${i}`);
      const mx = xScaleFunc(x);
      const my = yScaleFunc(y);
      const cx = data.position[0];
      const cy = data.position[1];
      if (isMove && cx >= mx - dotSize && cx <= mx + dotSize && cy >= my - dotSize && cy <= my + dotSize) {
        ele.attr('r', dotSize * 2);
        if (m.message) drawTooltip(chart, data.position, m.message);
        break;
      } else {
        ele.attr('r', dotSize);
        tooltip.style('display', 'none');
      }
    }
  }
}

function drawTooltip(chart: CommonChart, position: number[], message: (container: HTMLDivElement) => void) {
  const { scale, nonce } = chart;
  const svg = select(chart.svg);
  insertStyle({ svg, nonce, className: 'mark_tooltip', text: tooltipStyleText });
  const tooltip = select<SVGElement, SVGGElement>('g.so-chart_mark_tooltip');

  tooltip.style('display', '');
  const tooltipContainer = tooltip.select<SVGForeignObjectElement>('g.so-chart_mark_tooltip>foreignObject');
  tooltipContainer.html(`<div class="tooltip ${styleClass.tooltip}"></div>`);
  const tooltipEle = tooltipContainer.select('.tooltip');
  const tooltipDom = tooltipEle.node() as HTMLDivElement;
  message(tooltipDom); // 用户侧渲染内容
  const tooltipWidth = tooltipDom.offsetWidth;
  const tooltipHeight = tooltipDom.offsetHeight;
  tooltipContainer.attr('transform', `scale(${scale})`).attr('width', tooltipWidth).attr('height', tooltipHeight);
  const [left, top] = position;
  const tooltipPosition = getTooltipPosition({
    x: left / scale,
    y: top / scale,
    width: tooltipWidth,
    height: tooltipHeight,
    containerWidth: chart.container.offsetWidth,
    containerHeight: chart.container.offsetHeight,
  });
  tooltip
    .interrupt()
    .transition()
    .ease(easeLinear)
    .duration(TOOLTIP_TRANSITION_DURATION)
    .attr('transform', `translate(${tooltipPosition.x * scale}, ${tooltipPosition.y * scale})`);
  return tooltip;
}
