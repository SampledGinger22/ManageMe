import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@styles/ThemeProvider';
import AntdThemeWrapper from '@components/AntdThemeWrapper';
import ProtectedRoute from '@components/ProtectedRoute';
import MainLayout from '@components/templates/MainLayout';
import '@styles/utilities.css';

// Pages
import LoginPage from '@pages/Login';
import RegisterPage from '@pages/Register';
import DashboardPage from '@pages/Dashboard';
import PeopleVaultPage from '@pages/PeopleVault';
import PersonDetailPage from '@pages/PersonDetail';
import TasksPage from '@pages/Tasks';
import SchedulerPage from '@pages/Scheduler';
import StandupsPage from '@pages/Standups';
import MetricsPage from '@pages/Metrics';
import ExportPage from '@pages/Export';
import SettingsPage from '@pages/Settings';

// Create a query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes
      retry: 1,
    },
  },
});

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AntdThemeWrapper>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Protected routes */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <MainLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="people" element={<PeopleVaultPage />} />
                <Route path="people/:id" element={<PersonDetailPage />} />
                <Route path="people/new" element={<PersonDetailPage />} />
                <Route path="people/:id/edit" element={<PersonDetailPage />} />
                <Route path="tasks" element={<TasksPage />} />
                <Route path="scheduler" element={<SchedulerPage />} />
                <Route path="standups" element={<StandupsPage />} />
                <Route path="metrics" element={<MetricsPage />} />
                <Route path="export" element={<ExportPage />} />
                <Route path="settings" element={<SettingsPage />} />
              </Route>

              {/* Catch all - redirect to dashboard */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </BrowserRouter>
        </QueryClientProvider>
      </AntdThemeWrapper>
    </ThemeProvider>
  );
};

export default App;