import getTable3DChart, { type Table3DOptions } from '@so-chart/table3d';
import * as THREE from 'three';
import { useEffect, useRef } from 'react';
import { ChartWrapper } from '../../../../src/demo/ChartWrapper';
import woodDiffuseUrl from '../assets/wood-table-001/wood_table_001_diff_1k.jpg?url';
import woodNormalUrl from '../assets/wood-table-001/wood_table_001_nor_gl_1k.jpg?url';
import woodRoughnessUrl from '../assets/wood-table-001/wood_table_001_rough_1k.jpg?url';

type TableVariant = {
  id: string;
  title: string;
  description: string;
  options: Table3DOptions;
};

type TableTextures = {
  diffuse: THREE.Texture;
  normal: THREE.Texture;
  roughness: THREE.Texture;
};

const sharedOptions: Table3DOptions = {
  backgroundColor: '#171513',
  floor: {
    show: true,
    color: '#27231f',
    roughness: 0.74,
  },
  environment: {
    show: true,
    intensity: 0.72,
    rotation: [0, Math.PI * 0.18, 0],
  },
  lighting: {
    show: true,
    color: '#fff3dc',
    intensity: 3.5,
    fillIntensity: 1.3,
    shadowMapSize: 512,
    shadowBias: -0.0002,
    shadowNormalBias: 0.025,
  },
  postprocessing: {
    show: true,
    ambientOcclusion: true,
    ambientOcclusionIntensity: 1.05,
    ambientOcclusionRadius: 0.3,
  },
  controls: {
    enabled: true,
    damping: true,
    autoRotate: false,
    enablePan: false,
    minDistance: 2.8,
    maxDistance: 12,
    minPolarAngle: 0.2,
    maxPolarAngle: Math.PI * 0.84,
    rotateSpeed: 0.62,
    zoomSpeed: 0.8,
  },
  renderer: {
    pixelRatio: 1.25,
    shadows: true,
    toneMappingExposure: 1.05,
  },
  tabletopMaterial: {
    color: '#ffffff',
    roughness: 0.94,
    clearcoat: 0.04,
    clearcoatRoughness: 0.82,
    envMapIntensity: 0.35,
  },
};

const tableVariants: readonly TableVariant[] = [
  {
    id: 'round-pedestal',
    title: '圆餐桌 · 中央柱',
    description: '大尺寸圆桌面配中央柱式支撑，适合展示餐桌比例和木纹高光。',
    options: {
      ...sharedOptions,
      table: {
        shape: 'round',
        support: 'pedestal',
        diameter: 3.6,
        height: 1.5,
        topThickness: 0.18,
        edgeRadius: 0.08,
        edgeSegments: 5,
        radialSegments: 72,
        supportSegments: 56,
        baseRadius: 0.76,
        baseHeight: 0.14,
        pedestalRadius: 0.28,
        pedestalHeight: 1.04,
        collarRadius: 0.42,
        collarHeight: 0.14,
      },
      material: {
        color: '#8b5a36',
        roughness: 0.44,
        metalness: 0,
        clearcoat: 0.24,
        clearcoatRoughness: 0.28,
        envMapIntensity: 0.9,
      },
      camera: {
        position: [5.8, 4.2, 6.4],
        target: [0, 0.7, 0],
        fov: 38,
      },
    },
  },
  {
    id: 'round-legs',
    title: '圆餐桌 · 四条桌腿',
    description: '同样的圆形桌面切换为四腿结构，便于比较不同支撑方式。',
    options: {
      ...sharedOptions,
      table: {
        shape: 'round',
        support: 'legs',
        diameter: 3.2,
        height: 1.35,
        topThickness: 0.16,
        edgeRadius: 0.07,
        edgeSegments: 5,
        radialSegments: 72,
        legWidth: 0.2,
        legInset: 0.22,
        cornerRadius: 0.06,
        cornerSegments: 5,
      },
      material: {
        color: '#6f3c24',
        roughness: 0.5,
        metalness: 0,
        clearcoat: 0.2,
        clearcoatRoughness: 0.34,
        envMapIntensity: 0.82,
      },
      camera: {
        position: [5.3, 3.8, 5.8],
        target: [0, 0.65, 0],
        fov: 38,
      },
    },
  },
  {
    id: 'rectangular-legs',
    title: '长方餐桌 · 四条桌腿',
    description: '圆角长方桌面配围板和四条桌腿，展示方桌字段的组合方式。',
    options: {
      ...sharedOptions,
      table: {
        shape: 'rectangular',
        support: 'legs',
        width: 4.4,
        depth: 2.4,
        height: 1.35,
        topThickness: 0.18,
        cornerRadius: 0.1,
        cornerSegments: 7,
        legWidth: 0.22,
        legInset: 0.24,
        apronHeight: 0.22,
        apronInset: 0.14,
      },
      material: {
        color: '#795037',
        roughness: 0.47,
        metalness: 0,
        clearcoat: 0.2,
        clearcoatRoughness: 0.3,
        envMapIntensity: 0.86,
      },
      camera: {
        position: [6.8, 4.5, 7.2],
        target: [0, 0.65, 0],
        fov: 40,
      },
    },
  },
];

