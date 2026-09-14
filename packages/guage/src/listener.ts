import type { SingleGuageInstance } from '@so-chart/types/guage';
import { getTooltipPosition } from '@so-chart/utils';
import { pointer, select } from 'd3';
import styleClass from './index.module.less';
import tooltipStyleText from './index.module.less?inline';

const boundCharts = new WeakSet<SingleGuageInstance>();

export function bindListener(chart: SingleGuageInstance) {
  if (boundCharts.has(chart)) return;

  const svg = select(chart.svg);
  const { nonce } = chart;
  if (!chart.tooltip) return;
  boundCharts.add(chart);

  let svgStyle = svg.select<SVGStyleElement>('style.tooltip');
  if (svgStyle.empty()) {
    svgStyle = svg
      .append<SVGStyleElement>('style')
      .attr('class', 'tooltip')
      .attr('nonce', nonce ?? '');
  }
  svgStyle.text(tooltipStyleText);

  let tooltipGroup = svg.select<SVGGElement>('g.so-chart_guage_tooltip');
  if (tooltipGroup.empty()) {
    tooltipGroup = svg.append('g').attr('class', 'so-chart_guage_tooltip');
  }
  tooltipGroup.style('pointer-events', 'none');
  let foreignObject = tooltipGroup.select<SVGForeignObjectElement>('foreignObject');
  if (foreignObject.empty()) {
    foreignObject = tooltipGroup.append('foreignObject').attr('x', 0).attr('y', 0);
  }
  foreignObject.attr('transform', `scale(${chart.scale})`);

  let lastHtml: string | undefined;
  let tooltipSize = { width: 0, height: 0 };
  let pendingPosition: [number, number] | undefined;
  let frameId: number | undefined;

  function leaved(this: SVGElement) {
    if (frameId != undefined) {
      cancelAnimationFrame(frameId);
      frameId = undefined;
    }
    pendingPosition = undefined;
    tooltipGroup.style('display', 'none');
  }

  function moved(this: SVGElement, event: MouseEvent) {
    tooltipGroup.style('display', '');
    pendingPosition = pointer(event, chart.container) as [number, number];
    if (frameId == undefined) {
      frameId = requestAnimationFrame(updateTooltip);
    }
  }

  function updateTooltip() {
    frameId = undefined;
    const position = pendingPosition;
    pendingPosition = undefined;
    if (position == undefined) return;

    const html = chart.tooltip?.();
    if (html == undefined) {
      tooltipGroup.style('display', 'none');
      lastHtml = undefined;
      return;
    }
    if (html !== lastHtml) {
      lastHtml = html;
      foreignObject.html(`<div class="tooltip ${styleClass.tooltip}">${html}</div>`);
      const tooltipDom = foreignObject.select('.tooltip').node() as HTMLDivElement;
      const tooltipBox = tooltipDom.getBoundingClientRect(); // 必须使用此方法，此方法获取的是浏览器视口的大小，而非svg中的大小
      tooltipSize = { width: tooltipBox.width, height: tooltipBox.height };
      foreignObject.attr('width', tooltipDom.offsetWidth).attr('height', tooltipDom.offsetHeight); // 设置的是svg中的坐标尺寸
    }

    if (tooltipSize.width === 0 || tooltipSize.height === 0) return;
    const tooltipPosition = getTooltipPosition({
      x: position[0],
      y: position[1],
      width: tooltipSize.width,
      height: tooltipSize.height,
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
      tooltipGroup.attr('transform', `translate(${svgCoords.x}, ${svgCoords.y})`);
    }
  }

  if ('ontouchstart' in document) {
    svg.on('.gaugeTooltip', null).on('touchmove.gaugeTooltip', moved).on('touchend.gaugeTooltip', leaved);
  } else {
    svg.on('.gaugeTooltip', null).on('mousemove.gaugeTooltip', moved).on('mouseleave.gaugeTooltip', leaved);
  }
}
