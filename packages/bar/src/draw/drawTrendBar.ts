import type { TrendBarHitPoint, TrendBarInstance } from '@so-chart/types/bar';
import type { EventName } from '@so-chart/types/common';
import { color, easeLinear, path, quadtree, select } from 'd3';

export function drawTrendBar(chart: TrendBarInstance) {
  const { offscreenCanvas, datasets, xScaleFunc, xIntervalData, yScaleFunc, bar, animate } = chart;
  const context = offscreenCanvas.getContext('2d');
  const { barGap, maxBarWidth } = bar;
  if (context) {
    context.imageSmoothingEnabled = true;
    const bandwidth = xScaleFunc.bandwidth();
    const barWidth = getAdaptiveBarWidth({ bandwidth, maxBarWidth, barGap, minBarWidth: chart.scale });
    const barPos: { s: number; e: number }[] = [];
    const hitPoints: TrendBarHitPoint[] = [];
    const datas = datasets.data;
    datas.forEach(({ data }, i) => {
      const bandStart = xScaleFunc(xIntervalData[i]) ?? 0;
      hitPoints.push({ x: bandStart + bandwidth / 2, y: 0, index: i });
      // 绘制矩形
      const x = bandStart + bandwidth / 2 - barWidth / 2;
      const y = yScaleFunc(yScaleFunc.domain()[0]);
      const h = data == undefined ? 0 : yScaleFunc(data) - y;

      const pathInstance = path();
      pathInstance.rect(x, y, barWidth, h * animate.progress);
      const path2D = new Path2D(pathInstance.toString());
      context.save();
      context.lineCap = 'round';
      context.lineJoin = 'round';
      context.fillStyle = datasets.backgroundColor;
      context.fill(path2D);
      context.restore();

      barPos.push({ s: x, e: x + barWidth });
    });

    chart.barPos = barPos;
    chart.barHitTree = quadtree<TrendBarHitPoint>()
      .x(point => point.x)
      .y(point => point.y)
      .addAll(hitPoints);
  }
}

export function drawChoosedTrendBar(params: { chart: TrendBarInstance; index?: number; eventName: EventName }) {
  const { chart, index, eventName } = params;
  const { datasets, xScaleFunc, yScaleFunc, xIntervalData, bar } = chart;
  const { barGap, maxBarWidth } = bar;

  const svg = select(chart.svg);
  let barBg = svg.select<SVGPathElement>('path.so-chart_bar_bg');
  if (barBg.empty()) {
    const tooltip = svg.select<SVGGElement>('g.so-chart_tooltip');
    if (tooltip.empty()) {
      barBg = svg.append('path').attr('class', 'so-chart_bar_bg');
    } else {
      barBg = svg.insert('path', 'g.so-chart_tooltip').attr('class', 'so-chart_bar_bg');
    }
  }
  const isExistBar = index != undefined;
  const isMove =
    eventName === 'touchmove' || eventName === 'mousemove' || eventName === 'touchstart' || eventName === 'mouseenter' || eventName == undefined;
  const isShow = isMove;

  if (isShow) {
    if (isExistBar) {
      const bandwidth = xScaleFunc.bandwidth();
      const barWidth = getAdaptiveBarWidth({ bandwidth, maxBarWidth, barGap, minBarWidth: chart.scale });
      const bandStart = xScaleFunc(xIntervalData[index]) ?? 0;

      const data = datasets.data[index].data;
      const x = bandStart + bandwidth / 2 - barWidth / 2;
      const y = yScaleFunc(yScaleFunc.domain()[0]);
      const h = data == undefined ? 0 : yScaleFunc(data) - y;
      const pathInstance = path();
      pathInstance.rect(x, y, barWidth, h);

      const c = color(datasets.backgroundColor);
      if (c) {
        const bg = c.brighter();
        barBg.interrupt().transition().ease(easeLinear).duration(100).attr('fill', bg.toString()).attr('d', pathInstance.toString());
      }
    }
  }

  if (!isShow || !isExistBar) {
    barBg.interrupt().remove();
  }
}

export function getAdaptiveBarWidth({
  bandwidth,
  maxBarWidth,
  barGap,
  minBarWidth,
}: {
  bandwidth: number;
  maxBarWidth: number;
  barGap: number;
  minBarWidth: number;
}) {
  const safeBandwidth = Math.max(bandwidth, 0);
  const preferredGap = Math.max(barGap, 0) * 2;
  const adaptiveGap = Math.min(preferredGap, safeBandwidth * 0.35);
  const availableWidth = Math.max(safeBandwidth - adaptiveGap, 0);
  const minimumWidth = Math.min(safeBandwidth, Math.max(minBarWidth, 1));
  const cappedWidth = Math.min(Math.max(maxBarWidth, minimumWidth), availableWidth);

  return Math.max(minimumWidth, cappedWidth);
}
