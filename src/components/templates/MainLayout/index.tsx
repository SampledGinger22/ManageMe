import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu, Avatar, Dropdown, Space, Typography } from 'antd';
import {
  DashboardOutlined,
  TeamOutlined,
  CheckSquareOutlined,
  CalendarOutlined,
  BarChartOutlined,
  SettingOutlined,
  LogoutOutlined,
  UserOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  RiseOutlined,
  ExportOutlined,
} from '@ant-design/icons';
import { useAuthStore } from '@store/authStore';
import { useTheme } from '@styles/ThemeProvider';
import ThemeToggle from '@components/atoms/ThemeToggle';
import styles from './MainLayout.module.css';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

const MainLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const { theme, isDarkMode } = useTheme();
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: '/people',
      icon: <TeamOutlined />,
      label: 'People Vault',
    },
    {
      key: '/tasks',
      icon: <CheckSquareOutlined />,
      label: 'Tasks',
    },
    {
      key: '/scheduler',
      icon: <CalendarOutlined />,
      label: 'Meeting Scheduler',
    },
    {
      key: '/standups',
      icon: <RiseOutlined />,
      label: 'Standups',
    },
    {
      key: '/metrics',
      icon: <BarChartOutlined />,
      label: 'Metrics',
    },
    {
      key: '/export',
      icon: <ExportOutlined />,
      label: 'Export Center',
    },
    {
      key: '/settings',
      icon: <SettingOutlined />,
      label: 'Settings',
    },
  ];

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile',
      onClick: () => navigate('/settings'),
    },
    {
      type: 'divider' as const,
      key: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: handleLogout,
    },
  ];

  return (
    <Layout className={styles.layout}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        className={styles.sider}
        theme={isDarkMode ? 'dark' : 'light'}
        style={{
          backgroundColor: theme.colors.surface,
          borderRight: `1px solid ${theme.colors.border}`,
        }}
      >
        <div className={styles.logo}>
          {collapsed ? 'MP' : 'My People'}
        </div>
        <Menu
          theme={isDarkMode ? 'dark' : 'light'}
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={handleMenuClick}
          style={{
            backgroundColor: 'transparent',
            borderRight: 'none',
          }}
        />
      </Sider>
      
      <Layout>
        <Header 
          className={styles.header} 
          style={{ 
            background: theme.colors.surface,
            borderBottom: `1px solid ${theme.colors.border}`,
            boxShadow: theme.shadows.sm,
          }}
        >
          <div className={styles.headerLeft}>
            {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
              className: styles.trigger,
              onClick: () => setCollapsed(!collapsed),
              style: { color: theme.colors.text },
            })}
          </div>
          
          <div className={styles.headerRight}>
            <Space size="middle">
              <ThemeToggle />
              
              <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
                <Space className={styles.userInfo} style={{ cursor: 'pointer' }}>
                  <Avatar 
                    icon={<UserOutlined />} 
                    style={{ 
                      backgroundColor: theme.colors.primary,
                    }}
                  />
                  <Text style={{ color: theme.colors.text }}>{user?.username || 'User'}</Text>
                </Space>
              </Dropdown>
            </Space>
          </div>
        </Header>
        
        <Content 
          className={styles.content}
          style={{
            backgroundColor: theme.colors.background,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;