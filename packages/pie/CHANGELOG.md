# @so-chart/pie

## 2.0.18

### Patch Changes

- be55d66: Prepare the chart packages for the public open-source distribution.
- 统一依赖最新的图例、类型、工具与 Tooltip 包，避免消费项目同时安装多套基础包。
- Updated dependencies [be55d66]
  - @so-chart/tabs@2.1.0
  - @so-chart/tooltip@1.0.48
  - @so-chart/types@2.3.0
  - @so-chart/utils@2.0.9

## 2.0.17

### Patch Changes

- 移除 `@so-chart/tabs` 对 React、React DOM 和 Ant Design 的运行时依赖。`@so-chart/tabs` 现在只负责图表内置 Tabs 的绘制与销毁；搜索、分页和详情按钮等业务交互移交调用方实现。

  同时优化内置 Tabs 的横向滚动控制样式与边界状态，并确保关闭标签栏时清理旧控制器。

- Updated dependencies
  - @so-chart/tabs@2.0.0

## 2.0.16

### Patch Changes

- 5539a01: 统一外部 CSP nonce 解析：支持复用宿主资源上的 nonce，保留旧的全局变量兼容，并让显式图表 nonce 优先。
- 5539a01: 优化基础图表动画帧、Canvas 提交、Tooltip 缓存、指针事件合并和高频命中检测，减少快速 hover 与重复 setOption 的无效工作。
- 5539a01: 各图表包入口导出对应的公开 TypeScript 类型，并将跨包类型依赖标记为 type-only，收敛类型包的公共边界。
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

## 2.0.15

### Patch Changes

- 补充 2026-08-10 `b86854e` 已合入但尚未版本化的图表包变更。
- Updated dependencies
  - @so-chart/tabs@1.0.53
  - @so-chart/tooltip@1.0.46
  - @so-chart/types@2.0.12
  - @so-chart/utils@2.0.7

## 2.0.14

### Patch Changes

- Updated dependencies
  - @so-chart/tooltip@1.0.45
  - @so-chart/utils@2.0.6
  - @so-chart/tabs@1.0.52

## 2.0.13

### Patch Changes

- Updated dependencies
  - @so-chart/tooltip@1.0.44
  - @so-chart/utils@2.0.5
  - @so-chart/tabs@1.0.51

## 2.0.12

### Patch Changes

- 支持暗黑主题
- Updated dependencies
  - @so-chart/tooltip@1.0.43
  - @so-chart/utils@2.0.4
  - @so-chart/tabs@1.0.50

## 2.0.11

### Patch Changes

- Updated dependencies
  - @so-chart/tabs@1.0.49

## 2.0.10

### Patch Changes

- Updated dependencies
  - @so-chart/tabs@1.0.48

## 2.0.9

### Patch Changes

- Updated dependencies
  - @so-chart/tabs@1.0.47

## 2.0.8

### Patch Changes

- Updated dependencies
  - @so-chart/tabs@1.0.46

## 2.0.7

### Patch Changes

- 增加搜索 tab
- Updated dependencies
  - @so-chart/tooltip@1.0.42
  - @so-chart/utils@2.0.3
  - @so-chart/tabs@1.0.45

## 2.0.6

### Patch Changes

- Updated dependencies
  - @so-chart/tooltip@1.0.41
  - @so-chart/tabs@1.0.44

## 2.0.5

### Patch Changes

- 优化打包
- Updated dependencies
  - @so-chart/tooltip@1.0.40
  - @so-chart/tabs@1.0.43

## 2.0.4

### Patch Changes

- csp
- Updated dependencies
  - @so-chart/tooltip@1.0.39
  - @so-chart/utils@2.0.2
  - @so-chart/tabs@1.0.42

## 2.0.3

### Patch Changes

- 设置全局 **CSP_NONCE**
- Updated dependencies
  - @so-chart/utils@2.0.1

## 2.0.2

### Patch Changes

- 支持传 nonce id
- Updated dependencies
  - @so-chart/tooltip@1.0.38
  - @so-chart/tabs@1.0.41
  - @so-chart/utils@2.0.0

## 2.0.1

### Patch Changes

- Updated dependencies
  - @so-chart/tooltip@1.0.37

## 2.0.0

### Major Changes

- 环形饼图支持未选中展示总量

### Patch Changes

- Updated dependencies
  - @so-chart/utils@2.0.0
  - @so-chart/tabs@1.0.40
  - @so-chart/tooltip@1.0.36

## 1.0.50

### Patch Changes

- Updated dependencies
  - @so-chart/tabs@1.0.40

## 1.0.49

### Patch Changes

- Updated dependencies
  - @so-chart/tooltip@1.0.36
  - @so-chart/tabs@1.0.39
  - @so-chart/utils@1.0.43

## 1.0.48

### Patch Changes

- Updated dependencies
  - @so-chart/tooltip@1.0.35

## 1.0.47

### Patch Changes

- Updated dependencies
  - @so-chart/tabs@1.0.39

## 1.0.46

### Patch Changes

- Updated dependencies
  - @so-chart/utils@1.0.43
  - @so-chart/tabs@1.0.38
  - @so-chart/tooltip@1.0.34

## 1.0.45

### Patch Changes

- Updated dependencies
  - @so-chart/utils@1.0.42

## 1.0.44

### Patch Changes

- Updated dependencies
  - @so-chart/tooltip@1.0.34
  - @so-chart/tabs@1.0.37
  - @so-chart/utils@1.0.41

