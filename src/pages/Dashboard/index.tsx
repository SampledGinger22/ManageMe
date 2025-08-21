import React, { useState } from 'react';
import { Row, Col, Card, Typography, Space, List, Avatar, Segmented } from 'antd';
import {
  UserOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  TeamOutlined,
  RiseOutlined,
  SmileOutlined,
  CalendarOutlined,
  FileTextOutlined,
  TrophyOutlined,
} from '@ant-design/icons';
import { 
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { useTheme } from '@styles/ThemeProvider';
import MetricCard from '@components/molecules/MetricCard';
import styles from './Dashboard.module.css';

const { Title, Text, Paragraph } = Typography;

// Mock data for charts
const taskData = [
  { name: 'Mon', completed: 4, created: 3 },
  { name: 'Tue', completed: 3, created: 5 },
  { name: 'Wed', completed: 5, created: 2 },
  { name: 'Thu', completed: 7, created: 4 },
  { name: 'Fri', completed: 6, created: 3 },
];

const taskStatusData = [
  { name: 'Backlog', value: 12, color: '#1677ff' },
  { name: 'In Progress', value: 8, color: '#52c41a' },
  { name: 'Review', value: 4, color: '#faad14' },
  { name: 'Done', value: 15, color: '#13c2c2' },
];

// Mock mood data for different time periods
const moodDataByPeriod = {
  week: [
    { label: 'Mon', mood: 4.2 },
    { label: 'Tue', mood: 4.0 },
    { label: 'Wed', mood: 4.5 },
    { label: 'Thu', mood: 3.8 },
    { label: 'Fri', mood: 4.3 },
    { label: 'Sat', mood: 4.6 },
    { label: 'Sun', mood: 4.4 },
  ],
  '30d': Array.from({ length: 30 }, (_, i) => ({
    label: `Day ${i + 1}`,
    mood: 3.5 + Math.random() * 1.5,
  })),
  '90d': Array.from({ length: 12 }, (_, i) => ({
    label: `Week ${i + 1}`,
    mood: 3.8 + Math.random() * 1.2,
  })),
  '6m': Array.from({ length: 6 }, (_, i) => ({
    label: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][i],
    mood: 4.0 + Math.random() * 0.8,
  })),
  '1y': Array.from({ length: 12 }, (_, i) => ({
    label: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
    mood: 3.9 + Math.random() * 1.0,
  })),
};

const recentActivity = [
  {
    type: 'task',
    action: 'Task completed',
    description: 'Fix login page responsive issues',
    user: 'Sarah Chen',
    time: '2 hours ago',
  },
  {
    type: 'person',
    action: 'Profile updated',
    description: 'Marcus Johnson updated skills',
    user: 'Marcus Johnson',
    time: '3 hours ago',
  },
  {
    type: 'meeting',
    action: 'Meeting scheduled',
    description: 'One-on-one with Yuki Tanaka',
    user: 'You',
    time: '5 hours ago',
  },
  {
    type: 'standup',
    action: 'Standup notes added',
    description: 'Daily standup for Engineering team',
    user: 'Emma Wilson',
    time: '1 day ago',
  },
];

const upcomingMeetings = [
  { title: 'One-on-one with Sarah', time: 'Today, 2:00 PM', person: 'Sarah Chen' },
  { title: 'Team Standup', time: 'Tomorrow, 10:00 AM', person: 'Engineering Team' },
  { title: 'Design Review', time: 'Tomorrow, 3:00 PM', person: 'Emma Wilson' },
  { title: 'Sprint Planning', time: 'Friday, 11:00 AM', person: 'All Teams' },
];

