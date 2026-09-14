import React, { ReactNode } from 'react';
import theme from 'antd/es/theme';

interface ChartWrapperProps {
  children: ReactNode;
  title?: string;
  description?: string;
  height?: number | string;
  className?: string;
}

export function ChartWrapper({ children, title, description, height = 320, className }: ChartWrapperProps) {
  const { token } = theme.useToken();

  const containerStyle: React.CSSProperties = {
    background: token.colorBgContainer,
    borderRadius: '12px',
    padding: '24px',
    border: `1px solid ${token.colorBorderSecondary}`,
    marginBottom: '24px',
    boxShadow: token.boxShadowSecondary,
    minWidth: 0,
  };

  const titleStyle: React.CSSProperties = {
    margin: '0 0 8px 0',
    fontSize: '18px',
    fontWeight: 600,
    color: token.colorTextHeading,
  };

  const descStyle: React.CSSProperties = {
    margin: '0 0 16px 0',
    fontSize: '14px',
    color: token.colorTextSecondary,
  };

  const chartContainerStyle: React.CSSProperties = {
    height: typeof height === 'number' ? height : height,
    position: 'relative',
    overflow: 'hidden',
    minWidth: 0,
  };

  return (
    <div className={`chart-wrapper${className ? ` ${className}` : ''}`} style={containerStyle}>
      {(title || description) && (
        <div style={{ marginBottom: 16 }}>
          {title && <h3 style={titleStyle}>{title}</h3>}
          {description && <p style={descStyle}>{description}</p>}
        </div>
      )}
      <div className="chart-wrapper__chart" style={chartContainerStyle}>
        {children}
      </div>
    </div>
  );
}
