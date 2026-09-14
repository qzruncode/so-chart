import type { CalendarHeatmapInstance } from '@so-chart/types/calendar';
import { color, extent, scaleLinear, scaleQuantile, select, timeFormat, Selection } from 'd3';
import { getFirstDayOfMonth, getLastDayOfMonth, getWeekOfMonth, getWeeksInMonth } from './renderHeatmap';
import { handleTooltip } from './tooltip';

const dateFormatter = timeFormat('%Y-%m-%d');

export function drawHeatmap(chart: CalendarHeatmapInstance) {
  const svg = select(chart.svg);
  const { layout, rangeData, cell, year, month, week } = chart;
  const { size, cellPadding, monthPadding } = cell;
  const { left } = layout;

  let month_x = left;
  let year_y = 20;
  let day_x = 0;
  let day_y = 0;
  let preYearGroup: Selection<SVGGElement, unknown, null, undefined> | undefined;

  const firstDate = getFirstDayOfMonth(rangeData.start);
  const endDate = getLastDayOfMonth(rangeData.end);
  const firstYear = firstDate.getFullYear();
  const firstMonth = firstDate.getMonth() + 1;

  for (let d = firstDate; d <= endDate; d.setDate(d.getDate() + 1)) {
    const current = {
      year: d.getFullYear(),
      month: d.getMonth() + 1,
      day: d.getDate(),
    };
    let yearGroup = svg.select<SVGGElement>(`g.so-chart_calendar_year_${current.year}`);

    if (yearGroup.empty()) {
      yearGroup = svg.append('g').attr('class', `so-chart_calendar_year_${current.year}`);
      if (year.showTitle) {
        yearGroup
          .append('g')
          .attr('class', 'year_header')
          .append('text')
          .attr('font-size', year.fontSize)
          .attr('fill', year.fontColor)
          .text(`${current.year}${year.text}`);
      }
      yearGroup.append('g').attr('transform', `translate(0, 20)`).attr('class', 'year_content');
      month_x = year.type === 'multipleLines' ? left : current.year === firstYear ? left : monthPadding;

      if (year.type === 'multipleLines') {
        yearGroup.attr('transform', `translate(0, ${year_y})`);
        year_y += 7 * size * 2;
      } else {
        const { width = 0 } = preYearGroup?.node()?.getBBox() ?? {};
        yearGroup.attr('transform', `translate(${width}, ${year_y})`);
        preYearGroup = yearGroup;
      }
    }

    let monthGroup = yearGroup.select<SVGGElement>(`.year_content g.year_${current.year}_${current.month}`);
    if (monthGroup.empty()) {
      monthGroup = yearGroup.select('.year_content').append('g').attr('class', `year_${current.year}_${current.month}`);
      const monthWidth = getWeeksInMonth(current.year, current.month - 1) * (size + cellPadding);

      monthGroup
        .attr('transform', `translate(${month_x}, 0)`)
        .append('g')
        .attr('class', 'month_header')
        .append('text')
        .attr('font-size', month.fontSize)
        .attr('fill', month.fontColor)
        .text(month.data[current.month - 1]);
      monthGroup.append('g').attr('transform', `translate(0, 10)`).attr('class', 'month_content');

      month_x += monthWidth + monthPadding;
      day_x = day_y = 0;
    }

    if (
      (year.type === 'oneLine' && firstYear === current.year && current.month === firstMonth) ||
      (year.type === 'multipleLines' && (current.month === 1 || (current.month === firstMonth && firstYear === current.year)))
    ) {
      let weekGroup = monthGroup.select<SVGGElement>('g.weeks');
      if (weekGroup.empty()) {
        weekGroup = monthGroup.append('g').attr('class', 'weeks').attr('transform', `translate(0, 10)`);
        weekGroup
          .selectAll('text')
          .data(week.data)
          .enter()
          .append('text')
          .attr('font-size', week.fontSize)
          .attr('fill', week.fontColor)
          .attr('dominant-baseline', 'hanging')
          .attr('x', -left)
          .attr('y', (_d, i) => i * (size + cellPadding))
          .text(d => d);
      }
    }

    if (current.day === 1) {
      for (let i = 0; i < d.getDay(); i++) {
        monthGroup
          .select('.month_content')
          .append('rect')
          .attr('class', 'placeholder')
          .attr('width', size)
          .attr('height', size)
          .attr('fill', 'none')
          .attr('rx', 1)
          .attr('ry', 1)
          .attr('x', day_x)
          .attr('y', day_y);
        day_y += size + cellPadding;
      }
    }

    day_x = (getWeekOfMonth(d) - 1) * (size + cellPadding);
    day_y = d.getDay() * (size + cellPadding);
    const monthContent = monthGroup.select('.month_content');
    monthContent
      .append('rect')
      .attr('class', 'day')
      .attr('date', dateFormatter(d))
      .attr('width', size)
      .attr('height', size)
      .attr('fill', '#eff2fc')
      .attr('rx', 1)
      .attr('ry', 1)
      .attr('x', day_x)
      .attr('y', day_y);
    monthContent
      .append('rect')
      .attr('class', 'day-hit-area')
      .attr('date', dateFormatter(d))
      .attr('width', size + cellPadding)
      .attr('height', size + cellPadding)
      .attr('fill', 'transparent')
      .attr('pointer-events', 'all')
      .attr('x', day_x - cellPadding / 2)
      .attr('y', day_y - cellPadding / 2);
  }

  setTitleTextPos(chart);
  renderDatasets(chart);
  handleTooltip(chart);
}

