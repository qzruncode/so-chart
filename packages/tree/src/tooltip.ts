import type { DagreInstance, DagreNode } from '@so-chart/types/tree';
import { easeLinear, select } from 'd3';
import styleClass from './index.module.less';
import tooltipStyleText from './index.module.less?inline';

function setTooltip(this: DagreInstance, params: Parameters<DagreInstance['setTooltip']>[number]) {
  const { html, nodeId } = params;
  const svg = select(this.svg);

  let svgStyle = svg.select<SVGStyleElement>('style.tooltip');
  if (svgStyle.empty()) {
    svgStyle = svg
      .append<SVGStyleElement>('style')
      .attr('class', 'tooltip')
      .attr('nonce', this.nonce ?? '');
  }
  svgStyle.text(tooltipStyleText);

  const treeGroup = svg.select<SVGGElement>('g.so-chart_tree');
  let tooltipGroup = treeGroup.select<SVGGElement>('g.so-chart_tree_tooltip');
  if (tooltipGroup.empty()) {
    tooltipGroup = treeGroup.append('g').attr('class', 'so-chart_tree_tooltip');
  }
  let foreignObject = tooltipGroup.select<SVGForeignObjectElement>('foreignObject');
  if (foreignObject.empty()) {
    foreignObject = tooltipGroup.append('foreignObject');
  }
  foreignObject.html(`<div class="tooltip ${styleClass.tooltip}">${html}</div>`);

  const node = this.graph.node(nodeId);
  setTooltipPosition(node);
}

export default setTooltip;

export function setTooltipPosition(node: DagreNode) {
  const { x, y, height, width } = node;
  const marginTop = 5;
  const foreignObject = select('g.so-chart_tree_tooltip foreignObject');
  const tooltipDom = foreignObject.select('.tooltip').node() as HTMLDivElement;
  const tooltipWidth = tooltipDom.offsetWidth;
  const tooltipHeight = tooltipDom.offsetHeight;
  foreignObject.attr('width', tooltipWidth).attr('height', tooltipHeight);
  foreignObject
    .transition()
    .ease(easeLinear)
    .duration(100)
    .attr('y', (y ?? 0) + height + marginTop)
    .attr('x', (x ?? 0) + width / 2 - tooltipWidth / 2);
}
