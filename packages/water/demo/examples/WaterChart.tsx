import getWaterChart, { disposeObject3D, type WaterOptions, type WaterInteractionEvent } from '@so-chart/water';
import { createFishObject, FISH_NAMES, type FishObjectInstance } from '@so-chart/fish';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { ChartWrapper } from '../../../../src/demo/ChartWrapper';
import { PondFishResponse } from './pondResponse';
import { getPondPose, POND_BOTTOM, POND_DEPTH, POND_FISHES, POND_WAVE_HEIGHT, POND_WIDTH } from './pondSwim';

type View = 'surface' | 'close';
type Mode = 'pond' | 'ocean';
const buttonStyle = { minHeight: 44, padding: '6px 12px', cursor: 'pointer' };
const oceanOptions: WaterOptions = {
  animation: { enabled: true, reducedMotion: 'auto' },
  sky: { show: true },
  ariaLabel: '三维海面，拖拽旋转、滚轮缩放',
  water: {
    width: 1000,
    depth: 1000,
    color: '#218fa3',
    textureWidth: 512,
    textureHeight: 512,
    flowDirection: [1, 0.28],
    flowSpeed: 0.045,
    reflectivity: 0.025,
    sunDirection: [0.12, 0.58, -0.8],
    sunColor: '#f4fbff',
    sunIntensity: 1,
    scale: 4.2,
    waveHeight: 2,
    waveSpeed: 1,
    multisample: 0,
  },
  backgroundColor: '#7aaec4',
  fog: { show: false },
  camera: { position: [0.4, 5, 20], target: [0, 0, 0], fov: 44 },
  controls: {
    damping: true,
    enableRotate: true,
    enableZoom: true,
    rotateSpeed: 1,
    zoomSpeed: 1,
    touchAction: 'pan-y',
    enablePan: false,
    minDistance: 6,
    maxDistance: 45,
    maxPolarAngle: Math.PI * 0.47,
  },
  renderer: { pixelRatio: 1.25, toneMappingExposure: 0.3 },
};
const pondOptions: WaterOptions = {
  animation: { enabled: true, reducedMotion: 'auto' },
  sky: { show: true },
  ariaLabel: '六鱼水下巡游与局部水面涟漪',
  water: {
    width: POND_WIDTH,
    depth: POND_DEPTH,
    color: '#9ac8bb',
    transmission: 0.9,
    textureWidth: 512,
    textureHeight: 512,
    flowDirection: [1, 0.28],
    flowSpeed: 0.025,
    reflectivity: 0.025,
    sunDirection: [0.12, 0.58, -0.8],
    sunIntensity: 0.65,
    scale: 1.6,
    waveHeight: POND_WAVE_HEIGHT,
    waveSpeed: 0.7,
  },
  interaction: { enabled: true, radius: 1.35, strength: 0.032, decay: 2.2, sampleInterval: 70 },
  backgroundColor: '#a9c3cc',
  fog: { show: false },
  camera: { position: [7, 8.8, 10], target: [0, -0.4, 0], fov: 44 },
  controls: {
    damping: true,
    enableRotate: true,
    enableZoom: true,
    rotateSpeed: 1,
    zoomSpeed: 1,
    touchAction: 'pan-y',
    enablePan: false,
    minDistance: 4,
    maxDistance: 45,
    maxPolarAngle: Math.PI * 0.43,
  },
  renderer: { pixelRatio: 1.25, toneMappingExposure: 0.75 },
};

