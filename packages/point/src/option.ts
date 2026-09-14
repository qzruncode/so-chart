import type { BasePointChartInstance, PointChartInstance, PointOptions } from '@so-chart/types/point';
import type { BaseOptions } from '@so-chart/types/common';
import { throttleResize } from '@so-chart/utils';
import renderPoint from './renderPoint';
import { bindListener } from './listener';

function setOption(this: BasePointChartInstance, options: BaseOptions): void {
  const isFirstOption = this.channel == undefined;
  this.cs = options.cs;
  if (this.chartType === 'point') {
    renderPoint(this as PointChartInstance, options as PointOptions);
  }
  if (isFirstOption) {
    this.channel = throttleResize(this, 200);
  } else {
    this.resize();
  }
  bindListener(this);
}

export default setOption;
