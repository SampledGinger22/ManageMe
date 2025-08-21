import React from 'react';
import { Typography } from 'antd';

const { Title } = Typography;

const TasksPage: React.FC = () => {
  return (
    <div>
      <Title level={2}>Tasks</Title>
      <p>Task management board coming soon...</p>
    </div>
  );
};

export default TasksPage;