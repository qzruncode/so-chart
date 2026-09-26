# @so-chart/fire

Three.js 蜡烛视觉组件：单根连续火苗、轻微摆动、暗内锥与蓝色根部、弯曲的炭化灯芯，以及凹陷蜡池和透光蜡沿。支持旋转和缩放，不需要远程纹理。

## 安装

```bash
pnpm add @so-chart/fire three
```

## 使用

```tsx
import { useEffect, useRef } from 'react';
import getFireChart from '@so-chart/fire';

export function Candle() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const chart = getFireChart({
      container: ref.current,
      chartType: 'fire',
      layout: { height: 460 },
    });
    chart.setOption({
      fire: { width: 0.028, height: 0.08, depth: 0.028, speed: 1, airflowAmplitude: 0.65 },
      candle: { bodyHeight: 0.22, bodyRadius: 0.024, wickHeight: 0.02, wickRadius: 0.002 },
      bloom: { show: true, strength: 0.1, radius: 0.15, threshold: 0.9 },
    });
    return () => chart.dispose();
  }, []);
  return <div ref={ref} style={{ height: 460 }} />;
}
```

公共实例接口保留 `init`、`setOption`、`updateOptions`、`resize`、`render` 和 `dispose`，并通过 `chart.scene` 暴露共享 Three.js 场景，可与其他 Three.js 对象组合。火焰表面以 HDR 着色发光并由 Bloom 呈现光晕，`candle.light` 点光源位于火焰亮腹中部，负责照亮周围物体；`fire.airflowAmplitude` 控制气流对单根火苗和烛光位置的影响，范围为 `0..1`，默认 `0.65`，传 `0` 可关闭气流摆动。烛光投影由 `shadow.enabled`、`candle.light.castShadow` 和 `shadow` 参数控制；组合场景中的桌面、水果等网格仍须由宿主设置 `receiveShadow` / `castShadow`。蜡烛位置使用 `candle.position` 设置；默认相机会跟随位置重新取景，自定义相机可通过 `camera.autoFrame: false` 固定。`environment.show` 可开启室内 PMREM 反射。`quality` 提供低、中、高三级像素比和阴影贴图默认值，`renderer.pixelRatio` 与 `shadow.mapSize` 可单独覆盖。Three.js（包含 `three/addons/*`）和 `@so-chart/utils` 均保持为外部依赖；发布包提供 ESM 与 CommonJS 入口，宿主需安装 `three` peer dependency。`setOption` 完整替换配置；`updateOptions` 合并局部字段，常见动画、光源强度、相机和位置更新不会重建整个场景。组合对象由宿主管理，卸载前应使用所属包的 `disposeObject3D` 释放，再销毁图表。

火焰尺寸现在直接对应世界坐标，不再应用旧实验版本中的宽深 `0.38`、高度 `0.68` 倍缩放。默认尺寸、灯芯粗细与光照也已调整；使用旧尺寸的调用方应按新的蜡烛比例调整。`/chart/fire` 页面按顺序平铺基础版单根蜡烛和高阶静物场景：前者只创建 `@so-chart/fire` 图表；后者组合 `@so-chart/table3d` 的桌子、`@so-chart/basket` 的果篮和 `@so-chart/fruit` 包内模型资源，在一套相机与蜡烛光源下展示木纹桌面、果篮和三根紧靠成束的香蕉。两个独立 WebGL 图表同时运行，卸载时分别释放资源。高阶示例通过 Fire 包内的 Demo 辅助代码用 Rapier 对篮内苹果和梨做一次性重力与碰撞解算，再固定最终姿态，不会持续运行物理循环；藤编内腔碰撞面为近似形状。桌面保留 CC0 PBR 木纹颜色与法线细节，并采用低清漆、高粗糙度表面；静物场景中不透明物体投射烛光阴影；桌面、果篮、篮内水果和香蕉接收投影，蜡体、蜡池、灯芯和余烬只投射、不接收自身阴影，透明火焰不投影；大地面仅接收投影。点光使用 `0.58 cd`，火焰 Bloom 使用强度 `0.55`、半径 `0.28`、亮度阈值 `0.92`，在让周边受烛光照亮的同时保留单根火苗轮廓。点光阴影图使用 `1024 × 1024`，近裁剪面 `0.1`，深度偏移 `-0.0001`、法线偏移 `0.0003`、阴影强度 `0.68`、PCF 半径 `48`；半径按贴图尺寸比例决定采样范围，数值参考 Three.js 官方点光示例，并非模拟面积光源。动态六面阴影更新会增加 GPU 开销。滚轮或双指可将相机缩放到 `2.4` 个世界单位的最近距离。贴图来源见 [asset 说明](../table3d/demo/assets/wood-table-001/ASSETS.md)。完整配置与迁移说明见 [Handbook](./demo/docs/FireChart.md)，可运行示例为 [FireChart.tsx](./demo/examples/FireChart.tsx)，路由 `/chart/fire`。

## 来源与边界

静物 Demo 桌面粗糙度为 `0.86`、清漆强度为 `0.04`、清漆粗糙度为 `0.82`，并使用 `0.35` 材质环境反射；场景环境反射为 `0.12`、Hemisphere 补光为 `0.16`、无阴影方向补光为 `0.3`，抬亮蜡体受光面并保留烛光投影的明暗反差；点光阴影参数与性能说明见 [Handbook](./demo/docs/FireChart.md)。

先调研 [ascodeasice/three-js-birthday-cake](https://github.com/ascodeasice/three-js-birthday-cake) 中实际使用的蜡烛，再沿其署名采用原作者 prisoner849 的 [The Lonely Candle](https://codepen.io/prisoner849/pen/XPVGLp)（公开 Pen，MIT）。火焰沿用其球面变形与连续噪声方法；蜡体直接复用 Three.js 的 [SubsurfaceScatteringShader](https://github.com/mrdoob/three.js/blob/dev/examples/jsm/shaders/SubsurfaceScatteringShader.js)。完整第三方声明见 [LICENSE](./LICENSE)。

桌面木纹使用的 `MeshPhysicalMaterial` 直接启用 `receiveShadow`，让点光源的实际 shadow map 投影与木纹及清漆反射保持在同一表面。

这是用于实时展示的视觉近似，没有求解燃烧、流体或温度，也不模拟蜡烛随时间消耗。默认微弱空气扰动下保持一个火尖，不表现火把式碎焰。
