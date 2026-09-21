import * as THREE from 'three';
import type { NormalizedScatter3DOptions, NormalizedScatter3DAxisOptions, Scatter3DGridPlane } from './types';

const HALF_WORLD_SIZE = 4;
const AXIS_LABEL_WORLD_SIZE = 0.3;
const AXIS_NAME_WORLD_SIZE = 0.38;

type AxisKey = 'x' | 'y' | 'z';

type AxisDefinition = {
  key: AxisKey;
  start: THREE.Vector3;
  end: THREE.Vector3;
  tickDirection: THREE.Vector3;
};

const AXIS_DEFINITIONS: readonly AxisDefinition[] = [
  {
    key: 'x',
    start: new THREE.Vector3(-HALF_WORLD_SIZE, -HALF_WORLD_SIZE, -HALF_WORLD_SIZE),
    end: new THREE.Vector3(HALF_WORLD_SIZE, -HALF_WORLD_SIZE, -HALF_WORLD_SIZE),
    tickDirection: new THREE.Vector3(0, -1, 0),
  },
  {
    key: 'y',
    start: new THREE.Vector3(-HALF_WORLD_SIZE, -HALF_WORLD_SIZE, -HALF_WORLD_SIZE),
    end: new THREE.Vector3(-HALF_WORLD_SIZE, HALF_WORLD_SIZE, -HALF_WORLD_SIZE),
    tickDirection: new THREE.Vector3(-1, 0, 0),
  },
  {
    key: 'z',
    start: new THREE.Vector3(-HALF_WORLD_SIZE, -HALF_WORLD_SIZE, -HALF_WORLD_SIZE),
    end: new THREE.Vector3(-HALF_WORLD_SIZE, -HALF_WORLD_SIZE, HALF_WORLD_SIZE),
    tickDirection: new THREE.Vector3(-1, 0, 0),
  },
];

function getMaterials(material: THREE.Material | THREE.Material[]) {
  return Array.isArray(material) ? material : [material];
}

function configureGridMaterial(material: THREE.Material, opacity: number) {
  material.transparent = opacity < 1;
  material.opacity = opacity;
  material.depthWrite = false;
}

function configureGridPlane(grid: THREE.GridHelper, plane: Scatter3DGridPlane) {
  if (plane === 'xy') {
    grid.rotation.x = Math.PI / 2;
    grid.position.z = -HALF_WORLD_SIZE;
  } else if (plane === 'yz') {
    grid.rotation.z = Math.PI / 2;
    grid.position.x = -HALF_WORLD_SIZE;
  } else {
    grid.position.y = -HALF_WORLD_SIZE;
  }
}

export function createGridObjects(options: NormalizedScatter3DOptions['grid']) {
  if (!options.show) return [];

  return options.planes.map(plane => {
    const grid = new THREE.GridHelper(HALF_WORLD_SIZE * 2, options.divisions, options.centerColor, options.planeColors[plane] ?? options.color);
    configureGridPlane(grid, plane);
    getMaterials(grid.material).forEach(material => configureGridMaterial(material, options.opacity));
    grid.renderOrder = 1;
    return grid;
  });
}

function formatAxisValue(value: number, formatter?: (value: number) => string) {
  if (formatter) return formatter(value);
  if (Math.abs(value) >= 1000 || (Math.abs(value) > 0 && Math.abs(value) < 0.01)) {
    return value.toExponential(2);
  }
  return Number(value.toFixed(2)).toString();
}

