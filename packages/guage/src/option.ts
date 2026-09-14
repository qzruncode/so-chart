import type {
  BaseGuageInstance,
  CircleGuageInstance,
  CircleGuageOptions,
  GuageInstance,
  GuageOptions,
  SingleGuageInstance,
  SingleGuageOptions,
} from '@so-chart/types/guage';
import type { BaseOptions } from '@so-chart/types/common';
import { throttleResize } from '@so-chart/utils';
import { renderCircleGuage, renderGuage, renderSingleGuage } from './render';
import { bindListener } from './listener';

function setOption(this: BaseGuageInstance | SingleGuageInstance, options: BaseOptions): void {
  const isFirstOption = this.channel == undefined;
  this.cs = options.cs;
  if (this.chartType === 'guage') {
    renderGuage(this as GuageInstance, options as GuageOptions);
  } else if (this.chartType === 'single') {
    const that = this as SingleGuageInstance;
    renderSingleGuage(that, options as SingleGuageOptions);
    bindListener(that);
  } else if (this.chartType === 'circle') {
    renderCircleGuage(this as CircleGuageInstance, options as CircleGuageOptions);
  }
  if (isFirstOption) {
    this.channel = throttleResize(this, 200);
  } else {
    this.resize();
  }
}

export default setOption;
