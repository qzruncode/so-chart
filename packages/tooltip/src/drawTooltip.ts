import type { EventName, Layout, TooltipOptions } from '@so-chart/types/common';
import { getTooltipPosition } from '@so-chart/utils';
import { getDynamicStyleText, getTooltipHtml } from './getTooltipHtml';
import tooltipStyleText from './tooltip.module.less?inline';
import { drag, select, Selection } from 'd3';

export type CommonChart = {
  chartId: string;
  nonce?: string;
  scale: number;
  svg: SVGSVGElement;
  container: HTMLElement;
  chartType: 'line' | 'pie' | 'bar' | 'circleStackBar' | 'point' | 'trend' | 'radar';
  tooltip?: Required<TooltipOptions> & { x?: number; y?: number };
  layout: Required<Layout>;
};

export type CommonExposedData = {
  data: {
    lineColor?: string;
    dotColor?: string;
    dotSize?: number;
    label?: string;
    backgroundColor?: string;
    data?: (null | undefined | number)[] | (null | undefined | number);
  };
  x: number;
  y: number;
  index?: number;
};

type Params = {
  chart: CommonChart;
  data: {
    position: number[];
    eventName?: EventName;
  };
  exposedData: CommonExposedData[];
  xData?: string;
};

type TooltipState = {
  lastHtmlKey?: string;
  lastFormatter?: TooltipOptions['formatter'];
  lastDynamicStyleKey?: string;
  scale?: number;
  width: number;
  height: number;
  frameId?: number;
  chart?: CommonChart;
  verticalSide?: 'before' | 'after';
  renderedPosition?: [number, number];
  flip?: {
    startedAt: number;
    from: [number, number];
    target: [number, number];
  };
  pending?: {
    chart: CommonChart;
    position: number[];
  };
  clickBound?: boolean;
  dragBound?: boolean;
};

const tooltipStates = new WeakMap<SVGSVGElement, TooltipState>();
const TOOLTIP_FLIP_DURATION = 120;

function getTooltipState(svg: SVGSVGElement) {
  let state = tooltipStates.get(svg);
  if (!state) {
    state = { width: 0, height: 0 };
    tooltipStates.set(svg, state);
  }
  return state;
}

function hideTooltip(tooltip: Selection<SVGGElement, unknown, null, undefined>, state: TooltipState) {
  if (state.frameId != undefined) {
    cancelAnimationFrame(state.frameId);
    state.frameId = undefined;
  }
  state.pending = undefined;
  state.lastHtmlKey = undefined;
  state.lastFormatter = undefined;
  state.lastDynamicStyleKey = undefined;
  state.scale = undefined;
  state.width = 0;
  state.height = 0;
  state.chart = undefined;
  state.verticalSide = undefined;
  state.renderedPosition = undefined;
  state.flip = undefined;
  tooltip.interrupt().style('display', 'none').style('opacity', 0).style('pointer-events', 'none');
}

function scheduleTooltipPosition(state: TooltipState, chart: CommonChart, position: number[]) {
  state.chart = chart;
  state.pending = { chart, position };
  scheduleTooltipFrame(state);
}

function scheduleTooltipFrame(state: TooltipState) {
  if (state.frameId != undefined) return;

  state.frameId = requestAnimationFrame(time => {
    state.frameId = undefined;
    updateTooltipPosition(state, time);
  });
}

