import type { LineChartInstance } from '@so-chart/types/line';
import { Delaunay, pointer, select } from 'd3';

type VoronoiCache = {
  datasets: LineChartInstance['datasets'];
  xAxis: LineChartInstance['xAxis'];
  xScaleFunc: LineChartInstance['xScaleFunc'];
  xIntervalData: LineChartInstance['xIntervalData'];
  yScaleFunc: LineChartInstance['yScaleFunc'];
  width: number;
  height: number;
  voronoiColor?: string;
  fontSize?: number;
};

const voronoiCaches = new WeakMap<LineChartInstance, VoronoiCache>();

export function drawVoronoi(chart: LineChartInstance) {
  // 开启voronoi，xAxis必须是mapping类型，x和y必须一一对应
  const { datasets, xAxis, layout, xScaleFunc, xIntervalData, yScaleFunc } = chart;
  const { width, height } = layout;
  if (xAxis.type === 'mapping') {
    const cached = voronoiCaches.get(chart);
    const geometryIsUnchanged =
      cached?.datasets === datasets &&
      cached.xAxis === xAxis &&
      cached.xScaleFunc === xScaleFunc &&
      cached.xIntervalData === xIntervalData &&
      cached.yScaleFunc === yScaleFunc &&
      cached.width === width &&
      cached.height === height &&
      cached.voronoiColor === chart.cross.voronoiColor &&
      cached.fontSize === xAxis.fontSize;

    if (geometryIsUnchanged) return;

    const showDatasets = datasets.filter(d => d.show === true);
    const points: [number, number][] = [];
    const pointLabels: string[] = [];
    showDatasets.forEach(dataset => {
      dataset.data.forEach((d, i) => {
        if (d != null && d != undefined) {
          points.push([xScaleFunc(xIntervalData[i]), yScaleFunc(d)]);
          pointLabels.push(dataset.label ?? '');
        }
      });
    });

    if (points.length === 0) {
      voronoiCaches.delete(chart);
      select(chart.svg).on('.voronoi', null);
      select(chart.svg).select('g.so-chart_voronoi').remove();
      return;
    }

    const delaunay = Delaunay.from(points);
    const voronoi = delaunay.voronoi([0, 0, width, height]);
    const svg = select(chart.svg);
    let voronoiGroup = svg.select<SVGGElement>('g.so-chart_voronoi');
    let labelText = svg.select<SVGTextElement>('text.so-chart_voronoi_label');
    if (voronoiGroup.empty()) {
      voronoiGroup = svg.append('g').attr('class', 'so-chart_voronoi');
      labelText = voronoiGroup.append('text').attr('class', 'so-chart_voronoi_label').attr('fill', chart.cross.voronoiColor);
    }
    voronoiGroup.selectAll('path').remove();
    voronoiGroup
      .selectAll('path')
      .data(voronoi.cellPolygons())
      .enter()
      .append('path')
      .attr('d', d => (d ? 'M' + d.join('L') + 'Z' : null))
      .attr('fill', 'none')
      .attr('stroke', 'none');
    // .attr('stroke', 'lightgray'); // 调试用

    svg.on('mousemove.voronoi', e => {
      const pos = pointer(e);
      const index = delaunay.find(pos[0], pos[1]);
      const [x, y] = points[index];
      const label = pointLabels[index];
      labelText
        .attr('text-anchor', 'middle')
        .attr('y', -8)
        .attr('transform', `translate(${x},${y})`)
        .style('font', `${xAxis.fontSize}px auto`)
        .text(label);
    });

    svg.on('mouseleave.voronoi', () => {
      labelText.text('');
    });

    voronoiCaches.set(chart, {
      datasets,
      xAxis,
      xScaleFunc,
      xIntervalData,
      yScaleFunc,
      width,
      height,
      voronoiColor: chart.cross.voronoiColor,
      fontSize: xAxis.fontSize,
    });
  }
}
