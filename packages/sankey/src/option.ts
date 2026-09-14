import type { BaseOptions } from '@so-chart/types/common';
import renderDataflow from './dataflow';
import type { BaseSankeyInstance, DataflowInstance, DataflowOptions } from '@so-chart/types/sankey';

function setOption(this: BaseSankeyInstance, options: BaseOptions): void {
  this.cs = options.cs;
  if (this.chartType === 'dataflow') {
    renderDataflow(this as DataflowInstance, options as DataflowOptions);
  }
}

export default setOption;
