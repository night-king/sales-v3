import { useTranslation } from 'react-i18next'
import { mockUsers } from '@/data/users'
import { useAutomationStore } from '@/store/automation-store'
import { PageHeader } from '@/components/common/PageHeader'
import { StatCard } from '@/components/common/StatCard'
import { UserCircle, Zap, Activity, AlertTriangle } from 'lucide-react'

export function AdminDashboard() {
  const { t } = useTranslation()
  const rules = useAutomationStore((s) => s.rules)

  return (
    <div>
      <PageHeader title={t('menu:dashboard')} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title={t('dashboard.totalUsers')}
          value={mockUsers.length}
          icon={UserCircle}
        />
        <StatCard
          title={t('dashboard.activeRules')}
          value={rules.filter((r) => r.enabled).length}
          icon={Zap}
        />
        <StatCard
          title={t('dashboard.systemHealth')}
          value={t('dashboard.healthy')}
          icon={Activity}
        />
        <StatCard
          title={t('dashboard.deadLetterQueue')}
          value={3}
          icon={AlertTriangle}
        />
      </div>
    </div>
  )
}
