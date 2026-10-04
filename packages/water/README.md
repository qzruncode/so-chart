# @so-chart/water

## 安装与入口

```bash
pnpm add @so-chart/water three
```

提供 ESM import、CommonJS require 和 TypeScript 声明；Three.js 为 peer dependency，宿主应使用兼容的 ^0.186.0 版本。通过支持 new URL(import.meta.url) 资产转换的构建器（如 Vite）消费 ESM；直接浏览器加载需要能解析裸模块并把 dist 和资产一起部署。CommonJS 的资源基址依赖当前浏览器脚本；独立脚本宿主需要部署同目录资产，再次打包的消费方式以验证结果为准。

完整参数说明见 [Handbook](demo/docs/WaterChart.md)。以下内容与包内说明保持一致。

通过 Three.js Water2 的反射/折射渲染和解析 Gerstner 波生成三维水面，支持局部指针涟漪。六鱼组合示例把鱼对象直接放入同一 Scene；巡游与避让由示例管理，不是水包的公共鱼参数。

## 数据格式

水面不使用 datasets。`water` 描述水平 XZ 平面，Y 为 elevation；坐标长度均为世界单位。`flowDirection` 是二维 XZ 方向，`sunDirection` 是从水面指向太阳的三维方向并在运行时归一化。可传入应用自有的 Three.js normalMap0、normalMap1、flowMap；图表不会销毁调用者拥有的贴图。

## 完整配置示例

```ts
import getWaterChart from '@so-chart/water';
const chart = getWaterChart({ container, chartType: 'water', layout: { height: 420 } });
chart.setOption({
  water: {
    // assetBaseUrl: '/water-assets/', // 可选，两 JPG 的部署目录；默认模块相对路径
    width: 8, // 平面宽度，0.5..1000
    depth: 6, // 平面深度，0.5..1000
    elevation: 0, // Y 高度，-100..100
    color: '#3f9bb3', // Three.js 颜色字符串/数值/Color
    textureWidth: 512, // 反射和折射目标宽度，整数，128..2048
    textureHeight: 512, // 反射和折射目标高度，整数，128..2048
    clipBias: 0, // 两个离屏相机裁剪偏差，-0.1..0.1
    flowDirection: [1, 0], // XZ 法线流动方向
    flowSpeed: 0.03, // 细法线流速，0..2；0 仅停止细法线流动
    reflectivity: 0.02, // Fresnel 反射强度，0..1
    transmission: 0.12, // 折射场景贡献，0..1；浅水可提高
    sunDirection: [0.12, 0.58, -0.8], // 归一化的太阳方向
    sunColor: '#fff4d0', // 太阳高光颜色
    sunIntensity: 1.5, // 太阳强度，0..8
    scale: 1, // 细法线重复倍率，0.05..10
    waveHeight: 0.12, // 本例默认几何波高；随宽深变化，受稳定坡度上限约束
    waveSpeed: 1, // 几何波速度，0..4；0 停止几何波的时间运动
    multisample: 0, // 离屏 MSAA 样本数，整数，0..8；GPU 可能进一步限制
    // normalMap0: texture0, // 可选，自有贴图，默认加载随包法线
    // normalMap1: texture1, // 可选，自有贴图，默认加载随包法线
    // flowMap: flowTexture, // 可选，自有流向贴图，默认无
  },
  backgroundColor: '#7aaec4', // Three.js 颜色或 null，null 透明
  sky: { show: true }, // 默认随 backgroundColor 非 null；可独立关闭天空
  ariaLabel: 'Water surface chart', // canvas 无障碍名称
  animation: {
    enabled: true, // 水面/涟漪/自动旋转动画总开关，false 清涟漪并冻结当前水面
    reducedMotion: 'auto', // auto 跟随系统、always 减弱、never 不跟随；默认 never
  },
  fog: {
    show: true, // 默认随背景非 null；颜色为空时回退背景
    color: '#7aaec4', // 雾色
    near: 9.6, // 本例默认 size*1.2，0.1..1000
    far: 40, // 本例默认 size*5，1..2000，最终大于 near
  },
  camera: {
    position: [7.6, 6, 8.8], // 默认 [size*.95,size*.75,size*1.1]
    target: [0, 0, 0], // 默认 [0,elevation,0]
    fov: 38, // 垂直视野角，度，10..100
    near: 0.1, // 近裁剪面，0.01..10
    far: 100, // 默认 max(100,size*12)，10..10000，最终大于 near
  },
  controls: {
    enabled: true, // 相机交互总开关
    damping: true, // 相机惯性；静态场景可 false 省去持续帧循环
    dampingFactor: 0.06, // 惯性因子，0.001..1
    autoRotate: false, // 自动旋转
    autoRotateSpeed: 0.4, // 有限值，可负数反向
    enableRotate: true, // 旋转开关
    enableZoom: true, // 缩放开关
    enablePan: true, // 平移开关
    rotateSpeed: 1, // 旋转速度，0..10
    zoomSpeed: 1, // 缩放速度，0..10
    panSpeed: 1, // 平移速度，0..10
    touchAction: 'pan-y', // 默认允许页面纵向滚动；none 交给画布手势
    minDistance: 3.6, // 本例默认 size*.45，0.1..1000
    maxDistance: 32, // 本例默认 size*4，1..5000，最终不小于 minDistance
    minPolarAngle: 0.2, // 垂直角下限，弧度，0..π
    maxPolarAngle: Math.PI * 0.48, // 上限，0..π，最终不小于下限
  },
  interaction: {
    enabled: false, // 默认关闭局部指针交互；六鱼示例开启
    strength: 0.03, // 局部总扰动高度限制，0..0.08
    radius: 1.4, // XZ 波包半径，0.3..5
    decay: 2.2, // 生命周期，秒，0.4..6
    sampleInterval: 70, // 至少采样间隔，毫秒，30..250
  },
  renderer: {
    pixelRatio: 1.25, // DPR 上限，1..2，不超过设备 DPR
    toneMappingExposure: 0.3, // ACES 曝光，0.1..3
  },
  onInteraction: event => {
    /* { position: [x,y,z], source: 'mouse'|'pen'|'touch' } 或 null */
  },
  onError: error => {
    /* 随包法线加载失败，仍保留本地生成贴图 */
  },
});
```