const DashboardPage: React.FC = () => {
  const { theme } = useTheme();
  const [moodTimeline, setMoodTimeline] = useState<'week' | '30d' | '90d' | '6m' | '1y'>('week');
  
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'task': return <CheckCircleOutlined style={{ color: theme.colors.success }} />;
      case 'person': return <UserOutlined style={{ color: theme.colors.primary }} />;
      case 'meeting': return <CalendarOutlined style={{ color: theme.colors.accent }} />;
      case 'standup': return <RiseOutlined style={{ color: theme.colors.warning }} />;
      default: return <FileTextOutlined style={{ color: theme.colors.textSecondary }} />;
    }
  };

  return (
    <div className={styles.dashboard}>
      <Title level={2} style={{ color: theme.colors.text }}>Dashboard</Title>
      <Paragraph style={{ color: theme.colors.textSecondary }}>
        Welcome back! Here's what's happening with your team today.
      </Paragraph>

      {/* Key Metrics */}
      <div className={styles.metricsGrid}>
        <MetricCard
          title="Team Members"
          value={5}
          prefix={<TeamOutlined />}
          change={{ value: 25, label: 'vs last month' }}
          info="Active team members in the system"
          color={theme.colors.primary}
        />
        <MetricCard
          title="Active Tasks"
          value={12}
          prefix={<CheckCircleOutlined />}
          change={{ value: -8, label: 'vs last week' }}
          info="Tasks currently in progress"
          color={theme.colors.success}
        />
        <MetricCard
          title="Overdue Tasks"
          value={3}
          prefix={<ClockCircleOutlined />}
          change={{ value: 50, label: 'vs last week' }}
          info="Tasks that need immediate attention"
          color={theme.colors.error}
        />
        <MetricCard
          title="Team Mood"
          value={4.2}
          suffix="/5"
          prefix={<SmileOutlined />}
          change={{ value: 5.2, label: 'vs last month' }}
          info="Average team satisfaction score"
          precision={1}
          color={theme.colors.warning}
        />
        <MetricCard
          title="Completed This Week"
          value={18}
          prefix={<TrophyOutlined />}
          change={{ value: 12, label: 'vs last week' }}
          info="Tasks completed in the current week"
          color={theme.colors.accent}
        />
        <MetricCard
          title="Meeting Hours"
          value={8.5}
          suffix="hrs"
          prefix={<CalendarOutlined />}
          change={{ value: -15, label: 'vs last week' }}
          info="Total meeting hours this week"
          precision={1}
        />
      </div>

      {/* Charts Row */}
      <Row gutter={[12, 12]} className={styles.charts}>
        <Col xs={24} lg={12}>
          <Card 
            title="Task Activity This Week"
            style={{
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
            }}
          >
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={taskData}>
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke={theme.colors.border}
                />
                <XAxis 
                  dataKey="name" 
                  stroke={theme.colors.textSecondary}
                />
                <YAxis 
                  stroke={theme.colors.textSecondary}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: theme.colors.surface,
                    border: `1px solid ${theme.colors.border}`,
                    borderRadius: theme.borderRadius.small,
                  }}
                />
                <Legend />
                <Area type="monotone" dataKey="completed" stackId="1" stroke={theme.colors.success} fill={theme.colors.success} fillOpacity={0.8} />
                <Area type="monotone" dataKey="created" stackId="1" stroke={theme.colors.primary} fill={theme.colors.primary} fillOpacity={0.8} />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card 
            title="Task Distribution"
            style={{
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
            }}
          >
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={taskStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name}: ${entry.value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {taskStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: theme.colors.surface,
                    border: `1px solid ${theme.colors.border}`,
                    borderRadius: theme.borderRadius.small,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* Team Mood Chart */}
      <Row gutter={[12, 12]} className={styles.moodChart}>
        <Col span={24}>
          <Card 
            title={
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Team Mood Trend</span>
                <Segmented
                  options={[
                    { label: '7 Days', value: 'week' },
                    { label: '30 Days', value: '30d' },
                    { label: '90 Days', value: '90d' },
                    { label: '6 Months', value: '6m' },
                    { label: '1 Year', value: '1y' },
                  ]}
                  value={moodTimeline}
                  onChange={(value) => setMoodTimeline(value as typeof moodTimeline)}
                  size="small"
                />
              </div>
            }
            style={{
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
            }}
          >
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={moodDataByPeriod[moodTimeline]}>
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke={theme.colors.border}
                />
                <XAxis 
                  dataKey="label" 
                  stroke={theme.colors.textSecondary}
                  tick={{ fontSize: 12 }}
                  interval={moodTimeline === '30d' ? 4 : moodTimeline === '90d' ? 2 : 0}
                />
                <YAxis 
                  domain={[0, 5]} 
                  stroke={theme.colors.textSecondary}
                  tick={{ fontSize: 12 }}
                  ticks={[0, 1, 2, 3, 4, 5]}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: theme.colors.surface,
                    border: `1px solid ${theme.colors.border}`,
                    borderRadius: theme.borderRadius.small,
                  }}
                  formatter={(value: number) => value.toFixed(2)}
                />
                <Line 
                  type="monotone" 
                  dataKey="mood" 
                  stroke={theme.colors.warning} 
                  strokeWidth={2}
                  dot={{ fill: theme.colors.warning, r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
            <div style={{ 
              marginTop: theme.spacing.md,
              paddingTop: theme.spacing.md,
              borderTop: `1px solid ${theme.colors.borderLight}`,
              display: 'flex',
              justifyContent: 'space-around',
              textAlign: 'center',
            }}>
              <div>
                <Text style={{ color: theme.colors.textSecondary, fontSize: '12px' }}>Average</Text>
                <div style={{ fontSize: '20px', fontWeight: 600, color: theme.colors.text }}>
                  {(moodDataByPeriod[moodTimeline].reduce((acc, curr) => acc + curr.mood, 0) / moodDataByPeriod[moodTimeline].length).toFixed(2)}
                </div>
              </div>
              <div>
                <Text style={{ color: theme.colors.textSecondary, fontSize: '12px' }}>Highest</Text>
                <div style={{ fontSize: '20px', fontWeight: 600, color: theme.colors.success }}>
                  {Math.max(...moodDataByPeriod[moodTimeline].map(d => d.mood)).toFixed(2)}
                </div>
              </div>
              <div>
                <Text style={{ color: theme.colors.textSecondary, fontSize: '12px' }}>Lowest</Text>
                <div style={{ fontSize: '20px', fontWeight: 600, color: theme.colors.error }}>
                  {Math.min(...moodDataByPeriod[moodTimeline].map(d => d.mood)).toFixed(2)}
                </div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Activity Feed and Upcoming Meetings */}
      <Row gutter={[12, 12]} className={styles.activity}>
        <Col xs={24} lg={12}>
          <Card 
            title="Recent Activity" 
            className={styles.activityCard}
            style={{
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
            }}
          >
            <List
              itemLayout="horizontal"
              dataSource={recentActivity}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={getActivityIcon(item.type)}
                    title={
                      <Space>
                        <Text strong style={{ color: theme.colors.text }}>{item.action}</Text>
                        <Text style={{ fontSize: 12, color: theme.colors.textTertiary }}>{item.time}</Text>
                      </Space>
                    }
                    description={
                      <Space direction="vertical" size={0}>
                        <Text style={{ color: theme.colors.textSecondary }}>{item.description}</Text>
                        <Text style={{ fontSize: 12, color: theme.colors.textTertiary }}>by {item.user}</Text>
                      </Space>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card 
            title="Upcoming One-on-Ones" 
            className={styles.meetingsCard}
            style={{
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
            }}
          >
            <List
              itemLayout="horizontal"
              dataSource={upcomingMeetings}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Avatar 
                        icon={<UserOutlined />} 
                        style={{ backgroundColor: theme.colors.primary }}
                      />
                    }
                    title={<Text style={{ color: theme.colors.text }}>{item.title}</Text>}
                    description={
                      <Space direction="vertical" size={0}>
                        <Text style={{ color: theme.colors.textTertiary }}>{item.time}</Text>
                        <Text style={{ color: theme.colors.textSecondary }}>{item.person}</Text>
                      </Space>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardPage;