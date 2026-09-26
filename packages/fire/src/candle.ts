import * as THREE from 'three';
import { SubsurfaceScatteringShader } from 'three/addons/shaders/SubsurfaceScatteringShader.js';
import type { NormalizedFireOptions } from './types';

/** Lathed wax and curved wick follow prisoner849's “The Lonely Candle”. */
export class Candle extends THREE.Group {
  readonly light?: THREE.PointLight;
  private readonly thickness: THREE.DataTexture;
  private ground?: THREE.Mesh;

  constructor(options: NormalizedFireOptions) {
    super();
    const { candle, fire } = options;
    const r = candle.bodyRadius;
    const h = candle.bodyHeight;
    const poolY = h - r * 0.13;
    const waxProfile = new THREE.Path();
    waxProfile.moveTo(0, 0.008);
    waxProfile.lineTo(r * 0.91, 0.008);
    waxProfile.quadraticCurveTo(r, 0.008, r, r * 0.12);
    waxProfile.lineTo(r, h - r * 0.2);
    waxProfile.bezierCurveTo(r, h + r * 0.02, r * 0.83, h + r * 0.1, r * 0.78, h - r * 0.02);
    waxProfile.bezierCurveTo(r * 0.72, poolY, r * 0.55, poolY - r * 0.015, r * 0.44, poolY - r * 0.015);
    waxProfile.lineTo(0, poolY - r * 0.015);
    const geometry = new THREE.LatheGeometry(waxProfile.getPoints(16), 128);
    const positions = geometry.attributes.position;
    const uv = geometry.attributes.uv;
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const z = positions.getZ(i);
      const y = positions.getY(i);
      const angle = Math.atan2(z, x);
      const upper = THREE.MathUtils.smoothstep(y, h - r * 0.25, h);
      const edge = THREE.MathUtils.smoothstep(Math.hypot(x, z), r * 0.5, r * 0.82);
      const melt = (Math.sin(angle * 3 + 0.4) * 0.045 + Math.sin(angle * 7 - 1.2) * 0.018) * r;
      const uneven = 1 + (Math.sin(angle * 5 + y * 8) + Math.sin(angle * 11 - y * 6)) * 0.002;
      positions.setXYZ(i, x * uneven, y + upper * edge * melt, z * uneven);
      uv.setY(i, THREE.MathUtils.clamp(y / h, 0, 1));
    }
    geometry.computeVertexNormals();

    // Three.js' supplied scattering shader lights the thin, translucent rim.
    const thicknessData = new Uint8Array(128 * 4);
    for (let i = 0; i < 128; i++) {
      const value = Math.round(255 * (0.025 + 0.975 * Math.pow(i / 127, 8)));
      thicknessData.set([value, value, value, 255], i * 4);
    }
    this.thickness = new THREE.DataTexture(thicknessData, 1, 128);
    this.thickness.magFilter = THREE.LinearFilter;
    this.thickness.minFilter = THREE.LinearFilter;
    this.thickness.needsUpdate = true;
    const uniforms = THREE.UniformsUtils.clone(SubsurfaceScatteringShader.uniforms);
    uniforms.diffuse.value = new THREE.Color(candle.bodyColor);
    uniforms.specular.value = new THREE.Color(0x16120b);
    uniforms.shininess.value = 35;
    uniforms.thicknessMap.value = this.thickness;
    uniforms.thicknessColor.value = new THREE.Color('#ffb55e');
    uniforms.thicknessDistortion.value = 0.4;
    uniforms.thicknessAmbient.value = 0.1;
    uniforms.thicknessAttenuation.value = 0.45;
    uniforms.thicknessPower.value = 2;
    uniforms.thicknessScale.value = 3;
    const body = new THREE.Mesh(
      geometry,
      new THREE.ShaderMaterial({
        uniforms,
        vertexShader: SubsurfaceScatteringShader.vertexShader,
        fragmentShader: SubsurfaceScatteringShader.fragmentShader,
        lights: true,
        fog: true,
      })
    );
    body.castShadow = options.shadow.enabled;
    this.add(body);

