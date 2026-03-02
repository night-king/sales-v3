import { useRole } from '@/hooks/use-role'
import { SalesDashboard } from './SalesDashboard'
import { SupportDashboard } from './SupportDashboard'
import { ManagerDashboard } from './ManagerDashboard'
import { AdminDashboard } from './AdminDashboard'

export default function DashboardPage() {
  const { currentRole } = useRole()

  switch (currentRole) {
    case 'sales':
      return <SalesDashboard />
    case 'support':
      return <SupportDashboard />
    case 'manager':
      return <ManagerDashboard />
    case 'admin':
      return <AdminDashboard />
  }
}
