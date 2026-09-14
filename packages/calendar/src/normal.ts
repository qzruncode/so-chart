import type { CalendarHeatmapInstance, CalendarHeatmapOptions, CalendarHeatmapDataset } from '@so-chart/types/calendar';
import { D } from '@so-chart/utils';

export function applyCalendarHeatmapChart(chart: CalendarHeatmapInstance, options: CalendarHeatmapOptions) {
  chart.tooltip = options.tooltip;
  chart.rangeData = options.rangeData;
  chart.year = applyYear(options.year);
  chart.week = applyWeek(options.week);
  chart.month = applyMonth(options.month);
  chart.cell = applyCell(options.cell);
  chart.datasets = applyHeatmapDatasets(options);
}

type YearOptions = NonNullable<CalendarHeatmapOptions['year']>;
function applyYear(year: YearOptions | undefined) {
  const newYear = (year ? Object.assign({}, year) : {}) as Required<YearOptions>;
  D<Required<YearOptions>, 'type'>(newYear, 'type', 'multipleLines');
  D<Required<YearOptions>, 'showTitle'>(newYear, 'showTitle', true);
  D<Required<YearOptions>, 'fontColor'>(newYear, 'fontColor', 'rgba(0, 0, 0)');
  D<Required<YearOptions>, 'fontSize'>(newYear, 'fontSize', 14);
  D<Required<YearOptions>, 'text'>(newYear, 'text', '年');
  return newYear;
}

type WeekOptions = NonNullable<CalendarHeatmapOptions['week']>;
function applyWeek(week: WeekOptions | undefined) {
  const newWeek = (week ? Object.assign({}, week) : {}) as Required<WeekOptions>;
  D<Required<WeekOptions>, 'fontColor'>(newWeek, 'fontColor', 'rgba(0, 0, 0, 0.5)');
  D<Required<WeekOptions>, 'fontSize'>(newWeek, 'fontSize', 10);
  const weeks = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  D<Required<WeekOptions>, 'data'>(newWeek, 'data', weeks);
  return newWeek;
}

type MonthOptions = NonNullable<CalendarHeatmapOptions['month']>;
function applyMonth(month: MonthOptions | undefined) {
  const newMonth = (month ? Object.assign({}, month) : {}) as Required<MonthOptions>;
  D<Required<MonthOptions>, 'fontColor'>(newMonth, 'fontColor', 'rgba(0, 0, 0, 0.5)');
  D<Required<MonthOptions>, 'fontSize'>(newMonth, 'fontSize', 10);
  const months = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
  D<Required<MonthOptions>, 'data'>(newMonth, 'data', months);
  return newMonth;
}

function applyHeatmapDatasets(options: CalendarHeatmapOptions) {
  const { datasets } = options;
  const newDatasets: Array<Required<CalendarHeatmapDataset>> = [];
  datasets?.forEach(d => {
    const nd = Object.assign({}, d) as Required<CalendarHeatmapDataset>;
    newDatasets.push(nd);
  });
  return newDatasets;
}

type CellOptions = NonNullable<CalendarHeatmapOptions['cell']>;
function applyCell(cell: CellOptions | undefined) {
  const newCell = (cell ? Object.assign({}, cell) : {}) as Required<CellOptions>;
  D<Required<CellOptions>, 'size'>(newCell, 'size', 12);
  D<Required<CellOptions>, 'cellPadding'>(newCell, 'cellPadding', 4);
  D<Required<CellOptions>, 'monthPadding'>(newCell, 'monthPadding', 10);
  D<Required<CellOptions>, 'weightType'>(newCell, 'weightType', 'color');
  D<Required<CellOptions>, 'colors'>(newCell, 'colors', ['#bee6ff', '#acd5f2', '#7fa8c9', '#527ba0', '#254e77']);
  D<Required<CellOptions>, 'opacityColor'>(newCell, 'opacityColor', 'rgb(8, 109, 244)');
  return newCell;
}
