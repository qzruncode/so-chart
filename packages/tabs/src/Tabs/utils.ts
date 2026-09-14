import type { CommonChart } from '..';
import { refreshChartWithAxis, refreshChartWithoutAxis } from '../refresh';

export const getTipsColor = (chart: CommonChart, index: number) => {
  switch (chart.chartType) {
    case 'line':
      return chart.datasets[index].lineColor;
    case 'bar':
    case 'pie':
    case 'circleStackBar':
      return chart.datasets[index].backgroundColor;
    case 'point':
      return chart.datasets[index].dotColor;
    case 'radar':
      return chart.datasets[index].lineColor;
    default:
      return undefined;
  }
};

export type LabelData = {
  show: boolean;
};

export type TabClickResult<T extends LabelData> = {
  labelData: T[];
  chooseIndex?: number;
};

export function handleTabClick<T extends LabelData>({
  labelData,
  chart,
  currentIndex,
  chooseIndex,
  range,
}: {
  labelData: T[];
  chart: CommonChart;
  currentIndex: number;
  chooseIndex?: number;
  range?: NonNullable<CommonChart['yAxis']>['data'];
}): TabClickResult<T> {
  const type = getTabsType(chart);
  const newLabelData = labelData.map(item => ({ ...item })) as T[];

  if (type === 'WithAxis') {
    if (!range) {
      return { labelData: newLabelData, chooseIndex };
    }

    if (chart.chartType === 'radar') {
      refreshChartWithAxis(currentIndex, chart, range);
      newLabelData[currentIndex].show = !newLabelData[currentIndex].show;
      return { labelData: newLabelData, chooseIndex };
    }

    const nextChooseIndex = currentIndex === chooseIndex ? undefined : currentIndex;
    refreshChartWithAxis(nextChooseIndex, chart, range);
    if (nextChooseIndex === undefined) {
      newLabelData.forEach(item => {
        item.show = true;
      });
    } else {
      newLabelData.forEach((item, index) => {
        item.show = currentIndex === index;
      });
    }
    return { labelData: newLabelData, chooseIndex: nextChooseIndex };
  }

  if (type === 'WithoutAxis') {
    refreshChartWithoutAxis(currentIndex, chart);
    newLabelData[currentIndex].show = !newLabelData[currentIndex].show;
  }

  return { labelData: newLabelData, chooseIndex };
}

export function getTabsType(chart: CommonChart) {
  const { chartType } = chart;

  switch (chartType) {
    case 'bar':
    case 'line':
    case 'circleStackBar':
    case 'point':
    case 'radar':
      return 'WithAxis';
    case 'pie':
      return 'WithoutAxis';
    default:
      return 'WithAxis';
  }
}
