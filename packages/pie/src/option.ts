import type { BaseOptions } from '@so-chart/types/common';
import { throttleResize } from '@so-chart/utils';
import type { BasePieChartInstance, PieChartInstance, PieOptions } from '@so-chart/types/pie';
import renderPie from './renderPie';
import { bindListener } from './listener';

function setOption(this: BasePieChartInstance, options: BaseOptions): void {
  const isFirstOption = this.channel == undefined;
  this.cs = options.cs;
  if (this.chartType === 'pie') {
    renderPie(this as PieChartInstance, options as PieOptions);
  }
  if (isFirstOption) {
    this.channel = throttleResize(this, 200);
  } else {
    this.resize();
  }
  bindListener(this);
}

export default setOption;
