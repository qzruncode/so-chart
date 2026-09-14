# @so-chart/radar

## 1.1.2

### Patch Changes

- be55d66: Prepare the chart packages for the public open-source distribution.
- Updated dependencies [be55d66]
  - @so-chart/tabs@2.0.1
  - @so-chart/tooltip@1.0.48
  - @so-chart/types@2.2.2
  - @so-chart/utils@2.0.9

## 1.1.1

### Patch Changes

- 移除 `@so-chart/tabs` 对 React、React DOM 和 Ant Design 的运行时依赖。`@so-chart/tabs` 现在只负责图表内置 Tabs 的绘制与销毁；搜索、分页和详情按钮等业务交互移交调用方实现。

  同时优化内置 Tabs 的横向滚动控制样式与边界状态，并确保关闭标签栏时清理旧控制器。

- Updated dependencies
  - @so-chart/tabs@2.0.0

## 1.1.0

### Minor Changes

- dd8bff6: 为雷达图增加数据区域 hover 高亮、D3 多边形命中检测和 tooltip 交互

### Patch Changes

- 5539a01: 统一外部 CSP nonce 解析：支持复用宿主资源上的 nonce，保留旧的全局变量兼容，并让显式图表 nonce 优先。
- 5539a01: 优化基础图表动画帧、Canvas 提交、Tooltip 缓存、指针事件合并和高频命中检测，减少快速 hover 与重复 setOption 的无效工作。
- 5539a01: 各图表包入口导出对应的公开 TypeScript 类型，并将跨包类型依赖标记为 type-only，收敛类型包的公共边界。
- 5539a01: 收回未公开的内部 DOM 清理函数导出，消除 UMD 构建的混合导出警告
- Updated dependencies [5539a01]
- Updated dependencies [5539a01]
- Updated dependencies [5539a01]
- Updated dependencies [dd8bff6]
- Updated dependencies [5539a01]
- Updated dependencies [5539a01]
- Updated dependencies [5539a01]
- Updated dependencies [5539a01]
  - @so-chart/utils@2.0.8
  - @so-chart/tooltip@1.0.47
  - @so-chart/types@2.2.0
  - @so-chart/tabs@1.0.54

## 1.0.44

### Patch Changes

- 补充 2026-08-10 `b86854e` 已合入但尚未版本化的图表包变更。
- Updated dependencies
  - @so-chart/tabs@1.0.53
  - @so-chart/types@2.0.12
  - @so-chart/utils@2.0.7

## 1.0.43

### Patch Changes

- 优化cli
- Updated dependencies
  - @so-chart/utils@2.0.6
  - @so-chart/tabs@1.0.52

## 1.0.42

### Patch Changes

- Updated dependencies
  - @so-chart/utils@2.0.5
  - @so-chart/tabs@1.0.51

## 1.0.41

### Patch Changes

- Updated dependencies
  - @so-chart/utils@2.0.4
  - @so-chart/tabs@1.0.50

## 1.0.40

### Patch Changes

- Updated dependencies
  - @so-chart/tabs@1.0.49

## 1.0.39

### Patch Changes

- Updated dependencies
  - @so-chart/tabs@1.0.48

## 1.0.38

### Patch Changes

- Updated dependencies
  - @so-chart/tabs@1.0.47

## 1.0.37

### Patch Changes

- Updated dependencies
  - @so-chart/tabs@1.0.46

## 1.0.36

### Patch Changes

- 增加搜索 tab
- Updated dependencies
  - @so-chart/utils@2.0.3
  - @so-chart/tabs@1.0.45

## 1.0.35

### Patch Changes

- Updated dependencies
  - @so-chart/tabs@1.0.44

## 1.0.34

### Patch Changes

- 优化打包
- Updated dependencies
  - @so-chart/tabs@1.0.43

## 1.0.33

### Patch Changes

