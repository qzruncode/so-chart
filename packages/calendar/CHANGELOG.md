# @so-chart/calendar

## 1.0.55

### Patch Changes

- 5539a01: 统一外部 CSP nonce 解析：支持复用宿主资源上的 nonce，保留旧的全局变量兼容，并让显式图表 nonce 优先。
- dd8bff6: 增加日历热力图日期方块的 hover 高亮交互
- 5539a01: 各图表包入口导出对应的公开 TypeScript 类型，并将跨包类型依赖标记为 type-only，收敛类型包的公共边界。
- 5539a01: 统一日历图和桑基图的实例生命周期，收回仪表盘与进度图的内部 DOM 清理导出，并转义共享 Tooltip 生成内容中的动态文本。
- 5539a01: 统一独立 Tooltip 实现的屏幕间距、边界避让和跟随动画
- Updated dependencies [5539a01]
- Updated dependencies [5539a01]
- Updated dependencies [dd8bff6]
- Updated dependencies [5539a01]
- Updated dependencies [5539a01]
- Updated dependencies [5539a01]
  - @so-chart/utils@2.0.8
  - @so-chart/types@2.2.0

## 1.0.54

### Patch Changes

- 补充 2026-08-10 `b86854e` 已合入但尚未版本化的图表包变更。
- Updated dependencies
  - @so-chart/types@2.0.12
  - @so-chart/utils@2.0.7

## 1.0.53

### Patch Changes

- 优化cli
- Updated dependencies
  - @so-chart/utils@2.0.6

## 1.0.52

### Patch Changes

- Updated dependencies
  - @so-chart/utils@2.0.5

## 1.0.51

### Patch Changes

- Updated dependencies
  - @so-chart/utils@2.0.4

## 1.0.50

### Patch Changes

- 增加搜索 tab
- Updated dependencies
  - @so-chart/utils@2.0.3

## 1.0.49

### Patch Changes

- 优化打包

## 1.0.48

### Patch Changes

- csp
- Updated dependencies
  - @so-chart/utils@2.0.2

## 1.0.47

### Patch Changes

- 设置全局 **CSP_NONCE**
- Updated dependencies
  - @so-chart/utils@2.0.1

## 1.0.46

### Patch Changes

- 支持传 nonce id
  - @so-chart/utils@2.0.0

## 1.0.45

### Patch Changes

- Updated dependencies
  - @so-chart/utils@2.0.0

## 1.0.44

### Patch Changes

- Updated dependencies
  - @so-chart/utils@1.0.43

## 1.0.43

### Patch Changes

- Updated dependencies
  - @so-chart/utils@1.0.42

## 1.0.42

### Patch Changes

- Updated dependencies
  - @so-chart/utils@1.0.41

## 1.0.41

### Patch Changes

- Updated dependencies
  - @so-chart/utils@1.0.40

## 1.0.40

### Patch Changes

- Updated dependencies
  - @so-chart/utils@1.0.39

## 1.0.39

### Patch Changes

- Updated dependencies
  - @so-chart/utils@1.0.38

## 1.0.38

### Patch Changes

- 增加 progress
- Updated dependencies
  - @so-chart/utils@1.0.37

## 1.0.37

### Patch Changes

- 实现 line mark
- Updated dependencies
  - @so-chart/utils@1.0.36

## 1.0.36

### Patch Changes

- Updated dependencies
  - @so-chart/utils@1.0.35

## 1.0.35

### Patch Changes

- 抗锯齿
- Updated dependencies
  - @so-chart/utils@1.0.34

## 1.0.34

### Patch Changes

- Updated dependencies
  - @so-chart/utils@1.0.33

## 1.0.33

### Patch Changes

- 优化打包体积

## 1.0.32

### Patch Changes

- Updated dependencies
  - @so-chart/utils@1.0.32

## 1.0.31

### Patch Changes

- Updated dependencies
  - @so-chart/utils@1.0.31

## 1.0.30

### Patch Changes

- 优化包体积

## 1.0.29

### Patch Changes

- d3不作为external

## 1.0.28

### Patch Changes

- 日历图增加配置：year.text
  - @so-chart/utils@1.0.30

## 1.0.27

### Patch Changes

- 分包&文档
- Updated dependencies
  - @so-chart/utils@1.0.30

## 1.0.26

### Patch Changes

- Updated dependencies
  - @so-chart/utils@1.0.29
  - @so-chart/axis@1.0.24

## 1.0.25

### Patch Changes

- Updated dependencies
  - @so-chart/utils@1.0.28
  - @so-chart/axis@1.0.23

## 1.0.24

### Patch Changes

- 调整日历图参数和文档
- Updated dependencies
  - @so-chart/utils@1.0.27
  - @so-chart/axis@1.0.23

## 1.0.23

### Patch Changes

- 修复日历图bug

## 1.0.22

### Patch Changes

- 日历图支持不同年份一行展示
- Updated dependencies
  - @so-chart/utils@1.0.26
  - @so-chart/axis@1.0.23

## 1.0.21

### Patch Changes

- 日历图颜色支持color和opacity
- Updated dependencies
  - @so-chart/utils@1.0.25
  - @so-chart/axis@1.0.23

## 1.0.20

### Patch Changes

- Updated dependencies
  - @so-chart/utils@1.0.24
  - @so-chart/axis@1.0.23

## 1.0.19

### Patch Changes

- Updated dependencies
  - @so-chart/utils@1.0.23
  - @so-chart/axis@1.0.22

## 1.0.18

### Patch Changes

- Updated dependencies
  - @so-chart/utils@1.0.22
  - @so-chart/axis@1.0.22

## 1.0.17

### Patch Changes

- Updated dependencies
  - @so-chart/axis@1.0.22

## 1.0.16

### Patch Changes

- Updated dependencies
  - @so-chart/axis@1.0.21

## 1.0.15

### Patch Changes

- Updated dependencies
  - @so-chart/axis@1.0.20

## 1.0.14

### Patch Changes

- Updated dependencies
  - @so-chart/utils@1.0.21

## 1.0.13

### Patch Changes

- Updated dependencies
  - @so-chart/axis@1.0.19

## 1.0.12

### Patch Changes

- 日历图、饼图、柱状图优化 & 添加色系
- Updated dependencies
  - @so-chart/utils@1.0.20
  - @so-chart/axis@1.0.18

## 1.0.11

### Patch Changes

- Updated dependencies
  - @so-chart/utils@1.0.19

## 1.0.10

### Patch Changes

- Updated dependencies
  - @so-chart/utils@1.0.18
  - @so-chart/axis@1.0.18

## 1.0.9

### Patch Changes

- 日历图添加配置参数
- Updated dependencies
  - @so-chart/utils@1.0.17
  - @so-chart/axis@1.0.18

## 1.0.8

### Patch Changes

- 修复日历图bug

## 1.0.7

### Patch Changes

- Updated dependencies
  - @so-chart/utils@1.0.16
  - @so-chart/axis@1.0.18

## 1.0.6

### Patch Changes

- 优化柱状图、饼图、日历图展示
  - @so-chart/axis@1.0.17
  - @so-chart/utils@1.0.15

## 1.0.5

### Patch Changes

- 修复calendar的bug

## 1.0.4

### Patch Changes

- 修复calendar tooltip

## 1.0.3

### Patch Changes

- 修复日历图bug

## 1.0.2

### Patch Changes

- Updated dependencies
  - @so-chart/utils@1.0.15
  - @so-chart/axis@1.0.17

## 1.0.1

### Patch Changes

- Updated dependencies
  - @so-chart/utils@1.0.14
  - @so-chart/axis@1.0.17
