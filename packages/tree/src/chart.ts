import type { Layout } from '@so-chart/types/common';
import { applyChartLayoutWithoutScale, getSvg, getUid } from '@so-chart/utils';
import type { DagreInstance } from '@so-chart/types/tree';
import setOption from './option';
import { registerEvent, unBindListener } from './event';
import setTooltip from './tooltip';

function TreeChart(this: DagreInstance) {
  this.scale = Math.max(window.devicePixelRatio ?? 1, 2);

  this.init = (container: HTMLElement, layout?: Layout) => {
    this.chartId = getUid();
    this.svg = getSvg();
    this.container = container;
    this.layout = applyChartLayoutWithoutScale({ layout });
    this.setLayout();
    container.appendChild(this.svg);
  };
  this.setOption = setOption.bind(this);
  this.setTooltip = setTooltip.bind(this);

  this.dispose = () => {
    unBindListener(this.svg);
    this.resize = () => {};
    this.channel?.cleanup();
    this.eventChannel?.cleanup();
    this.listeners = undefined;
  };

  this.on = registerEvent.bind(this);
}

export default TreeChart as unknown as new () => DagreInstance;
