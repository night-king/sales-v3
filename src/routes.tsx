import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import LoginPage from '@/pages/login/LoginPage'
import DashboardPage from '@/pages/dashboard/DashboardPage'
import PublicPoolPage from '@/pages/client/PublicPoolPage'
import ClientsPage from '@/pages/client/ClientsPage'
import MyClientsPage from '@/pages/client/MyClientsPage'
import ClientDetailPage from '@/pages/client/ClientDetailPage'
import MyTasksPage from '@/pages/task/MyTasksPage'
import TaskPoolPage from '@/pages/task/TaskPoolPage'
import AllTasksPage from '@/pages/task/AllTasksPage'
import MyTicketsPage from '@/pages/ticket/MyTicketsPage'
import AllTicketsPage from '@/pages/ticket/AllTicketsPage'
import MyIBDealsPage from '@/pages/ib/MyIBDealsPage'
import PendingApprovalPage from '@/pages/ib/PendingApprovalPage'
import AllIBDealsPage from '@/pages/ib/AllIBDealsPage'
import CommunicationPage from '@/pages/communication/CommunicationPage'
import TeamMembersPage from '@/pages/team/TeamMembersPage'
import GroupsPage from '@/pages/team/GroupsPage'
import AutomationPage from '@/pages/automation/AutomationPage'
import MyPerformancePage from '@/pages/performance/MyPerformancePage'
import TeamPerformancePage from '@/pages/performance/TeamPerformancePage'
import UserListPage from '@/pages/user/UserListPage'
import RoleListPage from '@/pages/role/RoleListPage'
import SystemSettingsPage from '@/pages/settings/SystemSettingsPage'
import SystemMonitoringPage from '@/pages/monitoring/SystemMonitoringPage'
import UserProfilePage from '@/pages/profile/UserProfilePage'

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: <DashboardPage /> },
      // Client
      { path: 'client/public-pool', element: <PublicPoolPage /> },
      { path: 'client/list', element: <ClientsPage /> },
      { path: 'client/my-clients', element: <MyClientsPage /> },
      { path: 'client/:id', element: <ClientDetailPage /> },
      // Task
      { path: 'task/my-tasks', element: <MyTasksPage /> },
      { path: 'task/pool', element: <TaskPoolPage /> },
      { path: 'task/all', element: <AllTasksPage /> },
      // Ticket
      { path: 'ticket/my-tickets', element: <MyTicketsPage /> },
      { path: 'ticket/all', element: <AllTicketsPage /> },
      // IB
      { path: 'ib/my-deals', element: <MyIBDealsPage /> },
      { path: 'ib/pending', element: <PendingApprovalPage /> },
      { path: 'ib/all', element: <AllIBDealsPage /> },
      // Communication
      { path: 'communication', element: <CommunicationPage /> },
      // Team
      { path: 'team/members', element: <TeamMembersPage /> },
      { path: 'team/groups', element: <GroupsPage /> },
      // Automation
      { path: 'automation', element: <AutomationPage /> },
      // Performance
      { path: 'performance/my', element: <MyPerformancePage /> },
      { path: 'performance/team', element: <TeamPerformancePage /> },
      // Admin
      { path: 'user/list', element: <UserListPage /> },
      { path: 'role/list', element: <RoleListPage /> },
      { path: 'settings', element: <SystemSettingsPage /> },
      { path: 'monitoring', element: <SystemMonitoringPage /> },
      // Profile
      { path: 'profile', element: <UserProfilePage /> },
    ],
  },
])