    const pool = new THREE.Mesh(
      new THREE.CircleGeometry(r * 0.61, 96),
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(candle.bodyColor).multiplyScalar(0.85),
        roughness: 0.12,
        metalness: 0,
        clearcoat: 1,
        clearcoatRoughness: 0.08,
      })
    );
    pool.rotation.x = -Math.PI / 2;
    pool.position.y = poolY;
    this.add(pool);

    const wickCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, poolY, 0),
      new THREE.Vector3(0, poolY + candle.wickHeight * 0.52, 0),
      new THREE.Vector3(candle.wickHeight * 0.2, poolY + candle.wickHeight * 0.88, 0),
      new THREE.Vector3(candle.wickHeight * 0.36, poolY + candle.wickHeight, candle.wickHeight * 0.08),
    ]);
    const wick = new THREE.Mesh(
      new THREE.TubeGeometry(wickCurve, 24, candle.wickRadius, 10, false),
      new THREE.MeshStandardMaterial({ color: candle.wickColor, roughness: 1 })
    );
    wick.castShadow = options.shadow.enabled;
    this.add(wick);
    const ember = new THREE.Mesh(
      new THREE.SphereGeometry(candle.wickRadius * 1.04, 12, 8),
      new THREE.MeshBasicMaterial({ color: new THREE.Color(2.5, 0.22, 0.015) })
    );
    ember.position.copy(wickCurve.getPoint(0.96));
    this.add(ember);

    // Quiet room fill leaves the lower wax darker than the illuminated rim.
    if (options.lighting.hemisphere.show) {
      this.add(
        new THREE.HemisphereLight(
          options.lighting.hemisphere.skyColor,
          options.lighting.hemisphere.groundColor,
          options.lighting.hemisphere.intensity
        )
      );
    }
    if (options.lighting.fill.show) {
      const fill = new THREE.DirectionalLight(options.lighting.fill.color, options.lighting.fill.intensity);
      fill.position.set(...options.lighting.fill.position);
      fill.castShadow = options.shadow.enabled && options.lighting.fill.castShadow;
      fill.shadow.mapSize.set(options.shadow.mapSize, options.shadow.mapSize);
      fill.shadow.camera.left = -2;
      fill.shadow.camera.right = 2;
      fill.shadow.camera.top = 2;
      fill.shadow.camera.bottom = -2;
      fill.shadow.camera.near = 0.1;
      fill.shadow.camera.far = 12;
      fill.shadow.bias = options.shadow.bias;
      fill.shadow.normalBias = options.shadow.normalBias;
      fill.shadow.intensity = options.shadow.intensity;
      fill.shadow.radius = options.shadow.radius;
      fill.shadow.autoUpdate = false;
      fill.shadow.needsUpdate = fill.castShadow;
      fill.target.position.set(0, 0, 0);
      fill.shadow.camera.updateProjectionMatrix();
      this.add(fill.target, fill);
    }
    if (options.ground.show) {
      this.ground = new THREE.Mesh(
        new THREE.PlaneGeometry(options.ground.size, options.ground.size),
        new THREE.MeshStandardMaterial({ color: options.ground.color, roughness: options.ground.roughness })
      );
      this.ground.rotation.x = -Math.PI / 2;
      this.ground.receiveShadow = options.shadow.enabled && options.ground.receiveShadow;
      this.add(this.ground);
    }
    if (candle.light.show) {
      this.light = new THREE.PointLight(candle.light.color, candle.light.intensity, candle.light.distance, candle.light.decay);
      this.light.position.set(0, poolY + candle.wickHeight * 0.3 + fire.height * 0.5, 0);
      this.light.castShadow = options.shadow.enabled && candle.light.castShadow;
      this.light.shadow.mapSize.set(options.shadow.mapSize, options.shadow.mapSize);
      this.light.shadow.camera.near = 0.1;
      this.light.shadow.camera.far = candle.light.distance;
      this.light.shadow.bias = options.shadow.bias;
      this.light.shadow.normalBias = options.shadow.normalBias;
      this.light.shadow.intensity = options.shadow.intensity;
      this.light.shadow.radius = options.shadow.radius;
      this.light.shadow.autoUpdate = false;
      this.light.shadow.needsUpdate = this.light.castShadow;
      this.light.shadow.camera.updateProjectionMatrix();
      this.add(this.light);
    }
    this.moveTo(candle.position);
  }

  moveTo(position: readonly [number, number, number]) {
    this.position.set(...position);
    this.ground?.position.set(-position[0], -position[1], -position[2]);
  }

  dispose() {
    this.thickness.dispose();
    this.traverse(object => {
      if (object instanceof THREE.DirectionalLight || object instanceof THREE.PointLight) object.dispose();
      if (object instanceof THREE.Mesh) {
        object.geometry.dispose();
        const materials = Array.isArray(object.material) ? object.material : [object.material];
        materials.forEach(material => material.dispose());
      }
    });
  }
}
