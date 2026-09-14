import type { MashInstance } from '@so-chart/types/tree';
import { color, easeLinear, select, Selection } from 'd3';

export default function drawRectNode(
  svg: Selection<SVGSVGElement, unknown, null, undefined>,
  container: Selection<SVGGElement, unknown, null, undefined>,
  node: MashInstance['datasets']['nodes'][number]
) {
  const g = container;
  const { width, height, rect } = node;
  const { rx, ry } = rect;
  // 节点背景
  const bgColor = node.bgType === 'bg' ? node.bgColor : '#fff';
  const strokeColor = color(bgColor);
  const hoverBgColor = color(bgColor);
  if (strokeColor) strokeColor.opacity = 0.2;
  if (hoverBgColor) hoverBgColor.brighter();
  g.append('rect')
    .attr('rx', rx) // 圆角
    .attr('ry', ry)
    .attr('x', -width / 2)
    .attr('y', -height / 2)
    .attr('width', width)
    .attr('height', height)
    .attr('stroke-width', 10)
    .attr('fill', bgColor)
    .attr('stroke', node.bgType === 'bg' ? 'none' : node.bgColor);

  // 绘制tooltip
  g.on('mouseover', function () {
    g.select('rect')
      .attr('cursor', 'pointer')
      .attr('stroke', strokeColor ? strokeColor.toString() : 'none')
      .attr('fill', hoverBgColor ? hoverBgColor.toString() : bgColor);
    const tooltipGroup = svg.select('g.so-chart_tree_tooltip');
    tooltipGroup.style('display', 'block');
    const text = tooltipGroup.select<SVGGraphicsElement>('text');
    const textBg = tooltipGroup.select<SVGGraphicsElement>('rect');
    // 显示tooltip，写入提示文字
    if (node.tooltipText) {
      tooltipGroup.transition().ease(easeLinear).duration(100).attr('transform', `translate(${node.x}, ${node.y})`);
      const textX = 0;
      const textY = -(height + node.fontSize) / 2;
      text.attr('x', textX).attr('y', textY).text(node.tooltipText);
      // 计算文字尺寸
      requestAnimationFrame(() => {
        const text = tooltipGroup.select<SVGGraphicsElement>('text');
        const textNode = text.node();
        if (textNode) {
          const bbox = textNode.getBBox();
          const padding = 6;
          const textBgWidth = bbox.width + padding * 2;
          const textBgHeight = bbox.height + padding * 2;
          textBg
            .transition()
            .ease(easeLinear)
            .duration(100)
            .attr('width', textBgWidth)
            .attr('height', textBgHeight)
            .attr('x', textX - textBgWidth / 2)
            .attr('y', textY - node.fontSize / 2 - textBgHeight / 2);
        }
      });
    } else {
      text.text('');
      textBg.attr('width', 0).attr('height', 0);
    }
  }).on('mouseout', function () {
    g.select('rect').attr('stroke', 'none').attr('fill', bgColor);
    const tooltipGroup = svg.select('g.so-chart_tree_tooltip');
    tooltipGroup.style('display', 'none');
  });

  // 文本
  const texts = node.label.split('\n');
  if (texts.length > 1) {
    g.append('text')
      .attr('cursor', 'pointer')
      .attr('text-anchor', 'middle')
      .attr('dy', 0)
      .style('font-size', node.fontSize)
      .selectAll('tspan')
      .data(node.label.split('\n'))
      .enter()
      .append('tspan')
      .attr('x', 0)
      .attr('dy', (_d, i) => (i === 0 ? -5 : 20)) // 第一个 tspans 向上偏移一点
      // 第一个 tspans 是标题，后续是描述，标题需要字体加粗
      // .style('font-weight', (_d, i) => (i === 0 ? 'bold' : 'normal'))
      .style('font-weight', 'bold')
      .style('fill', function () {
        const nodeData = this.parentNode && (select(this.parentNode as SVGTextElement).datum() as MashInstance['datasets']['nodes'][number]);
        return nodeData && nodeData.bgType === 'bg' ? '#fff' : node.labelColor;
      })
      .text(d => d);
  } else {
    g.append('foreignObject')
      .attr('width', width)
      .attr('height', height)
      .attr('x', -width / 2)
      .attr('y', -height / 2)
      .append('xhtml:div')
      .style('width', `${width}px`)
      .style('height', `${height}px`)
      .style('display', 'flex')
      .style('align-items', 'center')
      .style('justify-content', 'center')
      .style('text-align', 'center')
      .style('font-size', `${node.fontSize}px`)
      .style('font-weight', 'bold')
      .style('color', node.bgType === 'bg' ? '#fff' : node.labelColor)
      .text(node.label);
  }
}
