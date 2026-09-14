import type { DagreInstance, DagreNode, DagreTreeOptions } from '@so-chart/types/tree';
import * as dagre from '@dagrejs/dagre';
import { curveBumpX, curveLinear, drag, line, select, zoom } from 'd3';
import bindListener from './event';
import { setTooltipPosition } from './tooltip';
import { setSize } from './size';
import { applyDagreTreeChart } from './normal';
import { getDomWidth } from '@so-chart/utils';

const strokeWidth = 0;

export default function renderDagre(chart: DagreInstance, options: DagreTreeOptions) {
  applyDagreTreeChart(chart, options);
  drawDagre(chart);
  chart.resize = () => {
    setSize.call(chart);
  };
}

function drawDagre(chart: DagreInstance) {
  const svg = select(chart.svg);
  const treeGroup = getTreeGroup(chart);
  const edgesGroup = treeGroup.select<SVGGElement>('.tree_edges');
  chart.graph = layoutData(chart);
  center(chart);
  setNode(chart, treeGroup);
  drawAppropriateEdgePath(edgesGroup, chart);
  handleDrag(chart)(treeGroup.selectAll('foreignObject.node'));
  handleZoom(svg, treeGroup);
}

function getTreeGroup(chart: DagreInstance) {
  const svg = select(chart.svg);
  let treeGroup = svg.select<SVGGElement>('g.so-chart_tree');
  if (treeGroup.empty()) {
    treeGroup = svg.append('g').attr('class', 'so-chart_tree');
    treeGroup.append('g').attr('class', 'tree_edges');
    treeGroup.append('g').attr('class', 'tree_nodes');
  }
  return treeGroup;
}

function layoutData(chart: DagreInstance) {
  const { datasets, graphOption } = chart;
  const graph: DagreInstance['graph'] = new dagre.graphlib.Graph();
  graph.setGraph({ rankdir: 'LR', ...graphOption });
  graph.setDefaultEdgeLabel(() => ({ color: 'black', dash: '', label: '' }));
  datasets.nodes.forEach(node => {
    const id = node['id'];
    graph.setNode(id, {
      width: node.width,
      height: node.height,
      nodeId: id,
      html: node.html,
    });
  });
  datasets.edges.forEach(d => {
    graph.setEdge(d['source'], d['target'], { color: d.color, dash: d.dash, label: d.label, minlen: d.minlen });
  });
  dagre.layout(graph);
  return graph;
}

function setNode(chart: DagreInstance, treeGroup: d3.Selection<SVGGElement, unknown, null, undefined>) {
  const { graph } = chart;
  const nodesGroup = treeGroup.select<SVGGElement>('.tree_nodes');
  const nodes = graph.nodes().map(d => graph.node(d));
  const objects = nodesGroup.selectAll('foreignObject').data(nodes).enter().append('foreignObject');
  objects
    .attr('class', 'node')
    .attr('width', d => d.width)
    .attr('height', d => d.height)
    .attr('x', d => d.x ?? 0)
    .attr('y', d => d.y ?? 0)
    .attr('node-id', d => d.nodeId)
    .html(d => d.html);
  bindListener(chart, objects);
}

function drawAppropriateEdgePath(edgesGroup: d3.Selection<SVGGElement, unknown, null, undefined>, chart: DagreInstance) {
  const { graph } = chart;
  const edges = graph.edges();
  edges.forEach(d => {
    const { path, dir } = calcEdgePath(chart, d) ?? {};
    if (path != undefined && dir != undefined) {
      const edgeGroup = edgesGroup.append('g').attr('class', 'tree_edge');
      const edge = graph.edge(d);
      // 箭头
      edgeGroup
        .append('defs')
        .append('marker')
        .attr('id', `arrow-${d.v}-${d.w}`)
        .attr('viewBox', '0 0 20 20')
        .attr('refX', 10)
        .attr('refY', 5)
        .attr('markerWidth', 10)
        .attr('markerHeight', 15)
        .attr('orient', 'auto-start-reverse')
        .append('path')
        .attr('d', 'M 0 0 L 10 5 L 0 10 z')
        .attr('stroke', edge.color)
        .attr('fill', edge.color)
        .attr('stroke-width', 2);
      // 连线
      edgeGroup
        .append('path')
        .attr('fill', 'none')
        .attr('stroke', edge.color)
        .attr('d', path)
        .attr('marker-end', `url(#arrow-${d.v}-${d.w})`)
        .attr('stroke-linecap', 'round')
        .attr('stroke-dasharray', edge.dash)
        .attr('id', `${d.v}-${d.w}`);
      // label
      const pathEle = select(`#${d.v}-${d.w}`).node() as SVGGeometryElement;
      const pathLength = pathEle.getTotalLength();
      edgeGroup
        .append('text')
        .attr('id', `${d.v}-${d.w}-text`)
        .attr('dy', -2)
        .style('user-select', 'text')
        .style('-webkit-user-select', 'text')
        .append('textPath')
        .attr('startOffset', pathLength / 2)
        .attr('text-anchor', 'middle')
        .attr('href', `#${d.v}-${d.w}`);
      setEdgeLabelDir(graph, d, dir);
    }
  });
}

