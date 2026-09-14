import getLineChart from '@so-chart/line';
import { useEffect, useMemo, useRef, useState } from 'react';
import Button from 'antd/es/button';
import Flex from 'antd/es/flex';
import SearchInput from 'antd/es/input/Search';
import Pagination from 'antd/es/pagination';
import type { LineChartInstance } from '@so-chart/types/line';
import createSearchChartOptions from './option';
import style from './Search.module.less';
import { ChartWrapper } from '../../../../src/demo/ChartWrapper';
import { useChartThemeVersion } from '../../../../src/demo/theme';

const PAGE_SIZE = 5;

export default function Search() {
  const [chart, setChart] = useState<LineChartInstance>();
  const chartRef = useRef<HTMLDivElement>(null);
  const themeVersion = useChartThemeVersion();

  useEffect(() => {
    const container = chartRef.current;
    if (!container) return;

    const newChart = getLineChart({
      container,
      chartType: 'line',
      layout: {
        height: 300,
        bottom: 60,
        top: 35,
        left: 50,
      },
    });
    newChart.setOption(createSearchChartOptions(container));
    setChart(newChart);

    return () => newChart.dispose();
  }, [themeVersion]);

  return (
    <ChartWrapper className="search-chart-wrapper" title="搜索联动图表" description="搜索、分页和详情按钮由调用方实现" height="auto">
      <div className="search-chart-layout">
        <div ref={chartRef} className="search-chart" />
        <div className="search-tabs-panel" style={{ borderLeft: '1px dashed var(--border-color)' }}>
          {chart && <SearchTabs key={chart.chartId} chart={chart} />}
        </div>
      </div>
    </ChartWrapper>
  );
}

function SearchTabs({ chart }: { chart: LineChartInstance }) {
  const [inputValue, setInputValue] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIndex, setSelectedIndex] = useState<number>();
  const originalRange = useRef(chart.yAxis.data);

  const data = useMemo(
    () => chart.labels.data.map((title, originalIndex) => ({ title, originalIndex, color: chart.datasets[originalIndex]?.lineColor })),
    [chart]
  );
  const filteredData = data.filter(item => item.title.toLowerCase().includes(searchValue.toLowerCase()));
  const totalPages = Math.max(1, Math.ceil(filteredData.length / PAGE_SIZE));
  const page = Math.min(currentPage, totalPages);
  const visibleData = filteredData.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const selectSeries = (index: number) => {
    const nextIndex = selectedIndex === index ? undefined : index;
    applySeriesSelection(chart, nextIndex, originalRange.current);
    setSelectedIndex(nextIndex);
  };

  return (
    <div className={style.list}>
      <div className={style.search} role="search">
        <SearchInput
          value={inputValue}
          placeholder="搜索"
          allowClear
          enterButton="搜索"
          onChange={event => setInputValue(event.target.value)}
          onSearch={value => {
            setSearchValue(value.trim());
            setCurrentPage(1);
          }}
        />
      </div>

      <div className={style.listContent}>
        <Flex vertical className={style.tabItems}>
          {visibleData.map(item => {
            const active = selectedIndex === item.originalIndex || selectedIndex === undefined;
            return (
              <div key={item.originalIndex} className={`${style.tabItem} ${active ? style.choosed : style.noChoose}`}>
                <Button
                  type="text"
                  size="small"
                  className={style.tabContent}
                  aria-pressed={active}
                  title={item.title}
                  onClick={() => selectSeries(item.originalIndex)}
                >
                  <span className={style.tabMark} style={{ backgroundColor: item.color }} />
                  <span className={style.tabLabel}>{item.title}</span>
                </Button>
                <Button
                  className={style.detailButton}
                  type="link"
                  size="small"
                  aria-label={`查看${item.title}详情`}
                  onClick={event => event.stopPropagation()}
                >
                  详情
                </Button>
              </div>
            );
          })}
        </Flex>
      </div>

      <div className={style.pagination}>
        <Pagination
          current={page}
          pageSize={PAGE_SIZE}
          total={filteredData.length}
          size="small"
          hideOnSinglePage
          showSizeChanger={false}
          onChange={setCurrentPage}
        />
      </div>
    </div>
  );
}

function applySeriesSelection(chart: LineChartInstance, selectedIndex: number | undefined, originalRange: LineChartInstance['yAxis']['data']) {
  if (selectedIndex === undefined) {
    chart.datasets.forEach(dataset => {
      dataset.show = true;
    });
    chart.yAxis.data = originalRange;
  } else {
    const values = chart.datasets[selectedIndex].data.filter((value): value is number => value != null && Number.isFinite(value));
    const start = values.length > 0 ? Math.min(...values) : 0;
    const end = values.length > 0 ? Math.max(...values) : 100;
    chart.datasets.forEach((dataset, datasetIndex) => {
      dataset.show = datasetIndex === selectedIndex;
    });
    chart.yAxis.data = { start, end: start === end ? (start === 0 ? 100 : end) : end };
  }
  chart.refreshLine();
}
