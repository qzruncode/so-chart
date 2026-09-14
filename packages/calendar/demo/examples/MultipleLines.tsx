import { renderToStaticMarkup } from 'react-dom/server';
import { type CSSProperties, useEffect, useRef } from 'react';
import getCalendarChart from '@so-chart/calendar';
import { ChartWrapper } from '../../../../src/demo/ChartWrapper';
import theme from 'antd/es/theme';
import { getThemeColor, useChartThemeVersion } from '../../../../src/demo/theme';

type CalendarTooltipProps = {
  date: string;
  data: number;
  backgroundColor: string;
  borderColor: string;
  textColor: string;
  secondaryTextColor: string;
  accentColor: string;
  shadow: string;
};

function CalendarTooltip({ date, data, backgroundColor, borderColor, textColor, secondaryTextColor, accentColor, shadow }: CalendarTooltipProps) {
  const cardStyle: CSSProperties = {
    width: 196,
    boxSizing: 'border-box',
    padding: '14px 16px',
    border: `1px solid ${borderColor}`,
    borderRadius: 12,
    background: backgroundColor,
    boxShadow: shadow,
    color: textColor,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  };

  return (
    <div role="status" style={cardStyle}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <span style={{ color: secondaryTextColor, fontSize: 12, fontWeight: 500 }}>日历数据</span>
        <span style={{ width: 7, height: 7, borderRadius: '50%', background: accentColor }} />
      </div>
      <div style={{ fontSize: 16, fontWeight: 600, letterSpacing: 0.2 }}>{date}</div>
      <div style={{ height: 1, margin: '12px 0', background: borderColor, opacity: 0.65 }} />
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
        <span style={{ color: secondaryTextColor, fontSize: 12 }}>数据值</span>
        <strong style={{ color: accentColor, fontSize: 22, fontWeight: 700, lineHeight: 1 }}>{data.toLocaleString('zh-CN')}</strong>
      </div>
    </div>
  );
}

function CalendarHeatmapMultipleLines() {
  const ref = useRef<HTMLDivElement>(null);
  const { token } = theme.useToken();
  const themeVersion = useChartThemeVersion();

  useEffect(() => {
    const container = ref.current;
    if (container) {
      const cellColor = getThemeColor(container, '--chart-calendarCell-background');

      const chart = getCalendarChart({
        container,
        chartType: 'heatmap',
        layout: {
          height: 400,
        },
      });
      chart.setOption({
        year: {
          type: 'multipleLines',
          showTitle: true,
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
        tooltip: data => {
          return renderToStaticMarkup(
            <CalendarTooltip
              date={data.date}
              data={data.data}
              backgroundColor={token.colorBgElevated}
              borderColor={token.colorBorderSecondary}
              textColor={token.colorText}
              secondaryTextColor={token.colorTextSecondary}
              accentColor={token.colorPrimary}
              shadow={token.boxShadowSecondary}
            />
          );
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
  }, [themeVersion, token]);

  return (
    <ChartWrapper title="日历热力图 (多行)" description="支持稳定命中区，以及保持间距并平滑跟随的 Tooltip" height={400}>
      <div ref={ref} style={{ width: 1200, height: '100%', position: 'relative', overflow: 'hidden' }} />
    </ChartWrapper>
  );
}

export default CalendarHeatmapMultipleLines;
