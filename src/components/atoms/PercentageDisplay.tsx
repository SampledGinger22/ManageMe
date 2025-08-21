import React from 'react';
import { Space, Typography } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined, MinusOutlined } from '@ant-design/icons';
import { useTheme } from '@styles/ThemeProvider';

const { Text } = Typography;

interface PercentageDisplayProps {
  value: number;
  precision?: number;
  showTrend?: boolean;
  trendValue?: number;
  label?: string;
  size?: 'small' | 'medium' | 'large';
}

const PercentageDisplay: React.FC<PercentageDisplayProps> = ({
  value,
  precision = 1,
  showTrend = false,
  trendValue,
  label,
  size = 'medium',
}) => {
  const { theme } = useTheme();

  const getFontSize = () => {
    switch (size) {
      case 'small':
        return theme.typography.small.fontSize;
      case 'large':
        return theme.typography.h3.fontSize;
      default:
        return theme.typography.base.fontSize;
    }
  };

  const getColor = () => {
    if (value > 0) return theme.colors.success;
    if (value < 0) return theme.colors.error;
    return theme.colors.textSecondary;
  };

  const getTrendIcon = () => {
    if (!showTrend || trendValue === undefined) return null;
    
    if (trendValue > 0) {
      return <ArrowUpOutlined style={{ fontSize: '12px', color: theme.colors.success }} />;
    } else if (trendValue < 0) {
      return <ArrowDownOutlined style={{ fontSize: '12px', color: theme.colors.error }} />;
    }
    return <MinusOutlined style={{ fontSize: '12px', color: theme.colors.textTertiary }} />;
  };

  const getTrendColor = () => {
    if (!trendValue) return theme.colors.textTertiary;
    return trendValue > 0 ? theme.colors.success : theme.colors.error;
  };

  return (
    <Space direction="vertical" size={0} style={{ lineHeight: 1.2 }}>
      {label && (
        <Text 
          style={{ 
            fontSize: theme.typography.small.fontSize,
            color: theme.colors.textSecondary,
          }}
        >
          {label}
        </Text>
      )}
      <Space size={4} align="center">
        <Text
          strong
          style={{
            fontSize: getFontSize(),
            color: getColor(),
            fontFeatureSettings: "'tnum'",
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {value >= 0 && '+'}
          {value.toFixed(precision)}%
        </Text>
        {showTrend && trendValue !== undefined && (
          <Space size={2} align="center">
            {getTrendIcon()}
            <Text
              style={{
                fontSize: theme.typography.small.fontSize,
                color: getTrendColor(),
              }}
            >
              {Math.abs(trendValue).toFixed(1)}%
            </Text>
          </Space>
        )}
      </Space>
    </Space>
  );
};

export default PercentageDisplay;