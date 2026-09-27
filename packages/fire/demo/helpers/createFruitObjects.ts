import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import appleModelUrl from '../../../fruit/src/assets/apple.glb?url';
import bananaModelUrl from '../../../fruit/src/assets/bananas.glb?url';
import pearModelUrl from '../../../fruit/src/assets/pear.glb?url';

export type FireDemoFruitType = 'apple' | 'banana' | 'pear';

export type FireDemoFruitOptions = {
  type: FireDemoFruitType;
  position: readonly [number, number, number];
  rotation: readonly [number, number, number];
  scale: number;
};

const FRUIT_MODEL_SIZE = 0.74;

const FRUIT_MODEL_ASSETS: Record<FireDemoFruitType, { url: string; objectName: string }> = {
  apple: { url: appleModelUrl, objectName: 'food_apple_01' },
  banana: { url: bananaModelUrl, objectName: 'bananas_bunch' },
  pear: { url: pearModelUrl, objectName: 'food_pears_asian_01_a' },
};

async function loadFruitModel(type: FireDemoFruitType) {
  const asset = FRUIT_MODEL_ASSETS[type];
  const model = (await new GLTFLoader().loadAsync(asset.url)).scene;
  const fruit = model.getObjectByName(asset.objectName);
  if (!fruit) throw new Error(`Missing ${asset.objectName} in the ${type} model from @so-chart/fruit.`);

  for (const child of model.children) child.visible = child === fruit;

  const bounds = new THREE.Box3().setFromObject(fruit);
  const size = bounds.getSize(new THREE.Vector3());
  const center = bounds.getCenter(new THREE.Vector3());
  const scale = FRUIT_MODEL_SIZE / Math.max(size.x, size.y, size.z);
  model.scale.setScalar(scale);
  model.position.set(-center.x * scale, -bounds.min.y * scale, -center.z * scale);
  model.name = `${type}-fruit-model`;
  model.traverse(object => {
    if (!(object instanceof THREE.Mesh)) return;
    object.castShadow = true;
    object.receiveShadow = true;
    object.userData.fruitType = type;
  });

  return model;
}

export async function createFruitObjects(options: readonly FireDemoFruitOptions[]) {
  const types = Array.from(new Set(options.map(option => option.type)));
  const entries = await Promise.all(types.map(async type => [type, await loadFruitModel(type)] as const));
  const models = new Map(entries);
  const group = new THREE.Group();
  group.name = 'still-life-fruits';

  options.forEach((option, index) => {
    const model = models.get(option.type);
    if (!model) return;

    const fruit = new THREE.Group();
    fruit.name = `${option.type}-fruit-${index + 1}`;
    fruit.position.set(...option.position);
    fruit.rotation.set(...option.rotation);
    fruit.scale.setScalar(option.scale);
    fruit.userData.fruitType = option.type;
    fruit.userData.fruitIndex = index;
    fruit.add(model.clone(true));
    group.add(fruit);
  });

  return group;
}
