import {
  Color,
  Matrix4,
  Mesh,
  RepeatWrapping,
  ShaderMaterial,
  Timer,
  UniformsLib,
  UniformsUtils,
  Vector2,
  Vector3,
  Vector4,
  type Camera,
  type BufferGeometry,
  type Scene,
  type Texture,
  type WebGLRenderer,
} from 'three';
import { Reflector } from 'three/addons/objects/Reflector.js';
import { Refractor } from 'three/addons/objects/Refractor.js';

import type { NormalizedWaterShapeOptions } from './types.js';
import {
  GERSTNER_AMPLITUDE_MULTIPLIER,
  GERSTNER_AMPLITUDE_NORMALIZATION,
  GERSTNER_BASE_DIRECTION,
  GERSTNER_DIRECTION_SPREAD,
  GERSTNER_FREQUENCY_MULTIPLIER,
  GERSTNER_STEEPNESS,
  GERSTNER_WAVE_COUNT,
  getBaseWavelength,
} from './waves.js';

interface WaterShaderDefinition {
  name: string;
  uniforms: Record<string, { value: unknown }>;
  vertexShader: string;
  fragmentShader: string;
}

export interface WaterSurfaceOptions {
  color: NormalizedWaterShapeOptions['color'];
  textureWidth: number;
  textureHeight: number;
  clipBias: number;
  flowDirection: NormalizedWaterShapeOptions['flowDirection'];
  flowSpeed: number;
  reflectivity: number;
  transmission?: number;
  sunDirection: NormalizedWaterShapeOptions['sunDirection'];
  sunColor: NormalizedWaterShapeOptions['sunColor'];
  sunIntensity: number;
  scale: number;
  width: number;
  depth: number;
  waveHeight: number;
  waveSpeed: number;
  multisample: number;
  normalMap0: Texture;
  normalMap1: Texture;
  flowMap?: Texture;
}

const normalMapSetters = new WeakMap<WaterSurface, (normalMap0: Texture, normalMap1: Texture) => void>();

export function replaceWaterSurfaceNormalMaps(surface: WaterSurface, normalMap0: Texture, normalMap1: Texture): void {
  normalMapSetters.get(surface)?.(normalMap0, normalMap1);
}

/**
 * Water2 adapted from the official Three.js example.
 *
 * The official example keeps its Reflector and Refractor instances private
 * and does not expose a dispose method. This package keeps those instances
 * explicit so the chart can release their render targets with the rest of
 * the scene lifecycle.
 */
export class WaterSurface extends Mesh<BufferGeometry, ShaderMaterial> {
  readonly isWaterSurface = true;

  private readonly reflector: Reflector;
  private readonly refractor: Refractor;
  private ownedTextures: Texture[];
  private readonly timer = new Timer();
  private readonly textureMatrix = new Matrix4();
  // Geometry is already horizontal; Water2 proxies derive their plane from local +Z.
  private readonly surfacePlaneRotation = new Matrix4().makeRotationX(-Math.PI / 2);
  private animationEnabled = true;
  get isDisposed(): boolean {
    return this.disposed;
  }
  setAnimationEnabled(enabled: boolean): void {
    if (this.disposed) return;
    this.timer.update();
    this.animationEnabled = enabled;
    if (!enabled) this.clearRipples();
  }
  private readonly flowSpeed: number;
  private disposed = false;
  private rippleIndex = 0;

