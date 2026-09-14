import type { CalendarHeatmapInstance, CalendarHeatmapOptions } from '@so-chart/types/calendar';
import { drawHeatmap } from './drawHeatmap';
import { applyCalendarHeatmapChart } from './normal';

export default function renderHeatmap(chart: CalendarHeatmapInstance, options: CalendarHeatmapOptions) {
  applyCalendarHeatmapChart(chart, options);
  drawHeatmap(chart);
}

export function getWeeksInMonth(year: number, month: number) {
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const startDayOfWeek = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();
  const totalWeeks = Math.ceil((daysInMonth + startDayOfWeek) / 7);
  return totalWeeks;
}

export function getWeekOfMonth(date: Date) {
  const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const dayOfWeek = firstDayOfMonth.getDay();
  const offsetDate = date.getDate() + dayOfWeek - 1;
  return Math.floor(offsetDate / 7) + 1;
}

export function getStartAndEndOfRecentYear() {
  const start = new Date();
  start.setFullYear(start.getFullYear() - 1);
  const end = new Date();
  return { firstDate: start, endDate: end };
}

export function getFirstDayOfMonth(date: Date) {
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  return firstDay;
}

export function getLastDayOfMonth(date: Date) {
  const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  return lastDay;
}
