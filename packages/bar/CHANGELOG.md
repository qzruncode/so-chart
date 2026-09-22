# @so-chart/bar

## 1.1.3

### Patch Changes

- 接入内置图例的多选显隐配置，并声明对新版 tabs、types 和 utils 的依赖。

- be55d66: Prepare the chart packages for the public open-source distribution.
- Updated dependencies [be55d66]
  - @so-chart/tabs@2.0.1
  - @so-chart/tooltip@1.0.48
  - @so-chart/types@2.2.2
  - @so-chart/utils@2.0.9

## 1.1.2

### Patch Changes

- 移除 `@so-chart/tabs` 对 React、React DOM 和 Ant Design 的运行时依赖。`@so-chart/tabs` 现在只负责图表内置 Tabs 的绘制与销毁；搜索、分页和详情按钮等业务交互移交调用方实现。

  同时优化内置 Tabs 的横向滚动控制样式与边界状态，并确保关闭标签栏时清理旧控制器。

- Updated dependencies
  - @so-chart/tabs@2.0.0

## 1.1.1

### Patch Changes

- 5539a01: 统一外部 CSP nonce 解析：支持复用宿主资源上的 nonce，保留旧的全局变量兼容，并让显式图表 nonce 优先。
- 5539a01: 优化基础图表动画帧、Canvas 提交、Tooltip 缓存、指针事件合并和高频命中检测，减少快速 hover 与重复 setOption 的无效工作。
- 5539a01: 各图表包入口导出对应的公开 TypeScript 类型，并将跨包类型依赖标记为 type-only，收敛类型包的公共边界。
- 5539a01: 修复分组柱状图在组间空白区域 hover 时 Tooltip 闪烁隐藏的问题
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

## 1.1.0

### Minor Changes

- Support adaptive circle stacked bar layout

### Patch Changes

- Updated dependencies
  - @so-chart/types@2.1.0

## 1.0.78

### Patch Changes

- 补充 2026-08-10 `b86854e` 已合入但尚未版本化的图表包变更。
- Updated dependencies
  - @so-chart/tabs@1.0.53
  - @so-chart/tooltip@1.0.46
  - @so-chart/types@2.0.12
  - @so-chart/utils@2.0.7

## 1.0.77

### Patch Changes

- Updated dependencies
  - @so-chart/tooltip@1.0.45
  - @so-chart/utils@2.0.6
  - @so-chart/tabs@1.0.52

## 1.0.76

### Patch Changes

- 修改主题色的css变量
- Updated dependencies
  - @so-chart/tooltip@1.0.44
  - @so-chart/utils@2.0.5
  - @so-chart/tabs@1.0.51

## 1.0.75

### Patch Changes

- 支持暗黑主题
- Updated dependencies
  - @so-chart/tooltip@1.0.43
  - @so-chart/utils@2.0.4
  - @so-chart/tabs@1.0.50

## 1.0.74

### Patch Changes

- Updated dependencies
  - @so-chart/tabs@1.0.49

## 1.0.73

### Patch Changes

- Updated dependencies
  - @so-chart/tabs@1.0.48

## 1.0.72

### Patch Changes

- Updated dependencies
  - @so-chart/tabs@1.0.47

## 1.0.71

### Patch Changes

- Updated dependencies
  - @so-chart/tabs@1.0.46

## 1.0.70

### Patch Changes

- 增加搜索 tab
- Updated dependencies
  - @so-chart/tooltip@1.0.42
  - @so-chart/utils@2.0.3
  - @so-chart/tabs@1.0.45

## 1.0.69

### Patch Changes

- Updated dependencies
  - @so-chart/tooltip@1.0.41
  - @so-chart/tabs@1.0.44

## 1.0.68

### Patch Changes

- 优化打包
- Updated dependencies
  - @so-chart/tooltip@1.0.40
  - @so-chart/tabs@1.0.43

## 1.0.67

### Patch Changes

- Updated dependencies
  - @so-chart/tooltip@1.0.39
  - @so-chart/utils@2.0.2
  - @so-chart/tabs@1.0.42

## 1.0.66

### Patch Changes

- 设置全局 **CSP_NONCE**
- Updated dependencies
  - @so-chart/utils@2.0.1

## 1.0.65

### Patch Changes

- 支持传 nonce id
- Updated dependencies
  - @so-chart/tooltip@1.0.38
  - @so-chart/tabs@1.0.41
  - @so-chart/utils@2.0.0

## 1.0.64

