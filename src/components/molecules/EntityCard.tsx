import React from 'react';
import { Card, Tag, Space, Typography, Progress, Statistic } from 'antd';
import { 
  UserOutlined, 
  TeamOutlined, 
  CalendarOutlined,
  CheckCircleOutlined,
  RiseOutlined,
  FallOutlined,
} from '@ant-design/icons';
import { useTheme } from '@styles/ThemeProvider';

const { Text, Title } = Typography;

interface EntityCardProps {
  type: 'person' | 'team' | 'task' | 'metric';
  title: string;
  subtitle?: string;
  metric?: {
    value: number;
    label: string;
    trend?: number;
    format?: 'percentage' | 'currency' | 'number';
  };
  tags?: string[];
  progress?: number;
  onClick?: () => void;
}

const EntityCard: React.FC<EntityCardProps> = ({
  type,
  title,
  subtitle,
  metric,
  tags,
  progress,
  onClick,
}) => {
  const { theme } = useTheme();

  const getIcon = () => {
    switch (type) {
      case 'person':
        return <UserOutlined style={{ color: theme.colors.primary }} />;
      case 'team':
        return <TeamOutlined style={{ color: theme.colors.accent }} />;
      case 'task':
        return <CheckCircleOutlined style={{ color: theme.colors.success }} />;
      case 'metric':
        return <CalendarOutlined style={{ color: theme.colors.warning }} />;
      default:
        return null;
    }
  };

  const formatMetricValue = (value: number, format?: string) => {
    switch (format) {
      case 'percentage':
        return `${value.toFixed(1)}%`;
      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 0,
        }).format(value);
      default:
        return value.toLocaleString();
    }
  };

  const getTrendIcon = (trend?: number) => {
    if (!trend) return null;
    return trend > 0 ? (
      <RiseOutlined style={{ color: theme.colors.success }} />
    ) : (
      <FallOutlined style={{ color: theme.colors.error }} />
    );
  };

  return (
    <Card
      hoverable={!!onClick}
      onClick={onClick}
      style={{
        borderRadius: theme.borderRadius.medium,
        boxShadow: theme.shadows.md,
        border: `1px solid ${theme.colors.border}`,
        background: theme.colors.surface,
        transition: 'all 0.3s ease',
        cursor: onClick ? 'pointer' : 'default',
      }}
      styles={{
        body: {
          padding: theme.spacing.sm,
        },
      }}
      onMouseEnter={(e) => {
        if (onClick) {
          e.currentTarget.style.boxShadow = theme.shadows.lg;
          e.currentTarget.style.transform = 'translateY(-2px)';
        }
      }}
      onMouseLeave={(e) => {
        if (onClick) {
          e.currentTarget.style.boxShadow = theme.shadows.md;
          e.currentTarget.style.transform = 'translateY(0)';
        }
      }}
    >
      <Space direction="vertical" style={{ width: '100%' }} size="small">
        <Space align="center">
          {getIcon()}
          <div>
            <Title 
              level={5} 
              style={{ 
                margin: 0, 
                color: theme.colors.text,
                fontSize: theme.typography.base.fontSize,
              }}
            >
              {title}
            </Title>
            {subtitle && (
              <Text 
                type="secondary" 
                style={{ 
                  fontSize: theme.typography.small.fontSize,
                  color: theme.colors.textSecondary,
                }}
              >
                {subtitle}
              </Text>
            )}
          </div>
        </Space>

        {metric && (
          <div style={{ marginTop: theme.spacing.sm }}>
            <Statistic
              value={formatMetricValue(metric.value, metric.format)}
              valueStyle={{
                fontSize: theme.typography.h3.fontSize,
                color: metric.trend && metric.trend > 0 
                  ? theme.colors.success 
                  : metric.trend && metric.trend < 0 
                  ? theme.colors.error 
                  : theme.colors.text,
              }}
              prefix={getTrendIcon(metric.trend)}
              suffix={
                metric.trend && (
                  <Text 
                    style={{ 
                      fontSize: theme.typography.small.fontSize,
                      color: metric.trend > 0 ? theme.colors.success : theme.colors.error,
                    }}
                  >
                    {Math.abs(metric.trend).toFixed(1)}%
                  </Text>
                )
              }
            />
            <Text 
              type="secondary" 
              style={{ 
                fontSize: theme.typography.small.fontSize,
                color: theme.colors.textTertiary,
              }}
            >
              {metric.label}
            </Text>
          </div>
        )}

        {progress !== undefined && (
          <Progress
            percent={progress}
            strokeColor={theme.colors.primary}
            trailColor={theme.colors.borderLight}
            style={{ marginTop: theme.spacing.sm }}
          />
        )}

        {tags && tags.length > 0 && (
          <Space wrap size={[4, 4]} style={{ marginTop: theme.spacing.sm }}>
            {tags.map((tag, index) => (
              <Tag
                key={index}
                style={{
                  borderRadius: theme.borderRadius.small,
                  border: `1px solid ${theme.colors.border}`,
                  background: theme.colors.backgroundSecondary,
                  color: theme.colors.textSecondary,
                }}
              >
                {tag}
              </Tag>
            ))}
          </Space>
        )}
      </Space>
    </Card>
  );
};

export default EntityCard;