import type { DeepRequired } from '@so-chart/types/common';
import type {
  DagreTreeOptions,
  RequiredDagreTreeDataset,
  DagreInstance,
  FlowInstance,
  FlowOptions,
  FlowDataset,
  MashInstance,
  MashOptions,
  MashDataset,
} from '@so-chart/types/tree';
import { D } from '@so-chart/utils';

function applyDagreDatasets(options: DagreTreeOptions) {
  const { datasets } = options;
  datasets.edges = datasets.edges.map(edge => {
    const nd = Object.assign({}, edge) as Required<typeof edge>;
    D<Required<typeof edge>, 'color'>(nd, 'color', 'black');
    D<Required<typeof edge>, 'dash'>(nd, 'dash', '');
    D<Required<typeof edge>, 'label'>(nd, 'label', '');
    return nd;
  });
  datasets.nodes = datasets.nodes.map(node => {
    const nd = Object.assign({}, node) as Required<typeof node>;
    D<Required<typeof node>, 'width'>(nd, 'width', 100);
    D<Required<typeof node>, 'height'>(nd, 'height', 50);
    return nd;
  });
  return Object.assign({}, datasets) as RequiredDagreTreeDataset;
}

export function applyDagreTreeChart(chart: DagreInstance, options: DagreTreeOptions) {
  chart.linkType = options.linkType ?? 'straight';
  chart.datasets = applyDagreDatasets(options);
  chart.graphOption = options.graph ?? {};
}

function applyFlowDatasets(options: FlowOptions) {
  const { datasets } = options;
  datasets.nodes = datasets.nodes.map(node => {
    type RequiredNode = Required<typeof node>;
    const nd = Object.assign({}, node) as RequiredNode;
    D<RequiredNode, 'bgType'>(nd, 'bgType', 'none');
    D<RequiredNode, 'fontSize'>(nd, 'fontSize', 14);
    D<RequiredNode, 'fontColor'>(nd, 'fontColor', 'var(--text-color, rgba(0, 0, 0, 0.5))');
    D<RequiredNode, 'rx'>(nd, 'rx', 30);
    D<RequiredNode, 'ry'>(nd, 'ry', 30);
    D<RequiredNode, 'bgColor'>(nd, 'bgColor', '');
    D<RequiredNode, 'strokeColor'>(nd, 'strokeColor', '#1976d2');
    D<RequiredNode, 'tooltipText'>(nd, 'tooltipText', '');
    return nd;
  });
  datasets.edges = datasets.edges.map(edge => {
    type RequiredEdge = Required<typeof edge>;
    const nd = Object.assign({}, edge) as RequiredEdge;
    D<RequiredEdge, 'type'>(nd, 'type', 'straight');
    D<RequiredEdge, 'endType'>(nd, 'endType', 'arrow');
    D<RequiredEdge, 'roundPosition'>(nd, 'roundPosition', 'start');
    D<RequiredEdge, 'radius'>(nd, 'radius', 10);
    nd.poly = Object.assign({}, nd.poly);
    D<RequiredEdge['poly'], 'direction'>(nd.poly, 'direction', 'normal');
    const [source, target] = nd.points;
    const [x1] = source;
    const [x2] = target;
    const midX = (x1 + x2) / 2;
    D<RequiredEdge['poly'], 'intersectionPointX'>(nd.poly, 'intersectionPointX', midX);
    nd.arrow = Object.assign({}, nd.arrow);
    D<RequiredEdge['arrow'], 'strokeWidth'>(nd.arrow, 'strokeWidth', 3);
    D<RequiredEdge['arrow'], 'color'>(nd.arrow, 'color', '#B3B8C7');
    nd.label = Object.assign({}, nd.label);
    D<RequiredEdge['label'], 'text'>(nd.label, 'text', '');
    D<RequiredEdge['label'], 'pos'>(nd.label, 'pos', 'auto');
    D<RequiredEdge['label'], 'startOffset'>(nd.label, 'startOffset', 0);
    D<RequiredEdge['label'], 'dir'>(nd.label, 'dir', 'parallel');
    D<RequiredEdge['label'], 'fontColor'>(nd.label, 'fontColor', 'var(--text-color, rgba(0, 0, 0, 0.5))');
    return nd;
  });
  return datasets as DeepRequired<FlowDataset>;
}

