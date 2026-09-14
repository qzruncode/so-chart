import type { MashInstance } from '@so-chart/types/tree';
import { arc, easeLinear, path, select, Selection } from 'd3';

export default function drawCircleFlow(
  chart: MashInstance,
  container: Selection<SVGGElement, unknown, null, undefined>,
  node: MashInstance['datasets']['nodes'][number]
) {
  const svg = select(chart.svg);
  const g = container;
  const { innerRadius, outerRadius, data, arrowHeight, arrowWidth } = node.circularFlow || {};
  const offsetAngle = Math.PI / 3;
  const arrowOccupyAngle = (2 * Math.PI) / data.length / 4; // 箭头占用的角度

  // 绘制中心标题
  if (node.label) {
    g.append('text')
      .attr('x', 0)
      .attr('y', 0)
      .attr('text-anchor', 'middle')
      .style('font-size', `${node.fontSize}px`)
      .style('fill', node.labelColor)
      .style('font-weight', 'bold')
      .attr('dy', node.fontSize / 2)
      .text(node.label);
  }

  data.forEach((nodeData, i) => {
    const partGroup = g.append('g').attr('cursor', 'pointer');
    const arcInstance = arc();
    const totalStartAngle = offsetAngle + (i * 2 * Math.PI) / data.length;
    const totalEndAngle = offsetAngle + ((i + 1) * 2 * Math.PI) / data.length;
    const startAngle = totalStartAngle + arrowOccupyAngle / 2;
    const endAngle = totalEndAngle - arrowOccupyAngle / 2;
    const argument = {
      startAngle,
      endAngle,
      innerRadius,
      outerRadius,
    };

    const arcCenterPos = arcInstance.centroid(argument);
    const arcPath = arcInstance(argument);
    const bgColor = nodeData.backgroundColor ?? '#fff';
    // 绘制圆弧
    partGroup.append('path').attr('d', arcPath).attr('fill', bgColor);

    // 绘制箭头
    const rotateAngle = ((endAngle - startAngle) * 180) / Math.PI / 2;
    const { point: rotatePos, angleDeg: arrowAngle } = rotateOnCircle(arcCenterPos[0], arcCenterPos[1], rotateAngle, (innerRadius + outerRadius) / 2);
    const p = path();
    p.moveTo(0, 0);
    p.lineTo(-arrowWidth / 2, 0);
    p.lineTo(0, arrowHeight);
    p.lineTo(arrowWidth / 2, 0);
    p.closePath();
    partGroup
      .append('path')
      .attr('d', p.toString())
      .attr('fill', bgColor)
      .attr('transform', `translate(${rotatePos[0]}, ${rotatePos[1]}) rotate(${arrowAngle})`);

    // 绘制文字
    const texts = nodeData.label.split('\n');
    if (texts.length > 1) {
      partGroup
        .append('text')
        .attr('x', arcCenterPos[0])
        .attr('y', arcCenterPos[1])
        .attr('text-anchor', 'middle')
        .style('font-size', `${nodeData.fontSize}px`)
        .selectAll('tspan')
        .data(texts)
        .enter()
        .append('tspan')
        .attr('x', arcCenterPos[0])
        .attr('dy', (_d, i) => (i === 0 ? -5 : 20)) // 第一个 tspans 向上偏移一点
        // 第一个 tspans 是标题，后续是描述，标题需要字体加粗
        // .style('font-weight', (_d, i) => (i === 0 ? 'bold' : 'normal'))
        .style('font-weight', 'bold')
        .style('fill', '#fff')
        .text(d => d);
    } else {
      partGroup
        .append('text')
        .attr('x', arcCenterPos[0])
        .attr('y', arcCenterPos[1])
        .attr('text-anchor', 'middle')
        .style('font-size', `${nodeData.fontSize}px`)
        .attr('dy', nodeData.fontSize / 2)
        .style('font-weight', 'bold')
        .style('fill', '#fff')
        .text(nodeData.label);
    }

    // 绘制tooltip
    partGroup
      .on('mouseover', function () {
        const tooltipGroup = svg.select('g.so-chart_tree_tooltip');
        tooltipGroup.style('display', 'block');
        const text = tooltipGroup.select<SVGGraphicsElement>('text');
        const textBg = tooltipGroup.select<SVGGraphicsElement>('rect');
        // 显示tooltip，写入提示文字
        if (nodeData.tooltipText) {
          tooltipGroup.attr('transform', `translate(${node.x}, ${node.y})`);
          const textX = arcCenterPos[0];
          const textY = arcCenterPos[1] - nodeData.fontSize - 5;
          text.transition().ease(easeLinear).duration(100).attr('x', textX).attr('y', textY).text(nodeData.tooltipText);
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
                .attr('y', textY - nodeData.fontSize / 2 - textBgHeight / 2);
            }
          });
        } else {
          text.text('');
          textBg.attr('width', 0).attr('height', 0);
        }
      })
      .on('mouseout', function () {
        const tooltipGroup = svg.select('g.so-chart_tree_tooltip');
        tooltipGroup.style('display', 'none');
      });
  });
}

function rotateOnCircle(x: number, y: number, angleDeg: number, radius: number) {
  // 当前相对圆心的弧度
  const theta = Math.atan2(y, x);
  const glitch = 0.01; // js数字计算精度不够，用来修毛刺
  // 旋转后的弧度
  const thetaNew = theta + (angleDeg * Math.PI) / 180 - glitch;
  // 新坐标
  const xNew = radius * Math.cos(thetaNew);
  const yNew = radius * Math.sin(thetaNew);
  // 与 x 轴的夹角（弧度）
  const phiRad = Math.atan2(yNew, xNew);
  // 与 x 轴的夹角（角度）
  const phiDeg = (phiRad * 180) / Math.PI;
  return {
    point: [xNew, yNew],
    angleRad: phiRad,
    angleDeg: phiDeg,
  };
}
