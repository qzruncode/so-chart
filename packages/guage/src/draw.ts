import type { CircleGuageInstance, GuageDataset, GuageInstance, SingleGuageInstance } from '@so-chart/types/guage';
import { arc, ascending, format, pie, scaleThreshold } from 'd3';

export function drawGuage(chart: GuageInstance) {
  const { offscreenCanvas } = chart;
  const context = offscreenCanvas.getContext('2d');
  if (context) {
    context.imageSmoothingEnabled = true;
    const { height, width } = chart.layout;
    const { datasets, startAngle, endAngle, outerRadius, innerRadius, value, fontSize, animate } = chart;
    const viewboxCenter_x = width / 2;
    const viewboxCenter_y = height / 2;
    context.save();
    context.translate(viewboxCenter_x, viewboxCenter_y);
    const showDatasets = datasets.filter(d => d.show === true);
    const pieInstance = pie<Required<GuageDataset>>()
      .value(d => d.data ?? 0)
      .startAngle(startAngle)
      .endAngle(startAngle + (endAngle - startAngle) * animate.progress);
    pieInstance.sortValues(ascending);
    const arcsData = pieInstance(showDatasets);
    // 外圈
    {
      arcsData.forEach(d => {
        const color = d.data.backgroundColor;
        const arcInstance = arc();
        const argument = {
          startAngle: d.startAngle,
          endAngle: d.endAngle,
          innerRadius: outerRadius[0],
          outerRadius: outerRadius[1],
        };
        context.save();
        const path = arcInstance(argument);
        if (typeof path === 'string') {
          const path2D = new Path2D(path);
          context.fillStyle = color;
          context.fill(path2D);
        }
        context.restore();
      });
    }
    // 内圈
    let sum = 0;
    {
      const domain: number[] = [];
      const range: string[] = [];
      datasets.forEach((d, i) => {
        const pre = domain[i - 1] ?? 0;
        domain.push(pre + (d.data ?? 0));
        range.push(d.backgroundColor);
        sum += d.data ?? 0;
      });
      const color = scaleThreshold(domain, range)(value);
      const arcInstance = arc();
      const endAngle = startAngle + (Math.PI * value) / sum;
      const argument = {
        startAngle,
        endAngle: startAngle + (endAngle - startAngle) * animate.progress,
        innerRadius: innerRadius[0],
        outerRadius: innerRadius[1],
      };
      context.save();
      const path = arcInstance(argument);
      if (typeof path === 'string') {
        const path2D = new Path2D(path);
        context.fillStyle = color;
        context.fill(path2D);
      }
      context.restore();
    }
    // 文字
    {
      context.save();
      context.font = `bold ${fontSize}px sans-serif`;
      context.fillStyle = chart.fontColor;
      context.textAlign = 'center';
      const formatInstance = format('.2%');
      context.fillText(formatInstance(value / sum), 0, 0);
      context.restore();
    }
    context.restore();
  }
}

export function drawSingleGuage(chart: SingleGuageInstance) {
  const { offscreenCanvas } = chart;
  const context = offscreenCanvas.getContext('2d');
  if (context) {
    context.imageSmoothingEnabled = true;
    const { width } = chart.layout;
    const { startAngle, endAngle, radius, cornerRadius, backgroundColor, valueBackgroundColor, value, showText, fontSize, animate, tick } = chart;
    const [innerRadius, outerRadius] = radius;
    const viewboxCenter_x = width / 2;
    context.save();
    context.translate(viewboxCenter_x, outerRadius);

    // 外圈
    {
      context.save();
      const arcInstance = arc();
      arcInstance.cornerRadius(cornerRadius);
      const argument = {
        startAngle: startAngle,
        endAngle: endAngle,
        innerRadius: innerRadius,
        outerRadius: outerRadius,
      };
      const arcPath = arcInstance(argument);
      if (typeof arcPath === 'string') {
        const path2D = new Path2D(arcPath);
        context.fillStyle = backgroundColor;
        context.fill(path2D);
      }
      context.restore();
    }

    // 内圈
    {
      context.save();
      const arcInstance = arc();
      arcInstance.cornerRadius(cornerRadius);
      const argument = {
        startAngle: startAngle,
        endAngle: startAngle + (endAngle - startAngle) * value * animate.progress,
        innerRadius: innerRadius,
        outerRadius: outerRadius,
      };
      const path = arcInstance(argument);
      if (typeof path === 'string') {
        const path2D = new Path2D(path);
        context.fillStyle = valueBackgroundColor;
        context.fill(path2D);
      }
      context.restore();

      // 绘制刻度线
      if (tick.show) {
        const { lineColor, lineWidth, steps, tickSize } = tick;
        context.save();
        context.strokeStyle = lineColor;
        context.lineWidth = lineWidth;
        const gapAngle = (endAngle - startAngle) / Math.max(1, steps - 1); // 每个刻度之间的间隔
        context.beginPath();
        for (let i = 0; i < steps; i++) {
          // D3/SVG 坐标系把 0° 定在正上方（12 点钟），而 Math.cos/sin 默认把 0° 定在 正右方（3 点钟）。因此需要将刻度整体逆时针旋转 90°
          const angle = startAngle + gapAngle * i - Math.PI / 2;
          const tick_x1 = innerRadius * Math.cos(angle);
          const tick_y1 = innerRadius * Math.sin(angle);
          const tick_x2 = (innerRadius - tickSize) * Math.cos(angle);
          const tick_y2 = (innerRadius - tickSize) * Math.sin(angle);
          context.moveTo(tick_x1, tick_y1);
          context.lineTo(tick_x2, tick_y2);
        }
        context.stroke();
        context.restore();
      }
    }

    // 文字
    {
      context.save();
      context.font = `bold ${fontSize}px sans-serif`;
      context.fillStyle = chart.fontColor;
      context.textAlign = 'center';
      context.fillText(showText, 0, 0);
      context.restore();
    }
    context.restore();
  }
}

export function drawCircleGuage(chart: CircleGuageInstance) {
  const { offscreenCanvas, hollow } = chart;
  const context = offscreenCanvas.getContext('2d');
  if (context) {
    context.imageSmoothingEnabled = true;
    const { width } = chart.layout;
    const { startAngle, endAngle, radius, backgroundColor, valueBackgroundColor, value, animate } = chart;
    const [innerRadius, outerRadius] = radius;
    const viewboxCenter_x = width / 2;
    context.save();
    context.translate(viewboxCenter_x, outerRadius);

    // 外圈
    {
      context.save();
      const path = new Path2D();
      if (hollow) {
        path.arc(0, 0, outerRadius, 0, 2 * Math.PI);
        path.arc(0, 0, innerRadius, 0, 2 * Math.PI, true); // 非零环绕规则，绘制圆环需要让内圆的环绕方向与外圆相反。
        context.fillStyle = backgroundColor;
        context.fill(path);
      } else {
        context.arc(0, 0, outerRadius, 0, 2 * Math.PI);
        context.fillStyle = backgroundColor;
        context.fill();
      }
      context.restore();
    }

    // 内圈
    {
      context.save();
      const arcInstance = arc();
      const argument = {
        startAngle: startAngle,
        endAngle: startAngle + (endAngle - startAngle) * value * animate.progress,
        innerRadius: innerRadius,
        outerRadius: outerRadius,
      };
      const path = arcInstance(argument);
      if (typeof path === 'string') {
        const path2D = new Path2D(path);
        context.fillStyle = valueBackgroundColor;
        context.fill(path2D);
      }
      context.restore();
    }
    context.restore();
  }
}
