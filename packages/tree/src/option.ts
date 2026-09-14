import type { BaseOptions } from '@so-chart/types/common';
import type { BaseTreeInstance, DagreInstance, DagreTreeOptions, FlowInstance, FlowOptions, MashInstance, MashOptions } from '@so-chart/types/tree';
import renderDagre from './renderDagre';
import { throttleResize } from '@so-chart/utils';
import renderFlow from './renderFlow';
import renderMash from './renderMash';

function setOption(this: BaseTreeInstance, options: BaseOptions): void {
  if (this.chartType === 'dagre') {
    renderDagre(this as DagreInstance, options as DagreTreeOptions);
  } else if (this.chartType === 'flow') {
    renderFlow(this as FlowInstance, options as FlowOptions);
  } else if (this.chartType === 'mash') {
    renderMash(this as MashInstance, options as MashOptions);
  } else {
    throw new Error(`Unsupported chart type: ${this.chartType}`);
  }
  this.channel?.cleanup();
  this.channel = throttleResize(this, 200);
}

export default setOption;
