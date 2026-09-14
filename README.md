# so-chart

基于 D3、Canvas 和 SVG 的图表组件 monorepo。图表包采用命令式实例 API：创建实例、设置配置、响应尺寸变化，并在组件卸载时调用 `dispose()`。

## 特性

- Canvas 图表与 SVG 图表并存，适合数据展示和交互式可视化。
- 统一的 `setOption`、`resize` 和 `dispose` 生命周期。
- 每个图表包独立构建、独立发布，并直接导出公开 TypeScript 类型。
- 包内示例和说明由各包维护，预览站通过 manifest 自动聚合。
- 共享 Tooltip、CSP nonce、尺寸计算和渲染工具。

## 快速开始

环境要求：Node.js `>=22.22.2 <26`，pnpm 9。

```bash
pnpm install --frozen-lockfile
pnpm dev
```

默认预览地址为 `http://127.0.0.1:5173`。也可以使用根目录脚本管理本地服务：

```bash
./dev.sh start
./dev.sh restart
./dev.sh stop
```

## 最小示例

下面示例展示折线图的基本生命周期：

```tsx
import { useEffect, useRef } from 'react';
import getLineChart from '@so-chart/line';

export function LineChart() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const chart = getLineChart({
      container,
      chartType: 'line',
      layout: { height: 320 },
    });

    chart.setOption({
      xAxis: { type: 'value', data: [0, 1, 2] },
      yAxis: { type: 'value', data: { start: 0, end: 100 } },
      datasets: [{ label: 'Series', data: [20, 45, 80] }],
    });

    return () => chart.dispose();
  }, []);

  return <div ref={containerRef} style={{ height: 320 }} />;
}
```

宿主应用负责提供容器尺寸，并在组件卸载或重新创建图表前调用 `dispose()`，以释放事件监听器、动画帧、观察器和 SVG/Canvas 资源。

## 图表包

| 包                   | 类型                      |
| -------------------- | ------------------------- |
| `@so-chart/bar`      | 柱状图                    |
| `@so-chart/calendar` | 日历图                    |
| `@so-chart/guage`    | 仪表图                    |
| `@so-chart/line`     | 折线图                    |
| `@so-chart/pie`      | 饼图                      |
| `@so-chart/point`    | 散点图                    |
| `@so-chart/progress` | 进度图和滑块              |
| `@so-chart/radar`    | 雷达图                    |
| `@so-chart/sankey`   | 桑基图                    |
| `@so-chart/tree`     | 树图和流程图              |
| `@so-chart/tabs`     | 图表内置标签栏            |
| `@so-chart/tooltip`  | 共享 Tooltip 和 mark 绘制 |
| `@so-chart/types`    | 共享 TypeScript 类型      |
| `@so-chart/utils`    | 共享工具                  |

`@so-chart/guage` 的包名保留现有拼写，以避免改变已有调用方的导入路径；如果未来发布全新兼容包，可以再单独提供正确拼写的 `gauge` 别名。

每个发布包的具体配置和行为请以对应包的 README、公开入口和 `demo/docs` 为准。`demo` 目录只属于开发预览，不会进入发布包运行时入口。

## 示例和预览站

预览站从各包的 `demo/manifest.ts` 自动聚合示例和说明。新增或修改图表包时，请同步更新对应的示例、说明和 manifest。

公开预览站：[qzruncode.github.io/so-chart](https://qzruncode.github.io/so-chart/)。`prod` 分支的每次更新都会通过 GitHub Actions 构建并部署到 GitHub Pages。

单独启动某个包的 Demo：

```bash
pnpm --filter @so-chart/line dev
```

## 安全边界

共享 Tooltip 会转义数据集标签、格式化值、扩展文本和坐标标题。树图节点的 `html`、自定义 Tooltip HTML 等显式 HTML 回调属于可信内容边界；如果内容来自用户输入，宿主应用必须先自行转义或清洗。

图表包不会生成 CSP nonce。宿主可以传入显式 `nonce`，或让图表复用页面已有资源的 nonce。

## 开发和验证

```bash
pnpm lint
pnpm test
pnpm build
pnpm run preview:build
```

变更图表包源码、公开类型或行为时，请同步包内 README、可运行示例和 `demo/docs`。不要提交 `dist`、构建缓存、个人配置、凭据或真实业务数据。

## 版本发布

发布包使用 Changesets：

```bash
pnpm changeset
pnpm changeset:version
pnpm changeset:publish
```

发布前请确认包名、版本、依赖和 npm registry 配置均指向公共环境。不要把 registry token 写入仓库文件或提交历史。

## 参与贡献

请阅读 [`CONTRIBUTING.md`](./CONTRIBUTING.md) 和 [`SECURITY.md`](./SECURITY.md)。公开分支同步边界见 [`PUBLIC_SYNC.md`](./PUBLIC_SYNC.md)。

## 许可证

本项目使用 ISC License，详见 [`LICENSE`](./LICENSE)。