function makePond() {
  const group = new THREE.Group();
  group.name = 'fish-pond-environment';
  const stone = new THREE.MeshStandardMaterial({ color: '#a29e86', roughness: 0.94 });
  const sand = new THREE.MeshStandardMaterial({ color: '#c1c29b', roughness: 0.98 });
  const floor = new THREE.Mesh(new THREE.BoxGeometry(POND_WIDTH + 1, 0.12, POND_DEPTH + 1), sand);
  floor.name = 'fish-pond-bottom';
  floor.position.y = POND_BOTTOM - 0.06;
  group.add(floor);
  for (const [width, depth, x, z] of [
    [0.5, POND_DEPTH + 1, (POND_WIDTH + 0.5) / 2, 0],
    [0.5, POND_DEPTH + 1, -(POND_WIDTH + 0.5) / 2, 0],
    [POND_WIDTH, 0.5, 0, (POND_DEPTH + 0.5) / 2],
    [POND_WIDTH, 0.5, 0, -(POND_DEPTH + 0.5) / 2],
  ]) {
    const bank = new THREE.Mesh(new THREE.BoxGeometry(width, 1.7, depth), stone);
    bank.position.set(x, -0.7, z);
    group.add(bank);
  }
  const fill = new THREE.HemisphereLight('#f3ffff', '#73816a', 2.2);
  const sun = new THREE.DirectionalLight('#fff7dc', 4.5);
  sun.position.set(-3, 7, 5);
  group.add(fill, sun);
  return group;
}

