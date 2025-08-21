import React from 'react';
import { ConfigProvider, theme as antdTheme } from 'antd';
import { useTheme } from '@styles/ThemeProvider';

interface AntdThemeWrapperProps {
  children: React.ReactNode;
}

const AntdThemeWrapper: React.FC<AntdThemeWrapperProps> = ({ children }) => {
  const { isDarkMode, theme } = useTheme();

  return (
    <ConfigProvider
      theme={{
        algorithm: isDarkMode ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
        token: {
          colorPrimary: theme.colors.primary,
          colorSuccess: theme.colors.success,
          colorError: theme.colors.error,
          colorWarning: theme.colors.warning,
          colorInfo: theme.colors.accent,
          colorBgContainer: theme.colors.surface,
          colorBgElevated: theme.colors.surface,
          colorBgLayout: theme.colors.background,
          colorBgSpotlight: theme.colors.backgroundSecondary,
          colorBorder: theme.colors.border,
          colorBorderSecondary: theme.colors.borderLight,
          colorText: theme.colors.text,
          colorTextSecondary: theme.colors.textSecondary,
          colorTextTertiary: theme.colors.textTertiary,
          borderRadius: 8,
          fontFamily: theme.typography.fontFamily,
          fontSize: 14,
        },
        components: {
          Card: {
            colorBgContainer: theme.colors.surface,
            colorBorder: theme.colors.border,
            borderRadiusLG: 12,
            boxShadowTertiary: theme.shadows.md,
            paddingLG: 16,
            paddingContentHorizontalLG: 16,
          },
          Button: {
            borderRadius: 8,
          },
          Menu: {
            colorBgContainer: 'transparent',
            itemSelectedBg: isDarkMode ? 'rgba(22, 119, 255, 0.15)' : 'rgba(22, 119, 255, 0.08)',
            itemSelectedColor: theme.colors.primary,
            itemHoverBg: theme.colors.surfaceHover,
          },
          Layout: {
            headerBg: theme.colors.surface,
            bodyBg: theme.colors.background,
            triggerBg: theme.colors.surfaceHover,
            siderBg: theme.colors.surface,
          },
          List: {
            colorBorder: theme.colors.border,
            colorBgContainer: theme.colors.surface,
          },
          Statistic: {
            colorTextDescription: theme.colors.textSecondary,
          },
          Typography: {
            colorText: theme.colors.text,
            colorTextSecondary: theme.colors.textSecondary,
            colorTextTertiary: theme.colors.textTertiary,
            colorTextHeading: theme.colors.text,
            colorTextLabel: theme.colors.textSecondary,
            colorTextDescription: theme.colors.textTertiary,
          },
          Empty: {
            colorText: theme.colors.textSecondary,
            colorTextDisabled: theme.colors.textTertiary,
          },
          Tag: {
            colorBorder: theme.colors.border,
            colorBgContainer: theme.colors.backgroundSecondary,
            colorText: theme.colors.textSecondary,
          },
          Progress: {
            colorText: theme.colors.text,
          },
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
};

export default AntdThemeWrapper;