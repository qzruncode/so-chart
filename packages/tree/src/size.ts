import type { BaseTreeInstance } from '@so-chart/types/tree';
import { getDomWidth } from '@so-chart/utils';

export function setSize(this: BaseTreeInstance) {
  const { container, layout } = this;

  const width = getDomWidth(container);
  const height = layout.height;

  this.svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
  this.svg.style.width = width + 'px';
  this.svg.style.height = height + 'px';
  this.svg.setAttribute('width', `${width}`);
  this.svg.setAttribute('height', `${height}`);

  this.layout.width = width;
}

export function setAutoSize(this: BaseTreeInstance, width?: number) {
  const { layout } = this;
  const height = layout.height;
  this.svg.setAttribute('viewBox', `0 0 ${Math.max(width ?? 1200, 1200)} ${height}`);
}
