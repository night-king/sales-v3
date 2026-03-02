import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '@/store/auth-store'
import { useTicketStore } from '@/store/ticket-store'
import { PageHeader } from '@/components/common/PageHeader'
import { StatCard } from '@/components/common/StatCard'
import { Headset, Clock, CheckCircle, MessageSquare } from 'lucide-react'

export function SupportDashboard() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const currentUser = useAuthStore((s) => s.currentUser)
  const tickets = useTicketStore((s) => s.tickets)

  const userId = currentUser?.id ?? ''
  const myTickets = tickets.filter((t) => t.assignedTo === userId)
  const openTickets = myTickets.filter((t) => t.status === 'open').length
  const inProgressTickets = myTickets.filter((t) => t.status === 'in_progress').length
  const resolvedTickets = myTickets.filter((t) => t.status === 'resolved').length

  return (
    <div>
      <PageHeader title={t('menu:dashboard')} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title={t('dashboard.openTickets')}
          value={openTickets}
          icon={Headset}
          onClick={() => navigate('/ticket/my-tickets')}
        />
        <StatCard
          title={t('dashboard.inProgressTickets')}
          value={inProgressTickets}
          icon={Clock}
          onClick={() => navigate('/ticket/my-tickets')}
        />
        <StatCard
          title={t('dashboard.resolvedTickets')}
          value={resolvedTickets}
          icon={CheckCircle}
          onClick={() => navigate('/ticket/my-tickets')}
        />
        <StatCard
          title={t('dashboard.pendingConversations')}
          value={5}
          icon={MessageSquare}
          onClick={() => navigate('/communication')}
        />
      </div>
    </div>
  )
}
