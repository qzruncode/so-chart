import getFireChart from '@so-chart/fire';
import { createBasketObject, disposeObject3D as disposeSceneObject } from '@so-chart/basket';
import { createTableObject, disposeObject3D as disposeTable } from '@so-chart/table3d';
import * as THREE from 'three';
import { useEffect, useRef, useState } from 'react';
import { ChartWrapper } from '../../../../src/demo/ChartWrapper';
import { createFruitObjects } from '../helpers/createFruitObjects';
import { settleBasketFruit } from '../helpers/settleBasketFruit';
import woodDiffuseUrl from '../../../table3d/demo/assets/wood-table-001/wood_table_001_diff_1k.jpg?url';
import woodNormalUrl from '../../../table3d/demo/assets/wood-table-001/wood_table_001_nor_gl_1k.jpg?url';

const TABLE_HEIGHT = 1.05;
const TABLE_WIDTH = 3.5;
const TABLE_DEPTH = 2.2;
const BANANA_TABLETOP_INSET = 0.003;
const TABLE_FRAME_WIDTH = 4;
const MIN_CAMERA_FOV = 36;
const MAX_CAMERA_FOV = 56;
const MIN_CAMERA_DISTANCE = 2.4;
const CAMERA_POSITION = [4.1, 3.25, 6.35] as const;
const CAMERA_TARGET = [0, 1.02, 0] as const;
const BASE_CAMERA_DISTANCE = Math.hypot(
  CAMERA_POSITION[0] - CAMERA_TARGET[0],
  CAMERA_POSITION[1] - CAMERA_TARGET[1],
  CAMERA_POSITION[2] - CAMERA_TARGET[2]
);

function getVisibleWorldBounds(object: THREE.Object3D) {
  const bounds = new THREE.Box3();
  const meshBounds = new THREE.Box3();
  object.updateWorldMatrix(true, true);
  object.traverseVisible(child => {
    if (!(child instanceof THREE.Mesh)) return;
    bounds.union(meshBounds.setFromObject(child, true));
  });
  return bounds;
}

function restOnTabletop(object: THREE.Object3D, inset = 0) {
  const bounds = getVisibleWorldBounds(object);
  if (bounds.isEmpty()) return;
  object.position.y += TABLE_HEIGHT - inset - bounds.min.y;
  object.updateWorldMatrix(true, true);
}

function getResponsiveCamera(container: HTMLElement) {
  const aspect = Math.max(container.clientWidth, 1) / Math.max(container.clientHeight, 1);
  const requestedFov = 2 * Math.atan(TABLE_FRAME_WIDTH / (2 * BASE_CAMERA_DISTANCE * aspect)) * (180 / Math.PI);
  const fov = Math.min(Math.max(requestedFov, MIN_CAMERA_FOV), MAX_CAMERA_FOV);
  const distance =
    requestedFov > MAX_CAMERA_FOV
      ? TABLE_FRAME_WIDTH / (2 * aspect * Math.tan((MAX_CAMERA_FOV * Math.PI) / 360))
      : requestedFov < MIN_CAMERA_FOV
        ? Math.max(MIN_CAMERA_DISTANCE, TABLE_FRAME_WIDTH / (2 * aspect * Math.tan((MIN_CAMERA_FOV * Math.PI) / 360)))
        : BASE_CAMERA_DISTANCE;
  const distanceScale = distance / BASE_CAMERA_DISTANCE;
  const position: readonly [number, number, number] = [
    CAMERA_TARGET[0] + (CAMERA_POSITION[0] - CAMERA_TARGET[0]) * distanceScale,
    CAMERA_TARGET[1] + (CAMERA_POSITION[1] - CAMERA_TARGET[1]) * distanceScale,
    CAMERA_TARGET[2] + (CAMERA_POSITION[2] - CAMERA_TARGET[2]) * distanceScale,
  ];

  return { position, fov };
}

function configureSceneShadows(scene: THREE.Scene) {
  let candleRoot: THREE.Object3D | undefined;
  scene.traverse(object => {
    if (object instanceof THREE.PointLight) candleRoot = object.parent ?? undefined;
  });

  const candleMeshes = new Set<THREE.Mesh>();
  const candleGround = new Set<THREE.Mesh>();
  candleRoot?.traverse(object => {
    if (!(object instanceof THREE.Mesh)) return;
    if (object.geometry instanceof THREE.PlaneGeometry) candleGround.add(object);
    else candleMeshes.add(object);
  });

  scene.traverse(object => {
    if (object instanceof THREE.Mesh) {
      object.receiveShadow = !candleMeshes.has(object);
      const materials = Array.isArray(object.material) ? object.material : [object.material];
      if (!materials.some(material => material.transparent)) object.castShadow = !candleGround.has(object);
    }
  });
}