### Patch Changes

- 调整坐标轴默认字体大小由 10->12

## 1.0.63

### Patch Changes

- Updated dependencies
  - @so-chart/tooltip@1.0.37

## 1.0.62

### Patch Changes

- Updated dependencies
  - @so-chart/utils@2.0.0
  - @so-chart/tabs@1.0.40
  - @so-chart/tooltip@1.0.36

## 1.0.61

### Patch Changes

- Updated dependencies
  - @so-chart/tabs@1.0.40

## 1.0.60

### Patch Changes

- 调整趋势柱状图数据结构
  - @so-chart/tabs@1.0.39
  - @so-chart/tooltip@1.0.36
  - @so-chart/utils@1.0.43

## 1.0.59

### Patch Changes

- 趋势柱状图,tooltip 支持配置 dotColor
- Updated dependencies
  - @so-chart/tooltip@1.0.36
  - @so-chart/tabs@1.0.39
  - @so-chart/utils@1.0.43

## 1.0.58

### Patch Changes

- Updated dependencies
  - @so-chart/tooltip@1.0.35

## 1.0.57

### Patch Changes

- Updated dependencies
  - @so-chart/tabs@1.0.39

## 1.0.56

### Patch Changes

- Updated dependencies
  - @so-chart/utils@1.0.43
  - @so-chart/tabs@1.0.38
  - @so-chart/tooltip@1.0.34

## 1.0.55

### Patch Changes

- 柱状图支持 yAxis title
  - @so-chart/tabs@1.0.37
  - @so-chart/tooltip@1.0.34
  - @so-chart/utils@1.0.42

## 1.0.54

### Patch Changes

- 修复堆叠柱状图 bug

## 1.0.53

### Patch Changes

- Updated dependencies
  - @so-chart/utils@1.0.42

## 1.0.52

### Patch Changes

- 修复 stackbar bug

## 1.0.51

### Patch Changes

- 修复 trendBar bug

## 1.0.50

### Patch Changes

- 添加趋势柱状图
- Updated dependencies
  - @so-chart/tooltip@1.0.34
  - @so-chart/tabs@1.0.37
  - @so-chart/utils@1.0.41

## 1.0.49

### Patch Changes

- bar图添加 mark & 修复一些 bug
- Updated dependencies
  - @so-chart/tooltip@1.0.33
  - @so-chart/utils@1.0.41
  - @so-chart/tabs@1.0.37

## 1.0.48

### Patch Changes

- Updated dependencies
  - @so-chart/tabs@1.0.37
  - @so-chart/tooltip@1.0.32
  - @so-chart/utils@1.0.40

## 1.0.47

### Patch Changes

- resize 的时候宽度如果没有变化，不刷新; tabs 需要改成随宽度自适应
- Updated dependencies
  - @so-chart/utils@1.0.40
  - @so-chart/tabs@1.0.36
  - @so-chart/tooltip@1.0.32

## 1.0.46

### Patch Changes

- Updated dependencies
  - @so-chart/tooltip@1.0.32
  - @so-chart/utils@1.0.39
  - @so-chart/tabs@1.0.35

## 1.0.45

### Patch Changes

- Updated dependencies
  - @so-chart/utils@1.0.38
  - @so-chart/tabs@1.0.35
  - @so-chart/tooltip@1.0.31

## 1.0.44

### Patch Changes

- 增加 progress
- Updated dependencies
  - @so-chart/utils@1.0.37
  - @so-chart/tabs@1.0.34
  - @so-chart/tooltip@1.0.31

## 1.0.43

### Patch Changes

- 实现 line mark
- Updated dependencies
  - @so-chart/tabs@1.0.34
  - @so-chart/tooltip@1.0.31
  - @so-chart/utils@1.0.36

## 1.0.42

### Patch Changes

- 修复传入的container可能未渲染的问题
- Updated dependencies
  - @so-chart/utils@1.0.35

## 1.0.41

### Patch Changes

- 抗锯齿
- Updated dependencies
  - @so-chart/utils@1.0.34

## 1.0.40

### Patch Changes

- 解决问题
  1. 解决tick算出来的文本为undefined也绘制在页面上
  2. 解决折线图、散点图 mapping tick坐标轴文字过多重叠问题
  3. 解决折线图 datasets里的label没设置可选
- Updated dependencies
  - @so-chart/tabs@1.0.33
  - @so-chart/tooltip@1.0.30
  - @so-chart/utils@1.0.33

