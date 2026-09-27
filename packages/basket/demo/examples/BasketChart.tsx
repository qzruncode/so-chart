import getBasketChart from '@so-chart/basket';
import type { BasketModel, BasketChartOptions } from '@so-chart/basket';
import { useEffect, useRef, useState } from 'react';
import { ChartWrapper } from '../../../../src/demo/ChartWrapper';

type BasketExample = {
  id: BasketModel;
  label: string;
  description: string;
};

const basketExamples: BasketExample[] = [
  {
    id: 'open-wicker',
    label: '敞口浅藤篮',
    description: '低矮、开口宽的矩形编织篮，篮腔完整敞开。',
  },
  {
    id: 'lidded-wicker',
    label: '带盖收纳篮',
    description: '独立篮盖配矮脚，展示封闭式收纳篮的轮廓。',
  },
];

const sharedOptions: Omit<BasketChartOptions, 'basket'> = {
  backgroundColor: '#eeeae3',
  basketMaterial: { color: '#ffffff', roughness: 0.88, clearcoat: 0, clearcoatRoughness: 0.8, envMapIntensity: 1 },
  floor: { show: true, color: '#d8d1c7', roughness: 0.94 },
  environment: { show: true, intensity: 0.9 }, // 内置 HDRLoader 读取摄影棚 HDRI
  lighting: {
    show: true,
    color: '#fff1dc',
    intensity: 3,
    fillIntensity: 0.75,
    shadowMapSize: 2048,
    shadowBias: -0.0002,
    shadowNormalBias: 0.025,
  },
  postprocessing: { show: true, ambientOcclusion: true, ambientOcclusionIntensity: 0.55, ambientOcclusionRadius: 0.14 },
  camera: { position: [2.5, 2.4, 3.1], target: [0, 0.42, 0], fov: 30 },
  controls: {
    enabled: true,
    damping: false,
    autoRotate: false,
    enablePan: false,
    minDistance: 2.8,
    maxDistance: 8,
    minPolarAngle: 0.2,
    maxPolarAngle: Math.PI * 0.84,
    rotateSpeed: 0.62,
    zoomSpeed: 0.8,
  },
  renderer: { pixelRatio: 2, shadows: true, toneMappingExposure: 1.05 },
};

function BasketScenePreview({ basket }: { basket: BasketExample }) {
  const ref = useRef<HTMLDivElement>(null);
  const [assetError, setAssetError] = useState<string | null>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    const chart = getBasketChart({
      container,
      chartType: 'basket',
      layout: { height: 380 },
    });
    chart.setOption({
      ...sharedOptions,
      basket: { model: basket.id, scale: 0.9, rotationY: -0.22 },
      onError: error => setAssetError(error instanceof Error ? error.message : String(error)),
    });

    return () => {
      chart.dispose();
    };
  }, [basket]);

  return (
    <ChartWrapper title={basket.label} description={basket.description} height="min(380px, 105vw)">
      <div ref={ref} style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden', borderRadius: 8 }}>
        {assetError && (
          <div
            role="alert"
            aria-live="polite"
            style={{
              position: 'absolute',
              top: 14,
              left: 14,
              right: 14,
              zIndex: 2,
              padding: '10px 12px',
              borderRadius: 6,
              background: 'rgba(70, 27, 20, 0.88)',
              color: '#fff1ed',
              fontSize: 13,
            }}
          >
            篮子模型加载失败：{assetError}
          </div>
        )}
        <div
          style={{
            position: 'absolute',
            left: 14,
            bottom: 12,
            zIndex: 1,
            pointerEvents: 'none',
            color: '#766c5f',
            fontSize: 13,
          }}
        >
          拖拽旋转视角，滚轮调整距离
        </div>
      </div>
    </ChartWrapper>
  );
}

function BasketChart() {
  return (
    <div
      role="list"
      aria-label="两种不同篮型的空篮对照"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
        columnGap: 16,
        rowGap: 0,
      }}
    >
      {basketExamples.map(basket => (
        <div key={basket.id} role="listitem">
          <BasketScenePreview basket={basket} />
        </div>
      ))}
    </div>
  );
}

export default BasketChart;
