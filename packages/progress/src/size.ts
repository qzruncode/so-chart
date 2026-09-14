import type { ProgressInstance, SliderInstance } from '@so-chart/types/progress';
import { getDomWidth } from '@so-chart/utils';

export function setSize(this: SliderInstance | ProgressInstance) {
  const { container, layout } = this;

  const width = getDomWidth(container);
  const { height } = layout;
  this.svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
  this.svg.style.width = width + 'px';
  this.svg.style.height = height + 'px';
  this.svg.setAttribute('width', `${width}`);
  this.svg.setAttribute('height', `${height}`);

  this.container.style.height = height + 'px';
  this.layout.width = width;
}

export function setWidth(this: SliderInstance | ProgressInstance) {
  const { container, layout } = this;

  const width = getDomWidth(container);
  const { height } = layout;

  this.svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
  this.svg.setAttribute('width', `${width}`);
  this.svg.style.width = width + 'px';

  this.layout.width = width;
}
