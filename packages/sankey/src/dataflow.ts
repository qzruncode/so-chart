import type { DataflowInstance, DataflowOptions } from '@so-chart/types/sankey';
import { applyDataflowChart } from './normal';
import { select } from 'd3';
import { sankey, sankeyLinkHorizontal } from 'd3-sankey';
import { handleTooltip } from './tooltip';
import { getEase } from '@so-chart/utils';

export default function renderDataflow(chart: DataflowInstance, options: DataflowOptions) {
  applyDataflowChart(chart, options);
  drawDataflow(chart);
  handleTooltip(chart);
}

export type Link = {
  y0: number;
  y1: number;
  width: number;
  index: number;
  target: Node;
  source: Node;
};

export type Node = {
  x0: number;
  x1: number;
  y0: number;
  y1: number;
  value: number;
  index: number;
  targetLinks: Link[];
};

function drawDataflow(chart: DataflowInstance) {
  const svg = select(chart.svg);
  const { layout, datasets, style, animate } = chart;
  const { left, top, right, bottom, width, height } = layout;
  const { nodePadding, nodeWidth, fontSize, textMargin } = style;
  const { ease, duration } = animate;

  const sankeyInstance = sankey()
    .nodeWidth(nodeWidth)
    .nodePadding(nodePadding)
    .extent([
      [left, top],
      [width - right, height - bottom],
    ]);

  const sankeyData = sankeyInstance({
    nodes: datasets.nodes.map(d => Object.create(d)),
    links: datasets.links.map(d => Object.create(d)),
  });

  const links = sankeyData.links as Link[];
  const nodes = sankeyData.nodes as Node[];
  const linkPath = sankeyLinkHorizontal() as unknown as (link: Link) => string;

  // 绘制node节点
  let nodesGroup = svg.select<SVGGElement>('g.so-chart_dataflow_nodes');
  if (nodesGroup.empty()) {
    nodesGroup = svg.append('g').attr('class', 'so-chart_dataflow_nodes');
  }
  const rects = nodesGroup
    .selectAll('rect')
    .data(nodes)
    .join('rect')
    .attr('x', d => d.x0)
    .attr('y', d => d.y0)
    .attr('height', d => d.y1 - d.y0);

  if (animate.switch === 'on') {
    rects
      .transition()
      .duration(duration)
      .ease(getEase(ease))
      .attr('width', d => d.x1 - d.x0)
      .attr('fill', d => {
        const od = datasets.nodes[d.index];
        return od.color;
      });
  } else {
    rects
      .attr('width', d => d.x1 - d.x0)
      .attr('fill', d => {
        const od = datasets.nodes[d.index];
        return od.color;
      });
  }

  // 绘制links路径
  let linksGroup = svg.select<SVGGElement>('g.so-chart_dataflow_links');
  if (linksGroup.empty()) {
    linksGroup = svg.append('g').attr('class', 'so-chart_dataflow_links');
  }
  linksGroup
    .attr('fill', 'none')
    .selectAll<SVGPathElement, Link>('path.so-chart_dataflow_link')
    .data(links)
    .join('path')
    .attr('class', 'so-chart_dataflow_link')
    .attr('d', linkPath)
    .attr('stroke', d => {
      const od = datasets.links[d.index];
      return od.color;
    })
    .attr('stroke-width', d => d.width)
    .style('mix-blend-mode', 'multiply');

  // 清理旧版本可能留下的透明命中层，交互命中改由 tooltip 中的 d3-quadtree 负责。
  svg.select('g.so-chart_dataflow_link_hits').remove();

  // 绘制标题文字
  let textsGroup = svg.select<SVGGElement>('g.so-chart_dataflow_texts');
  if (textsGroup.empty()) {
    textsGroup = svg.append('g').attr('class', 'so-chart_dataflow_texts');
  }
  const texts = textsGroup.style('font', `${fontSize}px sans-serif`).selectAll('text').attr('fill', style.fontColor).data(nodes);
  texts
    .join('text')
    .attr('fill', style.fontColor)
    .attr('x', d => d.x1 + textMargin)
    .attr('y', d => (d.y1 + d.y0) / 2)
    .text(d => {
      const od = datasets.nodes[d.index];
      return od.name;
    });
  texts
    .join('text')
    .attr('fill', style.fontColor)
    .attr('x', d => d.x1 + textMargin)
    .attr('y', d => fontSize + 2 + (d.y1 + d.y0) / 2)
    .text(d => {
      const targetLink = d.targetLinks[0];
      if (targetLink) {
        const data = Math.round(((d.value * 100) / targetLink.source.value) * 100) / 100;
        return `${data}% (${d.value})`;
      }
      return `100% (${d.value})`;
    });
}