function updateTooltipPosition(state: TooltipState, time: number) {
  const pending = state.pending;
  state.pending = undefined;
  const chart = pending?.chart ?? state.chart;
  if (!chart || state.width === 0 || state.height === 0) return;

  const tooltip = select<SVGGElement, unknown>(chart.svg).select<SVGGElement>('g.so-chart_tooltip');
  if (tooltip.empty()) return;

  if (pending) {
    const tooltipPosition = getTooltipPosition({
      x: pending.position[0] / chart.scale,
      y: pending.position[1] / chart.scale,
      width: state.width,
      height: state.height,
      containerWidth: chart.container.offsetWidth,
      containerHeight: chart.container.offsetHeight,
    });
    const target: [number, number] = [tooltipPosition.x * chart.scale, tooltipPosition.y * chart.scale];
    const verticalSide = tooltipPosition.y >= pending.position[1] / chart.scale ? 'after' : 'before';
    const isVerticalFlip = state.verticalSide != undefined && state.verticalSide !== verticalSide;
    const current = state.renderedPosition ?? target;

    if (isVerticalFlip && !prefersReducedMotion()) {
      state.flip = { startedAt: time, from: current, target };
    } else if (state.flip && !isVerticalFlip) {
      state.flip.target = target;
    } else {
      state.flip = undefined;
      state.renderedPosition = target;
    }
    state.verticalSide = verticalSide;
  }

  if (state.flip) {
    const progress = Math.min((time - state.flip.startedAt) / TOOLTIP_FLIP_DURATION, 1);
    const easedProgress = 1 - (1 - progress) ** 3;
    const [fromX, fromY] = state.flip.from;
    const [targetX, targetY] = state.flip.target;
    state.renderedPosition = [fromX + (targetX - fromX) * easedProgress, fromY + (targetY - fromY) * easedProgress];
    if (progress === 1) {
      state.renderedPosition = state.flip.target;
      state.flip = undefined;
    }
  }

  if (state.renderedPosition) {
    tooltip.attr('transform', `translate(${state.renderedPosition[0]}, ${state.renderedPosition[1]})`).style('opacity', 1);
  }

  if (state.flip) scheduleTooltipFrame(state);
}

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function drawTooltip(params: Params) {
  const { chart, data, exposedData, xData } = params;
  const { scale, tooltip: tooltipOptions, nonce } = chart;
  const svg = select(chart.svg);
  const state = getTooltipState(chart.svg);
  state.chart = chart;
  insertStyle({ svg, nonce, className: 'tooltip', text: tooltipStyleText });

  let tooltip = svg.select<SVGGElement>('g.so-chart_tooltip');
  let tooltipContainer = tooltip.select<SVGForeignObjectElement>('foreignObject');
  if (tooltip.empty()) {
    tooltip = svg.append('g').attr('class', 'so-chart_tooltip').style('opacity', 0).style('pointer-events', 'none');
    tooltipContainer = tooltip.append('foreignObject');
  }

  {
    const isExistData = exposedData.length > 0;
    const { eventName, position } = data;
    const isMove = eventName === 'touchmove' || eventName === 'mousemove' || eventName == undefined;
    const isEnter = eventName === 'touchstart' || eventName === 'mouseenter';
    const isShowTooltip = isMove && !isMarkTooltipShow(chart);

    if (isShowTooltip) {
      if (isExistData) {
        const isInteractive = Boolean(tooltipOptions?.fixed && (tooltipOptions.drag || tooltipOptions.extra?.func));
        tooltip.style('display', '').style('pointer-events', isInteractive ? 'all' : 'none');
        const dynamicStyleKey = getDynamicStyleKey(chart, exposedData);
        if (state.lastDynamicStyleKey !== dynamicStyleKey) {
          const dynamicStyleText = getDynamicStyleText(chart, exposedData);
          insertStyle({ svg, nonce, className: 'tooltip_dynamic', text: dynamicStyleText.join('') });
          state.lastDynamicStyleKey = dynamicStyleKey;
        }

        const htmlKey = getTooltipHtmlKey(chart, exposedData, xData, tooltipOptions);
        const shouldMeasureTooltip =
          state.lastHtmlKey !== htmlKey ||
          state.lastFormatter !== tooltipOptions?.formatter ||
          state.scale !== scale ||
          state.width === 0 ||
          state.height === 0;
        if (shouldMeasureTooltip) {
          const html = getTooltipHtml({
            chart,
            eventData: data,
            tooltipData: exposedData,
            xData,
          });
          state.lastHtmlKey = htmlKey;
          state.lastFormatter = tooltipOptions?.formatter;
          state.scale = scale;
          tooltipContainer.html(html);
          const tooltipDom = tooltipContainer.select('.tooltip').node() as HTMLDivElement;
          state.width = tooltipDom.offsetWidth;
          state.height = tooltipDom.offsetHeight;
          tooltipContainer.attr('transform', `scale(${scale})`).attr('width', state.width).attr('height', state.height);
        }
        const maxLeft = (chart.container.offsetWidth - state.width) * scale;
        if (tooltipOptions?.extra.func) {
          ensureTooltipClickHandler(tooltipContainer, state);
        }

        if (!tooltipOptions?.fixed) {
          scheduleTooltipPosition(state, chart, position);
        } else {
          tooltip.style('opacity', 1);
          if (tooltipOptions.x == undefined || tooltipOptions.y == undefined) {
            tooltipOptions.x = maxLeft;
            tooltipOptions.y = 0;
            tooltip.attr('transform', `translate(${tooltipOptions.x}, ${tooltipOptions.y})`);
          }

          if (tooltipOptions.drag) {
            ensureTooltipDrag(tooltip, state);
          } else {
            disableTooltipDrag(tooltip, state);
            tooltip.attr('transform', `translate(${tooltipOptions.x}, ${tooltipOptions.y})`);
          }
        }
      } else {
        hideTooltip(tooltip, state);
      }
    } else if (!isEnter) {
      hideTooltip(tooltip, state);
    }
  }
}