function setTitleTextPos(chart: CalendarHeatmapInstance) {
  const svg = select(chart.svg);
  svg.selectAll('g[class^="so-chart_calendar_year"]').each(function () {
    const yearEle = select(this);
    if (chart.year.showTitle) {
      const yearHeader = yearEle.select('g.year_header');
      const yearWidth = (this as SVGGElement).getBBox().width;
      const yearTextWidth = yearHeader.select<SVGTextElement>('text').node()?.getBBox().width ?? 0;
      yearHeader.attr('transform', `translate(${(yearWidth - yearTextWidth) / 2}, 0)`);
    }

    yearEle
      .select('g.year_content')
      .selectAll('g[class^="year_"]')
      .each(function () {
        const monthEle = select(this);
        const monthHeader = monthEle.select('g.month_header');
        const monthContent = monthEle.select('g.month_content');
        const monthWidth = (monthContent.node() as SVGGElement)?.getBBox().width ?? 0;
        const monthTextWidth = monthHeader.select<SVGTextElement>('text').node()?.getBBox().width ?? 0;
        monthHeader.attr('transform', `translate(${(monthWidth - monthTextWidth) / 2}, 0)`);
      });
  });
}

function renderDatasets(chart: CalendarHeatmapInstance) {
  const { datasets, cell } = chart;
  const svg = select(chart.svg);
  const [min, max] = extent(datasets, d => d.data ?? 0) as [number, number];
  const { weightType, colors, opacityColor } = cell;

  datasets.forEach(d => {
    const date = dateFormatter(d.date);
    const cell = svg.select<SVGRectElement>(`rect.day[date="${date}"]`);
    const hitArea = svg.select<SVGRectElement>(`rect.day-hit-area[date="${date}"]`);

    if (weightType === 'color') {
      const scale = scaleQuantile([min, max], colors);
      if (d.data != undefined && d.data !== 0) {
        const c = scale(d.data);
        cell.attr('fill', c);
      }
    } else {
      const c = color(opacityColor);
      const scale = scaleLinear([min, max], [300, 1000]);
      if (d.data != undefined && d.data !== 0 && c) {
        c.opacity = scale(d.data) / 1000;
        cell.attr('fill', c.toString());
      }
    }

    if (d.data != undefined) {
      cell.attr('data', d.data);
      hitArea.attr('data', d.data);
    }
  });
}
