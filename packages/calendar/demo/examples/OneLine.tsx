import { useEffect, useRef } from 'react';
import getCalendarChart from '@so-chart/calendar';
import { ChartWrapper } from '../../../../src/demo/ChartWrapper';
import { getThemeColor, useChartThemeVersion } from '../../../../src/demo/theme';

function CalendarHeatmapOneLine() {
  const ref = useRef<HTMLDivElement>(null);
  const themeVersion = useChartThemeVersion();

  useEffect(() => {
    const container = ref.current;
    if (container) {
      const cellColor = getThemeColor(container, '--chart-calendarCell-background');

      const chart = getCalendarChart({
        container,
        chartType: 'heatmap',
        layout: {
          height: 200,
        },
      });
      chart.setOption({
        year: {
          type: 'oneLine',
          showTitle: false,
          fontColor: cellColor,
        },
        week: {
          fontColor: cellColor,
        },
        month: {
          fontColor: cellColor,
        },
        cell: {
          size: 12.5,
        },
        rangeData: {
          start: new Date(2012, 10, 11),
          end: new Date(2013, 3, 11),
        },
        datasets: [
          { date: new Date('2012-11-28'), data: 30 },
          { date: new Date('2013-03-01'), data: 0.1 },
          { date: new Date('2013-03-02'), data: 222 },
          { date: new Date('2013-03-03'), data: 322 },
          { date: new Date('2013-03-04'), data: 422 },
          { date: new Date('2013-03-05'), data: 522 },
          { date: new Date('2014-03-06'), data: 622 },
        ],
      });
      return () => chart.dispose();
    }
  }, [themeVersion]);

  return (
    <ChartWrapper title="日历热力图 (单行)" description="按年一行展示的历史数据热力图" height={200}>
      <div ref={ref} style={{ width: 1200, height: '100%', position: 'relative', overflow: 'hidden' }} />
    </ChartWrapper>
  );
}

export default CalendarHeatmapOneLine;
