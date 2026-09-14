import type { BasePieChartInstance, PieChartInstance } from '@so-chart/types/pie';
import { ExposedData, MessageData } from './listener';
import { presentCanvasFrame, translateBoxPosition } from '@so-chart/utils';
import { drawTooltip } from '@so-chart/tooltip';

export default function getExposedDataAndDraw(chart: BasePieChartInstance, evtData: MessageData) {
  // 此函数会触发多次
  let exposedDatas: ExposedData[] = [];
  const { chartType, tooltip } = chart;
  if (chartType === 'pie') {
    const currentChart = chart as PieChartInstance;
    const { offscreenCanvas, canvas, arcPaths = [], animate } = currentChart;
    const context = offscreenCanvas.getContext('2d');
    if (context) {
      context.imageSmoothingEnabled = true;
      let indexPath;
      translateBoxPosition({
        context,
        layout: currentChart.layout,
        position: currentChart.position,
        callback: () => {
          const [x, y] = evtData.position;
          arcPaths.forEach((path2D, i) => {
            const isInPath = context.isPointInPath(path2D, x, y);
            if (isInPath) {
              indexPath = i;
            }
          });
        },
      });
      const isSelectionChanged = currentChart.chooseIndex !== indexPath;
      currentChart.chooseIndex = indexPath;
      if (animate.progress === 1 && isSelectionChanged) {
        // 没有动画此时在执行，必须手动render
        animate.draw();
        presentCanvasFrame(canvas, offscreenCanvas);
      }
      if (indexPath != undefined) {
        exposedDatas = getPieChartExposedData(currentChart, indexPath, evtData.position);
      }
      const tooltipParams = { chart: currentChart, data: evtData, exposedData: exposedDatas ?? [] };
      if (tooltip?.show) {
        drawTooltip(tooltipParams);
      }
      return exposedDatas;
    }
  }
}

function getPieChartExposedData(chart: PieChartInstance, dataPath: number, positions: number[]) {
  const exposedDatas: ExposedData[] = [];
  const { datasets } = chart;
  const showDatasets = datasets.filter(d => d.show === true);
  const pie = showDatasets[dataPath];
  exposedDatas.push({
    x: positions[0],
    y: positions[1],
    index: dataPath,
    data: pie,
  });
  return exposedDatas;
}
