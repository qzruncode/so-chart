import getScatter3DChart from '@so-chart/scatter3d';
import type { Scatter3DDataset, Scatter3DPoint } from '@so-chart/scatter3d';
import { useEffect, useRef, useState } from 'react';
import { ChartWrapper } from '../../../../src/demo/ChartWrapper';
import { getThemeColor, useChartThemeVersion } from '../../../../src/demo/theme';
import irisCsv from '../data/iris-data.csv?raw';

type IrisSpecies = 'Iris-setosa' | 'Iris-versicolor' | 'Iris-virginica';

type IrisPoint = {
  x: number;
  y: number;
  z: number;
  value: number;
  label: string;
  species: IrisSpecies;
};

const irisPoints: IrisPoint[] = irisCsv
  .trim()
  .split('\n')
  .slice(1)
  .map((row, index) => {
    const [sepalLength, sepalWidth, petalLength, petalWidth, species] = row.split(',');
    return {
      x: Number(sepalLength),
      y: Number(sepalWidth),
      z: Number(petalLength),
      value: Number(petalWidth),
      label: `样本 ${index + 1}`,
      species: species.trim() as IrisSpecies,
    };
  });

const irisDatasets: Scatter3DDataset[] = [
  {
    label: '山鸢尾（Setosa）',
    data: irisPoints.filter(point => point.species === 'Iris-setosa'),
    color: '#38bdf8',
    opacity: 0.86,
    symbol: 'circle',
  },
  {
    label: '变色鸢尾（Versicolor）',
    data: irisPoints.filter(point => point.species === 'Iris-versicolor'),
    color: '#22c55e',
    opacity: 0.86,
    symbol: 'square',
  },
  {
    label: '维吉尼亚鸢尾（Virginica）',
    data: irisPoints.filter(point => point.species === 'Iris-virginica'),
    color: '#f97316',
    opacity: 0.86,
    symbol: 'circle',
  },
];

function isTuplePoint(point: Scatter3DPoint): point is readonly [number, number, number] {
  return Array.isArray(point);
}

function Scatter3DChart() {
  const ref = useRef<HTMLDivElement>(null);
  const [selectedPoint, setSelectedPoint] = useState<string>('移动指针查看 Iris 样本，拖拽画布旋转视角');
  const [textColor, setTextColor] = useState('');
  const themeVersion = useChartThemeVersion();

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    setTextColor(getThemeColor(container, '--text-secondary-color'));

    const chart = getScatter3DChart({
      container,
      chartType: 'scatter3d',
      layout: { height: 420 },
    });

    chart.setOption({
      datasets: irisDatasets,
      grid: {
        show: true,
        color: getThemeColor(container, '--chart-crossline-color'),
        centerColor: getThemeColor(container, '--text-secondary-color'),
        planeColors: {
          xy: '#64748b',
          xz: getThemeColor(container, '--chart-crossline-color'),
          yz: '#475569',
        },
        divisions: 10,
        opacity: 0.28,
        planes: 'all',
      },
      axes: {
        show: true,
        color: getThemeColor(container, '--text-secondary-color'),
        labelColor: getThemeColor(container, '--text-secondary-color'),
        nameColor: getThemeColor(container, '--text-color'),
        splitNumber: 4,
        fontSize: 11,
        labelGap: 0.18,
        nameGap: 0.34,
        formatter: value => value.toFixed(1),
        axisLine: {
          show: true,
          color: getThemeColor(container, '--text-secondary-color'),
          opacity: 0.75,
          dash: 'dashed',
          dashSize: 0.24,
          gapSize: 0.14,
        },
      },
      xAxis: {
        name: '萼片长度（cm）',
        domain: [4, 8],
        labelGap: 0.2,
        nameGap: 0.36,
        formatter: value => value.toFixed(1),
      },
      yAxis: {
        name: '萼片宽度（cm）',
        domain: [1.8, 4.6],
        color: '#22c55e',
        labelColor: '#16a34a',
        splitNumber: 5,
        formatter: value => value.toFixed(2),
      },
      zAxis: {
        name: '花瓣长度（cm）',
        domain: [0.5, 7.2],
        color: '#f97316',
        labelColor: '#ea580c',
        nameColor: '#c2410c',
        formatter: value => `${value.toFixed(1)} cm`,
      },
      emphasis: { show: true, scale: 2 },
      tooltip: {
        show: true,
        formatter: value => (typeof value === 'number' ? value.toFixed(2) : value),
      },
      controls: {
        enabled: true,
        damping: false,
        enablePan: true,
        minDistance: 5,
        maxDistance: 18,
        minPolarAngle: 0.2,
        maxPolarAngle: Math.PI - 0.2,
        rotateSpeed: 0.8,
        zoomSpeed: 0.9,
        panSpeed: 0.8,
        screenSpacePanning: true,
        keyPanSpeed: 7,
      },
      point: { size: 0.14, opacity: 0.92, symbol: 'circle', sizeAttenuation: true },
      renderer: { pixelRatio: 2 },
    });

    const unsubscribeEnter = chart.on('mouseenter', data => {
      const point = isTuplePoint(data.point) ? data.point : [data.point.x, data.point.y, data.point.z];
      setSelectedPoint(`${data.datasetLabel} · #${data.pointIndex + 1} · (${point.map(value => value.toFixed(2)).join(', ')})`);
    });
    const unsubscribeLeave = chart.on('mouseleave', () => {
      setSelectedPoint('移动指针查看 Iris 样本，拖拽画布旋转视角');
    });

    return () => {
      unsubscribeEnter();
      unsubscribeLeave();
      chart.dispose();
    };
  }, [themeVersion]);

  return (
    <ChartWrapper
      title="3D 散点图"
      description="Iris 花卉测量数据：三条轴展示萼片与花瓣尺寸，颜色区分物种，Tooltip 展示花瓣宽度，支持虚线坐标轴"
      height={420}
    >
      <div ref={ref} style={{ height: '100%', position: 'relative', overflow: 'hidden', borderRadius: 8 }}>
        <div
          style={{
            position: 'absolute',
            left: 12,
            bottom: 10,
            zIndex: 1,
            pointerEvents: 'none',
            color: textColor,
            fontSize: 13,
          }}
        >
          {selectedPoint}
        </div>
      </div>
    </ChartWrapper>
  );
}

export default Scatter3DChart;
