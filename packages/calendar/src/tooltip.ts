import type { CalendarHeatmapInstance } from '@so-chart/types/calendar';
import { getTooltipPosition, TOOLTIP_TRANSITION_DURATION } from '@so-chart/utils';
import { color, easeLinear, pointer, select, Selection } from 'd3';
import styleClass from './index.module.less';
import tooltipStyleText from './index.module.less?inline';

export function handleTooltip(chart: CalendarHeatmapInstance) {
  const svg = select(chart.svg);
  handleDayCellHover(svg);
  const { tooltip, nonce } = chart;
  if (!tooltip) return;

  let svgStyle = svg.select<SVGStyleElement>('style.tooltip');
  if (svgStyle.empty()) {
    svgStyle = svg
      .append<SVGStyleElement>('style')
      .attr('class', 'tooltip')
      .attr('nonce', nonce ?? '');
  }
  svgStyle.text(tooltipStyleText);

  let tooltipGroup = svg.select<SVGGElement>('g.so-chart_calendar_tooltip');
  if (tooltipGroup.empty()) {
    tooltipGroup = svg.append('g').attr('class', 'so-chart_calendar_tooltip');
  }
  tooltipGroup.style('pointer-events', 'none');
  let foreignObject = tooltipGroup.select<SVGForeignObjectElement>('foreignObject');
  if (foreignObject.empty()) {
    foreignObject = tooltipGroup.append('foreignObject').attr('y', Number.MAX_SAFE_INTEGER).attr('x', Number.MAX_SAFE_INTEGER);
  }

  function moved(this: SVGElement, event: MouseEvent) {
    const day = select(event.target as SVGRectElement);
    const date = day.attr('date');
    const data = day.attr('data');

    if (date && data != undefined) {
      tooltipGroup.style('display', '');
      const [screenX, screenY] = pointer(event, chart.container);
      const html = tooltip!({ data: +data, date: date });
      foreignObject.html(`<div class="tooltip ${styleClass.tooltip}">${html}</div>`);
      const tooltipDom = foreignObject.select('.tooltip').node() as HTMLDivElement;
      const tooltipBox = tooltipDom.getBoundingClientRect(); // 必须使用此方法，此方法获取的是浏览器视口的大小，而非svg中的大小
      const { width: screenWidth, height: screenHeight } = tooltipBox;
      foreignObject.attr('width', tooltipDom.offsetWidth).attr('height', tooltipDom.offsetHeight); // 设置的是svg中的大小
      const tooltipPosition = getTooltipPosition({
        x: screenX,
        y: screenY,
        width: screenWidth,
        height: screenHeight,
        containerWidth: chart.container.offsetWidth,
        containerHeight: chart.container.offsetHeight,
      });
      // 转化成svg中的坐标
      const containerBox = chart.container.getBoundingClientRect();
      const point = chart.svg.createSVGPoint();
      point.x = tooltipPosition.x + containerBox.left + chart.container.clientLeft;
      point.y = tooltipPosition.y + containerBox.top + chart.container.clientTop;
      const ctm = chart.svg.getScreenCTM();
      if (ctm) {
        const svgCoords = point.matrixTransform(ctm.inverse());
        foreignObject
          .interrupt()
          .transition()
          .ease(easeLinear)
          .duration(TOOLTIP_TRANSITION_DURATION)
          .attr('y', svgCoords.y)
          .attr('x', svgCoords.x);
      }
    } else {
      if (event.target === this || (event.target !== this && event.target instanceof SVGElement)) {
        tooltipGroup.style('display', 'none');
      }
    }
  }

  function leaved(this: SVGElement) {
    tooltipGroup.style('display', 'none');
  }

  svg.on('.calendarTooltip', null);
  if ('ontouchstart' in document) {
    svg.on('touchmove.calendarTooltip', moved).on('touchend.calendarTooltip', leaved);
  } else {
    svg.on('mousemove.calendarTooltip', moved).on('mouseleave.calendarTooltip', leaved);
  }
}

const DAY_HOVER_STROKE_WIDTH = 1.5;
const DAY_HOVER_STROKE_OPACITY = 0.68;
const DAY_HOVER_SHADOW = 'drop-shadow(0 1px 1px rgba(37, 78, 119, 0.18))';
const DAY_HOVER_TRANSITION = 80;

