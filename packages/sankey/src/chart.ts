import type { Layout } from '@so-chart/types/common';
import { applyChartLayoutWithoutScale, getSvg, getUid } from '@so-chart/utils';
import { select } from 'd3';
import { setSize } from './size';
import setOption from './option';
import type { BaseSankeyInstance } from '@so-chart/types/sankey';

function SankeyChart(this: BaseSankeyInstance) {
  this.scale = Math.max(window.devicePixelRatio ?? 1, 2);
  this.init = (container: HTMLElement, layout?: Layout) => {
    this.chartId = getUid();
    this.svg = getSvg();
    this.svg.style.position = 'relative';
    this.container = container;
    this.layout = applyChartLayoutWithoutScale({ layout });
    this.setLayout();
    container.appendChild(this.svg);
  };
  this.setLayout = setSize.bind(this);
  this.setOption = setOption.bind(this);

  this.dispose = () => {
    select(this.svg).interrupt().on('.');
  };
}

export default SankeyChart as unknown as new () => BaseSankeyInstance;
