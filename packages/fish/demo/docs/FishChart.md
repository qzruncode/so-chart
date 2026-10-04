# 淡水鱼图表

以 Three.js 渲染六种独立 Blender GLB 及原生骨骼动画。当前青鱼、鲢、鳙、鲤鱼、普通鲫鱼为 native-v7，草鱼为 v13；全部仍是未通过用户写实验收的候选，不是扫描模型。原照片与历史资产许可保留在包内 ASSETS.md 和 THIRD_PARTY_NOTICES.md。

## 数据格式

```ts
import type { FishItemOptions } from '@so-chart/fish';
const fishes: FishItemOptions[] = [{ id: 'grass-1', type: 'grass-carp', position: [0, -0.8, 0], rotation: [0, 0, 0], scale: 1 }];
```

`type` 支持 `black-carp`（青鱼）、`grass-carp`（草鱼）、`silver-carp`（鲢）、`bighead-carp`（鳙）、`common-carp`（鲤鱼）、`crucian-carp`（普通鲫鱼，Carassius auratus）。省略 `fishes` 显示六种各一条；`[]` 清空。未知鱼种会过滤。省略位置时按最多两列、列距 3.3、行距 1.2 自动排列；奇数输入索引默认转向 π，偶数为 0。坐标是世界单位，XYZ 旋转是弧度，模型全长约 2.5 单位。

## 完整配置示例

```ts
import getFishChart from '@so-chart/fish';
const chart = getFishChart({ container, chartType: 'fish', layout: { height: 580 } });
chart.setOption({
  // assetBaseUrl: '/fish-assets/', // 可选，六个 GLB 的部署目录；默认模块相对路径
  fishes: [
    {
      id: 'grass-1', // 稳定实例标识；省略默认 fish-1、fish-2…
      type: 'grass-carp', // 六个内置鱼种之一
      position: [0, 0, 0], // 世界位置；省略自动排列
      rotation: [0, 0, 0], // XYZ 欧拉角，弧度；省略按输入索引交替朝向
      scale: 1, // 等比尺寸倍数，0.4..2.5
      swimSpeed: 1, // 单鱼原生动画速度，0..4
      swimAmplitude: 1, // 相对绑定姿态的骨骼旋转幅度，0..2
    },
  ],
  backgroundColor: '#c6e8e9', // string | number | null，null 透明
  ariaLabel: '3D freshwater fish', // canvas 无障碍名称
  animation: {
    enabled: true, // 播放原生动画；false 保留当前帧
    speed: 1, // 全局速度倍数，0..4
    reducedMotion: 'auto', // auto 跟随系统、always 减弱、never 不跟随；包默认 never
  },
  lighting: {
    color: '#e9ffff', // 主光与半球上方颜色，string | number
    intensity: 2.6, // 主光强度，0..20
    fillIntensity: 1.6, // 半球补光，0..10；环境光强度为其 0.6 倍
    fillColor: '#52605b', // 半球下方补光颜色
    position: [-2.8, 4.5, 5.5], // 主光世界位置，照向原点
  },
  camera: {
    position: [0, 1, 8.5], // 初始世界位置
    target: [0, 0, 0], // 初始观察/旋转中心
    fov: 38, // 垂直视野角，度，20..100
    near: 0.01, // 近裁剪面，0.001..10
    far: 100, // 远裁剪面，1..10000，最终必须大于 near
    autoFit: true, // 加载与容器改变后按鱼体包围盒适配；会覆盖 position/target
  },
  controls: {
    enabled: true, // 相机交互总开关
    damping: true, // 相机惯性
    dampingFactor: 0.05, // 惯性因子，0.001..1
    autoRotate: false, // 自动旋转
    autoRotateSpeed: 0.25, // 非负自动旋转速度
    enableRotate: true, // 允许旋转
    enableZoom: true, // 允许缩放
    enablePan: false, // 允许平移
    minDistance: 3, // 相机距离下限，至少 0.1
    maxDistance: 18, // 上限至少等于 minDistance
    minPolarAngle: 0.15, // 垂直旋转下限，弧度，0..π
    maxPolarAngle: Math.PI * 0.84, // 上限，0..π，至少等于下限
    rotateSpeed: 0.65, // 非负旋转速度
    zoomSpeed: 0.8, // 非负缩放速度
    panSpeed: 1, // 平移速度，0..10
    touchAction: 'pan-y', // none 完整画布手势（默认）；pan-y 允许页面纵向滚动
  },
  renderer: {
    pixelRatio: 1.5, // DPR 上限，1..2，实际不超过设备 DPR
    toneMappingExposure: 1.2, // ACES 色调映射曝光，0.1..3
  },
  onReady: ({ count, ids }) => {
    /* 此次有效加载完成，包含空场景 */
  },
  onError: error => {
    /* 此次有效加载或 onReady 回调失败 */
  },
});
```

## 参数说明