## 1.0.39

### Patch Changes

- 优化bar x轴tickLine

## 1.0.38

### Patch Changes

- 修复bar x轴文字计算 分辨率

## 1.0.37

### Patch Changes

- resize执行等待时间 50->200
  - @so-chart/tabs@1.0.32
  - @so-chart/tooltip@1.0.30
  - @so-chart/utils@1.0.33

## 1.0.36

### Patch Changes

- 柱状图检测算法、柱状图阴影边没选中、label支持关闭
- Updated dependencies
  - @so-chart/utils@1.0.33
  - @so-chart/tabs@1.0.32
  - @so-chart/tooltip@1.0.30

## 1.0.35

### Patch Changes

- 修复 tab y可以滚动、bar图ticks有问题
- Updated dependencies
  - @so-chart/tabs@1.0.32

## 1.0.34

### Patch Changes

- bar、line、point y坐标轴范围支持自动计算
  - @so-chart/tabs@1.0.31
  - @so-chart/tooltip@1.0.30
  - @so-chart/utils@1.0.32

## 1.0.33

### Patch Changes

- Updated dependencies
  - @so-chart/tabs@1.0.31

## 1.0.32

### Patch Changes

- Updated dependencies
  - @so-chart/tabs@1.0.30

## 1.0.31

### Patch Changes

- Updated dependencies
  - @so-chart/tabs@1.0.29

## 1.0.30

### Patch Changes

- Updated dependencies
  - @so-chart/tabs@1.0.28

## 1.0.29

### Patch Changes

- Updated dependencies
  - @so-chart/tooltip@1.0.30

## 1.0.28

### Patch Changes

- 优化包体积
- Updated dependencies
  - @so-chart/tooltip@1.0.29
  - @so-chart/utils@1.0.32

## 1.0.27

### Patch Changes

- 修复部分已知问题
- Updated dependencies
  - @so-chart/tooltip@1.0.28

## 1.0.26

### Patch Changes

- 优化动画效果
- Updated dependencies
  - @so-chart/utils@1.0.31

## 1.0.25

### Patch Changes

- 优化包体积

## 1.0.24

### Patch Changes

- d3不作为external

## 1.0.23

### Patch Changes

- 修复打包问题

## 1.0.22

### Patch Changes

- 分包&文档
- Updated dependencies
  - @so-chart/tooltip@1.0.27
  - @so-chart/utils@1.0.30
  - @so-chart/tabs@1.0.27

## 1.0.21

### Patch Changes

- 修复bar图自动缩小柱状图宽度

## 1.0.20

### Patch Changes

- 添加动画

## 1.0.19

### Patch Changes

- Updated dependencies
  - @so-chart/axis@1.0.22

## 1.0.18

### Patch Changes

- Updated dependencies
  - @so-chart/axis@1.0.21

## 1.0.17

### Patch Changes

- 开启抗锯齿
- Updated dependencies
  - @so-chart/axis@1.0.20

## 1.0.16

### Patch Changes

- Updated dependencies
  - @so-chart/axis@1.0.19

## 1.0.15

### Patch Changes

- 日历图、饼图、柱状图优化 & 添加色系
  - @so-chart/axis@1.0.18

## 1.0.14

### Patch Changes

- 优化柱状图展示
  - @so-chart/axis@1.0.18

## 1.0.13

### Patch Changes

- Updated dependencies
  - @so-chart/axis@1.0.18

## 1.0.12

### Patch Changes

- 优化柱状图、饼图、日历图展示
  - @so-chart/axis@1.0.17

## 1.0.11

### Patch Changes

- 优化编译产物
- Updated dependencies
  - @so-chart/axis@1.0.17

## 1.0.10

### Patch Changes

- 添加dagre图
  - @so-chart/axis@1.0.16

## 1.0.9

### Patch Changes

- 优化打包体积
- Updated dependencies
  - @so-chart/axis@1.0.16

## 1.0.8

### Patch Changes

- 优化tooltip canvas -> svg
  - @so-chart/axis@1.0.15

## 1.0.7

### Patch Changes

- 修复bug

## 1.0.6

### Patch Changes

- tooltip调整

## 1.0.5

### Patch Changes

- 修复bug

## 1.0.4

### Patch Changes

- 添加折线面积图

## 1.0.3

### Patch Changes

- bug修复

## 1.0.2

### Patch Changes

- 添加堆叠柱状图

## 1.0.1

### Patch Changes

- 添加环形堆叠柱状图
