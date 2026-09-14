import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import React, { useEffect, useLayoutEffect, useState } from 'react';
import { MenuOutlined, MoonOutlined, NotificationOutlined, SunOutlined } from '@ant-design/icons';
import Button from 'antd/es/button';
import ConfigProvider from 'antd/es/config-provider';
import Layout from 'antd/es/layout';
import Menu from 'antd/es/menu';
import theme from 'antd/es/theme';
import { demoPackages, getFirstDemoPath, resolveDemoPackage } from './demo/registry';

const Sider = Layout.Sider;
const Content = Layout.Content;

const menus = [
  {
    key: 'chart',
    icon: React.createElement(NotificationOutlined),
    label: 'so-chart',
    children: demoPackages.map(manifest => ({
      key: manifest.route,
      label: manifest.title,
    })),
  },
];

const App = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isDark, setIsDark] = useState(() => localStorage.getItem('so-chart-theme') === 'dark');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const routeKey = location.pathname.match(/^\/chart\/([^/]+)/)?.[1];
  const chartMenuKey = resolveDemoPackage(routeKey)?.route ?? demoPackages[0]?.route ?? 'line';
  const selectedKeys = ['chart', chartMenuKey];

  const toggleTheme = () => {
    setIsDark(prev => {
      const next = !prev;
      localStorage.setItem('so-chart-theme', next ? 'dark' : 'light');
      return next;
    });
  };

  useLayoutEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  useEffect(() => {
    if (!mobileNavOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMobileNavOpen(false);
    };
    const previousOverflow = document.body.style.overflow;

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileNavOpen]);

  useEffect(() => {
    if (location.pathname === '/') {
      navigate(getFirstDemoPath());
    }
  }, [navigate, location.pathname]);

  return (
    <ConfigProvider
      theme={{
        algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
      }}
    >
      <Layout className="so-chart-layout" style={{ minHeight: '100vh' }}>
        <Sider
          className={`so-chart-sider${mobileNavOpen ? ' so-chart-sider--open' : ''}`}
          width={220}
          theme={isDark ? 'dark' : 'light'}
          style={{
            position: 'fixed',
            height: '100vh',
            overflow: 'auto',
            zIndex: 1,
          }}
        >
          <div
            style={{
              padding: '16px',
              fontSize: '18px',
              fontWeight: 600,
              color: isDark ? '#fff' : '#001529',
              textAlign: 'center',
              borderBottom: `1px solid ${isDark ? '#303030' : '#e8e8e8'}`,
              marginBottom: 8,
            }}
          >
            so-chart
          </div>
          <Menu
            mode="inline"
            selectedKeys={selectedKeys}
            defaultOpenKeys={['chart']}
            style={{ borderRight: 0 }}
            items={menus}
            onClick={() => setMobileNavOpen(false)}
            onSelect={({ key }) => {
              const manifest = resolveDemoPackage(key);
              if (!manifest) return;

              navigate(`/chart/${manifest.route}`);
              setMobileNavOpen(false);
            }}
            theme={isDark ? 'dark' : 'light'}
          />
        </Sider>

        <div
          className={`so-chart-mobile-mask${mobileNavOpen ? ' so-chart-mobile-mask--open' : ''}`}
          aria-hidden={!mobileNavOpen}
          onClick={() => setMobileNavOpen(false)}
        />

        <Content
          className="so-chart-content"
          style={{
            marginLeft: 220,
            background: isDark ? '#000000' : '#f5f5f5',
            minHeight: '100vh',
          }}
        >
          <div
            className="so-chart-header"
            style={{
              padding: '16px 24px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: isDark ? '#141414' : '#fff',
              margin: '16px 16px 0 16px',
              borderRadius: 8,
              boxShadow: isDark ? '0 2px 8px rgba(0, 0, 0, 0.5)' : '0 2px 8px rgba(0, 0, 0, 0.08)',
            }}
          >
            <Button
              className="so-chart-menu-button"
              type="text"
              icon={<MenuOutlined />}
              aria-label="打开导航菜单"
              aria-expanded={mobileNavOpen}
              onClick={() => setMobileNavOpen(true)}
            />
            <h1
              className="so-chart-header-title"
              style={{
                margin: 0,
                fontSize: '20px',
                fontWeight: 600,
                color: isDark ? '#fff' : '#1d1d1d',
              }}
            >
              图表演示
            </h1>
            <Button
              className="so-chart-theme-button"
              icon={isDark ? <SunOutlined /> : <MoonOutlined />}
              aria-label={isDark ? '切换到浅色模式' : '切换到暗黑模式'}
              onClick={toggleTheme}
              size="large"
              style={{
                border: `1px solid ${isDark ? '#434343' : '#d9d9d9'}`,
              }}
            >
              <span className="so-chart-theme-label">{isDark ? '浅色模式' : '暗黑模式'}</span>
            </Button>
          </div>

          <div
            className="so-chart-page-container"
            style={{
              margin: '16px',
              padding: 24,
              background: isDark ? '#141414' : '#fff',
              borderRadius: 8,
              boxShadow: isDark ? '0 2px 8px rgba(0, 0, 0, 0.5)' : '0 2px 8px rgba(0, 0, 0, 0.08)',
            }}
          >
            <Outlet />
          </div>
        </Content>
      </Layout>
    </ConfigProvider>
  );
};

export default App;
