import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import LoginPage from '@/pages/login/LoginPage'
import DashboardPage from '@/pages/dashboard/DashboardPage'

// Placeholder page component
function Placeholder({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-foreground">{title}</h2>
        <p className="text-muted-foreground mt-1 text-sm">Coming soon...</p>
      </div>
    </div>
  )
}

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
      { path: 'client/public-pool', element: <Placeholder title="Public Pool" /> },
      { path: 'client/list', element: <Placeholder title="Client List" /> },
      { path: 'client/my-clients', element: <Placeholder title="My Clients" /> },
      { path: 'client/:id', element: <Placeholder title="Client Detail" /> },
      // Task
      { path: 'task/my-tasks', element: <Placeholder title="My Tasks" /> },
      { path: 'task/pool', element: <Placeholder title="Task Pool" /> },
      { path: 'task/all', element: <Placeholder title="All Tasks" /> },
      // Ticket
      { path: 'ticket/my-tickets', element: <Placeholder title="My Tickets" /> },
      { path: 'ticket/all', element: <Placeholder title="All Tickets" /> },
      // IB
      { path: 'ib/my-deals', element: <Placeholder title="My IB Deals" /> },
      { path: 'ib/pending', element: <Placeholder title="Pending Approval" /> },
      { path: 'ib/all', element: <Placeholder title="All IB Deals" /> },
      // Communication
      { path: 'communication', element: <Placeholder title="Communication Center" /> },
      // Team
      { path: 'team/members', element: <Placeholder title="Team Members" /> },
      { path: 'team/groups', element: <Placeholder title="Groups" /> },
      // Automation
      { path: 'automation', element: <Placeholder title="Automation Rules" /> },
      // Performance
      { path: 'performance/my', element: <Placeholder title="My Performance" /> },
      { path: 'performance/team', element: <Placeholder title="Team Performance" /> },
      // Admin
      { path: 'user/list', element: <Placeholder title="User Management" /> },
      { path: 'role/list', element: <Placeholder title="Role Management" /> },
      { path: 'settings', element: <Placeholder title="System Settings" /> },
      { path: 'monitoring', element: <Placeholder title="System Monitoring" /> },
      // Profile
      { path: 'profile', element: <Placeholder title="User Profile" /> },
    ],
  },
])