## 参数说明

- `size=max(width,depth)`，`shorter=min(width,depth)`；波长 `L=max(1,min(28,shorter*.28))`。默认 waveHeight=min(shorter*.02,L*.08)，实际上限 min(shorter*.06,L*.12)。示例宽8深6时默认0.12。waveHeight=0 关闭几何波形；waveSpeed=0 只冻结几何时间，flowSpeed=0 只冻结细法线，均不替代 animation.enabled 总开关。
- 上方注释值除明确标记外均为默认值。有限数越界裁剪，NaN/Infinity 回退默认；纹理尺寸和 multisample 四舍五入。非法元组回退默认；零方向回退默认。fog/camera 的 far 至少 near+0.01；controls 的上限至少等于下限。
- `setOption` 整份替换配置，遗漏字段恢复默认，重建水面与离屏资源并重新设置相机/天空/控制器；不是深合并。仅临时暂停使用 `setAnimationEnabled(boolean)`，仅开关交互使用 `setInteractionEnabled(boolean)`，不必重建。
- `animation.reducedMotion` 默认 never 保持兼容；auto 监听系统减弱动画并冻结水面、清除涟漪与交互目标、停止自动旋转；always 始终如此。重新启用不会补算暂停期间的波时间。宿主添加的鱼/其他对象需要宿主独立遵循该偏好。
- `sky.show` 与透明背景独立。backgroundColor=null 时 sky 默认关闭，fog 默认关闭；显式 sky.show=true 仍会绘制天空，不再得到纯透明背景。
- 自有贴图保持调用者所有权。缺少任一 normalMap 时先生成本地备用法线，随后异步加载随包两 JPG 并克隆有效贴图；部分加载失败释放已成功资源，保留备用图。`onError(unknown)` 每次有效尝试失败调用，销毁/替换后不通知；工厂创建/WebGL 初始化同步错误由调用者 catch。
- `textureWidth/Height` 增加反射折射分辨率，也增加显存；pixelRatio 控制主画布，multisample 控制离屏目标。较弱 GPU 可设 DPR=1、纹理128/256、multisample=0。没有自定义无限几何细分参数，内置有限网格密度保证解析波稳定。
- canvas 的 ariaLabel 可覆盖；宿主需提供说明/状态/键盘按钮等语义化替代。图表通过 ResizeObserver 响应容器尺寸，容器实际非零高度优先，可手动 resize。布局 height 省略使用共享布局默认值（400）。

