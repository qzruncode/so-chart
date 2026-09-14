import getTreeChart from '@so-chart/tree';
import { useEffect, useRef, useState } from 'react';
import { ChartWrapper } from '../../../../src/demo/ChartWrapper';
import style from '../index.module.less';
import theme from 'antd/es/theme';
import { useChartThemeVersion } from '../../../../src/demo/theme';

const nodehtml = `<div class="${style.node}"><span class="${style.avatar}" aria-hidden="true"></span><div class="${style.title}">Node</div></div>`;

function DagreChart() {
  const ref = useRef<HTMLDivElement>(null);
  const { token } = theme.useToken();
  const themeVersion = useChartThemeVersion();
  const [nodes, setNodes] = useState([
    { id: 'a', html: nodehtml },
    { id: 'b', html: nodehtml },
    { id: 'c', html: nodehtml },
    { id: 'd', html: nodehtml },
    { id: 'e', html: nodehtml },
    { id: 'f', html: nodehtml },
    { id: 'g', html: nodehtml },
  ]);
  const [edges, setEdges] = useState([
    { source: 'a', target: 'b', label: 'fadfadfs', color: 'pink', dash: '3,3' },
    { source: 'a', target: 'c', color: 'green' },
    { source: 'a', target: 'd', color: 'red', dash: '3,3' },
    { source: 'b', target: 'c', color: 'green' },
    { source: 'b', target: 'd', color: 'green', dash: '3,3' },
    { source: 'b', target: 'e', color: 'green' },
    { source: 'e', target: 'f', color: 'green', minlen: 3, label: 'longlonglonglongtext' },
    { source: 'g', target: 'e' },
  ]);

  useEffect(() => {
    const container = ref.current;
    if (container) {
      const chart = getTreeChart({
        container,
        chartType: 'dagre',
        layout: {
          height: 400,
        },
      });
      chart.setOption({
        datasets: { nodes, edges },
      });
      chart.on('mousemove', (_position, nodeId) => {
        chart.setTooltip({
          html: `<div class="${style.tooltip}">${nodeId}</div>`,
          nodeId,
        });
      });
      return () => chart.dispose();
    }
  }, [nodes, edges, themeVersion]);

  const buttonStyle: React.CSSProperties = {
    padding: '8px 16px',
    background: token.colorPrimary,
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
  };

  return (
    <div>
      <button
        style={buttonStyle}
        onClick={() => {
          const id = Date.now().toString();
          setNodes(pre => [...pre, { id, html: nodehtml }]);
          setEdges(pre => [...pre, { source: 'f', target: id }]);
        }}
      >
        增加元素
      </button>
      <ChartWrapper
        title="Dagre 布局图"
        description="自动布局的有向图，支持节点拖拽、空白区域平移、连线文字选择、触摸缩放和动态添加节点"
        height={400}
      >
        <div ref={ref} style={{ height: '100%', position: 'relative', overflow: 'hidden' }} />
      </ChartWrapper>
    </div>
  );
}

export default DagreChart;
