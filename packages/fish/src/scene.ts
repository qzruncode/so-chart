import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import * as SkeletonUtils from 'three/addons/utils/SkeletonUtils.js';
import bigheadCarpModelUrl from './assets/current-preview/bighead-carp.glb?url&no-inline';
import blackCarpModelUrl from './assets/current-preview/black-carp.glb?url&no-inline';
import commonCarpModelUrl from './assets/current-preview/common-carp.glb?url&no-inline';
import crucianCarpModelUrl from './assets/current-preview/crucian-carp.glb?url&no-inline';
import grassCarpModelUrl from './assets/current-preview/grass-carp.glb?url&no-inline';
import silverCarpModelUrl from './assets/current-preview/silver-carp.glb?url&no-inline';
import type { FishType, NormalizedFishOptions } from './types.js';
import { disposeObject3D } from './dispose.js';

type FishModelAsset = {
  url: string;
  meshName: string;
};

type AnimatedFish = {
  root: THREE.Group;
  modelRoot: THREE.Object3D;
  mixer: THREE.AnimationMixer;
  clipDuration: number;
  anchor: THREE.Vector3;
  baseRotation: THREE.Euler;
  speed: number;
  amplitude: number;
  phase: number;
  restBones?: Array<{ bone: THREE.Bone; quaternion: THREE.Quaternion }>;
};

export type FishScene = { group: THREE.Group; animatedFish: AnimatedFish[] };

const FISH_MODEL_ASSETS: Record<FishType, FishModelAsset> = {
  'black-carp': { url: blackCarpModelUrl, meshName: 'black-carp-surface' },
  'grass-carp': { url: grassCarpModelUrl, meshName: 'grass-carp-surface' },
  'silver-carp': { url: silverCarpModelUrl, meshName: 'silver-carp-surface' },
  'bighead-carp': { url: bigheadCarpModelUrl, meshName: 'bighead-carp-surface' },
  'common-carp': { url: commonCarpModelUrl, meshName: 'common-carp-surface' },
  'crucian-carp': { url: crucianCarpModelUrl, meshName: 'crucian-carp-surface' },
};

const loader = new GLTFLoader();

async function loadFishModel(type: FishType, assetBaseUrl?: string) {
  const asset = FISH_MODEL_ASSETS[type];
  const url = assetBaseUrl
    ? new URL(type + '.glb', new URL(assetBaseUrl.endsWith('/') ? assetBaseUrl : assetBaseUrl + '/', globalThis.location?.href)).href
    : asset.url;
  const gltf = await loader.loadAsync(url);
  const surface = gltf.scene.getObjectByName(asset.meshName);
  let containsMesh = false;
  surface?.traverse(object => {
    if (object instanceof THREE.Mesh) containsMesh = true;
  });
  if (!surface || !containsMesh) {
    disposeObject3D(gltf.scene);
    throw new Error(`The bundled ${type} model is missing its ${asset.meshName} mesh.`);
  }

  const swimClip = gltf.animations.find(clip => clip.duration > 0);
  if (!swimClip) {
    disposeObject3D(gltf.scene);
    throw new Error(`The bundled ${type} model has no tail-swim animation.`);
  }

  gltf.scene.traverse(object => {
    if (!(object instanceof THREE.Mesh)) return;
    object.castShadow = true;
    object.receiveShadow = true;
    object.userData.fishType = type;
  });
  gltf.scene.name = `${type}-model`;
  return { scene: gltf.scene, swimClip };
}

function createFish(type: FishType, item: NormalizedFishOptions['fishes'][number], asset: Awaited<ReturnType<typeof loadFishModel>>) {
  const root = new THREE.Group();
  root.name = `${type}-${item.id}`;
  root.position.set(...item.position);
  root.rotation.set(...item.rotation);
  root.scale.setScalar(item.scale);
  root.userData.fishId = item.id;
  root.userData.fishType = type;

  const modelRoot = SkeletonUtils.clone(asset.scene);
  modelRoot.name = `${type}-model-instance`;
  root.add(modelRoot);

  const mixer = new THREE.AnimationMixer(modelRoot);
  const action = mixer.clipAction(asset.swimClip);
  const restBones: NonNullable<AnimatedFish['restBones']> = [];
  modelRoot.traverse(object => {
    if (object instanceof THREE.Bone) restBones.push({ bone: object, quaternion: object.quaternion.clone() });
  });
  action.play();

  return {
    root,
    actor: {
      root,
      modelRoot,
      mixer,
      clipDuration: asset.swimClip.duration,
      anchor: new THREE.Vector3(...item.position),
      baseRotation: new THREE.Euler(...item.rotation),
      speed: item.swimSpeed,
      amplitude: item.swimAmplitude,
      restBones,
      phase: item.index * 0.29,
    } satisfies AnimatedFish,
  };
}

export async function createFishScene(options: NormalizedFishOptions): Promise<FishScene> {
  const fishTypes = Array.from(new Set(options.fishes.map(fish => fish.type)));
  const results = await Promise.allSettled(fishTypes.map(async type => [type, await loadFishModel(type, options.assetBaseUrl)] as const));
  const failure = results.find(result => result.status === 'rejected');
  if (failure?.status === 'rejected') {
    results.forEach(result => {
      if (result.status === 'fulfilled') disposeObject3D(result.value[1].scene);
    });
    throw failure.reason;
  }
  const modelsByType = new Map(results.flatMap(result => (result.status === 'fulfilled' ? [result.value] : [])));
  const group = new THREE.Group();
  group.name = 'fish-scene';
  const animatedFish: AnimatedFish[] = [];

  options.fishes.forEach(fish => {
    const asset = modelsByType.get(fish.type);
    if (!asset) return;
    const instance = createFish(fish.type, fish, asset);
    animatedFish.push(instance.actor);
    group.add(instance.root);
  });

  return { group, animatedFish };
}

const nativePoseQuaternion = new THREE.Quaternion();

export function updateFishScene(fish: AnimatedFish[], elapsedSeconds: number, globalSpeed: number, instanceTimes?: Readonly<Record<string, number>>) {
  fish.forEach(actor => {
    const instanceTime = instanceTimes?.[actor.root.userData.fishId];
    const seconds = instanceTime !== undefined && Number.isFinite(instanceTime) ? Math.max(0, instanceTime) : elapsedSeconds;
    const phase = seconds * globalSpeed * actor.speed + actor.phase;
    actor.mixer.setTime(phase % actor.clipDuration);
    actor.restBones?.forEach(({ bone, quaternion }) => {
      nativePoseQuaternion.copy(bone.quaternion);
      bone.quaternion.copy(quaternion).slerp(nativePoseQuaternion, actor.amplitude);
    });
    actor.root.position.set(
      actor.anchor.x + Math.sin(phase * 0.19) * 0.035,
      actor.anchor.y + Math.sin(phase * 0.42) * 0.018,
      actor.anchor.z + Math.cos(phase * 0.23) * 0.025
    );
    actor.root.rotation.set(
      actor.baseRotation.x,
      actor.baseRotation.y + Math.sin(phase * 0.2) * 0.025,
      actor.baseRotation.z + Math.sin(phase * 0.31) * 0.012
    );
  });
}

export function releaseFishAnimations(fish: AnimatedFish[]) {
  fish.forEach(actor => {
    actor.mixer.stopAllAction();
    actor.mixer.uncacheRoot(actor.modelRoot);
  });
}