async function loadWoodMaps(): Promise<readonly [THREE.Texture, THREE.Texture]> {
  const loader = new THREE.TextureLoader();
  const [diffuse, normal] = await Promise.all([loader.loadAsync(woodDiffuseUrl), loader.loadAsync(woodNormalUrl)]);
  diffuse.colorSpace = THREE.SRGBColorSpace;
  [diffuse, normal].forEach(texture => {
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(2.3, 1.45);
  });
  return [diffuse, normal];
}

function createSceneTable(textures?: readonly [THREE.Texture, THREE.Texture]) {
  const [map, normalMap] = textures ?? [];
  return createTableObject({
    table: {
      shape: 'rectangular',
      width: TABLE_WIDTH,
      depth: TABLE_DEPTH,
      height: TABLE_HEIGHT,
      topThickness: 0.13,
      cornerRadius: 0.075,
      cornerSegments: 5,
      legWidth: 0.14,
      legInset: 0.16,
      apronHeight: 0.16,
      apronInset: 0.1,
    },
    material: {
      color: '#57351f',
      roughness: 0.82,
      clearcoat: 0.06,
      clearcoatRoughness: 0.78,
      envMapIntensity: 0.4,
    },
    tabletopMaterial:
      map && normalMap
        ? {
            color: '#ffffff',
            map,
            normalMap,
            normalScale: [0.3, 0.3],
            roughness: 0.86,
            clearcoat: 0.04,
            clearcoatRoughness: 0.82,
            envMapIntensity: 0.35,
          }
        : undefined,
    floor: { show: false },
  });
}

function BasicCandleChart() {
  const ref = useRef<HTMLDivElement>(null);
  const chartRef = useRef<ReturnType<typeof getFireChart> | null>(null);
  const [airflowAmplitude, setAirflowAmplitude] = useState(0.32);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    const chart = getFireChart({
      container,
      chartType: 'fire',
      layout: { height: 460 },
    });
    chartRef.current = chart;
    chart.setOption({
      quality: 'low',
      backgroundColor: '#050403',
      shadow: { enabled: false },
      fire: {
        color: '#ffb34b',
        width: 0.028,
        height: 0.08,
        depth: 0.028,
        speed: 1,
        airflowAmplitude: 0.32,
      },
      candle: {
        bodyColor: '#f0e3c8',
        bodyRadius: 0.024,
        bodyHeight: 0.22,
        wickColor: '#17100b',
        wickRadius: 0.002,
        wickHeight: 0.02,
        light: { show: true, color: '#ffac4c', intensity: 0.3, distance: 1.6, decay: 2 },
      },
      bloom: { show: true, strength: 0.24, radius: 0.18, threshold: 0.94 },
      camera: { autoFrame: true, fov: 36, near: 0.03, far: 10 },
      controls: {
        enabled: true,
        damping: true,
        autoRotate: false,
        enablePan: false,
        minDistance: 0.38,
        maxDistance: 1.4,
        rotateSpeed: 0.58,
        zoomSpeed: 0.75,
      },
      renderer: { pixelRatio: 1.35 },
    });

    return () => {
      chartRef.current = null;
      chart.dispose();
    };
  }, []);

  return (
    <ChartWrapper
      title="基础版：单根蜡烛"
      description="只展示蜡体、灯芯、单根火苗和烛光，不加载桌面或果篮模型。拖拽旋转，滚轮或双指缩放。"
      height="min(480px, 105vw)"
    >
      <div ref={ref} style={{ height: '100%', position: 'relative', overflow: 'hidden', borderRadius: 8, background: '#050403' }} />
      <label style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 2px', color: '#c4b59e', fontSize: 13 }}>
        气流幅度
        <input
          aria-label="气流幅度"
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={airflowAmplitude}
          onChange={event => {
            const value = Number(event.currentTarget.value);
            setAirflowAmplitude(value);
            chartRef.current?.updateOptions({ fire: { airflowAmplitude: value } });
          }}
          style={{ flex: 1, accentColor: '#dc9b54' }}
        />
        <output>{airflowAmplitude.toFixed(2)}</output>
      </label>
    </ChartWrapper>
  );
}

