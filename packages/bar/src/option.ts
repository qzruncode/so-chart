import type {
  BarChartInstance,
  BarChartType,
  BarOptions,
  BaseBarChartInstance,
  CircleStackBarInstance,
  CircleStackBarOptions,
  TrendBarInstance,
  TrendBarOptions,
} from '@so-chart/types/bar';
import type { BaseOptions } from '@so-chart/types/common';
import { throttleResize } from '@so-chart/utils';
import renderBar from './render/renderBar';
import { bindListener } from './listener';
import renderCircleStackBar from './render/renderCircleStackBar';
import renderTrendBar from './render/renderTrendBar';

function setOption(this: BaseBarChartInstance & { chartType: BarChartType }, options: BaseOptions): void {
  const isFirstOption = this.channel == undefined;
  this.cs = options.cs;
  if (this.chartType === 'bar') {
    renderBar(this as BarChartInstance, options as BarOptions);
  } else if (this.chartType === 'circleStackBar') {
    renderCircleStackBar(this as CircleStackBarInstance, options as CircleStackBarOptions);
  } else if (this.chartType === 'trend') {
    renderTrendBar(this as TrendBarInstance, options as TrendBarOptions);
  }
  if (isFirstOption) {
    this.channel = throttleResize(this, 200);
  } else {
    this.resize();
  }
  bindListener(this);
}

export default setOption;
