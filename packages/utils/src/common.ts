import type { Layout, LabelsOptions, TooltipOptions, CrossOptions, Animate, MarkOption, ColorSystem, RequiredMarkOption } from '@so-chart/types/common';
import { D, S } from './helper';
import { getColor } from './color';

const defaultLayout = {
  height: 400,
  top: 30,
  right: 30,
  bottom: 30,
  left: 30,
  width: 0,
};

export function applyChartLayout({ layout, commonLayout = defaultLayout }: { layout?: Layout; commonLayout?: typeof defaultLayout }) {
  const newLayout = (layout ? Object.assign({}, layout) : {}) as Required<Layout & { width: number }>;
  D<typeof newLayout, 'height'>(newLayout, 'height', commonLayout.height);
  D<typeof newLayout, 'top'>(newLayout, 'top', commonLayout.top);
  D<typeof newLayout, 'right'>(newLayout, 'right', commonLayout.right);
  D<typeof newLayout, 'bottom'>(newLayout, 'bottom', commonLayout.bottom);
  D<typeof newLayout, 'left'>(newLayout, 'left', commonLayout.left);
  D<typeof newLayout, 'width'>(newLayout, 'width', commonLayout.width);
  // 自适应屏幕分辨率
  S<typeof newLayout, 'height'>(newLayout, 'height');
  S<typeof newLayout, 'top'>(newLayout, 'top');
  S<typeof newLayout, 'right'>(newLayout, 'right');
  S<typeof newLayout, 'bottom'>(newLayout, 'bottom');
  S<typeof newLayout, 'left'>(newLayout, 'left');
  return newLayout;
}

export function applyChartLayoutWithoutScale({ layout, commonLayout = defaultLayout }: { layout?: Layout; commonLayout?: typeof defaultLayout }) {
  const newLayout = (layout ? Object.assign({}, layout) : {}) as Required<Layout & { width: number }>;
  D<typeof newLayout, 'height'>(newLayout, 'height', commonLayout.height);
  D<typeof newLayout, 'top'>(newLayout, 'top', commonLayout.top);
  D<typeof newLayout, 'right'>(newLayout, 'right', commonLayout.right);
  D<typeof newLayout, 'bottom'>(newLayout, 'bottom', commonLayout.bottom);
  D<typeof newLayout, 'left'>(newLayout, 'left', commonLayout.left);
  D<typeof newLayout, 'width'>(newLayout, 'width', commonLayout.width);
  return newLayout;
}

export function applyLabels(params: { labels?: LabelsOptions; defaultLableData: string[] }) {
  const { labels, defaultLableData } = params;
  const newLabels = (labels ? Object.assign({}, labels) : {}) as Required<LabelsOptions>;
  D<Required<LabelsOptions>, 'show'>(newLabels, 'show', true);
  D<Required<LabelsOptions>, 'data'>(newLabels, 'data', defaultLableData);
  D<Required<LabelsOptions>, 'type'>(newLabels, 'type', 'circle');
  D<Required<LabelsOptions>, 'path'>(newLabels, 'path', '');
  D<Required<LabelsOptions>, 'orient'>(newLabels, 'orient', 'horizontal');
  D<Required<LabelsOptions>, 'position'>(newLabels, 'position', 'bottom');
  D<Required<LabelsOptions>, 'dataMap'>(newLabels, 'dataMap', {});
  D<Required<LabelsOptions>, 'fontSize'>(newLabels, 'fontSize', 12);
  D<Required<LabelsOptions>, 'fontColor'>(newLabels, 'fontColor', 'rgba(0, 0, 0, 0.5)');
  D<Required<LabelsOptions>, 'extraTextType'>(newLabels, 'extraTextType', 'horizontal');
  D<Required<LabelsOptions>, 'extraTextColor'>(newLabels, 'extraTextColor', 'rgba(0, 0, 0, 0.5)');
  D<Required<LabelsOptions>, 'extraTextSize'>(newLabels, 'extraTextSize', 12);
  D<Required<LabelsOptions>, 'maxHeight'>(newLabels, 'maxHeight', 100);
  return newLabels;
}