function StillLifeChart() {
  const ref = useRef<HTMLDivElement>(null);
  const [assetState, setAssetState] = useState<'loading' | 'ready' | 'error'>('loading');

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    let cancelled = false;
    let table = createSceneTable();
    let basket: THREE.Group | undefined;
    const bananas: THREE.Group[] = [];
    let woodTextures: readonly [THREE.Texture, THREE.Texture] | undefined;
    setAssetState('loading');

    const chart = getFireChart({
      container,
      chartType: 'fire',
      layout: { height: 580 },
    });
    const camera = getResponsiveCamera(container);

    chart.setOption({
      quality: 'medium',
      backgroundColor: '#050403',
      environment: { show: true, intensity: 0.12 },
      lighting: {
        hemisphere: { intensity: 0.16 },
        fill: { intensity: 0.3, castShadow: false },
      },
      shadow: {
        enabled: true,
        mapSize: 1024,
        bias: -0.0001,
        normalBias: 0.0003,
        intensity: 0.68,
        radius: 48,
        refreshRate: 24,
      },
      ground: { show: true, color: '#29231c', roughness: 0.95, size: 200, receiveShadow: true },
      fire: {
        color: '#ffb34b',
        width: 0.028,
        height: 0.08,
        depth: 0.028,
        speed: 1,
        airflowAmplitude: 0.95,
      },
      candle: {
        position: [0.28, TABLE_HEIGHT, 0.62],
        bodyColor: '#f0e3c8',
        bodyRadius: 0.024,
        bodyHeight: 0.22,
        wickColor: '#17100b',
        wickRadius: 0.002,
        wickHeight: 0.02,
        light: { show: true, color: '#ffac4c', intensity: 0.58, distance: 4.2, decay: 2, castShadow: true },
      },
      bloom: { show: true, strength: 0.55, radius: 0.28, threshold: 0.92 },
      camera: { position: camera.position, target: CAMERA_TARGET, fov: camera.fov, near: 0.1, far: 40 },
      controls: {
        enabled: true,
        damping: true,
        autoRotate: false,
        enablePan: false,
        minDistance: MIN_CAMERA_DISTANCE,
        maxDistance: 11,
        rotateSpeed: 0.58,
        zoomSpeed: 0.75,
      },
      renderer: { pixelRatio: 1.4 },
    });
    configureSceneShadows(chart.scene);

    chart.scene.add(table);

    const basketPromise = createBasketObject({
      basket: { position: [-0.65, TABLE_HEIGHT, 0.02], scale: 0.77, rotationY: -0.16 },
      basketMaterial: { color: '#ffffff', roughness: 0.86, clearcoat: 0.02, envMapIntensity: 0.75 },
      floor: { show: false },
    }).then(
      value => ({ kind: 'basket', value }) as const,
      error => ({ kind: 'basket-error', error }) as const
    );
    const fruitsPromise = createFruitObjects([
      { type: 'apple', position: [-0.42, 0.22, -0.12], rotation: [0.02, 0.08, -0.05], scale: 0.92 },
      { type: 'pear', position: [0.42, 0.23, -0.1], rotation: [-0.04, -0.12, 0.03], scale: 0.9 },
      { type: 'apple', position: [-0.22, 0.24, 0.31], rotation: [0.02, 0.24, 0.02], scale: 0.88 },
      { type: 'pear', position: [0.22, 0.25, 0.31], rotation: [0.03, 0.17, -0.04], scale: 0.9 },
      { type: 'banana', position: [-0.08, 0.2, -0.05], rotation: [0.04, 0.35, -0.02], scale: 0.84 },
    ]).then(
      value => ({ kind: 'fruits', value }) as const,
      error => ({ kind: 'fruits-error', error }) as const
    );
    void Promise.all([
      basketPromise,
      fruitsPromise,
      loadWoodMaps().then(
        value => ({ kind: 'textures', value }) as const,
        error => ({ kind: 'textures-error', error }) as const
      ),
    ])
      .then(async ([basketResult, fruitsResult, woodResult]) => {
        if (cancelled) {
          if (basketResult.kind === 'basket') disposeSceneObject(basketResult.value);
          if (fruitsResult.kind === 'fruits') disposeSceneObject(fruitsResult.value);
          if (woodResult.kind === 'textures') woodResult.value.forEach(texture => texture.dispose());
          return;
        }

        if (basketResult.kind !== 'basket' || fruitsResult.kind !== 'fruits' || woodResult.kind !== 'textures') {
          if (basketResult.kind === 'basket') disposeSceneObject(basketResult.value);
          if (fruitsResult.kind === 'fruits') disposeSceneObject(fruitsResult.value);
          if (woodResult.kind === 'textures') woodResult.value.forEach(texture => texture.dispose());
          const error =
            basketResult.kind === 'basket-error'
              ? basketResult.error
              : fruitsResult.kind === 'fruits-error'
                ? fruitsResult.error
                : woodResult.kind === 'textures-error'
                  ? woodResult.error
                  : undefined;
          console.error('Unable to load the local table maps, basket model, or fruit models from the workspace packages.', error);
          setAssetState('error');
          return;
        }

        const loadedBasket = basketResult.value;
        const loadedFruits = fruitsResult.value;
        const basketFrame = loadedBasket.getObjectByName('basket-object');
        if (!(basketFrame instanceof THREE.Group)) {
          disposeSceneObject(loadedBasket);
          disposeSceneObject(loadedFruits);
          woodResult.value.forEach(texture => texture.dispose());
          throw new Error('The @so-chart/basket model has no basket-object root.');
        }
        basketFrame.add(loadedFruits);
        basket = loadedBasket;
        woodTextures = woodResult.value;
        const texturedTable = createSceneTable(woodTextures);
        chart.scene.remove(table);
        disposeTable(table);
        table = texturedTable;
        chart.scene.add(table);
        chart.scene.add(loadedBasket);
        chart.scene.updateMatrixWorld(true);
        restOnTabletop(loadedBasket);

        const tabletopBananas: Array<{
          name: string;
          position: readonly [number, number, number];
          rotation: readonly [number, number, number];
          scale: number;
        }> = [{ name: 'banana-fruit-5', position: [0.98, TABLE_HEIGHT, 0.56], rotation: [0.06, -0.32, -0.04], scale: 0.94 }] as const;
        tabletopBananas.forEach(({ name, position, rotation, scale }) => {
          const bananaObject = loadedFruits.getObjectByName(name);
          if (!(bananaObject instanceof THREE.Group)) return;

          chart.scene.attach(bananaObject);
          bananaObject.position.set(...position);
          bananaObject.rotation.set(...rotation);
          bananaObject.scale.setScalar(scale);
          restOnTabletop(bananaObject, BANANA_TABLETOP_INSET);
          bananas.push(bananaObject);
        });

        await settleBasketFruit(basketFrame, loadedFruits, () => cancelled);
        if (cancelled) return;

        chart.scene.updateMatrixWorld(true);
        configureSceneShadows(chart.scene);
        chart.render();
        setAssetState('ready');
      })
      .catch(error => {
        if (cancelled) return;
        console.error('Unable to finish composing the candle still life.', error);
        setAssetState('error');
      });

    return () => {
      cancelled = true;
      bananas.forEach(banana => {
        chart.scene.remove(banana);
        disposeSceneObject(banana);
      });
      if (basket) {
        chart.scene.remove(basket);
        disposeSceneObject(basket);
      }
      if (table) {
        chart.scene.remove(table);
        disposeTable(table);
      }
      woodTextures?.forEach(texture => texture.dispose());
      chart.dispose();
    };
  }, []);

  return (
    <ChartWrapper
      title="烛光静物"
      description="暗室里，一支蜡烛照亮木桌上的藤编果篮与一束紧靠摆放的香蕉；自然气流带动单根火苗和桌面烛光投影缓慢摆动。拖动可转动视角。"
      height={580}
    >
      <div ref={ref} style={{ height: '100%', position: 'relative', overflow: 'hidden', borderRadius: 8, background: '#050403' }}>
        {assetState !== 'ready' && (
          <div
            role={assetState === 'error' ? 'alert' : 'status'}
            style={{ position: 'absolute', inset: 'auto 12px 12px', zIndex: 1, color: '#c4a981', fontSize: 13, pointerEvents: 'none' }}
          >
            {assetState === 'error' ? '工作区内的桌面、果篮或水果模型加载失败' : '正在摆放果篮与水果…'}
          </div>
        )}
      </div>
    </ChartWrapper>
  );
}

function FireChart() {
  return (
    <>
      <BasicCandleChart />
      <StillLifeChart />
    </>
  );
}

export default FireChart;
