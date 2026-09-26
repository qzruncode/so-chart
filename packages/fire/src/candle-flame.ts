import * as THREE from 'three';

/**
 * Adapted from prisoner849's MIT-licensed “The Lonely Candle”.
 * https://codepen.io/prisoner849/pen/XPVGLp
 * Retains its displaced sphere and coherent noise animation; the taper and
 * view-dependent emission below model a small, quiet candle rather than a fire.
 */
const vertexShader = /* glsl */ `
  uniform float time;
  uniform vec2 airflow;
  varying float vHeight;
  varying vec3 vViewPosition;

  float random(vec2 st) {
    return fract(sin(dot(st, vec2(12.9898, 78.233))) * 43758.5453123);
  }

  float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }

  void main() {
    vec3 p = position;
    float h = position.y;
    vHeight = h;
    // One smooth tip. All points at a given height move together.
    p.xz *= sqrt(max(0.0, 1.0 - h));
    float breath = noise(vec2(time * 0.85, 0.0)) - 0.5;
    p.y *= 1.0 + breath * 0.045 * h;
    float bend = h * h;
    p.x += airflow.x * bend * 1.15;
    p.z += airflow.y * bend * 0.72;
    p.x += (noise(vec2(time * 0.7, h * 0.65)) - 0.5) * bend * 0.12;
    p.z += (noise(vec2(h * 0.65, time * 0.9 + 8.0)) - 0.5) * bend * 0.08;
    p.xz *= 1.0 + breath * 0.025;
    vec4 viewPosition = modelViewMatrix * vec4(p, 1.0);
    vViewPosition = viewPosition.xyz;
    gl_Position = projectionMatrix * viewPosition;
  }
`;

const fragmentShader = /* glsl */ `
  uniform float time;
  uniform vec3 tint;
  varying float vHeight;
  varying vec3 vViewPosition;

  void main() {
    float h = vHeight;
    // The projected edge fades with the optical path through the flame.
    vec3 n = normalize(cross(dFdx(vViewPosition), dFdy(vViewPosition)));
    float facing = abs(dot(n, normalize(-vViewPosition)));
    float edge = smoothstep(0.0, 0.32, facing);
    float tip = 1.0 - smoothstep(0.94, 1.0, h);
    float yellow = smoothstep(0.08, 0.24, h);
    float innerCone = (1.0 - smoothstep(0.10, 0.32, h)) * smoothstep(0.4, 0.88, facing);
    vec3 hot = vec3(2.8, 1.65, 0.58);
    vec3 warm = mix(tint * 1.6, hot, pow(facing, 0.3));
    vec3 blue = vec3(0.02, 0.22, 1.2);
    vec3 emission = mix(blue, warm, yellow);
    emission *= 1.0 + sin(time * 2.3) * 0.035 + sin(time * 4.7) * 0.025;
    float alpha = mix(0.65, 0.98, yellow) * edge * tip;
    alpha *= smoothstep(0.0, 0.025, h) * (1.0 - innerCone * 0.95);
    gl_FragColor = vec4(emission, alpha);
  }
`;

export type CandleFlameOptions = {
  width: number;
  height: number;
  depth?: number;
  tint?: THREE.Color;
};

export class CandleFlameMesh extends THREE.Mesh<THREE.SphereGeometry, THREE.ShaderMaterial> {
  constructor({ width, height, depth = width, tint = new THREE.Color('#ffb34b') }: CandleFlameOptions) {
    const geometry = new THREE.SphereGeometry(0.5, 64, 96);
    geometry.translate(0, 0.5, 0);
    const material = new THREE.ShaderMaterial({
      uniforms: { time: { value: 0 }, airflow: { value: new THREE.Vector2() }, tint: { value: tint } },
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      side: THREE.FrontSide,
    });
    super(geometry, material);
    // Max diameter of the tapered unit sphere is 4 / (3 * sqrt(3)).
    const diameter = 4 / (3 * Math.sqrt(3));
    this.scale.set(width / diameter, height, depth / diameter);
    this.renderOrder = 3;
    this.frustumCulled = false;
  }

  update(time: number, airflow: THREE.Vector2) {
    this.material.uniforms.time.value = time;
    this.material.uniforms.airflow.value.copy(airflow);
  }

  dispose() {
    this.geometry.dispose();
    this.material.dispose();
  }
}
