import type { BaseOptions } from '@so-chart/types/common';
import { throttleResize } from '@so-chart/utils';
import { renderProgress, renderSlider } from './render';
import type { ProgressInstance, ProgressOptions, SliderInstance, SliderOptions } from '@so-chart/types/progress';

function setOption(this: SliderInstance | ProgressInstance, options: BaseOptions): void {
  const isFirstOption = this.channel == undefined;
  this.cs = options.cs;
  if (this.chartType === 'slider') {
    renderSlider(this as SliderInstance, options as SliderOptions);
  } else if (this.chartType === 'progress') {
    renderProgress(this as ProgressInstance, options as ProgressOptions);
  }
  if (isFirstOption) {
    this.channel = throttleResize(this, 200);
  } else {
    this.resize();
  }
}

export default setOption;