function createTextSprite(text: string, color: string, fontSize: number, worldSize: number) {
  const pixelRatio = 2;
  const padding = 5;
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (!context) return undefined;

  const font = `600 ${fontSize * pixelRatio}px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
  context.font = font;
  const textWidth = Math.ceil(context.measureText(text).width);
  canvas.width = textWidth + padding * 2 * pixelRatio;
  canvas.height = Math.ceil(fontSize * pixelRatio + padding * 2 * pixelRatio);
  context.font = font;
  context.fillStyle = color;
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText(text, canvas.width / 2, canvas.height / 2);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  const material = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    depthTest: false,
    depthWrite: false,
  });
  const sprite = new THREE.Sprite(material);
  const aspect = canvas.width / canvas.height;
  sprite.scale.set(worldSize * aspect, worldSize, 1);
  sprite.renderOrder = 10;
  return sprite;
}

function addAxisLabels(
  group: THREE.Group,
  definition: AxisDefinition,
  axis: NormalizedScatter3DAxisOptions,
  showLabels: boolean,
  showTicks: boolean
) {
  const direction = definition.end.clone().sub(definition.start);
  const tickOffset = definition.tickDirection.clone().multiplyScalar(axis.tickSize + axis.labelGap);
  for (let index = 0; index <= axis.splitNumber; index += 1) {
    const progress = index / axis.splitNumber;
    const position = definition.start.clone().addScaledVector(direction, progress);
    if (showTicks) {
      const tickEnd = position.clone().addScaledVector(definition.tickDirection, axis.tickSize);
      const tickGeometry = new THREE.BufferGeometry().setFromPoints([position, tickEnd]);
      const tickMaterial = new THREE.LineBasicMaterial({ color: axis.color });
      group.add(new THREE.Line(tickGeometry, tickMaterial));
    }
    if (showLabels) {
      const value = axis.domain[0] + (axis.domain[1] - axis.domain[0]) * progress;
      const label = createTextSprite(
        formatAxisValue(value, axis.formatter),
        axis.labelColor,
        axis.fontSize,
        AXIS_LABEL_WORLD_SIZE * (axis.fontSize / 12)
      );
      if (label) {
        label.position.copy(position).add(tickOffset);
        group.add(label);
      }
    }
  }

  if (axis.name) {
    const name = createTextSprite(axis.name, axis.nameColor, axis.fontSize + 1, AXIS_NAME_WORLD_SIZE * ((axis.fontSize + 1) / 13));
    if (name) {
      name.position.copy(definition.end).addScaledVector(definition.tickDirection, axis.tickSize + axis.nameGap);
      group.add(name);
    }
  }
}

export function createAxesObject(options: NormalizedScatter3DOptions) {
  if (!options.axes.show) return undefined;

  const group = new THREE.Group();
  group.name = 'scatter3d-axes';
  group.renderOrder = 2;
  const axisOptions = { x: options.xAxis, y: options.yAxis, z: options.zAxis };
  AXIS_DEFINITIONS.forEach(definition => {
    const axis = axisOptions[definition.key];
    if (!axis.show) return;

    if (axis.axisLine.show) {
      const axisGeometry = new THREE.BufferGeometry().setFromPoints([definition.start, definition.end]);
      const axisMaterial =
        axis.axisLine.dash === 'solid'
          ? new THREE.LineBasicMaterial({
              color: axis.axisLine.color,
              linewidth: axis.axisLine.width,
              transparent: axis.axisLine.opacity < 1,
              opacity: axis.axisLine.opacity,
            })
          : new THREE.LineDashedMaterial({
              color: axis.axisLine.color,
              linewidth: axis.axisLine.width,
              dashSize: axis.axisLine.dashSize,
              gapSize: axis.axisLine.gapSize,
              transparent: axis.axisLine.opacity < 1,
              opacity: axis.axisLine.opacity,
            });
      const axisLine = new THREE.Line(axisGeometry, axisMaterial);
      if (axis.axisLine.dash !== 'solid') axisLine.computeLineDistances();
      group.add(axisLine);
    }
    addAxisLabels(group, definition, axis, axis.showLabel, axis.showTick);
  });
  return group;
}

export function createPointTexture(symbol: 'circle' | 'square') {
  if (symbol === 'square') return undefined;

  const size = 64;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext('2d');
  if (!context) return undefined;

  const gradient = context.createRadialGradient(size / 2, size / 2, size * 0.08, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
  gradient.addColorStop(0.78, 'rgba(255, 255, 255, 0.96)');
  gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
  context.fillStyle = gradient;
  context.fillRect(0, 0, size, size);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

export function getBlending(blending: NormalizedScatter3DOptions['point']['blending']) {
  switch (blending) {
    case 'additive':
      return THREE.AdditiveBlending;
    case 'subtractive':
      return THREE.SubtractiveBlending;
    case 'multiply':
      return THREE.MultiplyBlending;
    default:
      return THREE.NormalBlending;
  }
}
