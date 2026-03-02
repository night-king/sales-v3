import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '@/store/auth-store'
import { useTaskStore } from '@/store/task-store'
import { useClientStore } from '@/store/client-store'
import { PageHeader } from '@/components/common/PageHeader'
import { StatCard } from '@/components/common/StatCard'
import { ClipboardList, Clock, CheckCircle, Users } from 'lucide-react'

export function SalesDashboard() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const currentUser = useAuthStore((s) => s.currentUser)
  const tasks = useTaskStore((s) => s.tasks)
  const clients = useClientStore((s) => s.clients)

  const userId = currentUser?.id ?? ''
  const myTasks = tasks.filter((t) => t.assignedTo === userId)
  const pendingTasks = myTasks.filter((t) => t.status === 'pending').length
  const inProgressTasks = myTasks.filter((t) => t.status === 'in_progress').length
  const completedTasks = myTasks.filter((t) => t.status === 'completed').length
  const myClients = clients.filter((c) => c.assignedTo === userId).length

  return (
    <div>
      <PageHeader title={t('menu:dashboard')} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title={t('dashboard.pendingTasks')}
          value={pendingTasks}
          icon={ClipboardList}
          onClick={() => navigate('/task/my-tasks')}
        />
        <StatCard
          title={t('dashboard.inProgressTasks')}
          value={inProgressTasks}
          icon={Clock}
          onClick={() => navigate('/task/my-tasks')}
        />
        <StatCard
          title={t('dashboard.completedTasks')}
          value={completedTasks}
          icon={CheckCircle}
          onClick={() => navigate('/task/my-tasks')}
        />
        <StatCard
          title={t('dashboard.myClients')}
          value={myClients}
          icon={Users}
          onClick={() => navigate('/client/my-clients')}
        />
      </div>
    </div>
  )
}
