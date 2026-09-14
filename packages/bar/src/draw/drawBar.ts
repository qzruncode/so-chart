import { color, easeLinear, path, select } from 'd3';
import type { BarChartInstance, BarDatasetWithStack } from '@so-chart/types/bar';
import type { EventName } from '@so-chart/types/common';
import { getColor } from '@so-chart/utils';

export function drawBar(chart: BarChartInstance) {
  const { offscreenCanvas, datasets, xScaleFunc, xIntervalData, yScaleFunc, bar, animate, stack } = chart;
  const { groupGap, barGap, maxBarWidth } = bar;
  const context = offscreenCanvas.getContext('2d');
  if (context) {
    context.imageSmoothingEnabled = true;

    const showDatasets = datasets.filter(d => d.show === true);

    const barPos: { s: number; e: number }[][] = [];

    if (stack) {
      const bandwidth = xScaleFunc.bandwidth();
      const bandMaxWidth = bandwidth - barGap * 2;
      const barWidth = Math.max(Math.min(bandwidth, maxBarWidth, bandMaxWidth), 1);
      showDatasets.forEach(dataset => {
        const pos: { s: number; e: number }[] = [];
        const datas = (dataset as BarDatasetWithStack[number]).stackData;
        datas.forEach((data, j) => {
          const bandStart = xScaleFunc(xIntervalData[j]) ?? 0;
          const groupStart = bandStart + groupGap + (bandwidth - barWidth * 1) / 2;
          const x = groupStart;
          // 绘制矩形
          const y = yScaleFunc(+yScaleFunc.domain()[0] + (data ?? 0) - (dataset.data[j] ?? 0));
          const h = data == undefined ? 0 : yScaleFunc(data) - y;
          const pathInstance = path();
          pathInstance.rect(x, y, barWidth, h);
          const path2D = new Path2D(pathInstance.toString());
          context.save();
          context.lineCap = 'round';
          context.lineJoin = 'round';
          const colorInstance = color(dataset.backgroundColor);
          if (colorInstance) {
            colorInstance.opacity = colorInstance.opacity * animate.progress;
            context.fillStyle = colorInstance.formatHex8();
          }
          context.fill(path2D);
          context.restore();
          const w = barWidth;
          const g = w * 0.3;
          pos.push({ s: x - g, e: x + barWidth + g });
        });
        barPos.push(pos);
      });
    } else {
      const bandwidth = xScaleFunc.bandwidth() - groupGap * 2;
      const seriesCount = datasets.length;
      const bandMaxWidth = (bandwidth - barGap * (seriesCount - 1)) / seriesCount;
      const barWidth = Math.max(Math.min(bandwidth, maxBarWidth, bandMaxWidth), 1);
      showDatasets.forEach((dataset, i) => {
        const pos: { s: number; e: number }[] = [];
        dataset.data.forEach((data, j) => {
          const bandStart = xScaleFunc(xIntervalData[j]) ?? 0;
          const groupStart = bandStart + groupGap + (bandwidth - barWidth * seriesCount - barGap * (seriesCount - 1)) / 2;
          const x = groupStart + barWidth * i + barGap * i;
          // 绘制矩形
          const y = yScaleFunc(yScaleFunc.domain()[0]);
          const h = data == undefined ? 0 : yScaleFunc(data) - y;
          const pathInstance = path();
          pathInstance.rect(x, y, barWidth, h * animate.progress);
          const path2D = new Path2D(pathInstance.toString());
          context.save();
          context.lineCap = 'round';
          context.lineJoin = 'round';
          context.fillStyle = dataset.backgroundColor;
          context.fill(path2D);
          context.restore();

          const w = barWidth;
          const g = w * 0.3;
          pos.push({ s: x - g, e: x + barWidth + g });
        });
        barPos.push(pos);
      });
    }
    chart.barPos = barPos;
  }
}

export function drawChoosedBar(params: { chart: BarChartInstance; indexPaths?: [number, number]; eventName: EventName }) {
  const { chart, indexPaths, eventName } = params;
  const { datasets, xScaleFunc, yScaleFunc, xIntervalData, stack, bar } = chart;
  const { groupGap, barGap, maxBarWidth } = bar;

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

  const isExistBar = indexPaths != undefined;
  const isMove =
    eventName === 'touchmove' || eventName === 'mousemove' || eventName === 'touchstart' || eventName === 'mouseenter' || eventName == undefined;
  const isShow = isMove;

  if (isShow) {
    if (isExistBar) {
      const [i, j] = indexPaths;
      const bandStart = xScaleFunc(xIntervalData[j]) ?? 0;

      let x;
      let barWidth;
      if (stack) {
        const bandwidth = xScaleFunc.bandwidth();
        const bandMaxWidth = bandwidth - barGap * 2;
        barWidth = Math.max(Math.min(bandwidth, maxBarWidth, bandMaxWidth), 1);
        const groupStart = bandStart + (bandwidth - barWidth * 1) / 2 + groupGap;
        x = groupStart;
      } else {
        const bandwidth = xScaleFunc.bandwidth() - groupGap * 2;
        const seriesCount = datasets.length;
        const bandMaxWidth = (bandwidth - barGap * (seriesCount - 1)) / seriesCount;
        barWidth = Math.max(Math.min(bandwidth, maxBarWidth, bandMaxWidth), 1);
        const groupStart = bandStart + (bandwidth - barWidth * seriesCount - barGap * (seriesCount - 1)) / 2 + groupGap;
        x = groupStart + barWidth * i + barGap * i;
      }

      // 绘制选中背景矩形
      const [start, end] = yScaleFunc.domain();
      const y = yScaleFunc(end);
      const h = yScaleFunc(start) - yScaleFunc(end);
      const pathInstance = path();

      const w = barWidth;
      const g = w * 0.3;
      pathInstance.rect(x - g, y, barWidth + 2 * g, h);

      const bg = color(getColor({ i: 7, cs: 'bluegray' }))!;
      bg.opacity = 0.1;
      barBg.transition().ease(easeLinear).duration(100).attr('fill', bg.toString()).attr('d', pathInstance.toString());
    }
  } else {
    barBg.remove();
  }
}
