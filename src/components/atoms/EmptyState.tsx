import React from 'react';
import { Empty, Button, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useTheme } from '@styles/ThemeProvider';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
  image?: React.ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No data',
  description = 'Get started by adding your first item',
  actionText,
  onAction,
  icon,
  image,
}) => {
  const { theme } = useTheme();

  return (
    <div
      style={{
        backgroundColor: theme.colors.backgroundSecondary,
        borderRadius: theme.borderRadius.large,
        padding: theme.spacing.xxl,
        textAlign: 'center',
        minHeight: '300px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Empty
        image={image || Empty.PRESENTED_IMAGE_SIMPLE}
        imageStyle={{
          height: 80,
          marginBottom: theme.spacing.md,
        }}
        description={
          <Space direction="vertical" size="small">
            <h3 
              style={{ 
                color: theme.colors.text,
                fontSize: theme.typography.h3.fontSize,
                fontWeight: theme.typography.h3.fontWeight,
                margin: 0,
              }}
            >
              {title}
            </h3>
            <p 
              style={{ 
                color: theme.colors.textSecondary,
                fontSize: theme.typography.base.fontSize,
                margin: 0,
              }}
            >
              {description}
            </p>
          </Space>
        }
      >
        {actionText && onAction && (
          <Button
            type="primary"
            icon={icon || <PlusOutlined />}
            onClick={onAction}
            size="large"
            style={{
              marginTop: theme.spacing.lg,
              backgroundColor: theme.colors.primary,
              borderColor: theme.colors.primary,
              borderRadius: theme.borderRadius.small,
              height: '40px',
              paddingLeft: theme.spacing.lg,
              paddingRight: theme.spacing.lg,
            }}
          >
            {actionText}
          </Button>
        )}
      </Empty>
    </div>
  );
};

export default EmptyState;