import * as THREE from 'three';
import type { FishType } from './types.js';

type BodyStation = { s: number; ry: number; rz: number; y?: number };
type FinProfile = { start: number; end: number; height: readonly number[] };

export type FishAnatomy = {
  length: number;
  body: readonly BodyStation[];
  dorsal: FinProfile;
  anal: FinProfile;
  caudalSpread: number;
  caudalExtension: number;
  forkDepth: number;
  eyeS: number;
  eyeHeight: number;
  scaleRows: number;
  scaleColumns: number;
  roughness: number;
  barbels?: boolean;
  palette: {
    back: string;
    flank: string;
    belly: string;
    fin: string;
    finRay: string;
    gill: string;
    eyeRim: string;
  };
};

const HEAD_X = 0.76;
const AXIAL_SEGMENTS = 72;
const RADIAL_SEGMENTS = 32;

export const FISH_ANATOMY: Record<FishType, FishAnatomy> = {
  'black-carp': {
    length: 1.56,
    body: [
      { s: 0, ry: 0.012, rz: 0.014 },
      { s: 0.045, ry: 0.075, rz: 0.07 },
      { s: 0.13, ry: 0.14, rz: 0.12 },
      { s: 0.28, ry: 0.215, rz: 0.165 },
      { s: 0.48, ry: 0.265, rz: 0.19 },
      { s: 0.63, ry: 0.245, rz: 0.17 },
      { s: 0.8, ry: 0.16, rz: 0.115 },
      { s: 0.94, ry: 0.065, rz: 0.05 },
      { s: 1, ry: 0.008, rz: 0.009 },
    ],
    dorsal: { start: 0.3, end: 0.68, height: [0, 0.03, 0.085, 0.07, 0.035, 0.01, 0] },
    anal: { start: 0.67, end: 0.9, height: [0, 0.025, 0.065, 0.04, 0] },
    caudalSpread: 0.205,
    caudalExtension: 0.265,
    forkDepth: 0.48,
    eyeS: 0.105,
    eyeHeight: 0.18,
    scaleRows: 13,
    scaleColumns: 37,
    roughness: 0.68,
    palette: { back: '#38463c', flank: '#78816b', belly: '#c4c0aa', fin: '#626e5d', finRay: '#9da48a', gill: '#455146', eyeRim: '#988b61' },
  },
  'grass-carp': {
    length: 1.52,
    body: [
      { s: 0, ry: 0.018, rz: 0.02 },
      { s: 0.045, ry: 0.09, rz: 0.082 },
      { s: 0.13, ry: 0.16, rz: 0.125 },
      { s: 0.29, ry: 0.23, rz: 0.17 },
      { s: 0.49, ry: 0.28, rz: 0.195 },
      { s: 0.65, ry: 0.255, rz: 0.18 },
      { s: 0.81, ry: 0.17, rz: 0.12 },
      { s: 0.95, ry: 0.067, rz: 0.05 },
      { s: 1, ry: 0.008, rz: 0.009 },
    ],
    dorsal: { start: 0.29, end: 0.67, height: [0, 0.04, 0.12, 0.095, 0.052, 0.012, 0] },
    anal: { start: 0.67, end: 0.9, height: [0, 0.026, 0.068, 0.04, 0] },
    caudalSpread: 0.215,
    caudalExtension: 0.27,
    forkDepth: 0.5,
    eyeS: 0.105,
    eyeHeight: 0.2,
    scaleRows: 14,
    scaleColumns: 39,
    roughness: 0.66,
    palette: { back: '#526249', flank: '#a1a47e', belly: '#d3ceb2', fin: '#7e8869', finRay: '#c2bd98', gill: '#626d53', eyeRim: '#a6976a' },
  },
  'silver-carp': {
    length: 1.47,
    body: [
      { s: 0, ry: 0.012, rz: 0.012 },
      { s: 0.045, ry: 0.072, rz: 0.06 },
      { s: 0.13, ry: 0.17, rz: 0.105 },
      { s: 0.28, ry: 0.27, rz: 0.16 },
      { s: 0.45, ry: 0.325, rz: 0.185 },
      { s: 0.62, ry: 0.3, rz: 0.17 },
      { s: 0.79, ry: 0.205, rz: 0.12 },
      { s: 0.94, ry: 0.07, rz: 0.05 },
      { s: 1, ry: 0.008, rz: 0.009 },
    ],
    dorsal: { start: 0.32, end: 0.62, height: [0, 0.025, 0.075, 0.058, 0.03, 0.006, 0] },
    anal: { start: 0.68, end: 0.9, height: [0, 0.03, 0.075, 0.045, 0] },
    caudalSpread: 0.215,
    caudalExtension: 0.27,
    forkDepth: 0.52,
    eyeS: 0.095,
    eyeHeight: -0.12,
    scaleRows: 13,
    scaleColumns: 34,
    roughness: 0.48,
    palette: { back: '#586965', flank: '#bfc9c8', belly: '#e8e8df', fin: '#879894', finRay: '#d5d9d3', gill: '#687672', eyeRim: '#9a9d8a' },
  },
  'bighead-carp': {
    length: 1.46,
    body: [
      { s: 0, ry: 0.022, rz: 0.025 },
      { s: 0.045, ry: 0.13, rz: 0.115 },
      { s: 0.13, ry: 0.225, rz: 0.165 },
      { s: 0.28, ry: 0.3, rz: 0.19 },
      { s: 0.45, ry: 0.32, rz: 0.185 },
      { s: 0.62, ry: 0.285, rz: 0.165 },
      { s: 0.79, ry: 0.19, rz: 0.12 },
      { s: 0.94, ry: 0.07, rz: 0.05 },
      { s: 1, ry: 0.008, rz: 0.009 },
    ],
    dorsal: { start: 0.3, end: 0.65, height: [0, 0.032, 0.095, 0.076, 0.044, 0.009, 0] },
    anal: { start: 0.66, end: 0.9, height: [0, 0.03, 0.075, 0.046, 0] },
    caudalSpread: 0.22,
    caudalExtension: 0.27,
    forkDepth: 0.5,
    eyeS: 0.12,
    eyeHeight: -0.08,
    scaleRows: 13,
    scaleColumns: 35,
    roughness: 0.66,
    palette: { back: '#4c5951', flank: '#92998e', belly: '#d1cec0', fin: '#707c72', finRay: '#b8bdad', gill: '#5b665d', eyeRim: '#a49b7d' },
  },
  'common-carp': {
    length: 1.43,
    body: [
      { s: 0, ry: 0.012, rz: 0.016 },
      { s: 0.045, ry: 0.085, rz: 0.09 },
      { s: 0.13, ry: 0.17, rz: 0.15 },
      { s: 0.29, ry: 0.27, rz: 0.205 },
      { s: 0.47, ry: 0.325, rz: 0.225 },
      { s: 0.64, ry: 0.3, rz: 0.205 },
      { s: 0.81, ry: 0.2, rz: 0.14 },
      { s: 0.95, ry: 0.075, rz: 0.055 },
      { s: 1, ry: 0.008, rz: 0.009 },
    ],
    dorsal: { start: 0.26, end: 0.72, height: [0, 0.065, 0.15, 0.13, 0.085, 0.028, 0] },
    anal: { start: 0.64, end: 0.9, height: [0, 0.038, 0.088, 0.055, 0] },
    caudalSpread: 0.215,
    caudalExtension: 0.25,
    forkDepth: 0.34,
    eyeS: 0.11,
    eyeHeight: 0.16,
    scaleRows: 15,
    scaleColumns: 39,
    roughness: 0.62,
    barbels: true,
    palette: { back: '#5e5034', flank: '#b58a4b', belly: '#e1ce9e', fin: '#886b3e', finRay: '#c5a56a', gill: '#6f5c3b', eyeRim: '#b29a64' },
  },
  'crucian-carp': {
    length: 1.28,
    body: [
      { s: 0, ry: 0.012, rz: 0.014 },
      { s: 0.045, ry: 0.09, rz: 0.09 },
      { s: 0.13, ry: 0.205, rz: 0.16 },
      { s: 0.29, ry: 0.33, rz: 0.22 },
      { s: 0.46, ry: 0.375, rz: 0.245 },
      { s: 0.62, ry: 0.35, rz: 0.225 },
      { s: 0.79, ry: 0.24, rz: 0.16 },
      { s: 0.94, ry: 0.085, rz: 0.06 },
      { s: 1, ry: 0.008, rz: 0.009 },
    ],
    dorsal: { start: 0.25, end: 0.74, height: [0, 0.085, 0.17, 0.14, 0.095, 0.035, 0] },
    anal: { start: 0.62, end: 0.9, height: [0, 0.04, 0.095, 0.06, 0] },
    caudalSpread: 0.22,
    caudalExtension: 0.245,
    forkDepth: 0.28,
    eyeS: 0.11,
    eyeHeight: 0.13,
    scaleRows: 16,
    scaleColumns: 37,
    roughness: 0.6,
    palette: { back: '#62503e', flank: '#bd8950', belly: '#e3d0a9', fin: '#916943', finRay: '#d2a66d', gill: '#755a43', eyeRim: '#b89d6f' },
  },
};

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));
const smoothstep = (edge0: number, edge1: number, value: number) => {
  const t = clamp01((value - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
};

function catmullRom(p0: number, p1: number, p2: number, p3: number, t: number) {
  const t2 = t * t;
  const t3 = t2 * t;
  return 0.5 * (2 * p1 + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 + (-p0 + 3 * p1 - 3 * p2 + p3) * t3);
}

export function sampleBody(anatomy: FishAnatomy, s: number) {
  const position = clamp01(s);
  let index = anatomy.body.findIndex(
    (station, stationIndex) => stationIndex < anatomy.body.length - 1 && position >= station.s && position <= anatomy.body[stationIndex + 1]!.s
  );
  if (index < 0) index = anatomy.body.length - 2;
  const a = anatomy.body[index]!;
  const b = anatomy.body[index + 1]!;
  const t = (position - a.s) / (b.s - a.s);
  const p0 = anatomy.body[Math.max(0, index - 1)]!;
  const p3 = anatomy.body[Math.min(anatomy.body.length - 1, index + 2)]!;
  return {
    ry: Math.max(0.004, catmullRom(p0.ry, a.ry, b.ry, p3.ry, t)),
    rz: Math.max(0.004, catmullRom(p0.rz, a.rz, b.rz, p3.rz, t)),
    y: catmullRom(p0.y ?? 0, a.y ?? 0, b.y ?? 0, p3.y ?? 0, t),
  };
}

export function bodyX(anatomy: FishAnatomy, s: number) {
  return HEAD_X - anatomy.length * s;
}

export function bodySurfacePoint(anatomy: FishAnatomy, s: number, verticalRatio: number, side: -1 | 1, outset = 0) {
  const profile = sampleBody(anatomy, s);
  const yRatio = THREE.MathUtils.clamp(verticalRatio, -0.99, 0.99);
  const zRadius = profile.rz * Math.sqrt(1 - yRatio * yRatio);
  return new THREE.Vector3(bodyX(anatomy, s), profile.y + profile.ry * yRatio, side * (zRadius + outset));
}

export function buildBodyGeometry(anatomy: FishAnatomy) {
  const positions: number[] = [];
  const colors: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];
  const back = new THREE.Color(anatomy.palette.back);
  const flank = new THREE.Color(anatomy.palette.flank);
  const belly = new THREE.Color(anatomy.palette.belly);
  const color = new THREE.Color();

  for (let ix = 0; ix < AXIAL_SEGMENTS; ix += 1) {
    const s = ix / (AXIAL_SEGMENTS - 1);
    const profile = sampleBody(anatomy, s);
    for (let ir = 0; ir < RADIAL_SEGMENTS; ir += 1) {
      const theta = (ir / RADIAL_SEGMENTS) * Math.PI * 2;
      const vertical = Math.cos(theta);
      positions.push(bodyX(anatomy, s), profile.y + profile.ry * vertical, profile.rz * Math.sin(theta));
      uvs.push(s, ir / RADIAL_SEGMENTS);

      const topBlend = smoothstep(0.12, 0.92, vertical) * 0.9;
      const bellyBlend = smoothstep(0.42, 0.96, -vertical) * 0.92;
      color.copy(flank).lerp(back, topBlend).lerp(belly, bellyBlend);
      const headShade = 1 - smoothstep(0.02, 0.13, s) * 0.06;
      color.multiplyScalar(headShade);
      colors.push(color.r, color.g, color.b);
    }
  }

  for (let ix = 0; ix < AXIAL_SEGMENTS - 1; ix += 1) {
    for (let ir = 0; ir < RADIAL_SEGMENTS; ir += 1) {
      const next = (ir + 1) % RADIAL_SEGMENTS;
      const a = ix * RADIAL_SEGMENTS + ir;
      const b = ix * RADIAL_SEGMENTS + next;
      const c = (ix + 1) * RADIAL_SEGMENTS + ir;
      const d = (ix + 1) * RADIAL_SEGMENTS + next;
      indices.push(a, c, b, b, c, d);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setAttribute('fishUv', new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  geometry.computeBoundingSphere();
  return geometry;
}

function buildGeometry(positions: number[], indices: number[], uvs?: number[]) {
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  const fishUvs = uvs ?? positions.flatMap((value, index) => (index % 3 === 0 ? [(value + 1.1) / 2.2, (positions[index + 1]! + 0.5) / 1] : []));
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(fishUvs, 2));
  geometry.setAttribute('fishUv', new THREE.Float32BufferAttribute(fishUvs, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  geometry.computeBoundingSphere();
  return geometry;
}

function sampleFinHeight(profile: FinProfile, t: number) {
  const scaled = clamp01(t) * (profile.height.length - 1);
  const i = Math.min(profile.height.length - 2, Math.floor(scaled));
  const local = scaled - i;
  const p0 = profile.height[Math.max(0, i - 1)]!;
  const p1 = profile.height[i]!;
  const p2 = profile.height[i + 1]!;
  const p3 = profile.height[Math.min(profile.height.length - 1, i + 2)]!;
  return Math.max(0, catmullRom(p0, p1, p2, p3, local));
}

export function buildVerticalFinGeometry(anatomy: FishAnatomy, profile: FinProfile, sign: -1 | 1) {
  const segments = 28;
  const positions: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];
  for (let i = 0; i <= segments; i += 1) {
    const t = i / segments;
    const s = profile.start + (profile.end - profile.start) * t;
    const body = sampleBody(anatomy, s);
    const baseY = body.y + sign * body.ry;
    const peak = sampleFinHeight(profile, t);
    const x = bodyX(anatomy, s);
    const z = 0.004;
    positions.push(x, baseY, z, x, baseY + sign * peak, z);
    uvs.push(t, 0, t, 1);
    if (i < segments) {
      const a = i * 2;
      indices.push(a, a + 2, a + 1, a + 1, a + 2, a + 3);
    }
  }
  return buildGeometry(positions, indices, uvs);
}

export function buildCaudalFinGeometry(anatomy: FishAnatomy) {
  const tailBase = bodyX(anatomy, 1);
  const tipX = tailBase - anatomy.caudalExtension;
  const notchX = tailBase - anatomy.caudalExtension * (1 - anatomy.forkDepth);
  const spread = anatomy.caudalSpread;
  const shape = new THREE.Shape();
  shape.moveTo(tailBase + 0.025, 0.035);
  shape.bezierCurveTo(tailBase - 0.015, spread * 0.56, tipX + 0.04, spread * 0.84, tipX, spread);
  shape.bezierCurveTo(tipX + 0.045, spread * 0.55, notchX - 0.035, spread * 0.08, notchX, 0.008);
  shape.bezierCurveTo(notchX - 0.035, -spread * 0.08, tipX + 0.045, -spread * 0.55, tipX, -spread);
  shape.bezierCurveTo(tipX + 0.04, -spread * 0.84, tailBase - 0.015, -spread * 0.56, tailBase + 0.025, -0.035);
  shape.closePath();
  const geometry = new THREE.ShapeGeometry(shape, 20);
  const position = geometry.getAttribute('position');
  for (let i = 0; i < position.count; i += 1) position.setZ(i, 0.006);
  position.needsUpdate = true;
  geometry.setAttribute('fishUv', geometry.getAttribute('uv').clone());
  geometry.computeVertexNormals();
  return geometry;
}

export function buildPectoralFinGeometry(anatomy: FishAnatomy, side: -1 | 1) {
  const rootFront = bodySurfacePoint(anatomy, 0.16, -0.08, side, 0.006);
  const rootBack = bodySurfacePoint(anatomy, 0.23, -0.36, side, 0.008);
  const tip = bodySurfacePoint(anatomy, 0.31, -0.78, side, 0.18);
  const trailing = bodySurfacePoint(anatomy, 0.25, -0.82, side, 0.12);
  const center = rootFront.clone().add(rootBack).add(tip).add(trailing).multiplyScalar(0.25);
  const vertices = [center, rootFront, rootBack, trailing, tip];
  const positions = vertices.flatMap(vertex => [vertex.x, vertex.y, vertex.z]);
  return buildGeometry(positions, [0, 1, 2, 0, 2, 3, 0, 3, 4, 0, 4, 1]);
}

export function buildPelvicFinGeometry(anatomy: FishAnatomy, side: -1 | 1) {
  const rootFront = bodySurfacePoint(anatomy, 0.53, -0.62, side, 0.004);
  const rootBack = bodySurfacePoint(anatomy, 0.59, -0.68, side, 0.004);
  const tip = bodySurfacePoint(anatomy, 0.64, -0.92, side, 0.11);
  const center = rootFront
    .clone()
    .add(rootBack)
    .add(tip)
    .multiplyScalar(1 / 3);
  const vertices = [center, rootFront, rootBack, tip];
  const positions = vertices.flatMap(vertex => [vertex.x, vertex.y, vertex.z]);
  return buildGeometry(positions, [0, 1, 2, 0, 2, 3, 0, 3, 1]);
}

export function buildFinRaysGeometry(anatomy: FishAnatomy) {
  const positions: number[] = [];
  const append = (from: THREE.Vector3, to: THREE.Vector3) => positions.push(from.x, from.y, from.z, to.x, to.y, to.z);

  for (let i = 1; i <= 12; i += 1) {
    const t = i / 13;
    const s = anatomy.dorsal.start + (anatomy.dorsal.end - anatomy.dorsal.start) * t;
    const body = sampleBody(anatomy, s);
    const base = new THREE.Vector3(bodyX(anatomy, s), body.y + body.ry + 0.01, 0.012);
    const tip = base.clone().add(new THREE.Vector3(0, sampleFinHeight(anatomy.dorsal, t), 0));
    append(base, tip);
  }
  for (let i = 1; i <= 7; i += 1) {
    const t = i / 8;
    const s = anatomy.anal.start + (anatomy.anal.end - anatomy.anal.start) * t;
    const body = sampleBody(anatomy, s);
    const base = new THREE.Vector3(bodyX(anatomy, s), body.y - body.ry - 0.01, 0.012);
    const tip = base.clone().add(new THREE.Vector3(0, -sampleFinHeight(anatomy.anal, t), 0));
    append(base, tip);
  }
  for (let i = 1; i <= 5; i += 1) {
    const y = anatomy.caudalSpread * (i / 6);
    append(new THREE.Vector3(bodyX(anatomy, 0.93), y * 0.4, 0.012), new THREE.Vector3(bodyX(anatomy, 1) - anatomy.caudalExtension * 0.94, y, 0.012));
    append(
      new THREE.Vector3(bodyX(anatomy, 0.93), -y * 0.4, 0.012),
      new THREE.Vector3(bodyX(anatomy, 1) - anatomy.caudalExtension * 0.94, -y, 0.012)
    );
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  return geometry;
}
