import type { FlowInstance, MashInstance, MashOptions } from '@so-chart/types/tree';
import { setAutoSize } from './size';
import { applyMashChart } from './normal';
import { Path, path, select } from 'd3';
import drawCircleFlow from './mash/drawCircleFlow';
import drawRectNode from './mash/drawRectNode';

export default function renderMash(chart: MashInstance, options: MashOptions) {
  applyMashChart(chart, options);
  drawLinks(chart);
  drawNodes(chart);
  drawTooltip(chart);
  chart.resize = () => {
    setAutoSize.call(chart, 1400); // 默认是1200，扩大点展示更多内容
  };
}

function drawNodes(chart: MashInstance) {
  const svg = select(chart.svg);
  const { datasets } = chart;
  const { nodes } = datasets;

  let nodesGroup = svg.select<SVGGElement>('g.so-chart_nodes');
  if (nodesGroup.empty()) {
    nodesGroup = svg.append('g').attr('class', 'so-chart_nodes');
  } else {
    nodesGroup.selectAll('*').remove(); // 清除旧的节点
  }

  const nodeGs = nodesGroup
    .selectAll('g')
    .data(nodes)
    .enter()
    .append('g')
    .attr('transform', d => `translate(${d.x}, ${d.y})`);

  nodeGs.each(function (node) {
    const g = select(this);
    if (node.type === 'circularFlow') {
      drawCircleFlow(chart, g, node);
    } else if (node.type === 'rect') {
      drawRectNode(svg, g, node);
    }
  });
}

function drawLinks(chart: MashInstance) {
  const { chartId } = chart;
  const svg = select(chart.svg);
  const { datasets } = chart;
  const { edges } = datasets;
  let linksGroup = svg.select<SVGGElement>('g.so-chart_links');
  if (linksGroup.empty()) {
    linksGroup = svg.append('g').attr('class', 'so-chart_links');
  } else {
    linksGroup.selectAll('*').remove(); // 清除旧的连线
  }

  linksGroup
    .selectAll('path')
    .data(edges)
    .enter()
    .append('path')
    .attr('d', d => {
      const p = path();
      const { type, radius, points } = d;
      const [source, target] = points;
      const [x1, y1] = source;
      const [x2, y2] = target;
      if (type === 'straight') {
        p.moveTo(x1, y1);
        p.lineTo(x2, y2);
      } else if (type === 'round') {
        getRoundLinkPath(p, [x1, y1], [x2, y2], radius);
      } else if (type === 'poly') {
        getPolyLinkPath(p, [x1, y1], [x2, y2], radius, d.poly);
      }
      return p.toString();
    })
    .attr('fill', 'none')
    .attr('stroke', (d, i) => {
      const color = d.arrow.color;
      drawArrowDefs(chart, i, color);
      return color;
    })
    .attr('stroke-width', d => d.arrow.strokeWidth)
    .attr('marker-end', (d, i) => (d.endType === 'arrow' ? `url(#${chartId}_arrow_${i})` : 'none'));
}

export function drawArrowDefs(chart: MashInstance | FlowInstance, id: number, color: string) {
  const { chartId } = chart;
  const svg = select(chart.svg);
  let defs = svg.select<SVGDefsElement>(`defs.so-chart_defs_${id}`);
  if (defs.empty()) {
    defs = svg.append('defs').attr('class', `so-chart_defs_${id}`);

    // 箭头定义
    defs
      .append('marker')
      .attr('id', `${chartId}_arrow_${id}`)
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 7) // 箭头偏移
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      // 箭头需要一个一个＞的形状，而不是三角形
      .attr('d', 'M0,-5L6,0L0,5')
      .attr('fill', 'none')
      .attr('stroke', color)
      .attr('stroke-width', 2);
  }
}

function getRoundLinkPath(p: Path, p1: number[], p2: number[], radius: number) {
  const [x1, y1] = p1;
  const [x2, y2] = p2;
  p.moveTo(x1, y1);

  if (y2 > y1 && x2 > x1) {
    // 点2在点1的右下角
    p.lineTo(x1, y2 - radius);
    p.arcTo(x1, y2, x1 + radius, y2, radius);
  } else if (y2 < y1 && x2 > x1) {
    // 点2在点1的左上角
    p.lineTo(x2 - radius, y1);
    p.arcTo(x2, y1, x2, y1 - radius, radius);
  }

  // 最后一段水平线
  p.lineTo(x2, y2);
}

export function getPolyLinkPath(p: Path, p1: number[], p2: number[], radius: number, poly: MashInstance['datasets']['edges'][number]['poly']) {
  const [x1, y1] = p1;
  const [x2, y2] = p2;
  p.moveTo(x1, y1);
  const midX = poly.intersectionPointX;

  if (poly.direction === 'normal') {
    // 正常情况下，折线都是由父元素引出来，连接到子元素
    if (x2 > x1 && y2 > y1) {
      // 点2在点1的右下角
      p.lineTo(midX, y1);
      p.lineTo(midX, y2 - radius);
      p.arcTo(midX, y2, midX + radius, y2, radius);
    } else if (y2 < y1 && x2 > x1) {
      // 点2在点1的左下角
      p.lineTo(midX, y1);
      p.lineTo(midX, y2 + radius);
      p.arcTo(midX, y2, midX + radius, y2, radius);
    }
  } else if (poly.direction === 'reverse') {
    // 也可以由，子元素引出来，连接到父元素
    if (x2 > x1 && y2 > y1) {
      // 点2在点1的右下角
      p.lineTo(midX - radius, y1);
      p.arcTo(midX, y1, midX, y1 + radius, radius);
      p.lineTo(midX, y2);
    } else if (y2 < y1 && x2 > x1) {
      // 点2在点1的左下角
      p.lineTo(midX - radius, y1);
      p.arcTo(midX, y1, midX, y1 - radius, radius);
      p.lineTo(midX, y2);
    }
  }

  // 最后一段水平线
  p.lineTo(x2, y2);
}

export function drawTooltip(chart: MashInstance | FlowInstance) {
  const svg = select(chart.svg);
  let tooltipGroup = svg.select<SVGGElement>('svg.so-chart_tree_tooltip');
  if (tooltipGroup.empty()) {
    tooltipGroup = svg.append('g').attr('class', 'so-chart_tree_tooltip').style('pointer-events', 'none');
    // rect的宽高度需要自适应text的大小
    tooltipGroup
      .append('rect')
      .attr('fill', 'var(--tooltip-background, #545c71)')
      .attr('rx', 4)
      .attr('ry', 4)
      .style('pointer-events', 'none');
    tooltipGroup
      .append('text')
      .attr('text-anchor', 'middle')
      .style('fill', 'var(--text-color, #fff)')
      .style('pointer-events', 'none');
  }
}
