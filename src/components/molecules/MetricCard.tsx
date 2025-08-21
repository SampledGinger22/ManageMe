import React from 'react';
import { Card, Statistic, Space, Typography, Tooltip } from 'antd';
import { 
  ArrowUpOutlined, 
  ArrowDownOutlined, 
  InfoCircleOutlined 
} from '@ant-design/icons';
import { useTheme } from '@styles/ThemeProvider';

const { Text } = Typography;

interface MetricCardProps {
  title: string;
  value: number | string;
  prefix?: React.ReactNode;
  suffix?: string;
  change?: {
    value: number;
    label: string;
  };
  info?: string;
  format?: 'number' | 'currency' | 'percentage';
  precision?: number;
  color?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  prefix,
  suffix,
  change,
  info,
  format = 'number',
  precision = 0,
  color,
}) => {
  const { theme } = useTheme();

  const formatValue = () => {
    if (typeof value === 'string') return value;
    
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: precision,
        }).format(value);
      case 'percentage':
        return `${value.toFixed(precision)}%`;
      default:
        return value.toLocaleString('en-US', {
          minimumFractionDigits: precision,
          maximumFractionDigits: precision,
        });
    }
  };

  const getChangeColor = () => {
    if (!change) return theme.colors.textSecondary;
    return change.value > 0 ? theme.colors.success : theme.colors.error;
  };

  const getChangeIcon = () => {
    if (!change) return null;
    return change.value > 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />;
  };

  return (
    <Card
      style={{
        height: '100%',
        backgroundColor: theme.colors.surface,
        borderColor: theme.colors.border,
        boxShadow: theme.shadows.sm,
      }}
      styles={{
        body: {
          padding: theme.spacing.md,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start',
        marginBottom: theme.spacing.xs,
      }}>
        <Text 
          style={{ 
            color: theme.colors.textSecondary,
            fontSize: theme.typography.small.fontSize,
            fontWeight: 500,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}
        >
          {title}
        </Text>
        {info && (
          <Tooltip title={info}>
            <InfoCircleOutlined 
              style={{ 
                color: theme.colors.textTertiary,
                fontSize: '14px',
                cursor: 'help',
              }} 
            />
          </Tooltip>
        )}
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Statistic
          value={formatValue()}
          prefix={prefix}
          suffix={suffix}
          valueStyle={{
            fontSize: '28px',
            fontWeight: 600,
            color: color || theme.colors.text,
            lineHeight: 1.2,
          }}
        />
      </div>

      {change && (
        <div style={{ 
          marginTop: theme.spacing.sm,
          paddingTop: theme.spacing.sm,
          borderTop: `1px solid ${theme.colors.borderLight}`,
        }}>
          <Space size={4} align="center">
            <Text style={{ 
              color: getChangeColor(),
              fontSize: theme.typography.small.fontSize,
              fontWeight: 500,
            }}>
              {getChangeIcon()}
              {Math.abs(change.value).toFixed(1)}%
            </Text>
            <Text style={{ 
              color: theme.colors.textTertiary,
              fontSize: theme.typography.small.fontSize,
            }}>
              {change.label}
            </Text>
          </Space>
        </div>
      )}
    </Card>
  );
};

export default MetricCard;