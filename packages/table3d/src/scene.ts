import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import type { NormalizedTable3DOptions } from './types';

function createPart(name: string, geometry: THREE.BufferGeometry, material: THREE.Material, position: readonly [number, number, number]) {
  const mesh = new THREE.Mesh(geometry, material);
  mesh.name = name;
  mesh.position.set(...position);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  mesh.userData.tablePart = name;
  return mesh;
}

function createRoundedGeometry(width: number, height: number, depth: number, segments: number, radius: number) {
  const safeRadius = Math.min(radius, width / 2, height / 2, depth / 2);
  return new RoundedBoxGeometry(width, height, depth, segments, safeRadius);
}

function createCylinderGeometry(radiusTop: number, radiusBottom: number, height: number, radialSegments: number) {
  return new THREE.CylinderGeometry(radiusTop, radiusBottom, height, radialSegments, 1, false);
}

function createRoundTopGeometry(diameter: number, thickness: number, radialSegments: number, edgeRadius: number, edgeSegments: number) {
  const shape = new THREE.Shape();
  shape.absarc(0, 0, diameter / 2, 0, Math.PI * 2, false);
  shape.closePath();

  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: thickness,
    curveSegments: radialSegments,
    bevelEnabled: edgeRadius > 0,
    bevelSegments: edgeSegments,
    bevelSize: edgeRadius,
    bevelThickness: edgeRadius,
  });
  geometry.rotateX(-Math.PI / 2);
  geometry.translate(0, -thickness / 2, 0);
  geometry.computeVertexNormals();
  return geometry;
}

function addRectangularTable(
  group: THREE.Group,
  options: NormalizedTable3DOptions,
  tabletopMaterial: THREE.MeshPhysicalMaterial,
  supportMaterial: THREE.MeshPhysicalMaterial
) {
  const { table } = options;
  const topGeometry = createRoundedGeometry(table.width, table.topThickness, table.depth, table.cornerSegments, table.cornerRadius);
  group.add(createPart('table3d-top', topGeometry, tabletopMaterial, [0, table.height - table.topThickness / 2, 0]));

  const legHeight = Math.max(table.height - table.topThickness, 0.02);
  const legCenterX = table.width / 2 - table.legInset - table.legWidth / 2;
  const legCenterZ = table.depth / 2 - table.legInset - table.legWidth / 2;
  const legGeometry = createRoundedGeometry(table.legWidth, legHeight, table.legWidth, table.cornerSegments, table.cornerRadius);
  const legPositions: ReadonlyArray<readonly [number, number]> = [
    [-legCenterX, -legCenterZ],
    [legCenterX, -legCenterZ],
    [-legCenterX, legCenterZ],
    [legCenterX, legCenterZ],
  ];
  legPositions.forEach(([x, z], index) => {
    group.add(createPart(`table3d-leg-${index + 1}`, legGeometry, supportMaterial, [x, legHeight / 2, z]));
  });

  const apronY = table.height - table.topThickness - table.apronHeight / 2 - 0.025;
  const apronDepth = Math.max(table.legWidth * 0.78, 0.02);
  const apronWidth = Math.max(table.width - table.apronInset * 2, table.legWidth);
  const apronLength = Math.max(table.depth - table.apronInset * 2, table.legWidth);
  const frontApronGeometry = createRoundedGeometry(apronWidth, table.apronHeight, apronDepth, table.cornerSegments, table.cornerRadius * 0.75);
  const sideApronGeometry = createRoundedGeometry(apronDepth, table.apronHeight, apronLength, table.cornerSegments, table.cornerRadius * 0.75);
  group.add(
    createPart('table3d-apron-front', frontApronGeometry, supportMaterial, [0, apronY, -table.depth / 2 + table.apronInset]),
    createPart('table3d-apron-back', frontApronGeometry, supportMaterial, [0, apronY, table.depth / 2 - table.apronInset]),
    createPart('table3d-apron-left', sideApronGeometry, supportMaterial, [-table.width / 2 + table.apronInset, apronY, 0]),
    createPart('table3d-apron-right', sideApronGeometry, supportMaterial, [table.width / 2 - table.apronInset, apronY, 0])
  );
}