## 指针和相机交互

当前相机射线从实际 canvas 的 CSS 坐标投影到平均水面 elevation，再拒绝水面范围外命中。`onInteraction` 在采样时接收世界位置，静止或移动不足0.05单位不重复发射；离开目标清除时发送 null。触摸短点按产生一次目标，650ms后清除；多指和拖拽不产生点按。

着色器固定八槽复用，叠加局部衰减高度、解析法线和折射，不生成 DOM 覆盖层。这是解析波包，不是完整流体模拟。radius/decay/strength 使用最近一次有效发射的配置作用于全部仍活动的槽。

鼠标按下拖拽与滚轮用于相机，清除交互；鼠标离开时清除鱼群目标，已有涟漪自然衰减。取消、失焦、隐藏、暂停动画、关闭交互、纯海面切换和卸载清除涟漪。回调抛错被隔离记录，销毁不再触发有效目标（销毁过程可对已有目标发送最后一次 null）。

六鱼示例的 2 单位触发距离、0.95 最大避让偏移、限速转向、池岸约束属于 pondResponse 宿主代码，未作为水包配置导出。相机与灯光共享同一场景，鱼对象保留原生独立骨架。

## 生命周期

卸载调用 chart.dispose，重复销毁安全；清理控制器、指针/媒体查询监听、尺寸观察器、动画循环、反射/折射目标、几何、内部纹理、天空和 renderer。自有外部纹理与宿主 scene 中添加的鱼/环境对象由宿主 dispose。

```ts
import { createWaterObject, disposeWaterObject } from '@so-chart/water';
const surface = createWaterObject({ water: { width: 12, depth: 9, transmission: 0.9 }, animation: { enabled: true } });
scene.add(surface); // 相机、场景、渲染循环与指针由宿主管理
surface.addRipple(1, 2, 0.03, 1.4, 2.2); // 局部 XZ 坐标，内部复用8槽
surface.setAnimationEnabled(false); // 冻结并清涟漪；不修改宿主循环
surface.clearRipples();
disposeWaterObject(surface); // 或 surface.dispose()，几何与内部纹理随之释放
```

低层 createWaterObject 仅消费 water、animation、onError；不会创建天空/相机/controls/指针，也不会监听系统设置（auto 在创建时取当前偏好，之后宿主调用 setAnimationEnabled）。surface.isDisposed 和 hasActiveRipples 可用于宿主生命周期/帧循环判断。WaterSurface 类直接构造需要完整 WaterSurfaceOptions 和自有几何；通常优先用工厂。

资产基址支持浏览器相对路径或绝对 URL，并自动补末尾 `/`。仅改变部署目录，不接受替换模型文件名。需保留发行包相同文件名；CJS 经浏览器构建器再次打包时，明确配置此基址并将六 GLB/两 JPG 复制到对应静态目录，避免 document.baseURI 回退位置不正确。Node 中相对基址无浏览器 location，必须使用绝对 URL；包仅支持浏览器实际渲染。

发行包通过 browser 导出条件让浏览器构建器（包括 CommonJS require 的宿主工程）选择 ESM 资产路径；Node require 保留真正的 CJS 入口，但 Three.js 0.186 的 CJS 会给出弃用提示，推荐 ESM。不要绕过包 exports 直接把 dist/*.cjs 实现文件编进浏览器：Three.js 的 require 警告使用 Node process。