function addWoodTextures(options: Table3DOptions, textures: TableTextures): Table3DOptions {
  return {
    ...options,
    tabletopMaterial: {
      ...(options.tabletopMaterial ?? {}),
      map: textures.diffuse,
      normalMap: textures.normal,
      roughnessMap: textures.roughness,
      normalScale: [0.3, 0.3],
    },
  };
}

function Table3DChart() {
  const containersRef = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    const charts = tableVariants.map((variant, index) => {
      const container = containersRef.current[index];
      if (!container) return undefined;

      const chart = getTable3DChart({
        container,
        chartType: 'table3d',
        layout: { height: 360 },
      });
      chart.setOption(variant.options);
      return chart;
    });
    let cancelled = false;
    let textures: TableTextures | undefined;
    const textureLoader = new THREE.TextureLoader();

    void Promise.all([
      textureLoader.loadAsync(woodDiffuseUrl),
      textureLoader.loadAsync(woodNormalUrl),
      textureLoader.loadAsync(woodRoughnessUrl),
    ]).then(([diffuse, normal, roughness]) => {
      if (cancelled) {
        diffuse.dispose();
        normal.dispose();
        roughness.dispose();
        return;
      }

      diffuse.colorSpace = THREE.SRGBColorSpace;
      [diffuse, normal, roughness].forEach(texture => {
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(2.3, 1.45);
      });
      textures = { diffuse, normal, roughness };
      charts.forEach((chart, index) => {
        chart?.setOption(addWoodTextures(tableVariants[index].options, textures!));
      });
    }).catch(error => {
      if (cancelled) return;
      console.error('Unable to load the local tabletop wood maps.', error);
    });

    return () => {
      cancelled = true;
      charts.forEach(chart => chart?.dispose());
      if (textures) {
        Object.values(textures).forEach(texture => texture.dispose());
      }
    };
  }, []);

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '0 24px',
        alignItems: 'start',
      }}
    >
      {tableVariants.map((variant, index) => (
        <ChartWrapper key={variant.id} title={variant.title} description={variant.description} height={360}>
          <div
            ref={node => {
              containersRef.current[index] = node;
            }}
            style={{ height: '100%', position: 'relative', overflow: 'hidden', borderRadius: 8 }}
          >
            <div
              style={{
                position: 'absolute',
                left: 14,
                bottom: 12,
                zIndex: 1,
                pointerEvents: 'none',
                color: '#c5b9aa',
                fontSize: 13,
              }}
            >
              拖拽旋转，滚轮缩放
            </div>
          </div>
        </ChartWrapper>
      ))}
    </div>
  );
}

export default Table3DChart;