  constructor(geometry: BufferGeometry, options: WaterSurfaceOptions) {
    const normalMap0 = cloneNormalMap(options.normalMap0);
    const normalMap1 = cloneNormalMap(options.normalMap1);

    const reflector = new Reflector(geometry, {
      clipBias: options.clipBias,
      textureWidth: options.textureWidth,
      textureHeight: options.textureHeight,
      multisample: options.multisample,
    });
    const refractor = new Refractor(geometry, {
      clipBias: options.clipBias,
      textureWidth: options.textureWidth,
      textureHeight: options.textureHeight,
      multisample: options.multisample,
    });
    const material = new ShaderMaterial({
      name: WATER_SHADER.name,
      uniforms: UniformsUtils.merge([UniformsLib.fog, WATER_SHADER.uniforms]),
      vertexShader: WATER_SHADER.vertexShader,
      fragmentShader: WATER_SHADER.fragmentShader,
      transparent: true,
      fog: true,
    });

    super(geometry, material);

    this.reflector = reflector;
    this.refractor = refractor;
    this.ownedTextures = [normalMap0, normalMap1];
    this.flowSpeed = options.flowSpeed;
    this.frustumCulled = false;

    reflector.matrixAutoUpdate = false;
    refractor.matrixAutoUpdate = false;

    material.uniforms.tReflectionMap.value = reflector.getRenderTarget().texture;
    material.uniforms.tRefractionMap.value = refractor.getRenderTarget().texture;
    material.uniforms.tNormalMap0.value = normalMap0;
    material.uniforms.tNormalMap1.value = normalMap1;
    if (options.flowMap) {
      material.defines.USE_FLOWMAP = '';
      material.uniforms.tFlowMap = { value: options.flowMap };
    } else {
      material.uniforms.flowDirection = {
        value: new Vector2(options.flowDirection[0], options.flowDirection[1]),
      };
    }
    material.uniforms.ripples.value = Array.from({ length: 8 }, () => new Vector4(0, 0, -100, 0));
    material.uniforms.color.value = new Color(options.color);
    material.uniforms.reflectivity.value = options.reflectivity;
    material.uniforms.transmission.value = options.transmission ?? 0.12;
    material.uniforms.sunDirection.value.set(...options.sunDirection);
    material.uniforms.sunColor.value = new Color(options.sunColor);
    material.uniforms.sunIntensity.value = options.sunIntensity;
    material.uniforms.textureMatrix.value = this.textureMatrix;
    const textureScale = options.scale * Math.max(1, Math.min(options.width, options.depth) / 100);
    material.uniforms.config.value.set(0, 0.15, 0.15, textureScale);
    material.uniforms.waveHeight.value = options.waveHeight;
    material.uniforms.waveSpeed.value = options.waveSpeed;
    material.uniforms.waveBaseWavelength.value = getBaseWavelength(options.width, options.depth);

    this.onBeforeRender = (renderer, scene, camera) => {
      if (this.disposed) {
        return;
      }

      this.timer.update();
      this.updateTextureMatrix(camera);
      const delta = this.animationEnabled ? this.timer.getDelta() : 0;
      this.updateFlow(delta);
      material.uniforms.waveTime.value += delta;

      this.visible = false;
      try {
        reflector.matrixWorld.copy(this.matrixWorld).multiply(this.surfacePlaneRotation);
        refractor.matrixWorld.copy(this.matrixWorld).multiply(this.surfacePlaneRotation);
        callBeforeRender(reflector, renderer, scene, camera);
        callBeforeRender(refractor, renderer, scene, camera);
      } finally {
        this.visible = true;
      }
    };

    normalMapSetters.set(this, (nextNormalMap0, nextNormalMap1) => {
      this.replaceNormalMaps(nextNormalMap0, nextNormalMap1);
    });
  }

  /** Add a local X/Z impulse. The eight uniform slots are reused; no geometry is rebuilt. */
  addRipple(x: number, z: number, strength = 0.03, radius = 1.4, decay = 2.2): void {
    if (this.disposed || !this.animationEnabled || ![x, z, strength, radius, decay].every(Number.isFinite)) return;
    const uniforms = this.material.uniforms;
    this.timer.update();
    uniforms.waveTime.value += this.timer.getDelta();
    const amplitude = Math.min(0.08, Math.max(0, strength));
    const slots = uniforms.ripples.value as Vector4[];
    slots[this.rippleIndex].set(x, z, uniforms.waveTime.value, amplitude);
    this.rippleIndex = (this.rippleIndex + 1) % slots.length;
    uniforms.rippleRadius.value = Math.min(5, Math.max(0.3, radius));
    uniforms.rippleDecay.value = Math.min(6, Math.max(0.4, decay));
    uniforms.rippleHeightLimit.value = amplitude;
  }

