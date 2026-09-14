import type { DataflowInstance, DataflowOptions, DataflowStyle } from '@so-chart/types/sankey';
import { D, getColor } from '@so-chart/utils';
import { color } from 'd3';
import type { Animate } from '@so-chart/types/common';

export function applyDataflowChart(chart: DataflowInstance, options: DataflowOptions) {
  chart.datasets = applyDataflowDatasets(options);
  chart.style = applyStyle(options.style);
  chart.animate = applyAnimate(options.animate);
}

function applyDataflowDatasets(options: DataflowOptions) {
  const { datasets, cs } = options;
  const { nodes = [], links = [] } = datasets;
  const newNodes: Array<Required<(typeof nodes)[number]>> = [];
  const newLinks: Array<Required<(typeof links)[number]>> = [];
  type Node = (typeof newNodes)[number];
  type Link = (typeof newLinks)[number];

  nodes.forEach((d, i) => {
    const nd = Object.assign({}, d) as Node;
    const color = getColor({ i, cs });
    D<Node, 'color'>(nd, 'color', color);
    newNodes.push(nd);
  });

  links.forEach(d => {
    const nd = Object.assign({}, d) as Link;
    const bg = color(getColor({ i: 7, cs: 'bluegray' }))!;
    bg.opacity = 0.1;
    D<Link, 'color'>(nd, 'color', bg.toString());
    newLinks.push(nd);
  });

  return { nodes: newNodes, links: newLinks };
}

function applyStyle(style?: DataflowStyle) {
  const newStyle = (style ? Object.assign({}, style) : {}) as Required<DataflowStyle>;
  D<Required<DataflowStyle>, 'fontSize'>(newStyle, 'fontSize', 10);
  D<Required<DataflowStyle>, 'fontColor'>(newStyle, 'fontColor', 'rgba(0, 0, 0, 0.5)');
  D<Required<DataflowStyle>, 'nodeWidth'>(newStyle, 'nodeWidth', 30);
  D<Required<DataflowStyle>, 'nodePadding'>(newStyle, 'nodePadding', 20);
  D<Required<DataflowStyle>, 'textMargin'>(newStyle, 'textMargin', 6);
  D<Required<DataflowStyle>, 'linkHoverColor'>(newStyle, 'linkHoverColor', '#2a72dc');
  D<Required<DataflowStyle>, 'linkHoverOpacity'>(newStyle, 'linkHoverOpacity', 0.35);
  D<Required<DataflowStyle>, 'linkHoverWidth'>(newStyle, 'linkHoverWidth', 2.5);
  D<Required<DataflowStyle>, 'linkHoverHitWidth'>(newStyle, 'linkHoverHitWidth', 14);
  return newStyle;
}

function applyAnimate(animate?: Animate) {
  const newAnimate = (animate ? Object.assign({}, animate) : {}) as Required<Animate>;
  D<typeof newAnimate, 'ease'>(newAnimate, 'ease', 'linear');
  D<typeof newAnimate, 'duration'>(newAnimate, 'duration', 300);
  D<typeof newAnimate, 'switch'>(newAnimate, 'switch', 'on');
  return newAnimate;
}