export function applyTooltip(tooltip?: TooltipOptions) {
  const newTooltip = (tooltip ? Object.assign({}, tooltip) : {}) as Required<TooltipOptions>;
  D<Required<TooltipOptions>, 'show'>(newTooltip, 'show', true);
  D<Required<TooltipOptions>, 'formatter'>(newTooltip, 'formatter', v => v);
  D<Required<TooltipOptions>, 'index'>(newTooltip, 'index', -1);
  D<Required<TooltipOptions>, 'fixed'>(newTooltip, 'fixed', false);
  D<Required<TooltipOptions>, 'drag'>(newTooltip, 'drag', false);
  D<Required<TooltipOptions>, 'extra'>(newTooltip, 'extra', {});
  return newTooltip;
}

export function applyCross(cross: CrossOptions | undefined) {
  const newCross = (cross ? Object.assign({}, cross) : {}) as Required<CrossOptions>;
  D<Required<CrossOptions>, 'showXLine'>(newCross, 'showXLine', true);
  D<Required<CrossOptions>, 'showYLine'>(newCross, 'showYLine', true);
  D<Required<CrossOptions>, 'showHint'>(newCross, 'showHint', true);
  D<Required<CrossOptions>, 'lineColor'>(newCross, 'lineColor', 'red');
  D<Required<CrossOptions>, 'hintSize'>(newCross, 'hintSize', 10);
  D<Required<CrossOptions>, 'lineWidth'>(newCross, 'lineWidth', 1);
  D<Required<CrossOptions>, 'lineDash'>(newCross, 'lineDash', [3, 3]);
  D<Required<CrossOptions>, 'showDots'>(newCross, 'showDots', true);
  D<Required<CrossOptions>, 'voronoiColor'>(newCross, 'voronoiColor', 'rgba(0, 0, 0, 0.5)');
  S<Required<CrossOptions>, 'hintSize'>(newCross, 'hintSize');
  S<Required<CrossOptions>, 'lineWidth'>(newCross, 'lineWidth');
  S<Required<CrossOptions>, 'lineDash'>(newCross, 'lineDash');
  return newCross;
}

export function applyAnimate(animate?: Animate) {
  const newAnimate = (animate ? Object.assign({}, animate) : {}) as Required<Animate> & { draw: () => void; progress: number };
  D<typeof newAnimate, 'ease'>(newAnimate, 'ease', 'linear');
  D<typeof newAnimate, 'duration'>(newAnimate, 'duration', 300);
  D<typeof newAnimate, 'switch'>(newAnimate, 'switch', 'on');
  newAnimate.draw = () => undefined;
  newAnimate.progress = 1;
  return newAnimate;
}

export function applyMark(params: { mark?: MarkOption; cs?: ColorSystem }) {
  const { mark, cs } = params;
  const newMark: RequiredMarkOption = [];
  mark?.forEach((d, i) => {
    const nd = Object.assign({}, d) as RequiredMarkOption[number];
    const color = getColor({ i, cs });
    if (nd.type === 'line') {
      D<typeof nd, 'lineColor'>(nd, 'lineColor', color);
      D<typeof nd, 'lineWidth'>(nd, 'lineWidth', 1);
      D<typeof nd, 'lineDash'>(nd, 'lineDash', [3, 3]);
      S<typeof nd, 'lineWidth'>(nd, 'lineWidth');
      S<typeof nd, 'lineDash'>(nd, 'lineDash');
    } else if (nd.type === 'point') {
      D<typeof nd, 'dotType'>(nd, 'dotType', 'fill');
      D<typeof nd, 'dotSize'>(nd, 'dotSize', 2);
      D<typeof nd, 'dotColor'>(nd, 'dotColor', color);
      S<typeof nd, 'dotSize'>(nd, 'dotSize');
    }
    newMark.push(nd);
  });
  return newMark;
}
