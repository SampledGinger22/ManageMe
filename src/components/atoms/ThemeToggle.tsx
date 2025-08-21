import React from 'react';
import { Switch } from 'antd';
import { MoonOutlined, SunOutlined } from '@ant-design/icons';
import { useTheme } from '@styles/ThemeProvider';

const ThemeToggle: React.FC = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <Switch
      checked={isDarkMode}
      onChange={toggleTheme}
      checkedChildren={<MoonOutlined />}
      unCheckedChildren={<SunOutlined />}
      style={{
        backgroundColor: isDarkMode ? 'var(--color-primary)' : 'var(--color-accent)',
      }}
    />
  );
};

export default ThemeToggle;