## 1.0.43

### Patch Changes

- Updated dependencies
  - @so-chart/tooltip@1.0.33
  - @so-chart/utils@1.0.41
  - @so-chart/tabs@1.0.37

## 1.0.42

### Patch Changes

- Updated dependencies
  - @so-chart/tabs@1.0.37
  - @so-chart/tooltip@1.0.32
  - @so-chart/utils@1.0.40

## 1.0.41

### Patch Changes

- resize 的时候宽度如果没有变化，不刷新; tabs 需要改成随宽度自适应
- Updated dependencies
  - @so-chart/utils@1.0.40
  - @so-chart/tabs@1.0.36
  - @so-chart/tooltip@1.0.32

## 1.0.40

### Patch Changes

- Updated dependencies
  - @so-chart/tooltip@1.0.32
  - @so-chart/utils@1.0.39
  - @so-chart/tabs@1.0.35

## 1.0.39

### Patch Changes

- pie 优化
- Updated dependencies
  - @so-chart/utils@1.0.38
  - @so-chart/tabs@1.0.35
  - @so-chart/tooltip@1.0.31

## 1.0.38

### Patch Changes

- 增加 progress
- Updated dependencies
  - @so-chart/utils@1.0.37
  - @so-chart/tabs@1.0.34
  - @so-chart/tooltip@1.0.31

## 1.0.37

### Patch Changes

- 实现 line mark
- Updated dependencies
  - @so-chart/tabs@1.0.34
  - @so-chart/tooltip@1.0.31
  - @so-chart/utils@1.0.36

## 1.0.36

### Patch Changes

- 修复传入的container可能未渲染的问题
- Updated dependencies
  - @so-chart/utils@1.0.35

## 1.0.35

### Patch Changes

- 抗锯齿
- Updated dependencies
  - @so-chart/utils@1.0.34

## 1.0.34

### Patch Changes

- 解决问题
  1. 解决tick算出来的文本为undefined也绘制在页面上
  2. 解决折线图、散点图 mapping tick坐标轴文字过多重叠问题
  3. 解决折线图 datasets里的label没设置可选
- Updated dependencies
  - @so-chart/tabs@1.0.33
  - @so-chart/tooltip@1.0.30
  - @so-chart/utils@1.0.33

## 1.0.33

### Patch Changes

- resize执行等待时间 50->200
  - @so-chart/tabs@1.0.32
  - @so-chart/tooltip@1.0.30
  - @so-chart/utils@1.0.33

## 1.0.32

### Patch Changes

- 柱状图检测算法、柱状图阴影边没选中、label支持关闭
- Updated dependencies
  - @so-chart/utils@1.0.33
  - @so-chart/tabs@1.0.32
  - @so-chart/tooltip@1.0.30

## 1.0.31

### Patch Changes

- Updated dependencies
  - @so-chart/tabs@1.0.32

## 1.0.30

### Patch Changes

- Updated dependencies
  - @so-chart/tabs@1.0.31

## 1.0.29

### Patch Changes

- Updated dependencies
  - @so-chart/tabs@1.0.30

## 1.0.28

### Patch Changes

- Updated dependencies
  - @so-chart/tabs@1.0.29

## 1.0.27

### Patch Changes

- Updated dependencies
  - @so-chart/tabs@1.0.28

## 1.0.26

### Patch Changes

- Updated dependencies
  - @so-chart/tooltip@1.0.30

## 1.0.25

### Patch Changes

- 优化打包体积

## 1.0.24

### Patch Changes

- Updated dependencies
  - @so-chart/tooltip@1.0.29
  - @so-chart/utils@1.0.32

## 1.0.23

### Patch Changes

- 修复部分已知问题
- Updated dependencies
  - @so-chart/tooltip@1.0.28

## 1.0.22

### Patch Changes

- Updated dependencies
  - @so-chart/utils@1.0.31

## 1.0.21

### Patch Changes

- 优化包体积

## 1.0.20

### Patch Changes

- d3不作为external

## 1.0.19

### Patch Changes

- 修复打包问题

## 1.0.18

### Patch Changes

- 分包&文档
- Updated dependencies
  - @so-chart/tooltip@1.0.27
  - @so-chart/utils@1.0.30
  - @so-chart/tabs@1.0.27

## 1.0.17

### Patch Changes

- 添加动画

## 1.0.16

### Patch Changes

- 开启抗锯齿

## 1.0.15

### Patch Changes

- 修复pie图bug

## 1.0.14

### Patch Changes

- 优化柱状图、饼图、日历图展示

## 1.0.13

### Patch Changes

- 饼图调整

## 1.0.12

### Patch Changes

- 优化编译产物

## 1.0.11

### Patch Changes

- 添加dagre图

## 1.0.10

### Patch Changes

- 优化打包体积

## 1.0.9

### Patch Changes

- 优化tooltip canvas -> svg

## 1.0.8

### Patch Changes

- 柱状图tabs点击效果修改、饼图提示文字定位算法修复

## 1.0.7

### Patch Changes

- pie的提示文本动态定位

## 1.0.6

### Patch Changes

- 修复bug

## 1.0.5

### Patch Changes

- tooltip调整

## 1.0.4

### Patch Changes

- 修复bug

## 1.0.3

### Patch Changes

- 添加折线面积图

## 1.0.2

### Patch Changes

- 添加仪表盘

## 1.0.1

### Patch Changes

- 添加半环形图