function calcEdgePath(chart: DagreInstance, edge: dagre.Edge) {
  const { graph, linkType } = chart;
  const tail = graph.node(edge.v);
  const head = graph.node(edge.w);
  const tailEndPoints = getEdgeEndpoints(tail);
  const headEndPoints = getEdgeEndpoints(head);
  let nearest: { point: { x: number; y: number }[]; distanse: number } | undefined;
  tailEndPoints.forEach(d1 => {
    headEndPoints.forEach(d2 => {
      const [x1, y1] = d1;
      const [x2, y2] = d2;
      const distanse = Math.hypot(x2 - x1, y2 - y1);
      if (nearest == undefined || nearest.distanse > distanse) {
        nearest = {
          distanse,
          point: [
            { x: x1, y: y1 },
            { x: x2, y: y2 },
          ],
        };
      }
    });
  });
  if (nearest) {
    // 计算label的方向
    const p1 = nearest.point[0];
    const p2 = nearest.point[1];
    const { x: x1, y: y1 } = p1;
    const { x: x2, y: y2 } = p2;
    const angleRadians = Math.atan2(y2 - y1, x2 - x1);
    const angleDegrees = angleRadians * (180 / Math.PI);
    const dir = (angleDegrees <= -90 && angleDegrees >= -180) || (angleDegrees > 90 && angleDegrees < 180) ? -1 : 1;
    const path = line<{ x: number; y: number }>()
      .curve(linkType === 'curve' ? curveBumpX : curveLinear)
      .x(d => d.x)
      .y(d => d.y)(nearest.point);
    return { path, dir };
  }
}

function getEdgeEndpoints(data: DagreNode) {
  const x = data.x ?? 0;
  const y = data.y ?? 0;
  // 顺时针返回
  return [
    // [data.x - strokeWidth / 2, data.y - strokeWidth / 2], // 左上
    [x + data.width / 2, y - strokeWidth / 2], // 顶中
    // [data.x + strokeWidth / 2 + data.width, data.y - strokeWidth / 2], // 右上
    [x + strokeWidth / 2 + data.width, y + data.height / 2], // 右中
    // [data.x + strokeWidth / 2 + data.width, data.y + strokeWidth / 2 + data.height], // 右下
    [x + data.width / 2, y + strokeWidth / 2 + data.height], // 底中
    // [data.x - strokeWidth / 2, data.y + strokeWidth / 2 + data.height], //左下
    [x - strokeWidth / 2, y + data.height / 2], //左中
  ];
}

function setEdgeLabelDir(graph: DagreInstance['graph'], edge: dagre.Edge, dir: number) {
  const text = select(`#${edge.v}-${edge.w}-text`);
  let textStr = graph.edge(edge).label;
  if (dir === -1) {
    textStr = textStr.split('').reverse().join('');
    text.attr('rotate', 180);
  } else {
    text.attr('rotate', '');
  }
  text.select('textPath').text(textStr);
}

function handleDrag(chart: DagreInstance) {
  const { graph } = chart;
  const dragFn = drag()
    .on('start', function (event) {
      event.sourceEvent.stopPropagation();
    })
    .on('drag', function (event) {
      const node = select(this);
      const selectedNode = event.subject;
      const nodeId = event.subject.nodeId;
      selectedNode.x += event.dx;
      selectedNode.y += event.dy;
      node.attr('x', selectedNode.x).attr('y', selectedNode.y);
      setTooltipPosition(selectedNode);
      const edges = graph.edges();
      edges.forEach(d => {
        if (d.v == nodeId || d.w == nodeId) {
          const { path, dir } = calcEdgePath(chart, d) ?? {};
          if (path != undefined && dir != undefined) {
            const pathEle = select(`#${d.v}-${d.w}`).attr('d', path).node() as SVGGeometryElement;
            const pathLength = pathEle.getTotalLength();
            select(`[href="#${d.v}-${d.w}"]`).attr('startOffset', pathLength / 2);
            setEdgeLabelDir(graph, d, dir);
          }
        }
      });
    })
    .on('end', () => {});
  return dragFn;
}

function handleZoom(svg: d3.Selection<SVGSVGElement, unknown, null, undefined>, treeGroup: d3.Selection<SVGGElement, unknown, null, undefined>) {
  const zoomFn = zoom().scaleExtent([0.5, 4]);
  svg.style('touch-action', 'none');
  zoomFn.filter(function (event) {
    if (event.type === 'wheel') {
      return true;
    }
    if (event.type === 'touchstart') {
      return !(event.target instanceof Element && event.target.closest('foreignObject.node'));
    }
    if (event.type === 'mousedown') {
      // Allow background dragging to pan the graph, including macOS trackpad
      // three-finger drag events, while leaving node dragging and text
      // selection to the browser.
      const target = event.target instanceof Element ? event.target : null;
      const isNode = target?.closest('foreignObject.node');
      const isText = target?.closest('text, textPath, tspan');
      return event.button === 0 && !isNode && !isText;
    }
    return false;
  });

  zoomFn.on('zoom', event => {
    treeGroup.attr('transform', event.transform.toString());
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  zoomFn(svg as any); // 这里使用 any 是因为第三方库类型定义错误
}

function center(chart: DagreInstance) {
  const { container, layout, graph } = chart;
  const width = getDomWidth(container);
  const height = layout.height;
  const graphSize = graph.graph();
  chart.svg.setAttribute('viewBox', `${(-width + (graphSize.width ?? 0)) / 2} ${(-height + (graphSize.height ?? 0)) / 2} ${width} ${height}`);
}