  clearRipples(): void {
    (this.material.uniforms.ripples.value as Vector4[]).forEach(slot => slot.set(0, 0, -100, 0));
    this.rippleIndex = 0;
  }

  hasActiveRipples(): boolean {
    const uniforms = this.material.uniforms;
    return (uniforms.ripples.value as Vector4[]).some(slot => slot.w > 0 && uniforms.waveTime.value - slot.z < uniforms.rippleDecay.value);
  }

  dispose(): void {
    if (this.disposed) {
      return;
    }

    this.clearRipples();
    this.disposed = true;
    normalMapSetters.delete(this);
    this.onBeforeRender = () => undefined;
    this.timer.dispose();
    this.reflector.dispose();
    this.refractor.dispose();
    this.geometry.dispose();
    this.material.dispose();
    this.ownedTextures.forEach(texture => texture.dispose());
  }

  private replaceNormalMaps(normalMap0: Texture, normalMap1: Texture): void {
    if (this.disposed) {
      return;
    }

    const nextNormalMap0 = cloneNormalMap(normalMap0);
    const nextNormalMap1 = cloneNormalMap(normalMap1);
    this.material.uniforms.tNormalMap0.value = nextNormalMap0;
    this.material.uniforms.tNormalMap1.value = nextNormalMap1;
    this.ownedTextures.forEach(texture => texture.dispose());
    this.ownedTextures = [nextNormalMap0, nextNormalMap1];
  }

  private updateTextureMatrix(camera: { projectionMatrix: Matrix4; matrixWorldInverse: Matrix4 }): void {
    const uniforms = this.material.uniforms;
    this.textureMatrix.set(0.5, 0.0, 0.0, 0.5, 0.0, 0.5, 0.0, 0.5, 0.0, 0.0, 0.5, 0.5, 0.0, 0.0, 0.0, 1.0);
    this.textureMatrix.multiply(camera.projectionMatrix);
    this.textureMatrix.multiply(camera.matrixWorldInverse);
    this.textureMatrix.multiply(this.matrixWorld);
    uniforms.textureMatrix.value.copy(this.textureMatrix);
  }

  private updateFlow(delta: number): void {
    const config = this.material.uniforms.config.value as Vector4;

    config.x += this.flowSpeed * delta;
    config.y = config.x + config.z;

    if (config.x >= 0.3) {
      config.x = 0;
      config.y = config.z;
    } else if (config.y >= 0.3) {
      config.y -= 0.3;
    }
  }
}

function cloneNormalMap(texture: Texture): Texture {
  const clone = texture.clone();
  clone.wrapS = RepeatWrapping;
  clone.wrapT = RepeatWrapping;
  clone.needsUpdate = true;
  return clone;
}

function callBeforeRender(object: Reflector | Refractor, renderer: WebGLRenderer, scene: Scene, camera: Camera): void {
  // The official Water2 implementation calls these internal callbacks with
  // only renderer, scene and camera. Their Mesh callback type also exposes
  // geometry/material/group arguments for the public renderer hook.
  (object.onBeforeRender as unknown as (renderer: WebGLRenderer, scene: Scene, camera: Camera) => void)(renderer, scene, camera);
}