- Updated dependencies
  - @so-chart/utils@2.0.2
  - @so-chart/tabs@1.0.42

## 1.0.32

### Patch Changes

- 设置全局 **CSP_NONCE**
- Updated dependencies
  - @so-chart/utils@2.0.1

## 1.0.31

### Patch Changes

- 支持传 nonce id
- Updated dependencies
  - @so-chart/tabs@1.0.41
  - @so-chart/utils@2.0.0

## 1.0.30

### Patch Changes

- 调整坐标轴默认字体大小由 10->12

## 1.0.29

### Patch Changes

- Updated dependencies
  - @so-chart/utils@2.0.0
  - @so-chart/tabs@1.0.40

## 1.0.28

### Patch Changes

- Updated dependencies
  - @so-chart/tabs@1.0.40

## 1.0.27

### Patch Changes

- Updated dependencies
  - @so-chart/tabs@1.0.39

## 1.0.26

### Patch Changes

- Updated dependencies
  - @so-chart/utils@1.0.43
  - @so-chart/tabs@1.0.38

## 1.0.25

### Patch Changes

- Updated dependencies
  - @so-chart/utils@1.0.42

## 1.0.24

### Patch Changes

- Updated dependencies
  - @so-chart/utils@1.0.41
  - @so-chart/tabs@1.0.37

## 1.0.23

### Patch Changes

- radar图支持 tabs
- Updated dependencies
  - @so-chart/tabs@1.0.37
  - @so-chart/utils@1.0.40

## 1.0.22

### Patch Changes

- Updated dependencies
  - @so-chart/utils@1.0.40

## 1.0.21

### Patch Changes

- Updated dependencies
  - @so-chart/utils@1.0.39

## 1.0.20

### Patch Changes

- Updated dependencies
  - @so-chart/utils@1.0.38

## 1.0.19

### Patch Changes

- 增加 progress
- Updated dependencies
  - @so-chart/utils@1.0.37

## 1.0.18

### Patch Changes

- 实现 line mark
- Updated dependencies
  - @so-chart/utils@1.0.36

## 1.0.17

### Patch Changes

- 修复传入的container可能未渲染的问题
- Updated dependencies
  - @so-chart/utils@1.0.35

## 1.0.16

### Patch Changes

- 抗锯齿
- Updated dependencies
  - @so-chart/utils@1.0.34

## 1.0.15

### Patch Changes

- 解决问题
  1. 解决tick算出来的文本为undefined也绘制在页面上
  2. 解决折线图、散点图 mapping tick坐标轴文字过多重叠问题
  3. 解决折线图 datasets里的label没设置可选
  - @so-chart/utils@1.0.33

## 1.0.14

### Patch Changes

- resize执行等待时间 50->200
  - @so-chart/utils@1.0.33

## 1.0.13

### Patch Changes

- Updated dependencies
  - @so-chart/utils@1.0.33

## 1.0.12

### Patch Changes

- 优化打包体积

## 1.0.11

### Patch Changes

- Updated dependencies
  - @so-chart/utils@1.0.32

## 1.0.10

### Patch Changes

- Updated dependencies
  - @so-chart/utils@1.0.31

## 1.0.9

### Patch Changes

- 优化包体积

## 1.0.8

### Patch Changes

- d3不作为external

## 1.0.7

### Patch Changes

- 分包&文档
- Updated dependencies
  - @so-chart/utils@1.0.30

## 1.0.6

### Patch Changes

- radar图提取单独的包，以及radar图文档编写
- Updated dependencies
  - @so-chart/utils@1.0.29
  - @so-chart/axis@1.0.24

## 1.0.5

### Patch Changes

- 添加动画

## 1.0.4

### Patch Changes

- 开启抗锯齿

## 1.0.3

### Patch Changes

- 调整雷达图

## 1.0.2

### Patch Changes

- 优化编译产物

## 1.0.1

### Patch Changes

- 优化打包体积
