# Changelog

## 0.2.1

### Patch Changes

- Externalize Three.js addon imports to keep the Fire distribution bundle small.

## 0.2.0

### Minor Changes

- 新增基于 MIT 许可 The Lonely Candle 方案的蜡烛组件：单根平滑火苗、薄蓝根部、弯曲灯芯、凹陷蜡池和透光蜡沿。支持实际世界尺寸、世界坐标摆放、共享 Three.js 场景、PMREM 环境反射、同步火苗与烛光的速度和气流幅度控制、OrbitControls、轻量光晕，以及完整资源释放。公开 API 增加质量档位、灯光/阴影/地面配置、蜡烛移动后的自动取景和 `updateOptions` 局部更新；动画、光源强度、相机与位置调整会复用现有场景对象。暗室静物采用小比例蜡烛和单根火苗，连续气流同时带动火焰弯曲与烛光移动；点光源位于火焰亮腹中心，火焰与点光同步轻微闪烁，Bloom 强调火焰自身的暖色光晕，木纹桌板直接接收 Three.js 点光阴影，呈现香蕉、果篮和蜡柱随火苗偏摆的桌面投影。果篮中的苹果和梨再通过 Rapier 刚体碰撞与重力一次性落位，避免悬空和相互重叠，完成后固定姿态。静物示例将相机最近距离放宽到 `2.4` 个世界单位，支持进一步放大观察。暗室静物调低无阴影补光、提高点光阴影图分辨率并柔化边缘，使桌面烛光投影更清楚。

  桌面木纹现在通过 `@so-chart/table3d` 的 `tabletopMaterial` 选项设置；果篮一次性碰撞落位辅助代码位于 Fire 包的 Demo 支持目录，Rapier 不进入火焰包运行时依赖。

  `/chart/fire` Demo 将基础版单根蜡烛与高阶桌面静物按顺序平铺展示，两个图表同时运行并各自释放资源。

## 0.1.0

- Added a candle chart based on prisoner849's MIT-licensed The Lonely Candle: a single smooth flame with quiet motion, a curved wick, recessed wax pool, and Three.js subsurface scattering for the wax rim.
- Flame dimensions now use world units directly. Animation speed also controls light flicker; zero freezes both. All postprocessing passes and candle resources are disposed on replacement and teardown.