function isMarkTooltipShow(chart: CommonChart) {
  const svg = select(chart.svg);
  const markTooltip = svg.select('.so-chart_mark_tooltip');
  if (!markTooltip.empty()) {
    return svg.select('.so-chart_mark_tooltip').style('display') != 'none';
  }
  return false;
}

function getDynamicStyleKey(chart: CommonChart, exposedData: CommonExposedData[]) {
  const colors = exposedData.map(data => {
    switch (chart.chartType) {
      case 'line':
      case 'radar':
        return data.data.lineColor;
      case 'bar':
      case 'pie':
      case 'circleStackBar':
        return data.data.backgroundColor;
      case 'trend':
      case 'point':
        return data.data.dotColor;
      default:
        return undefined;
    }
  });

  return `${chart.layout.height}:${chart.scale}:${chart.nonce ?? ''}:${colors.join('|')}`;
}

function getTooltipHtmlKey(chart: CommonChart, exposedData: CommonExposedData[], xData: string | undefined, tooltipOptions: CommonChart['tooltip']) {
  const values = exposedData
    .map(data => {
      const rawData = data.data.data;
      const value = Array.isArray(rawData) ? rawData[data.index ?? 0] : rawData;
      return `${data.data.label}:${data.index ?? 0}:${String(value)}`;
    })
    .join('|');

  return `${chart.chartType}:${xData ?? ''}:${tooltipOptions?.extra?.text ?? ''}:${values}`;
}

function ensureTooltipClickHandler(tooltipContainer: Selection<SVGForeignObjectElement, unknown, null, undefined>, state: TooltipState) {
  if (state.clickBound) return;

  tooltipContainer.on('click.tooltip', (event: MouseEvent) => {
    const func = state.chart?.tooltip?.extra?.func;
    if (!func) return;
    const target = select<HTMLElement, unknown>(event.target as HTMLElement);
    if (target.attr('id') === 'extra') {
      func(+target.attr('index'));
    }
  });
  state.clickBound = true;
}

function ensureTooltipDrag(tooltip: Selection<SVGGElement, unknown, null, undefined>, state: TooltipState) {
  if (state.dragBound) return;

  let startMouseX = 0;
  let startMouseY = 0;
  let startTooltipX = 0;
  let startTooltipY = 0;
  const dragInstance = drag<SVGGElement, unknown>();
  dragInstance.on('start', event => {
    startMouseX = event.x;
    startMouseY = event.y;
    const transform = tooltip.attr('transform');
    const match = /translate\(([-\d.]+),\s*([-\d.]+)\)/.exec(transform);
    startTooltipX = match ? parseFloat(match[1]) : 0;
    startTooltipY = match ? parseFloat(match[2]) : 0;
  });
  dragInstance.on('drag', event => {
    const chart = state.chart;
    const tooltipOptions = chart?.tooltip;
    if (!chart || !tooltipOptions) return;

    const maxLeft = (chart.container.offsetWidth - state.width) * chart.scale;
    const maxTop = (chart.container.offsetHeight - state.height) * chart.scale;
    const tx = Math.min(startTooltipX + event.x - startMouseX, maxLeft);
    const ty = Math.min(startTooltipY + event.y - startMouseY, maxTop);
    tooltip.attr('transform', `translate(${tx}, ${ty})`);
    tooltipOptions.x = tx;
    tooltipOptions.y = ty;
  });
  dragInstance(tooltip);
  tooltip.style('cursor', 'move');
  state.dragBound = true;
}

function disableTooltipDrag(tooltip: Selection<SVGGElement, unknown, null, undefined>, state: TooltipState) {
  if (!state.dragBound) return;
  tooltip.on('.drag', null).style('cursor', null);
  state.dragBound = false;
}

export function insertStyle({
  svg,
  nonce,
  className,
  text,
}: {
  svg: Selection<SVGSVGElement, unknown, null, undefined>;
  nonce?: string;
  className: string;
  text: string;
}) {
  let svgStyle = svg.select<SVGStyleElement>(`style.${className}`);
  if (svgStyle.empty()) {
    svgStyle = svg
      .append<SVGStyleElement>('style')
      .attr('class', className)
      .attr('nonce', nonce ?? '');
  } else if (svgStyle.attr('nonce') !== (nonce ?? '')) {
    svgStyle.attr('nonce', nonce ?? '');
  }
  if (svgStyle.text() !== text) {
    svgStyle.text(text);
  }
}
