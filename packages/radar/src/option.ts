import type { BaseOptions } from '@so-chart/types/common';
import { throttleResize } from '@so-chart/utils';
import type { BaseRadarInstance, RadarInstance, RadarOptions } from '@so-chart/types/radar';
import renderRadar from './renderRadar';

function setOption(this: BaseRadarInstance, options: BaseOptions): void {
  const isFirstOption = this.channel == undefined;
  this.cs = options.cs;
  if (this.chartType === 'radar') {
    renderRadar(this as RadarInstance, options as RadarOptions);
  }
  if (isFirstOption) {
    this.channel = throttleResize(this, 200);
  } else {
    this.resize();
  }
}

export default setOption;