const WATER_SHADER: WaterShaderDefinition = {
  name: 'Water2',
  uniforms: {
    color: { value: null },
    sunColor: { value: new Color(0xfff4d0) },
    sunDirection: { value: new Vector3(0.12, 0.58, -0.8) },
    sunIntensity: { value: 1.5 },
    reflectivity: { value: 0.02 },
    transmission: { value: 0.12 },
    tReflectionMap: { value: null },
    tRefractionMap: { value: null },
    tNormalMap0: { value: null },
    tNormalMap1: { value: null },
    tFlowMap: { value: null },
    textureMatrix: { value: new Matrix4() },
    config: { value: new Vector4() },
    waveTime: { value: 0 },
    waveHeight: { value: 1 },
    waveSpeed: { value: 1 },
    waveBaseWavelength: { value: 1 },
    ripples: { value: Array.from({ length: 8 }, () => new Vector4(0, 0, -100, 0)) },
    rippleRadius: { value: 1.4 },
    rippleDecay: { value: 2.2 },
    rippleHeightLimit: { value: 0.03 },
  },
  vertexShader: /* glsl */ `
    #include <common>
    #include <fog_pars_vertex>
    #include <logdepthbuf_pars_vertex>

    #define MAX_GERSTNER_WAVES ${GERSTNER_WAVE_COUNT}

    uniform mat4 textureMatrix;
    uniform float waveTime;
    uniform float waveHeight;
    uniform float waveSpeed;
    uniform float waveBaseWavelength;
    uniform vec4 ripples[8];
    uniform float rippleRadius;
    uniform float rippleDecay;
    uniform float rippleHeightLimit;

    varying vec4 vCoord;
    varying vec2 vUv;
    varying vec3 vToEye;
    varying vec3 vTangentX;
    varying vec3 vTangentZ;
    varying vec3 vWaveNormal;
    varying float vWaveHeight;
    varying float vWaveFold;
    varying float vRippleCrest;

    float hash21(vec2 p) {
      p = fract(p * vec2(123.34, 456.21));
      p += dot(p, p + 45.32);
      return fract(p.x * p.y);
    }

    void main() {
      vUv = uv;
      vec3 displacedPosition = position;
      vec3 tangentX = vec3( 1.0, 0.0, 0.0 );
      vec3 tangentZ = vec3( 0.0, 0.0, 1.0 );
      vec2 origin = position.xz;
      vec2 baseDirection = normalize(vec2(${GERSTNER_BASE_DIRECTION[0]}, ${GERSTNER_BASE_DIRECTION[1]}));
      float baseAngle = atan(baseDirection.y, baseDirection.x);
      float waveNumber = 2.0 * PI / max(waveBaseWavelength, 0.0001);
      float amplitude = waveHeight * ${GERSTNER_AMPLITUDE_NORMALIZATION.toFixed(8)};
      float jacobianXX = 1.0;
      float jacobianZZ = 1.0;
      float jacobianXZ = 0.0;

      for (int i = 0; i < MAX_GERSTNER_WAVES; i++) {
        float waveIndex = float(i);
        float directionSeed = hash21(vec2(waveIndex, 1.7));
        float phaseSeed = hash21(vec2(waveIndex, 9.1));
        float angle = baseAngle + (directionSeed * 2.0 - 1.0) * ${GERSTNER_DIRECTION_SPREAD};
        vec2 direction = vec2(cos(angle), sin(angle));
        float steepness = ${GERSTNER_STEEPNESS} / max(
          waveNumber * amplitude * float(MAX_GERSTNER_WAVES),
          0.001
        );
        float phase = waveNumber * dot(direction, origin)
          - sqrt(9.81 * waveNumber) * waveTime * waveSpeed
          + phaseSeed * 6.2831853;
        float sine = sin(phase);
        float cosine = cos(phase);
        float waveSlope = waveNumber * amplitude;
        float horizontalAmplitude = steepness * amplitude;

        displacedPosition += vec3(
          direction.x * horizontalAmplitude * cosine,
          amplitude * sine,
          direction.y * horizontalAmplitude * cosine
        );

        float horizontalSlope = horizontalAmplitude * waveNumber * sine;
        float verticalSlope = waveSlope * cosine;
        tangentX += vec3(
          -horizontalSlope * direction.x * direction.x,
          verticalSlope * direction.x,
          -horizontalSlope * direction.y * direction.x
        );
        tangentZ += vec3(
          -horizontalSlope * direction.x * direction.y,
          verticalSlope * direction.y,
          -horizontalSlope * direction.y * direction.y
        );
        jacobianXX -= steepness * direction.x * direction.x * waveSlope * sine;
        jacobianZZ -= steepness * direction.y * direction.y * waveSlope * sine;
        jacobianXZ -= steepness * direction.x * direction.y * waveSlope * sine;

        waveNumber *= ${GERSTNER_FREQUENCY_MULTIPLIER};
        amplitude *= ${GERSTNER_AMPLITUDE_MULTIPLIER};
      }

      float rippleHeight = 0.0;
      vec2 rippleGradient = vec2(0.0);
      for (int i = 0; i < 8; i++) {
        vec4 impulse = ripples[i];
        float age = waveTime - impulse.z;
        if (impulse.w > 0.0 && age >= 0.0 && age < rippleDecay) {
          vec2 offset = origin - impulse.xy;
          float distance = length(offset);
          float remaining = 1.0 - age / rippleDecay;
          float fade = remaining * remaining * smoothstep(0.0, 0.12, age);
          float envelope = exp(-distance * distance / (2.0 * rippleRadius * rippleRadius));
          float phase = distance * 10.0 - age * 9.0;
          float amplitude = impulse.w * fade * envelope;
          rippleHeight += amplitude * sin(phase);
          float slope = amplitude * (10.0 * cos(phase) - distance / (rippleRadius * rippleRadius) * sin(phase));
          rippleGradient += offset / max(distance, 0.001) * slope;
        }
      }
      // A smooth height budget keeps repeated input from stacking unbounded waves.
      float compression = 1.0 / (1.0 + abs(rippleHeight) / max(rippleHeightLimit, 0.0001));
      displacedPosition.y += rippleHeight * compression;
      tangentX.y += rippleGradient.x * compression * compression;
      tangentZ.y += rippleGradient.y * compression * compression;
      vRippleCrest = max(0.0, rippleHeight * compression / max(rippleHeightLimit, 0.0001));

      vCoord = textureMatrix * vec4( displacedPosition, 1.0 );

      vec4 worldPosition = modelMatrix * vec4( displacedPosition, 1.0 );
      vToEye = cameraPosition - worldPosition.xyz;
      vTangentX = normalize( mat3( modelMatrix ) * tangentX );
      vTangentZ = normalize( mat3( modelMatrix ) * tangentZ );
      vWaveNormal = normalize( cross( vTangentZ, vTangentX ) );
      vWaveHeight = displacedPosition.y - position.y;
      vWaveFold = jacobianXX * jacobianZZ - jacobianXZ * jacobianXZ;

      vec4 mvPosition = viewMatrix * worldPosition;
      gl_Position = projectionMatrix * mvPosition;

      #include <logdepthbuf_vertex>
      #include <fog_vertex>
    }
  `,
  fragmentShader: /* glsl */ `
    uniform sampler2D tReflectionMap;
    uniform sampler2D tRefractionMap;
    uniform sampler2D tNormalMap0;
    uniform sampler2D tNormalMap1;
    #ifdef USE_FLOWMAP
      uniform sampler2D tFlowMap;
    #else
      uniform vec2 flowDirection;
    #endif

    uniform float reflectivity;
    uniform float transmission;
    uniform vec3 color;
    uniform vec3 sunColor;
    uniform vec3 sunDirection;
    uniform float sunIntensity;
    uniform float waveHeight;
    uniform vec4 config;

    varying vec4 vCoord;
    varying vec2 vUv;
    varying vec3 vToEye;
    varying vec3 vTangentX;
    varying vec3 vTangentZ;
    varying vec3 vWaveNormal;
    varying float vWaveHeight;
    varying float vWaveFold;
    varying float vRippleCrest;

    #include <common>
    #include <fog_pars_fragment>
    #include <logdepthbuf_pars_fragment>

    float dggx(float normalHalf, float roughness) {
      float roughnessSquared = roughness * roughness;
      float denominator = normalHalf * normalHalf * (roughnessSquared - 1.0) + 1.0;
      return roughnessSquared / (PI * denominator * denominator);
    }

    void main() {
      #include <logdepthbuf_fragment>
      float flowMapOffset0 = config.x;
      float flowMapOffset1 = config.y;
      float halfCycle = config.z;
      float scale = config.w;

      vec3 toEye = normalize( vToEye );

      vec2 flow;
      #ifdef USE_FLOWMAP
        flow = texture2D( tFlowMap, vUv ).rg * 2.0 - 1.0;
      #else
        flow = flowDirection;
      #endif
      flow.x *= - 1.0;

      vec4 normalColor0 = texture2D(
        tNormalMap0,
        ( vUv * scale ) + flow * flowMapOffset0
      );
      vec4 normalColor1 = texture2D(
        tNormalMap1,
        ( vUv * scale ) + flow * flowMapOffset1
      );
      float flowLerp = abs( halfCycle - flowMapOffset0 ) / halfCycle;
      vec4 normalColor = mix( normalColor0, normalColor1, flowLerp );
      vec3 normal = normalize( vec3(
        normalColor.r * 2.0 - 1.0,
        normalColor.b,
        normalColor.g * 2.0 - 1.0
      ) );
      vec3 tangent = normalize( vTangentX );
      vec3 waveNormal = normalize( vWaveNormal );
      vec3 bitangent = normalize( cross( tangent, waveNormal ) );
      vec3 microNormal = normalize( vec3( normal.x * 0.2, normal.y, normal.z * 0.2 ) );
      vec3 surfaceNormal = normalize(
        tangent * microNormal.x + waveNormal * microNormal.y + bitangent * microNormal.z
      );
      vec3 lightDirection = normalize( sunDirection );

      // Keep Water2's single Fresnel blend and subtle Water.js-style sun glints.
      float theta = max( dot( toEye, surfaceNormal ), 0.0 );
      float reflectance = reflectivity + ( 1.0 - reflectivity ) * pow( 1.0 - theta, 5.0 );
      vec3 halfDirection = normalize(toEye + lightDirection);
      float normalHalf = max(dot(surfaceNormal, halfDirection), 0.0);
      float normalLight = max(dot(waveNormal, lightDirection), 0.0);
      float specularRoughness = 0.24;
      float sunSpecular = dggx(normalHalf, specularRoughness * specularRoughness)
        * reflectivity
        * normalLight
        * sunIntensity
        * 0.6;

      vec3 coord = vCoord.xyz / vCoord.w;
      vec2 uv = coord.xy + coord.z * surfaceNormal.xz * 0.05;
      vec4 reflectColor = texture2D(
        tReflectionMap,
        vec2( 1.0 - uv.x, uv.y )
      );
      vec4 refractColor = texture2D( tRefractionMap, uv );
      vec3 transmittedColor = color * mix(vec3(0.68, 0.82, 0.92), refractColor.rgb, transmission);
      vec3 surfaceColor = mix(transmittedColor, reflectColor.rgb, reflectance);
      surfaceColor += sunColor * sunSpecular;

      float relativeCrest = vWaveHeight / max(waveHeight, 0.001);
      float crestFoam = smoothstep(0.35, 0.9, relativeCrest)
        * smoothstep(0.25, 0.8, normalColor.r * 0.65 + normalColor.g * 0.35)
        * 0.16;
      float foldFoam = (1.0 - smoothstep(-0.04, 0.12, vWaveFold)) * 0.55;
      float foam = max(max(crestFoam, foldFoam), vRippleCrest * 0.08);
      surfaceColor = mix(surfaceColor, vec3(0.82, 0.9, 0.91), foam);
      gl_FragColor = vec4( surfaceColor, 1.0 );

      #include <tonemapping_fragment>
      #include <colorspace_fragment>
      #include <fog_fragment>
    }
  `,
};
