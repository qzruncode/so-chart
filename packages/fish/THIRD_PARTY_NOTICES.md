# Third-party notices

Runtime ships only the six current-preview GLBs: black carp native-v7, grass carp v13, and silver/bighead/common/ordinary-crucian native-v7. These use independently authored Blender meshes and native nine-bone animation; no finished third-party fish mesh is bundled. Source code is ISC. Source Blender files are retained in the repository and are not bundled in npm.

Photo references, extracted local pigmentation and earlier derived assets have separate permissions. Keep every attribution below when redistributing the GLBs and derived textures. Conservatively retain CC BY-SA 3.0 permissions for common-carp GLB and its earlier photo-derived material, CC BY attribution for bighead/ordinary-crucian references and derivative material, and USFWS public-domain credits for black/grass/silver and local common-carp detail. Current ordinary-crucian candidate uses authored skin and does not project the whole iNaturalist photograph; its reference attribution is retained. ISC is not a blanket relicense of photo-derived assets. Published ASSET_MANIFEST.json records the exact six SHA256 files and retained notices.

- Black carp: photo by Kellie Hanser, edited by Liam Ward, [U.S. Fish & Wildlife Service](https://www.fws.gov/media/black-carp-photo-usfws-kellie-hanser-and-edited-usfws-liam-wardpng). Public Domain.
- Grass carp: Sam Stukel/USFWS, [U.S. Fish & Wildlife Service](https://www.fws.gov/media/grass-carp-6). Public Domain.
- Silver carp: Sam Stukel/USFWS, [U.S. Fish & Wildlife Service](https://www.fws.gov/apps/media/silver-carp-hypophthalmichthys-molitrix-0). Public Domain.
- Bighead carp: photo by Dezidor, [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Tolstolobec_pestr%C3%BD.jpg), licensed under [CC BY 3.0](https://creativecommons.org/licenses/by/3.0/). The image is cropped and background-masked for the model.
- Common-carp head and scale detail: Sam Stukel/USFWS, [Common Carp](https://www.fws.gov/media/common-carp-10). Public Domain. The original high-resolution photo is retained in the recoverable local authoring archive, outside this source release and npm tarball; head/scale pigment is locally extracted and illumination-normalized.
- Common carp whole-fish reference and earlier derived assets: George Chernilevsky, [Wikimedia Commons: Cyprinus carpio 2008 G1 (cropped).jpg](https://commons.wikimedia.org/wiki/File:Cyprinus_carpio_2008_G1_%28cropped%29.jpg). Photo-derived texture and GLB are licensed under [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/).
- Ordinary crucian carp (_Carassius auratus_, community identification): naturalist132890, [iNaturalist observation 228813295](https://www.inaturalist.org/observations/228813295), photo 406505226. Per-photo API license: CC BY. The original is cropped, mirrored, locally retouched and used in the new skin atlas; keep this attribution with its derived maps and GLB. The earlier George Chernilevsky _C. gibelio_ reference is excluded from the new shipped asset.

The image-segmentation authoring tool is [rembg](https://github.com/danielgatis/rembg), licensed under MIT. The script explicitly uses [U²-Net](https://github.com/xuebinqin/U-2-Net), whose project is licensed under Apache-2.0; neither the tool nor its model weights are shipped in the npm package.

The model authoring and texture-preparation scripts are independently implemented. The technique references below are not bundled as source code or model assets:

- [FishSim](https://github.com/nerk987/FishSim) is a Blender modeling/animation workflow reference for separate body, tail, and paired fins. Its GPL code, Rigify rigs, and included fish models are not copied.
- [camera-controls](https://github.com/yomotsu/camera-controls) is a reference for camera-space bounding-box fitting. It is not installed or bundled.

- [paper-aquarium](https://github.com/MrMoT9I/paper-aquarium) demonstrates side-silhouette photo mapping on animated 3D fish. Its purchased fish pack is not included.
- [Aquascape fish anatomy](https://github.com/joebarbere/aquascape/tree/main/libs/domain/fish-anatomy) is a design reference for cross-section body profiles; its implementation is not included.
- [Google WebGL Aquarium](https://github.com/WebGLSamples/WebGLSamples.github.io/blob/master/aquarium/aquarium.html) demonstrates position-weighted fish tail motion. The general animation approach is independently implemented here; its geometry and textures are not included. The reference project is licensed under [BSD 3-Clause](https://github.com/WebGLSamples/WebGLSamples.github.io/blob/master/LICENSE.md).

- [Infinigen](https://github.com/princeton-vl/infinigen/blob/nature-stable/infinigen/assets/materials/fishbody.py) (BSD 3-Clause) is a workflow reference for separating pigmentation and roughness; no source or model is copied. [Retinex](https://github.com/muggledy/retinex/blob/master/code/retinex.py) is a technique reference for extracting bounded detail after illumination normalization; its implementation is not bundled.
