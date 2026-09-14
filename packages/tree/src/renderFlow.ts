import type { FlowInstance, FlowOptions } from '@so-chart/types/tree';
import { applyFlowChart } from './normal';
import { select, path, Path, easeLinear } from 'd3';
import { setAutoSize } from './size';
import { drawArrowDefs, drawTooltip, getPolyLinkPath } from './renderMash';

export default function renderFlow(chart: FlowInstance, options: FlowOptions) {
  applyFlowChart(chart, options);
  drawDefs(chart);
  drawNodes(chart);
  drawLinks(chart);
  drawTooltip(chart);
  chart.resize = () => {
    setAutoSize.call(chart);
  };
}

function drawDefs(chart: FlowInstance) {
  const svg = select(chart.svg);
  let defs = svg.select<SVGDefsElement>('defs.so-chart_defs');
  if (defs.empty()) {
    defs = svg.append('defs').attr('class', 'so-chart_defs');
    // 渐变定义
    defs
      .append('linearGradient')
      .attr('id', 'gradBlue')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '100%')
      .attr('y2', '0%')
      .selectAll('stop')
      .data([
        { offset: '0%', color: '#2196f3' },
        { offset: '100%', color: '#3f51b5' },
      ])
      .enter()
      .append('stop')
      .attr('offset', d => d.offset)
      .attr('stop-color', d => d.color);
  }
}