function WaterChart() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const controlsRef = useRef<{ view(view: View): void; interaction(enabled: boolean): void } | null>(null);
  const playingRef = useRef(true);
  const [playing, setPlaying] = useState(true);
  const [mode, setMode] = useState<Mode>('pond');
  const [revision, setRevision] = useState(0);
  const [status, setStatus] = useState('正在载入六鱼…');

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;
    const chart = getWaterChart({ container, chartType: 'water', layout: { height: 520 } });
    let disposed = false;
    let fish: FishObjectInstance | undefined;
    let frame: number | undefined;
    const abort = new AbortController();
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let elapsed = 0;
    let lastTimestamp: number | undefined;
    let view: View = 'surface';
    let resizeFrame: number | undefined;
    let lastSize = '';
    let interactionPoint: WaterInteractionEvent | null = null;
    const response = new PondFishResponse();
    const environment = mode === 'pond' ? makePond() : undefined;
    const configureView = () => {
      if (mode === 'ocean') {
        chart.setOption(oceanOptions);
        return;
      }
      const { width, height } = container.getBoundingClientRect();
      lastSize = Math.round(width) + ':' + Math.round(height);
      const factor = Math.max(1, 1.35 / Math.max(width / Math.max(height, 1), 0.3));
      const base = view === 'close' ? new THREE.Vector3(0.5, 5.2, 7.1) : new THREE.Vector3(7, 8.8, 10);
      const target = new THREE.Vector3(0, -0.4, 0);
      const position = base.sub(target).multiplyScalar(factor).add(target);
      chart.setOption({
        ...pondOptions,
        interaction: { ...pondOptions.interaction, enabled: playingRef.current },
        onInteraction: event => {
          interactionPoint = event;
        },
        camera: { ...pondOptions.camera, position: [position.x, position.y, position.z] },
      });
    };
    configureView();
    if (environment) chart.scene.add(environment);
    controlsRef.current = {
      view(next) {
        view = next;
        configureView();
      },
      interaction(enabled) {
        chart.setInteractionEnabled(enabled);
        if (!enabled) {
          interactionPoint = null;
          response.stopReaction();
        }
        if (enabled && !motionQuery.matches && frame === undefined && fish) frame = requestAnimationFrame(tick);
      },
    };
    const observer = new ResizeObserver(() => {
      if (resizeFrame !== undefined) return;
      resizeFrame = requestAnimationFrame(() => {
        resizeFrame = undefined;
        if (disposed) return;
        const rect = container.getBoundingClientRect();
        const size = Math.round(rect.width) + ':' + Math.round(rect.height);
        if (size !== lastSize) configureView();
      });
    });
    observer.observe(container);
    const tick = (timestamp: number) => {
      if (disposed || !fish) return;
      const delta = lastTimestamp === undefined ? 0 : Math.min(Math.max((timestamp - lastTimestamp) / 1000, 0), 0.05);
      lastTimestamp = timestamp;
      frame = undefined;
      if (playingRef.current && !motionQuery.matches) {
        elapsed += delta;
        const poses = fish.group.children.map((_, index) => response.step(index, elapsed, delta, interactionPoint?.position ?? null));
        fish.update(elapsed, 1, response.times);
        fish.group.children.forEach((root, index) => {
          const pose = poses[index];
          root.position.set(pose.x, pose.y, pose.z);
          root.rotation.set(0, pose.yaw, 0);
        });
      }
      if (playingRef.current && !motionQuery.matches) frame = requestAnimationFrame(tick);
    };
    const onMotionChange = () => {
      lastTimestamp = undefined;
      controlsRef.current?.interaction(playingRef.current && !motionQuery.matches);
    };
    motionQuery.addEventListener('change', onMotionChange);
    if (mode === 'pond') {
      void createFishObject({
        signal: abort.signal,
        animation: { reducedMotion: 'auto' },
        fishes: POND_FISHES.map((item, index) => ({ ...item, id: 'pond-' + index, position: [0, -0.8, 0], rotation: [0, 0, 0] })),
      })
        .then(object => {
          if (disposed) {
            object.dispose();
            return;
          }
          fish = object;
          chart.scene.add(object.group);
          object.update(0);
          object.group.children.forEach((root, index) => {
            const pose = getPondPose(index, 0);
            root.position.set(pose.x, pose.y, pose.z);
            root.rotation.set(0, pose.yaw, 0);
          });
          setStatus('六鱼已入水，移动鼠标可扰动水面并让附近鱼避让。');
          frame = requestAnimationFrame(tick);
        })
        .catch(error => {
          if (!disposed) setStatus('鱼群加载失败：' + (error instanceof Error ? error.message : String(error)));
        });
    }
    return () => {
      disposed = true;
      abort.abort();
      motionQuery.removeEventListener('change', onMotionChange);
      observer.disconnect();
      if (resizeFrame !== undefined) cancelAnimationFrame(resizeFrame);
      controlsRef.current = null;
      if (frame !== undefined) cancelAnimationFrame(frame);
      fish?.dispose();
      if (environment) {
        environment.removeFromParent();
        disposeObject3D(environment);
      }
      chart.dispose();
    };
  }, [mode, revision]);

  const changeMode = (next: Mode) => {
    if (next === mode) return;
    setMode(next);
    setStatus(next === 'pond' ? '正在载入六鱼…' : '纯海面：保留原海浪与天空效果。');
  };
  return (
    <>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
        <button type="button" style={buttonStyle} onClick={() => changeMode('pond')} aria-pressed={mode === 'pond'}>
          六鱼水下游动
        </button>
        <button type="button" style={buttonStyle} onClick={() => changeMode('ocean')} aria-pressed={mode === 'ocean'}>
          原纯海面
        </button>
        <button type="button" style={buttonStyle} disabled={mode !== 'pond'} onClick={() => controlsRef.current?.view('surface')}>
          水面斜视
        </button>
        <button type="button" style={buttonStyle} disabled={mode !== 'pond'} onClick={() => controlsRef.current?.view('close')}>
          近看鱼群
        </button>
        <button
          type="button"
          style={buttonStyle}
          disabled={mode !== 'pond'}
          onClick={() => {
            playingRef.current = !playing;
            controlsRef.current?.interaction(!playing);
            setPlaying(!playing);
          }}
        >
          {playing ? '暂停游动' : '继续游动'}
        </button>
        <button
          type="button"
          style={buttonStyle}
          onClick={() => {
            setStatus(mode === 'pond' ? '正在载入六鱼…' : '纯海面：保留原海浪与天空效果。');
            setRevision(value => value + 1);
          }}
        >
          重新载入
        </button>
      </div>
      <p role="status" style={{ margin: '0 0 12px' }}>
        {status}
      </p>
      <ChartWrapper
        title="Water2 水面与六鱼"
        description="鼠标掠过水面产生涟漪，附近鱼平滑避让后恢复巡游。拖拽旋转、滚轮缩放；触摸轻点水面可响应，纵向滑动可滚动页面。鱼模型仍未验收。"
        height="clamp(340px, 42vw, 520px)"
      >
        <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
      </ChartWrapper>
      <p>{POND_FISHES.map(item => FISH_NAMES[item.type]).join(' · ')}。暂停只停止鱼群，水面继续流动。</p>
    </>
  );
}
export default WaterChart;
