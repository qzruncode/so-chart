import type { BaseCalendarInstance } from '@so-chart/types/calendar';

export function setSize(this: BaseCalendarInstance) {
  const { layout } = this;
  const height = layout.height;
  this.svg.setAttribute('viewBox', `0 0 1200 ${height}`);
}