function addRoundLegSupport(group: THREE.Group, options: NormalizedTable3DOptions, woodMaterial: THREE.MeshPhysicalMaterial) {
  const { table } = options;
  const legHeight = Math.max(table.height - table.topThickness, 0.02);
  const legCenter = table.diameter / 2 - table.legInset - table.legWidth / 2;
  const legGeometry = createRoundedGeometry(table.legWidth, legHeight, table.legWidth, table.cornerSegments, table.cornerRadius);
  const legPositions: ReadonlyArray<readonly [number, number]> = [
    [-legCenter, -legCenter],
    [legCenter, -legCenter],
    [-legCenter, legCenter],
    [legCenter, legCenter],
  ];
  legPositions.forEach(([x, z], index) => {
    group.add(createPart(`table3d-round-leg-${index + 1}`, legGeometry, woodMaterial, [x, legHeight / 2, z]));
  });
}

function addPedestalSupport(group: THREE.Group, options: NormalizedTable3DOptions, woodMaterial: THREE.MeshPhysicalMaterial) {
  const { table } = options;
  const baseGeometry = createCylinderGeometry(table.baseRadius * 0.96, table.baseRadius, table.baseHeight, table.supportSegments);
  const pedestalGeometry = createCylinderGeometry(table.pedestalRadius * 1.05, table.pedestalRadius, table.pedestalHeight, table.supportSegments);
  const collarGeometry = createCylinderGeometry(table.collarRadius * 0.92, table.collarRadius, table.collarHeight, table.supportSegments);

  group.add(
    createPart('table3d-pedestal-base', baseGeometry, woodMaterial, [0, table.baseHeight / 2, 0]),
    createPart('table3d-pedestal-column', pedestalGeometry, woodMaterial, [0, table.baseHeight + table.pedestalHeight / 2, 0]),
    createPart('table3d-pedestal-collar', collarGeometry, woodMaterial, [0, table.baseHeight + table.pedestalHeight + table.collarHeight / 2, 0])
  );
}

function addRoundTable(
  group: THREE.Group,
  options: NormalizedTable3DOptions,
  tabletopMaterial: THREE.MeshPhysicalMaterial,
  supportMaterial: THREE.MeshPhysicalMaterial
) {
  const { table } = options;
  const topGeometry = createRoundTopGeometry(table.diameter, table.topThickness, table.radialSegments, table.edgeRadius, table.edgeSegments);
  group.add(createPart('table3d-round-top', topGeometry, tabletopMaterial, [0, table.height - table.topThickness / 2, 0]));

  if (table.support === 'pedestal') {
    addPedestalSupport(group, options, supportMaterial);
  } else {
    addRoundLegSupport(group, options, supportMaterial);
  }
}

function addFloor(group: THREE.Group, options: NormalizedTable3DOptions) {
  const { table, floor: floorOptions } = options;
  if (!floorOptions.show) return;

  const floorSize = Math.max(table.width, table.depth, table.diameter) * 5;
  const floorMaterial = new THREE.MeshPhysicalMaterial({
    color: floorOptions.color,
    roughness: floorOptions.roughness,
    metalness: floorOptions.metalness,
    envMapIntensity: 0.3,
  });
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(floorSize, floorSize), floorMaterial);
  floor.name = 'table3d-floor';
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  floor.userData.tablePart = 'floor';
  group.add(floor);
}

export function createTableScene(options: NormalizedTable3DOptions) {
  const { table, material: materialOptions, tabletopMaterial: tabletopMaterialOptions } = options;
  const group = new THREE.Group();
  group.name = 'table3d-scene';

  const createWoodMaterial = (materialOptions: NormalizedTable3DOptions['material']) => new THREE.MeshPhysicalMaterial({
    color: materialOptions.color,
    roughness: materialOptions.roughness,
    metalness: materialOptions.metalness,
    clearcoat: materialOptions.clearcoat,
    clearcoatRoughness: materialOptions.clearcoatRoughness,
    envMapIntensity: materialOptions.envMapIntensity,
    map: materialOptions.map?.clone() ?? null,
    normalMap: materialOptions.normalMap?.clone() ?? null,
    roughnessMap: materialOptions.roughnessMap?.clone() ?? null,
    normalScale: new THREE.Vector2(...materialOptions.normalScale),
  });
  const supportMaterial = createWoodMaterial(materialOptions);
  const tabletopMaterial = createWoodMaterial(tabletopMaterialOptions);

  if (table.shape === 'round') {
    addRoundTable(group, options, tabletopMaterial, supportMaterial);
  } else {
    addRectangularTable(group, options, tabletopMaterial, supportMaterial);
  }
  addFloor(group, options);
  return group;
}