type SvgSelection = Selection<SVGSVGElement, unknown, null, undefined>;
type RectSelection = Selection<SVGRectElement, unknown, null, undefined>;

function handleDayCellHover(svg: SvgSelection) {
  const svgElement = svg.node();
  if (!svgElement) return;

  let hoverMarker = svg.select<SVGRectElement>('rect.so-chart_calendar_hover_marker');
  if (hoverMarker.empty()) {
    hoverMarker = svg
      .append('rect')
      .attr('class', 'so-chart_calendar_hover_marker')
      .attr('fill', 'none')
      .attr('pointer-events', 'none')
      .attr('rx', 1.5)
      .attr('ry', 1.5)
      .style('display', 'none');
  }

  svg
    .selectAll<SVGRectElement, unknown>('rect.day-hit-area')
    .style('cursor', 'pointer')
    .on('mouseenter.calendarCell', function () {
      moveDayCellHover(hoverMarker, findDayCell(svg, select(this).attr('date')), svgElement);
    })
    .on('touchstart.calendarCell', function () {
      moveDayCellHover(hoverMarker, findDayCell(svg, select(this).attr('date')), svgElement);
    });

  svg.on('mouseleave.calendarCell', () => clearDayCellHover(hoverMarker)).on('touchend.calendarCell', () => clearDayCellHover(hoverMarker));
}

function findDayCell(svg: SvgSelection, date: string): SVGRectElement | undefined {
  const cell = svg
    .selectAll<SVGRectElement, unknown>('rect.day')
    .filter(function () {
      return this.getAttribute('date') === date;
    })
    .node();
  return cell ?? undefined;
}

function moveDayCellHover(marker: RectSelection, cell: SVGRectElement | undefined, svg: SVGSVGElement) {
  if (!cell) return;
  const bounds = getSvgRectBounds(cell, svg);
  if (!bounds) return;

  const baseColor = color(cell.getAttribute('fill') ?? '');
  const stroke = baseColor ? baseColor.darker(0.7).toString() : '#7a8ca5';
  const isHidden = marker.style('display') === 'none';
  const next = marker
    .interrupt('calendarCellHover')
    .attr('data-hovered', 'true')
    .attr('data-date', cell.getAttribute('date'))
    .attr('stroke', stroke)
    .attr('stroke-width', DAY_HOVER_STROKE_WIDTH)
    .attr('stroke-opacity', DAY_HOVER_STROKE_OPACITY)
    .attr('stroke-linejoin', 'round')
    .style('filter', DAY_HOVER_SHADOW);

  if (isHidden) {
    next.style('display', null).attr('x', bounds.x).attr('y', bounds.y).attr('width', bounds.width).attr('height', bounds.height);
  } else {
    next
      .style('display', null)
      .transition('calendarCellHover')
      .ease(easeLinear)
      .duration(DAY_HOVER_TRANSITION)
      .attr('x', bounds.x)
      .attr('y', bounds.y)
      .attr('width', bounds.width)
      .attr('height', bounds.height);
  }
}

function getSvgRectBounds(element: SVGRectElement, svg: SVGSVGElement) {
  const screenCtm = svg.getScreenCTM();
  const rect = element.getBoundingClientRect();
  if (!screenCtm || !rect.width || !rect.height) return;

  const inverse = screenCtm.inverse();
  const points = [
    [rect.left, rect.top],
    [rect.right, rect.top],
    [rect.left, rect.bottom],
    [rect.right, rect.bottom],
  ].map(([x, y]) => {
    const point = svg.createSVGPoint();
    point.x = x;
    point.y = y;
    return point.matrixTransform(inverse);
  });
  const xs = points.map(point => point.x);
  const ys = points.map(point => point.y);
  return {
    x: Math.min(...xs),
    y: Math.min(...ys),
    width: Math.max(...xs) - Math.min(...xs),
    height: Math.max(...ys) - Math.min(...ys),
  };
}

function clearDayCellHover(marker: RectSelection) {
  marker.interrupt('calendarCellHover').attr('data-hovered', null).attr('data-date', null).style('display', 'none');
}