- 示例注释值除明确标记外均为包默认值。数值必须有限，NaN/Infinity 回退默认；越界值按对应范围裁剪。坐标/旋转要求三个有限数，非法元组回退默认。颜色接受 Three.js 颜色字符串或十六进制数；用户应提供有效颜色。
- `id` 去除首尾空白，空值回退 `fish-N`。重复 ID 自动添加 `-2`、`-3` 等后缀确保唯一；组合时钟使用最终 `group.children[i].userData.fishId` 或 `onReady.ids`，不要假设重复 ID 未变。
- `swimSpeed` 与 `animation.speed` 相乘。`swimAmplitude` 控制原生骨骼相对绑定姿态的旋转；0 不摆尾，1 原始幅度，2 增强。根对象仍有轻微原位漂动，不提供业务巡游路径。全局 speed=0 时无动画/自动旋转需求就停止持续帧循环。
- `camera.autoFit` 根据容器宽高适配并受 controls 距离范围限制。需固定镜头时设为 false。far 小于或等于 near 时调整为至少 near+0.01。
- `animation.reducedMotion` 默认 never 保持兼容；auto 监听系统设置并停止鱼动画与自动旋转，保留手动相机操作；always 始终停止这些动画。示例使用 auto，同时提供播放按钮与可访问状态文本。canvas 名称不是鱼信息的文本替代，宿主仍应提供鱼种列表和操作按钮。
- `setOption` 是整份配置替换，不是深合并；漏字段恢复默认。每次会重建灯光并异步重载鱼资源，即使只修改相机/灯光。旧鱼在新资源成功后释放，失败时保留旧鱼；旧请求晚到不覆盖新配置，销毁后不发 ready/error。播放开关可用 `setAnimationEnabled(boolean)` 避免重载。
- `onReady` 每次当前有效场景加载成功调用一次，参数 `{ count: number, ids: readonly string[] }`。`onError` 接收 unknown；未提供时记录控制台错误。回调抛错会隔离并记录，不能改变资源归属。
- 布局 height 省略使用共享布局默认值（400）；容器非零实际高度优先。ResizeObserver 自动响应容器变化，也可手动 `resize()`。布局边距不裁切三维场景。创建失败时异常由工厂同步抛出，宿主可显示 WebGL 不可用的文本回退。

## 交互与组合

拖拽旋转，滚轮/触屏手势缩放，可选平移。`touchAction: 'pan-y'` 优先支持页面纵向滚动，可能取消纵向画布拖拽；`none` 适合独占全屏场景。包不提供 raycast 选鱼、鱼群避让、鱼体碰撞或流体模拟；水包中的巡游与避让属于宿主示例。

```ts
import { createFishObject } from '@so-chart/fish';
const controller = new AbortController();
const fish = await createFishObject({
  fishes: [{ id: 'grass-1', type: 'grass-carp', position: [0, -0.8, 0] }],
  animation: { enabled: true, speed: 1, reducedMotion: 'auto' },
  signal: controller.signal, // 可选：取消后释放对象；加载期间完成后清理并 reject AbortError
});
scene.add(fish.group);
fish.update(seconds, 1, { 'grass-1': fishSeconds }); // 宿主连续累计各鱼时钟
// 宿主可随后修改根节点位置/朝向，组织巡游。
fish.dispose();
controller.abort();
```

`createFishObject` 只使用 fishes、animation、assetBaseUrl、signal，不创建画布/renderer/循环。返回 Promise；加载失败拒绝并释放同批已加载资源。AbortSignal 不中止底层已发出的 GLB HTTP 请求，但会阻止交付并释放晚到资源；交付后 abort 等同 dispose。`update` 接受非负绝对累计秒数，speed 限制 0..4；独立 `instanceTimes` 按最终 ID 覆盖公共秒数，非法值回退公共时间、负值归零。动画时钟改变速度时由宿主连续积分，不能直接用累计总时间乘新速度。enabled=false 或 reducedMotion 生效时不采样。

## 生命周期

宿主卸载时停止自己的帧循环并 `dispose()`。销毁幂等，释放 controls、监听器、观察器、PMREM 环境纹理、mixer、骨架纹理、几何、材质、纹理、canvas 与 renderer；已销毁对象的方法不再产生效果。每个 createFishObject 有独立资源，同类型多鱼共享几何/材质但骨架独立。不要销毁仍在其他场景使用的 group；卸载期间的异步结果使用 signal 或立即 dispose。

安装包包含 ES module、CommonJS、声明文件、六 GLB、此说明与许可。npm 不包含 Blender 编辑源；这些源保存在仓库 models/current-preview。完整署名和模型许可见 ASSETS.md 与 THIRD_PARTY_NOTICES.md，不能把代码 ISC 当成所有照片衍生资产许可。

资产基址支持浏览器相对路径或绝对 URL，并自动补末尾 `/`。仅改变部署目录，不接受替换模型文件名。需保留发行包相同文件名；CJS 经浏览器构建器再次打包时，明确配置此基址并将六 GLB/两 JPG 复制到对应静态目录，避免 document.baseURI 回退位置不正确。Node 中相对基址无浏览器 location，必须使用绝对 URL；包仅支持浏览器实际渲染。

发行包通过 browser 导出条件让浏览器构建器（包括 CommonJS require 的宿主工程）选择 ESM 资产路径；Node require 保留真正的 CJS 入口，但 Three.js 0.186 的 CJS 会给出弃用提示，推荐 ESM。不要绕过包 exports 直接把 dist/*.cjs 实现文件编进浏览器：Three.js 的 require 警告使用 Node process。
