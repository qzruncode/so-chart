# 3D asset attribution

The chart bundles nine CC0 fruit models from Poly Haven:

| Fruit | Author | Source | Bundled model |
| --- | --- | --- | --- |
| Apple | Oliver Harries | [Food Apple 01](https://polyhaven.com/a/food_apple_01) | `src/assets/apple.glb` |
| Banana bunch | Alexander Shulha | [Bananas](https://polyhaven.com/a/bananas) | `src/assets/bananas.glb` |
| Asian pear | Amal Kumar | [Pears Asian 01](https://polyhaven.com/a/food_pears_asian_01) | `src/assets/pear.glb` |
| Avocado | Oliver Harries | [Food Avocado 01](https://polyhaven.com/a/food_avocado_01) | `src/assets/avocado.glb` |
| Kiwi | Oliver Harries | [Food Kiwi 01](https://polyhaven.com/a/food_kiwi_01) | `src/assets/kiwi.glb` |
| Lemon | Kuutti Siitonen | [Lemon](https://polyhaven.com/a/lemon) | `src/assets/lemon.glb` |
| Lime | Oliver Harries | [Food Lime 01](https://polyhaven.com/a/food_lime_01) | `src/assets/lime.glb` |
| Pomegranate | Oliver Harries | [Food Pomegranate 01](https://polyhaven.com/a/food_pomegranate_01) | `src/assets/pomegranate.glb` |
| Lychee | Oliver Harries | [Food Lychee 01](https://polyhaven.com/a/food_lychee_01) | `src/assets/lychee.glb` |

Each source is licensed CC0 1.0 Universal. The bundled GLBs use embedded WebP textures up to 512 px. They were prepared with [glTF Transform](https://github.com/donmccurdy/glTF-Transform) 4.5.0; geometry compression and mesh simplification were disabled. To reproduce an artifact from a downloaded source model:

```bash
pnpm dlx @gltf-transform/cli@4.5.0 optimize <source.gltf-or-glb> <output.glb> \
  --compress false --flatten false --instance false --join false \
  --simplify false --weld false --texture-compress webp --texture-size 512
```

The CLI is a build-time tool and is not a runtime dependency. The bundled models are CC0; the chart code remains under the package license.
