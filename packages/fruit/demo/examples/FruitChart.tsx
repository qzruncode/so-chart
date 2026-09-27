import getFruitChart from '@so-chart/fruit';
import { useEffect, useRef, useState } from 'react';
import { ChartWrapper } from '../../../../src/demo/ChartWrapper';

function FruitChartDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const [selectedFruit, setSelectedFruit] = useState<string>();
  const [loadError, setLoadError] = useState<string>();

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    const chart = getFruitChart({
      container,
      chartType: 'fruit',
      layout: { height: 560 },
    });
    const unsubscribeClick = chart.on('click', ({ fruitId, fruitType }) => {
      setSelectedFruit(`${fruitType} · ${fruitId}`);
    });
    chart.setOption({
      fruits: [
        { id: 'apple', type: 'apple', position: [-0.95, 0, -1.1] },
        { id: 'banana', type: 'banana', position: [0, 0, -1.1] },
        { id: 'pear', type: 'pear', position: [0.95, 0, -1.1] },
        { id: 'avocado', type: 'avocado', position: [-0.95, 0, 0] },
        { id: 'kiwi', type: 'kiwi', position: [0, 0, 0] },
        { id: 'lemon', type: 'lemon', position: [0.95, 0, 0] },
        { id: 'lime', type: 'lime', position: [-0.95, 0, 1.1] },
        { id: 'pomegranate', type: 'pomegranate', position: [0, 0, 1.1] },
        { id: 'lychee', type: 'lychee', position: [0.95, 0, 1.1] },
      ],
      backgroundColor: '#e9e4dd',
      floor: { show: true, color: '#ded7ce', roughness: 0.88 },
      lighting: { show: true, color: '#fff3dc', intensity: 2.8, fillIntensity: 1.8 },
      camera: { position: [0, 5.8, 5], target: [0, 0.32, 0], fov: 44, autoFit: true },
      controls: { enabled: true, damping: true, autoRotate: false, enableRotate: true, enableZoom: true },
      renderer: { pixelRatio: 1.5, shadows: true, toneMappingExposure: 1.05 },
      onError: error => setLoadError(error instanceof Error ? error.message : String(error)),
    });

    return () => {
      unsubscribeClick();
      chart.dispose();
    };
  }, []);

  return (
    <ChartWrapper title="3D 水果图表" description="展示苹果、香蕉、梨子、牛油果、猕猴桃、柠檬、青柠、石榴和荔枝；拖拽旋转视角，滚轮或双指缩放。" height={560}>
      <div ref={ref} style={{ height: '100%', position: 'relative', overflow: 'hidden', borderRadius: 8 }}>
        <div
          role={loadError ? 'alert' : 'status'}
          aria-live="polite"
          style={{
            position: 'absolute',
            top: 12,
            left: 14,
            zIndex: 1,
            pointerEvents: 'none',
            color: loadError ? '#a33b35' : '#75695e',
            fontSize: 13,
          }}
        >
          {loadError ? `模型加载失败：${loadError}` : selectedFruit ? `已选择：${selectedFruit}` : '点击水果查看标识'}
        </div>
        <div
          style={{
            position: 'absolute',
            left: 14,
            bottom: 12,
            zIndex: 1,
            pointerEvents: 'none',
            color: '#9b8e80',
            fontSize: 13,
          }}
        >
          拖拽旋转视角，滚轮调整距离；移动超过 4px 时不会触发水果点击
        </div>
      </div>
    </ChartWrapper>
  );
}

export default FruitChartDemo;
