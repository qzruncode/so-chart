# 搜索 Tabs

`@so-chart/tabs` 只负责图表内部的 Tabs 绘制，不包含搜索、分页或详情按钮等业务面板。发布包使用原生 DOM 实现，不要求宿主安装或运行 React。

## 内置图例选择模式

`labels.selectionMode` 控制带坐标轴图表的内置图例点击行为：

- `single`：默认值。点击某项后仅展示该数据集，再次点击同一项恢复全部数据集。
- `multiple`：每次点击只切换对应数据集的显隐状态，允许同时展示任意多项，也允许全部隐藏；全部隐藏时恢复原始 Y 轴范围。

```ts
labels: {
  selectionMode: 'multiple',
}
```

饼图和雷达图沿用原有的逐项切换行为，不受该配置影响。当前示例的图表已启用 `multiple`，可以直接点击图表下方图例验证。

## 业务侧搜索面板

搜索面板应由调用方实现。调用方直接读取 `chart.labels.data`，维护搜索词和分页状态；点击标签时修改 `chart.datasets[*].show`，再调用对应图表实例的刷新方法。

预览站的 [Search.tsx](../examples/Search.tsx) 是一个 React + Ant Design 调用方示例：搜索和分页状态留在示例中，详情按钮也由示例自行创建。真实项目可以替换为自己的 UI 框架。

```ts
const labels = chart.labels.data;
const filtered = labels.filter(label => label.toLowerCase().includes(searchValue.toLowerCase()));

function selectSeries(index: number) {
  chart.datasets.forEach((dataset, datasetIndex) => {
    dataset.show = datasetIndex === index;
  });
  chart.refreshLine();
}
```

搜索只过滤面板中的标签，分页不会改变图表原始数据。业务侧可以按需要增加详情按钮、路由跳转或权限判断，不受图表包 UI 约束。

## 详情按钮与安全边界

详情按钮完全由调用方创建。DOM 调用方应使用 `textContent` 设置数据文本；React 调用方应使用文本节点或 JSX 文本，不要把不可信内容拼接为 HTML。

```ts
const button = document.createElement('button');
button.type = 'button';
button.textContent = `查看 ${label}`;
button.addEventListener('click', event => {
  event.stopPropagation();
  openDetail(index);
});
```

`drawTabs(chart)` 是 line、bar、pie、point 和 radar 图表内部使用的标签栏入口。标签内容超出可视宽度时才显示滚动箭头：最左端只显示右箭头，滚动到最右端只显示左箭头，没有溢出时两个箭头都隐藏。图表的 `dispose()` 会同步清理它创建的 DOM、事件监听器和 `ResizeObserver`；将 `labels.show` 更新为 `false` 也会销毁已有标签栏。

## CSP

标签栏样式会复用图表实例上的 `nonce`。包不会生成 nonce；宿主应通过图表配置或项目既有的 CSP nonce 注入逻辑提供它。
