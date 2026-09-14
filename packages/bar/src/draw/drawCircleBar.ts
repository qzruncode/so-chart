import type { CircleStackBarDatasetsWithStack, CircleStackBarInstance } from '@so-chart/types/bar';
import { arc } from 'd3';

export function drawCircleBar(chart: CircleStackBarInstance) {
  const { offscreenCanvas, layout, yScaleFunc, datasets, animate, exposedDatas, barGeometry } = chart;
  const { width, height } = layout;
  const context = offscreenCanvas.getContext('2d');
  if (context) {
    context.imageSmoothingEnabled = true;
    const viewboxCenter_x = width / 2;
    const viewboxCenter_y = height / 2;
    const showDatasets = datasets.filter(d => d.show === true) as CircleStackBarDatasetsWithStack;
    const barPaths: Path2D[][] = [];
    showDatasets.forEach((dataset, i) => {
      const { stackData, data, backgroundColor } = dataset;
      const paths: Array<Path2D> = [];
      data.forEach((d, j) => {
        const arcInstance = arc();
        const geometry = barGeometry?.[j];
        const innerRadius = yScaleFunc((stackData[j] ?? 0) - (d ?? 0));
        const outerRadius = yScaleFunc(stackData[j] ?? 0);
        const ratio = exposedDatas?.[i]?.index === j ? 1.02 : 1;
        if (geometry != undefined) {
          const ir = innerRadius * ratio;
          const or = outerRadius * ratio;
          const argument = {
            // x轴设置成沿x轴正方向为圆的起始点，所以这里要+Math.PI/2
            startAngle: geometry.startAngle + Math.PI / 2,
            endAngle: geometry.endAngle + Math.PI / 2,
            innerRadius: ir,
            outerRadius: ir + (or - ir) * animate.progress,
          };
          context.save();
          context.translate(viewboxCenter_x, viewboxCenter_y);
          const path = arcInstance(argument);
          if (typeof path === 'string') {
            const path2D = new Path2D(path);
            const color = backgroundColor;
            context.fillStyle = color;
            context.fill(path2D);
            paths.push(path2D);
          }
          context.restore();
        }
      });
      barPaths.push(paths);
    });
    chart.barPaths = barPaths;
  }
}
