import type { BaseSankeyInstance } from '@so-chart/types/sankey';

export function setSize(this: BaseSankeyInstance) {
  const { layout } = this;
  const height = layout.height;
  layout.width = 1200;
  this.svg.setAttribute('viewBox', `0 0 1200 ${height}`);
}
