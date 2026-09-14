import { drawTooltip } from '@so-chart/tooltip';
import type { EventName } from '@so-chart/types/common';
import type { RadarInstance, RadarRegion } from '@so-chart/types/radar';
import { createFrameCoalescer, type FrameCoalescer } from '@so-chart/utils';
import { polygonContains, pointers, select } from 'd3';

const hitAreaClass = 'so-chart_radar_hit_area';
const hoverGroupClass = 'so-chart_radar_hover';

type RadarEvent = MouseEvent | TouchEvent;
type RadarMove = {
  event: RadarEvent;
  eventName: Extract<EventName, 'touchmove' | 'mouseenter' | 'mousemove'>;
};

type RadarExposedData = Array<{
  x: number;
  y: number;
  index: number;
  data: Omit<RadarRegion['data'], 'label' | 'data'> & {
    label: string;
    data: RadarRegion['data']['data'];
  };
}>;

const radarMoveSchedulers = new WeakMap<RadarInstance, FrameCoalescer<RadarMove>>();
const exposedDataCache = new WeakMap<RadarRegion, RadarExposedData>();

export function bindRadarListener(chart: RadarInstance) {
  unbindRadarListener(chart);

  const svg = select(chart.svg);
  let hitArea = svg.select<SVGRectElement>(`rect.${hitAreaClass}`);
  if (hitArea.empty()) {
    hitArea = svg.insert('rect', ':first-child').attr('class', hitAreaClass);
  }

  hitArea
    .attr('x', 0)
    .attr('y', 0)
    .attr('width', chart.layout.width)
    .attr('height', chart.layout.height)
    .attr('fill', 'transparent')
    .attr('aria-hidden', 'true')
    .style('pointer-events', 'all');

  refreshRadarListener(chart);
  const moveCoalescer = createFrameCoalescer<RadarMove>(({ event, eventName }) => handleMove(chart, event, eventName));
  radarMoveSchedulers.set(chart, moveCoalescer);

  if ('ontouchstart' in document) {
    hitArea
      .on('touchstart.radar', event => moveCoalescer.schedule({ event: event as TouchEvent, eventName: 'touchmove' }))
      .on('touchmove.radar', event => moveCoalescer.schedule({ event: event as TouchEvent, eventName: 'touchmove' }))
      .on('touchend.radar', () => clearHover(chart, 'touchstart'))
      .on('touchcancel.radar', () => clearHover(chart, 'touchstart'));
  } else {
    hitArea
      .on('mouseenter.radar', event => moveCoalescer.schedule({ event: event as MouseEvent, eventName: 'mouseenter' }))
      .on('mousemove.radar', event => moveCoalescer.schedule({ event: event as MouseEvent, eventName: 'mousemove' }))
      .on('mouseleave.radar', event => clearHover(chart, 'mouseleave', event as MouseEvent));
  }
}

export function refreshRadarListener(chart: RadarInstance) {
  clearHover(chart, 'mouseleave');
  select(chart.svg).select<SVGRectElement>(`rect.${hitAreaClass}`).attr('width', chart.layout.width).attr('height', chart.layout.height);
}

export function unbindRadarListener(chart: RadarInstance) {
  radarMoveSchedulers.get(chart)?.cleanup();
  radarMoveSchedulers.delete(chart);
  select(chart.svg).select<SVGRectElement>(`rect.${hitAreaClass}`).on('.radar', null);
  clearHover(chart, 'mouseleave');
}

function handleMove(chart: RadarInstance, event: RadarEvent, eventName: Extract<EventName, 'touchmove' | 'mouseenter' | 'mousemove'>) {
  const position = getPointerPosition(event, chart.svg);
  if (position === undefined) {
    return;
  }

  const region = findRadarRegion(chart, position);
  const previousRegion = chart.hoveredRegion;
  chart.hoveredRegion = region;

  if (!sameRegion(previousRegion, region)) {
    drawHoverRegion(chart, region);
  }

  if (chart.tooltip?.show) {
    drawTooltip({
      chart,
      data: { position, eventName },
      exposedData: region ? toExposedData(chart, region) : [],
      xData: region?.data.label,
    });
  }
}

function clearHover(chart: RadarInstance, eventName: Extract<EventName, 'touchstart' | 'mouseleave'>, event?: MouseEvent) {
  radarMoveSchedulers.get(chart)?.cancelPending();
  chart.hoveredRegion = undefined;
  drawHoverRegion(chart, undefined);

  if (chart.tooltip?.show) {
    const position = event ? (getPointerPosition(event, chart.svg) ?? [0, 0]) : [0, 0];
    drawTooltip({
      chart,
      data: { position, eventName },
      exposedData: [],
    });
  }
}

function findRadarRegion(chart: RadarInstance, position: [number, number]) {
  for (let index = chart.radarRegions.length - 1; index >= 0; index -= 1) {
    const region = chart.radarRegions[index];
    if (region && region.polygon.length >= 3 && polygonContains(region.polygon, position)) {
      return region;
    }
  }

  return undefined;
}

function drawHoverRegion(chart: RadarInstance, region: RadarRegion | undefined) {
  const svg = select(chart.svg);
  let group = svg.select<SVGGElement>(`g.${hoverGroupClass}`);
  if (group.empty()) {
    group = svg.append('g').attr('class', hoverGroupClass).style('pointer-events', 'none');
    group.append('polygon');
  }

  if (region === undefined) {
    group.style('display', 'none');
    return;
  }

  group
    .style('display', '')
    .select<SVGPolygonElement>('polygon')
    .attr('points', region.polygon.map(([x, y]) => `${x},${y}`).join(' '))
    .attr('fill', chart.hover.color || region.data.lineColor)
    .attr('fill-opacity', chart.hover.opacity)
    .attr('stroke', region.data.lineColor)
    .attr('stroke-width', chart.hover.lineWidth);
}

function getPointerPosition(event: RadarEvent, svg: SVGSVGElement): [number, number] | undefined {
  const position = pointers(event, svg)[0];
  if (position === undefined) {
    return undefined;
  }

  return position as [number, number];
}

function sameRegion(a: RadarRegion | undefined, b: RadarRegion | undefined) {
  return a?.datasetIndex === b?.datasetIndex;
}

function toExposedData(chart: RadarInstance, region: RadarRegion): RadarExposedData {
  const cached = exposedDataCache.get(region);
  if (cached) return cached;

  const exposedData = chart.xIntervalData.map((axisLabel, index) => {
    const [x, y] = region.polygon[index] ?? [chart.layout.width / 2, chart.layout.height / 2];
    return {
      x,
      y,
      index: 0,
      data: {
        ...region.data,
        label: axisLabel,
        data: [region.data.data[index]],
      },
    };
  });

  exposedDataCache.set(region, exposedData);
  return exposedData;
}