function drawNodes(chart: FlowInstance) {
  const svg = select(chart.svg);
  const { datasets, nodeHeight, nodeWidth } = chart;
  const { nodes } = datasets;

  let nodesGroup = svg.select<SVGGElement>('g.so-chart_nodes');
  if (nodesGroup.empty()) {
    nodesGroup = svg.append('g').attr('class', 'so-chart_nodes');
  } else {
    nodesGroup.selectAll('*').remove(); // 清除旧的节点
  }

  const node = nodesGroup
    .selectAll('g')
    .data(nodes)
    .enter()
    .append('g')
    .attr('transform', d => `translate(${d.x}, ${d.y})`);

  // 节点背景
  node
    .append('rect')
    .attr('cursor', 'pointer')
    .attr('rx', d => d.rx) // 圆角
    .attr('ry', d => d.ry)
    .attr('x', -nodeWidth / 2)
    .attr('y', -nodeHeight / 2)
    .attr('width', nodeWidth)
    .attr('height', nodeHeight)
    .attr('stroke', d => d.strokeColor)
    .attr('stroke-width', 2)
    .attr('fill', d => (d.bgType === 'linearGradient' ? 'url(#gradBlue)' : d.bgType === 'bg' ? d.bgColor : 'none'));

  // 文本
  node
    .attr('cursor', 'pointer')
    .attr('text-anchor', 'middle')
    .style('font-size', d => d.fontSize)
    .each(function (d) {
      const g = select(this);
      const lines = d.label.split('\n');
      if (lines.length > 1) {
        const text = g.append('text');
        text
          .selectAll('tspan')
          .data(lines)
          .enter()
          .append('tspan')
          .attr('x', 0)
          .attr('dy', (_d, i) => (i === 0 ? -5 : 20))
          // 第一个 tspans 是标题，后续是描述，标题需要字体加粗
          // .style('font-weight', (_d, i) => (i === 0 ? 'bold' : 'normal'))
          .style('font-weight', 'bold')
          .style('fill', function () {
            const nodeData = this.parentNode && (select(this.parentNode as SVGTextElement).datum() as (typeof nodes)[number]);
            return nodeData && (nodeData.bgType === 'linearGradient' || nodeData.bgType === 'bg') ? '#fff' : d.fontColor;
          })
          .text(d => d);
      } else {
        g.append('foreignObject')
          .attr('width', nodeWidth)
          .attr('height', nodeHeight)
          .attr('x', -nodeWidth / 2)
          .attr('y', -nodeHeight / 2)
          .append('xhtml:div')
          .style('width', `${nodeWidth}px`)
          .style('height', `${nodeHeight}px`)
          .style('display', 'flex')
          .style('align-items', 'center')
          .style('justify-content', 'center')
          .style('text-align', 'center')
          .style('font-size', `${d.fontSize}px`)
          .style('font-weight', 'bold')
          .style('color', d.bgType === 'linearGradient' || d.bgType === 'bg' ? '#fff' : d.fontColor)
          .text(d.label);
      }
    });

  // 绘制tooltip
  node
    .on('mouseover', function (_event, node) {
      const tooltipGroup = svg.select<SVGGElement>('g.so-chart_tree_tooltip');
      tooltipGroup.style('display', 'block');
      const text = tooltipGroup.select<SVGGraphicsElement>('text');
      const textBg = tooltipGroup.select<SVGGraphicsElement>('rect');
      // 显示tooltip，写入提示文字
      if (node.tooltipText) {
        tooltipGroup.transition().ease(easeLinear).duration(100).attr('transform', `translate(${node.x}, ${node.y})`);
        const textX = 0;
        const textY = -(nodeHeight / 2) - node.fontSize;
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
    })
    .on('mouseout', function () {
      const tooltipGroup = svg.select('g.so-chart_tree_tooltip');
      tooltipGroup.style('display', 'none');
    });
}

function drawLinks(chart: FlowInstance) {
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

  edges.forEach((edge, i) => {
    const edgeGroup = linksGroup.append('g');
    const p = path();
    const { type, radius, points, roundPosition, poly, arrow, endType, label } = edge;
    const [source, target] = points;
    const [x1, y1] = source;
    const [x2, y2] = target;
    if (type === 'straight') {
      p.moveTo(x1, y1);
      p.lineTo(x2, y2);
    } else if (type === 'round') {
      getRoundLinkPath(p, [x1, y1], [x2, y2], radius, roundPosition);
    } else if (type === 'poly') {
      getPolyLinkPath(p, [x1, y1], [x2, y2], radius, poly);
    }

    const color = arrow.color;
    drawArrowDefs(chart, i, color);
    const pathGroup = edgeGroup
      .append('path')
      .attr('id', `${chartId}-${i}-link_path`)
      .attr('d', p.toString())
      .attr('fill', 'none')
      .attr('stroke', color)
      .attr('stroke-width', arrow.strokeWidth)
      .attr('marker-end', endType === 'arrow' ? `url(#${chartId}_arrow_${i})` : 'none');

    if (label && label.text) {
      const textEle = edgeGroup.append('text').attr('color', label.fontColor).attr('fill', label.fontColor);
      if (label.pos === 'auto' || label.dir === 'parallel') {
        const pathEle = pathGroup.node() as SVGGeometryElement;
        const pathLength = pathEle.getTotalLength();
        const startOffset = label.pos === 'auto' ? pathLength / 2 : label.startOffset;
        const textPath = textEle
          .attr('dy', -2)
          .append('textPath')
          .attr('fill', 'currentColor')
          .attr('startOffset', startOffset)
          .attr('text-anchor', 'middle')
          .attr('href', `#${chartId}-${i}-link_path`)
          .text(label.text);

        const textNode = textEle.node();
        const textWidth = textNode ? getFlowLabelTextWidth(textNode) : 0;
        const labelPathLayout = textNode ? getLabelPathLayout(pathEle, startOffset, textNode, textWidth) : undefined;
        if (labelPathLayout) {
          const labelPathId = `${chartId}-${i}-label_path`;
          edgeGroup
            .append('path')
            .attr('id', labelPathId)
            .attr('d', labelPathLayout.d)
            .attr('fill', 'none')
            .attr('stroke', 'none')
            .style('pointer-events', 'none');
          textPath.attr('href', `#${labelPathId}`).attr('startOffset', labelPathLayout.startOffset);
        }
      } else {
        textEle
          .attr('x', (x1 + x2) / 2)
          .attr('y', (y1 + y2) / 2)
          .attr('dy', -2)
          .attr('text-anchor', 'middle')
          .text(label.text);
      }
    }
  });
}

const LABEL_PATH_PADDING = 8;
const PATH_SAMPLE_STEP = 4;
const PATH_SUBPATH_STEP = 2;
const MIN_STRAIGHT_RANGE_LENGTH = PATH_SAMPLE_STEP * 3;
const MIN_LABEL_FONT_SIZE = 10;
const STRAIGHT_ANGLE_TOLERANCE = Math.PI / 36;

type PathRange = {
  start: number;
  end: number;
};

type LabelPathLayout = {
  d: string;
  startOffset: number;
};

function getLabelPathLayout(
  pathEle: SVGGeometryElement,
  desiredOffset: number,
  textNode: SVGTextElement,
  textWidth: number
): LabelPathLayout | undefined {
  const pathLength = pathEle.getTotalLength();
  if (!pathLength || !textWidth || typeof pathEle.getPointAtLength !== 'function') return;

  const ranges = getPathLabelRanges(pathEle, pathLength);
  if (!ranges.length) return;

  const desiredRange = ranges.find(range => desiredOffset >= range.start && desiredOffset <= range.end);
  const requiredLength = textWidth + LABEL_PATH_PADDING * 2;
  if (desiredRange && desiredRange.end - desiredRange.start >= requiredLength) return;

  const availablePathLength = pathLength - LABEL_PATH_PADDING * 2;
  if (availablePathLength < PATH_SAMPLE_STEP * 2) return;

  const fittedTextWidth = fitLabelTypography(textNode, textWidth, availablePathLength);
  if (!fittedTextWidth) return;

  const labelWindowLength = Math.min(pathLength, fittedTextWidth + LABEL_PATH_PADDING * 2);
  // 当前局部区间放不下时，以整条真实路径的中点作为最佳视觉中心，
  // 避免沿用原 startOffset 后在路径末端留下明显的空白。
  const centerOffset = pathLength / 2;
  const windowStart = centerOffset - labelWindowLength / 2;
  const windowEnd = windowStart + labelWindowLength;
  const startPoint = pathEle.getPointAtLength(windowStart);
  const endPoint = pathEle.getPointAtLength(windowEnd);
  const labelPath = getPathSubPath(pathEle, windowStart, windowEnd, startPoint, endPoint);

  return {
    d: labelPath,
    startOffset: centerOffset - windowStart,
  };
}

function fitLabelTypography(textNode: SVGTextElement, textWidth: number, availableTextWidth: number): number {
  const textSelection = select(textNode);
  const computedStyle = window.getComputedStyle(textNode);
  const baseFontSize = Number.parseFloat(computedStyle.fontSize) || 14;
  const baseLetterSpacing = Number.parseFloat(computedStyle.letterSpacing) || 0;
  const fontScale = Math.min(1, availableTextWidth / textWidth);
  const fontSize = Math.max(MIN_LABEL_FONT_SIZE, baseFontSize * fontScale);

  if (fontSize < baseFontSize) {
    textSelection.style('font-size', `${fontSize}px`);
  }

  let fittedTextWidth = getFlowLabelTextWidth(textNode);
  const characterCount = Array.from(textNode.textContent || '').length;
  if (fittedTextWidth > availableTextWidth && characterCount > 1) {
    const letterSpacing = baseLetterSpacing - (fittedTextWidth - availableTextWidth) / (characterCount - 1);
    textSelection.style('letter-spacing', `${letterSpacing}px`);
    fittedTextWidth = getFlowLabelTextWidth(textNode);
  }

  return fittedTextWidth;
}

function getFlowLabelTextWidth(textNode: SVGTextElement): number {
  if (typeof textNode.getComputedTextLength === 'function') {
    const measuredLength = textNode.getComputedTextLength();
    if (measuredLength > 0) return measuredLength;
  }

  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (!context) return 0;
  const style = window.getComputedStyle(textNode);
  context.font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
  const text = textNode.textContent || '';
  const letterSpacing = Number.parseFloat(style.letterSpacing) || 0;
  return context.measureText(text).width + Math.max(0, text.length - 1) * letterSpacing;
}

function getPathLabelRanges(pathEle: SVGGeometryElement, pathLength: number): PathRange[] {
  const straightRanges = getStraightPathRanges(pathEle, pathLength);
  const stableRanges = straightRanges.filter(range => range.end - range.start >= MIN_STRAIGHT_RANGE_LENGTH);
  if (!stableRanges.length) return [{ start: 0, end: pathLength }];

  return stableRanges.map((_, index) => ({
    // 保留当前稳定方向与相邻方向之间的圆角弧线，让文字仍然沿真实路径转弯。
    start: index === 0 ? 0 : stableRanges[index - 1].end,
    end: index === stableRanges.length - 1 ? pathLength : stableRanges[index + 1].start,
  }));
}

function getPathSubPath(pathEle: SVGGeometryElement, start: number, end: number, startPoint: DOMPoint, endPoint: DOMPoint): string {
  const subPath = path();
  const subPathLength = end - start;
  const sampleCount = Math.max(1, Math.ceil(subPathLength / PATH_SUBPATH_STEP));
  subPath.moveTo(startPoint.x, startPoint.y);
  for (let index = 1; index < sampleCount; index += 1) {
    const point = pathEle.getPointAtLength(start + (index / sampleCount) * subPathLength);
    subPath.lineTo(point.x, point.y);
  }
  subPath.lineTo(endPoint.x, endPoint.y);
  return subPath.toString();
}

function getStraightPathRanges(pathEle: SVGGeometryElement, pathLength: number): PathRange[] {
  const sampleCount = Math.max(1, Math.ceil(pathLength / PATH_SAMPLE_STEP));
  const samplePositions = Array.from({ length: sampleCount + 1 }, (_, index) => (index / sampleCount) * pathLength);
  const getAngle = (position: number) => {
    const delta = Math.min(PATH_SAMPLE_STEP, pathLength / 2);
    const start = Math.max(0, position - delta);
    const end = Math.min(pathLength, position + delta);
    const startPoint = pathEle.getPointAtLength(start);
    const endPoint = pathEle.getPointAtLength(end);
    return Math.atan2(endPoint.y - startPoint.y, endPoint.x - startPoint.x);
  };

  const ranges: PathRange[] = [];
  let rangeStart = samplePositions[0];
  let rangeAngle = getAngle(rangeStart);
  samplePositions.slice(1).forEach(position => {
    const angle = getAngle(position);
    if (getAngleDistance(angle, rangeAngle) > STRAIGHT_ANGLE_TOLERANCE) {
      ranges.push({ start: rangeStart, end: position });
      rangeStart = position;
      rangeAngle = angle;
    }
  });
  ranges.push({ start: rangeStart, end: pathLength });
  return ranges;
}

function getAngleDistance(angle1: number, angle2: number): number {
  return Math.abs(Math.atan2(Math.sin(angle1 - angle2), Math.cos(angle1 - angle2)));
}

function getRoundLinkPath(p: Path, p1: number[], p2: number[], radius: number, roundPosition: 'start' | 'end') {
  const [x1, y1] = p1;
  const [x2, y2] = p2;
  p.moveTo(x1, y1); // 起点

  // 点2在点1的右上角
  if (x2 > x1 && y2 < y1) {
    if (roundPosition === 'end') {
      // 从起点开始圆角，也就是圆角在右下
      p.lineTo(x2 - radius, y1); // 先竖直走到拐角
      p.arcTo(x2, y1, x2, y1 - radius, radius); // 圆弧拐角
      p.lineTo(x2, y2); // 水平走到终点
    } else {
      // 从起点开始圆角，也就是圆角在左上
      p.lineTo(x1, y2 + radius); // 先水平走到拐角
      p.arcTo(x1, y2, x1 + radius, y2, radius); // 圆弧拐角
      p.lineTo(x2, y2); // 竖直走到终点
    }
  } else {
    if (roundPosition === 'end') {
      // 从终点开始圆角，也就是圆角在右上
      p.lineTo(x2 - radius, y1); // 先水平走到拐角
      p.arcTo(x2, y1, x2, y1 + radius, radius); // 圆弧拐角
      p.lineTo(x2, y2); // 竖直走到终点
    } else {
      // 从起点开始圆角，也就是圆角在左下
      p.lineTo(x1, y2 - radius); // 先竖直下来
      p.arcTo(x1, y2, x1 + radius, y2, radius); // 圆弧拐角
      p.lineTo(x2, y2); // 水平走到终点
    }
  }
}
