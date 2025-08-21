import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Input, Button, Card, message, Space, Typography, Checkbox } from 'antd';
import { UserOutlined, LockOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { authService } from '@services/auth';
import { useAuthStore } from '@store/authStore';
import { useTheme } from '@styles/ThemeProvider';
import ThemeToggle from '@components/atoms/ThemeToggle';
import styles from './Login.module.css';

const { Title, Text } = Typography;

interface LoginFormValues {
  username: string;
  password: string;
  remember: boolean;
}

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm<LoginFormValues>();

  const handleSubmit = async (values: LoginFormValues) => {
    setLoading(true);
    try {
      const user = await authService.login(values.username, values.password);
      
      if (user) {
        login(user);
        message.success('Login successful!');
        navigate('/dashboard');
      } else {
        message.error('Invalid username or password');
      }
    } catch (error) {
      console.error('Login error:', error);
      message.error('An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container} style={{ backgroundColor: theme.colors.background }}>
      <div className={styles.themeToggle}>
        <ThemeToggle />
      </div>
      
      <Card 
        className={styles.loginCard}
        style={{
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
          boxShadow: theme.shadows.lg,
        }}
      >
        <div className={styles.header}>
          <Title level={2} style={{ color: theme.colors.text }}>My People</Title>
          <Text style={{ color: theme.colors.textSecondary }}>People Management Platform</Text>
        </div>

        <Form
          form={form}
          name="login"
          onFinish={handleSubmit}
          autoComplete="off"
          layout="vertical"
          initialValues={{ remember: true }}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Please enter your username!' }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Username"
              size="large"
              autoFocus
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please enter your password!' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Password"
              size="large"
              iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
            />
          </Form.Item>

          <Form.Item>
            <Space className={styles.options}>
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>Remember me</Checkbox>
              </Form.Item>
            </Space>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={loading}
              block
            >
              Sign In
            </Button>
          </Form.Item>

          <div className={styles.footer}>
            <Text type="secondary">
              Don't have an account?{' '}
              <Link to="/register">Register now</Link>
            </Text>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default LoginPage;