export function applyFlowChart(chart: FlowInstance, options: FlowOptions) {
  chart.datasets = applyFlowDatasets(options);
  D<FlowInstance, 'nodeWidth'>(chart, 'nodeWidth', 120);
  D<FlowInstance, 'nodeHeight'>(chart, 'nodeHeight', 60);
}

export function applyMashChart(chart: MashInstance, options: MashOptions) {
  chart.datasets = applyMashDatasets(options);
}

function applyMashDatasets(options: MashOptions) {
  const { datasets } = options;
  datasets.nodes = datasets.nodes.map(node => {
    type RequiredNode = DeepRequired<typeof node>;
    const nd = Object.assign({}, node) as RequiredNode;
    D<RequiredNode, 'tooltipText'>(nd, 'tooltipText', '');
    D<RequiredNode, 'label'>(nd, 'label', '');
    D<RequiredNode, 'labelColor'>(nd, 'labelColor', 'var(--text-color, #000)');
    D<RequiredNode, 'bgType'>(nd, 'bgType', 'bg');
    D<RequiredNode, 'bgColor'>(nd, 'bgColor', '');
    D<RequiredNode, 'fontSize'>(nd, 'fontSize', 12);
    D<RequiredNode, 'width'>(nd, 'width', 120);
    D<RequiredNode, 'height'>(nd, 'height', 60);
    nd.rect = Object.assign({}, nd.rect);
    D<RequiredNode['rect'], 'rx'>(nd.rect, 'rx', nd.height / 2);
    D<RequiredNode['rect'], 'ry'>(nd.rect, 'ry', nd.height / 2);
    nd.circularFlow = Object.assign({}, nd.circularFlow);
    D<RequiredNode['circularFlow'], 'innerRadius'>(nd.circularFlow, 'innerRadius', 50);
    D<RequiredNode['circularFlow'], 'outerRadius'>(nd.circularFlow, 'outerRadius', 100);
    D<RequiredNode['circularFlow'], 'arrowHeight'>(nd.circularFlow, 'arrowHeight', 25);
    D<RequiredNode['circularFlow'], 'arrowWidth'>(nd.circularFlow, 'arrowWidth', nd.circularFlow.outerRadius - nd.circularFlow.innerRadius + 30);
    nd.circularFlow.data = (nd.circularFlow.data || []).map(d => {
      const dataItem = Object.assign({}, d);
      D<typeof dataItem, 'label'>(dataItem, 'label', '');
      D<typeof dataItem, 'fontSize'>(dataItem, 'fontSize', 12);
      D<typeof dataItem, 'backgroundColor'>(dataItem, 'backgroundColor', '');
      D<typeof dataItem, 'tooltipText'>(dataItem, 'tooltipText', '');
      return dataItem;
    });
    return nd;
  });
  datasets.edges = datasets.edges.map(edge => {
    type RequiredEdge = DeepRequired<typeof edge>;
    const nd = Object.assign({}, edge) as RequiredEdge;
    nd.arrow = Object.assign({}, nd.arrow);
    D<RequiredEdge, 'type'>(nd, 'type', 'straight');
    D<RequiredEdge, 'endType'>(nd, 'endType', 'arrow');
    D<RequiredEdge, 'radius'>(nd, 'radius', 10);
    D<RequiredEdge['arrow'], 'strokeWidth'>(nd.arrow, 'strokeWidth', 3);
    D<RequiredEdge['arrow'], 'color'>(nd.arrow, 'color', '#B3B8C7');
    nd.poly = Object.assign({}, nd.poly);
    D<RequiredEdge['poly'], 'direction'>(nd.poly, 'direction', 'normal');
    const [source, target] = nd.points;
    const [x1] = source;
    const [x2] = target;
    const midX = (x1 + x2) / 2;
    D<RequiredEdge['poly'], 'intersectionPointX'>(nd.poly, 'intersectionPointX', midX);
    return nd;
  });
  return datasets as DeepRequired<MashDataset>;
}
