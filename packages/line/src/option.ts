import type { BaseLineChartInstance, LineChartInstance, LineOptions } from '@so-chart/types/line';
import { throttleResize } from '@so-chart/utils';
import renderLine from './renderLine';
import { bindListener } from './listener';
import type { BaseOptions } from '@so-chart/types/common';

function setOption(this: BaseLineChartInstance, options: BaseOptions): void {
  const isFirstOption = this.channel == undefined;
  this.cs = options.cs;
  if (this.chartType === 'line') {
    renderLine(this as LineChartInstance, options as LineOptions);
  }
  if (isFirstOption) {
    this.channel = throttleResize(this, 200);
  } else {
    this.resize();
  }
  bindListener(this);
}

export default setOption;
