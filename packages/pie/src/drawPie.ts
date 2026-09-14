import type { PieChartInstance, PieDataset } from '@so-chart/types/pie';
import { getBoxPosition } from '@so-chart/utils';
import { arc, group, path, pie, sort } from 'd3';

export function drawPie(chart: PieChartInstance) {
  const { offscreenCanvas, hoverText, animate, chooseIndex } = chart;
  const context = offscreenCanvas.getContext('2d');
  if (context) {
    context.imageSmoothingEnabled = true;
    const { datasets, innerRadius, fontSize, shadowBlur, startAngle, endAngle, layout, position } = chart;
    const { viewboxCenter_x, viewboxCenter_y } = getBoxPosition({ layout, position });

    context.save();
    context.translate(viewboxCenter_x, viewboxCenter_y);
    const showDatasets = datasets.filter(d => d.show === true);
    const isAllZero = showDatasets.every(d => d.data === 0);

    const pieInstance = pie<Required<PieDataset>>()
      .value(d => (isAllZero ? 1 : (d.data ?? 0)))
      .startAngle(startAngle)
      .endAngle(startAngle + (endAngle - startAngle) * animate.progress);
    const arcsData = pieInstance(showDatasets);
    const arcPaths: Path2D[] = [];

    // 动态定位label的位置
    type ArcData = (typeof arcsData)[number];
    let datas: { data: ArcData; x: number; y: number; radius: number; index: number }[] = [];
    arcsData.forEach((d, i) => {
      const { labelRadius } = d.data;
      const angle = (+d.startAngle + +d.endAngle) / 2 - Math.PI / 2;
      const y = Math.sin(angle) * labelRadius; // 扇形圆周上的中心点的y坐标
      const x = Math.cos(angle) * labelRadius; // 扇形圆周上的中心点的x坐标
      datas.push({ data: d, x, y, radius: labelRadius, index: i });
    });
    datas = sort(datas, (a, b) => a.y - b.y);
    // label的位置由labelRadius决定，如果有重叠，需要动态计算labelRadius
    // 必须要进行分组，处于x轴左右部分的单独计算
    const labelHeight = fontSize * 1.1;
    const groups = Array.from(group(datas, d => Math.abs(d.x) / d.x));
    groups.forEach(([, value]) => {
      value.reduce((pre, cur) => {
        if (Math.abs(pre.y - cur.y) < labelHeight) {
          const target = Math.abs(pre.y) > Math.abs(cur.y) ? pre : cur;
          const d = target.data;
          const angle = (+d.startAngle + +d.endAngle) / 2 - Math.PI / 2;
          const newY = ((Math.abs(target.y) + labelHeight) * target.y) / Math.abs(target.y);
          const newLabelRadius = newY / Math.sin(angle);
          target.radius = newLabelRadius;
          target.y = newY;
          target.x = Math.cos(angle) * newLabelRadius;
        }
        return cur;
      });
    });

    datas.forEach(d => {
      const { data: arcData, radius: labelRadius, x, y } = d;
      // 扇形
      const color = arcData.data.backgroundColor;
      const outerRadius = d.index === chooseIndex ? chart.radius * 1.05 : chart.radius;
      {
        const arcInstance = arc();
        const argument = {
          startAngle: arcData.startAngle,
          endAngle: arcData.endAngle,
          innerRadius,
          outerRadius,
        };
        context.save();
        const path = arcInstance(argument);
        if (typeof path === 'string') {
          const path2D = new Path2D(path);
          arcPaths[d.index] = path2D;
          if (d.index === chooseIndex) {
            context.shadowBlur = shadowBlur;
            context.shadowColor = color;
            context.shadowOffsetX = 0;
            context.shadowOffsetY = 0;
          }
          context.fillStyle = color;
          context.fill(path2D);
        }
        context.restore();
      }

      if (hoverText.type == 'lead') {
        // 扇形引线
        const xs = x + (x * labelRadius * 0.1) / Math.abs(x); // 引出来的平行线
        context.save();
        context.strokeStyle = color;
        // 水平线
        {
          const pathInstance = path();
          pathInstance.moveTo(x, y);
          pathInstance.lineTo(xs, y);
          const path2D = new Path2D(pathInstance.toString());
          context.stroke(path2D);
        }
        // 从圆心引出来的射线
        {
          const pathInstance = path();
          pathInstance.moveTo(0, -innerRadius);
          pathInstance.lineTo(0, -labelRadius);
          const rotateAngle = arcData.startAngle + (arcData.endAngle - arcData.startAngle) / 2;
          context.rotate(rotateAngle);
          const path2D = new Path2D(pathInstance.toString());
          context.stroke(path2D);
          context.restore();
        }
        // label
        {
          context.save();
          context.font = `${fontSize}px auto`;
          context.textBaseline = 'middle';
          context.fillStyle = hoverText.labelColor;
          const label = arcData.data.label;
          const text = context.measureText(label);
          const textWidth = text.width;
          const x = xs < 0 ? xs + (xs * textWidth) / Math.abs(xs) : xs;
          context.fillText(label, x, y);
          context.restore();
        }
      } else if (hoverText.type === 'center') {
        if (chooseIndex === undefined || d.index === chooseIndex) {
          const { dataFontSize, labelFontSize, unit, totalText } = hoverText;
          let data: number | undefined | null;
          let label: string = '';
          if (d.index === chooseIndex) {
            data = arcData.data.data;
            label = arcData.data.label;
          } else if (chooseIndex === undefined) {
            data = datas.reduce((sum, d) => (d.data.data.data ?? 0) + sum, 0);
            data = Number(data.toFixed(2));
            label = totalText;
          }
          context.save();
          context.fillStyle = hoverText.labelColor;
          context.textAlign = 'center';
          if (data) {
            context.font = `bold ${dataFontSize}px auto`;
            context.fillText(`${unit}${data ?? ''}`, 0, label ? 0 : dataFontSize / 2);
          }
          if (label) {
            context.font = `${labelFontSize}px auto`;
            context.fillText(label, 0, dataFontSize + 2);
          }
          context.restore();
        }
      }
    });

    context.restore();
    chart.arcPaths = arcPaths;
  }
}
