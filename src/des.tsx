import Markdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import tsx from 'react-syntax-highlighter/dist/esm/languages/prism/tsx';
import { prism } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import theme from 'antd/es/theme';
import { useState, useEffect } from 'react';
import { useChartThemeVersion } from './demo/theme';
import type { DemoContentLoader } from './demo/types';

function useDarkMode(): boolean {
  const [isDark, setIsDark] = useState(false);
  const themeVersion = useChartThemeVersion();

  useEffect(() => {
    const check = () => {
      // 读取 Content 区域的实际渲染背景色；主题变化由共享监听器触发检查。
      const content = document.querySelector('[class*="ant-layout-content"]');
      if (!content) return;
      const bg = getComputedStyle(content).backgroundColor;
      const nums = bg.match(/\d+/g);
      if (nums && nums.length >= 3) {
        const brightness = (Number(nums[0]) + Number(nums[1]) + Number(nums[2])) / 3;
        setIsDark(brightness < 128);
      }
    };

    const frameId = window.requestAnimationFrame(check);
    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [themeVersion]);

  return isDark;
}

SyntaxHighlighter.registerLanguage('tsx', tsx);

type RawContentState = { status: 'idle' | 'loading' } | { status: 'ready'; value: string } | { status: 'error'; message: string };

function useRawContent(loader: DemoContentLoader | undefined): RawContentState {
  const [result, setResult] = useState<{ loader: DemoContentLoader; state: Exclude<RawContentState, { status: 'idle' | 'loading' }> }>();

  useEffect(() => {
    let cancelled = false;

    if (!loader) {
      return () => {
        cancelled = true;
      };
    }

    void loader()
      .then(module => {
        if (!cancelled) setResult({ loader, state: { status: 'ready', value: module.default } });
      })
      .catch(error => {
        if (!cancelled) {
          const message = error instanceof Error ? error.message : String(error);
          setResult({ loader, state: { status: 'error', message } });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [loader]);

  if (!loader) return { status: 'idle' };
  return result?.loader === loader ? result.state : { status: 'loading' };
}

function Des(props: { source: DemoContentLoader; handbook?: DemoContentLoader }) {
  const { source, handbook } = props;
  const language = 'tsx';
  const { token } = theme.useToken();
  const isDark = useDarkMode();
  const codeContent = useRawContent(source);
  const handbookContent = useRawContent(handbook);
  const [activeTab, setActiveTab] = useState<'code' | 'doc'>('code');
  const [isSmallScreen, setIsSmallScreen] = useState(() => window.innerWidth < 1600);
  const [isMobileScreen, setIsMobileScreen] = useState(() => window.innerWidth <= 768);
  const [codeExpanded, setCodeExpanded] = useState(false);

  useEffect(() => {
    const checkSize = () => {
      setIsSmallScreen(window.innerWidth < 1600);
      setIsMobileScreen(window.innerWidth <= 768);
    };
    checkSize();
    window.addEventListener('resize', checkSize);
    return () => window.removeEventListener('resize', checkSize);
  }, []);

  const containerStyle = {
    display: 'flex',
    gap: '24px',
  };

  const columnStyle = {
    flex: handbook ? '1 1 50%' : '1 1 100%',
    minWidth: 0,
  };

  const cardStyle = (background: string) => ({
    background,
    borderRadius: '8px',
    padding: '16px',
    border: `1px solid ${token.colorBorderSecondary}`,
  });

  const titleStyle = {
    margin: '0 0 12px 0',
    fontSize: '16px',
    fontWeight: 600,
    color: token.colorTextHeading,
  };

  const scrollStyle = {
    maxHeight: 500,
    overflow: 'auto' as const,
    borderRadius: '6px',
  };

  const tabContainerStyle = {
    display: 'flex',
    gap: '8px',
    marginBottom: '16px',
  };

  const tabStyle = (active: boolean) => ({
    padding: '8px 16px',
    fontSize: '14px',
    fontWeight: active ? 600 : 400,
    color: active ? token.colorPrimary : token.colorTextSecondary,
    background: active ? token.colorPrimaryBg : 'transparent',
    border: `1px solid ${active ? token.colorPrimary : token.colorBorder}`,
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  });

  const codeToggleStyle = {
    width: '100%',
    minHeight: 44,
    padding: '8px 12px',
    color: token.colorPrimary,
    background: token.colorPrimaryBg,
    border: `1px solid ${token.colorPrimary}`,
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
  };

  const renderCode = () => (
    <div>
      <h4 style={titleStyle}>示例代码</h4>
      <div
        style={{
          ...scrollStyle,
          background: isDark ? '#1e1e1e' : '#f5f2f0',
        }}
      >
        <SyntaxHighlighter
          style={isDark ? vscDarkPlus : prism}
          language={language}
          customStyle={{
            borderRadius: '6px',
            fontSize: '13px',
            lineHeight: '1.5',
            margin: 0,
            background: 'transparent',
          }}
        >
          {codeContent.status === 'ready' ? codeContent.value : ''}
        </SyntaxHighlighter>
        {codeContent.status === 'loading' && <div style={{ padding: 16, color: token.colorTextSecondary }}>示例代码加载中…</div>}
        {codeContent.status === 'error' && <div style={{ padding: 16, color: token.colorError }}>示例代码加载失败：{codeContent.message}</div>}
      </div>
    </div>
  );

  const renderDoc = () => (
    <div>
      <h4 style={titleStyle}>参数说明</h4>
      <div
        style={{
          ...scrollStyle,
          ...cardStyle(token.colorBgLayout),
        }}
      >
        <Markdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight]}
          components={{
            h1: ({ children }) => (
              <h1
                style={{
                  fontSize: '20px',
                  fontWeight: 600,
                  color: token.colorTextHeading,
                  marginTop: 0,
                }}
              >
                {children}
              </h1>
            ),
            h2: ({ children }) => (
              <h2
                style={{
                  fontSize: '18px',
                  fontWeight: 600,
                  color: token.colorTextHeading,
                  marginTop: '24px',
                }}
              >
                {children}
              </h2>
            ),
            h3: ({ children }) => (
              <h3
                style={{
                  fontSize: '16px',
                  fontWeight: 600,
                  color: token.colorTextHeading,
                  marginTop: '16px',
                }}
              >
                {children}
              </h3>
            ),
            p: ({ children }) => <p style={{ color: token.colorText, lineHeight: '1.8' }}>{children}</p>,
            table: ({ children }) => (
              <table
                style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  margin: '16px 0',
                }}
              >
                {children}
              </table>
            ),
            th: ({ children }) => (
              <th
                style={{
                  padding: '12px 16px',
                  textAlign: 'left',
                  fontWeight: 600,
                  color: token.colorTextHeading,
                  background: token.colorBgLayout,
                  border: `1px solid ${token.colorBorderSecondary}`,
                }}
              >
                {children}
              </th>
            ),
            td: ({ children }) => (
              <td
                style={{
                  padding: '12px 16px',
                  color: token.colorText,
                  border: `1px solid ${token.colorBorderSecondary}`,
                }}
              >
                {children}
              </td>
            ),
          }}
        >
          {handbookContent.status === 'ready' ? handbookContent.value : ''}
        </Markdown>
        {handbookContent.status === 'loading' && <div style={{ color: token.colorTextSecondary }}>参数说明加载中…</div>}
        {handbookContent.status === 'error' && <div style={{ color: token.colorError }}>参数说明加载失败：{handbookContent.message}</div>}
      </div>
    </div>
  );

  const showCode = !isMobileScreen || codeExpanded;

  return (
    <div className="des" style={containerStyle}>
      {isMobileScreen && (
        <button
          className="des__code-toggle"
          type="button"
          style={codeToggleStyle}
          aria-expanded={codeExpanded}
          onClick={() => setCodeExpanded(prev => !prev)}
        >
          {codeExpanded ? '收起示例代码' : '查看示例代码'}
        </button>
      )}

      {showCode &&
        (isSmallScreen && handbook ? (
          <div style={{ flex: '1 1 100%', minWidth: 0 }}>
            <div style={tabContainerStyle}>
              <button style={tabStyle(activeTab === 'code')} onClick={() => setActiveTab('code')}>
                示例代码
              </button>
              <button style={tabStyle(activeTab === 'doc')} onClick={() => setActiveTab('doc')}>
                参数说明
              </button>
            </div>
            {activeTab === 'code' ? renderCode() : renderDoc()}
          </div>
        ) : (
          <>
            <div style={columnStyle}>{renderCode()}</div>
            {handbook && <div style={columnStyle}>{renderDoc()}</div>}
          </>
        ))}
    </div>
  );
}

export default Des;
