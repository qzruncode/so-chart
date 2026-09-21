import { applyTooltip, getColor } from '@so-chart/utils';
import type {
  NormalizedScatter3DDataset,
  NormalizedScatter3DAxisLineOptions,
  NormalizedScatter3DAxisOptions,
  NormalizedScatter3DOptions,
  NormalizedScatter3DPoint,
  Scatter3DAxesOptions,
  Scatter3DAxisLineOptions,
  Scatter3DAxisOptions,
  Scatter3DGridOptions,
  Scatter3DGridPlane,
  Scatter3DOptions,
  Scatter3DPoint,
} from './types';

const DEFAULT_CAMERA_POSITION: readonly [number, number, number] = [7, 5.5, 7];
const DEFAULT_CAMERA_TARGET: readonly [number, number, number] = [0, 0, 0];
const DEFAULT_GRID_PLANES = ['xz'] as const;
const DEFAULT_VISUAL_COLORS = ['#2563eb', '#ef4444'] as const;

function isTuplePoint(value: Scatter3DPoint): value is readonly [number, number, number] {
  return Array.isArray(value);
}

function toPoint(value: Scatter3DPoint, label: string): NormalizedScatter3DPoint | undefined {
  const x = isTuplePoint(value) ? value[0] : value.x;
  const y = isTuplePoint(value) ? value[1] : value.y;
  const z = isTuplePoint(value) ? value[2] : value.z;
  if (![x, y, z].every(Number.isFinite)) return undefined;

  return {
    value,
    x,
    y,
    z,
    label: isTuplePoint(value) ? label : (value.label ?? label),
    color: isTuplePoint(value) ? undefined : value.color,
    numericValue: isTuplePoint(value) ? undefined : value.value,
  };
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function clampInt(value: number, min: number, max: number) {
  return Math.round(clamp(value, min, max));
}

function resolveDomain(values: number[], domain?: readonly [number, number]): readonly [number, number] {
  if (domain && Number.isFinite(domain[0]) && Number.isFinite(domain[1]) && domain[0] !== domain[1]) {
    return domain[0] < domain[1] ? domain : [domain[1], domain[0]];
  }

  let min = Infinity;
  let max = -Infinity;
  values.forEach(value => {
    if (!Number.isFinite(value)) return;
    min = Math.min(min, value);
    max = Math.max(max, value);
  });

  if (min === Infinity || max === -Infinity) return [-1, 1];
  if (min === max) {
    const padding = Math.max(Math.abs(min) * 0.1, 1);
    return [min - padding, max + padding];
  }

  const padding = (max - min) * 0.05;
  return [min - padding, max + padding];
}

function normalizeGrid(grid: Scatter3DOptions['grid'], fallbackColor: string): NormalizedScatter3DOptions['grid'] {
  const config: Scatter3DGridOptions = typeof grid === 'object' && grid !== null ? grid : {};
  const planes: readonly Scatter3DGridPlane[] = config.planes === 'all' ? ['xy', 'xz', 'yz'] : (config.planes ?? DEFAULT_GRID_PLANES);
  return {
    show: typeof grid === 'boolean' ? grid : (config.show ?? true),
    color: config.color ?? fallbackColor,
    centerColor: config.centerColor ?? config.color ?? fallbackColor,
    planeColors: config.planeColors ?? {},
    divisions: clampInt(config.divisions ?? 8, 1, 32),
    opacity: clamp(config.opacity ?? 0.52, 0, 1),
    planes,
  };
}

function normalizeAxisLine(
  line: Scatter3DAxisLineOptions | undefined,
  fallbackColor: string,
  defaults?: NormalizedScatter3DAxisLineOptions
): NormalizedScatter3DAxisLineOptions {
  const dash = line?.dash ?? defaults?.dash ?? 'solid';
  return {
    show: line?.show ?? defaults?.show ?? true,
    color: line?.color ?? fallbackColor,
    width: Math.max(line?.width ?? defaults?.width ?? 1, 0.1),
    opacity: clamp(line?.opacity ?? defaults?.opacity ?? 0.8, 0, 1),
    dash,
    dashSize: Math.max(line?.dashSize ?? defaults?.dashSize ?? 0.25, 0.01),
    gapSize: Math.max(line?.gapSize ?? defaults?.gapSize ?? 0.14, 0.01),
  };
}

function normalizeAxes(axes: Scatter3DOptions['axes'], fallbackColor: string): NormalizedScatter3DOptions['axes'] {
  const config: Scatter3DAxesOptions = typeof axes === 'object' && axes !== null ? axes : {};
  return {
    show: typeof axes === 'boolean' ? axes : (config.show ?? true),
    color: config.color ?? fallbackColor,
    labelColor: config.labelColor ?? fallbackColor,
    nameColor: config.nameColor ?? config.labelColor ?? fallbackColor,
    showLabel: config.showLabel ?? true,
    showTick: config.showTick ?? true,
    axisLine: normalizeAxisLine(config.axisLine, config.color ?? fallbackColor),
    splitNumber: clampInt(config.splitNumber ?? 4, 1, 12),
    tickSize: clamp(config.tickSize ?? 0.12, 0.02, 0.5),
    fontSize: clamp(config.fontSize ?? 12, 8, 32),
    labelGap: clamp(config.labelGap ?? 0.14, 0, 1),
    nameGap: clamp(config.nameGap ?? 0.3, 0, 1),
    formatter: config.formatter,
  };
}

function normalizeAxis(
  axis: Scatter3DAxisOptions | undefined,
  domain: readonly [number, number],
  defaults: NormalizedScatter3DOptions['axes']
): NormalizedScatter3DAxisOptions {
  return {
    show: axis?.show ?? true,
    domain,
    name: axis?.name ?? '',
    color: axis?.color ?? defaults.color,
    labelColor: axis?.labelColor ?? defaults.labelColor,
    nameColor: axis?.nameColor ?? defaults.nameColor,
    showLabel: axis?.showLabel ?? defaults.showLabel,
    showTick: axis?.showTick ?? defaults.showTick,
    axisLine: normalizeAxisLine(axis?.axisLine, axis?.color ?? defaults.color, defaults.axisLine),
    splitNumber: clampInt(axis?.splitNumber ?? defaults.splitNumber, 1, 12),
    tickSize: clamp(axis?.tickSize ?? defaults.tickSize, 0.02, 0.5),
    fontSize: clamp(axis?.fontSize ?? defaults.fontSize, 8, 32),
    labelGap: clamp(axis?.labelGap ?? defaults.labelGap, 0, 1),
    nameGap: clamp(axis?.nameGap ?? defaults.nameGap, 0, 1),
    formatter: axis?.formatter ?? defaults.formatter,
  };
}

function getVisualValue(point: NormalizedScatter3DPoint, dimension: NonNullable<Scatter3DOptions['visualMap']>['dimension']) {
  if (dimension === 'value') return point.numericValue;
  if (dimension === 'x') return point.x;
  if (dimension === 'y') return point.y;
  return point.z;
}

function normalizeVisualMap(options: Scatter3DOptions, datasets: NormalizedScatter3DDataset[]) {
  const visualMap = options.visualMap;
  if (!visualMap) return undefined;

  const dimension = visualMap.dimension ?? 'value';
  const values = datasets.flatMap(dataset => dataset.points.map(point => getVisualValue(point, dimension)));
  const finiteValues = values.filter((value): value is number => Number.isFinite(value));
  let min = Number.isFinite(visualMap.min) ? visualMap.min : undefined;
  let max = Number.isFinite(visualMap.max) ? visualMap.max : undefined;
  if (min === undefined && finiteValues.length > 0) {
    min = finiteValues.reduce((current, value) => Math.min(current, value), Infinity);
  }
  if (max === undefined && finiteValues.length > 0) {
    max = finiteValues.reduce((current, value) => Math.max(current, value), -Infinity);
  }
  if (min !== undefined && max !== undefined && min > max) [min, max] = [max, min];
  if (min !== undefined && max !== undefined && min === max) max = min + 1;
  const colors = visualMap.colors && visualMap.colors.length >= 2 ? visualMap.colors : DEFAULT_VISUAL_COLORS;

  return {
    dimension,
    min,
    max,
    colors,
    clamp: visualMap.clamp ?? true,
    reverse: visualMap.reverse ?? false,
    outOfRangeColor: visualMap.outOfRangeColor,
  };
}

export function normalizeOptions(options: Scatter3DOptions): NormalizedScatter3DOptions {
  const gridColor = options.gridColor ?? '#94a3b8';
  const axisColor = options.axisColor ?? '#475569';
  const axes = normalizeAxes(options.axes, axisColor);
  const controlOptions = options.controls ?? {};
  const minPolarAngle = Number.isFinite(controlOptions.minPolarAngle) ? clamp(controlOptions.minPolarAngle ?? 0, 0, Math.PI) : 0;
  const maxPolarAngle = Number.isFinite(controlOptions.maxPolarAngle) ? clamp(controlOptions.maxPolarAngle ?? Math.PI, 0, Math.PI) : Math.PI;
  const azimuthAngles = [
    Number.isFinite(controlOptions.minAzimuthAngle) ? (controlOptions.minAzimuthAngle ?? -Infinity) : -Infinity,
    Number.isFinite(controlOptions.maxAzimuthAngle) ? (controlOptions.maxAzimuthAngle ?? Infinity) : Infinity,
  ];
  const minAzimuthAngle = Math.min(...azimuthAngles);
  const maxAzimuthAngle = Math.max(...azimuthAngles);
  const xDomain = resolveDomain(
    options.datasets.flatMap(dataset => dataset.data.map(value => (isTuplePoint(value) ? value[0] : value.x))),
    options.xAxis?.domain
  );
  const yDomain = resolveDomain(
    options.datasets.flatMap(dataset => dataset.data.map(value => (isTuplePoint(value) ? value[1] : value.y))),
    options.yAxis?.domain
  );
  const zDomain = resolveDomain(
    options.datasets.flatMap(dataset => dataset.data.map(value => (isTuplePoint(value) ? value[2] : value.z))),
    options.zAxis?.domain
  );
  const datasets: NormalizedScatter3DDataset[] = (options.datasets ?? []).map((dataset, datasetIndex) => {
    const label = dataset.label ?? `Series ${datasetIndex + 1}`;
    const points = dataset.data.map(value => toPoint(value, label)).filter((point): point is NormalizedScatter3DPoint => point !== undefined);
    const line = dataset.line;
    const color = dataset.color ?? getColor({ i: datasetIndex, cs: options.cs });
    const lineDash = line?.dash ?? 'solid';
    return {
      label,
      points,
      color,
      opacity: clamp(dataset.opacity ?? options.point?.opacity ?? 0.9, 0, 1),
      symbol: dataset.symbol ?? options.point?.symbol ?? 'circle',
      size: Math.max(dataset.size ?? options.point?.size ?? 0.16, 0.01),
      show: dataset.show ?? true,
      line: {
        show: line?.show ?? false,
        color: line?.color ?? color,
        width: Math.max(line?.width ?? 1, 0.1),
        opacity: clamp(line?.opacity ?? 0.65, 0, 1),
        dash: lineDash,
        dashSize: Math.max(line?.dashSize ?? (lineDash === 'dotted' ? 0.06 : 0.35), 0.01),
        gapSize: Math.max(line?.gapSize ?? 0.18, 0.01),
      },
    };
  });

  const grid = normalizeGrid(options.grid, gridColor);
  const visualMap = normalizeVisualMap(options, datasets);
  const fog = options.fog
    ? {
        color: options.fog.color ?? options.backgroundColor ?? '#0f172a',
        near: Math.max(options.fog.near ?? 10, 0.1),
        far: Math.max(options.fog.far ?? 40, (options.fog.near ?? 10) + 0.1),
      }
    : undefined;
  return {
    datasets,
    xDomain,
    yDomain,
    zDomain,
    backgroundColor: options.backgroundColor ?? null,
    fog,
    grid,
    axes,
    xAxis: normalizeAxis(options.xAxis, xDomain, axes),
    yAxis: normalizeAxis(options.yAxis, yDomain, axes),
    zAxis: normalizeAxis(options.zAxis, zDomain, axes),
    tooltip: applyTooltip(options.tooltip),
    point: {
      size: Math.max(options.point?.size ?? 0.16, 0.01),
      opacity: clamp(options.point?.opacity ?? 0.9, 0, 1),
      symbol: options.point?.symbol ?? 'circle',
      sizeAttenuation: options.point?.sizeAttenuation ?? true,
      depthTest: options.point?.depthTest ?? true,
      depthWrite: options.point?.depthWrite ?? false,
      blending: options.point?.blending ?? 'normal',
    },
    visualMap,
    emphasis: {
      show: options.emphasis?.show ?? true,
      scale: clamp(options.emphasis?.scale ?? 1.8, 1, 4),
      color: options.emphasis?.color,
      size: options.emphasis?.size === undefined ? undefined : Math.max(options.emphasis.size, 0.02),
      opacity: options.emphasis?.opacity === undefined ? undefined : clamp(options.emphasis.opacity, 0, 1),
    },
    renderer: {
      pixelRatio: clamp(options.renderer?.pixelRatio ?? 2, 1, 3),
    },
    camera: {
      position: options.camera?.position ?? DEFAULT_CAMERA_POSITION,
      target: options.camera?.target ?? DEFAULT_CAMERA_TARGET,
      zoom: Math.max(options.camera?.zoom ?? 1, 0.1),
      fov: options.camera?.fov ?? 45,
      near: options.camera?.near ?? 0.1,
      far: options.camera?.far ?? 100,
    },
    controls: {
      enabled: controlOptions.enabled ?? true,
      damping: controlOptions.damping ?? false,
      autoRotate: controlOptions.autoRotate ?? false,
      autoRotateSpeed: Number.isFinite(controlOptions.autoRotateSpeed) ? Math.max(controlOptions.autoRotateSpeed ?? 1.5, 0) : 1.5,
      enableRotate: controlOptions.enableRotate ?? true,
      enableZoom: controlOptions.enableZoom ?? true,
      enablePan: controlOptions.enablePan ?? true,
      minDistance: Math.max(controlOptions.minDistance ?? 0, 0),
      maxDistance: Math.max(controlOptions.maxDistance ?? Infinity, controlOptions.minDistance ?? 0),
      minPolarAngle,
      maxPolarAngle: Math.max(maxPolarAngle, minPolarAngle),
      minAzimuthAngle,
      maxAzimuthAngle,
      rotateSpeed: Number.isFinite(controlOptions.rotateSpeed) ? Math.max(controlOptions.rotateSpeed ?? 1, 0) : 1,
      zoomSpeed: Number.isFinite(controlOptions.zoomSpeed) ? Math.max(controlOptions.zoomSpeed ?? 1, 0) : 1,
      panSpeed: Number.isFinite(controlOptions.panSpeed) ? Math.max(controlOptions.panSpeed ?? 1, 0) : 1,
      screenSpacePanning: controlOptions.screenSpacePanning ?? true,
      keyPanSpeed: Number.isFinite(controlOptions.keyPanSpeed) ? Math.max(controlOptions.keyPanSpeed ?? 7, 0) : 7,
    },
  };
}
