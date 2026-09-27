import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import appleModelUrl from './assets/apple.glb?url';
import avocadoModelUrl from './assets/avocado.glb?url';
import bananaModelUrl from './assets/bananas.glb?url';
import kiwiModelUrl from './assets/kiwi.glb?url';
import lemonModelUrl from './assets/lemon.glb?url';
import limeModelUrl from './assets/lime.glb?url';
import lycheeModelUrl from './assets/lychee.glb?url';
import pearModelUrl from './assets/pear.glb?url';
import pomegranateModelUrl from './assets/pomegranate.glb?url';
import type { FruitType, NormalizedFruitOptions } from './types';

const FRUIT_MODEL_SIZE = 0.82;

type FruitModelAsset = {
  url: string;
  objectName: string;
};

const FRUIT_MODEL_ASSETS: Record<FruitType, FruitModelAsset> = {
  apple: { url: appleModelUrl, objectName: 'food_apple_01' },
  banana: { url: bananaModelUrl, objectName: 'bananas_bunch' },
  pear: { url: pearModelUrl, objectName: 'food_pears_asian_01_a' },
  avocado: { url: avocadoModelUrl, objectName: 'food_avocado_01' },
  kiwi: { url: kiwiModelUrl, objectName: 'food_kiwi_01' },
  lemon: { url: lemonModelUrl, objectName: 'lemon' },
  lime: { url: limeModelUrl, objectName: 'food_lime_01' },
  pomegranate: { url: pomegranateModelUrl, objectName: 'food_pomegranate_01' },
  lychee: { url: lycheeModelUrl, objectName: 'food_lychee_01' },
};

function normalizeFruitModel(model: THREE.Group, fruit: THREE.Object3D) {
  const bounds = new THREE.Box3().setFromObject(fruit);
  const size = bounds.getSize(new THREE.Vector3());
  const center = bounds.getCenter(new THREE.Vector3());
  const scale = FRUIT_MODEL_SIZE / Math.max(size.x, size.y, size.z);

  model.scale.setScalar(scale);
  model.position.set(-center.x * scale, -bounds.min.y * scale, -center.z * scale);
}

async function loadFruitModel(type: FruitType) {
  const asset = FRUIT_MODEL_ASSETS[type];
  const gltf = await new GLTFLoader().loadAsync(asset.url);
  const model = gltf.scene;
  const fruit = model.getObjectByName(asset.objectName);
  if (!fruit) throw new Error(`Missing ${asset.objectName} in the bundled ${type} model.`);

  for (const child of model.children) child.visible = child === fruit;
  normalizeFruitModel(model, fruit);
  model.name = `${type}-fruit-model`;
  model.traverse(child => {
    if (!(child instanceof THREE.Mesh)) return;
    child.castShadow = true;
    child.receiveShadow = true;
    child.userData.fruitType = type;
  });
  return model;
}

function addFloor(group: THREE.Group, options: NormalizedFruitOptions) {
  if (!options.floor.show) return;

  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(30, 30),
    new THREE.MeshStandardMaterial({ color: options.floor.color, roughness: options.floor.roughness }),
  );
  floor.name = 'fruit-floor';
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -0.012;
  floor.receiveShadow = true;
  group.add(floor);
}

export async function createFruitScene(options: NormalizedFruitOptions) {
  const fruitTypes = Array.from(new Set(options.fruits.map(fruit => fruit.type)));
  const fruitModels = await Promise.all(fruitTypes.map(async type => [type, await loadFruitModel(type)] as const));
  const modelsByType = new Map(fruitModels);
  const unusedModels = new Set(modelsByType.keys());
  const group = new THREE.Group();
  group.name = 'fruit-scene';

  options.fruits.forEach((fruit, index) => {
    const model = modelsByType.get(fruit.type);
    if (!model) return;

    const item = new THREE.Group();
    item.name = `${fruit.type}-fruit-${index + 1}`;
    item.position.set(...fruit.position);
    item.rotation.set(...fruit.rotation);
    item.scale.setScalar(fruit.scale);
    item.userData.fruitId = fruit.id;
    item.userData.fruitIndex = fruit.index;
    item.userData.fruitType = fruit.type;
    item.add(unusedModels.delete(fruit.type) ? model : model.clone(true));
    group.add(item);
  });

  addFloor(group, options);
  return group;
}
