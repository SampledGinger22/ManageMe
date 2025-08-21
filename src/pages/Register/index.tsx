import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Input, Button, Card, message, Space, Typography, Progress, Alert } from 'antd';
import { UserOutlined, LockOutlined, EyeInvisibleOutlined, EyeTwoTone, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { authService } from '@services/auth';
import { useAuthStore } from '@store/authStore';
import { useTheme } from '@styles/ThemeProvider';
import ThemeToggle from '@components/atoms/ThemeToggle';
import styles from './Register.module.css';

const { Title, Text } = Typography;

interface RegisterFormValues {
  username: string;
  password: string;
  confirmPassword: string;
}

interface PasswordStrength {
  score: number;
  requirements: {
    length: boolean;
    uppercase: boolean;
    lowercase: boolean;
    number: boolean;
    special: boolean;
  };
}

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [hasExistingAdmin, setHasExistingAdmin] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({
    score: 0,
    requirements: {
      length: false,
      uppercase: false,
      lowercase: false,
      number: false,
      special: false,
    },
  });
  const [form] = Form.useForm<RegisterFormValues>();

  useEffect(() => {
    checkExistingAdmin();
  }, []);

  const checkExistingAdmin = async () => {
    const hasAdmin = await authService.hasAdminUser();
    setHasExistingAdmin(hasAdmin);
  };

  const calculatePasswordStrength = (password: string): PasswordStrength => {
    const requirements = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    const score = Object.values(requirements).filter(Boolean).length * 20;

    return { score, requirements };
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value;
    setPasswordStrength(calculatePasswordStrength(password));
  };

  const handleSubmit = async (values: RegisterFormValues) => {
    if (values.password !== values.confirmPassword) {
      message.error('Passwords do not match!');
      return;
    }

    setLoading(true);
    try {
      const user = await authService.register(values.username, values.password);
      
      if (user) {
        login(user);
        message.success('Registration successful! Welcome to ManageMe.');
        navigate('/dashboard');
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      if (error.message === 'Username already exists') {
        message.error('Username already exists. Please choose another.');
      } else {
        message.error('An error occurred during registration');
      }
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength.score <= 20) return '#ff4d4f';
    if (passwordStrength.score <= 40) return '#fa8c16';
    if (passwordStrength.score <= 60) return '#faad14';
    if (passwordStrength.score <= 80) return '#a0d911';
    return '#52c41a';
  };

  if (hasExistingAdmin) {
    return (
      <div className={styles.container} style={{ backgroundColor: theme.colors.background }}>
        <Card 
          className={styles.registerCard}
          style={{
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
            boxShadow: theme.shadows.lg,
          }}
        >
          <Alert
            message="Admin Already Exists"
            description="An admin user has already been created. Please login to continue."
            type="info"
            showIcon
            action={
              <Button type="primary" onClick={() => navigate('/login')}>
                Go to Login
              </Button>
            }
          />
        </Card>
      </div>
    );
  }

  return (
    <div className={styles.container} style={{ backgroundColor: theme.colors.background }}>
      <div className={styles.themeToggle}>
        <ThemeToggle />
      </div>
      <Card 
        className={styles.registerCard}
        style={{
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
          boxShadow: theme.shadows.lg,
        }}
      >
        <div className={styles.header}>
          <Title level={2} style={{ color: theme.colors.text }}>Create Admin Account</Title>
          <Text style={{ color: theme.colors.textSecondary }}>One-time setup for My People</Text>
        </div>

        <Form
          form={form}
          name="register"
          onFinish={handleSubmit}
          autoComplete="off"
          layout="vertical"
        >
          <Form.Item
            name="username"
            rules={[
              { required: true, message: 'Please enter a username!' },
              { min: 3, message: 'Username must be at least 3 characters' },
              { pattern: /^[a-zA-Z0-9_]+$/, message: 'Username can only contain letters, numbers, and underscores' },
            ]}
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
            rules={[
              { required: true, message: 'Please enter a password!' },
              { min: 8, message: 'Password must be at least 8 characters' },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Password"
              size="large"
              onChange={handlePasswordChange}
              iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
            />
          </Form.Item>

          {form.getFieldValue('password') && (
            <div className={styles.passwordStrength}>
              <Text type="secondary">Password Strength:</Text>
              <Progress
                percent={passwordStrength.score}
                strokeColor={getPasswordStrengthColor()}
                showInfo={false}
              />
              <Space direction="vertical" size="small" className={styles.requirements}>
                <Text type={passwordStrength.requirements.length ? 'success' : 'secondary'}>
                  {passwordStrength.requirements.length ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
                  {' '}At least 8 characters
                </Text>
                <Text type={passwordStrength.requirements.uppercase ? 'success' : 'secondary'}>
                  {passwordStrength.requirements.uppercase ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
                  {' '}One uppercase letter
                </Text>
                <Text type={passwordStrength.requirements.lowercase ? 'success' : 'secondary'}>
                  {passwordStrength.requirements.lowercase ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
                  {' '}One lowercase letter
                </Text>
                <Text type={passwordStrength.requirements.number ? 'success' : 'secondary'}>
                  {passwordStrength.requirements.number ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
                  {' '}One number
                </Text>
                <Text type={passwordStrength.requirements.special ? 'success' : 'secondary'}>
                  {passwordStrength.requirements.special ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
                  {' '}One special character
                </Text>
              </Space>
            </div>
          )}

          <Form.Item
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Please confirm your password!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Passwords do not match!'));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Confirm Password"
              size="large"
              iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={loading}
              block
            >
              Create Admin Account
            </Button>
          </Form.Item>

          <div className={styles.footer}>
            <Text type="secondary">
              Already have an account?{' '}
              <Link to="/login">Sign in</Link>
            </Text>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default RegisterPage;