import type { FireOptions, FireQuality, NormalizedFireOptions } from './types';

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function finiteOr(value: number | undefined, fallback: number) {
  return value !== undefined && Number.isFinite(value) ? value : fallback;
}

function isPosition(value: readonly number[] | undefined): value is readonly [number, number, number] {
  return Boolean(value && value.length === 3 && value.every(Number.isFinite));
}

function qualityOrDefault(value: FireQuality | undefined): FireQuality {
  return value === 'low' || value === 'high' ? value : 'medium';
}

export function normalizeOptions(options: FireOptions): NormalizedFireOptions {
  const fire = options.fire ?? {};
  const candle = options.candle ?? {};
  const candleLight = candle.light ?? {};
  const environment = options.environment ?? {};
  const lighting = options.lighting ?? {};
  const hemisphere = lighting.hemisphere ?? {};
  const fill = lighting.fill ?? {};
  const shadow = options.shadow ?? {};
  const ground = options.ground ?? {};
  const bloom = options.bloom ?? {};
  const camera = options.camera ?? {};
  const controls = options.controls ?? {};
  const backgroundColor = options.backgroundColor === undefined ? '#100e0c' : options.backgroundColor;
  const quality = qualityOrDefault(options.quality);
  const qualityDefaults = {
    low: { pixelRatio: 1, shadowMapSize: 256 },
    medium: { pixelRatio: 1.5, shadowMapSize: 1024 },
    high: { pixelRatio: 2, shadowMapSize: 2048 },
  }[quality];

  const height = Math.max(finiteOr(fire.height, 0.62), 0.05);
  const showCandle = candle.show ?? true;
  const bodyHeight = Math.max(finiteOr(candle.bodyHeight, 1.25), 0.08);
  const bodyRadius = Math.max(finiteOr(candle.bodyRadius, 0.32), 0.02);
  const wickHeight = Math.max(finiteOr(candle.wickHeight, 0.085), 0.01);
  const wickRadius = Math.max(finiteOr(candle.wickRadius, 0.008), 0.002);
  const candlePosition = isPosition(candle.position) ? candle.position : ([0, 0, 0] as const);
  const contentHeight = showCandle ? bodyHeight + wickHeight + height : height;
  const defaultCameraPosition: readonly [number, number, number] = [
    candlePosition[0],
    candlePosition[1] + contentHeight * 0.66,
    candlePosition[2] + contentHeight * 2.1,
  ];
  const defaultTarget: readonly [number, number, number] = [candlePosition[0], candlePosition[1] + contentHeight * 0.5, candlePosition[2]];
  const autoFrame = camera.autoFrame ?? (camera.position === undefined && camera.target === undefined);

  return {
    quality,
    lighting: {
      hemisphere: {
        show: hemisphere.show ?? true,
        skyColor: hemisphere.skyColor ?? 0xdde5ff,
        groundColor: hemisphere.groundColor ?? 0x1e1410,
        intensity: clamp(finiteOr(hemisphere.intensity, 0.22), 0, 5),
      },
      fill: {
        show: fill.show ?? true,
        color: fill.color ?? 0xffefd8,
        intensity: clamp(finiteOr(fill.intensity, 0.65), 0, 20),
        position: isPosition(fill.position) ? fill.position : [-3, 3.5, 4],
        castShadow: fill.castShadow ?? true,
      },
    },
    shadow: {
      enabled: shadow.enabled ?? true,
      mapSize: Math.round(clamp(finiteOr(shadow.mapSize, qualityDefaults.shadowMapSize), 128, 4096)),
      radius: clamp(finiteOr(shadow.radius, 3), 0, 64),
      intensity: clamp(finiteOr(shadow.intensity, 1), 0, 1),
      bias: clamp(finiteOr(shadow.bias, 0), -0.1, 0.1),
      normalBias: clamp(finiteOr(shadow.normalBias, 0.012), -1, 1),
      refreshRate: clamp(finiteOr(shadow.refreshRate, 24), 0, 60),
    },
    ground: {
      show: ground.show ?? backgroundColor !== null,
      color: ground.color ?? '#29231c',
      roughness: clamp(finiteOr(ground.roughness, 0.95), 0, 1),
      size: Math.max(finiteOr(ground.size, 200), 0.1),
      receiveShadow: ground.receiveShadow ?? true,
    },
    fire: {
      color: fire.color ?? '#ffb34b',
      width: Math.max(finiteOr(fire.width, 0.22), 0.02),
      height,
      depth: Math.max(finiteOr(fire.depth, 0.22), 0.02),
      speed: clamp(finiteOr(fire.speed, 1), 0, 3),
      airflowAmplitude: clamp(finiteOr(fire.airflowAmplitude, 0.65), 0, 1),
    },
    candle: {
      show: showCandle,
      position: candlePosition,
      bodyColor: candle.bodyColor ?? '#f5e8cf',
      bodyRadius,
      bodyHeight,
      wickColor: candle.wickColor ?? '#17100b',
      wickRadius,
      wickHeight,
      light: {
        show: candleLight.show ?? true,
        color: candleLight.color ?? '#ffb55d',
        intensity: clamp(finiteOr(candleLight.intensity, 0.32), 0, 20),
        distance: Math.max(finiteOr(candleLight.distance, 7), 0.1),
        decay: clamp(finiteOr(candleLight.decay, 2), 0, 4),
        castShadow: candleLight.castShadow ?? false,
      },
    },
    environment: {
      show: environment.show ?? false,
      intensity: clamp(finiteOr(environment.intensity, 0.8), 0, 5),
    },
    backgroundColor,
    bloom: {
      show: bloom.show ?? true,
      strength: clamp(finiteOr(bloom.strength, 0.1), 0, 3),
      radius: clamp(finiteOr(bloom.radius, 0.15), 0, 1),
      threshold: clamp(finiteOr(bloom.threshold, 0.9), 0, 1),
    },
    camera: {
      autoFrame,
      position: autoFrame ? defaultCameraPosition : isPosition(camera.position) ? camera.position : defaultCameraPosition,
      target: autoFrame ? defaultTarget : isPosition(camera.target) ? camera.target : defaultTarget,
      fov: clamp(finiteOr(camera.fov, 42), 20, 100),
      near: Math.max(finiteOr(camera.near, 0.1), 0.01),
      far: Math.max(finiteOr(camera.far, 100), 10),
    },
    controls: {
      enabled: controls.enabled ?? true,
      damping: controls.damping ?? true,
      autoRotate: controls.autoRotate ?? false,
      autoRotateSpeed: Math.max(finiteOr(controls.autoRotateSpeed, 0.7), 0),
      enableRotate: controls.enableRotate ?? true,
      enableZoom: controls.enableZoom ?? true,
      enablePan: controls.enablePan ?? false,
      minDistance: Math.max(finiteOr(controls.minDistance, 2.4), 0.1),
      maxDistance: Math.max(finiteOr(controls.maxDistance, 10), finiteOr(controls.minDistance, 2.4)),
      rotateSpeed: Math.max(finiteOr(controls.rotateSpeed, 0.7), 0),
      zoomSpeed: Math.max(finiteOr(controls.zoomSpeed, 0.8), 0),
      panSpeed: Math.max(finiteOr(controls.panSpeed, 0.8), 0),
    },
    renderer: {
      pixelRatio: clamp(finiteOr(options.renderer?.pixelRatio, qualityDefaults.pixelRatio), 1, 2),
    },
  };
}
