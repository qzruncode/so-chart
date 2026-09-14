import type { BarDatasetWithStack, BarOptions, CircleStackBarDatasetsWithStack, CircleStackBarOptions } from '@so-chart/types/bar';
import { extent } from 'd3';

export default function getStackDatasets(options: BarOptions | CircleStackBarOptions) {
  const { datasets, yAxis } = options;
  // 将数据做累加
  const showDatasets = datasets.filter(d => !(d.show === false));
  const datasetsWithStack = showDatasets as BarDatasetWithStack | CircleStackBarDatasetsWithStack;
  if (datasetsWithStack.length > 0) {
    const first = datasetsWithStack[0];
    first.stackData = first.data;

    if (datasetsWithStack.length === 1) {
      const [, max] = extent(datasetsWithStack[0].data, d => d ?? 0);
      if (max != undefined && max != 0) {
        yAxis.data = { start: 0, end: max };
      }
      datasetsWithStack[0].stackData = datasetsWithStack[0].data;
    } else {
      datasetsWithStack.reduce((pre, cur) => {
        const preData = pre.stackData;
        const curData = cur.data;
        const yAxisData = yAxis.data;
        const newData: number[] = [];
        const len = preData.length;
        for (let i = 0; i < len; i++) {
          newData[i] = (preData[i] ?? 0) + (curData[i] ?? 0);
        }
        cur.stackData = newData;
        if (!Array.isArray(yAxis)) {
          const newYAxisData = yAxisData as {
            start: number;
            end: number;
          };
          const [newMin, newMax] = extent(newData);
          if (newMin && newMin < newYAxisData.start) {
            newYAxisData.start = newMin ?? 0;
          }

          if (newMax && newMax > newYAxisData.end) {
            newYAxisData.end = newMax ?? 0;
          }
        }
        return cur;
      });
    }
  }
}
